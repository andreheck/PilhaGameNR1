/** Simulated workplace consequences. These are game thresholds, never medical diagnoses or INSS eligibility decisions. */
import {EMPLOYEES} from '../data/continuous/employees.js';
export const WORKFORCE_RULES=Object.freeze({warningHealth:52,warningEnvironment:38,leaveHealth:43,severeHealth:30,resignHealth:31,resignEnvironment:28,consecutiveLeaveWeeks:2,consecutiveResignWeeks:5,leaveWeeks:[2,4,12],returnProtectionWeeks:3});
const clamp=x=>Math.max(0,Math.min(100,x));
export function initializeWorkforce(s){
 s.staff??={};s.workforceLog??=[];
 for(const p of EMPLOYEES){const v=s.staff[p.id];if(!v)continue;v.employment??='active';v.lowWeeks??=0;v.criticalWeeks??=0;v.returnProtectedUntil??=0;v.leaveUntil??=null;v.leaveStarted??=null;v.leaveDuration??=null;v.reason??=null;}
 return s;
}
export const available=a=>!a||a.employment===undefined||a.employment==='active';
export function workforceSummary(s){initializeWorkforce(s);const counts={active:0,leave:0,resigned:0,candidates:0,vacancies:0};for(const p of EMPLOYEES){const a=s.staff[p.id];if(a?.employment==='leave')counts.leave++;else if(a?.employment==='resigned')counts.resigned++;else if(a?.employment==='candidate')counts.candidates++;else if(a?.employment==='active'||!a?.employment)counts.active++;}counts.vacancies=counts.leave+counts.resigned+counts.candidates;return counts;}
export function workforceWeek(s,getIndex){
 initializeWorkforce(s);const news=[];
 function log(id,kind,description,duration=0){const item={id,kind,description,duration,week:s.week};s.workforceLog.push(item);news.push(item);}
 for(const p of EMPLOYEES){const a=s.staff[p.id];if(!a)continue;const env=getIndex(p.home);
  if(['resigned','candidate','onboarding'].includes(a.employment))continue;
  if(a.employment==='leave'){
   a.previous=a.health;a.health=clamp(a.health+Math.max(2,(65-a.health)*.2));a.week=s.week;
   if(s.week>=a.leaveUntil){a.employment='active';a.returnProtectedUntil=s.week+WORKFORCE_RULES.returnProtectionWeeks;a.leaveUntil=null;a.lowWeeks=0;a.criticalWeeks=0;a.reason=null;log(p.id,'return',p.name+' voltou ao trabalho com acolhimento e acompanhamento.');}
   continue;
  }
  const poor=a.health<WORKFORCE_RULES.warningHealth||env<WORKFORCE_RULES.warningEnvironment;
  const critical=a.health<WORKFORCE_RULES.resignHealth||env<WORKFORCE_RULES.resignEnvironment;
  a.lowWeeks=poor?a.lowWeeks+1:Math.max(0,a.lowWeeks-1);
  a.criticalWeeks=critical?a.criticalWeeks+1:0;
  if(s.week<a.returnProtectedUntil)continue;
  if(a.criticalWeeks>=WORKFORCE_RULES.consecutiveResignWeeks&&a.health<WORKFORCE_RULES.resignHealth){
   a.employment='resigned';a.reason='Condições laborais persistentemente desfavoráveis';log(p.id,'resignation',p.name+' pediu demissão após semanas de condições desfavoráveis.');continue;
  }
  if(a.lowWeeks>=WORKFORCE_RULES.consecutiveLeaveWeeks&&a.health<WORKFORCE_RULES.leaveHealth){
   const duration=a.health<WORKFORCE_RULES.severeHealth?12:a.health<36?4:2;
   a.employment='leave';a.leaveStarted=s.week;a.leaveDuration=duration;a.leaveUntil=s.week+duration;a.reason='Necessidade simulada de afastamento';a.lowWeeks=0;a.criticalWeeks=0;
   log(p.id,'absence',p.name+' ficará afastado por '+duration+' semanas simuladas.',duration);
   continue;
  }
  if(a.lowWeeks===1)log(p.id,'warning',p.name+' apresenta sinais de atenção: rever carga, apoio e recursos.');
 }
 s.workforceLog=s.workforceLog.slice(-80);
 return news;
}
