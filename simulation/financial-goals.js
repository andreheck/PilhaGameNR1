/** Fictional cashflow: 1,000 weekly credits divided across 16 baseline posts.
 * An active worker contributes based on their simulated health and sector conditions.
 * Hiring/covering a post restores capacity; spare headcount cannot create revenue.
 */
import {EMPLOYEES} from '../data/continuous/employees.js';
import {SECTORS} from '../data/continuous/catalog.js';
import {roster,SECTOR_IDS,sectorStaffing} from './staffing-management.js';
import {metrics} from './company-continuous.js';
export const FINANCE_RULES=Object.freeze({
 baseRevenue:1000,basePosts:16,quarters:[12,24,48],
 targets:{12:1800,24:4200,48:9000},maxWeeks:260,
 fullHealthAt:60,minHealthOutput:.4,minEnvironmentOutput:.6
});
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const BASE_PROD=Object.fromEntries(SECTORS.filter(s=>!s.rest).map(s=>[
 s.id,40+Object.values(s.base).reduce((sum,n)=>sum+n,0)/6*.6
]));
const active=a=>a?.employment==='active';
const during=(row,week)=>row.startAt<=week&&week<row.endAt;
export function ensureFinance(s){
 s.finance??={ledger:[],lastWeek:s.week,earned:0,operationalCosts:0};return s.finance;
}
export function healthProductivity(health){
 if(!Number.isFinite(health))return 1;
 return clamp(FINANCE_RULES.minHealthOutput+
  (1-FINANCE_RULES.minHealthOutput)*health/FINANCE_RULES.fullHealthAt,
  FINANCE_RULES.minHealthOutput,1);
}
export function financePreview(s){
 const workers=roster(s).filter(p=>active(s.staff?.[p.id]));
 const originalActive=workers.filter(p=>EMPLOYEES.some(e=>e.id===p.id)).length;
 const hiresActive=workers.length-originalActive;
 const coverage=(s.staffing?.coverage||[]).filter(c=>during(c,s.week));
 const teams=Object.fromEntries(SECTOR_IDS.map(id=>[id,workers.filter(p=>p.home===id).map(p=>({
  id:p.id,name:p.name,health:s.staff[p.id]?.health??70,temporary:false
 }))]));
 // A transfer moves a real contribution: it never duplicates a worker.
 for(const a of (s.staffing?.assignments||[]).filter(a=>during(a,s.week))){
  if(!teams[a.from]||!teams[a.to]||teams[a.from].length<1)continue;
  teams[a.to].push(teams[a.from].pop());
 }
 for(const c of coverage)if(teams[c.sector])teams[c.sector].push({
  id:c.id,name:'Cobertura externa',health:70,temporary:true
 });
 const perPost=FINANCE_RULES.baseRevenue/FINANCE_RULES.basePosts;
 let rawRevenue=0,rawHealthOnly=0,productivePosts=0;
 const bySector=[],perWorker=[];
 for(const sid of SECTOR_IDS){
  const sector=SECTORS.find(x=>x.id===sid);
  const required=EMPLOYEES.filter(x=>x.home===sid).length;
  const list=teams[sid]||[];
  const capacity=Math.min(required,list.length);
  productivePosts+=capacity;
  const envFactor=clamp(metrics(s,sid).productivity/BASE_PROD[sid],
   FINANCE_RULES.minEnvironmentOutput,1);
  // If overstaffed, distribute the available posts fairly across everyone.
  const share=list.length?capacity/list.length:0;
  let sectorRevenue=0,sectorHealthRevenue=0;
  for(const person of list){
   const healthFactor=healthProductivity(person.health);
   const noEnvironment=perPost*share*healthFactor;
   const generated=noEnvironment*envFactor;
   sectorRevenue+=generated;sectorHealthRevenue+=noEnvironment;
   perWorker.push({id:person.id,name:person.name,sector:sid,temporary:person.temporary,
    health:round(person.health),healthFactor:round(healthFactor),environmentFactor:round(envFactor),
    contribution:round(generated),capacityShare:round(share)});
  }
  rawRevenue+=sectorRevenue;rawHealthOnly+=sectorHealthRevenue;
  bySector.push({id:sid,required,productivePosts:capacity,available:list.length,
   environmentFactor:round(envFactor),revenue:round(sectorRevenue),
   gap:sectorStaffing(s,sid).gap});
 }
 const revenue=round(rawRevenue);
 const vacantLoss=round((FINANCE_RULES.basePosts-productivePosts)*perPost);
 const healthLoss=round(productivePosts*perPost-rawHealthOnly);
 const environmentLoss=round(rawHealthOnly-rawRevenue);
 return {base:FINANCE_RULES.baseRevenue,productivePosts,originalActive,hiresActive,
  temporary:coverage.length,revenue,monthlyEquivalent:round(revenue*4),
  lostRevenue:round(FINANCE_RULES.baseRevenue-revenue),
  vacantLoss,healthLoss,environmentLoss,perPost,bySector,perWorker};
}
export function financeWeek(s,weeklyCost=0){
 const finance=ensureFinance(s);
 if(finance.lastWeek>=s.week)return null;
 if(!Number.isFinite(weeklyCost)||weeklyCost<0)throw Error('invalid-weekly-cost');
 const preview=financePreview(s);
 const line={week:s.week,revenue:preview.revenue,costs:weeklyCost,
  profit:round(preview.revenue-weeklyCost),productivePosts:preview.productivePosts,
  lostRevenue:preview.lostRevenue,vacantLoss:preview.vacantLoss,
  healthLoss:preview.healthLoss,environmentLoss:preview.environmentLoss,
  bySector:preview.bySector.map(({id,revenue})=>({id,revenue}))};
 s.budget=Math.min(1e9,Math.max(0,round(s.budget+line.revenue)));
 finance.earned=round(finance.earned+line.revenue);
 finance.operationalCosts=round(finance.operationalCosts+weeklyCost);
 finance.lastWeek=s.week;finance.ledger.push(line);
 finance.ledger=finance.ledger.slice(-FINANCE_RULES.maxWeeks);
 return line;
}
export function financePeriods(s){
 const f=ensureFinance(s);
 const period=(weeks)=>{const n=Math.max(0,Math.floor((s.week-2)/weeks)),
  start=2+n*weeks,end=1+(n+1)*weeks;
  const completed=s.week>=end;
  const lines=f.ledger.filter(l=>l.week>=start&&l.week<=Math.min(s.week,end));
  const revenue=round(lines.reduce((n,l)=>n+l.revenue,0));
  const costs=round(lines.reduce((n,l)=>n+l.costs,0));
  const profit=round(revenue-costs);
  const goal=FINANCE_RULES.targets[weeks];
  return {weeks,start,end,completed,revenue,costs,profit,goal,
   achieved:completed?profit>=goal:null,weeksRecorded:lines.length};
 };
 return {quarter:period(12),semester:period(24),year:period(48),history:f.ledger,
  earned:f.earned,costs:f.operationalCosts,preview:financePreview(s)};
}
export function validateFinance(s){
 if(s.finance===undefined)return true;const f=s.finance;
 if(!f||!Array.isArray(f.ledger)||f.ledger.length>FINANCE_RULES.maxWeeks||
  !Number.isInteger(f.lastWeek)||f.lastWeek>s.week||
  !Number.isFinite(f.earned)||f.earned<0||
  !Number.isFinite(f.operationalCosts)||f.operationalCosts<0)throw Error('invalid-finance');
 for(const row of f.ledger)if(!Number.isInteger(row.week)||row.week>s.week||
  !Number.isFinite(row.revenue)||row.revenue<0||
  !Number.isFinite(row.costs)||row.costs<0||
  !Number.isFinite(row.profit))throw Error('invalid-finance-row');
 return true;
}
