/** Fictional management effects, evaluated once per simulated week. */
import {EMPLOYEES} from '../data/continuous/employees.js';
import {DEPARTMENTS,managerMap} from '../data/continuous/organization.js';
import {metrics} from './company-continuous.js';
export const MANAGEMENT_RULES=Object.freeze({stressThreshold:40,healthThreshold:70,stressPenalty:-5,healthBonus:7});
const clamp=n=>Math.max(0,Math.min(100,n));
export function leadershipConditions(s){return DEPARTMENTS.map(sid=>{const managerId=managerMap(s)[sid],health=s.staff[managerId].health,stress=metrics(s,sid).stress;return {sid,managerId,health,stress,penalty:stress>40?-5:0,bonus:health>70?7:0};});}
/** Snapshot all managers before applying any effect; never compound while rendering. */
export function applyLeadershipEffects(s,eligibleIds=EMPLOYEES.map(p=>p.id)){
 const eligible=new Set(eligibleIds),conditions=new Map(leadershipConditions(s).map(c=>[c.sid,c]));
 for(const p of EMPLOYEES){const a=s.staff[p.id];if(!eligible.has(p.id)||a.leadership?.week===s.week)continue;const c=conditions.get(p.home),bonus=p.id!==c.managerId?c.bonus:0,before=a.health;a.health=clamp(a.health+c.penalty+bonus);a.leadership={week:s.week,managerId:c.managerId,managerHealth:c.health,stress:c.stress,penalty:c.penalty,bonus,delta:a.health-before};}
 return s;
}
export function leadershipSummary(s){return leadershipConditions(s).map(c=>{const people=EMPLOYEES.filter(p=>p.home===c.sid),sum=people.reduce((n,p)=>n+s.staff[p.id].health,0);return {...c,averageHealth:sum/people.length,subordinates:people.length-1,lastApplied:s.staff[c.managerId].leadership?.week??null};});}
