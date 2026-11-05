/** Visual pacing assumptions for the continuous game. Calendar time is unchanged. */
export const NPC_MOTION=Object.freeze({
  walkRate:.85,
  conversationMs:5000,
  meetingTravelMs:4500,
  meetingMs:6000,
  meetingStarts:[.15,.435,.72]
});

export function workFraction(t,start,end,speed=1,slot=0){
  const span=Math.max(1,end-start);
  const hold=Math.min(NPC_MOTION.conversationMs,span*.30);
  const leg=(span-hold)/2;
  const local=Math.max(0,Math.min(span,t-start));
  const peak=NPC_MOTION.walkRate*speed*(1-hold/span)*(1-(slot%6)*.02);
  return {fraction:local<leg?peak*local/leg:local<leg+hold?peak:peak*(span-local)/leg,holding:local>=leg&&local<leg+hold};
}
