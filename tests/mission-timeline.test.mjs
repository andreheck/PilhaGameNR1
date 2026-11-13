import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCampaign,advanceCampaign,setCampaignRunning,evaluateCampaign,activateAbility,registerPurchase,readTimeline,writeTimeline,emptyTimeline,simulationDay,realMsForDays,CYCLE_MS,TIMELINE_KEY,isCycleComplete} from '../simulation/mission-timeline.js';
import {ABILITIES,abilityState,mayPersist} from '../simulation/hero-abilities.js';
import {CASES,outcome,completedCase,isUnlocked,KEY} from '../cases-data.js';
import {ETHICS_RULES} from '../simulation/case-ethics.js';
const pair={principal:'PILHA-H01',support:'PILHA-H02'};
const running=()=>setCampaignRunning(createCampaign('01',pair,['ergonomia','pausas']),true);
const best=c=>c.steps.map(s=>s.options.findIndex(o=>o[1]===25));
test('one real hour is exactly seven simulated days; 30 days exceed 4h',()=>{
 assert.equal(simulationDay(3600000),7);assert.equal(simulationDay(14400000),28);assert.equal(realMsForDays(30),15428572);assert.equal(CYCLE_MS,15428572);
 assert.equal(isCycleComplete(advanceCampaign(running(),14400000)),false);assert.equal(isCycleComplete(advanceCampaign(running(),CYCLE_MS)),true);
});
test('pause does not advance; no negative/NaN delta; bounded month',()=>{
 const a=createCampaign('01',pair);assert.equal(advanceCampaign(a,3600000).elapsedMs,0);
 for(const delta of [-1,NaN,Infinity,0])assert.equal(advanceCampaign(running(),delta).elapsedMs,0);
 const full=advanceCampaign(running(),CYCLE_MS*4);assert.equal(full.elapsedMs,CYCLE_MS);assert.deepEqual(full.checkpoints,[7,14,21,28,30]);assert.equal(full.status,'complete');
});
test('clock and evaluation are invariant to tick partition, no frame-dependent stacking',()=>{
 const all=advanceCampaign(running(),7200000);let chunks=running();for(let i=0;i<7200;i++)chunks=advanceCampaign(chunks,1000);
 assert.deepEqual(chunks,all);assert.deepEqual(evaluateCampaign(chunks),evaluateCampaign(all));
});
test('Director ability has delay, ramp, finite action, decay and cooldown',()=>{
 const start=activateAbility(running(),'diretor-reorganizacao');assert.equal(start.ok,true);const action=start.campaign.actions.at(-1);
 assert.equal(abilityState(action,0).phase,'preparing');assert.equal(abilityState(action,1).weight,0);assert.equal(abilityState(action,3).weight,1);
 assert.equal(abilityState(action,8).phase,'fading');assert.equal(abilityState(action,10).phase,'cooldown');assert.equal(abilityState(action,17).phase,'ready');
 assert.equal(activateAbility(start.campaign,'diretor-reorganizacao').error,'cooldown');
 const later=advanceCampaign(start.campaign,realMsForDays(17));assert.equal(activateAbility(later,'diretor-reorganizacao').ok,true);
});
test('only assigned approved active skill can be invoked, no invented other-hero powers',()=>{
 assert.equal(activateAbility(running(),'psychology-magic').ok,false);assert.equal(activateAbility(createCampaign('01',pair),'diretor-reorganizacao').ok,false);
 const c=setCampaignRunning(createCampaign('01',{principal:'PILHA-H02',support:'PILHA-H04'}),true);assert.equal(activateAbility(c,'diretor-reorganizacao').error,'hero-not-assigned');
});
test('permanence requires explicit exception or eligible power level strictly over 20',()=>{
 assert.equal(mayPersist({permanentEligible:true},20),false);assert.equal(mayPersist({permanentEligible:true},21),true);assert.equal(mayPersist({permanentEligible:false},30),false);assert.equal(mayPersist({approvedPermanentException:true},1),true);assert.ok(ABILITIES.every(a=>!mayPersist(a,1)));
});
test('resources ramp gradually, synergy is bounded, active effect can expire',()=>{
 const c=running(),zero=evaluateCampaign(c,0),mid=evaluateCampaign(c,15),end=evaluateCampaign(c,30);assert.equal(zero.axes.space,50);assert.ok(mid.axes.space>50&&mid.axes.space<end.axes.space);assert.ok(end.axes.people<=100);
 const active=activateAbility(c,'diretor-reorganizacao').campaign;assert.ok(evaluateCampaign(active,4).axes.operations>evaluateCampaign(c,4).axes.operations);assert.equal(evaluateCampaign(active,18).axes.operations,evaluateCampaign(c,18).axes.operations);
});
test('a late purchase matures relative to its purchase day; persistent inventory is idempotent',()=>{
 const c=advanceCampaign(setCampaignRunning(createCampaign('01',pair),true),realMsForDays(14));const newc=registerPurchase(c,'ergonomia').campaign;assert.equal(registerPurchase(newc,'ergonomia').campaign.inventory.length,1);assert.equal(evaluateCampaign(newc,14).axes.space,50);assert.ok(evaluateCampaign(newc,30).contributors.find(x=>x.id==='ergonomia').weight<1);
});
test('validated state tolerates invalid JSON and does not write real dates into elapsed time',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};for(const raw of ['invalid','null','[]','{"version":99}']){map.set(TIMELINE_KEY,raw);assert.deepEqual(readTimeline(storage),emptyTimeline());}
 const c=advanceCampaign(running(),10000),state={version:1,activeCaseId:'01',campaigns:{'01':c}};assert.equal(writeTimeline(storage,state),true);assert.equal(readTimeline(storage).campaigns['01'].elapsedMs,10000);assert.equal(writeTimeline(null,state),false);
});
test('Kimi P1: every flagged option blocks approval even with 3 perfect choices',()=>{
 for(const c of CASES){for(const rule of ETHICS_RULES[c.id]){const choices=best(c);choices[rule.step]=rule.option;const result=outcome(c.id,choices);assert.equal(result.passed,false,c.id+' '+rule.code);assert.ok(result.score<=49);assert.ok(result.violations.length);}}
});
test('perfect plans still score100 and require time for new timed missions; legacy achievements preserved',()=>{
 const plan=outcome('01',best(CASES[0]));assert.equal(plan.score,100);assert.equal(plan.passed,true);
 const data={[KEY('01')]:{completed:true,score:100,bestScore:100,timelineRequired:true},[TIMELINE_KEY]:{campaigns:{'01':running()}}};const read=k=>data[k];assert.equal(completedCase('01',read),false);assert.equal(isUnlocked(1,read),false);
 data[TIMELINE_KEY].campaigns['01']=advanceCampaign(running(),CYCLE_MS);assert.equal(isUnlocked(1,read),true);
 const legacy=k=>k===KEY('01')?{completed:true,score:100}:null;assert.equal(completedCase('01',legacy),true);
});
test('no instant advance button, immutable old financial catalog, visible shareholder strip',()=>{
 const s=fs.readFileSync(new URL('../play.js',import.meta.url),'utf8');assert.doesNotMatch(s,/data-act="advance-investment-day"/);assert.match(s,/initMissionControl/);assert.match(s,/INVENTÁRIO DE PREVENÇÃO E SST/);
 const ui=fs.readFileSync(new URL('../mission-control.js',import.meta.url),'utf8');assert.match(ui,/VOCÊ É O ACIONISTA/);assert.match(ui,/data-mission-principal/);assert.match(ui,/data-mission-support/);
});
