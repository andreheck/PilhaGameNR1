import assert from "node:assert/strict";
import {
  DOMAINS, INTERVENTIONS, applyIntervention, getEmployeeScore,
  getEmployeeSnapshot, getMood, getOrganizationSnapshot
} from "../src/psychosocial-simulation.js";

const employee = {
  id: "worker-01",
  role: "Operador de logística",
  scores: {
    physicalHealth: 70, emotionalWellbeing: 40, socialSupport: 60,
    jobSatisfaction: 35, safetyConditions: 80, recovery: 45
  },
  criticalAlerts: ["Exposição de segurança a investigar"]
};
const state = {
  budget: 3000,
  environment: { id: "logistics-alpha", upgrades: [] },
  employees: [employee, {
    id: "worker-02",
    role: "Assistente",
    scores: Object.fromEntries(DOMAINS.map(domain => [domain.id, 80])),
    criticalAlerts: []
  }],
  history: []
};

assert.equal(getEmployeeScore(employee), 55);
assert.equal(getEmployeeScore({ scores: { physicalHealth: 100 } }), 100);
assert.equal(getEmployeeScore({ scores: {} }), 0);
assert.equal(getMood(39).emoji, "😡");
assert.equal(getMood(40).emoji, "😟");
assert.equal(getMood(60).emoji, "😐");
assert.equal(getMood(75).emoji, "🙂");
assert.equal(getMood(90).emoji, "😄");

const snapshot = getEmployeeSnapshot(employee);
assert.equal(snapshot.score, 55);
assert.equal(snapshot.criticalAlerts.length, 1);
const org = getOrganizationSnapshot(state);
assert.equal(org.employeeCount, 2);
assert.equal(org.criticalAlerts, 1);
assert.equal(org.score, 68);

const tooExpensive = applyIntervention({ ...state, budget: 100 }, "environmental-quality");
assert.equal(tooExpensive.ok, false);
assert.equal(tooExpensive.reason, "Orçamento insuficiente.");
assert.equal(state.budget, 3000, "Estado original não deve ser alterado");

const result = applyIntervention(state, "review-workload");
assert.equal(result.ok, true);
assert.equal(result.state.budget, 2100);
assert.equal(result.state.history.length, 1);
assert.equal(result.state.employees[0].scores.recovery, 57);
assert.equal(result.state.employees[0].scores.jobSatisfaction, 45);
assert.equal(result.state.employees[0].scores.physicalHealth, 70, "Domínios não relacionados permanecem iguais");
assert.equal(result.state.employees[1].scores.recovery, 92);
assert.equal(result.remainingCriticalAlerts, true, "Intervenção não deve apagar alerta crítico");

const targeted = applyIntervention(state, "leadership-clarity", { employeeId: "worker-01" });
assert.equal(targeted.ok, true);
assert.equal(targeted.state.employees[0].scores.socialSupport, 70);
assert.equal(targeted.state.employees[1].scores.socialSupport, 80);
assert.equal(applyIntervention(state, "missing-intervention").ok, false);
assert.equal(applyIntervention(state, "leadership-clarity", { employeeId: "missing" }).ok, false);

const cappedState = {
  budget: 9999, employees: [{
    id: "max", scores: Object.fromEntries(DOMAINS.map(domain => [domain.id, 98]))
  }]
};
const capped = applyIntervention(cappedState, "ergonomic-workstation");
assert.equal(capped.state.employees[0].scores.physicalHealth, 100);
assert.equal(capped.state.employees[0].scores.safetyConditions, 100);

const individualAction = applyIntervention(state, "wellbeing-workshop");
assert.equal(individualAction.ok, true);
assert.match(individualAction.note, /não.*fatores organizacionais/i);

console.log("psychosocial-simulation.test.mjs: todos os testes passaram.");
