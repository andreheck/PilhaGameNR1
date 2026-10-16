import assert from 'node:assert/strict';
import test from 'node:test';
import { CASE01_INITIAL, simulateCase01 } from '../simulation/case01.js';
import {
  CASE01_SCENE_VERSION,
  deriveCase01SceneState,
  deserializeCase01SceneState,
  serializeCase01SceneState
} from '../simulation/case01-scene.js';

const goodInput = {
  actions: ['capacity', 'breaks', 'leaders'],
  evidence: ['schedule', 'reports', 'observation'],
  hypothesis: 'organization',
  monitoring: ['hours', 'return', 'results'],
  days: 30
};

test('deriva estado visual persistente para uma intervenção estrutural', () => {
  const simulation = simulateCase01(goodInput);
  const state = deriveCase01SceneState(simulation, 84, 1792080000000);

  assert.equal(state.version, CASE01_SCENE_VERSION);
  assert.equal(state.caseId, '01');
  assert.equal(state.environment, 'standard-office');
  assert.equal(state.sector, 'operations');
  assert.equal(state.phase, 'after-simulation');
  assert.equal(state.days, 30);
  assert.equal(state.score, 84);
  assert.equal(state.generatedAt, 1792080000000);
  assert.ok(state.metrics.workload < CASE01_INITIAL.workload);
  assert.ok(state.metrics.rest < CASE01_INITIAL.rest);
  assert.ok(state.visualFlags.includes('capacity-rebalanced'));
  assert.ok(state.visualFlags.includes('breaks-protected'));
  assert.ok(state.visualFlags.includes('leadership-prepared'));
  assert.equal(state.violations.length, 0);
});

test('serializa e restaura o estado sem perder decisões ou consequências', () => {
  const state = deriveCase01SceneState(simulateCase01(goodInput), 84, 1792080000000);
  const restored = deserializeCase01SceneState(serializeCase01SceneState(state));

  assert.deepEqual(restored, state);
  assert.notEqual(restored, state);
  assert.notEqual(restored.metrics, state.metrics);
  assert.ok(restored.selectedActions.includes('capacity'));
  assert.ok(restored.selectedMonitoring.includes('hours'));
});

test('serializa alertas visuais quando há exposição de privacidade', () => {
  const simulation = simulateCase01({
    actions: ['surveillance'],
    evidence: ['schedule', 'reports', 'observation'],
    hypothesis: 'organization',
    monitoring: ['healthfiles'],
    days: 30
  });
  const state = deriveCase01SceneState(simulation, 40);

  assert.ok(state.violations.includes('surveillance'));
  assert.ok(state.violations.includes('healthfiles'));
  assert.ok(state.visualFlags.includes('individual-surveillance'));
  assert.ok(state.visualFlags.includes('confidentiality-warning'));
});

test('rejeita payloads inválidos e limita o tamanho do horizonte', () => {
  const state = deriveCase01SceneState(simulateCase01({ ...goodInput, days: 900 }), 140);
  assert.equal(state.days, 365);
  assert.equal(state.score, 100);
  assert.equal(deserializeCase01SceneState('{not-json'), null);
  assert.equal(deserializeCase01SceneState(JSON.stringify({ version: 2, caseId: '01' })), null);
  assert.equal(deserializeCase01SceneState('x'.repeat(100_001)), null);
  assert.throws(() => serializeCase01SceneState({ version: 1, caseId: '999' }), TypeError);
});
