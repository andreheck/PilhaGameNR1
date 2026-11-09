import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';
import * as L from '../simulation/company-living.js';
import {NPC_MOTION,workFraction} from '../simulation/npc-motion.js';
import {RULES} from '../data/continuous/catalog.js';
import {MANAGERS,DEPARTMENTS} from '../data/continuous/organization.js';

const setup=()=>L.ensureLiving(M.fresh());

test('fourteen-day cycles retain seven complete pauses and two meetings without overlap',()=>{
 for(const health of [0,40,54.99,55,70,100])for(const week of [1,2,3,20,99999]){
  const s=setup();s.week=week;for(const p of Object.values(s.staff)){p.health=health;p.week=week;}
  const rows=L.routines(s),next=L.routines({...s,week:week+1});
  for(const row of rows){
   const events=[...row.agenda,...next.find(r=>r.id===row.id).agenda].sort((a,b)=>a.start-b.start);
   assert.equal(new Set(events.map(e=>e.key)).size,events.length,'unique event keys');
   assert.equal(events.filter(e=>e.kind==='rest').length,7,row.id+' seven pauses');
   assert.equal(events.filter(e=>e.kind==='meeting').length,2,row.id+' two meetings');
   for(let i=1;i<events.length;i++)assert.ok(events[i].start>=events[i-1].end-.0001,`${row.id} health ${health} week ${week}`);
  }
 }
});

test('rebuilding at week and cycle boundaries preserves positions and conversations',()=>{
 for(const week of [1,2,3,20,99999]){
  const s=setup();s.week=week;s.activeMs=RULES.weekMs-1000;for(const p of Object.values(s.staff)){p.health=40;p.week=week;}
  const rows=L.routines(s);
  for(const delta of [0,999,1000,1001,2000]){
   const active=RULES.weekMs-1000+delta,freshState=JSON.parse(JSON.stringify({...s,week:week+Math.floor(active/RULES.weekMs),activeMs:active%RULES.weekMs}));
   const fresh=L.routines(freshState),time=(week-1)*RULES.weekMs+active;
   for(const row of rows)assert.deepEqual(row.sampleAt(time),fresh.find(r=>r.id===row.id).sampleAt(time),row.id+' week '+week+' delta '+delta);
  }
 }
});

test('rest capacity counts seated visitors, not people walking through corridors',()=>{
 for(const health of [40,55,100,'mixed']){
  const s=setup();Object.values(s.staff).forEach((p,i)=>{p.health=health==='mixed'?(i%3?40:70):health;});
  const rows=L.routines(s),events=rows.flatMap(r=>r.agenda);
  const next=L.routines({...s,week:2});events.push(...next.flatMap(r=>r.agenda));
  for(const time of events.flatMap(e=>[e.start,e.out,e.pauseEnd,e.end]).concat(Array.from({length:480},(_,i)=>i*RULES.weekMs/240))){
   const present=rows.map(r=>r.sampleAt(time)).filter(p=>p.kind==='rest'&&p.inRestArea);
   assert.ok(present.length<=6,'seated visitors '+present.length+' at '+time);
  }
 }
});

test('every departure and return meets the work route continuously at its origin',()=>{
 const s=setup();for(const p of Object.values(s.staff))p.health=40;
 for(const row of L.routines(s))for(const event of row.agenda){
  const before=row.sampleAt(event.start-.001),departure=row.sampleAt(event.start),back=row.sampleAt(event.end-.001),after=row.sampleAt(event.end);
  assert.ok((before.workFraction||0)<1e-5,row.id+' depart from origin');
  assert.equal(departure.progress,0);assert.ok(back.progress<1e-5);
  assert.ok((after.workFraction||0)<1e-5,row.id+' return to origin');
 }
});

test('movement is slower and the conversation pause is stationary',()=>{
  assert.ok(NPC_MOTION.walkRate>0&&NPC_MOTION.walkRate<.85);
  assert.ok(workFraction(1000,0,20000,.6).fraction<workFraction(1000,0,20000,1).fraction);
  const a=workFraction(9500,0,20000),b=workFraction(10500,0,20000);
  assert.equal(a.fraction,b.fraction);assert.ok(a.holding&&b.holding);
  assert.equal(workFraction(0,0,20000).fraction,0);assert.equal(workFraction(20000,0,20000).fraction,0);
});

test('individual paces survive reload and roster ordering independently from health',()=>{
  const state=setup(),before=JSON.stringify(state),rows=L.routines(state);
  assert.equal(new Set(rows.map(r=>r.pace)).size,16);
  assert.ok(rows.every(r=>r.pace>=.82&&r.pace<=1.18));
  const restored=JSON.parse(before);restored.staff=Object.fromEntries(Object.entries(restored.staff).reverse());
  for(const row of L.routines(restored))assert.equal(row.pace,rows.find(r=>r.id===row.id).pace);
  for(const worker of Object.values(restored.staff))worker.health=40;
  for(const row of L.routines(restored)){
    const original=rows.find(r=>r.id===row.id);
    assert.equal(row.pace,original.pace);
    assert.ok(Math.abs(row.speed/original.speed-.6)<1e-10);
    assert.ok(row.outEnd>original.outEnd);
  }
  assert.equal(JSON.stringify(state),before);
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
    const arrival=meeting.start+Math.max(...members.map(r=>NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*r.speed)))+100;
    assert.equal(new Set(members.map(r=>r.sampleAt(arrival).seat)).size,members.length);
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
  for(let t=0;t<RULES.weekMs&&!pair;t+=RULES.weekMs/1200){
    const poses=rows.map(r=>({...r,...r.sampleAt(t)}));
    for(const p of poses.filter(p=>p.stage==='conversation')){
      const q=poses.find(x=>x.id===p.partnerId);
      if(q?.partnerId===p.id&&q.sid===p.sid&&p.holding&&q.holding&&!p.moving&&!q.moving){pair=[p,q];break;}
    }
  }
  assert.ok(pair,'a full week contains a real paired conversation');
  assert.notDeepEqual([pair[0].workFraction,pair[0].id],[pair[1].workFraction,pair[1].id]);
  const meeting=rows.find(r=>r.sid==='escritorio').agenda.find(e=>e.kind==='meeting');
  const copy={...state,activeMs:meeting.start+Math.max(...rows.filter(r=>r.sid==='escritorio').map(r=>NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*r.speed)))+100};
  const staffBefore=JSON.stringify(copy.staff),visits=L.routines(copy).filter(r=>r.sid==='escritorio');
  assert.ok(visits.every(r=>r.stage==='meeting'&&r.healthBonus>0&&r.healthBonus<=8));
  assert.equal(JSON.stringify(copy.staff),staffBefore);
});

