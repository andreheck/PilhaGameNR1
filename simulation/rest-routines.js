/** Deterministic two-day rota. Temporary scores are derived, never added to saves. */
import {RULES,ITEMS} from '../data/continuous/catalog.js';
import {stage} from './improvement-lifecycle.js';
import {receiptEffectPhase} from './effect-lifecycle.js';
export const ROUTINE_PERIOD=RULES.weekMs*2/7;
export function routinePhase(elapsed,index,count=16){
 const phase=((elapsed/ROUTINE_PERIOD-index/count)%1+1)%1;
 const scale=16/count;const stage=phase<.12*scale?'outbound':phase<.20*scale?'rest':phase<.32*scale?'return':phase<.50*scale?'afterglow':'work';
 return {phase,stage,offset:index/count,scale,progress:stage==='outbound'?phase/(.12*scale):stage==='return'?(phase-.20*scale)/(.12*scale):0};
}
const weight=(r,c,s)=>(r.lifecycle?stage(r,s.week,c).progress:receiptEffectPhase(r,c.timing,s.week).progress);
export function restResources(s){
 const active=s.receipts.filter(r=>r.sid==='restauracao').map(r=>({r,c:ITEMS.find(c=>c.id===r.id)})).filter(x=>x.c&&weight(x.r,x.c,s)>0);
 const spaces=['patio',...active.filter(x=>x.c.capacity).flatMap(x=>Array(x.c.capacity).fill(x.c.space))].slice(0,6);
 const environment=Math.min(4,1+active.reduce((n,x)=>n+(x.c.factors.carga||0)*.12*weight(x.r,x.c,s)*RULES.effects[x.r.level-1]*(1+(x.r.bonus||0)),0));
 const social=Math.min(3,active.reduce((n,x)=>n+(x.c.factors.relac||0)*.15*weight(x.r,x.c,s)*RULES.effects[x.r.level-1]*(1+(x.r.bonus||0)),0));
 return {spaces,environment,social};
}
export function routineRows(s,people){
 const elapsed=(s.week-1)*RULES.weekMs+s.activeMs,resources=restResources(s);
 const ordinal=p=>(p.id.startsWith('NOVO-')?16:0)+Number(p.id.replace(/\D/g,''))-1;const count=Math.max(16,...people.map(p=>ordinal(p)+1));
 const rows=people.map((p,i)=>{const r=routinePhase(elapsed,ordinal(p),count);return {...r,id:p.id,sid:p.home,index:i,space:resources.spaces[i%resources.spaces.length]};});
 for(const r of rows){const influenced=['rest','return','afterglow'].includes(r.stage),company=rows.some(x=>x.id!==r.id&&x.stage==='rest'&&x.space===r.space);r.environmentBonus=influenced?resources.environment:0;r.socialBonus=influenced?resources.social+(company?1:0):0;r.healthBonus=Math.min(8,r.environmentBonus+r.socialBonus);}
 return rows;
}
