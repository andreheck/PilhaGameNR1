import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';
import * as L from '../simulation/company-living.js';
import {NPC_MOTION,workFraction} from '../simulation/npc-motion.js';
import {RULES} from '../data/continuous/catalog.js';
import {MANAGERS,DEPARTMENTS} from '../data/continuous/organization.js';

const setup=()=>L.ensureLiving(M.fresh());

test('movement is slower and the conversation pause is stationary',()=>{
  assert.equal(NPC_MOTION.walkRate,.85);
  assert.ok(workFraction(1000,0,20000,.6).fraction<workFraction(1000,0,20000,1).fraction);
  const a=workFraction(9500,0,20000),b=workFraction(10500,0,20000);
  assert.equal(a.fraction,b.fraction);assert.ok(a.holding&&b.holding);
  assert.equal(workFraction(0,0,20000).fraction,0);assert.equal(workFraction(20000,0,20000).fraction,0);
});

test('each staffed department has one weekly patio meeting with its selected manager and distinct seats',()=>{
  const state=setup(),before=JSON.stringify(state),rows=L.routines(state);
  for(const sid of DEPARTMENTS){
    const members=rows.filter(r=>r.sid===sid),meeting=members[0]?.agenda.find(e=>e.kind==='meeting');
    assert.ok(meeting,sid+' meeting scheduled');
    assert.equal(new Set(members.map(r=>r.agenda.filter(e=>e.kind==='meeting').length)).size,1);
    for(const row of members){
      const event=row.agenda.find(e=>e.kind==='meeting');
      assert.equal(event.managerId,MANAGERS[sid]);assert.equal(event.key,meeting.key);
    }
    assert.equal(new Set(members.map(r=>r.sampleAt(meeting.start+NPC_MOTION.meetingTravelMs/.85+100).seat)).size,members.length);
    const inMeeting=members.map(r=>r.sampleAt(meeting.start+NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*r.speed)+100));
    assert.ok(inMeeting.every(p=>p.stage==='meeting'&&p.space==='patio'&&p.talking));
  }
  assert.equal(JSON.stringify(state),before);
  for(const row of L.routines({...state,week:2}))assert.equal(row.agenda.filter(e=>e.kind==='meeting').length,1);
});

test('inactive managers do not get cloned and chosen managers replace defaults',()=>{
  const state=setup();state.initialHiring={status:'complete',managers:{...MANAGERS,escritorio:'NPC-01'}};
  let rows=L.routines(state);assert.equal(rows.find(r=>r.sid==='escritorio').agenda.find(e=>e.kind==='meeting').managerId,'NPC-01');
  state.staff['NPC-01'].employment='leave';rows=L.routines(state);
  assert.ok(!rows.some(r=>r.id==='NPC-01'));
  assert.ok(rows.filter(r=>r.sid==='escritorio').every(r=>!r.meetingScheduled));
  assert.ok(rows.filter(r=>r.sid==='producao').every(r=>r.meetingScheduled));
});

test('conversation partners are reciprocal and health effects remain temporary',()=>{
  const state=setup(),rows=L.routines(state);let pair;
  for(let t=0;t<RULES.weekMs&&!pair;t+=100){
    const poses=rows.map(r=>({...r,...r.sampleAt(t)}));
    for(const p of poses.filter(p=>p.stage==='conversation')){
      const q=poses.find(x=>x.id===p.partnerId);
      if(q?.partnerId===p.id&&q.sid===p.sid&&p.holding&&q.holding&&!p.moving&&!q.moving){pair=[p,q];break;}
    }
  }
  assert.ok(pair,'a full week contains a real paired conversation');
  assert.notDeepEqual([pair[0].workFraction,pair[0].id],[pair[1].workFraction,pair[1].id]);
  const meeting=rows.find(r=>r.sid==='escritorio').agenda.find(e=>e.kind==='meeting');
  const copy={...state,activeMs:meeting.start+NPC_MOTION.meetingTravelMs/.85+100};
  const staffBefore=JSON.stringify(copy.staff),visits=L.routines(copy).filter(r=>r.sid==='escritorio');
  assert.ok(visits.every(r=>r.stage==='meeting'&&r.healthBonus>0&&r.healthBonus<=8));
  assert.equal(JSON.stringify(copy.staff),staffBefore);
});

