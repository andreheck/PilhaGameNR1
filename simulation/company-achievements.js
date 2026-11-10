import * as M from './company-continuous.js';
import {SECTORS,ITEMS} from '../data/continuous/catalog.js';
import {ACHIEVEMENTS} from '../data/continuous/achievements.js';
import {roster,sectorStaffing} from './staffing-management.js';
import {stage} from './improvement-lifecycle.js';
const work=SECTORS.filter(s=>!s.rest),mean=v=>v.length?v.reduce((a,b)=>a+b,0)/v.length:0;
const active=(s,sid,id)=>s.receipts.some(r=>r.sid===sid&&r.id===id&&(r.lifecycle?stage(r,s.week,ITEMS.find(i=>i.id===id)).active&&stage(r,s.week,ITEMS.find(i=>i.id===id)).progress>0:M.maturity(r,s.week)>0));
export function pt22Criteria(s,sid,f=M.values(s,sid)){
 const index=mean(Object.values(f)),staff=sectorStaffing(s,sid),members=roster(s).filter(p=>p.home===sid&&s.staff?.[p.id]?.employment==='active'),health=mean(members.map(p=>s.staff[p.id].health)),programs=['asse','psic','jorn','rela'];
 return [
  {id:'index',label:'Índice ambiental do setor ≥75',value:index,target:75,met:index>=75},
  ...[['seg','Segurança psicológica',75],['relac','Relações',70],['lider','Liderança',70],['auton','Autonomia',65],['carga','Ritmo e carga',65],['recon','Reconhecimento',65]].map(([id,label,target])=>({id,label:label+' ≥'+target,value:f[id],target,met:f[id]>=target})),
  {id:'coverage',label:'Todas as vagas com cobertura',value:staff.required-staff.gap,target:staff.required,met:staff.required>0&&staff.gap===0&&staff.active>0},
  {id:'health',label:'Média de saúde de base da equipe ativa ≥70',value:health,target:70,met:members.length>0&&health>=70},
  ...programs.map(id=>({id:'programme-'+id,label:ITEMS.find(i=>i.id===id).name+' em funcionamento',value:active(s,sid,id)?1:0,target:1,met:active(s,sid,id)}))
 ];
}
export function pt22Active(s,sid){return (s.achievements?.streaks?.[sid]?.count||0)>=2&&pt22Criteria(s,sid).every(c=>c.met);}
export function achievementProgress(s){
 const sectors=work.map(sec=>{const factors=M.values(s,sec.id);return {id:sec.id,name:sec.name,factors,index:mean(Object.values(factors)),staff:sectorStaffing(s,sec.id),health:mean(roster(s).filter(p=>p.home===sec.id&&s.staff?.[p.id]?.employment==='active').map(p=>s.staff[p.id].health))};}),best=sectors.filter(x=>x.staff.gap===0&&x.staff.active>0).reduce((a,b)=>a.health>b.health?a:b,{id:null,health:0}),covered=sectors.every(x=>x.staff.gap===0&&x.staff.active>0),people=roster(s).filter(p=>s.staff?.[p.id]?.employment==='active'),health=mean(people.map(p=>s.staff[p.id].health));
 const criteria=Object.fromEntries(sectors.map(x=>[x.id,pt22Criteria(s,x.id,x.factors)])),candidate=sectors.filter(x=>criteria[x.id].every(c=>c.met)).sort((a,b)=>(s.achievements?.streaks?.[b.id]?.count||0)-(s.achievements?.streaks?.[a.id]?.count||0))[0],rest=ITEMS.filter(i=>i.rest&&!i.individual&&active(s,'restauracao',i.id)),capacity=M.capacity(s),ledger=s.finance?.ledger||[],last=ledger.slice(-3),financial=last.length===3&&last.every((l,i)=>l.profit>0&&(!i||l.week===last[i-1].week+1))&&s.budget>=1000;
 const observations={
  sector75:{met:best.health>=75,value:best.health,target:75,sector:best.id},
  pt22:{met:!!candidate&&(s.achievements?.streaks?.[candidate.id]?.count||0)>=2,value:candidate?(s.achievements?.streaks?.[candidate.id]?.count||0):0,target:2,sector:candidate?.id},
  company65:{met:mean(sectors.map(x=>x.index))>=65,value:mean(sectors.map(x=>x.index)),target:65},
  'full-team':{met:covered,value:sectors.filter(x=>x.staff.gap===0&&x.staff.active>0).length,target:3},
  'rest-ready':{met:rest.length>=3&&capacity>=6,value:Math.min(rest.length/3,capacity/6)*100,target:100},
  leadership:{met:sectors.every(x=>x.factors.lider>=60&&active(s,x.id,'lide')),value:sectors.filter(x=>x.factors.lider>=60&&active(s,x.id,'lide')).length,target:3},
  'protected-listening':{met:sectors.some(x=>x.factors.seg>=60&&x.factors.relac>=60&&active(s,x.id,'asse')&&active(s,x.id,'psic')),value:sectors.filter(x=>x.factors.seg>=60&&x.factors.relac>=60&&active(s,x.id,'asse')&&active(s,x.id,'psic')).length,target:1},
  sustainable:{met:financial,value:Math.min(last.filter(l=>l.profit>0).length,s.budget>=1000?3:2),target:3},
  'continuous-care':{met:covered&&people.length>0&&health>=75&&(s.achievements?.streaks?.care?.count||0)>=4,value:s.achievements?.streaks?.care?.count||0,target:4},
  'first-change':{met:s.receipts.some(r=>r.id!=='seg'&&active(s,r.sid,r.id)),value:s.receipts.some(r=>r.id!=='seg'&&active(s,r.sid,r.id))?1:0,target:1}
 };
 return {sectors,criteria,covered,health,careReady:covered&&people.length>0&&health>=75,rows:ACHIEVEMENTS.map(a=>({...a,...observations[a.id],earned:s.achievements?.unlocked?.[a.id]||null})),currentPT22:sectors.filter(x=>pt22Active(s,x.id)).map(x=>x.id)};
}
/** Pure state transition; same-week refreshes can never accumulate streaks or rewards. */
export function recognizeAchievements(input){
 const state={...input,achievements:JSON.parse(JSON.stringify(input.achievements||{version:1,unlocked:{},streaks:{},currentPT22:[]}))},a=state.achievements,p=achievementProgress(state);
 function observe(id,met){const old=a.streaks[id];if(!old||old.week<state.week)a.streaks[id]={week:state.week,count:met?(old?.week===state.week-1?old.count+1:1):0};else if(!met)old.count=0;}
 for(const sec of p.sectors)observe(sec.id,p.criteria[sec.id].every(c=>c.met));observe('care',p.careReady);
 const evaluated=achievementProgress(state);a.currentPT22=evaluated.currentPT22;
 for(const row of evaluated.rows)if(row.met&&!a.unlocked[row.id])a.unlocked[row.id]={week:state.week,...(row.sector?{sector:row.sector}:{})};
 return state;
}
