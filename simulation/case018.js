import {getCompanyCaseModifier} from './company-state.js';
export const CASE018_INITIAL={silence:72,psychologicalSafety:28,learning:34,leadershipTrust:31};
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
export function simulateCase018(input={}){
 const choices=input.choices||{};const safe=choices.investigation==='protected'&&choices.reading==='environment'&&choices.action==='participation'&&choices.followup==='practice';
 const context=getCompanyCaseModifier(input.companyState,'018');
 const metrics={...CASE018_INITIAL,silence:clamp(CASE018_INITIAL.silence+context.silence),psychologicalSafety:clamp(CASE018_INITIAL.psychologicalSafety+context.psychologicalSafety),leadershipTrust:clamp(CASE018_INITIAL.leadershipTrust+context.leadershipTrust)};
 if(choices.investigation==='protected'){metrics.silence-=18;metrics.psychologicalSafety+=19}
 if(choices.reading==='environment'){metrics.silence-=12;metrics.learning+=18;metrics.leadershipTrust+=7}
 if(choices.action==='participation'){metrics.silence-=15;metrics.psychologicalSafety+=15;metrics.learning+=13}
 if(choices.followup==='practice'){metrics.silence-=10;metrics.learning+=15;metrics.leadershipTrust+=10}
 if(choices.investigation==='public'){metrics.silence+=8;metrics.psychologicalSafety-=12}
 if(choices.action==='exposure'){metrics.silence+=12;metrics.psychologicalSafety-=20;metrics.leadershipTrust-=12}
 Object.keys(metrics).forEach(k=>metrics[k]=clamp(metrics[k]));
 const violations=[];if(choices.investigation==='public'||choices.action==='exposure')violations.push('exposure');
 const score=clamp(45+(metrics.psychologicalSafety-CASE018_INITIAL.psychologicalSafety)*.8+(metrics.learning-CASE018_INITIAL.learning)*.45+(metrics.leadershipTrust-CASE018_INITIAL.leadershipTrust)*.35-(violations.length?25:0));
 return {caseId:'018',days:30,metrics,score,passed:score>=75,violations,companyModifier:context,feedback:safe?['A investigação protegeu a participação e tratou o silêncio como sinal do ambiente.','A liderança foi responsabilizada por práticas de reunião e aprendizagem sem culpa.']:['Reveja a estratégia: segurança psicológica não se produz por exposição, cobrança ou palestra isolada.']};
}
