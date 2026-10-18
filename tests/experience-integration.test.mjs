import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { CASE01_INITIAL, simulateCase01 } from '../simulation/case01.js';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const projectRoot = new URL('../', import.meta.url);
const play = read('play.js');
const caseSource = read('case01.js');
const casePage = read('caso01.html');
const css = read('case01.css');

test('a central encaminha o Caso 01 para a jornada completa', () => {
  assert.doesNotMatch(play, /location\.assign\('\/caso01\.html'\)/); assert.match(play, /tab='playing'/);
  assert.match(casePage, /<script type="module" src="\/case01\.js"><\/script>/);
});

test('o Caso 01 usa o motor simulado no dashboard', () => {
  assert.match(caseSource, /import \{ CASE01_INITIAL, simulateCase01 \}/);
  assert.match(caseSource, /deriveCase01SceneState/);
  assert.match(caseSource, /s\.sceneState=deriveCase01SceneState/);
  assert.match(caseSource, /s\.simulation=simulateCase01\(/);
  assert.match(caseSource, /s\.simulation\.final\.metrics/);
  assert.match(caseSource, /alt=""><b>/);
  assert.match(css, /\.metric-delta\.positive/);
  assert.match(play, /world\.applySceneState\(persistedCase\.sceneState\)/);
  assert.match(play, /world\.clearSceneState\(\)/);
  const world = read('world3d.js');
  assert.match(world, /pause-zone-protected/);
  assert.match(world, /capacity-rebalanced/);
  assert.match(world, /confidentiality-warning/);
  assert.match(world, /setEffectsVisible\(state\)/);
  assert.match(world, /actorHighlights/);
  assert.match(world, /focusedActor/);
  assert.match(world, /beginRoutine/);
  assert.match(world, /rotina de exploração ativa/);
  assert.match(world, /Math\.atan2\(dx,dz\)/);
  assert.match(world, /integrated-nr1-library/);
  assert.match(world, /libraryFurniture/);
  assert.match(play, /data-act=\"start\"/);
  assert.match(play, /stage-library/);
  assert.match(play, /chatScripts/);
  assert.match(play, /data-chat-choice/);
  assert.match(play, /chat-bubble/);
});

test('uma decisão estrutural produz consequências educativas em 30 dias', () => {
  const result = simulateCase01({
    actions: ['capacity', 'breaks', 'leaders'],
    evidence: ['schedule', 'reports', 'observation'],
    hypothesis: 'organization',
    monitoring: ['hours', 'return', 'results'],
    days: 30
  });

  assert.equal(result.days, 30);
  assert.ok(result.metrics.workload < CASE01_INITIAL.workload);
  assert.ok(result.metrics.rest < CASE01_INITIAL.rest);
  assert.ok(result.operational.overtime < result.initial.operational.overtime);
  assert.equal(result.violations.length, 0);
  assert.ok(result.feedback.length >= 1);
});

assert.ok(fs.existsSync(new URL('assets/kenney-furniture/License.txt', projectRoot)));
assert.ok(fs.existsSync(new URL('assets/kenney-furniture/desk.glb', projectRoot)));
assert.ok(read('index.html').includes('3D INTERATIVO'));
assert.ok(!read('index.html').includes('static-image'));
assert.ok(read('world3d.js').includes('kenney-cc0-office-furniture'));
console.log('Hub 3D ampliado, mobiliário CC0 e remoção da visão estática pass');
