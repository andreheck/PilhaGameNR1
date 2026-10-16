import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {MANAGEMENT_CHOICES, resolveManagementChoice} from '../simulation/management.js';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const play = read('play.js');
const world = read('world3d.js');
const css = read('play.css');

test('a medida de proteção registra 30 dias e melhora o cenário', () => {
  const state = resolveManagementChoice('protect');
  assert.equal(state.days, 30);
  assert.equal(state.status, 'attended');
  assert.equal(state.outcome, 'positive');
  assert.equal(state.emoji, '🤝');
  assert.ok(state.metrics.workload < 0);
  assert.ok(state.metrics.wellbeing > 0);
});

test('adiar é o cenário neutro com risco residual', () => {
  const state = resolveManagementChoice('delay');
  assert.equal(state.days, 30);
  assert.equal(state.outcome, 'neutral');
  assert.equal(state.status, 'attended');
  assert.ok(state.metrics.workload > 0);
});

test('demitir após adoecimento marca o estado não atendido', () => {
  const state = resolveManagementChoice('dismiss');
  assert.equal(state.days, 30);
  assert.equal(state.status, 'unattended');
  assert.equal(state.outcome, 'negative');
  assert.equal(state.emoji, '😔');
  assert.ok(state.metrics.trust < 0);
  assert.ok(state.metrics.turnoverRisk > 0);
});

test('hub conecta as três escolhas ao feedback persistente da cena', () => {
  assert.match(play, /pilha-management-v1/);
  assert.match(play, /data-management/);
  assert.match(play, /resolveManagementChoice/);
  assert.match(play, /world\.applyManagementDecision/);
  assert.match(world, /management-decision-feedback/);
  assert.match(world, /medida de proteção construída/);
  assert.match(world, /estado não atendido/);
  assert.match(world, /setActorState/);
  assert.match(world, /safeRoutes/);
  assert.match(css, /management-choice/);
});

assert.deepEqual(Object.keys(MANAGEMENT_CHOICES).sort(), ['delay', 'dismiss', 'protect']);
console.log('Mecânica de proteção, adiamento e demissão após adoecimento: PASS');
