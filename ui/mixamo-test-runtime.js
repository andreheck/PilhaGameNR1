/* Isolated visual guest. Never enters employee state, routes, collisions or health. */
var animationTest={enabled:false,frame:0,direction:0,playing:false,x:6,y:16.4},animationTestImage=null,animationTestRAF=0,animationTestStarted=0;
function animationTestInfo(){return {enabled:animationTest.enabled,loaded:!!(animationTestImage&&animationTestImage.complete&&animationTestImage.naturalWidth),frame:animationTest.frame,direction:animationTest.direction,playing:animationTest.playing,sector:'restauracao',x:animationTest.x,y:animationTest.y,duration:4.5333333015441895};}
function setAnimationTest(options){
 global.cancelAnimationFrame(animationTestRAF);animationTestRAF=0;animationTest.enabled=options.enabled!==false;animationTest.direction=Math.max(0,Math.min(3,Number(options.direction)||0));animationTest.playing=animationTest.enabled;
 if(animationTest.enabled&&!animationTestImage&&global.Image){animationTestImage=new global.Image();animationTestImage.onload=function(){animationTestStarted=performance.now();animationTest.frame=0;advanceAnimationTest(animationTestStarted);};animationTestImage.src='/assets/animation-tests/mixamo-reaction.png';}
 if(!animationTest.enabled){animationTest.playing=false;render();return;}
 animationTestStarted=performance.now();animationTest.frame=0;if(animationTestImage&&animationTestImage.complete)advanceAnimationTest(animationTestStarted);render();
}
function advanceAnimationTest(now){
 if(!animationTest.enabled)return;var progress=Math.min(1,Math.max(0,(now-animationTestStarted)/4533.3333015441895));animationTest.frame=Math.min(31,Math.floor(progress*32));animationTest.playing=progress<1;
 if(!running)render();if(animationTest.playing)animationTestRAF=global.requestAnimationFrame(advanceAnimationTest);
}
function drawAnimationTest(){
 if(!animationTest.enabled||!animationTestImage||!animationTestImage.complete||!animationTestImage.naturalWidth)return;
 var foot=P(animationTest.x,animationTest.y,0),u=ZU*s,sh=2.15*u,sw=sh*128/192;
 ctx.save();ctx.fillStyle='rgba(102,218,235,.16)';ctx.strokeStyle='#72d5e3';ctx.lineWidth=Math.max(1,s);ctx.beginPath();ctx.ellipse(foot[0],foot[1],u*.38,u*.18,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.drawImage(animationTestImage,animationTest.frame*128,animationTest.direction*192,128,192,foot[0]-sw/2,foot[1]-sh*.7919900286053034,sw,sh);ctx.restore();
}
