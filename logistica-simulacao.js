import { DOMAINS, INTERVENTIONS, applyIntervention, getEmployeeSnapshot, getOrganizationSnapshot } from "/src/psychosocial-simulation.js";
import { ensureManagementCycle, getManagementCapacity, consumeManagementAction, closeManagementPeriod } from "/src/management-cycle.js";
import { evaluateEnterpriseOutcomes } from "/src/enterprise-outcomes.js";
import { SUPPLIERS, addOutsourcedWorker, contractSupplier, getContractPerformance, getRelationshipVisual, advanceWorkforcePeriod, updateCollectiveRepresentation, getWorkforceFinanceSnapshot } from "/src/workforce-relations.js";

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
let game = ensureManagementCycle(load());
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
  const finance = getWorkforceFinanceSnapshot(game, 3);
  $("cash-warning").textContent = finance.deficit ? "Déficit de caixa: replanejamento necessário" : finance.projectedDeficitPeriod ? `Atenção: projeção de déficit no período ${finance.projectedDeficitPeriod}` : "Caixa sob controle na projeção atual";
  $("cash-warning").classList.toggle("is-critical", finance.deficit);
  $("cash-warning").classList.toggle("is-warning", !finance.deficit && Boolean(finance.projectedDeficitPeriod));
  $("finance-summary").textContent = finance.activeContracts ? `${finance.activeContracts} contrato(s) ativo(s) · ${money(finance.recurringPerPeriod)} por período · saldo atual ${money(finance.budget)}` : "Sem contratos ativos. Novas contratações criarão compromissos recorrentes.";
  $("finance-forecast").innerHTML = finance.periods.map(item => `<li><span>Período ${item.period}</span><strong>${money(item.projectedBalance)}</strong></li>`).join("");
  $("team-score").textContent = org.score + "/100";
  $("team-mood").textContent = org.mood.emoji + " " + org.mood.label + " · indicador lúdico";
  $("team-count").textContent = org.employeeCount;
  $("alert-count").textContent = org.criticalAlerts;
  $("upgrade-count").textContent = game.history.length;
  $("period-count").textContent = String(game.period ?? 1);
  const capacity = getManagementCapacity(game);
  $("management-capacity").textContent = `${capacity.remaining} de ${capacity.capacity} decisões estratégicas disponíveis`;
  $("cycle-summary").textContent = `Período ${capacity.period}: ${capacity.used} decisão(ões) utilizada(s). Ações exigem priorização e revisão no ciclo seguinte.`;
  const cycleEvents = game.managementCycle?.lastClose?.events ?? [];
  const reviews = (game.managementCycle?.pendingReviews ?? []).filter(item => item.status === "due");
  $("cycle-events").innerHTML = [...cycleEvents.map(item => `<li><strong>${safe(item.title)}</strong><small>Período ${item.period} · ${safe(item.message)}</small></li>`), ...reviews.map(item => `<li><strong>Revisão pendente: ${safe(item.label)}</strong><small>Retome a decisão e registre o acompanhamento.</small></li>`)].join("") || '<li class="empty-history">Nenhum evento registrado neste ciclo.</li>';
  const enterprise = game.enterpriseOutcomes ?? { news: [], ending: null };
  $("news-feed").innerHTML = enterprise.news.slice(0, 5).map(item => `<article class="news-item ${item.severity}"><small>${safe(item.publication)} · período ${item.period}</small><strong>${safe(item.title)}</strong><p>${safe(item.body)}</p></article>`).join("") || '<p class="empty-history">Nenhuma notícia publicada. A redação acompanha os indicadores.</p>';
  $("game-over").hidden = !enterprise.ending;
  if (enterprise.ending) {
    $("game-over-title").textContent = enterprise.ending.title;
    $("game-over-description").textContent = enterprise.ending.description;
  }
  $("contract-cost").textContent = money((game.contractLedger ?? []).filter(entry => entry.period === (game.period ?? 1)).reduce((sum, entry) => sum + entry.amount, 0));

  $("map-workers").innerHTML = game.employees.map(e => {
    const s = getEmployeeSnapshot(e);
    const identity = getRelationshipVisual(e);
    return `<button class="map-worker ${identity.className}" type="button" data-worker="${safe(e.id)}" aria-pressed="${e.id === selectedId}" aria-label="Selecionar ${safe(e.name)} · ${identity.label}" style="left:${e.location.x}%;top:${e.location.y}%"><span class="head">${e.emoji}</span><span class="mood">${s.mood.emoji}</span><span class="worker-name">${safe(e.name)}</span></button>`;
  }).join("");
  $("employee-list").innerHTML = game.employees.map(e => {
    const s = getEmployeeSnapshot(e);
    const identity = getRelationshipVisual(e);
    return `<button class="employee-card ${identity.className}" type="button" data-worker="${safe(e.id)}" aria-pressed="${e.id === selectedId}"><span class="employee-top"><span class="avatar">${e.emoji}</span><span><strong>${safe(e.name)}</strong><small>${safe(e.role)}</small><small class="relationship-label">${identity.symbol} ${identity.label}</small></span></span><span class="card-score">${s.score}/100 · ${s.mood.emoji}</span></button>`;
  }).join("");

  const selected = employee(selectedId) || game.employees[0];
  if (selected) {
    const s = getEmployeeSnapshot(selected);
    const identity = getRelationshipVisual(selected);
    const alerts = s.criticalAlerts.length ? `<ul class="alert-list">${s.criticalAlerts.map(a => `<li><strong>Investigar:</strong> ${safe(a)}</li>`).join("")}</ul>` : '<p class="panel-note">Sem alertas críticos configurados neste cenário sintético. Isso não significa ausência de risco real.</p>';
    const bars = DOMAINS.map(d => {
      const v = s.scores[d.id], cls = v < 40 ? "very-low" : v < 60 ? "low" : "";
      return `<div class="domain-row"><div class="domain-meta"><span>${safe(d.label)}</span><strong>${v}/100</strong></div><div class="bar" role="img" aria-label="${safe(d.label)}: ${v} de 100"><span class="${cls}" style="width:${v}%"></span></div></div>`;
    }).join("");
    $("employee-detail").innerHTML = `<div class="profile-top"><div class="profile-avatar">${selected.emoji}</div><div><h3>${safe(selected.name)}</h3><p>${safe(selected.role)} · ${identity.label}</p></div><div class="profile-score"><strong>${s.score}</strong><small>/100 · ${s.mood.emoji}</small></div></div>${alerts}<div class="domain-list">${bars}</div><p class="panel-note">Scores fictícios para aprendizagem. Investigue as condições de trabalho; não classifique nem culpe pessoas.</p>`;
  }

  const supplierCards = SUPPLIERS.map(supplier => {
    const contract = game.contracts?.find(c => c.supplierId === supplier.id && c.active);
    const performance = getContractPerformance(supplier.id);
    return `<article class="supplier-card supplier-${supplier.color}"><div class="supplier-head"><strong>${safe(supplier.name)}</strong><span>${money(supplier.monthlyCost)}/mês</span></div><p>${safe(supplier.scope)} · até ${supplier.capacity} profissionais</p><div class="supplier-metrics"><span>Qualidade ${supplier.quality}</span><span>Continuidade ${supplier.continuity}</span><span>Segurança ${supplier.safety}</span><span>Desempenho ${performance.performance}/100</span></div><button class="apply-btn" type="button" data-supplier="${supplier.id}">${contract ? "Alocar profissional" : "Contratar fornecedor"}</button></article>`;
  }).join("");
  $("supplier-list").innerHTML = supplierCards;
  const collective = game.collectiveRepresentation ?? { organized: false, representatives: 0, agenda: [] };
  $("collective-status").textContent = collective.organized ? "Representação coletiva ativa" : "Representação coletiva ainda não organizada";
  $("collective-count").textContent = String(collective.representatives);
  $("collective-agenda").textContent = collective.agenda.length ? collective.agenda.join(" · ") : "Nenhuma pauta registrada";
  $("collective-toggle").textContent = collective.organized ? "Suspender organização simulada" : "Organizar representação coletiva";
  $("contract-history").innerHTML = (game.contractLedger ?? []).slice(-8).reverse().map(entry => `<li><strong>${safe(entry.supplierId)}</strong><small>Período ${entry.period} · ${entry.type === "activation" ? "Ativação" : "Recorrência"} · ${money(entry.amount)}</small></li>`).join("") || "<li class=\"empty-history\">Nenhum lançamento contratual.</li>";

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
  if (event.target.closest("#collective-toggle")) {
    const current = game.collectiveRepresentation ?? { organized: false, representatives: 0, agenda: [] };
    game = updateCollectiveRepresentation(game, { organized: !current.organized, representatives: current.organized ? 0 : 2, agenda: current.organized ? [] : ["Pausas e recuperação", "Segurança e prevenção", "Comunicação e respeito"] });
    render(); toast(game.collectiveRepresentation.organized ? "Representação coletiva organizada. Nenhuma filiação individual foi exposta." : "Organização coletiva desativada."); return;
  }
  if (event.target.closest("#advance-period")) {
    const org = getOrganizationSnapshot(game);
    const minimumSafety = Math.min(...game.employees.map(person => Number(person.scores?.safetyConditions ?? 100)));
    const lowRecoveryCount = game.employees.filter(person => Number(person.scores?.recovery ?? 100) < 45).length;
    const cycleResult = closeManagementPeriod(game, { score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety, lowRecoveryCount });
    const financial = getWorkforceFinanceSnapshot(cycleResult.state, 1);
    const outcome = evaluateEnterpriseOutcomes(cycleResult.state, { score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety, budget: cycleResult.state.budget, activeContracts: financial.activeContracts, period: cycleResult.closedPeriod });
    const result = advanceWorkforcePeriod(outcome.state);
    game = result.state; render(); toast(outcome.ending ? `Game over: ${outcome.ending.title}` : `Período ${cycleResult.closedPeriod} fechado. ${cycleResult.events.length} evento(s) para revisão.`); return;
  }
  const supplierButton = event.target.closest("[data-supplier]");
  if (supplierButton) {
    const supplierId = supplierButton.dataset.supplier;
    const active = game.contracts?.some(c => c.supplierId === supplierId && c.active);
    if (!active) {
      const result = contractSupplier(game, supplierId);
      if (!result.ok) { toast(result.reason); return; }
      game = result.state; render(); toast("Contrato registrado. Custos recorrentes são acompanhados por período.");
    } else {
      const count = game.employees.filter(person => person.supplierId === supplierId).length;
      const supplier = SUPPLIERS.find(item => item.id === supplierId);
      const result = addOutsourcedWorker(game, supplierId, {
        id: `${supplierId}-${count + 1}`, name: `Profissional ${count + 1}`,
        role: supplier.scope, emoji: "🦺",
        location: { x: 18 + count * 12, y: 76 },
        scores: { physicalHealth: 65, emotionalWellbeing: 62, socialSupport: 58, jobSatisfaction: 60, safetyConditions: 66, recovery: 57 },
        criticalAlerts: []
      });
      if (!result.ok) { toast(result.reason); return; }
      game = result.state; selectedId = result.worker.id; render(); toast("Profissional terceirizado alocado ao cenário.");
    }
    return;
  }
  const person = event.target.closest("[data-worker]");
  if (person) { selectedId = person.dataset.worker; render(); return; }
  const button = event.target.closest("[data-apply]");
  if (!button) return;
  const id = button.dataset.apply;
  const target = document.querySelector(`[data-target="${CSS.escape(id)}"]`)?.value || "team";
  const action = consumeManagementAction(game, { id, label: INTERVENTIONS.find(item => item.id === id)?.name });
  if (!action.ok) { toast(action.reason); return; }
  const result = applyIntervention(action.state, id, target === "team" ? {} : { employeeId: target });
  if (!result.ok) { toast(result.reason); return; }
  game = result.state;
  if (result.event.employeeId) selectedId = result.event.employeeId;
  render(); toast(result.note);
});
$("reset-game").addEventListener("click", () => { game = fresh(); selectedId = game.employees[0].id; render(); toast("Simulação reiniciada."); });
render();
