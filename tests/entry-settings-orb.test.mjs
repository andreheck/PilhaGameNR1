import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {nextEntryStep} from '../simulation/entry-flow.js';import {collectiveHealth} from '../simulation/collective-health.js';
import {normalizePreferences,readPreferences,decorativeMotionAllowed,PREFERENCES_KEY,setPreferences} from '../ui/game-preferences.js';
import {orbPath,orbDynamics} from '../ui/collective-health-orb.js';
test('saved single characters and legacy duos skip automatic choice; unfinished hiring resumes without rechoosing',()=>{
 const s=L.ensureLiving(M.fresh()),raw=JSON.stringify(s);assert.equal(nextEntryStep(s),'heroes');assert.equal(JSON.stringify(s),raw);
 s.playerCharacterId='PILHA-H05';s.initialHiring={version:1,status:'pending'};assert.equal(nextEntryStep(s),'hiring');s.initialHiring.status='complete';assert.equal(nextEntryStep(s),'map');s.playerCharacterId=null;s.initialHiring=undefined;
 s.team={principal:'PILHA-H01',support:'PILHA-H02'};assert.equal(nextEntryStep(s),'map');s.initialHiring={version:1,status:'pending'};assert.equal(nextEntryStep(s),'hiring');s.initialHiring.status='complete';assert.equal(nextEntryStep(s),'map');s.team.support=s.team.principal;assert.equal(nextEntryStep(s),'heroes');
});
test('collective health is a weighted active human mean, handles empty teams, never mutates',()=>{
 const s=L.ensureLiving(M.fresh());Object.values(s.staff).forEach(p=>p.employment='leave');s.staff['NPC-01'].employment='active';s.staff['NPC-02'].employment='active';s.staff['NPC-01'].health=30;s.staff['NPC-02'].health=70;s.blueRobot=true;const before=JSON.stringify(s),rows=L.staffView(s).filter(p=>p.employment==='active'),r=collectiveHealth(s);assert.equal(r.count,2);assert.equal(r.score,Math.round(rows.reduce((n,p)=>n+p.health,0)/2));assert.equal(JSON.stringify(s),before);s.staff['NPC-01'].employment='resigned';s.staff['NPC-02'].employment='candidate';assert.equal(collectiveHealth(s).score,null);assert.equal(collectiveHealth(s).count,0);
});
test('actual occupied chair bonus is included only for its individual user',()=>{
 let s=L.ensureLiving(M.fresh());s=M.purchase(s,M.quote(s,'escritorio','cadeira-producao',{targetId:'NPC-01'})).state;const actors=[{id:'NPC-01',chairInUse:'cadeira-producao'}],rows=L.staffView(s,actors).filter(p=>p.employment==='active');assert.equal(collectiveHealth(s,actors).score,Math.round(rows.reduce((n,p)=>n+p.health,0)/rows.length));
});
test('preferences tolerate blocked/corrupt storage and cannot modify game state',()=>{
 assert.equal(PREFERENCES_KEY,'pilha-game-preferences-v1');assert.deepEqual(readPreferences({getItem(){throw Error('blocked');}}),{sound:true,motion:'system',showOrb:true});assert.deepEqual(readPreferences({getItem:()=>'{broken'}),normalizePreferences());assert.deepEqual(normalizePreferences({motion:'fast',sound:'yes',showOrb:false,budget:999}),{sound:true,motion:'system',showOrb:false});assert.equal(setPreferences({sound:false}).saved,false);assert.equal(decorativeMotionAllowed({motion:'system'},true),false);assert.equal(decorativeMotionAllowed({motion:'full'},true),true);assert.equal(decorativeMotionAllowed({motion:'reduced'},false),false);
});
test('orb geometry matches app curve and remains finite, bounded and stable at100',()=>{
 assert.equal(orbPath(100,0),orbPath(100,3));assert.notEqual(orbPath(30,0),orbPath(30,3));assert.equal(orbDynamics(0).primaryLobes,12);assert.equal(orbDynamics(0).secondaryLobes,26);assert.equal(orbDynamics(0).primaryAmplitude,10);for(const score of [null,-20,0,45,70,100,130,NaN]){const p=orbPath(score);assert.ok(!p.includes('NaN'));const coords=p.match(/-?\d+\.\d+/g).map(Number);assert.equal(coords.length,192);assert.ok(coords.every(n=>n>=19&&n<=141));}
});
