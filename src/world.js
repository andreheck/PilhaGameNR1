// PilhA+ Game — mapa lógico. Sem dependências, DOM ou dados reais.
export const WORLD = Object.freeze({
  columns: 13, rows: 10, tileWidth: 70, tileHeight: 36,
  centerX: 478, originY: 113, canvasWidth: 980, canvasHeight: 600,
  spawn: { x: 6, y: 5 }
});
export const OBSTACLES = Object.freeze([
  { x: 2, y: 2, type: "mesa" }, { x: 3, y: 2, type: "mesa" },
  { x: 2, y: 3, type: "arquivo" }, { x: 4, y: 1, type: "monitor" },
  { x: 9, y: 1, type: "mesa" }, { x: 9, y: 2, type: "mesa" },
  { x: 11, y: 3, type: "planta" },
  { x: 2, y: 7, type: "caixas" }, { x: 3, y: 7, type: "caixas" },
  { x: 2, y: 8, type: "estante" }, { x: 5, y: 8, type: "caixas" },
  { x: 9, y: 6, type: "mesa" }, { x: 10, y: 6, type: "mesa" },
  { x: 9, y: 7, type: "quadro" }, { x: 11, y: 7, type: "planta" }
]);
export const NPCS = Object.freeze([
  { id: "joana", name: "Joana", title: "Operadora logística", x: 1, y: 7, color: "#ed8c37", skin: "#9a583d", evidence: "sobrecarga", region: "Operação" },
  { id: "carla", name: "Carla", title: "Supervisora", x: 4, y: 7, color: "#ed8c37", skin: "#bf7c53", evidence: "metas", region: "Operação" },
  { id: "renata", name: "Renata", title: "Profissional SST", x: 8, y: 3, color: "#6da998", skin: "#754b3d", evidence: "jornada", region: "Investigação" },
  { id: "marina", name: "Marina", title: "Analista de RH", x: 10, y: 2, color: "#567cbd", skin: "#b8765a", evidence: "clima", region: "Investigação" },
  { id: "ana", name: "Ana", title: "Psicóloga", x: 7, y: 8, color: "#719985", skin: "#8c513d", evidence: null, region: "Cuidado" },
  { id: "vitor", name: "Vítor", title: "Psiquiatra", x: 11, y: 8, color: "#a1bacb", skin: "#9e684d", evidence: null, region: "Cuidado" }
]);
const keys = new Set(OBSTACLES.map(o => o.x + "," + o.y));
const npcKeys = new Set(NPCS.map(o => o.x + "," + o.y));
export function inside(x, y) { return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < WORLD.columns && y < WORLD.rows; }
export function blocked(x, y, includeNpcs = true) { return !inside(x, y) || keys.has(x + "," + y) || (includeNpcs && npcKeys.has(x + "," + y)); }
export function project(x, y) {
  return { x: WORLD.centerX + (x - y) * WORLD.tileWidth / 2, y: WORLD.originY + (x + y) * WORLD.tileHeight / 2 };
}
export function unproject(screenX, screenY) {
  const d = (screenX - WORLD.centerX) / (WORLD.tileWidth / 2);
  const s = (screenY - WORLD.originY) / (WORLD.tileHeight / 2);
  return { x: Math.round((s + d) / 2), y: Math.round((s - d) / 2) };
}
export function neighbors(pos) {
  return [[1,0],[-1,0],[0,1],[0,-1]]
    .map(([dx, dy]) => ({ x: pos.x + dx, y: pos.y + dy }))
    .filter(p => !blocked(p.x, p.y));
}
const keyOf = p => p.x + "," + p.y;
export function findPath(start, goal) {
  if (blocked(goal.x, goal.y) || !inside(start.x, start.y)) return null;
  if (start.x === goal.x && start.y === goal.y) return [];
  const queue = [start], from = new Map([[keyOf(start), null]]);
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    if (p.x === goal.x && p.y === goal.y) {
      const path = []; let k = keyOf(p);
      while (k !== keyOf(start)) {
        const [x,y] = k.split(",").map(Number);
        path.unshift({ x, y }); k = from.get(k);
      }
      return path;
    }
    for (const n of neighbors(p)) {
      const k = keyOf(n);
      if (!from.has(k)) { from.set(k, keyOf(p)); queue.push(n); }
    }
  }
  return null;
}
export function pathToNpc(start, npc) {
  const candidates = [[1,0],[-1,0],[0,1],[0,-1]]
    .map(([dx,dy]) => ({ x: npc.x + dx, y: npc.y + dy }))
    .filter(p => !blocked(p.x,p.y));
  const possible = candidates.map(goal => findPath(start,goal)).filter(p => p !== null);
  possible.sort((a,b) => a.length - b.length);
  return possible[0] ?? null;
}
export function regionOf(x, y) {
  if (x < 7 && y < 5) return "Central de Riscos";
  if (x >= 7 && y < 5) return "Escuta e Investigação";
  if (x < 7) return "Operação Logística";
  return "Planejamento e Apoio";
}
