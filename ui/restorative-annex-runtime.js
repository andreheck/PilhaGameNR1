/* Presentation-only extension; injected into the existing ISO closure at build. */
function roomDepth(c){return c&&c.key==='restauracao'?18:D;}
function drawRestAnnex(e){
 if(!worldCfg||e.key!=='restauracao')return;
 poly([P(0,8,0),P(W,8,0),P(W,18,0),P(0,18,0)],'#36534e');
 for(var x=0;x<12;x++)for(var y=8;y<18;y++)poly([P(x,y,0),P(x+1,y,0),P(x+1,y+1,0),P(x,y+1,0)],x>=8?((x+y)%2?'#435764':'#3b4e5b'):((x+y)%2?'#527b63':'#466e59'));
 poly([P(0,18,0),P(W,18,0),P(W,18,-SLAB),P(0,18,-SLAB)],'#243c35');
 poly([P(W,8,0),P(W,18,0),P(W,18,-SLAB),P(W,8,-SLAB)],'#1d3535');
 ctx.save();ctx.lineWidth=Math.max(1,1.4*s);ctx.strokeStyle='#a7c8b888';ctx.setLineDash([5*s,5*s]);ctx.beginPath();var a=P(7.5,8,.01),b=P(7.5,15.2,.01),c=P(3.5,15.2,.01);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.stroke();ctx.restore();
}
function drawRestAnnexLabels(){
 var c=worldCfg&&worldCfg.find(function(c){return c.key==='restauracao';});
 if(!c||!((selIdx>=0&&worldCfg[selIdx].key==='restauracao')||cam.k>1.7))return;
 var patio=P(c.bx+3.5,c.by+16.5,.1),quiet=P(c.bx+10,c.by+16.3,.1);
 pill(patio[0],patio[1],'Pátio',{fs:11,border:'#86ceb3'});
 pill(quiet[0],quiet[1],'Sala restaurativa',{fs:11,border:'#8cc8e0'});
}
function focusRestAnnex(dur){
 var c=worldCfg&&worldCfg.find(function(c){return c.key==='restauracao';});if(!c)return;
 var uv=tileUV(c.bx+6,c.by+13,.6),k=Math.min(cw*.92/704,ch*.84/460)/s0;
 flyTo({cx:uv[0],cy:uv[1],k:k},dur||0);
}
function restorativeWorldLayout(){return worldCfg?worldCfg.map(function(c){return {key:c.key,bx:c.bx,by:c.by,width:W,depth:roomDepth(c)};}):[];}
