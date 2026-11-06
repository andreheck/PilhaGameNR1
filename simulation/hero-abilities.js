/** Gameplay parameters, NOT measured health effects. See docs/MOTOR-ESTATISTICO-TEMPORAL.md.
 * Director names and proposed percentages: docs/herois/diretor.md (PR22).
 * Delay/ramp/duration/cooldown are explicit design hypotheses for testing.
 * Other heroes have no approved individual abilities yet; do not fabricate them.
 */
export const ABILITY_VERSION = 'director-prototype-1';
export const ABILITIES = Object.freeze([
  Object.freeze({id:'diretor-visao-sistemica',heroId:'PILHA-H01',name:'Visão Sistêmica',kind:'passive',powerLevel:1,delayDays:2,rampDays:3,durationDays:30,decayDays:0,cooldownDays:0,gapReduction:{operations:0.08},target:'papel-autonomia',permanentEligible:false,approvedPermanentException:false,description:'Organiza a leitura de recursos e prioridades. Referência conceitual: +8% de eficiência; no protótipo atua sobre a margem operacional simulada, não sobre produtividade real.'}),
  Object.freeze({id:'diretor-reorganizacao',heroId:'PILHA-H01',name:'Reorganização Estratégica',kind:'active',powerLevel:1,delayDays:1,rampDays:2,durationDays:7,decayDays:2,cooldownDays:7,gapReduction:{operations:0.15},target:'lideranca',permanentEligible:false,approvedPermanentException:false,description:'Reduz temporariamente o impacto do gargalo operacional fictício. Não compra móveis, não altera a nota do caso e não substitui medidas de proteção.'})
]);
export const getAbility = id => ABILITIES.find(a=>a.id===id)||null;
export const mayPersist = (ability,powerLevel) => Boolean(ability && (ability.approvedPermanentException===true || (ability.permanentEligible===true && Number.isInteger(powerLevel) && powerLevel>20)));
const smooth = n => {const x=Math.max(0,Math.min(1,n));return x*x*(3-2*x);};
export function abilityState(action,day){
  const ability=getAbility(action.abilityId);
  if(!ability)return {phase:'invalid',weight:0,readyDay:Infinity};
  const onset=action.atDay+ability.delayDays,end=onset+ability.durationDays;
  const permanent=mayPersist(ability,action.powerLevel) && action.permanent===true;
  const readyDay=permanent?Infinity:end+ability.decayDays+ability.cooldownDays;
  if(day<onset)return {phase:'preparing',weight:0,onset,end,readyDay,remainingDays:onset-day};
  const ramp=smooth((day-onset)/Math.max(0.001,ability.rampDays));
  if(permanent||day<end)return {phase:'active',weight:ramp,onset,end,readyDay,remainingDays:permanent?null:end-day,permanent};
  if(day<end+ability.decayDays)return {phase:'fading',weight:1-smooth((day-end)/ability.decayDays),onset,end,readyDay,remainingDays:end+ability.decayDays-day};
  return {phase:day<readyDay?'cooldown':'ready',weight:0,onset,end,readyDay,remainingDays:Math.max(0,readyDay-day)};
}
