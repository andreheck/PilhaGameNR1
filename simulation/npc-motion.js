import {RULES} from '../data/continuous/catalog.js';
/** Visual pacing follows the canonical calendar; work speed is a separate bound. */
export const NPC_MOTION=Object.freeze({
  walkRate:.70,
  conversationMs:RULES.weekMs/24,
  meetingTravelMs:RULES.weekMs*.0375,
  meetingMs:RULES.weekMs*.05,
  meetingStarts:[.15,.435,.72]
});

/** Stable visual variation by ID only; unrelated to personality, job or health. */
export function walkingPace(id){
  const key=String(id??'');
  const canonical=/^NPC-(\d+)$/.exec(key);
  const seed=canonical?Number(canonical[1]):Array.from(key).reduce((n,c)=>(n*31+c.charCodeAt(0))%997,0);
  return .82+((seed*7)%17)/16*.36;
}

export function workFraction(t,start,end,speed=1,slot=0){
  const span=Math.max(1,end-start);
  const hold=Math.min(NPC_MOTION.conversationMs,span*.30);
  const leg=(span-hold)/2;
  const local=Math.max(0,Math.min(span,t-start));
  const peak=NPC_MOTION.walkRate*speed*(1-hold/span)*(1-(slot%6)*.02);
  return {fraction:local<leg?peak*local/leg:local<leg+hold?peak:peak*(span-local)/leg,holding:local>=leg&&local<leg+hold,
    segment:local<leg?'task':local<leg+hold?'gather':'return-home',segmentProgress:local<leg?local/leg:local<leg+hold?(local-leg)/Math.max(1,hold):(local-leg-hold)/leg,gatherFraction:peak};
}
