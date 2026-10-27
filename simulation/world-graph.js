/** Presentation geometry only. Coordinates are cells, not a new clock or economy.
 * One fixed 26 x 18 floor on every viewport; existing sector IDs remain intact.
 */
const zones=[
 {id:'escritorio',name:'Escritório',x:0,y:0},
 {id:'producao',name:'Produção',x:14,y:0},
 {id:'atendimento',name:'Atendimento',x:0,y:10},
 {id:'restauracao',name:'Restauração',x:14,y:10}
].map(z=>Object.freeze({...z,width:12,depth:8}));
const point=(x,y)=>({x,y});
const links=[
 {from:'escritorio',to:'producao',points:[point(11.75,4),point(13,4),point(14.35,4)],door:{key:'producao',axis:'x',at:4,width:2}},
 {from:'escritorio',to:'atendimento',points:[point(8,7.7),point(8,9),point(8,10.28)],door:{key:'atendimento',axis:'y',at:8,width:2}},
 {from:'producao',to:'restauracao',points:[point(22,7.7),point(22,9),point(22,10.28)],door:{key:'restauracao',axis:'y',at:8,width:2}},
 {from:'atendimento',to:'restauracao',points:[point(11.75,14),point(13,14),point(14.35,14)],door:{key:'restauracao',axis:'x',at:4,width:2}}
];
const portals=[
 ['escritorio','east',12,4],['producao','west',14,4],
 ['escritorio','south',8,8],['atendimento','north',8,10],
 ['producao','south',22,8],['restauracao','north',22,10],
 ['atendimento','east',12,14],['restauracao','west',14,14]
].map(([zone,side,x,y])=>Object.freeze({zone,side,x,y,width:2}));
const corridorPaths=[[point(13,4),point(13,9),point(13,14)],[point(8,9),point(13,9),point(22,9)]];
export const REST_ANCHORS=Object.freeze({biblioteca:[2.9,2.1],bosque:[6.6,2.1],meditacao:[10.6,3.3],auditorio:[2.5,6.5],patio:[9.5,6.6]});
const key=p=>p.x.toFixed(4)+','+p.y.toFixed(4);
const onSegment=(p,a,b)=>Math.abs((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x))<1e-6&&p.x>=Math.min(a.x,b.x)-1e-6&&p.x<=Math.max(a.x,b.x)+1e-6&&p.y>=Math.min(a.y,b.y)-1e-6&&p.y<=Math.max(a.y,b.y)+1e-6;
const projection=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return point(a.x+t*dx,a.y+t*dy);};

export function buildWorldGraph(aisle){
 const nodes=new Map(),segments=[],anchors={};
 function node(p,type='aisle'){const id=key(p);if(!nodes.has(id))nodes.set(id,{id,x:p.x,y:p.y,types:[]});const n=nodes.get(id);if(!n.types.includes(type))n.types.push(type);return id;}
 function path(points,type,zone=null){points.forEach(p=>node(p,type));for(let i=1;i<points.length;i++)segments.push({a:points[i-1],b:points[i],type,zone});}
 for(const z of zones){const ring=aisle.map(p=>point(z.x+p.x,z.y+p.y));path([...ring,ring[0]],'aisle',z.id);anchors[z.id]=node(ring[0]);}
 links.forEach(l=>path(l.points,'door'));corridorPaths.forEach(p=>path(p,'corridor'));
 portals.forEach(p=>node(p,'door'));
 // Stable work anchors on existing clear aisles; role assignment is a later item.
 zones.filter(z=>z.id!=='restauracao').forEach(z=>{for(const [name,x,y] of [['posto-a',4,.28],['posto-b',8,4],['posto-c',4,7.7]])anchors[z.id+':'+name]=node(point(z.x+x,z.y+y),'work');});
 function attach(p,zone,type,id){
  let best=null;
  for(const s of segments.filter(s=>s.zone===zone)){const q=projection(p,s.a,s.b),d=Math.hypot(q.x-p.x,q.y-p.y);if(!best||d<best.distance)best={q,distance:d};}
  if(!best)throw Error('No aisle for '+zone);
  node(best.q);node(p,type);if(key(p)!==key(best.q))segments.push({a:best.q,b:p,type,zone:null});
  anchors[id]=key(p);
 }
 const rest=zones.find(z=>z.id==='restauracao');
 for(const [name,xy] of Object.entries(REST_ANCHORS))for(let seat=0;seat<6;seat++)attach(point(rest.x+xy[0]+seat%3*.18,rest.y+xy[1]+Math.floor(seat/3)*.12),rest.id,'rest',name+':'+seat);
 // Split perpendicular intersections as well as collinear joins.
 for(let i=0;i<segments.length;i++)for(let j=i+1;j<segments.length;j++){
  const a=segments[i],b=segments[j],av=Math.abs(a.a.x-a.b.x)<1e-6,bv=Math.abs(b.a.x-b.b.x)<1e-6;
  if(av!==bv){const v=av?a:b,h=av?b:a,p=point(v.a.x,h.a.y);if(onSegment(p,v.a,v.b)&&onSegment(p,h.a,h.b))node(p,'junction');}
 }
 const edges=[],seen=new Set();
 for(const s of segments){const list=[...nodes.values()].filter(n=>onSegment(n,s.a,s.b)).sort((a,b)=>Math.hypot(a.x-s.a.x,a.y-s.a.y)-Math.hypot(b.x-s.a.x,b.y-s.a.y));
  for(let i=1;i<list.length;i++){const a=list[i-1],b=list[i],id=[a.id,b.id].sort().join('|');if(seen.has(id))continue;seen.add(id);edges.push({from:a.id,to:b.id,length:Math.hypot(a.x-b.x,a.y-b.y)});}
 }
 return {nodes:[...nodes.values()],edges,anchors};
}
export function shortestPath(graph,start,end){
 const nodes=new Map(graph.nodes.map(n=>[n.id,n])),adj=new Map(graph.nodes.map(n=>[n.id,[]]));
 if(!nodes.has(start)||!nodes.has(end))return [];
 for(const e of graph.edges){adj.get(e.from).push([e.to,e.length]);adj.get(e.to).push([e.from,e.length]);}
 const dist=new Map([[start,0]]),previous=new Map(),todo=new Set(nodes.keys());
 while(todo.size){let u=null;for(const id of todo)if(u===null||(dist.get(id)??Infinity)<(dist.get(u)??Infinity))u=id;
  if(!Number.isFinite(dist.get(u)))break;if(u===end){const path=[];for(let v=end;v;v=previous.get(v)){const p=nodes.get(v);path.unshift(point(p.x,p.y));}return path;}
  todo.delete(u);for(const [v,length] of adj.get(u)){const d=dist.get(u)+length;if(d<(dist.get(v)??Infinity)){dist.set(v,d);previous.set(v,u);}}
 }
 return [];
}
function route(defs,aisle,_links,home,space,workerId){
 if(defs.length!==zones.length||defs.some(d=>!zones.some(z=>z.id===d.key&&z.x===d.bx&&z.y===d.by)))return [];
 const g=buildWorldGraph(aisle),seat=Number(String(workerId||'0').replace(/\D/g,''))%6;
 return shortestPath(g,g.anchors[home],g.anchors[(REST_ANCHORS[space]?space:'patio')+':'+seat]);
}
export const WORLD=Object.freeze({id:'pilha-world-v1',width:26,depth:18,doorWidth:2,zones:Object.freeze(zones),
 hallways:Object.freeze([{x:12,y:0,width:2,depth:18},{x:0,y:8,width:26,depth:2}]),
 links,portals,corridorPaths,route});
