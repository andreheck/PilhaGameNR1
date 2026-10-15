import assert from 'node:assert/strict';
import test from 'node:test';
import { CASE017_INITIAL, simulateCase017 } from '../simulation/case017.js';
import {
  CASE017_SCENE_VERSION,
  deriveCase017SceneState,
  deserializeCase017SceneState,
  serializeCase017SceneState
} from '../simulation/case017-scene.js';

const goodInput = {
  actions: ['capacity', 'breaks', 'leaders'],
  evidence: ['schedule', 'reports', 'observation'],
  hypothesis: 'organization',
  monitoring: ['hours', 'return', 'results'],
  days: 30
};

test('deriva estado visual persistente para uma intervenção estrutural', () => {
  const simulation = simulateCase017(goodInput);
  const state = deriveCase017SceneState(simulation, 84, 1792080000000);

  assert.equal(state.version, CASE017_SCENE_VERSION);
  assert.equal(state.caseId, '017');
  assert.equal(state.environment, 'standard-office');
  assert.equal(state.sector, 'operations');
  assert.equal(state.phase, 'after-simulation');
  assert.equal(state.days, 30);
  assert.equal(state.score, 84);
  assert.equal(state.generatedAt, 1792080000000);
  assert.ok(state.metrics.workload < CASE017_INITIAL.workload);
  assert.ok(state.metrics.rest < CASE017_INITIAL.rest);
  assert.ok(state.visualFlags.includes('capacity-rebalanced'));
  assert.ok(state.visualFlags.includes('breaks-protected'));
  assert.ok(state.visualFlags.includes('leadership-prepared'));
  assert.equal(state.violations.length, 0);
});

test('serializa e restaura o estado sem perder decisões ou consequências', () => {
  const state = deriveCase017SceneState(simulateCase017(goodInput), 84, 1792080000000);
  const restored = deserializeCase017SceneState(serializeCase017SceneState(state));

  assert.deepEqual(restored, state);
  assert.notEqual(restored, state);
  assert.notEqual(restored.metrics, state.metrics);
  assert.ok(restored.selectedActions.includes('capacity'));
  assert.ok(restored.selectedMonitoring.includes('hours'));
});

test('serializa alertas visuais quando há exposição de privacidade', () => {
  const simulation = simulateCase017({
    actions: ['surveillance'],
    evidence: ['schedule', 'reports', 'observation'],
    hypothesis: 'organization',
    monitoring: ['healthfiles'],
    days: 30
  });
  const state = deriveCase017SceneState(simulation, 40);

  assert.ok(state.violations.includes('surveillance'));
  assert.ok(state.violations.includes('healthfiles'));
  assert.ok(state.visualFlags.includes('individual-surveillance'));
  assert.ok(state.visualFlags.includes('confidentiality-warning'));
});

test('rejeita payloads inválidos e limita o tamanho do horizonte', () => {
  const state = deriveCase017SceneState(simulateCase017({ ...goodInput, days: 900 }), 140);
  assert.equal(state.days, 365);
  assert.equal(state.score, 100);
  assert.equal(deserializeCase017SceneState('{not-json'), null);
  assert.equal(deserializeCase017SceneState(JSON.stringify({ version: 2, caseId: '017' })), null);
  assert.equal(deserializeCase017SceneState('x'.repeat(100_001)), null);
  assert.throws(() => serializeCase017SceneState({ version: 1, caseId: '999' }), TypeError);
});
