import {EMPLOYEES} from '../data/continuous/employees.js';
import {DEPARTMENTS} from '../data/continuous/organization.js';
const clone=s=>JSON.parse(JSON.stringify(s));
export function validateInitialHiring(s){
 const h=s.initialHiring;if(h===undefined)return true;
 if(!h||h.version!==1||!['pending','complete'].includes(h.status))throw Error('invalid-initial-hiring');
 if(h.status==='pending')return true;
 const managers=DEPARTMENTS.map(sid=>h.managers?.[sid]);
 if(!DEPARTMENTS.every((sid,i)=>EMPLOYEES.some(p=>p.id===managers[i]&&p.home===sid))||!Array.isArray(h.employees)||h.employees.length!==3||!h.employees.every(id=>EMPLOYEES.some(p=>p.id===id))||new Set([...managers,...h.employees]).size!==6)throw Error('invalid-initial-team');
 return true;
}
/** Initial package is included: no admission fee or additional payroll. Existing saves never opt in. */
export function completeInitialHiring(input,managers,employees){
 if(input.initialHiring?.status!=='pending'||!input.team)return {ok:false,error:'hiring-not-pending'};
 const s=clone(input);s.initialHiring={version:1,status:'complete',managers:{...managers},employees:[...employees]};
 try{validateInitialHiring(s);}catch(e){return {ok:false,error:e.message};}
 const selected=new Set([...Object.values(managers),...employees]);
 for(const p of EMPLOYEES){const a=s.staff[p.id];a.employment=selected.has(p.id)?'active':'candidate';a.lowWeeks=0;a.criticalWeeks=0;}
 s.history.push({type:'initial-hiring',week:s.week,text:'Contratação inicial: três gerentes e três funcionários, incluídos no início da empresa.'});
 s.lastWallMs=Date.now();return {ok:true,state:s};
}
