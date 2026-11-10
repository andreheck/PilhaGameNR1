/** Pure navigation over existing aisles and company bridges. No scene mutation. */
(function(g){
 function route(defs,aisle,links,home,space,workerId,startPoint){
  var nodes=[],edges=[],map={};
  function node(x,y){var key=x.toFixed(4)+','+y.toFixed(4);if(map[key]!=null)return map[key];map[key]=nodes.length;nodes.push({x:x,y:y});return nodes.length-1;}
  function edge(a,b){if(a!==b)edges.push([a,b]);}
  var segments=[];defs.forEach(function(c){aisle.forEach(function(p,i){var q=aisle[(i+1)%aisle.length];var segment=[{x:c.bx+p.x,y:c.by+p.y},{x:c.bx+q.x,y:c.by+q.y}];segment.roomKey=c.key;segments.push(segment);});});
  defs.filter(function(c){return c.key==='restauracao'&&c.depth>8;}).forEach(function(c){var paths=[[[8,7.7],[7.5,7.7]],[[7.5,7.7],[7.5,15.2]],[[7.5,15.2],[3.5,15.2]],[[11.6,7.7],[11.6,13.6]],[[11.6,13.6],[9.8,13.6]]];paths.forEach(function(pair){var segment=pair.map(function(p){return {x:c.bx+p[0],y:c.by+p[1]};});segment.roomKey=c.key;segments.push(segment);});});
  links.forEach(function(l){for(var i=1;i<l.points.length;i++)segments.push([l.points[i-1],l.points[i]]);});
  segments.forEach(function(s){node(s[0].x,s[0].y);node(s[1].x,s[1].y);});
  // Split all collinear aisle/bridge intersections, so doorway endpoints join the graph.
  segments.forEach(function(s){var a=s[0],b=s[1],list=nodes.map(function(p,i){return {p:p,i:i,t:Math.hypot(p.x-a.x,p.y-a.y)};}).filter(function(v){return Math.abs((b.x-a.x)*(v.p.y-a.y)-(b.y-a.y)*(v.p.x-a.x))<.0001&&v.p.x>=Math.min(a.x,b.x)-.001&&v.p.x<=Math.max(a.x,b.x)+.001&&v.p.y>=Math.min(a.y,b.y)-.001&&v.p.y<=Math.max(a.y,b.y)+.001;}).sort(function(a,b){return a.t-b.t;});for(var i=1;i<list.length;i++)edge(list[i-1].i,list[i].i);});
  var origin=defs.find(function(c){return c.key===home;}),dest=defs.find(function(c){return c.key==='restauracao';});if(!origin||!dest)return [];
  var annex=dest.depth>8,meeting=/^meeting:\d+$/.test(space),spaceKey=meeting?'patio':space;var target={biblioteca:[2.9,2.1],bosque:[6.6,2.1],meditacao:annex?[9.8,12.7]:[10.6,3.3],auditorio:[2.5,6.5],patio:annex?[3.5,15.2]:[9.5,6.6]}[spaceKey]||[9.5,6.6];var seat=meeting?Number(space.split(':')[1]):Number(String(workerId||'0').replace(/\D/g,''))%6;target=[target[0]+(seat%3)*(meeting?.6:spaceKey==='patio'?.55:.18),target[1]+Math.floor(seat/3)*(meeting?.5:spaceKey==='patio'?.55:.12)];
  function attach(x,y,c){var near=null;segments.filter(function(s){return s.roomKey===c.key;}).forEach(function(s){var a=s[0],b=s[1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy))),px=a.x+t*dx,py=a.y+t*dy,d=Math.hypot(x-px,y-py);if(!near||d<near.d)near={s:s,x:px,y:py,d:d};});var n=node(near.x,near.y);edge(n,node(near.s[0].x,near.s[0].y));edge(n,node(near.s[1].x,near.s[1].y));var end=node(x,y);edge(n,end);return end;}
  var start=startPoint?attach(origin.bx+startPoint.x,origin.by+startPoint.y,origin):node(origin.bx+aisle[0].x,origin.by+aisle[0].y),end=attach(dest.bx+target[0],dest.by+target[1],dest),dist=nodes.map(function(){return Infinity;}),prev=[],done=new Set();dist[start]=0;
  while(done.size<nodes.length){var u=-1;dist.forEach(function(d,i){if(!done.has(i)&&(u<0||d<dist[u]))u=i;});if(u<0||!isFinite(dist[u])||u===end)break;done.add(u);edges.forEach(function(e){var v=e[0]===u?e[1]:e[1]===u?e[0]:-1;if(v<0)return;var d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].y-nodes[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u;}});}
  if(!isFinite(dist[end]))return [];var path=[];for(var u=end;u!=null;u=prev[u])path.unshift(nodes[u]);return path;
 }
 function sample(path,t){if(!path.length)return null;var lengths=path.slice(1).map(function(p,i){return Math.hypot(p.x-path[i].x,p.y-path[i].y);}),total=lengths.reduce(function(a,b){return a+b;},0),d=Math.max(0,Math.min(1,t))*total;for(var i=0;i<lengths.length;i++){if(d<=lengths[i]){var k=lengths[i]?d/lengths[i]:0;return {x:path[i].x+(path[i+1].x-path[i].x)*k,y:path[i].y+(path[i+1].y-path[i].y)*k,tx:path[i+1].x,ty:path[i+1].y};}d-=lengths[i];}return path[path.length-1];}
 function routeAround(aisle,start,target,items){
  var bounds=items.filter(function(it){return !it.layoutHidden&&!it.visualProgram&&!it.walkable;}).map(function(it){return {x:it.x-.22,y:it.y-.22,w:it.w+.44,d:it.d+.44};});
  function inside(p,b){return p.x>b.x&&p.x<b.x+b.w&&p.y>b.y&&p.y<b.y+b.d;}
  function clear(a,b){return !bounds.some(function(r){var lo=0,hi=1;for(var i=0;i<2;i++){var k=i?'y':'x',span=i?r.d:r.w,delta=b[k]-a[k];if(Math.abs(delta)<1e-9){if(a[k]<=r[k]||a[k]>=r[k]+span)return false;}else{var p=(r[k]-a[k])/delta,q=(r[k]+span-a[k])/delta;lo=Math.max(lo,Math.min(p,q));hi=Math.min(hi,Math.max(p,q));if(lo>=hi)return false;}}return hi>1e-7&&lo<1-1e-7;});}
  var nodes=[start,target].concat(aisle),dist=[],prev=[],done=new Set();
  bounds.forEach(function(b){nodes.push({x:b.x-.025,y:b.y-.025},{x:b.x+b.w+.025,y:b.y-.025},{x:b.x-.025,y:b.y+b.d+.025},{x:b.x+b.w+.025,y:b.y+b.d+.025});});
  var logistics=items.some(function(it){return it.warehouse;}),extended=items.some(function(it){return it.managerRoom;});nodes=nodes.filter(function(p,i){var room=p.x>.05&&p.x<11.95&&p.y>.05&&p.y<7.95,office=extended&&p.x>.15&&p.x<7.85&&p.y>-5.85&&p.y<=.3;var cargo=logistics&&p.x>11.7&&p.x<24.85&&p.y>.15&&p.y<11.85;return i<2||(room||office||cargo)&&!bounds.some(function(b){return inside(p,b);});});
  dist=nodes.map(function(){return Infinity;});dist[0]=0;
  while(done.size<nodes.length){var u=-1;dist.forEach(function(d,i){if(!done.has(i)&&(u<0||d<dist[u]))u=i;});if(u<0||!isFinite(dist[u])||u===1)break;done.add(u);nodes.forEach(function(p,v){if(done.has(v)||v===u||!clear(nodes[u],p))return;var d=dist[u]+Math.hypot(nodes[u].x-p.x,nodes[u].y-p.y);if(d<dist[v]){dist[v]=d;prev[v]=u;}});}
  if(!isFinite(dist[1]))return [];var path=[];for(var n=1;n!=null;n=prev[n])path.unshift(nodes[n]);return path;
 }
 function routeWithin(aisle,start,target,items){
  if(items)return routeAround(aisle,start,target,items);
  var nodes=[],edges=[],lookup={};
  function node(p){var key=p.x.toFixed(4)+','+p.y.toFixed(4);if(lookup[key]!=null)return lookup[key];lookup[key]=nodes.length;nodes.push({x:p.x,y:p.y});return nodes.length-1;}
  function edge(a,b){if(a!==b)edges.push([a,b]);}
  var points=aisle.map(function(p){return {x:p.x,y:p.y};});
  points.forEach(node);for(var i=0;i<points.length;i++)edge(i,(i+1)%points.length);
  function attach(point){var best=null;for(var i=0;i<points.length;i++){var a=points[i],b=points[(i+1)%points.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy))),p={x:a.x+t*dx,y:a.y+t*dy},d=Math.hypot(point.x-p.x,point.y-p.y);if(!best||d<best.d)best={i:i,p:p,d:d};}var n=node(best.p);edge(n,best.i);edge(n,(best.i+1)%points.length);var dest=node(point);edge(n,dest);return dest;}
  var from=attach(start),to=attach(target),dist=nodes.map(function(){return Infinity;}),prev=[],done=new Set();dist[from]=0;
  while(done.size<nodes.length){var u=-1;dist.forEach(function(d,i){if(!done.has(i)&&(u<0||d<dist[u]))u=i;});if(u<0||!isFinite(dist[u])||u===to)break;done.add(u);edges.forEach(function(e){var v=e[0]===u?e[1]:e[1]===u?e[0]:-1;if(v<0)return;var d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].y-nodes[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u;}});}
  if(!isFinite(dist[to]))return [];var path=[];for(var u=to;u!=null;u=prev[u])path.unshift(nodes[u]);return path;
 }
 g.PilhaNpcRoutes={route:route,routeWithin:routeWithin,sample:sample};
})(typeof window==='undefined'?globalThis:window);
