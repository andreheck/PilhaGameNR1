import assert from "node:assert/strict";
import { applyIntervention, getOrganizationSnapshot } from "../src/psychosocial-simulation.js";
import { closeManagementPeriod, consumeManagementAction } from "../src/management-cycle.js";
import { evaluateEnterpriseOutcomes } from "../src/enterprise-outcomes.js";
import { advanceWorkforcePeriod, contractSupplier, getWorkforceFinanceSnapshot, updateCollectiveRepresentation } from "../src/workforce-relations.js";

const team = () => ({
  period: 1, budget: 8000, employees: [
    { id: "joana", role: "Operação", criticalAlerts: ["Recuperação insuficiente"], scores: { physicalHealth: 68, emotionalWellbeing: 42, socialSupport: 61, jobSatisfaction: 39, safetyConditions: 54, recovery: 36 } },
    { id: "marcos", role: "Conferência", criticalAlerts: [], scores: { physicalHealth: 70, emotionalWellbeing: 60, socialSupport: 64, jobSatisfaction: 55, safetyConditions: 70, recovery: 58 } },
    { id: "carla", role: "Supervisão", criticalAlerts: ["Apoio da liderança a investigar"], scores: { physicalHealth: 74, emotionalWellbeing: 58, socialSupport: 43, jobSatisfaction: 48, safetyConditions: 71, recovery: 52 } }
  ], history: []
});

function closePeriod(state) {
  const org = getOrganizationSnapshot(state);
  const minimumSafety = Math.min(...state.employees.map(p => p.scores.safetyConditions));
  const lowRecoveryCount = state.employees.filter(p => p.scores.recovery < 45).length;
  const closed = closeManagementPeriod(state, { score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety, lowRecoveryCount });
  const finance = getWorkforceFinanceSnapshot(closed.state, 1);
  const outcome = evaluateEnterpriseOutcomes(closed.state, {
    score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety,
    budget: closed.state.budget, activeContracts: finance.activeContracts, period: closed.closedPeriod
  });
  return { ...outcome, closedPeriod: closed.closedPeriod, events: closed.events };
}

// 1) Equipe própria: intervenções organizacionais têm custo explícito e efeito observável.
let own = team();
const ownStart = own.budget;
const ownAction = applyIntervention(own, "review-workload");
assert.equal(ownAction.ok, true);
own = ownAction.state;
assert.equal(own.budget, ownStart - 900);
assert.ok(getOrganizationSnapshot(own).score > getOrganizationSnapshot(team()).score);
const ownClose = closePeriod(own);
assert.equal(ownClose.gameOver, false);
assert.equal(ownClose.closedPeriod, 1);
assert.equal(ownClose.state.contracts.length, 0);
const ownNext = advanceWorkforcePeriod(ownClose.state);
assert.equal(ownNext.state.budget, own.budget, "equipe própria não recebe débito de fornecedor ao avançar");

// 2) Terceirização: ativação e recorrência são custos distintos, rastreáveis por período.
let outsourced = team();
const contract = contractSupplier(outsourced, "taresolvido");
assert.equal(contract.ok, true);
outsourced = contract.state;
assert.equal(outsourced.budget, 6150);
const outsourcedClose1 = closePeriod(outsourced);
assert.equal(outsourcedClose1.gameOver, false);
const outsourcedP2 = advanceWorkforcePeriod(outsourcedClose1.state);
assert.equal(outsourcedP2.period, 2);
assert.equal(outsourcedP2.state.budget, 4300);
assert.equal(outsourcedP2.state.contractLedger.filter(entry => entry.period === 2 && entry.type === "recurring").length, 1);
const outsourcedClose2 = closePeriod(outsourcedP2.state);
assert.equal(outsourcedClose2.gameOver, false);
const outsourcedP3 = advanceWorkforcePeriod(outsourcedClose2.state);
assert.equal(outsourcedP3.state.budget, 2450);
assert.equal(getWorkforceFinanceSnapshot(outsourcedP3.state).recurringPerPeriod, 1850);
assert.ok(outsourcedP3.state.budget < ownNext.state.budget, "terceirização deve tornar visível seu custo acumulado frente à equipe própria");

// 3) Participação coletiva: organização é autônoma, não gera bônus automático e não consome ação gerencial.
// A melhora só aparece depois de uma resposta concreta da gestão.
let collective = team();
const baselineScore = getOrganizationSnapshot(collective).score;
collective = updateCollectiveRepresentation(collective, { organized: true, representatives: 2, agenda: ["Pausas e recuperação", "Segurança", "Comunicação"] });
assert.equal(collective.collectiveRepresentation.organized, true);
assert.equal(getOrganizationSnapshot(collective).score, baselineScore, "organização coletiva, por si só, não concede bônus de indicador");
const responseAction = consumeManagementAction(collective, { id: "respond-to-collective-agenda", label: "Responder à pauta de recuperação e jornada" });
assert.equal(responseAction.ok, true);
collective = responseAction.state;
const response = applyIntervention(collective, "review-workload");
assert.equal(response.ok, true);
collective = response.state;
assert.ok(getOrganizationSnapshot(collective).score > baselineScore, "efeito vem da medida concreta, não da existência da representação");
assert.equal(collective.collectiveRepresentation.organized, true);
const collectiveClose = closePeriod(collective);
assert.equal(collectiveClose.gameOver, false);
assert.equal(collectiveClose.state.managementCycle.lastClose.actionsUsed, 1, "a resposta gerencial é contabilizada; a organização autônoma não");

console.log("workforce-trajectories: equipe própria, terceirização e participação coletiva em múltiplos períodos PASS");
