/* Clickable scenery and outdoor navigation, layered over the existing world simulation. */
var activePlayerObject=null,playerActivity='idle',playerActivityUntil=0;
function playerBounds(room){return{x0:0,x1:room.key==='producao'?25:room.key==='escritorio'?24:W,y0:room.key==='escritorio'?-6:0,y1:room.key==='restauracao'?26:room.key==='producao'?12:room.key==='escritorio'?8:(room.depth||D)};}
function playerAStar(start,target,bounds,obstacles,step){
 step=step||.5;var cols=Math.ceil((bounds.x1-bounds.x0)/step)+1,rows=Math.ceil((bounds.y1-bounds.y0)/step)+1,total=cols*rows;
 function xy(id){return{x:bounds.x0+(id%cols)*step,y:bounds.y0+Math.floor(id/cols)*step};}
 function index(x,y){return Math.max(0,Math.min(rows-1,Math.round((y-bounds.y0)/step)))*cols+Math.max(0,Math.min(cols-1,Math.round((x-bounds.x0)/step)));}
 function blocked(p){return p.x<bounds.x0-.001||p.x>bounds.x1+.001||p.y<bounds.y0-.001||p.y>bounds.y1+.001||obstacles.some(function(r){return p.x>r.x&&p.x<r.x+r.w&&p.y>r.y&&p.y<r.y+r.d;});}
 var s=index(start.x,start.y),g=index(target.x,target.y),blockedGrid=new Uint8Array(total);for(var k=0;k<total;k++)blockedGrid[k]=blocked(xy(k))?1:0;blockedGrid[s]=blockedGrid[g]=0;
 var open=[],closed=new Uint8Array(total),prev=new Int32Array(total),cost=new Float64Array(total),heur=new Float64Array(total);prev.fill(-1);cost.fill(Infinity);
 function h(id){var p=xy(id),q=xy(g);return Math.hypot(p.x-q.x,p.y-q.y);}
 function push(id){var n=open.length;open.push(id);var f=cost[id]+heur[id];while(n>0){var par=(n-1)>>1,pid=open[par];if(cost[pid]+heur[pid]<=f)break;open[n]=pid;n=par;}open[n]=id;}
 function pop(){var top=open[0],last=open.pop();if(open.length){var i=0;while(true){var l=i*2+1,r=l+1,b=i;if(l<open.length&&cost[open[l]]+heur[open[l]]<cost[open[b]]+heur[open[b]])b=l;if(r<open.length&&cost[open[r]]+heur[open[r]]<cost[open[b]]+heur[open[b]])b=r;if(b===i)break;open[i]=open[b];i=b;}open[i]=last;}return top;}
 cost[s]=0;heur[s]=h(s);push(s);var dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],guard=0;
 while(open.length&&guard++<total*3){var u=pop();if(closed[u])continue;if(u===g)break;closed[u]=1;var p=xy(u);for(var d=0;d<dirs.length;d++){var xx=u%cols+dirs[d][0],yy=Math.floor(u/cols)+dirs[d][1];if(xx<0||xx>=cols||yy<0||yy>=rows)continue;var v=yy*cols+xx;if(blockedGrid[v]||closed[v])continue;if(dirs[d][0]&&dirs[d][1]&&(blockedGrid[u+dirs[d][0]]||blockedGrid[u+dirs[d][1]*cols]))continue;var q=xy(v),ng=cost[u]+Math.hypot(q.x-p.x,q.y-p.y);if(ng<cost[v]){cost[v]=ng;prev[v]=u;heur[v]=h(v);push(v);}}
 }
 if(s!==g&&!Number.isFinite(cost[g]))return null;var path=[];for(var n=g;n>=0;n=prev[n]){path.unshift(xy(n));if(n===s)break;}if(!path.length)return null;
 path[0]={x:start.x,y:start.y};path[path.length-1]={x:target.x,y:target.y};return path.filter(function(p,i,a){return !i||Math.hypot(p.x-a[i-1].x,p.y-a[i-1].y)>.08;});
}
function playerRouteWithin(room,start,target){var b=playerBounds(room),items=room.env.items,obstacles=items.filter(function(it){return !it.layoutHidden&&!it.visualProgram&&!it.walkable;}).map(function(it){return{x:it.x-.2,y:it.y-.2,w:it.w+.4,d:it.d+.4};});var path=playerAStar(start,target,b,obstacles,.5);return path||[];}
function playerWorldPointAtScreen(px,py){applyCam();var u=cam.cx+(px-cw/2)/s,v=cam.cy+(py-ch/2)/s+.55*ZU,a=u/(TW/2),b=v/(TH/2),x=(a+b)/2,y=(b-a)/2,plot=worldPlot;if(roomAt(x,y))return{x:x,y:y};if(plot&&x>=plot.x&&x<=plot.x+plot.size&&y>=plot.y&&y<=plot.y+plot.size)return{x:x,y:y};return null;}
function playerOutsidePath(start,target){var plot=worldPlot,obstacles=[];if(!plot)return null;worldCfg.forEach(function(c){var maxX=c.key==='producao'?25:c.key==='escritorio'?24:W,minY=c.key==='escritorio'?-6:0,maxY=c.key==='restauracao'?26:c.key==='producao'?12:c.key==='escritorio'?0:(c.depth||D);obstacles.push({x:c.bx-.28,y:c.by+minY-.28,w:maxX+.56,d:maxY-minY+.56});});(plot.plannedSpaces||[]).forEach(function(place){(place.walls||[]).forEach(function(w){obstacles.push({x:w.x-.18,y:w.y-.18,w:w.width+.36,d:w.depth+.36});});if(place.counter)obstacles.push({x:place.counter.x-.15,y:place.counter.y-.15,w:place.counter.width+.3,d:place.counter.depth+.3});});var bounds={x0:plot.x,y0:plot.y,x1:plot.x+plot.size,y1:plot.y+plot.size};return playerAStar(start,target,bounds,obstacles,.5);}
function planPlayerIndoor(from,to){var prior={x:playerActor.x,y:playerActor.y,moving:playerActor.moving},route=playerRoute.slice();playerRoute=[];playerActor.x=from.x;playerActor.y=from.y;playerActor.moving=false;var ok=routePlayerIndoorTo(to.x,to.y),planned=ok?playerRoute.slice():null;playerActor.x=prior.x;playerActor.y=prior.y;playerActor.moving=prior.moving;playerRoute=route;return planned;}
function routePlayerTo(x,y){if(!playerActor||!worldCfg)return false;var startRoom=roomAt(playerActor.x,playerActor.y),goalRoom=roomAt(x,y),yard=worldCfg.find(function(c){return c.key==='restauracao';});if(startRoom&&goalRoom)return routePlayerIndoorTo(x,y);if(!yard)return false;var gateIn={x:yard.bx+6.2,y:yard.by+25.55},gateOut={x:yard.bx+6.2,y:yard.by+26.45},outPath=null,combined=[];
 if(startRoom&&!goalRoom){var first=planPlayerIndoor({x:playerActor.x,y:playerActor.y},{x:gateIn.x,y:gateIn.y});if(!first)return false;outPath=playerOutsidePath(gateOut,{x:x,y:y});if(!outPath)return false;combined=first.concat([{x:gateOut.x,y:gateOut.y}],outPath.slice(1));}
 else if(!startRoom&&goalRoom){outPath=playerOutsidePath({x:playerActor.x,y:playerActor.y},gateOut);if(!outPath)return false;var last=planPlayerIndoor(gateIn,{x:x,y:y});if(!last)return false;combined=outPath.concat([{x:gateIn.x,y:gateIn.y}],last.slice(1));}
 else if(!startRoom&&!goalRoom){outPath=playerOutsidePath({x:playerActor.x,y:playerActor.y},{x:x,y:y});if(!outPath)return false;combined=outPath;}
 if(!combined.length)return false;if(Math.hypot(combined[0].x-playerActor.x,combined[0].y-playerActor.y)<.03)combined.shift();playerRoute=combined;playerActivity='walk';playerActor.activity='walk';playerActor.sit=false;playerActor.moving=!!combined.length;render();return true;
}
function playerObjectList(){
 var list=[];
 if(!worldCfg)return list;
 var labels={desk:'Mesa de trabalho',table:'Mesa',meetingTable:'Mesa de reunião',cabinet:'Armário','water-dispenser':'Filtro de água · bombona',chair:'Cadeira',sofa:'Sofá',plant:'Planta',machine:'Máquina',conveyor:'Esteira logística',shelf:'Prateleira',board:'Painel informativo',box:'Caixa',crate:'Caixa',fridge:'Geladeira',coffee:'Bancada de café',television:'Televisão'};
 worldCfg.forEach(function(c){c.env.items.forEach(function(it,index){if(it.layoutHidden||it.visualProgram||it.structural||it.walkable)return;var type=it.t||'object',name=it.interactionName||labels[type]||String(it.visualAsset||it.visualId||type).replace(/^chair-/,'Cadeira ').replace(/[-_]/g,' ');var actions=[];
  if(/chair|sofa|seat|puff|bench|banco/.test(type+' '+(it.visualAsset||'')))actions=[['sit','Sentar'],['meditate','Meditar'],['rest','Descansar']];
  else if(type==='meetingTable')actions=[['sit','Sentar para a reunião'],['talk','Conversar à mesa']];
  else if(type==='water-dispenser')actions=[['drink','Beber água'],['rest','Fazer uma pausa']];
  else if(type==='desk'||type==='table')actions=[['work','Interagir'],['talk','Conversar'],['rest','Fazer uma pausa']];
  else if(type==='plant'||/arvore|planta/.test(it.visualAsset||''))actions=[['observe','Observar'],['meditate','Respirar com calma']];
  else if(type==='shelf'||/livro|estante/.test(it.visualAsset||''))actions=[['read','Ler'],['observe','Observar']];
  else if(type==='game'||/game-|arcade|fliperama|pinball|air-hockey|pebolim|sinuca|ping-pong/.test(it.visualAsset||''))actions=[['play','Jogar'],['talk','Jogar em grupo']];
  else if(type==='machine'||type==='conveyor'||it.warehouse)actions=[['observe','Observar'],['work','Interagir']];
  else if(type==='television'||type==='fridge'||type==='coffee')actions=[['rest','Fazer uma pausa'],['observe','Observar']];
  else actions=[['observe','Observar'],['rest','Fazer uma pausa']];
  var w=Math.max(.4,Number(it.w)||.8),d=Math.max(.4,Number(it.d)||.6),h=Math.max(.25,Number(it.h)||.7);
  list.push({id:c.key+'|'+(it.layoutKey||it.visualId||it.visualAsset||type)+'|'+index,name:name.replace(/^rest2\s+/i,'').replace(/^rest2[-_]/i,'').replace(/[-_]/g,' '),sector:c.key,x:c.bx+it.x,y:c.by+it.y,w:w,d:d,h:h,actions:actions,local:it,room:c});
 });});
 return list;
}
function playerObjectAtScreen(px,py){
 if(!playerActor)return null;
 var hits=playerObjectList().map(function(o){var p=worldToScreenPoint(o.x+o.w/2,o.y+o.d/2),width=Math.max(32,(o.w+o.d)*TW/2*s*.72),height=Math.max(30,(o.w+o.d)*TH/2*s+o.h*ZU*s),x=p.x-width/2,y=p.y-height+12*s,inside=px>=x-8&&px<=x+width+8&&py>=y-8&&py<=p.y+14*s;return inside?{o:o,depth:o.x+o.y+o.w+o.d}:null;}).filter(Boolean).sort(function(a,b){return b.depth-a.depth;});
 return hits.length?hits[0].o:null;
}
function worldToScreenPoint(x,y){applyCam();return{x:ox+(x-y)*TW/2*s,y:oy+(x+y)*TH/2*s-.55*ZU*s};}
function playerApproach(o){
 var candidates=[{x:o.x+o.w/2,y:o.y-.55},{x:o.x+o.w+.55,y:o.y+o.d/2},{x:o.x+o.w/2,y:o.y+o.d+.55},{x:o.x-.55,y:o.y+o.d/2}],bounds=playerBounds(o.room);
 candidates=candidates.filter(function(p){var x=p.x-o.room.bx,y=p.y-o.room.by;return x>bounds.x0+.2&&x<bounds.x1-.2&&y>bounds.y0+.2&&y<bounds.y1-.2;}).sort(function(a,b){return Math.hypot(a.x-playerActor.x,a.y-playerActor.y)-Math.hypot(b.x-playerActor.x,b.y-playerActor.y);});
 for(var i=0;i<candidates.length;i++){if(Math.hypot(candidates[i].x-playerActor.x,candidates[i].y-playerActor.y)<.35)return true;if(routePlayerTo(candidates[i].x,candidates[i].y))return true;}
 return false;
}
function approachPlayerObject(id){var o=playerObjectList().find(function(x){return x.id===id;});if(!o||!playerActor)return false;activePlayerObject=o;playerActivity='walk';playerActor.activity='walk';playerActor.sit=false;playerActor.objectId=id;return playerApproach(o);}
function mysteryEmployeePosition(id){return typeof employeePositions==='function'?employeePositions().find(function(p){return p.id===id;}):null;}
function approachMysteryEmployee(id){var p=mysteryEmployeePosition(id),room=p&&worldCfg&&worldCfg.find(function(c){return c.key===p.sector;});if(!p||!room||!playerActor)return false;var o={id:'mystery-contact:'+id,actorId:id,name:p.name,sector:p.sector,x:room.bx+p.x-.3,y:room.by+p.y-.3,w:.6,d:.6,h:1.7,room:room,actions:[['talk','Conversar']]};activePlayerObject=o;playerActivity='walk';playerActor.activity='walk';playerActor.sit=false;playerActor.objectId=o.id;return playerApproach(o);}
function isNearMysteryEmployee(id){var p=mysteryEmployeePosition(id);return !!(p&&playerActor&&!playerActor.moving&&Math.hypot(playerActor.x-(worldCfg.find(function(c){return c.key===p.sector;})||{bx:0,by:0}).bx-p.x,playerActor.y-(worldCfg.find(function(c){return c.key===p.sector;})||{bx:0,by:0}).by-p.y)<1.55);}
function beginMysteryConversation(id){if(!isNearMysteryEmployee(id))return false;playerActivity='talk';playerActivityUntil=0;playerActor.activity='talk';playerActor.sit=false;render();return true;}
function performPlayerAction(id,action){
 var o=playerObjectList().find(function(x){return x.id===id;});if(!o||!playerActor||!o.actions.some(function(a){return a[0]===action;}))return{ok:false,error:'action-not-available'};
 if(playerActor.moving||activePlayerObject?.id!==id)return{ok:false,error:'not-near-object'};
 activePlayerObject=o;playerActivity=action;playerActivityUntil=performance.now()+90000;playerActor.moving=false;playerActor.activity=action;playerActor.objectId=id;playerActor.sit=action==='sit';playerActor.phase=playerActor.phase||0;render();return{ok:true,activity:action,object:o.name};
}
function currentPlayerObject(){return activePlayerObject?{id:activePlayerObject.id,name:activePlayerObject.name,sector:activePlayerObject.sector,actions:activePlayerObject.actions.map(function(a){return a.slice();})}:null;}
function settlePlayerActivity(){if(!playerActor)return;if(playerActivityUntil&&performance.now()>=playerActivityUntil){playerActivity='idle';playerActivityUntil=0;playerActor.sit=false;playerActor.activity='idle';}else if(!playerRoute.length&&playerActivity==='walk'){playerActivity='observe';playerActor.activity='observe';} }
