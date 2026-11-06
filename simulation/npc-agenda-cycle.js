import {RULES} from '../data/continuous/catalog.js';
import {NPC_MOTION} from './npc-motion.js';

export const AGENDA_CYCLE_MS=RULES.weekMs*2;
const cache=new Map();

/** Seven complete rest trips and two meetings, derived without saved journals. */
export function cycleEvents(row,{manager,hasManager,dept,seat},period,time){
 const key=JSON.stringify([row.id,row.sid,row.space,row.offset,row.outEnd,row.pauseEnd,row.tripEnd,row.speed,manager,hasManager,dept,seat,period]);
 let templates=cache.get(key);
 if(!templates){
  const travel=NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*row.speed);
  const meetings=hasManager?Array.from({length:16},(_,i)=>{
   const week=i-7,start=(week+NPC_MOTION.meetingStarts[dept])*RULES.weekMs;
   return {kind:'meeting',week,start,out:start+travel,pauseEnd:start+travel+NPC_MOTION.meetingMs,end:start+travel*2+NPC_MOTION.meetingMs,space:'patio',target:'meeting:'+seat,managerId:manager,seat};
  }):[];
  const breaks=[];let previousEnd=-Infinity;
  // Warm up identical cycles so a delayed visit entering the cycle is retained.
  for(let n=-35;n<=13;n++){
   const duration=row.tripEnd*period;
   let start=Math.max((n+row.offset)*period,previousEnd+500),conflict;
   while((conflict=meetings.find(m=>start<m.end&&start+duration>m.start)))start=conflict.end+500+seat*600;
   const event={kind:'rest',n,start,out:start+row.outEnd*period,pauseEnd:start+row.pauseEnd*period,end:start+duration,space:row.space,target:row.space};
   previousEnd=event.end;if(n>=0&&n<7)breaks.push(event);
  }
  templates=[...breaks,...meetings.filter(e=>e.week>=0&&e.week<2)].map(e=>{
   const rounded=Math.round(e.start),delta=Math.abs(e.start-rounded)<1e-6?rounded-e.start:0;
   const wrap=Math.floor((e.start+delta)/AGENDA_CYCLE_MS),shift=wrap*AGENDA_CYCLE_MS,result={...e};
   for(const name of ['start','out','pauseEnd','end'])result[name]+=delta-shift;
   if(e.kind==='rest')result.n-=wrap*7;else result.week-=wrap*2;
   return result;
  }).sort((a,b)=>a.start-b.start);
  if(cache.size>=256)cache.delete(cache.keys().next().value);
  cache.set(key,templates);
 }
 const cycle=Math.floor(time/AGENDA_CYCLE_MS),events=[];
 for(let c=cycle-1;c<=cycle+1;c++)for(const template of templates){
  const event={...template},shift=c*AGENDA_CYCLE_MS;
  for(const name of ['start','out','pauseEnd','end'])event[name]+=shift;
  event.key=event.kind==='meeting'?'meeting:'+(template.week+c*2)+':'+row.sid:'rest:'+(template.n+c*7)+':'+row.id;
  events.push(event);
 }
 return events.sort((a,b)=>a.start-b.start);
}
