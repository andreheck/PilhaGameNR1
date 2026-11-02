import assert from "node:assert/strict";
import { SUPPLIERS, addOutsourcedWorker, advanceWorkforcePeriod, contractSupplier, ensureWorkforceState, getContractPerformance, getRelationshipVisual, unionMembershipImpact, updateCollectiveRepresentation } from "../src/workforce-relations.js";

const base = { budget: 8000, employees: [{ id: "joana", name: "Joana" }], history: [] };
const initialized = ensureWorkforceState(base);
assert.equal(initialized.employees.length, 1);
assert.equal(initialized.contracts.length, 0);
assert.equal(base.contracts, undefined, "compatibilidade: não mutar save legado");

const contracted = contractSupplier(initialized, "taresolvido");
assert.equal(contracted.ok, true);
assert.equal(contracted.contract.monthlyCost, 1850);
assert.equal(contractSupplier(contracted.state, "taresolvido").ok, false);
const worker = addOutsourcedWorker(contracted.state, "taresolvido", { id: "terc-01", name: "Alex", role: "Apoio logístico", scores: {} });
assert.equal(worker.ok, true);
assert.equal(worker.worker.relationshipType, "outsourced");
assert.equal(worker.worker.payrollRegistry, "supplier");
assert.equal(getRelationshipVisual(worker.worker).color, "orange");
assert.equal(getRelationshipVisual({ id: "joana" }).color, "blue");
assert.equal(addOutsourcedWorker(worker.state, "taresolvido", { id: "terc-02" }).ok, true);
assert.equal(addOutsourcedWorker(worker.state, "taresolvido", { id: "terc-03" }).ok, false, "respeitar capacidade");
assert.equal(addOutsourcedWorker(worker.state, "xacomigo", { id: "sem-contrato" }).ok, false);

const nextPeriod = advanceWorkforcePeriod(worker.state);
assert.equal(nextPeriod.period, 2);
assert.equal(nextPeriod.state.contractLedger.filter(x => x.type === "recurring").length, 1);
assert.equal(nextPeriod.state.contractLedger.find(x => x.type === "recurring").amount, 1850);
assert.ok(getContractPerformance("xacomigo").performance > getContractPerformance("taresolvido").performance);
const collective = updateCollectiveRepresentation(nextPeriod.state, { organized: true, representatives: 2, agenda: ["Pausas", "Segurança"] });
assert.equal(collective.collectiveRepresentation.organized, true);
assert.deepEqual(unionMembershipImpact(), { hiring: 0, evaluation: 0, pay: 0, promotion: 0, schedule: 0, retention: 0, publicDisclosure: false });
assert.equal(SUPPLIERS.length, 2);
console.log("workforce-relations: contratos, capacidade, recorrência, identidade visual e salvaguardas coletivas PASS");
