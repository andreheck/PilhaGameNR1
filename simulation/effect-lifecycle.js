/** Deterministic effect timeline for new purchases. Existing receipts without
 * effectPlan remain on the original C3 delay/ramp rules; never reinterpret saves.
 * One simulated operating month is four seven-day game weeks (28 days).
 * Monthly means checkpoint/maintenance in the simulation, NOT recurring billing.
 */
export const MONTH_WEEKS=4;
const int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
export function validateEffectPlan(p){
 if(!p||p.version!==1||!['imediato','tardio'].includes(p.onset)||
  !int(p.delayWeeks,0,52)||(p.onset==='imediato'&&p.delayWeeks!==0)||
  (p.onset==='tardio'&&p.delayWeeks===0)||
  !['permanente','temporario'].includes(p.persistence)||
  (p.persistence==='temporario'?!int(p.durationWeeks,1,260):p.durationWeeks!==null)||
  !['continuo','mensal'].includes(p.cadence)||
  !['instantaneo','progressivo'].includes(p.progression)||
  (p.progression==='progressivo'?!int(p.growthWeeks,1,104):p.growthWeeks!==0))throw Error('invalid-effect-plan');
 return p;
}
export function effectPhase(plan,at,week){
 validateEffectPlan(plan);
 const startWeek=at+plan.delayWeeks,age=week-startWeek;
 const endWeek=plan.persistence==='temporario'?startWeek+plan.durationWeeks:null;
 const base={startWeek,endWeek,months:0,progress:0,remainingWeeks:endWeek===null?null:Math.max(0,endWeek-week)};
 if(age<0)return {...base,phase:'agendado',nextMilestoneWeek:startWeek};
 if(endWeek!==null&&week>=endWeek)return {...base,phase:'expirado',remainingWeeks:0,nextMilestoneWeek:null};
 const completedMonths=Math.floor(age/MONTH_WEEKS);
 const countedWeeks=plan.cadence==='mensal'?(completedMonths+1)*MONTH_WEEKS:age+1;
 const strength=plan.progression==='instantaneo'?1:Math.min(1,countedWeeks/plan.growthWeeks);
 const nextProgress=plan.progression==='progressivo'&&strength<1?
   (plan.cadence==='mensal'?startWeek+(completedMonths+1)*MONTH_WEEKS:week+1):null;
 return {...base,phase:'ativo',progress:strength,months:completedMonths+1,
   nextMilestoneWeek:nextProgress===null?endWeek:endWeek===null?nextProgress:Math.min(nextProgress,endWeek)};
}
export function legacyEffectPhase(timing,at,week){
 const startWeek=at+timing.delay,age=week-startWeek;
 if(age<0)return {phase:'agendado',progress:0,startWeek,endWeek:null,nextMilestoneWeek:startWeek,remainingWeeks:null,legacy:true};
 const progress=timing.ramp?Math.max(0,Math.min(1,age/timing.ramp)):1;
 return {phase:progress>0?'ativo':'agendado',progress,startWeek,endWeek:null,
   nextMilestoneWeek:progress>=1?null:week+1,remainingWeeks:null,legacy:true};
}
export function receiptEffectPhase(receipt,timing,week){
 return receipt.effectPlan?effectPhase(receipt.effectPlan,receipt.renewedAt??receipt.at,week)
   :legacyEffectPhase(timing,receipt.at,week);
}
export function effectLabels(plan){
 validateEffectPlan(plan);
 return [
  plan.onset==='imediato'?'Início imediato':`Início após ${plan.delayWeeks} semana(s)`,
  plan.persistence==='permanente'?'Benefício permanente':`Benefício temporário · ${plan.durationWeeks} semana(s)`,
  plan.cadence==='mensal'?'Revisão a cada 4 semanas (mês simulado)':'Efeito contínuo',
  plan.progression==='progressivo'?(`Progressão ${plan.cadence==='mensal'?'mensal':'semanal'} até ${plan.growthWeeks} semanas`):'Aplicação integral na ativação'
 ];
}
