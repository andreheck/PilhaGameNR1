import { DOMAINS, INTERVENTIONS, applyIntervention, getEmployeeSnapshot, getOrganizationSnapshot } from "/src/psychosocial-simulation.js";
import { ensureManagementCycle, getManagementCapacity, consumeManagementAction, closeManagementPeriod, resolveManagementReview } from "/src/management-cycle.js";
import { evaluateEnterpriseOutcomes } from "/src/enterprise-outcomes.js";
import { ensureGovernanceState, recordManagerDeparture, appointSuccessor, applyDepartmentImpact, createCipa, recordCipaMemberExit, subsidizeCipaDepartment, getGovernanceInterventionCost } from "/src/organizational-governance.js";
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
let game = ensureGovernanceState(ensureManagementCycle(load()));
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
  const pendingReviews = (game.managementCycle?.pendingReviews ?? []).filter(item => item.status === "pending" || item.status === "due");
  const reviewMarkup = pendingReviews.map(item => `<li class="review-item"><strong>${item.status === "due" ? "Revisão vencida" : "Revisão agendada"}: ${safe(item.label)}</strong><small>${item.status === "due" ? "Verifique os efeitos da decisão e registre o resultado." : `Retorno previsto para o período ${item.duePeriod}.`}</small>${item.status === "due" ? `<div class="review-actions"><button class="text-button" type="button" data-review="${safe(item.id)}" data-review-outcome="completed">Concluída</button><button class="text-button" type="button" data-review="${safe(item.id)}" data-review-outcome="reviewed">Reavaliar no próximo período</button></div>` : ""}</li>`);
  $("cycle-events").innerHTML = [...cycleEvents.map(item => `<li><strong>${safe(item.title)}</strong><small>Período ${item.period} · ${safe(item.message)}</small></li>`), ...reviewMarkup].join("") || '<li class="empty-history">Nenhum evento registrado neste ciclo.</li>';
  const enterprise = game.enterpriseOutcomes ?? { news: [], ending: null };
  $("news-feed").innerHTML = enterprise.news.slice(0, 8).map(item => `<article class="news-item ${item.severity}"><small>${safe(item.publication)} · período ${item.period}</small><strong>${safe(item.title)}</strong><p>${safe(item.body)}</p>${item.voice ? `<blockquote><p>“${safe(item.voice.quote)}”</p><cite>Fala dramatizada · ${safe(item.voice.role)}</cite></blockquote>` : ""}</article>`).join("") || '<p class="empty-history">Nenhuma notícia publicada. A redação acompanha os indicadores.</p>';
  $("game-over").hidden = !enterprise.ending;
  if (enterprise.ending) {
    $("game-over-title").textContent = enterprise.ending.title;
    $("game-over-description").textContent = `${enterprise.ending.description} Gatilho do cenário: ${enterprise.ending.trigger}`;
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
    const cipaMember = game.cipa?.members?.some(member => member.employeeId === selected.id && member.participatesInCipa);
    const alerts = s.criticalAlerts.length ? `<ul class="alert-list">${s.criticalAlerts.map(a => `<li><strong>Investigar:</strong> ${safe(a)}</li>`).join("")}</ul>` : '<p class="panel-note">Sem alertas críticos configurados neste cenário sintético. Isso não significa ausência de risco real.</p>';
    const bars = DOMAINS.map(d => {
      const v = s.scores[d.id], cls = v < 40 ? "very-low" : v < 60 ? "low" : "";
      return `<div class="domain-row"><div class="domain-meta"><span>${safe(d.label)}</span><strong>${v}/100</strong></div><div class="bar" role="img" aria-label="${safe(d.label)}: ${v} de 100"><span class="${cls}" style="width:${v}%"></span></div></div>`;
    }).join("");
    $("employee-detail").innerHTML = `<div class="profile-top"><div class="profile-avatar">${selected.emoji}</div><div><h3>${safe(selected.name)}</h3><p>${safe(selected.role)} · ${identity.label}</p>${cipaMember ? '<span class="cipa-indicator">Integrante da comissão preventiva</span>' : ""}</div><div class="profile-score"><strong>${s.score}</strong><small>/100 · ${s.mood.emoji}</small></div></div>${alerts}<div class="domain-list">${bars}</div><p class="panel-note">Scores fictícios para aprendizagem. Investigue as condições de trabalho; não classifique nem culpe pessoas.</p>`;
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
  $("collective-toggle").textContent = collective.organized ? "Representação coletiva registrada" : "Registrar organização coletiva";
  $("collective-toggle").disabled = collective.organized;
  $("contract-history").innerHTML = (game.contractLedger ?? []).slice(-8).reverse().map(entry => `<li><strong>${safe(entry.supplierId)}</strong><small>Período ${entry.period} · ${entry.type === "activation" ? "Ativação" : "Recorrência"} · ${money(entry.amount)}</small></li>`).join("") || "<li class=\"empty-history\">Nenhum lançamento contratual.</li>";

  const manager = game.managementPositions?.find(item => item.active);
  const pendingSuccession = game.managementPositions?.find(item => item.successionPending);
  $("succession-panel").innerHTML = manager
    ? `<p><strong>${safe(manager.title)}:</strong> ${safe(manager.name)} · setor ${safe(manager.department)}</p><p class="panel-note">Se houver afastamento ou desligamento, o sucessor escolhe reorganizar o setor ou substituir a equipe. As próximas três ações no departamento terão impacto ampliado (±50%).</p><div class="governance-actions"><button class="text-button" data-manager-exit="health-leave">Afastamento por saúde</button><button class="text-button" data-manager-exit="dismissal">Demissão</button><button class="text-button" data-manager-exit="resignation">Pedido de desligamento</button></div>`
    : pendingSuccession
      ? `<p><strong>Sucessão pendente:</strong> ${safe(pendingSuccession.title)} · ${safe(pendingSuccession.department)}</p><label>Sucessor <select id="successor-select">${game.employees.map(person => `<option value="${safe(person.id)}">${safe(person.name)}</option>`).join("")}</select></label><div class="governance-actions"><button class="apply-btn" data-succession="reorganize">Reorganizar setor</button><button class="text-button" data-succession="replace-team">Trocar equipe do setor</button></div>`
      : "<p>Não há posição gerencial configurada.</p>";
  const cipa = game.cipa ?? { created: false, members: [], incidents: [] };
  $("cipa-panel").innerHTML = cipa.created
    ? `<p><strong>Comissão preventiva ativa</strong> · ${cipa.members.filter(member => member.status === "active").length}/${cipa.members.length} integrantes ativos</p><p class="panel-note">Cada setor tem um representante no cenário. O marcador aparece na ficha individual. Regra ficcional: cada saída ou afastamento de integrante gera custo único de R$ 1.000.</p><ul class="cipa-members">${cipa.members.map(member => `<li><span>${safe(member.name)} · ${safe(member.department)} · ${member.status === "active" ? "Ativo" : member.status === "on-leave" ? "Afastado" : "Desligado"}</span>${member.status === "active" ? `<button class="text-button" data-cipa-exit="${safe(member.employeeId)}" data-exit-reason="dismissal">Registrar saída</button><button class="text-button" data-cipa-exit="${safe(member.employeeId)}" data-exit-reason="health-leave">Afastamento</button>` : ""}</li>`).join("")}</ul><label>Setor que receberá subsídio <select id="cipa-subsidy-select">${game.departments.map(dept => `<option value="${safe(dept.id)}" ${cipa.subsidizedDepartment === dept.id ? "selected" : ""}>${safe(dept.name)}</option>`).join("")}</select></label><button class="apply-btn" data-cipa-subsidy>Escolher setor · 30% de desconto na próxima melhoria</button><p class="panel-note">Subsídio selecionado: ${cipa.subsidizedDepartment ? safe(game.departments.find(d => d.id === cipa.subsidizedDepartment)?.name) : "nenhum setor"}.</p>`
    : `<p><strong>Criação da CIPA · ${money(1200)}</strong></p><p class="panel-note">Escolha um representante de cada setor. Esta é uma comissão simplificada para fins de jogo, não uma reprodução da composição legal da CIPA.</p><div class="cipa-selectors">${game.departments.map(dept => `<label>${safe(dept.name)}<select data-cipa-member="${safe(dept.id)}">${game.employees.filter(person => person.department === dept.id).map(person => `<option value="${safe(person.id)}">${safe(person.name)}</option>`).join("")}</select></label>`).join("")}</div><button class="apply-btn" data-cipa-create ${game.budget < 1200 ? "disabled" : ""}>Comprar e criar comissão</button>`;
  const targets = `<option value="team">Aplicar ao setor atual</option>${game.employees.map(e => `<option value="${safe(e.id)}" ${e.id === selectedId ? "selected" : ""}>${safe(e.name)}</option>`).join("")}`;
  $("intervention-list").innerHTML = INTERVENTIONS.map(item => {
    const effects = Object.entries(item.effects).map(([id,n]) => `<span class="effect-chip">${safe(DOMAINS.find(d => d.id === id)?.label || id)} +${n}</span>`).join("");
    return `<article class="intervention"><div class="intervention-head"><div><span class="category">${safe(item.category)}</span><h3>${safe(item.name)}</h3></div><span class="price">${money(item.cost)}</span></div><p>${safe(item.explanation)}</p><div class="effects">${effects}</div><div class="apply-row"><label class="sr-only" for="target-${safe(item.id)}">Aplicar intervenção a</label><select class="target-select" id="target-${safe(item.id)}" data-target="${safe(item.id)}">${targets}</select><button class="apply-btn" type="button" data-apply="${safe(item.id)}" ${game.budget < item.cost ? "disabled" : ""}>Aplicar</button></div></article>`;
  }).join("");

  const history = [...game.history].reverse();
  $("history").innerHTML = history.length ? history.map(ev => `<li><strong>${safe(ev.name)}</strong><small>${money(ev.cost)} · ${ev.employeeId ? "ação individual" : "equipe"} · ${ev.changedEmployees} personagem(ns)</small><small>${safe(ev.explanation)}</small></li>`).join("") : '<li class="empty-history">Nenhuma intervenção aplicada nesta sessão.</li>';
  try { localStorage.setItem(KEY, JSON.stringify(game)); } catch {}
}
document.addEventListener("click", event => {
  if (game.enterpriseOutcomes?.ending && !event.target.closest("#ending-reset")) return;
  const managerExit = event.target.closest("[data-manager-exit]");
  if (managerExit) {
    const result = recordManagerDeparture(game, managerExit.dataset.managerExit);
    if (!result.ok) { toast(result.reason); return; }
    game = result.state; render(); toast("Saída gerencial registrada. A sucessão deverá escolher o rumo do departamento."); return;
  }
  const succession = event.target.closest("[data-succession]");
  if (succession) {
    const successorId = $("successor-select")?.value;
    const result = appointSuccessor(game, successorId, succession.dataset.succession);
    if (!result.ok) { toast(result.reason); return; }
    game = result.state; render(); toast(result.strategy === "reorganize" ? "Setor reorganizado. As próximas três ações terão efeito ampliado positivo." : "Equipe substituída. As próximas três ações terão efeito ampliado negativo pela ruptura."); return;
  }
  if (event.target.closest("[data-cipa-create]")) {
    const representatives = Object.fromEntries([...document.querySelectorAll("[data-cipa-member]")].map(select => [select.dataset.cipaMember, select.value]));
    const result = createCipa(game, representatives);
    if (!result.ok) { toast(result.reason); return; }
    game = result.state; render(); toast("Comissão preventiva criada e representantes registrados nos perfis."); return;
  }
  const cipaExit = event.target.closest("[data-cipa-exit]");
  if (cipaExit) {
    const result = recordCipaMemberExit(game, cipaExit.dataset.cipaExit, cipaExit.dataset.exitReason);
    if (!result.ok) { toast(result.reason); return; }
    game = result.state; render(); toast("Evento registrado. Custo único de R$ 1.000 lançado no caixa."); return;
  }
  if (event.target.closest("[data-cipa-subsidy]")) {
    const result = subsidizeCipaDepartment(game, $("cipa-subsidy-select")?.value);
    if (!result.ok) { toast(result.reason); return; }
    game = result.state; render(); toast("Subsídio de 30% registrado para a próxima melhoria do setor."); return;
  }
  const reviewButton = event.target.closest("[data-review]");
  if (reviewButton) {
    const result = resolveManagementReview(game, reviewButton.dataset.review, reviewButton.dataset.reviewOutcome);
    if (!result.ok) { toast(result.reason); return; }
    game = result.state; render();
    toast(reviewButton.dataset.reviewOutcome === "completed" ? "Revisão concluída e registrada." : "Revisão registrada e reagendada para o próximo período.");
    return;
  }
  if (event.target.closest("#collective-toggle")) {
    const current = game.collectiveRepresentation ?? { organized: false, representatives: 0, agenda: [] };
    if (current.organized) { toast("A representação coletiva é autônoma e não pode ser suspensa pela gestão."); return; }
    game = updateCollectiveRepresentation(game, {
      organized: true,
      representatives: 2,
      agenda: ["Pausas e recuperação", "Segurança e prevenção", "Comunicação e respeito"]
    });
    render(); toast("Organização coletiva registrada por iniciativa dos trabalhadores. A gestão deverá responder às pautas."); return;
  }
  if (event.target.closest("#advance-period")) {
    const org = getOrganizationSnapshot(game);
    const minimumSafety = Math.min(...game.employees.map(person => Number(person.scores?.safetyConditions ?? 100)));
    const lowRecoveryCount = game.employees.filter(person => Number(person.scores?.recovery ?? 100) < 45).length;
    const cycleResult = closeManagementPeriod(game, { score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety, lowRecoveryCount });
    // Avalia o período que está sendo encerrado com seu próprio caixa e contratos.
    // A recorrência só é debitada depois, na abertura do período seguinte.
    const financial = getWorkforceFinanceSnapshot(cycleResult.state, 1);
    const outcome = evaluateEnterpriseOutcomes(cycleResult.state, {
      score: org.score,
      criticalAlerts: org.criticalAlerts,
      minimumSafety,
      budget: cycleResult.state.budget,
      activeContracts: financial.activeContracts,
      period: cycleResult.closedPeriod
    });
    if (outcome.ending) {
      game = outcome.state;
      render();
      toast(`Game over: ${outcome.ending.title}`);
      return;
    }
    const advanced = advanceWorkforcePeriod(outcome.state);
    game = advanced.state;
    render();
    toast(`Período ${cycleResult.closedPeriod} fechado. Período ${advanced.period} iniciado; ${cycleResult.events.length} evento(s) para revisão.`);
    return;
  }
  const supplierButton = event.target.closest("[data-supplier]");
  if (supplierButton) {
    const supplierId = supplierButton.dataset.supplier;
    const active = game.contracts?.some(c => c.supplierId === supplierId && c.active);
    if (!active) {
      const result = contractSupplier(game, supplierId);
      if (!result.ok) { toast(result.reason); return; }
      const action = consumeManagementAction(result.state, {
        id: `supplier-contract-${supplierId}-${game.period}`,
        label: `Contratar fornecedor ${result.contract.supplierName}`
      });
      if (!action.ok) { toast(action.reason); return; }
      game = action.state; render(); toast("Contrato registrado. Custos recorrentes são acompanhados por período.");
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
  const selectedPerson = target === "team" ? null : employee(target);
  const department = selectedPerson?.department ?? employee(selectedId)?.department ?? "separacao";
  const baseIntervention = INTERVENTIONS.find(item => item.id === id);
  const costInfo = getGovernanceInterventionCost(game, department, baseIntervention.cost);
  const impact = applyDepartmentImpact(costInfo.state, department, baseIntervention.effects);
  const result = applyIntervention(impact.state, id, { ...(target === "team" ? {} : { employeeId: target }), costOverride: costInfo.cost, effectsOverride: impact.effects, department });
  if (!result.ok) { toast(result.reason); return; }
  const action = consumeManagementAction(result.state, { id, label: INTERVENTIONS.find(item => item.id === id)?.name });
  if (!action.ok) { toast(action.reason); return; }
  game = action.state;
  if (costInfo.discount) { game.cipa.subsidyUsed = true; toast("Subsídio da comissão aplicado à melhoria."); }
  if (impact.multiplier > 1) toast(impact.direction > 0 ? "Efeito ampliado pela transição gerencial." : "Ruptura ampliou o impacto negativo da decisão.");
  if (result.event.employeeId) selectedId = result.event.employeeId;
  render(); toast(result.note);
});
const restart = () => { game = ensureManagementCycle(fresh()); selectedId = game.employees[0].id; render(); toast("Nova partida iniciada."); };
$("reset-game").addEventListener("click", restart);
$("ending-reset").addEventListener("click", restart);
render();
