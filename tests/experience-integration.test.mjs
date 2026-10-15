import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { CASE017_INITIAL, simulateCase017 } from '../simulation/case017.js';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const play = read('play.js');
const caseSource = read('case.js');
const casePage = read('caso017.html');
const css = read('case.css');

test('a central encaminha o Caso 017 para a jornada completa', () => {
  assert.match(play, /selected==='017'\)\{location\.assign\('\/caso017\.html'\)/);
  assert.match(casePage, /<script type="module" src="\/case\.js"><\/script>/);
});

test('o Caso 017 usa o motor simulado no dashboard', () => {
  assert.match(caseSource, /import \{ CASE017_INITIAL, simulateCase017 \}/);
  assert.match(caseSource, /deriveCase017SceneState/);
  assert.match(caseSource, /s\.sceneState=deriveCase017SceneState/);
  assert.match(caseSource, /s\.simulation=simulateCase017\(/);
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
  assert.match(world, /Math\.atan2\(dx,dz\)/);
  assert.match(world, /integrated-nr1-library/);
  assert.match(world, /libraryFurniture/);
  assert.match(play, /data-act=\"start-017\"/);
  assert.match(play, /stage-library/);
  assert.match(play, /chatScripts/);
  assert.match(play, /data-chat-choice/);
  assert.match(play, /chat-bubble/);
});

test('uma decisão estrutural produz consequências educativas em 30 dias', () => {
  const result = simulateCase017({
    actions: ['capacity', 'breaks', 'leaders'],
    evidence: ['schedule', 'reports', 'observation'],
    hypothesis: 'organization',
    monitoring: ['hours', 'return', 'results'],
    days: 30
  });

  assert.equal(result.days, 30);
  assert.ok(result.metrics.workload < CASE017_INITIAL.workload);
  assert.ok(result.metrics.rest < CASE017_INITIAL.rest);
  assert.ok(result.operational.overtime < result.initial.operational.overtime);
  assert.equal(result.violations.length, 0);
  assert.ok(result.feedback.length >= 1);
});
