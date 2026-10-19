import {CASES,KEY,outcome} from './cases-data.js';
import {ETHICS_VERSION,ethicsViolations} from './simulation/case-ethics.js';
import {readTimeline,isCycleComplete} from './simulation/mission-timeline.js';
import {transactEconomy,applyXpRewards,publishProgression} from './simulation/hero-progression.js';
/** First correct/safe confirmation per case and assigned hero. Replay never farms XP. */
export function situationRewards(caseId,step,choices,campaign){
 const c=CASES.find(c=>c.id===caseId);if(!c||!campaign||campaign.caseId!==caseId||!Number.isInteger(step)||step<0||step>=c.steps.length)return [];
 const option=c.steps[step].options[choices?.[step]];
 if(!option||option[1]<20||ethicsViolations(caseId,choices).some(r=>r.step<=step))return [];
 return [campaign.team.principal,campaign.team.support].map(heroId=>({heroId,eventId:`xp1:${caseId}:step${step}:${heroId}`}));
}
export function completionRewards(caseId,record,campaign,companyState){
 if(!record?.timelineRequired||!record.completed||record.evaluationVersion!==ETHICS_VERSION||!isCycleComplete(campaign)||campaign.caseId!==caseId)return [];
 const choices=Array.from({length:4},(_,i)=>record.choice?.[i]);
 const result=outcome(caseId,choices,companyState);
 if(!result?.passed||result.violations.length)return [];
 return [campaign.team.principal,campaign.team.support].map(heroId=>({heroId,eventId:`xp1:${caseId}:case:${heroId}`}));
}
export async function awardRewards(storage,rewards){
 if(!rewards.length)return {ok:true,noWrite:true,count:0};
 const r=await transactEconomy(storage,s=>applyXpRewards(s,rewards,Date.now()));publishProgression(r);return r;
}
export async function reconcileCaseRewards(storage,caseId,companyState){
 try{const record=JSON.parse(storage.getItem(KEY(caseId))||'null'),campaign=readTimeline(storage).campaigns[caseId];return awardRewards(storage,completionRewards(caseId,record,campaign,companyState));}
 catch{return {ok:false,error:'invalid-record'};}
}
