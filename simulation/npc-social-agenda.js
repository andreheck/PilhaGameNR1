import {RULES} from '../data/continuous/catalog.js';
import {managerMap,DEPARTMENTS} from '../data/continuous/organization.js';
import {NPC_MOTION,workFraction} from './npc-motion.js';
import {cycleEvents} from './npc-agenda-cycle.js';

/** Derived schedules only. No journal, payouts or replayable saved transactions. */
export function addSocialAgenda(state,people,rows,period){
  const t=(state.week-1)*RULES.weekMs+state.activeMs,managers=managerMap(state),plans=new Map();
  for(const original of rows){
    const row={...original};
    const members=people.filter(p=>p.home===row.sid).sort((a,b)=>a.id.localeCompare(b.id));
    const manager=managers[row.sid],hasManager=members.some(p=>p.id===manager),seat=members.findIndex(p=>p.id===row.id);
    row.workSlot=seat;
    const events=cycleEvents(row,{manager,hasManager,dept:DEPARTMENTS.indexOf(row.sid),seat},period,t);
    plans.set(row.id,{row,events});
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
    return {stage:influenced?'afterglow':'work',kind:'work',space:last?.space||row.space,workStart:start,workEnd:end,workFraction:w.fraction,workSegment:w.segment,workProgress:w.segmentProgress,gatherFraction:w.gatherFraction,holding:w.holding,moving:!w.holding,influenced,inRestArea:false,meeting:false};
  }
  return rows.map(row=>{
    const sampleAt=now=>{
      const p=pose(row.id,now);
      if(p.kind==='rest'&&p.inRestArea){
        const group=rows.map(r=>({r,p:pose(r.id,now)})).filter(x=>x.p.kind==='rest'&&x.p.inRestArea&&x.p.space===p.space).sort((a,b)=>a.r.id.localeCompare(b.r.id)),index=group.findIndex(x=>x.r.id===row.id);
        if(group.length>1){let peerIndex=index%2===0?index+1:index-1;if(peerIndex<group.length)return {...p,talking:true,partnerId:group[peerIndex].r.id};}
      }
      if(p.kind==='work'&&p.holding){
        const group=rows.filter(r=>r.sid===row.sid).map(r=>({r,p:pose(r.id,now)})).filter(x=>x.p.kind==='work'&&x.p.holding).sort((a,b)=>a.r.id.localeCompare(b.r.id));
        while(group.length){const a=group.shift(),i=group.findIndex(b=>Math.abs(b.p.workFraction-a.p.workFraction)>.013&&Math.abs(b.p.workFraction-a.p.workFraction)<.045);if(i<0)continue;const b=group.splice(i,1)[0];if(a.r.id===row.id||b.r.id===row.id)return {...p,stage:'conversation',talking:true,partnerId:a.r.id===row.id?b.r.id:a.r.id};}
      }
      return {...p,talking:p.stage==='meeting'};
    };
    return {...row,workSlot:plans.get(row.id).row.workSlot,...sampleAt(t),motionRate:NPC_MOTION.walkRate,sampleAt,meetingScheduled:plans.get(row.id).events.some(e=>e.kind==='meeting'),agenda:plans.get(row.id).events.filter(e=>e.start>=Math.floor(t/RULES.weekMs)*RULES.weekMs&&e.start<(Math.floor(t/RULES.weekMs)+1)*RULES.weekMs).map(e=>({kind:e.kind,key:e.key,start:e.start,out:e.out,pauseEnd:e.pauseEnd,end:e.end,managerId:e.managerId}))};
  });
}
