import {CHAIR_ITEMS} from '../data/continuous/individual-chairs.js';
import {RULES} from '../data/continuous/catalog.js';
import {roster} from './staffing-management.js';
export const chairDefinition=id=>CHAIR_ITEMS.find(c=>c.id===id);
export function chairFor(state,id,sid){
 const receipt=state.receipts.filter(r=>r.sid===sid&&r.targetId===id&&chairDefinition(r.id)).at(-1);
 if(!receipt)return null;const definition=chairDefinition(receipt.id);
 return {id:receipt.id,name:definition.name,asset:definition.asset,level:receipt.level,assignedAt:receipt.chairAssignedAt??receipt.at,activeFrom:Math.max(receipt.chairAssignedAt??receipt.at,receipt.chairAvailableAt??receipt.at),healthBonus:receipt.level+1,effects:Object.fromEntries(Object.entries(definition.individualEffects).map(([k,v])=>[k,v*receipt.level]))};
}
export function chairCandidates(state,sid,chairId){
 return roster(state).filter(p=>p.home===sid&&state.staff?.[p.id]?.employment==='active'&&!state.receipts.some(r=>r.sid===sid&&r.targetId===p.id&&r.id!==chairId&&chairDefinition(r.id)));
}
export function chairBenefit(state,id,usedChairId){
 const person=roster(state).find(p=>p.id===id);if(!person||state.staff?.[id]?.employment!=='active')return null;
 const chair=chairFor(state,id,person.home);return chair?.id===usedChairId&&state.week+state.activeMs/RULES.weekMs>=chair.activeFrom?chair:null;
}
