import {EMPLOYEES} from '../data/continuous/employees.js';
import {DEPARTMENTS} from '../data/continuous/organization.js';
const clone=s=>JSON.parse(JSON.stringify(s));
export function validateInitialHiring(s){
 const h=s.initialHiring;if(h===undefined)return true;
 if(!h||h.version!==1||!['pending','complete'].includes(h.status))throw Error('invalid-initial-hiring');
 if(h.status==='pending')return true;
 if(s.gameMode==='home-office'){
  const manager=EMPLOYEES.find(p=>p.id===h.onlineManagerId&&p.organization?.rank==='estrategico');
  const ids=[h.onlineManagerId,...(h.employees||[])];
  if(!manager||!Array.isArray(h.employees)||h.employees.length!==4||new Set(ids).size!==5||!h.employees.every(id=>EMPLOYEES.some(p=>p.id===id&&p.organization?.rank!=='estrategico'))||!DEPARTMENTS.every(id=>h.managers?.[id]===h.onlineManagerId))throw Error('invalid-remote-team');
  return true;
 }
 const managers=DEPARTMENTS.map(sid=>h.managers?.[sid]);
 if(!DEPARTMENTS.every((sid,i)=>EMPLOYEES.some(p=>p.id===managers[i]&&p.home===sid))||!Array.isArray(h.employees)||h.employees.length!==3||!h.employees.every(id=>EMPLOYEES.some(p=>p.id===id))||new Set([...managers,...h.employees]).size!==6)throw Error('invalid-initial-team');
 return true;
}
export function upgradeRemoteHiring(s){
 const old=s.initialHiring;
 if(s.gameMode!=='home-office'||old?.status!=='complete'||old.mode||old.onlineManagerId)return;
 validateInitialHiring({...s,gameMode:'office'});
 const previous=[...Object.values(old.managers),...old.employees];
 const candidates=[...new Set([...previous,...EMPLOYEES.map(p=>p.id)])];
 const strategic=id=>EMPLOYEES.find(p=>p.id===id)?.organization?.rank==='estrategico';
 const onlineManagerId=candidates.find(strategic);
 const employees=candidates.filter(id=>!strategic(id)).slice(0,4);
 const selected=new Set([onlineManagerId,...employees]);
 s.initialHiring={...old,mode:'home-office',onlineManagerId,employees,managers:Object.fromEntries(DEPARTMENTS.map(id=>[id,onlineManagerId]))};
 for(const id of new Set([...previous,...selected])){
  const staff=s.staff?.[id];
  if(!staff)continue;
  if(!selected.has(id)&&staff.employment==='active')staff.employment='candidate';
  if(selected.has(id)&&staff.employment==='candidate')staff.employment='active';
 }
}
/** Initial package is included: no admission fee or additional payroll. Existing saves never opt in. */
export function completeInitialHiring(input,managers,employees){
 if(input.initialHiring?.status!=='pending')return {ok:false,error:'hiring-not-pending'};
 const s=clone(input);s.initialHiring={version:1,status:'complete',managers:{...managers},employees:[...employees]};
 if(s.gameMode==='home-office'){
  const onlineManagerId=DEPARTMENTS.map(id=>s.initialHiring.managers[id]).find(Boolean);
  s.initialHiring={...s.initialHiring,mode:'home-office',onlineManagerId};
  try{validateInitialHiring(s);}catch(e){return {ok:false,error:e.message};}
  const selected=new Set([onlineManagerId,...employees]);
  for(const p of EMPLOYEES){const a=s.staff[p.id];a.employment=selected.has(p.id)?'active':'candidate';a.lowWeeks=0;a.criticalWeeks=0;}
  s.history.push({type:'initial-hiring',week:s.week,text:'Contratação inicial: gerente online e quatro colegas em equipe remota, incluídos no início da empresa.'});
  s.lastWallMs=Date.now();return {ok:true,state:s};
 }
 try{validateInitialHiring(s);}catch(e){return {ok:false,error:e.message};}
 const selected=new Set([...Object.values(managers),...employees]);
 for(const p of EMPLOYEES){const a=s.staff[p.id];a.employment=selected.has(p.id)?'active':'candidate';a.lowWeeks=0;a.criticalWeeks=0;}
 s.history.push({type:'initial-hiring',week:s.week,text:'Contratação inicial: três gerentes e três funcionários, incluídos no início da empresa.'});
 s.lastWallMs=Date.now();return {ok:true,state:s};
}
