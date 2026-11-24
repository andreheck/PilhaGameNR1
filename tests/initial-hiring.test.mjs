import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {completeInitialHiring} from '../simulation/initial-hiring.js';import {staffAction,advanceStaffing,staffingSummary} from '../simulation/staffing-management.js';
import {leadershipConditions} from '../simulation/leadership-effects.js';
import {EMPLOYEES} from '../data/continuous/employees.js';import {SECTOR_IDS} from '../simulation/staffing-management.js';import {financePreview} from '../simulation/financial-goals.js';
const managers={escritorio:'NPC-02',producao:'NPC-09',atendimento:'NPC-05'},people=['NPC-04','NPC-14','NPC-06'];
const start=()=>{const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.initialHiring={version:1,status:'pending'};return s;};
test('only a new empty storage starts initial hiring; existing and migrated saves keep workforce',()=>{
 const empty={getItem:()=>null};assert.equal(M.read(empty).state.initialHiring.status,'pending');
 const legacy=M.fresh();assert.equal(M.read({getItem:k=>k===M.KEY?JSON.stringify(legacy):null}).state.initialHiring,undefined);
 assert.equal(M.read({getItem:k=>k==='pilha-investment-v1'?JSON.stringify({budget:950,upgrades:[]}):null}).state.initialHiring,undefined);
 assert.equal(L.staffingSummary(L.ensureLiving(legacy)).active,16);
});
test('initial package activates six distinct people and persists chosen manager hierarchy without fees',()=>{
 const s=start(),before=JSON.stringify(s),r=completeInitialHiring(s,managers,people);assert.ok(r.ok);assert.equal(JSON.stringify(s),before);
 assert.equal(r.state.budget,s.budget);assert.equal(staffingSummary(r.state).active,6);assert.equal(L.workforceSummary(r.state).candidates,10);L.validateLiving(r.state);
 const staff=L.staffView(r.state);assert.equal(staff.find(p=>p.id==='NPC-02').organization.reportsTo,'conselho');assert.equal(staff.find(p=>p.id==='NPC-03').organization.managerId,'NPC-02');assert.equal(staff.find(p=>p.id==='NPC-03').organization.rank,'tatico');
 assert.equal(leadershipConditions(r.state).find(c=>c.sid==='producao').managerId,'NPC-09');assert.equal(completeInitialHiring(r.state,managers,people).ok,false);
});
test('new one-character onboarding can complete initial hiring without creating a hidden hero pair',()=>{
 const s=L.ensureLiving(M.fresh());s.initialHiring={version:1,status:'pending'};assert.equal(s.team,null);
 const r=completeInitialHiring(s,managers,people);assert.ok(r.ok);assert.equal(r.state.team,null);assert.equal(staffingSummary(r.state).active,6);L.validateLiving(r.state);
});
test('duplicate people, missing managers and cross-sector manager choices cannot commit',()=>{
 for(const [m,e] of [[managers,['NPC-02','NPC-04','NPC-06']],[{...managers,producao:'NPC-02'},people],[managers,people.slice(1)]])assert.equal(completeInitialHiring(start(),m,e).ok,false);
});
test('home office starts with one visible explorer and five remote hires including one online manager',()=>{
 const s=L.ensureLiving(M.setGameMode(L.ensureLiving(M.fresh()),'home-office').state);s.initialHiring={version:1,status:'pending'};
 const manager=EMPLOYEES.find(p=>p.organization.rank==='estrategico'),employees=EMPLOYEES.filter(p=>p.id!==manager.id&&p.organization.rank!=='estrategico').slice(0,4).map(p=>p.id),managers=Object.fromEntries(SECTOR_IDS.map(id=>[id,manager.id]));
 const result=completeInitialHiring(s,managers,employees);assert.ok(result.ok);const state=result.state;
 assert.equal(staffingSummary(state).active,5);assert.equal(L.workforceSummary(state).active,5);assert.equal(L.workforceSummary(state).candidates,0);
 assert.equal(staffingSummary(state).sectors.escritorio.required,5);assert.equal(staffingSummary(state).sectors.producao.required,0);assert.equal(staffingSummary(state).available.length,0);
 assert.equal(L.staffView(state).filter(p=>p.employment==='active').length,5);assert.ok(L.staffView(state).filter(p=>p.employment==='active').every(p=>p.home==='escritorio'));
 assert.equal(financePreview(state).productivePosts,5);assert.equal(financePreview(state).perPost,200);
 assert.equal(staffAction(state,'hire-canonical',{candidateId:'NPC-01'}).error,'remote-team-fixed');L.validateLiving(state);
});
test('canonical candidate hire debits once, preserves identity, joins next week and records payroll once',()=>{
 const s=completeInitialHiring(start(),managers,people).state,r=staffAction(s,'hire-canonical',{candidateId:'NPC-01'});assert.ok(r.ok);assert.equal(r.state.budget,s.budget-900);assert.equal(staffAction(r.state,'hire-canonical',{candidateId:'NPC-01'}).ok,false);assert.equal(r.state.staff['NPC-01'].employment,'onboarding');
 r.state.week++;advanceStaffing(r.state);assert.equal(r.state.staff['NPC-01'].employment,'active');assert.equal(staffingSummary(r.state).weekly,140);const budget=r.state.budget;advanceStaffing(r.state);assert.equal(r.state.budget,budget);L.validateLiving(r.state);
});
test('unhired NPCs do not walk, receive weekly health effects or leave employment',()=>{
 let s=completeInitialHiring(start(),managers,people).state;const before=structuredClone(s.staff['NPC-01']);
 s=L.advanceRunning(s).state;assert.deepEqual(s.staff['NPC-01'],before);assert.ok(!L.routines(s).some(p=>p.id==='NPC-01'));assert.equal(s.staff['NPC-02'].leadership.managerId,'NPC-02');L.validateLiving(s);
});

test('existing six-person home team upgrades once and keeps its financial progress',()=>{
 const saved=completeInitialHiring(start(),managers,people).state;
 saved.gameMode='home-office';
 const {budget,week}=saved;
 L.ensureLiving(saved);
 assert.equal(staffingSummary(saved).active,5);
 assert.equal(saved.budget,budget);
 assert.equal(saved.week,week);
 const hiring=structuredClone(saved.initialHiring);
 L.ensureLiving(saved);
 assert.deepEqual(saved.initialHiring,hiring);
});
