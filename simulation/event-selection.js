import {EVENT_CATALOG} from './event-catalog.js';
import {EMPLOYEES} from '../data/continuous/employees.js';

// Which low signals make a situation more plausible in the simulation.
const SIGNALS={
 equip:{f:['carga','seg'],p:1.05},sist:{f:['carga','relac'],p:1.1},gargalo:{f:['carga','auton'],p:1.2},
 mud:{f:['auton','seg','lider'],p:1.1},conf:{f:['relac','seg'],p:1.15},fadiga:{f:['carga'],p:1.35},
 corte:{f:['recon','lider'],p:.75},demanda:{f:['carga'],p:.9},retorno:{f:['auton','recon'],p:.8},
 risco:{f:['seg'],p:1.2},quase:{f:['seg','carga'],p:1.25},clima:{f:['carga','seg'],p:1.05},
 forn:{f:['carga','auton'],p:.85},saida:{f:['recon','relac','seg'],p:1.0},vaga:{f:['carga','recon'],p:.9},
 infl:{f:['recon'],p:.65},juros:{f:['recon','lider'],p:.65},vida:{f:['recon','relac'],p:.8},epid:{f:['carga','seg'],p:.7}
};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function employeeHealth(state,sid){
 const health=EMPLOYEES.filter(person=>person.home===sid).map(person=>state.staff?.[person.id]).filter(person=>person&&person.employment!=='resigned'&&person.employment!=='candidate'&&Number.isFinite(person.health)).map(person=>person.health);
 return health.length?health.reduce((sum,value)=>sum+value,0)/health.length:64;
}

function random01(seed){
 let next=(Math.imul(seed>>>0,1664525)+1013904223)>>>0;
 return {next,value:next/4294967296};
}
function chooseWeighted(entries,seed){
 const total=entries.reduce((sum,item)=>sum+item.weight,0);
 const draw=random01(seed);let cursor=draw.value*total;
 for(const entry of entries){cursor-=entry.weight;if(cursor<=0)return {item:entry.item,seed:draw.next};}
 return {item:entries.at(-1)?.item||null,seed:draw.next};
}
function sectorWeight(state,sid,profile,getMetrics,getValues){
 const score=getMetrics(state,sid).index,vals=getValues(state,sid);
 const deficits=(profile?.f||[]).reduce((n,id)=>n+Math.max(0,58-(vals[id]??58))/58,0);
 const healthPressure=Math.max(0,64-employeeHealth(state,sid))/64;
 return Math.max(.25,1+(100-score)/75+deficits*.75+healthPressure*.8);
}
function eventWeight(state,event,previousCategory,getValues){
 const profile=SIGNALS[event.id]||{f:[],p:1};let weight=profile.p;
 for(const sid of event.sec){const vals=getValues(state,sid),healthPressure=Math.max(0,64-employeeHealth(state,sid))/64;weight+=(profile.f.reduce((n,id)=>n+Math.max(0,58-(vals[id]??58))/58*.65,0)+healthPressure*.5)/event.sec.length;}
 if(event.prot){const coverage=event.sec.filter(sid=>state.receipts.some(r=>r.id===event.prot&&r.sid===sid)).length/event.sec.length;weight*=1.3-coverage*.58;}
 if(event.when==='invested'&&!state.receipts.length)return 0;
 if(previousCategory===event.c)weight*=.72;
 const sameChain=(state.events.history||[]).slice(-6).filter(row=>row.eventId===event.id).length;
 if(sameChain)weight*=Math.pow(.55,sameChain);
 const recentTags=(state.events.history||[]).slice(-12).flatMap(row=>row.tags||[]);
 // Hooks for the planned pay/overtime choices. No payroll or overtime mechanic is enabled yet.
 if(recentTags.includes('overtime:cut')){if(event.id==='fadiga')weight*=.78;if(event.id==='vida'||event.id==='vaga')weight*=1.18;}
 if(recentTags.includes('salary:cut')){if(event.id==='vida'||event.id==='saida'||event.id==='vaga')weight*=1.3;}
 return clamp(weight,.08,6);
}

/** Selects an event and affected sector from saved state, so the draw survives reloads/replays. */
export function chooseContextualEvent(state,{metrics:getMetrics,values:getValues}){
 const e=state.events,seen=new Set(e.seen||[]);
 let pool=EVENT_CATALOG.LIST.filter(event=>!seen.has(event.id)&&(event.when!=='invested'||state.receipts.length));
 if(!pool.length)pool=EVENT_CATALOG.LIST.filter(event=>event.when!=='invested'||state.receipts.length);
 if(!pool.length)return {event:null,sid:null,rng:e.rng>>>0};
 const previousCategory=e.history?.at(-1)?.categoryIndex;
 const candidate=chooseWeighted(pool.map(event=>({item:event,weight:eventWeight(state,event,previousCategory,getValues)})),e.rng>>>0);
 const event=candidate.item;
 const sector=chooseWeighted(event.sec.map(sid=>({item:sid,weight:sectorWeight(state,sid,SIGNALS[event.id],getMetrics,getValues)})),candidate.seed);
 return {event,sid:sector.item,rng:sector.seed};
}
