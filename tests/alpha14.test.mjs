import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CASES,KEY,outcome,isUnlocked,REQUIRED_SCORE,completedCase} from '../cases-data.js';
assert.equal(CASES.length,5);
assert.equal(new Set(CASES.map(c=>c.id)).size,5);
for(const c of CASES){assert.equal(c.steps.length,4,c.id);for(const step of c.steps){assert.equal(step.options.length,3);assert.ok(step.question.length>8)}assert.equal(outcome(c.id,[1,0,0,0])!==null,true);}
for(const c of CASES){const best=c.steps.map(s=>s.options.findIndex(x=>x[1]===Math.max(...s.options.map(y=>y[1]))));const good=outcome(c.id,best);assert.equal(good.score,100,c.id);assert.equal(good.passed,true,c.id);const worst=c.steps.map(s=>s.options.findIndex(x=>x[1]===Math.min(...s.options.map(y=>y[1]))));const bad=outcome(c.id,worst);assert.equal(bad.passed,false,c.id);assert.ok(bad.score<75)}
let store=new Map();const read=k=>store.get(k);assert.equal(isUnlocked(0,read),true);assert.equal(isUnlocked(1,read),false);
store.set('pilha-case01-v2',{completed:true,score:84});assert.equal(isUnlocked(1,read),true);assert.equal(isUnlocked(2,read),false);
store.set(KEY('02'),{completed:true,score:72});assert.equal(isUnlocked(2,read),false);
store.set(KEY('02'),{completed:true,score:76});assert.equal(isUnlocked(2,read),true);
for(let i=2;i<CASES.length;i++){store.set(KEY(CASES[i].id),{completed:true,score:78});assert.equal(completedCase(CASES[i].id,read),true)}
assert.equal(REQUIRED_SCORE,75);
const p=new URL('file://'+process.cwd()+'/');
for(const path of ['index.html','play.css','play.js','world3d.js','cases-data.js','assets/actors/operadora.glb','assets/actors/psicologa.glb','assets/actors/psiquiatra.glb'])assert.ok(fs.existsSync(path),path);
for(const actor of ['operadora','psicologa','psiquiatra']){const b=fs.readFileSync(`assets/actors/${actor}.glb`);assert.equal(b.toString('ascii',0,4),'glTF');assert.ok(b.byteLength<3_000_000)}
const css=fs.readFileSync('play.css','utf8');assert.match(css,/height:100dvh/);assert.match(css,/overflow:hidden/);assert.match(css,/prefers-reduced-motion/);
const world=fs.readFileSync('world3d.js','utf8');assert.match(world,/AnimationMixer/);assert.match(world,/crossFadeFrom/);assert.match(world,/goalX/);assert.match(world,/regionFx/);assert.match(world,/gestor-mentor-prototipo/);assert.match(world,/\/assets\/\$\{a\.path\}/);assert.doesNotMatch(world,/loader\.load\(`\/actors\//);
console.log('Alpha 1.4: 5 casos, 100 pts, bloqueio sequencial, progresso legado, GLBs, animacoes, CSS PASS');

// Preserve earned progression while replaying an already completed case.
store=new Map([[KEY('01'),{completed:false,bestScore:88,choice:{0:1}}]]);assert.equal(completedCase('01',read),true);assert.equal(isUnlocked(1,read),true);
