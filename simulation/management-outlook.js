/**
 * Pure, non-binding comparisons for staffing decisions.
 * No call here writes storage, charges credits or moves the simulated clock.
 * The "next week" estimate holds all other choices/events constant.
 */
import {SECTOR_IDS,roster,staffingSummary,sectorStaffing,staffAction} from './staffing-management.js';
import {financePreview,financePeriods,FINANCE_RULES} from './financial-goals.js';
import {metrics} from './company-continuous.js';
const copy=x=>JSON.parse(JSON.stringify(x));
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const round=(v,d=2)=>Number(v.toFixed(d));
const mean=values=>values.length?values.reduce((n,v)=>n+v,0)/values.length:0;

function activeWorkers(s){
 return roster(s).filter(p=>s.staff?.[p.id]?.employment==='active');
}
function collectiveHealth(s,weeks=0){
 const people=activeWorkers(s);
 return round(mean(people.map(p=>{
  let value=s.staff[p.id].health;
  if(weeks>0){
   const sector=metrics(s,p.home);
   const shortage=sectorStaffing(s,p.home);
   // A bounded directional estimate, consistent with the existing weekly
   // health adjustment. Rest breaks and unpredictable events are excluded.
   const target=clamp(30+sector.index*.65-shortage.pressure*.55);
   for(let i=0;i<weeks;i++)value=clamp(value+(target-value)*.2);
  }
  return value;
 })),1);
}
export function managementSnapshot(s){
 const staff=staffingSummary(s),income=financePreview(s);
 const sectors=SECTOR_IDS.map(id=>{
  const row=sectorStaffing(s,id),score=metrics(s,id);
  const local=activeWorkers(s).filter(p=>p.home===id);
  return {id,...row,productivity:round(score.productivity,1),
   health:round(mean(local.map(p=>s.staff[p.id].health)),1),
   coverageRatio:row.required?round((row.required-row.gap)/row.required,3):1};
 });
 // Normalize productivity to the 16 productive posts rather than averaging
 // only the best-performing sectors (which would hide unfilled positions).
 const productivity=round(sectors.reduce((n,x)=>
  n+x.productivity*Math.max(0,x.required-x.gap),0)/FINANCE_RULES.basePosts,1);
 return {week:s.week,headcount:activeWorkers(s).length,
  absent:roster(s).filter(p=>s.staff?.[p.id]?.employment==='leave').length,
  resigned:roster(s).filter(p=>s.staff?.[p.id]?.employment==='resigned').length,
  onboarding:staff.onboarding,
  staffedPosts:income.productivePosts,capacity:FINANCE_RULES.basePosts,
  gaps:staff.gaps,health:collectiveHealth(s),healthTrend4Weeks:collectiveHealth(s,4),
  productivity,weeklyRevenue:income.revenue,weeklyCosts:staff.weekly,
  weeklyProfit:round(income.revenue-staff.weekly),lostRevenue:income.lostRevenue,
  unpaid:staff.unpaid,sectors};
}
function oneWeekView(state){
 const s=copy(state);
 s.week=Math.min(100000,s.week+1);
 for(const entry of s.staffing?.hires||[]){
  const person=s.staff?.[entry.id];
  if(person?.employment==='onboarding'&&s.week>=entry.startAt)
   person.employment='active';
 }
 for(const p of Object.values(s.staff||{})){
  if(p.employment==='leave'&&Number.isFinite(p.leaveUntil)&&s.week>=p.leaveUntil)
   p.employment='active';
 }
 return s;
}
export function compareStaffingDecision(state,kind,payload){
 const choice=staffAction(state,kind,payload);
 if(!choice.ok)return {ok:false,error:choice.error};
 const before=managementSnapshot(oneWeekView(state));
 const after=managementSnapshot(oneWeekView(choice.state));
 const fee=round(state.budget-choice.state.budget);
 const quarter=financePeriods(state).quarter;
 const remainingWeeks=Math.max(0,quarter.end-state.week);
 const projectedProfitBefore=round(quarter.profit+before.weeklyProfit*remainingWeeks);
 const projectedProfitAfter=round(quarter.profit+after.weeklyProfit*remainingWeeks-fee);
 return {ok:true,kind,payload:{...payload},atRevision:state.revision,atWeek:state.week,
  budgetAtPreview:state.budget,fee,
  before,after,
  delta:{posts:after.staffedPosts-before.staffedPosts,
   vacancies:after.gaps-before.gaps,
   productivity:round(after.productivity-before.productivity,1),
   health:round(after.healthTrend4Weeks-before.healthTrend4Weeks,1),
   weeklyRevenue:round(after.weeklyRevenue-before.weeklyRevenue),
   weeklyCosts:round(after.weeklyCosts-before.weeklyCosts),
   weeklyProfit:round(after.weeklyProfit-before.weeklyProfit)},
  quarter:{end:quarter.end,goal:quarter.goal,remainingWeeks,
   before:projectedProfitBefore,after:projectedProfitAfter,
   improvement:round(projectedProfitAfter-projectedProfitBefore),
   baselineMeetsGoal:projectedProfitBefore>=quarter.goal,
   scenarioMeetsGoal:projectedProfitAfter>=quarter.goal},
  projectedHorizonWeeks:4,
  netFourWeeks:round((after.weeklyProfit-before.weeklyProfit)*4-fee)
 };
}
export function comparisonChanged(oldState,newState,preview){
 if(!preview||!newState)return true;
 if(newState.week!==preview.atWeek||newState.budget!==preview.budgetAtPreview)return true;
 const latest=compareStaffingDecision(newState,preview.kind,preview.payload);
 if(!latest.ok)return true;
 const fields=['posts','vacancies','productivity','health','weeklyRevenue','weeklyCosts','weeklyProfit'];
 return latest.fee!==preview.fee||fields.some(k=>latest.delta[k]!==preview.delta[k]);
}
