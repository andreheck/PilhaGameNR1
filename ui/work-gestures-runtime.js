function seatedLegs(p,fy,fx,hipY,u,amount){
 var vectors=[[0,1],[1,0],[0,-1],[-1,0]],v=vectors[p.facing||0],side=[v[1],-v[0]],height=(p.seatHeight||.47)*amount;
 ctx.save();ctx.lineCap='round';ctx.lineWidth=.105*u;ctx.strokeStyle='#263b50';
 for(var leg=-1;leg<=1;leg+=2){var x=p.x+side[0]*leg*.09,y=p.y+side[1]*leg*.09,knee=P(x+v[0]*.28*amount,y+v[1]*.28*amount,height*.94),foot=P(x+v[0]*.36*amount,y+v[1]*.36*amount,0);ctx.beginPath();ctx.moveTo(fx+side[0]*leg*.07*u,hipY);ctx.lineTo(knee[0],knee[1]);ctx.lineTo(foot[0],foot[1]);ctx.stroke();ctx.strokeStyle='#162536';ctx.lineWidth=.12*u;ctx.beginPath();ctx.moveTo(foot[0],foot[1]);ctx.lineTo(foot[0]+v[0]*.08*u-v[1]*.08*u,foot[1]+.03*u);ctx.stroke();ctx.strokeStyle='#263b50';ctx.lineWidth=.105*u;}
 ctx.restore();
}
function drawWorkHands(p){if(p.restAway||p.activity!=='computer'||!p.workTarget||!p.workTarget.item)return;var it=p.workTarget.item,u=ZU*s,t=p.riggedSeconds||0;ctx.save();ctx.lineCap='round';ctx.lineWidth=Math.max(1,.07*u);ctx.strokeStyle=p.shirt;
 for(var side=-1;side<=1;side+=2){var shoulder=P(p.x+side*.10,p.y,(p.seatHeight||.47)+.43),hand=P(it.x+it.w*.5+side*.13,it.y+.10+Math.sin(t*6+side)*.018,.79);ctx.beginPath();ctx.moveTo(shoulder[0],shoulder[1]);ctx.lineTo((shoulder[0]+hand[0])/2,hand[1]-.07*u);ctx.lineTo(hand[0],hand[1]);ctx.stroke();ctx.fillStyle=p.skin;ctx.beginPath();ctx.arc(hand[0],hand[1],Math.max(1.2,.045*u),0,Math.PI*2);ctx.fill();}ctx.restore();}
