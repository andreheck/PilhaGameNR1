/** Pure navigation over existing aisles and company bridges. No scene mutation. */
(function(g){
 function route(defs,aisle,links,home,space,workerId){
  var nodes=[],edges=[],map={};
  function node(x,y){var key=x.toFixed(4)+','+y.toFixed(4);if(map[key]!=null)return map[key];map[key]=nodes.length;nodes.push({x:x,y:y});return nodes.length-1;}
  function edge(a,b){if(a!==b)edges.push([a,b]);}
  var segments=[];defs.forEach(function(c){aisle.forEach(function(p,i){var q=aisle[(i+1)%aisle.length];segments.push([{x:c.bx+p.x,y:c.by+p.y},{x:c.bx+q.x,y:c.by+q.y}]);});});
  links.forEach(function(l){for(var i=1;i<l.points.length;i++)segments.push([l.points[i-1],l.points[i]]);});
  segments.forEach(function(s){node(s[0].x,s[0].y);node(s[1].x,s[1].y);});
  // Split all collinear aisle/bridge intersections, so doorway endpoints join the graph.
  segments.forEach(function(s){var a=s[0],b=s[1],list=nodes.map(function(p,i){return {p:p,i:i,t:Math.hypot(p.x-a.x,p.y-a.y)};}).filter(function(v){return Math.abs((b.x-a.x)*(v.p.y-a.y)-(b.y-a.y)*(v.p.x-a.x))<.0001&&v.p.x>=Math.min(a.x,b.x)-.001&&v.p.x<=Math.max(a.x,b.x)+.001&&v.p.y>=Math.min(a.y,b.y)-.001&&v.p.y<=Math.max(a.y,b.y)+.001;}).sort(function(a,b){return a.t-b.t;});for(var i=1;i<list.length;i++)edge(list[i-1].i,list[i].i);});
  var origin=defs.find(function(c){return c.key===home;}),dest=defs.find(function(c){return c.key==='restauracao';});if(!origin||!dest)return [];
  var target={biblioteca:[2.9,2.1],bosque:[6.6,2.1],meditacao:[10.6,3.3],auditorio:[2.5,6.5],patio:[9.5,6.6]}[space]||[9.5,6.6];var seat=Number(String(workerId||'0').replace(/\D/g,''))%6;target=[target[0]+(seat%3)*.18,target[1]+Math.floor(seat/3)*.12];
  function attach(x,y,c){var near=null;segments.slice(0,defs.length*aisle.length).forEach(function(s){if(s[0].x<c.bx||s[0].x>c.bx+12||s[0].y<c.by||s[0].y>c.by+8)return;var a=s[0],b=s[1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy))),px=a.x+t*dx,py=a.y+t*dy,d=Math.hypot(x-px,y-py);if(!near||d<near.d)near={s:s,x:px,y:py,d:d};});var n=node(near.x,near.y);edge(n,node(near.s[0].x,near.s[0].y));edge(n,node(near.s[1].x,near.s[1].y));var end=node(x,y);edge(n,end);return end;}
  var start=node(origin.bx+aisle[0].x,origin.by+aisle[0].y),end=attach(dest.bx+target[0],dest.by+target[1],dest),dist=nodes.map(function(){return Infinity;}),prev=[],done=new Set();dist[start]=0;
  while(done.size<nodes.length){var u=-1;dist.forEach(function(d,i){if(!done.has(i)&&(u<0||d<dist[u]))u=i;});if(u<0||!isFinite(dist[u])||u===end)break;done.add(u);edges.forEach(function(e){var v=e[0]===u?e[1]:e[1]===u?e[0]:-1;if(v<0)return;var d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].y-nodes[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u;}});}
  if(!isFinite(dist[end]))return [];var path=[];for(var u=end;u!=null;u=prev[u])path.unshift(nodes[u]);return path;
 }
 function sample(path,t){if(!path.length)return null;var lengths=path.slice(1).map(function(p,i){return Math.hypot(p.x-path[i].x,p.y-path[i].y);}),total=lengths.reduce(function(a,b){return a+b;},0),d=Math.max(0,Math.min(1,t))*total;for(var i=0;i<lengths.length;i++){if(d<=lengths[i]){var k=lengths[i]?d/lengths[i]:0;return {x:path[i].x+(path[i+1].x-path[i].x)*k,y:path[i].y+(path[i+1].y-path[i].y)*k,tx:path[i+1].x,ty:path[i+1].y};}d-=lengths[i];}return path[path.length-1];}
 g.PilhaNpcRoutes={route:route,sample:sample};
})(typeof window==='undefined'?globalThis:window);
