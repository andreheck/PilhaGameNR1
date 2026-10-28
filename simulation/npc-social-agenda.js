import {RULES} from '../data/continuous/catalog.js';
import {managerMap,DEPARTMENTS} from '../data/continuous/organization.js';
import {NPC_MOTION,workFraction} from './npc-motion.js';
// Seven two-day rotas and two weekly meetings repeat every fourteen days.
// Solve a fixed cycle, rather than re-solving a sliding window on every tick:
// a shifted pause must never overlap its neighbour or change on reload.
const cycleMs=RULES.weekMs*2,scheduleCache=new Map();
function schedule(row,manager,hasManager,dept,seat,period){
 const cacheKey=JSON.stringify([row.id,row.sid,row.space,row.offset,row.outEnd,row.pauseEnd,row.tripEnd,row.speed,manager,hasManager,seat,period]);
 let templates=scheduleCache.get(cacheKey);
 if(!templates){
  const travel=NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*row.speed),meetings=hasManager?Array.from({length:10},(_,i)=>{
   const week=i-4,start=(week+NPC_MOTION.meetingStarts[dept])*RULES.weekMs;
   return {kind:'meeting',week,start,out:start+travel,pauseEnd:start+travel+NPC_MOTION.meetingMs,end:start+travel*2+NPC_MOTION.meetingMs,space:'patio',target:'meeting:'+seat,managerId:manager,seat};
  }):[],events=[];
  let previousEnd=-Infinity;
  for(let n=-14;n<=20;n++){
   const nominal=(n+row.offset)*period,duration=row.tripEnd*period;
   let start=Math.max(nominal,previousEnd+500),conflict;
   while((conflict=meetings.find(m=>start<m.end&&start+duration>m.start)))start=conflict.end+500+seat*600;
   const event={kind:'rest',n,start,out:start+row.outEnd*period,pauseEnd:start+row.pauseEnd*period,end:start+duration,space:row.space,target:row.space};
   events.push(event);previousEnd=event.end;
  }
  templates=[...events,...meetings].filter(e=>e.start>=-1e-6&&e.start<cycleMs-1e-6).map(e=>{
   if(Math.abs(e.start-Math.round(e.start))<1e-6){const start=Math.round(e.start),delta=start-e.start;return {...e,start,out:e.out+delta,pauseEnd:e.pauseEnd+delta,end:e.end+delta};}
   return e;
  }).sort((a,b)=>a.start-b.start);
  if(scheduleCache.size>=256)scheduleCache.delete(scheduleCache.keys().next().value);
  scheduleCache.set(cacheKey,templates);
 }
 return templates;
}
/** Derived schedules only. No journal, payouts or replayable saved transactions. */
export function addSocialAgenda(state,people,rows,period){
 const t=(state.week-1)*RULES.weekMs+state.activeMs,managers=managerMap(state),plans=new Map();
 for(const original of rows){
  const row={...original};
  const members=people.filter(p=>p.home===row.sid).sort((a,b)=>a.id.localeCompare(b.id));
  const manager=managers[row.sid],hasManager=members.some(p=>p.id===manager),seat=members.findIndex(p=>p.id===row.id),events=[];
  row.workSlot=seat;
  const cycle=Math.floor(t/cycleMs),dept=DEPARTMENTS.indexOf(row.sid),templates=schedule(row,manager,hasManager,dept,seat,period);
  for(let c=cycle-1;c<=cycle+1;c++)for(const template of templates){
   const shift=c*cycleMs,event={...template};
   for(const key of ['start','out','pauseEnd','end'])event[key]+=shift;
   event.key=event.kind==='meeting'?'meeting:'+(template.week+c*2)+':'+row.sid:'rest:'+(template.n+c*7)+':'+row.id;
   events.push(event);
  }
  events.sort((a,b)=>a.start-b.start);plans.set(row.id,{row,events});
 }
 function pose(id,now){
  const {row,events}=plans.get(id),active=events.find(e=>now>=e.start&&now<e.end);
  if(active){
   const rest=now>=active.out&&now<active.pauseEnd,back=now>=active.pauseEnd;
   const stage=rest?'rest':back?'return':'outbound',progress=rest?1:back?1-(now-active.pauseEnd)/(active.end-active.pauseEnd):(now-active.start)/(active.out-active.start);
   return {stage:active.kind==='meeting'?(rest?'meeting':'meeting-'+stage):stage,baseStage:stage,kind:active.kind,space:active.space,target:active.target,managerId:active.managerId,seat:active.seat,key:active.key,progress,holding:rest,moving:!rest,influenced:rest||back,inRestArea:rest,meeting:active.kind==='meeting'};
  }
  const last=events.filter(e=>e.end<=now).at(-1),next=events.find(e=>e.start>now),start=last?.end??now-period,end=next?.start??now+period;
  const w=workFraction(now,start,end,row.speed,row.workSlot),influenced=!!last&&now-last.end<.18*period*row.scale;
  return {stage:influenced?'afterglow':'work',kind:'work',space:last?.space||row.space,workFraction:w.fraction,holding:w.holding,moving:!w.holding,influenced,inRestArea:false,meeting:false};
 }
 return rows.map(row=>{
  const sampleAt=now=>{
   const p=pose(row.id,now);
   if(p.kind==='work'&&p.holding){
    const group=rows.filter(r=>r.sid===row.sid).map(r=>({r,p:pose(r.id,now)})).filter(x=>x.p.kind==='work'&&x.p.holding).sort((a,b)=>a.r.id.localeCompare(b.r.id));
    while(group.length){const a=group.shift(),i=group.findIndex(b=>Math.abs(b.p.workFraction-a.p.workFraction)>.013&&Math.abs(b.p.workFraction-a.p.workFraction)<.045);if(i<0)continue;const b=group.splice(i,1)[0];if(a.r.id===row.id||b.r.id===row.id)return {...p,stage:'conversation',talking:true,partnerId:a.r.id===row.id?b.r.id:a.r.id};}
   }
   return {...p,talking:p.stage==='meeting'};
  };
  return {...row,workSlot:plans.get(row.id).row.workSlot,...sampleAt(t),motionRate:NPC_MOTION.walkRate,sampleAt,meetingScheduled:plans.get(row.id).events.some(e=>e.kind==='meeting'),agenda:plans.get(row.id).events.filter(e=>e.start>=Math.floor(t/RULES.weekMs)*RULES.weekMs&&e.start<(Math.floor(t/RULES.weekMs)+1)*RULES.weekMs).map(e=>({kind:e.kind,key:e.key,start:e.start,end:e.end,managerId:e.managerId}))};
 });
}
