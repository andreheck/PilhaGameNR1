import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {NPC_MOTION,workFraction} from '../simulation/npc-motion.js';
import {EMPLOYEES} from '../data/continuous/employees.js';
import {RULES} from '../data/continuous/catalog.js';
import {MANAGERS,DEPARTMENTS} from '../data/continuous/organization.js';
const setup=()=>L.ensureLiving(M.fresh());
test('walk legs are fifteen percent slower and conversations stop rather than slide',()=>{
 assert.equal(NPC_MOTION.walkRate,.85);
 const length=20000,first=workFraction(1000,0,length),second=workFraction(1100,0,length);
 assert.ok(Math.abs((second.fraction-first.fraction)/100-(2/length*.85))<1e-10);
 const a=workFraction(9500,0,length),b=workFraction(10500,0,length);assert.equal(a.fraction,b.fraction);assert.ok(a.holding&&b.holding);
 assert.equal(workFraction(0,0,length).fraction,0);assert.equal(workFraction(length,0,length).fraction,0);
 assert.ok(workFraction(1000,0,length,.6).fraction<first.fraction);
});
test('one weekly patio meeting per sector includes its actual manager and distinct seats',()=>{
 const s=setup(),before=JSON.stringify(s),rows=L.routines(s);
 for(const sid of DEPARTMENTS){
  const members=rows.filter(r=>r.sid===sid);assert.equal(new Set(members.map(r=>r.agenda.find(e=>e.kind==='meeting').key)).size,1);
  for(const r of members){assert.equal(r.agenda.filter(e=>e.kind==='meeting').length,1);assert.equal(r.agenda.find(e=>e.kind==='meeting').managerId,MANAGERS[sid]);}
  const start=members[0].agenda.find(e=>e.kind==='meeting').start;
  const poses=members.map(r=>r.sampleAt(start+NPC_MOTION.meetingTravelMs/.85+100));
  assert.ok(poses.every(p=>p.stage==='meeting'&&p.space==='patio'&&p.talking));assert.equal(new Set(poses.map(p=>p.seat)).size,members.length);
 }
 assert.equal(JSON.stringify(s),before);
 const restored=JSON.parse(before);assert.equal(JSON.stringify(L.routines(restored)),JSON.stringify(rows));
 s.week=2;const next=L.routines(s);for(const r of next)assert.equal(r.agenda.filter(e=>e.kind==='meeting').length,1);
});
test('selected managers are used; absent managers and inactive employees are not cloned into meetings',()=>{
 const s=setup();s.initialHiring={status:'complete',managers:{...MANAGERS,escritorio:'NPC-01'}};
 let rows=L.routines(s);assert.equal(rows.find(r=>r.sid==='escritorio').agenda.find(e=>e.kind==='meeting').managerId,'NPC-01');
 s.staff['NPC-01'].employment='leave';rows=L.routines(s);assert.ok(!rows.some(r=>r.id==='NPC-01'));assert.ok(rows.filter(r=>r.sid==='escritorio').every(r=>!r.meetingScheduled));assert.ok(rows.filter(r=>r.sid==='producao').every(r=>r.meetingScheduled));
});
test('conversation partners are reciprocal co-workers with stationary poses; health boosts remain temporary and capped',()=>{
 const s=setup(),rows=L.routines(s);let found=false;
 for(let t=0;t<RULES.weekMs;t+=100){const poses=rows.map(r=>({...r,...r.sampleAt(t)}));
  for(const p of poses.filter(p=>p.stage==='conversation')){found=true;const q=poses.find(q=>q.id===p.partnerId);assert.equal(q.partnerId,p.id);assert.equal(q.sid,p.sid);assert.ok(p.holding&&q.holding&&!p.moving&&!q.moving);}
 }
 assert.ok(found,'a complete week must contain actual paired conversations');
 const before=JSON.stringify(s);s.activeMs=NPC_MOTION.meetingStarts[0]*RULES.weekMs+NPC_MOTION.meetingTravelMs/.85+500;
 const health=JSON.stringify(s.staff);const actual=L.routines(s).filter(r=>r.sid==='escritorio');assert.ok(actual.every(r=>r.stage==='meeting'&&r.healthBonus>0&&r.healthBonus<=8));L.routines(s);assert.equal(JSON.stringify(s.staff),health);
 s.activeMs=0;assert.equal(JSON.stringify(s),before);
});
test('meeting journeys and work trajectories meet continuously at the origin',()=>{
 const rows=L.routines(setup());for(const r of rows)for(const event of r.agenda.filter(e=>e.kind==='meeting')){
  const before=r.sampleAt(event.start-.001),depart=r.sampleAt(event.start),back=r.sampleAt(event.end-.001),after=r.sampleAt(event.end);
  assert.ok((before.workFraction||0)<1e-5);assert.equal(depart.progress,0);assert.ok(back.progress<1e-5);assert.ok((after.workFraction||0)<1e-5);
 }
});
