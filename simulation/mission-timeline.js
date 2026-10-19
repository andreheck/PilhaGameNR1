/** Deterministic, synthetic gameplay clock. No clinical/statistical prediction. */
import {getHero, HERO_ROSTER} from '../hero-roster.js';
import {UPGRADES} from './investment.js';
import {ABILITIES, getAbility, abilityState} from './hero-abilities.js';
export const TIMELINE_KEY='pilha-mission-timeline-v1';
export const MODEL_VERSION='shareholder-1';
export const REAL_MS_PER_WEEK=3600000;
export const DAYS_PER_WEEK=7;
export const CYCLE_DAYS=30;
export const CYCLE_MS=Math.ceil(CYCLE_DAYS*REAL_MS_PER_WEEK/DAYS_PER_WEEK);
export const CHECKPOINT_DAYS=Object.freeze([7,14,21,28,30]);
export const CASE_IDS=Object.freeze(['01','02','03','04','05']);
export const BASE_AXES=Object.freeze({space:50,people:50,culture:50,operations:50});
export const AXIS_LABELS=Object.freeze({space:'Condições do espaço',people:'Condições das pessoas',culture:'Práticas e cultura',operations:'Organização operacional'});
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:a));
const copy=x=>JSON.parse(JSON.stringify(x));
export const simulationDay=ms=>Math.min(CYCLE_DAYS,Math.max(0,ms)*DAYS_PER_WEEK/REAL_MS_PER_WEEK);
export const realMsForDays=days=>Math.ceil(Math.max(0,days)*REAL_MS_PER_WEEK/DAYS_PER_WEEK);
const validPair=p=>p&&getHero(p.principal)&&getHero(p.support)&&p.principal!==p.support;
const ramp=(age,delay,days)=>{const t=clamp((age-delay)/days,0,1);return t*t*(3-2*t);};
export function emptyTimeline(){return {version:1,activeCaseId:null,campaigns:{}};}
export function createCampaign(caseId,pair,inventory=[],now=0){
 if(!CASE_IDS.includes(caseId)||!validPair(pair))throw new Error('invalid-campaign-team');
 const actions=ABILITIES.filter(a=>a.kind==='passive'&&[pair.principal,pair.support].includes(a.heroId)).map((a,i)=>({id:'passive-'+i,abilityId:a.id,atDay:0,powerLevel:1,permanent:false}));
 return {model:MODEL_VERSION,caseId,status:'paused',elapsedMs:0,team:{principal:pair.principal,support:pair.support},startedAt:now,updatedAt:now,actions,inventory:[...new Set(inventory)].filter(id=>UPGRADES.some(u=>u.id===id)).map(id=>({id,atDay:0,inherited:true})),checkpoints:[],baseline:{...BASE_AXES}};
}
/** Pure elapsed-time update; callers supply only active foreground time. */
export function advanceCampaign(campaign,activeDeltaMs){
 const next=copy(campaign);
 if(next.status!=='running'||!Number.isFinite(activeDeltaMs)||activeDeltaMs<=0)return next;
 next.elapsedMs=Math.min(CYCLE_MS,next.elapsedMs+activeDeltaMs);
 const day=simulationDay(next.elapsedMs);
 for(const mark of CHECKPOINT_DAYS)if(day>=mark&&!next.checkpoints.includes(mark))next.checkpoints.push(mark);
 if(next.elapsedMs>=CYCLE_MS)next.status='complete';
 return next;
}
export function setCampaignRunning(campaign,running){const next=copy(campaign);if(next.status!=='complete')next.status=running?'running':'paused';return next;}
export function registerPurchase(campaign,id){
 if(!UPGRADES.some(u=>u.id===id))return {ok:false,error:'unknown-resource'};
 const next=copy(campaign);
 if(next.inventory.some(r=>r.id===id))return {ok:true,campaign:next};
 next.inventory.push({id,atDay:simulationDay(next.elapsedMs),inherited:false});
 return {ok:true,campaign:next};
}
export function activateAbility(campaign,abilityId){
 const ability=getAbility(abilityId),day=simulationDay(campaign.elapsedMs);
 if(!ability||ability.kind!=='active')return {ok:false,error:'unknown-ability'};
 if(![campaign.team.principal,campaign.team.support].includes(ability.heroId))return {ok:false,error:'hero-not-assigned'};
 if(campaign.status!=='running')return {ok:false,error:'campaign-not-running'};
 const last=[...campaign.actions].reverse().find(a=>a.abilityId===abilityId);
 if(last&&day<abilityState(last,day).readyDay)return {ok:false,error:'cooldown'};
 const next=copy(campaign);
 next.actions.push({id:abilityId+'-'+next.actions.length,abilityId,atDay:day,powerLevel:1,permanent:false});
 return {ok:true,campaign:next};
}
/** Invented model coefficients are versioned and disclosed, never empirical values. */
export function evaluateCampaign(campaign,day=simulationDay(campaign.elapsedMs)){
 const shares=Object.fromEntries(Object.keys(BASE_AXES).map(k=>[k,[]])),contributors=[];
 const weights={};
 for(const item of campaign.inventory){
  const u=UPGRADES.find(u=>u.id===item.id);if(!u)continue;
  const weight=ramp(day-item.atDay,1,Math.max(1,u.days-1));weights[item.id]=weight;
  const physical=['ergonomia','clima-ventilacao','espaco-seguro'].includes(item.id);
  const effects={space:physical?0.12:0,people:Math.max(0,u.effects.wellbeing||0)/100,culture:Math.max(0,u.effects.trust||0)/100,operations:Math.max(0,-(u.effects.workload||0))/100};
  for(const [axis,b] of Object.entries(effects))if(b)shares[axis].push(clamp(b*weight,0,.35));
  contributors.push({kind:'resource',id:item.id,name:u.name,weight,phase:weight>=1?'matured':day-item.atDay<1?'preparing':'developing'});
 }
 // Explicit prototype synergy, only this pair. Bounded and not a medical inference.
 if(weights.ergonomia&&weights.pausas){const synergy=.03*Math.min(weights.ergonomia,weights.pausas);shares.people.push(synergy);shares.operations.push(synergy);contributors.push({kind:'synergy',id:'ergonomia-pausas',weight:synergy,name:'Ergonomia + pausas (hipótese de jogo)'});}
 for(const action of campaign.actions){
  const ability=getAbility(action.abilityId);if(!ability)continue;
  const state=abilityState(action,day),role=campaign.team.principal===ability.heroId?1:.6;
  for(const [axis,b] of Object.entries(ability.gapReduction||{}))if(shares[axis])shares[axis].push(clamp(b*state.weight*role,0,.35));
  contributors.push({kind:'ability',id:action.id,abilityId:ability.id,name:ability.name,heroId:ability.heroId,roleWeight:role,...state});
 }
 const axes={};
 for(const axis of Object.keys(BASE_AXES)){const baseline=clamp(campaign.baseline?.[axis]??50),remaining=shares[axis].reduce((v,s)=>v*(1-s),1);axes[axis]=Math.round((baseline+(100-baseline)*(1-remaining))*100)/100;}
 return {model:MODEL_VERSION,day,axes,contributors,synthetic:true};
}
export function sanitizeTimeline(value){
 const result=emptyTimeline();if(!value||value.version!==1||!value.campaigns)return result;
 for(const id of CASE_IDS){const c=value.campaigns[id];if(!c||c.model!==MODEL_VERSION||!validPair(c.team))continue;
  const clean=createCampaign(id,c.team,[],Number.isFinite(c.startedAt)?c.startedAt:0);
  clean.elapsedMs=clamp(c.elapsedMs,0,CYCLE_MS);clean.status=clean.elapsedMs>=CYCLE_MS?'complete':c.status==='running'?'running':'paused';
  clean.updatedAt=Number.isFinite(c.updatedAt)?c.updatedAt:0;
  clean.actions=Array.isArray(c.actions)?c.actions.slice(0,100).filter(a=>getAbility(a.abilityId)&&[c.team.principal,c.team.support].includes(getAbility(a.abilityId).heroId)&&Number.isFinite(a.atDay)&&a.atDay>=0&&a.atDay<=simulationDay(clean.elapsedMs)).map((a,i)=>({id:'action-'+i,abilityId:a.abilityId,atDay:a.atDay,powerLevel:1,permanent:false})):clean.actions;
  const seen=new Set();clean.inventory=Array.isArray(c.inventory)?c.inventory.filter(r=>UPGRADES.some(u=>u.id===r.id)&&!seen.has(r.id)&&seen.add(r.id)&&Number.isFinite(r.atDay)&&r.atDay>=0&&r.atDay<=simulationDay(clean.elapsedMs)).map(r=>({id:r.id,atDay:r.atDay,inherited:!!r.inherited})):[];
  clean.checkpoints=CHECKPOINT_DAYS.filter(d=>simulationDay(clean.elapsedMs)>=d);result.campaigns[id]=clean;
 }
 if(CASE_IDS.includes(value.activeCaseId)&&result.campaigns[value.activeCaseId])result.activeCaseId=value.activeCaseId;
 return result;
}
export function readTimeline(storage){try{const raw=storage?.getItem(TIMELINE_KEY);if(!raw||raw.length>150000)return emptyTimeline();return sanitizeTimeline(JSON.parse(raw));}catch{return emptyTimeline();}}
export function writeTimeline(storage,state){try{if(!storage)return false;storage.setItem(TIMELINE_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function isCycleComplete(campaign){return !!campaign&&campaign.model===MODEL_VERSION&&campaign.elapsedMs>=CYCLE_MS;}
