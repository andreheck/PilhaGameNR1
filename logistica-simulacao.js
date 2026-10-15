import { DOMAINS, INTERVENTIONS, applyIntervention, getEmployeeSnapshot, getOrganizationSnapshot } from "/src/psychosocial-simulation.js";

const KEY = "pilha-logistica-simulation-v1";
const fresh = () => ({
  budget: 8000,
  environment: { id: "logistica-alpha", name: "Galpão logístico", upgrades: [] },
  employees: [
    { id: "joana", name: "Joana", role: "Operadora de separação", emoji: "👷🏽‍♀️", location: { x: 23, y: 61 }, scores: { physicalHealth: 68, emotionalWellbeing: 42, socialSupport: 61, jobSatisfaction: 39, safetyConditions: 54, recovery: 36 }, criticalAlerts: ["Jornada e recuperação insuficientes a investigar"] },
    { id: "marcos", name: "Marcos", role: "Conferente", emoji: "🧑🏽‍🔧", location: { x: 49, y: 57 }, scores: { physicalHealth: 57, emotionalWellbeing: 55, socialSupport: 64, jobSatisfaction: 51, safetyConditions: 63, recovery: 46 }, criticalAlerts: [] },
    { id: "carla", name: "Carla", role: "Supervisora", emoji: "👩🏽‍💼", location: { x: 72, y: 48 }, scores: { physicalHealth: 74, emotionalWellbeing: 58, socialSupport: 43, jobSatisfaction: 48, safetyConditions: 71, recovery: 52 }, criticalAlerts: ["Apoio e comunicação da liderança a investigar"] },
    { id: "diego", name: "Diego", role: "Expedição", emoji: "🦺", location: { x: 80, y: 72 }, scores: { physicalHealth: 62, emotionalWellbeing: 49, socialSupport: 57, jobSatisfaction: 45, safetyConditions: 58, recovery: 41 }, criticalAlerts: [] }
  ],
  history: []
});
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved?.environment?.id === "logistica-alpha" && Array.isArray(saved.employees)) return saved;
  } catch {}
  return fresh();
}
let game = load();
let selectedId = game.employees[0]?.id;
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);
const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
let toastTimeout;
function toast(text) {
  const node = $("toast"); node.textContent = text; node.classList.add("show");
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => node.classList.remove("show"), 2800);
}
function employee(id) { return game.employees.find(e => e.id === id); }
function render() {
  const org = getOrganizationSnapshot(game);
  $("budget").textContent = money(game.budget);
  $("team-score").textContent = org.score + "/100";
  $("team-mood").textContent = org.mood.emoji + " " + org.mood.label + " · indicador lúdico";
  $("team-count").textContent = org.employeeCount;
  $("alert-count").textContent = org.criticalAlerts;
  $("upgrade-count").textContent = game.history.length;

  $("map-workers").innerHTML = game.employees.map(e => {
    const s = getEmployeeSnapshot(e);
    return `<button class="map-worker" type="button" data-worker="${safe(e.id)}" aria-pressed="${e.id === selectedId}" aria-label="Selecionar ${safe(e.name)}" style="left:${e.location.x}%;top:${e.location.y}%"><span class="head">${e.emoji}</span><span class="mood">${s.mood.emoji}</span><span class="worker-name">${safe(e.name)}</span></button>`;
  }).join("");
  $("employee-list").innerHTML = game.employees.map(e => {
    const s = getEmployeeSnapshot(e);
    return `<button class="employee-card" type="button" data-worker="${safe(e.id)}" aria-pressed="${e.id === selectedId}"><span class="employee-top"><span class="avatar">${e.emoji}</span><span><strong>${safe(e.name)}</strong><small>${safe(e.role)}</small></span></span><span class="card-score">${s.score}/100 · ${s.mood.emoji}</span></button>`;
  }).join("");

  const selected = employee(selectedId) || game.employees[0];
  if (selected) {
    const s = getEmployeeSnapshot(selected);
    const alerts = s.criticalAlerts.length ? `<ul class="alert-list">${s.criticalAlerts.map(a => `<li><strong>Investigar:</strong> ${safe(a)}</li>`).join("")}</ul>` : '<p class="panel-note">Sem alertas críticos configurados neste cenário sintético. Isso não significa ausência de risco real.</p>';
    const bars = DOMAINS.map(d => {
      const v = s.scores[d.id], cls = v < 40 ? "very-low" : v < 60 ? "low" : "";
      return `<div class="domain-row"><div class="domain-meta"><span>${safe(d.label)}</span><strong>${v}/100</strong></div><div class="bar" role="img" aria-label="${safe(d.label)}: ${v} de 100"><span class="${cls}" style="width:${v}%"></span></div></div>`;
    }).join("");
    $("employee-detail").innerHTML = `<div class="profile-top"><div class="profile-avatar">${selected.emoji}</div><div><h3>${safe(selected.name)}</h3><p>${safe(selected.role)}</p></div><div class="profile-score"><strong>${s.score}</strong><small>/100 · ${s.mood.emoji}</small></div></div>${alerts}<div class="domain-list">${bars}</div><p class="panel-note">Scores fictícios para aprendizagem. Investigue as condições de trabalho; não classifique nem culpe pessoas.</p>`;
  }

  const targets = `<option value="team">Aplicar à equipe</option>${game.employees.map(e => `<option value="${safe(e.id)}" ${e.id === selectedId ? "selected" : ""}>${safe(e.name)}</option>`).join("")}`;
  $("intervention-list").innerHTML = INTERVENTIONS.map(item => {
    const effects = Object.entries(item.effects).map(([id,n]) => `<span class="effect-chip">${safe(DOMAINS.find(d => d.id === id)?.label || id)} +${n}</span>`).join("");
    return `<article class="intervention"><div class="intervention-head"><div><span class="category">${safe(item.category)}</span><h3>${safe(item.name)}</h3></div><span class="price">${money(item.cost)}</span></div><p>${safe(item.explanation)}</p><div class="effects">${effects}</div><div class="apply-row"><label class="sr-only" for="target-${safe(item.id)}">Aplicar intervenção a</label><select class="target-select" id="target-${safe(item.id)}" data-target="${safe(item.id)}">${targets}</select><button class="apply-btn" type="button" data-apply="${safe(item.id)}" ${game.budget < item.cost ? "disabled" : ""}>Aplicar</button></div></article>`;
  }).join("");

  const history = [...game.history].reverse();
  $("history").innerHTML = history.length ? history.map(ev => `<li><strong>${safe(ev.name)}</strong><small>${money(ev.cost)} · ${ev.employeeId ? "ação individual" : "equipe"} · ${ev.changedEmployees} personagem(ns)</small><small>${safe(ev.explanation)}</small></li>`).join("") : '<li class="empty-history">Nenhuma intervenção aplicada nesta sessão.</li>';
  try { localStorage.setItem(KEY, JSON.stringify(game)); } catch {}
}
document.addEventListener("click", event => {
  const person = event.target.closest("[data-worker]");
  if (person) { selectedId = person.dataset.worker; render(); return; }
  const button = event.target.closest("[data-apply]");
  if (!button) return;
  const id = button.dataset.apply;
  const target = document.querySelector(`[data-target="${CSS.escape(id)}"]`)?.value || "team";
  const result = applyIntervention(game, id, target === "team" ? {} : { employeeId: target });
  if (!result.ok) { toast(result.reason); return; }
  game = result.state;
  if (result.event.employeeId) selectedId = result.event.employeeId;
  render(); toast(result.note);
});
$("reset-game").addEventListener("click", () => { game = fresh(); selectedId = game.employees[0].id; render(); toast("Simulação reiniciada."); });
render();
