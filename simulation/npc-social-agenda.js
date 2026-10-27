import {RULES} from '../data/continuous/catalog.js';
import {managerMap,DEPARTMENTS} from '../data/continuous/organization.js';
import {NPC_MOTION,workFraction} from './npc-motion.js';
/** Derived schedules only. No journal, payouts or replayable saved transactions. */
export function addSocialAgenda(state,people,rows,period){
 const t=(state.week-1)*RULES.weekMs+state.activeMs,managers=managerMap(state),plans=new Map();
 for(const row of rows){
  const members=people.filter(p=>p.home===row.sid).sort((a,b)=>a.id.localeCompare(b.id));
  const manager=managers[row.sid],hasManager=members.some(p=>p.id===manager),seat=members.findIndex(p=>p.id===row.id),events=[];
  const week=Math.floor(t/RULES.weekMs),dept=DEPARTMENTS.indexOf(row.sid),travel=NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*row.speed);
  const meetings=hasManager?Array.from({length:5},(_,i)=>{const w=week+i-2,start=(w+NPC_MOTION.meetingStarts[dept])*RULES.weekMs;return {kind:'meeting',key:'meeting:'+w+':'+row.sid,start,out:start+travel,pauseEnd:start+travel+NPC_MOTION.meetingMs,end:start+travel*2+NPC_MOTION.meetingMs,space:'patio',target:'meeting:'+seat,managerId:manager,seat};}):[];
  const k=Math.floor(t/period-row.offset);
  for(let n=k-3;n<=k+4;n++){
   const start=(n+row.offset)*period,event={kind:'rest',key:'rest:'+n+':'+row.id,start,out:start+row.outEnd*period,pauseEnd:start+row.pauseEnd*period,end:start+row.tripEnd*period,space:row.space,target:row.space};
   // Shift a conflicting break as a whole: nobody is teleported out of a trip
   // and the weekly meeting does not silently delete an ordinary rest visit.
   for(const m of meetings)if(event.start<m.end&&event.end>m.start){
    const delta=event.start<m.start?m.start-500-seat*600-event.end:m.end+500+seat*600-event.start;
    for(const key of ['start','out','pauseEnd','end'])event[key]+=delta;
   }
   events.push(event);
  }
  events.push(...meetings);events.sort((a,b)=>a.start-b.start);plans.set(row.id,{row,events});
 }
 function pose(id,now){
  const {row,events}=plans.get(id),active=events.find(e=>now>=e.start&&now<e.end);
  if(active){
   const rest=now>=active.out&&now<active.pauseEnd,back=now>=active.pauseEnd;
   const stage=rest?'rest':back?'return':'outbound',progress=rest?1:back?1-(now-active.pauseEnd)/(active.end-active.pauseEnd):(now-active.start)/(active.out-active.start);
   return {stage:active.kind==='meeting'?(rest?'meeting':'meeting-'+stage):stage,baseStage:stage,kind:active.kind,space:active.space,target:active.target,managerId:active.managerId,seat:active.seat,key:active.key,progress,holding:rest,moving:!rest,influenced:rest||back,inRestArea:rest,meeting:active.kind==='meeting'};
  }
  const last=events.filter(e=>e.end<=now).at(-1),next=events.find(e=>e.start>now),start=last?.end??now-period,end=next?.start??now+period;
  const w=workFraction(now,start,end,row.speed,row.index),influenced=!!last&&now-last.end<.18*period*row.scale;
  return {stage:influenced?'afterglow':'work',kind:'work',space:last?.space||row.space,workFraction:w.fraction,holding:w.holding,moving:!w.holding,influenced,inRestArea:false,meeting:false};
 }
 return rows.map(row=>{
  const sampleAt=now=>{
   const p=pose(row.id,now);
   if(p.kind==='work'&&p.holding){
    const group=rows.filter(r=>r.sid===row.sid).map(r=>({r,p:pose(r.id,now)})).filter(x=>x.p.kind==='work'&&x.p.holding).sort((a,b)=>a.r.id.localeCompare(b.r.id));
    while(group.length){const a=group.shift(),i=group.findIndex(b=>Math.abs(b.p.workFraction-a.p.workFraction)<.035);if(i<0)continue;const b=group.splice(i,1)[0];if(a.r.id===row.id||b.r.id===row.id)return {...p,stage:'conversation',talking:true,partnerId:a.r.id===row.id?b.r.id:a.r.id};}
   }
   return {...p,talking:p.stage==='meeting'};
  };
  return {...row,...sampleAt(t),motionRate:NPC_MOTION.walkRate,sampleAt,meetingScheduled:plans.get(row.id).events.some(e=>e.kind==='meeting'),agenda:plans.get(row.id).events.filter(e=>e.start>=Math.floor(t/RULES.weekMs)*RULES.weekMs&&e.start<(Math.floor(t/RULES.weekMs)+1)*RULES.weekMs).map(e=>({kind:e.kind,key:e.key,start:e.start,end:e.end,managerId:e.managerId}))};
 });
}
