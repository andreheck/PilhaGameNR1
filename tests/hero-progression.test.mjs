import test from 'node:test';import assert from 'node:assert/strict';
import {BUDGET_KEY,initialInvestmentState,applyUpgrade} from '../simulation/investment.js';
import {emptyProgression,heroProgress,buyHeroLevel,applyXpRewards,readEconomy,commitEconomy,transactEconomy,resetStructuralInvestments,xpThreshold,levelFromXp,trainingPrice,levelEffectMultiplier} from '../simulation/hero-progression.js';
import {createCampaign,setCampaignRunning,advanceCampaign,CYCLE_MS,activateAbility,evaluateCampaign,sanitizeTimeline} from '../simulation/mission-timeline.js';
import {situationRewards,completionRewards} from '../hero-rewards.js';
import {abilityState,mayPersist,getAbility} from '../simulation/hero-abilities.js';
import {ETHICS_VERSION} from '../simulation/case-ethics.js';
const H='PILHA-H01',pair={principal:H,support:'PILHA-H02'};
const initial=()=>({...initialInvestmentState(),heroProgression:emptyProgression()});
function storage(state=initial()){const map=new Map([[BUDGET_KEY,JSON.stringify(state)],['pilha-hero-teams-v1','unchanged-duo'],['pilha-case01-v2','unchanged-old-case']]);return {map,getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('level curve is bounded and both XP sources are explicit',()=>{
 assert.equal(xpThreshold(1),0);assert.equal(xpThreshold(2),100);assert.equal(xpThreshold(3),250);assert.equal(levelFromXp(99),1);assert.equal(levelFromXp(100),2);assert.equal(levelFromXp(999999),30);assert.equal(trainingPrice(1),500);assert.equal(trainingPrice(2),650);assert.equal(trainingPrice(30),null);
 const s=initial();s.heroProgression.heroes[H]={earnedXp:25,trainingXp:0};const r=buyHeroLevel(s,H,1,100);assert.equal(r.cost,500);assert.equal(r.state.budget,9500);assert.deepEqual(r.state.heroProgression.heroes[H],{earnedXp:25,trainingXp:75});assert.equal(heroProgress(r.state,H).level,2);assert.equal(s.budget,10000);
});
test('insufficient funds, stale quote, unknown identity and cap do not mutate',()=>{
 let s=initial();s.budget=499;assert.equal(buyHeroLevel(s,H,1).error,'insufficient-budget');s.budget=10000;s=buyHeroLevel(s,H,1).state;const before=JSON.stringify(s);assert.equal(buyHeroLevel(s,H,1).error,'stale-quote');assert.equal(buyHeroLevel(s,'unknown',1).error,'unknown-hero');assert.equal(JSON.stringify(s),before);s.heroProgression.heroes[H]={earnedXp:xpThreshold(30),trainingXp:0};assert.equal(buyHeroLevel(s,H,30).error,'max-level');
});
test('one write atomically commits training + budget, failure gives neither',()=>{
 const st=storage();const result=commitEconomy(st,s=>buyHeroLevel(s,H,1,11));assert.equal(result.ok,true);assert.equal(readEconomy(st).state.budget,9500);assert.equal(heroProgress(readEconomy(st).state,H).level,2);assert.equal(st.map.get('pilha-hero-teams-v1'),'unchanged-duo');
 const broken=storage(),before=broken.map.get(BUDGET_KEY);broken.setItem=()=>{throw Error('quota')};assert.equal(commitEconomy(broken,s=>buyHeroLevel(s,H,1)).ok,false);assert.equal(broken.map.get(BUDGET_KEY),before);
 for(const raw of ['badJSON','null','{"version":2,"budget":-1,"spent":0,"upgrades":[]}','{"version":2,"budget":10000,"spent":0,"upgrades":[],"heroProgression":{"version":98}}']){broken.map.set(BUDGET_KEY,raw);assert.equal(commitEconomy(broken,s=>buyHeroLevel(s,H,1)).ok,false);assert.equal(broken.map.get(BUDGET_KEY),raw);}
});
test('replayed training uses expected level; separate purchases share newest budget',async()=>{
 const st=storage();const [a,b]=await Promise.all([transactEconomy(st,s=>buyHeroLevel(s,H,1)),transactEconomy(st,s=>buyHeroLevel(s,H,1))]);assert.equal([a,b].filter(x=>x.ok).length,1);assert.equal(readEconomy(st).state.budget,9500);
 const result=commitEconomy(st,s=>({ok:true,state:applyUpgrade(s,'ergonomia',10)}));assert.equal(result.state.budget,7700);assert.equal(heroProgress(result.state,H).level,2);
 const reset=resetStructuralInvestments(result.state);assert.equal(reset.budget,9500);assert.equal(reset.spent,0);assert.equal(reset.heroProgression.spentCredits,500);assert.equal(heroProgress(reset,H).level,2);
});
test('safe confirmed situation rewards frozen assigned duo only; no XP for harmful option',()=>{
 const c=createCampaign('01',pair),good=situationRewards('01',0,{0:1},c);assert.equal(good.length,2);let s=applyXpRewards(initial(),good,100);assert.equal(heroProgress(s.state,H).earnedXp,25);assert.equal(s.state.budget,10000);const again=applyXpRewards(s.state,good,101);assert.equal(again.count,0);assert.equal(again.noWrite,true);assert.equal(situationRewards('01',0,{0:2},c).length,0);assert.equal(situationRewards('01',1,{0:2,1:0},c).length,0);assert.equal(situationRewards('01',0,{0:1},null).length,0);assert.equal(applyXpRewards(initial(),[{heroId:H,eventId:'random',xp:90000}]).ok,false);
});
test('case XP requires 30 days + new approved safe plan; elapsed time alone never awards',()=>{
 let c=setCampaignRunning(createCampaign('01',pair),true);const record={timelineRequired:true,completed:true,evaluationVersion:ETHICS_VERSION,choice:{0:1,1:0,2:0,3:1}};assert.equal(completionRewards('01',record,c).length,0);c=advanceCampaign(c,CYCLE_MS);const rewards=completionRewards('01',record,c);assert.equal(rewards.length,2);assert.equal(heroProgress(applyXpRewards(initial(),rewards).state,H).earnedXp,150);assert.equal(completionRewards('01',{...record,choice:{...record.choice,3:2}},c).length,0);assert.equal(completionRewards('01',{...record,timelineRequired:false},c).length,0);
});
test('hero level snapshots affect only model strength, never delay, duration or permanence',()=>{
 let c=setCampaignRunning(createCampaign('01',pair,[],0,{[H]:10}),true);const active=activateAbility(c,'diretor-reorganizacao',{[H]:21});assert.equal(active.campaign.actions.at(-1).heroLevel,21);assert.equal(active.campaign.actions.at(-1).powerLevel,1);assert.equal(active.campaign.elapsedMs,0);
 const phase=abilityState(active.campaign.actions.at(-1),0);assert.equal(phase.phase,'preparing');assert.equal(phase.onset,1);assert.equal(mayPersist(getAbility('diretor-reorganizacao'),21),false);assert.equal(levelEffectMultiplier(1),1);assert.ok(Math.abs(levelEffectMultiplier(30)-1.58)<1e-10);
 const restored=sanitizeTimeline({version:1,activeCaseId:'01',campaigns:{'01':active.campaign}}).campaigns['01'];assert.equal(restored.actions.at(-1).heroLevel,21);assert.equal(restored.actions.at(-1).permanent,false);assert.deepEqual(evaluateCampaign(active.campaign,5).axes,evaluateCampaign(restored,5).axes);assert.deepEqual(evaluateCampaign(active.campaign,5).contributors.map(x=>x.phase),evaluateCampaign(restored,5).contributors.map(x=>x.phase));
});
