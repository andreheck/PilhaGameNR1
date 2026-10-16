/** Deterministic synthetic behavior state machine for office actors. */
export const ACTOR_STATES = Object.freeze({
  idle: { label: "Parado", min: 2, max: 5, animation: "idle", visual: "neutral" },
  working: { label: "Trabalhando", min: 5, max: 12, animation: "work", visual: "focused" },
  exploring: { label: "Explorando", min: 3, max: 7, animation: "walk", visual: "moving" },
  talking: { label: "Conversando", min: 4, max: 9, animation: "talk", visual: "social" },
  resting: { label: "Pausando", min: 5, max: 10, animation: "idle", visual: "rest" },
  worried: { label: "Preocupado", min: 4, max: 8, animation: "worried", visual: "attention" }
});

const BASE = ["working", "exploring", "talking", "resting", "idle"];
export function createActorBrain({ id, home, seed = 1 }) {
  if (!id || !home || !Number.isFinite(home.x) || !Number.isFinite(home.z)) throw new TypeError("id e posição home válidos são obrigatórios");
  return { id, home: { x: home.x, z: home.z }, state: "idle", elapsed: 0, duration: 3, route: [], routeIndex: 0, seed: seed >>> 0, risk: 0, lastEvent: "Entrou na rotina", previousState: null };
}
function random(brain) {
  brain.seed = (1664525 * brain.seed + 1013904223) >>> 0;
  return brain.seed / 4294967296;
}
export function setActorRisk(brain, risk) {
  brain.risk = Math.max(0, Math.min(100, Number(risk) || 0));
  if (brain.risk >= 70 && brain.state !== "worried") {
    brain.previousState = brain.state; brain.state = "worried"; brain.elapsed = 0; brain.duration = 6; brain.lastEvent = "Sinal de atenção: revisar condições de trabalho";
  }
  return brain;
}
export function transitionActor(brain, state, route = []) {
  if (!ACTOR_STATES[state]) throw new RangeError("Estado de personagem desconhecido");
  brain.state = state; brain.elapsed = 0;
  const spec = ACTOR_STATES[state];
  brain.duration = spec.min + random(brain) * (spec.max - spec.min);
  brain.route = route.filter(p => Number.isFinite(p.x) && Number.isFinite(p.z)).map(p => ({x:p.x,z:p.z}));
  brain.routeIndex = 0; brain.lastEvent = spec.label;
  return brain;
}
export function tickActor(brain, deltaSeconds, routes = {}) {
  const dt = Math.max(0, Math.min(0.25, Number(deltaSeconds) || 0));
  brain.elapsed += dt;
  if (brain.state === "worried" && brain.risk < 70 && brain.elapsed >= brain.duration) {
    return transitionActor(brain, brain.previousState || "working");
  }
  if (brain.elapsed < brain.duration) return null;
  if (brain.state === "exploring") {
    brain.routeIndex = brain.routeIndex < brain.route.length - 1 ? brain.routeIndex + 1 : 0;
    if (brain.route.length) { brain.elapsed = 0; brain.duration = 3 + random(brain) * 2; return { type: "waypoint", target: brain.route[brain.routeIndex] }; }
  }
  const options = brain.risk >= 50 ? ["resting", "talking", "worried", "working"] : BASE;
  const next = options[Math.floor(random(brain) * options.length)];
  const route = routes[next] || [];
  transitionActor(brain, next, route);
  return { type: "state", state: next, label: ACTOR_STATES[next].label };
}
export function isWalkable(point, bounds, obstacles = [], radius = 0.22) {
  if (!point || point.x < bounds.minX + radius || point.x > bounds.maxX - radius || point.z < bounds.minZ + radius || point.z > bounds.maxZ - radius) return false;
  return !obstacles.some(o => point.x + radius > o.minX && point.x - radius < o.maxX && point.z + radius > o.minZ && point.z - radius < o.maxZ);
}
export function moveWithCollision(position, target, bounds, obstacles = [], speed = 1.2, dt = 1/60, radius = 0.22) {
  const dx = target.x-position.x, dz = target.z-position.z, distance = Math.hypot(dx,dz);
  if (distance < 0.001) return { ...position };
  const step = Math.min(distance, Math.max(0, speed*dt));
  const next = {x:position.x+dx/distance*step,z:position.z+dz/distance*step};
  if (isWalkable(next,bounds,obstacles,radius)) return next;
  const xOnly={x:next.x,z:position.z},zOnly={x:position.x,z:next.z};
  if (isWalkable(xOnly,bounds,obstacles,radius)) return xOnly;
  if (isWalkable(zOnly,bounds,obstacles,radius)) return zOnly;
  return { ...position };
}
