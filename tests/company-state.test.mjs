import assert from 'node:assert/strict';
import test from 'node:test';
import {CASES, outcome} from '../cases-data.js';
import {CASE02_INITIAL, simulateCase02} from '../simulation/case02.js';
import {COMPANY_STATE_KEY, applyCompanyDecision, createCompanyState, getCompanyCaseModifier, getCompanySummary} from '../simulation/company-state.js';

const protect = {
  choice: 'protect', outcome: 'positive', status: 'attended', emoji: '🤝', days: 30,
  metrics: {trust: 12, workload: -10, wellbeing: 16, turnoverRisk: -14}, updated: 1
};
const dismiss = {
  choice: 'dismiss', outcome: 'negative', status: 'unattended', emoji: '😔', days: 30,
  metrics: {trust: -22, workload: 12, wellbeing: -20, turnoverRisk: 28}, updated: 2
};
const bestChoices = id => CASES.find(c => c.id === id).steps.map(step => step.options.findIndex(option => option[1] === 25));

 test('estado global é versionado, acumulável e tem histórico limitado', () => {
  let state = createCompanyState();
  assert.equal(state.version, 1);
  assert.equal(state.day, 0);
  for (let i = 0; i < 14; i++) state = applyCompanyDecision(state, {...protect, updated: i + 1});
  assert.equal(state.history.length, 12);
  assert.equal(state.management.choice, 'protect');
  assert.equal(state.metrics.trust, 168);
  assert.equal(COMPANY_STATE_KEY, 'pilha-company-state-v1');
});

test('proteção melhora o contexto global dos Casos 02 a 05', () => {
  const state = applyCompanyDecision(createCompanyState(), protect);
  const c02 = getCompanyCaseModifier(state, '02');
  const c03 = getCompanyCaseModifier(state, '03');
  const c04 = getCompanyCaseModifier(state, '04');
  const c05 = getCompanyCaseModifier(state, '05');
  assert.ok(c02.psychologicalSafety > 0);
  assert.ok(c03.clarity > 0 && c03.autonomy > 0);
  assert.ok(c04.privacyTrust > 0 && c04.wellbeing > 0);
  assert.ok(c05.recovery > 0 && c05.onCallPressure < 0);
});

test('demissão cria contexto adverso sem apagar o progresso individual', () => {
  const state = applyCompanyDecision(createCompanyState(), dismiss);
  assert.ok(getCompanyCaseModifier(state, '02').psychologicalSafety < 0);
  assert.ok(getCompanyCaseModifier(state, '03').conflict > 0);
  assert.ok(getCompanyCaseModifier(state, '04').confidentialityRisk > 0);
  assert.ok(getCompanyCaseModifier(state, '05').onCallPressure > 0);
  assert.equal(getCompanySummary(state).label, 'Risco não atendido');
});

test('Caso 02 recebe o contexto global sem decisão e mantém os valores iniciais', () => {
  const result = simulateCase02({choices: {}});
  assert.deepEqual(result.companyModifier, {silence: 0, psychologicalSafety: 0, leadershipTrust: 0});
  assert.equal(result.metrics.psychologicalSafety, CASE02_INITIAL.psychologicalSafety);
});

test('Caso 02 e Casos 03–05 recebem efeitos persistentes do estado da empresa', () => {
  const state = applyCompanyDecision(createCompanyState(), dismiss);
  const result02 = simulateCase02({choices: {}, companyState: state});
  assert.ok(result02.metrics.psychologicalSafety < CASE02_INITIAL.psychologicalSafety);
  for (const id of ['03', '04', '05']) {
    const result = outcome(id, bestChoices(id), state);
    assert.ok(result.companyModifier && Object.keys(result.companyModifier).length > 0, `modifier ${id}`);
    assert.equal(typeof result.contextAdjustment, 'number');
  }
});

console.log('Estado global da empresa e efeitos nos Casos 02–05: PASS');
