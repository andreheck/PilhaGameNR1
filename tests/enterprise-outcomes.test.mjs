import assert from "node:assert/strict";
import { ENDINGS, evaluateEnterpriseOutcomes } from "../src/enterprise-outcomes.js";
let state = { budget: -100, period: 1, contracts: [{ active: true }] };
let first = evaluateEnterpriseOutcomes(state, { budget: -100, period: 1, activeContracts: 1, score: 45, criticalAlerts: 2, minimumSafety: 40 });
assert.equal(first.gameOver, false);
assert.ok(first.news.some(item => item.publication === "The Mentalist Post"));
assert.ok(first.news.some(item => item.voice?.role === "Trabalhadora da operação"), "notícia inclui voz dramatizada de trabalhadora");
let second = evaluateEnterpriseOutcomes(first.state, { budget: -200, period: 2, activeContracts: 1, score: 30, criticalAlerts: 3, minimumSafety: 20 });
assert.equal(second.gameOver, true);
assert.equal(second.ending.id, ENDINGS.bankruptcy.id);
const terminal = evaluateEnterpriseOutcomes(second.state, { budget: 5000, period: 3 });
assert.equal(terminal.ending.id, "bankruptcy", "fim de jogo persiste");
let safetyState = { budget: 1000, period: 1 };
for (let period=1; period<=2; period++) {
  const result = evaluateEnterpriseOutcomes(safetyState, { budget: 1000, period, score: 60, criticalAlerts: 1, minimumSafety: 15 });
  safetyState = result.state;
  if (period===2) assert.equal(result.ending.id, "regulatoryClosure");
}
console.log("enterprise-outcomes: notícias, gatilhos cumulativos e finais PASS");
