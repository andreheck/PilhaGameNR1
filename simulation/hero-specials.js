/** Continuous special powers. Four simulated weeks per hero, approved by PM. */
import {ITEMS,RULES} from '../data/continuous/catalog.js';
export const SPECIALS={
 'PILHA-H05':{name:'Singularidade de Transformação',categories:['Trabalho','Ambiente','Condições'],rate:.2},
 'PILHA-H06':{name:'Potencial Coletivo',categories:['Liderança','Saúde Mental'],rate:.2}
};
export const specialTime=s=>s.week+s.activeMs/RULES.weekMs;
export function specialStatus(s,id){const row=s.heroSpecials?.[id],now=specialTime(s);return {ready:!row||now>=row.at+4,remaining:row?Math.max(0,row.at+4-now):0,until:row?.at+4};}
export function eligibleSpecialTargets(s,id){const def=SPECIALS[id];return def?s.receipts.map((r,index)=>({r,index,item:ITEMS.find(i=>i.id===r.id)})).filter(x=>def.categories.includes(x.item?.category)):[];}
export function validateSpecials(s){if(s.heroSpecials===undefined)return;if(!s.heroSpecials||Array.isArray(s.heroSpecials)||typeof s.heroSpecials!=='object')throw Error('invalid-specials');for(const [id,r] of Object.entries(s.heroSpecials)){const allowed=new Set(eligibleSpecialTargets(s,id).map(x=>x.index));if(!SPECIALS[id]||!r||!Number.isFinite(r.at)||r.at<1||r.at>specialTime(s)||!Array.isArray(r.targets)||!r.targets.length||r.targets.length>3||new Set(r.targets).size!==r.targets.length||r.targets.some(i=>!Number.isInteger(i)||!allowed.has(i)))throw Error('invalid-specials');}}
export function activateSpecial(state,id,targets){if(!SPECIALS[id]||![state.team?.principal,state.team?.support,state.playerCharacterId].includes(id))return {ok:false,error:'special-not-selected'};if(!specialStatus(state,id).ready)return {ok:false,error:'special-cooldown'};const allowed=new Set(eligibleSpecialTargets(state,id).map(x=>x.index));if(!Array.isArray(targets)||!targets.length||targets.length>3||new Set(targets).size!==targets.length||targets.some(i=>!allowed.has(i)))return {ok:false,error:'special-targets'};const s=structuredClone(state);s.heroSpecials={...s.heroSpecials,[id]:{at:specialTime(s),targets:[...targets]}};return {ok:true,state:s};}
export function specialMultiplier(s,index){let rate=0;for(const [id,r] of Object.entries(s.heroSpecials||{})){if(SPECIALS[id]&&specialTime(s)>=r.at&&specialTime(s)<r.at+4&&r.targets.includes(index))rate=Math.max(rate,SPECIALS[id].rate);}return 1+rate;}
