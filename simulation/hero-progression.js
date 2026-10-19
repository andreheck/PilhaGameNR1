/** Fictional local-game economy v1. No payment, health data, or electron minting. */
import {HERO_ROSTER,getHero} from '../hero-roster.js';
import {BUDGET_KEY,initialInvestmentState} from './investment.js';
export const PROGRESSION_VERSION=1;
export const LEVEL_CAP=30;
export const XP_REWARDS=Object.freeze({situation:25,case:150});
const nat=x=>Number.isSafeInteger(x)&&x>=0;
export const nextLevelXp=level=>100+50*(level-1);
export function xpThreshold(level){const n=Math.max(0,Math.min(LEVEL_CAP,Math.floor(level))-1);return 100*n+25*n*(n-1);}
export function levelFromXp(xp){let level=1;while(level<LEVEL_CAP&&xp>=xpThreshold(level+1))level++;return level;}
export const trainingPrice=level=>level>=LEVEL_CAP?null:500+150*(level-1);
export const levelEffectMultiplier=level=>1+0.02*(Math.max(1,Math.min(LEVEL_CAP,Math.floor(Number(level)||1)))-1);
export function emptyProgression(){return {version:PROGRESSION_VERSION,spentCredits:0,heroes:{},claims:{},revision:0};}
function validProgression(p){
 if(p==null)return true;
 if(p.version!==1||!nat(p.spentCredits)||!p.heroes||Array.isArray(p.heroes)||typeof p.heroes!=='object'||!p.claims||Array.isArray(p.claims)||typeof p.claims!=='object'||Object.keys(p.claims).length>180)return false;
 for(const [id,h] of Object.entries(p.heroes))if(!getHero(id)||!h||!nat(h.earnedXp)||!nat(h.trainingXp)||h.earnedXp+h.trainingXp>1000000)return false;
 return Object.entries(p.claims).every(([id,c])=>/^xp1:(01|02|03|04|05):(step[0-3]|case):PILHA-H0[1-6]$/.test(id)&&c&&nat(c.xp)&&Number.isFinite(c.at));
}
export function readEconomy(storage){
 try{
  if(!storage?.getItem)return {ok:false,error:'storage-unavailable'};
  const raw=storage.getItem(BUDGET_KEY);if(raw&&raw.length>250000)return {ok:false,error:'invalid-economy'};
  const value=raw?JSON.parse(raw):initialInvestmentState();
  if(!value||![1,2].includes(value.version)||!nat(value.budget)||!nat(value.spent)||!Array.isArray(value.upgrades)||!validProgression(value.heroProgression))return {ok:false,error:'invalid-economy'};
  return {ok:true,state:{...value,heroProgression:value.heroProgression||emptyProgression()}};
 }catch{return {ok:false,error:'invalid-economy'};}
}
export function heroProgress(state,id){
 if(!getHero(id))return null;
 const h=state?.heroProgression?.heroes?.[id]||{earnedXp:0,trainingXp:0};
 const totalXp=h.earnedXp+h.trainingXp,level=levelFromXp(totalXp),floor=xpThreshold(level),ceil=level<LEVEL_CAP?xpThreshold(level+1):floor;
 return {...h,totalXp,level,xpInLevel:Math.max(0,totalXp-floor),xpNeeded:Math.max(0,ceil-totalXp),xpSpan:ceil-floor,cost:trainingPrice(level),atCap:level>=LEVEL_CAP};
}
export function heroLevel(storage,id){const e=readEconomy(storage);return e.ok?heroProgress(e.state,id)?.level||1:1;}
export function heroLevelMap(storage){return Object.fromEntries(HERO_ROSTER.map(h=>[h.id,heroLevel(storage,h.id)]));}
export function buyHeroLevel(state,id,expectedLevel,now=0){
 if(!getHero(id))return {ok:false,error:'unknown-hero'};
 const before=heroProgress(state,id);if(before.level!==expectedLevel)return {ok:false,error:'stale-quote'};
 if(before.atCap)return {ok:false,error:'max-level'};
 if(state.budget<before.cost)return {ok:false,error:'insufficient-budget'};
 const next=JSON.parse(JSON.stringify(state)),p=next.heroProgression||(next.heroProgression=emptyProgression());
 p.heroes[id]={earnedXp:before.earnedXp,trainingXp:before.trainingXp+before.xpNeeded};
 p.spentCredits+=before.cost;p.revision=(p.revision||0)+1;
 next.budget-=before.cost;next.updated=now;
 return {ok:true,state:next,heroId:id,cost:before.cost,before:before.level,after:before.level+1,trainingXp:before.xpNeeded};
}
/** Rewards arrive from canonical case evaluation, not from UI-supplied amounts. */
export function applyXpRewards(state,rewards,now=0){
 const next=JSON.parse(JSON.stringify(state)),p=next.heroProgression||(next.heroProgression=emptyProgression());let count=0,awarded=0;
 for(const r of rewards){
  if(!getHero(r.heroId)||!/^xp1:(01|02|03|04|05):(step[0-3]|case):PILHA-H0[1-6]$/.test(r.eventId)||!r.eventId.endsWith(':'+r.heroId))return {ok:false,error:'invalid-reward'};
  const amount=r.eventId.includes(':case:')?XP_REWARDS.case:XP_REWARDS.situation;
  if(p.claims[r.eventId])continue;
  const h=heroProgress(next,r.heroId);p.heroes[r.heroId]={earnedXp:h.earnedXp+amount,trainingXp:h.trainingXp};
  p.claims[r.eventId]={xp:amount,at:Number.isFinite(now)?now:0};count++;awarded+=amount;
 }
 if(count)p.revision=(p.revision||0)+1;
 return {ok:true,state:next,count,awarded,noWrite:count===0};
}
/** One atomic setItem owns BOTH the budget debit and level/XP change. */
export function commitEconomy(storage,reducer){
 const loaded=readEconomy(storage);if(!loaded.ok)return loaded;
 const result=reducer(loaded.state);if(!result.ok||result.noWrite)return result;
 try{storage.setItem(BUDGET_KEY,JSON.stringify(result.state));return result;}
 catch{return {ok:false,error:'storage-unavailable'};}
}
let queue=Promise.resolve();
export function transactEconomy(storage,reducer){
 const run=()=>commitEconomy(storage,reducer);
 if(globalThis.navigator?.locks)return navigator.locks.request('pilha-economy',run).catch(()=>({ok:false,error:'transaction-unavailable'}));
 // Legacy fallback is single-tab only; this prototype is NOT an authoritative wallet.
 const result=queue.then(run,run);queue=result.catch(()=>{});return result;
}
export function publishProgression(result){if(result.ok&&!result.noWrite&&globalThis.document)document.dispatchEvent(new CustomEvent('pilha:progression-changed',{detail:{heroId:result.heroId||null,count:result.count||0}}));}

export function resetStructuralInvestments(state){return {...initialInvestmentState(),budget:state.budget+state.spent,heroProgression:state.heroProgression||emptyProgression()};}
