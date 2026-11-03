import assert from "node:assert/strict";
import { SUPPLIERS, addOutsourcedWorker, advanceWorkforcePeriod, contractSupplier, ensureWorkforceState, getContractPerformance, getRelationshipVisual, getWorkforceFinanceSnapshot, unionMembershipImpact, updateCollectiveRepresentation } from "../src/workforce-relations.js";

const base = { budget: 8000, employees: [{ id: "joana", name: "Joana" }], history: [] };
const initialized = ensureWorkforceState(base);
assert.equal(initialized.employees.length, 1);
assert.equal(initialized.contracts.length, 0);
assert.equal(base.contracts, undefined, "compatibilidade: não mutar save legado");

const contracted = contractSupplier(initialized, "taresolvido");
assert.equal(contracted.ok, true);
assert.equal(contracted.contract.monthlyCost, 1850);
assert.equal(contracted.state.budget, 6150, "ativação deve sair do caixa");
assert.equal(contracted.state.contractLedger[0].balanceAfter, 6150);
assert.equal(contractSupplier(contracted.state, "taresolvido").ok, false);
const worker = addOutsourcedWorker(contracted.state, "taresolvido", { id: "terc-01", name: "Alex", role: "Apoio logístico", scores: {} });
assert.equal(worker.ok, true);
assert.equal(worker.worker.relationshipType, "outsourced");
assert.equal(worker.worker.payrollRegistry, "supplier");
assert.equal(getRelationshipVisual(worker.worker).color, "orange");
assert.equal(getRelationshipVisual({ id: "joana" }).color, "blue");
const secondWorker = addOutsourcedWorker(worker.state, "taresolvido", { id: "terc-02" });
assert.equal(secondWorker.ok, true);
assert.equal(addOutsourcedWorker(secondWorker.state, "taresolvido", { id: "terc-03" }).ok, false, "respeitar capacidade");
assert.equal(addOutsourcedWorker(worker.state, "xacomigo", { id: "sem-contrato" }).ok, false);

const nextPeriod = advanceWorkforcePeriod(worker.state);
assert.equal(nextPeriod.period, 2);
assert.equal(nextPeriod.state.budget, 4300, "recorrência deve sair do caixa a cada período");
assert.equal(nextPeriod.state.contractLedger.at(-1).balanceAfter, 4300);
assert.equal(nextPeriod.state.contractLedger.filter(x => x.type === "recurring").length, 1);
assert.equal(nextPeriod.state.contractLedger.find(x => x.type === "recurring").amount, 1850);
assert.equal(nextPeriod.state.contractLedger.filter(x => x.period === 2 && x.type === "recurring").length, 1);
const outlook = getWorkforceFinanceSnapshot(nextPeriod.state, 3);
assert.equal(outlook.recurringPerPeriod, 1850);
assert.equal(outlook.periods[0].projectedBalance, 2450);
assert.equal(outlook.periods[1].projectedBalance, 600);
assert.equal(outlook.projectedDeficitPeriod, 5, "projeção começa no próximo período, sem cobrar duas vezes o atual");
assert.ok(getContractPerformance("xacomigo").performance > getContractPerformance("taresolvido").performance);
const collective = updateCollectiveRepresentation(nextPeriod.state, { organized: true, representatives: 2, agenda: ["Pausas", "Segurança"] });
assert.equal(collective.collectiveRepresentation.organized, true);
const protectedCollective = updateCollectiveRepresentation(collective, { organized: false, representatives: 0, agenda: [] });
assert.equal(protectedCollective.collectiveRepresentation.organized, true, "a gestão não pode desativar a organização coletiva");
assert.deepEqual(unionMembershipImpact(), { hiring: 0, evaluation: 0, pay: 0, promotion: 0, schedule: 0, retention: 0, publicDisclosure: false });
assert.equal(SUPPLIERS.length, 2);
const lowCash = contractSupplier({ ...base, budget: 1000 }, "taresolvido");
assert.equal(lowCash.ok, false, "não assumir contrato sem caixa para o primeiro período");
const insolvent = advanceWorkforcePeriod({ ...contracted.state, budget: 500 });
assert.equal(insolvent.state.budget, -1350, "obrigação recorrente deve evidenciar déficit, não desaparecer");
assert.equal(getWorkforceFinanceSnapshot(insolvent.state).deficit, true);
console.log("workforce-relations: contratos, capacidade, recorrência, identidade visual e salvaguardas coletivas PASS");

import { applyIntervention, getOrganizationSnapshot } from "../src/psychosocial-simulation.js";
import { closeManagementPeriod, consumeManagementAction } from "../src/management-cycle.js";
import { evaluateEnterpriseOutcomes } from "../src/enterprise-outcomes.js";

const scenarioTeam = () => ({ period: 1, budget: 8000, employees: [
  { id: "joana", criticalAlerts: ["Recuperação insuficiente"], scores: { physicalHealth: 68, emotionalWellbeing: 42, socialSupport: 61, jobSatisfaction: 39, safetyConditions: 54, recovery: 36 } },
  { id: "marcos", criticalAlerts: [], scores: { physicalHealth: 70, emotionalWellbeing: 60, socialSupport: 64, jobSatisfaction: 55, safetyConditions: 70, recovery: 58 } },
  { id: "carla", criticalAlerts: ["Apoio da liderança a investigar"], scores: { physicalHealth: 74, emotionalWellbeing: 58, socialSupport: 43, jobSatisfaction: 48, safetyConditions: 71, recovery: 52 } }
], history: [] });
function closeScenario(state) {
  const org = getOrganizationSnapshot(state);
  const minimumSafety = Math.min(...state.employees.map(p => p.scores.safetyConditions));
  const closed = closeManagementPeriod(state, { score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety, lowRecoveryCount: state.employees.filter(p => p.scores.recovery < 45).length });
  const finance = getWorkforceFinanceSnapshot(closed.state, 1);
  return evaluateEnterpriseOutcomes(closed.state, { score: org.score, criticalAlerts: org.criticalAlerts, minimumSafety, budget: closed.state.budget, activeContracts: finance.activeContracts, period: closed.closedPeriod });
}

// Trajetória A: equipe própria, intervenção organizacional e dois fechamentos sem custo terceirizado.
let ownTeam = scenarioTeam();
const ownMeasure = applyIntervention(ownTeam, "review-workload");
assert.equal(ownMeasure.ok, true);
ownTeam = ownMeasure.state;
assert.equal(ownTeam.budget, 7100);
assert.ok(getOrganizationSnapshot(ownTeam).score > getOrganizationSnapshot(scenarioTeam()).score);
const ownClosed = closeScenario(ownTeam);
assert.equal(ownClosed.gameOver, false);
const ownNext = advanceWorkforcePeriod(ownClosed.state);
assert.equal(ownNext.state.budget, 7100);

// Trajetória B: contratação, recorrência em períodos seguintes e pressão comparável no caixa.
let supplierTeam = scenarioTeam();
supplierTeam = contractSupplier(supplierTeam, "taresolvido").state;
const supplierClosed1 = closeScenario(supplierTeam);
assert.equal(supplierClosed1.gameOver, false);
const supplierP2 = advanceWorkforcePeriod(supplierClosed1.state);
assert.equal(supplierP2.state.budget, 4300);
assert.equal(supplierP2.state.contractLedger.at(-1).period, 2);
const supplierClosed2 = closeScenario(supplierP2.state);
assert.equal(supplierClosed2.gameOver, false);
const supplierP3 = advanceWorkforcePeriod(supplierClosed2.state);
assert.equal(supplierP3.state.budget, 2450);
assert.ok(supplierP3.state.budget < ownNext.state.budget);

// Trajetória C: representação autônoma não altera indicador nem consome capacidade.
// O efeito surge apenas após resposta gerencial concreta.
let collectiveTeam = scenarioTeam();
const baseline = getOrganizationSnapshot(collectiveTeam).score;
collectiveTeam = updateCollectiveRepresentation(collectiveTeam, { organized: true, representatives: 2, agenda: ["Pausas", "Segurança", "Comunicação"] });
assert.equal(getOrganizationSnapshot(collectiveTeam).score, baseline);
const responseAction = consumeManagementAction(collectiveTeam, { id: "respond-collective-agenda", label: "Responder à pauta coletiva" });
assert.equal(responseAction.ok, true);
const response = applyIntervention(responseAction.state, "review-workload");
assert.equal(response.ok, true);
assert.ok(getOrganizationSnapshot(response.state).score > baseline);
const collectiveClosed = closeScenario(response.state);
assert.equal(collectiveClosed.gameOver, false);
assert.equal(collectiveClosed.state.managementCycle.lastClose.actionsUsed, 1);
assert.equal(collectiveClosed.state.collectiveRepresentation.organized, true);

console.log("workforce-trajectories: equipe própria, terceirização e participação coletiva PASS");

