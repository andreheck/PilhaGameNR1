/** Visual hypotheses, PM request 27/10: slower walking, conversation and weekly meetings.
 * Relative to existing screen motion; does not redefine seconds of the calendar.
 */
export const NPC_MOTION=Object.freeze({walkRate:.85,conversationMs:5000,meetingTravelMs:4500,meetingMs:6000,meetingStarts:[.15,.435,.72]});
export const workFraction=(t,start,end,speed=1,slot=0)=>{
 const span=Math.max(1,end-start),hold=Math.min(NPC_MOTION.conversationMs,span*.30),leg=(span-hold)/2,local=Math.max(0,Math.min(span,t-start));
 const peak=NPC_MOTION.walkRate*speed*(1-hold/span)*(1-(slot%2)*.025);
 return {fraction:local<leg?peak*local/leg:local<leg+hold?peak:peak*(span-local)/leg,holding:local>=leg&&local<leg+hold};
};
