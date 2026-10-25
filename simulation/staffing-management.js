import {managerMap} from '../data/continuous/organization.js';
/** Staff planning is a fictional management system, never individual HR advice.
 * Names below are additional candidates, distinct from the 16 canonical NPCs.
 * Their skills are narrative only; health is determined by workplace context. */
import {EMPLOYEES} from '../data/continuous/employees.js';
const WORK=['escritorio','producao','atendimento'];
const copy=x=>JSON.parse(JSON.stringify(x));
export const CANDIDATES=Object.freeze([
 {id:'NOVO-01',name:'Renata',role:'Organização e atendimento',fee:900,salary:140,shirt:'#4f9fa9',skin:'#905a40',hair:'#271d1a',hairStyle:3},
 {id:'NOVO-02',name:'Guilherme',role:'Processos e tecnologia',fee:1100,salary:170,shirt:'#547cc0',skin:'#b77b54',hair:'#342d26',hairStyle:0},
 {id:'NOVO-03',name:'Luana',role:'Coordenação e colaboração',fee:1000,salary:160,shirt:'#a27ec7',skin:'#75452f',hair:'#2b1d1a',hairStyle:3},
 {id:'NOVO-04',name:'Mateus',role:'Logística e operações',fee:950,salary:145,shirt:'#e7ae45',skin:'#c58c67',hair:'#291f17',hairStyle:1},
 {id:'NOVO-05',name:'Jéssica',role:'Saúde organizacional e apoio',fee:1000,salary:155,shirt:'#6d9f89',skin:'#6e422d',hair:'#291e1b',hairStyle:3},
 {id:'NOVO-06',name:'Davi',role:'Planejamento operacional',fee:1050,salary:160,shirt:'#658aa7',skin:'#d6a17b',hair:'#322721',hairStyle:0},
 {id:'NOVO-07',name:'Débora',role:'Desenvolvimento de equipes',fee:1050,salary:165,shirt:'#af85c0',skin:'#b77b54',hair:'#2f261f',hairStyle:2},
 {id:'NOVO-08',name:'Yuri',role:'Organização de recursos',fee:950,salary:145,shirt:'#7b9bca',skin:'#905a40',hair:'#241d19',hairStyle:1}
]);
export const SECTOR_IDS=WORK;
export const COVERAGE={fee:350,weekly:110,weeks:4};
export const ASSIGNMENT_WEEKS=2;
const candidate=id=>CANDIDATES.find(x=>x.id===id);
const isActive=(a)=>!a||a.employment===undefined||a.employment==='active';
const live=(o,w)=>o.startAt<=w&&w<o.endAt;
const weekIsInt=v=>Number.isSafeInteger(v)&&v>=1&&v<=100001;
export function ensureStaffing(s){
 s.staffing??={hires:[],coverage:[],assignments:[],nextId:1,lastPayrollWeek:s.week,totalPayroll:0,unpaid:0,history:[]};
 return s.staffing;
}
export function roster(s){
 const hires=s.staffing?.hires||[];
 return [...EMPLOYEES,...hires.map(h=>{
  const c=candidate(h.id);
  return c?{...c,organization:{rank:'operacional',rankName:'Operacional',position:'Analista em integração',managerId:managerMap(s)[h.sector],reportsTo:managerMap(s)[h.sector]},home:h.sector,archetype:'Contratação',type:'—',age:null,profile:null,portrait:null,
   strength:null,support:'Acompanhamento e integração',group:'novos',source:'equipe-contratada',
   profileStatus:'ficha-em-construcao'}:null;
 }).filter(Boolean)];
}
export const candidateFor=(id,s)=>roster(s).find(x=>x.id===id)||null;
export function validateStaffing(s){
 if(s.staffing===undefined)return true;
 const t=s.staffing;
 if(!t||typeof t!=='object'||!Array.isArray(t.hires)||t.hires.length>CANDIDATES.length||
    !Array.isArray(t.coverage)||t.coverage.length>100||!Array.isArray(t.assignments)||t.assignments.length>100||
    !Array.isArray(t.history)||t.history.length>80||!Number.isSafeInteger(t.nextId)||t.nextId<1||
    !Number.isSafeInteger(t.lastPayrollWeek)||t.lastPayrollWeek<1||t.lastPayrollWeek>s.week||
    !Number.isSafeInteger(t.totalPayroll)||t.totalPayroll<0||t.totalPayroll>1e9||
    !Number.isSafeInteger(t.unpaid)||t.unpaid<0||t.unpaid>1e9)throw Error('invalid-staffing');
 const canonical=t.canonicalHires||[];const canonicalIds=new Set();
 for(const h of canonical){if(!EMPLOYEES.some(p=>p.id===h.id&&p.home===h.sector)||canonicalIds.has(h.id)||h.fee!==900||h.salary!==140||!weekIsInt(h.hiredAt)||!weekIsInt(h.startAt)||h.startAt!==h.hiredAt+1)throw Error('invalid-canonical-hire');canonicalIds.add(h.id);}
 const used=new Set();
 for(const h of t.hires){
  if(!candidate(h.id)||used.has(h.id)||!WORK.includes(h.sector)||
    !weekIsInt(h.hiredAt)||!weekIsInt(h.startAt)||h.startAt<h.hiredAt||
    !Number.isSafeInteger(h.fee)||h.fee!==candidate(h.id).fee||
    !Number.isSafeInteger(h.salary)||h.salary!==candidate(h.id).salary)throw Error('invalid-hire');
  used.add(h.id);
 }
 const seen=new Set();
 for(const [rows,type] of [[t.coverage,'coverage'],[t.assignments,'assignment']]){
  for(const c of rows){
   if(typeof c.id!=='string'||seen.has(c.id)||!WORK.includes(type==='coverage'?c.sector:c.to)||
      !weekIsInt(c.startAt)||!weekIsInt(c.endAt)||c.endAt<=c.startAt)throw Error('invalid-'+type);
   if(type==='assignment'&&(!WORK.includes(c.from)||c.from===c.to))throw Error('invalid-assignment');
   if(type==='coverage'&&(c.fee!==COVERAGE.fee||c.weekly!==COVERAGE.weekly))throw Error('invalid-coverage-cost');
   seen.add(c.id);
  }
 }
 return true;
}
export function sectorStaffing(s,sector){
 if(!WORK.includes(sector))return {required:0,active:0,pending:0,temporary:0,incoming:0,outgoing:0,gap:0,pressure:0,pressureRelations:0};
 const t=s.staffing,w=s.week;
 const required=EMPLOYEES.filter(p=>p.home===sector).length;
 const people=roster(s).filter(p=>p.home===sector);
 const active=people.filter(p=>isActive(s.staff?.[p.id])).length;
 const pending=people.filter(p=>s.staff?.[p.id]?.employment==='onboarding').length;
 const temporary=(t?.coverage||[]).filter(c=>c.sector===sector&&live(c,w)).length;
 const incoming=(t?.assignments||[]).filter(a=>a.to===sector&&live(a,w)).length;
 const outgoing=(t?.assignments||[]).filter(a=>a.from===sector&&live(a,w)).length;
 const gap=Math.max(0,required-active-temporary-incoming+outgoing);
 return {required,active,pending,temporary,incoming,outgoing,gap,
  pressure:Math.min(30,gap*8+outgoing*3),pressureRelations:Math.min(15,gap*2+outgoing)};
}
export function staffingSummary(s){
 const t=s.staffing||{hires:[],coverage:[],assignments:[],unpaid:0,totalPayroll:0};
 const sectors=Object.fromEntries(WORK.map(id=>[id,sectorStaffing(s,id)]));
 const hires=[...(t.hires||[]),...(t.canonicalHires||[])],coverage=(t.coverage||[]).filter(x=>live(x,s.week));
 const weekly=hires.filter(h=>s.week>=h.startAt&&s.staff?.[h.id]?.employment!=='resigned')
   .reduce((n,h)=>n+h.salary,0)+coverage.reduce((n,c)=>n+c.weekly,0);
 return {sectors,gaps:Object.values(sectors).reduce((n,v)=>n+v.gap,0),
  active:Object.values(sectors).reduce((n,v)=>n+v.active,0),
  temporary:coverage.length,hired:hires.length,
  onboarding:hires.filter(h=>s.staff?.[h.id]?.employment==='onboarding').length,
  weekly,unpaid:t.unpaid||0,totalPayroll:t.totalPayroll||0,
  activeCover:coverage,assignments:(t.assignments||[]).filter(a=>live(a,s.week)),
  available:CANDIDATES.filter(c=>!hires.some(h=>h.id===c.id))};
}
export function staffAction(input,kind,payload={}){
 const s=copy(input),t=ensureStaffing(s);
 const sector=payload.sector,summary=staffingSummary(s);
 if(kind==='hire-canonical'){
  const c=EMPLOYEES.find(p=>p.id===payload.candidateId),a=c&&s.staff?.[c.id];
  if(!c||a?.employment!=='candidate')return {ok:false,error:'invalid-candidate'};
  if(s.budget<900)return {ok:false,error:'insufficient-budget'};
  t.canonicalHires??=[];t.canonicalHires.push({id:c.id,sector:c.home,hiredAt:s.week,startAt:s.week+1,fee:900,salary:140});
  a.employment='onboarding';a.week=s.week;s.budget-=900;record(t,s.week,'hire',c.name+' contratado(a); integração na próxima semana.');
 }else if(kind==='hire'){
  const c=candidate(payload.candidateId);
  if(!WORK.includes(sector)||!c)return {ok:false,error:'invalid-candidate'};
  if(t.hires.some(h=>h.id===c.id))return {ok:false,error:'already-hired'};
  if(summary.sectors[sector].active+summary.sectors[sector].pending>=summary.sectors[sector].required+2)return {ok:false,error:'staff-limit'};
  if(s.budget<c.fee)return {ok:false,error:'insufficient-budget'};
  t.hires.push({id:c.id,sector,hiredAt:s.week,startAt:s.week+1,fee:c.fee,salary:c.salary});
  s.staff??={};s.staff[c.id]={health:72,previous:72,week:s.week,employment:'onboarding',
    lowWeeks:0,criticalWeeks:0,returnProtectedUntil:0,leaveUntil:null,leaveStarted:null,leaveDuration:null,reason:null};
  s.budget-=c.fee;
  record(t,s.week,'hire',c.name+' contratado(a) para integração em '+sector+'.');
 }else if(kind==='cover'){
  if(!WORK.includes(sector))return {ok:false,error:'wrong-sector'};
  if(summary.sectors[sector].gap<1)return {ok:false,error:'no-vacancy'};
  if(summary.sectors[sector].temporary>=2)return {ok:false,error:'cover-limit'};
  if(s.budget<COVERAGE.fee)return {ok:false,error:'insufficient-budget'};
  t.coverage.push({id:'CV-'+t.nextId++,sector,startAt:s.week,endAt:s.week+COVERAGE.weeks,
   fee:COVERAGE.fee,weekly:COVERAGE.weekly});
  s.budget-=COVERAGE.fee;
  record(t,s.week,'cover','Cobertura externa em '+sector+' por 4 semanas simuladas.');
 }else if(kind==='redistribute'){
  const from=payload.from;
  if(!WORK.includes(sector)||!WORK.includes(from)||from===sector)return {ok:false,error:'wrong-sector'};
  if(summary.sectors[sector].gap<1)return {ok:false,error:'no-vacancy'};
  if(summary.sectors[from].active-summary.sectors[from].outgoing<2)return {ok:false,error:'insufficient-team'};
  if(summary.assignments.some(a=>a.from===from)||summary.assignments.some(a=>a.to===sector))return {ok:false,error:'assignment-limit'};
  t.assignments.push({id:'AS-'+t.nextId++,from,to:sector,startAt:s.week,endAt:s.week+ASSIGNMENT_WEEKS});
  record(t,s.week,'redistribute','Apoio interno de '+from+' a '+sector+' por duas semanas; setor de origem assume maior carga.');
 }else return {ok:false,error:'unknown-action'};
 return {ok:true,state:s};
}
function record(t,week,kind,text){
 t.history.push({week,kind,text});t.history=t.history.slice(-80);
}
export function advanceStaffing(s){
 const t=ensureStaffing(s),events=[];
 if(t.lastPayrollWeek>=s.week)return events;
 for(const h of [...t.hires,...(t.canonicalHires||[])]){
  const person=s.staff?.[h.id];
  if(person?.employment==='onboarding'&&s.week>=h.startAt){
   person.employment='active';person.week=s.week;
   const text=roster(s).find(p=>p.id===h.id)?.name+' concluiu a integração e iniciou no setor.';
   events.push({id:h.id,week:s.week,kind:'hired',description:text});
  }
 }
 const summary=staffingSummary(s),newCosts=summary.weekly,amountDue=Math.min(1e9,t.unpaid+newCosts),
  charged=Math.min(s.budget,amountDue);
 s.budget-=charged;t.unpaid=amountDue-charged;t.totalPayroll+=charged;t.lastPayrollWeek=s.week;
 if(t.unpaid>0&&newCosts>0)events.push({id:'staffing',week:s.week,kind:'finance',
   description:'Saldo insuficiente para os custos de pessoal; compromisso pendente de '+t.unpaid+' créditos.'});
 for(const c of t.coverage.filter(c=>c.endAt===s.week))events.push({
  id:c.id,week:s.week,kind:'cover-ended',description:'Cobertura temporária de '+c.sector+' terminou; revisar a equipe.'});
 for(const a of t.assignments.filter(a=>a.endAt===s.week))events.push({
  id:a.id,week:s.week,kind:'transfer-ended',description:'Redistribuição de tarefas encerrada; revisar as vagas.'});
 t.coverage=t.coverage.filter(c=>c.endAt>=s.week-8);
 t.assignments=t.assignments.filter(a=>a.endAt>=s.week-8);
 return events;
}
