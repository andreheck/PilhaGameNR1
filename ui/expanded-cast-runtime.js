// Visual supporting cast. Kept outside the canonical staff, economy and health model.
var expandedImages={},expandedGuests={yoga:true,advogado:true},expandedHits=[],expandedDrawn=[];
function expandedImage(url){if(!url||!global.Image)return null;if(!expandedImages[url]){var image=new global.Image();expandedImages[url]=image;image.onload=function(){if(!running)render();};image.src=url;}return expandedImages[url];}
function expandedPose(id,e){
 var actor=expandedCast.find(function(a){return a.id===id;}),n=expandedCast.indexOf(actor),t=time,action='idle',frameTime=t,x,y,facing=0;
 if(id==='yoga'){
  var rug=e.items.find(function(it){return it.visualAsset==='rest2-tapete_indiano';});
  if(!rug)return null; x=rug.x+rug.w*.5;y=rug.y+rug.d*.5;
  var cycle=t%35;action=cycle<12?'breathe':cycle<14.5?'floor-sit':cycle<31?'floor-idle':'rise';frameTime=cycle-(cycle<12?0:cycle<14.5?12:cycle<31?14.5:31);
 }else{
  // Same unobstructed company aisle as the introductory actors; no furniture crossing.
  var elapsed=t%32,walkTime=Math.floor(t/32)*20+Math.min(elapsed,20),d=(n*1.3+walkTime*.56)%AISLE_LENGTH,point=aislePoint(d),next=aislePoint((d+.01)%AISLE_LENGTH);
  x=point.x;y=point.y;action=elapsed<20?'walk':actor.actions.talk?'talk':'idle';frameTime=action==='walk'?walkTime*.56/1.4:t;
  var dx=next.x-x,dy=next.y-y;facing=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
 }
 var clip=actor.actions[action]||actor.actions.idle,frame=clip.mode==='hold'?0:clip.mode==='once'?Math.min(clip.frames-1,Math.floor(frameTime/clip.duration*clip.frames)):Math.floor(frameTime/clip.duration*clip.frames)%clip.frames;
 return {actor:actor,clip:clip,action:action,frame:frame,x:x,y:y,facing:facing};
}
function drawExpandedActor(p,e){
 var image=expandedImage(p.clip.url);if(!image||!image.complete||!image.naturalWidth)return;
 var q=P(p.x,p.y,0),height=p.clip.renderHeight*ZU*s,width=height*128/192;
 var fw=image.naturalWidth/p.clip.frames,fh=image.naturalHeight/(p.clip.directions||4);
 ctx.drawImage(image,p.frame*fw,p.facing*fh,fw,fh,q[0]-width/2,q[1]-height*p.clip.anchorY,width,height);
 expandedHits.push({id:p.actor.id,x:q[0],y:q[1]-.85*ZU*s,r:Math.max(12,.8*ZU*s)});
 expandedDrawn.push({id:p.actor.id,sector:e.key,action:p.action,frame:p.frame,x:p.x,y:p.y});
}
function expandedEntries(e,list){if(introCastRows.length)return;expandedCast.forEach(function(a){if(!expandedGuests[a.id]||a.binding||a.sector!==e.key)return;var p=expandedPose(a.id,e);if(p)list.push({k:p.x+p.y,f:function(){drawExpandedActor(p,e);}});});}
