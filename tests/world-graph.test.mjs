import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {WORLD,REST_ANCHORS,buildWorldGraph,shortestPath} from '../simulation/world-graph.js';
import {EMPLOYEES} from '../data/continuous/employees.js';
import {SECTORS} from '../data/continuous/catalog.js';
import * as M from '../simulation/company-continuous.js';
import * as L from '../simulation/company-living.js';

function engine(width=1440,height=900,reduced=false){
 let frame;const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
 const window={devicePixelRatio:1,matchMedia:()=>({matches:reduced}),requestAnimationFrame:fn=>(frame=fn,1),cancelAnimationFrame:noop};
 vm.runInNewContext(fs.readFileSync(new URL('../ui/claude/pilha-iso.js',import.meta.url),'utf8'),{window,Math,Set});
 const size={width,height},canvas={getContext:()=>ctx,getBoundingClientRect:()=>size};
 const iso=window.PilhaIso.create(canvas,null,null,WORLD);iso.resize();iso.setWorld(WORLD.zones.map(z=>({key:z.id,name:z.name,bx:z.x,by:z.y})));
 return {iso,size,aisle:window.PilhaIso.navigation.aisle,tick:t=>frame?.(t)};
}
const defs=WORLD.zones.map(z=>({key:z.id,bx:z.x,by:z.y}));

test('one fixed floor preserves four IDs and non-overlapping 12x8 zones',()=>{
 assert.deepEqual(WORLD.zones.map(z=>z.id),SECTORS.map(s=>s.id));assert.equal(WORLD.width,26);assert.equal(WORLD.depth,18);
 assert.equal(WORLD.portals.length,8);assert.equal(WORLD.links.length,4);
 for(const z of WORLD.zones){assert.equal(z.width,12);assert.equal(z.depth,8);assert.ok(z.x+12<=26&&z.y+8<=18);for(const b of WORLD.zones.filter(b=>b!==z))assert.ok(z.x+12<=b.x||b.x+12<=z.x||z.y+8<=b.y||b.y+8<=z.y);}
 assert.ok(WORLD.portals.every(p=>p.width===2));
});
test('corridors, portals, work anchors and all rest seats form one connected graph',()=>{
 const {aisle}=engine(),graph=buildWorldGraph(aisle),origin=graph.anchors.escritorio;
 assert.equal(new Set(graph.nodes.map(n=>n.id)).size,graph.nodes.length);
 assert.ok(graph.nodes.some(n=>n.types.includes('junction')));assert.ok(graph.nodes.some(n=>n.types.includes('work')));
 for(const target of Object.values(graph.anchors))assert.ok(shortestPath(graph,origin,target).length);
 assert.ok(graph.edges.every(e=>e.length>0));assert.deepEqual(shortestPath(graph,'missing',origin),[]);
});
test('all sixteen canonical routes remain deterministic and cross zone boundaries only through open doors',()=>{
 const {aisle}=engine();
 for(const person of EMPLOYEES)for(const space of Object.keys(REST_ANCHORS)){
  const path=WORLD.route(defs,aisle,WORLD.links,person.home,space,person.id);
  assert.ok(path.length>2,person.id+' '+space);assert.deepEqual(path,WORLD.route(defs,aisle,WORLD.links,person.home,space,person.id));
  for(let i=1;i<path.length;i++){
   const a=path[i-1],b=path[i];assert.ok(Math.abs(a.x-b.x)<1e-6||Math.abs(a.y-b.y)<1e-6,'orthogonal segments');
   for(let t=0;t<=1;t+=.05){const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;assert.ok(x>=0&&x<=26&&y>=0&&y<=18);}
   for(const z of WORLD.zones){
    for(const [axis,boundary,side] of [['x',z.x,'west'],['x',z.x+12,'east'],['y',z.y,'north'],['y',z.y+8,'south']]){
     if(Math.abs(a[axis]-b[axis])<1e-6)continue;
     const t=(boundary-a[axis])/(b[axis]-a[axis]);if(t<0||t>1)continue;
     const other=axis==='x'?'y':'x',v=a[other]+(b[other]-a[other])*t,low=other==='x'?z.x:z.y,high=low+(other==='x'?12:8);
     if(v<=low+1e-6||v>=high-1e-6)continue;
     assert.ok(WORLD.portals.some(p=>p.zone===z.id&&p.side===side&&Math.abs(p[other]-v)<=1+1e-6),`${person.id}: wall of ${z.id}/${side}`);
    }
   }
  }
 }
});
test('resizing changes the camera only; focus completes within 400ms or immediately with reduced motion',()=>{
 const {iso,size,tick}=engine();const links=JSON.stringify(iso.getCirculation().connections);iso.start();tick(50);iso.focus(1,-1,.9);
 for(let i=2;i<=12;i++)tick(i*50);const zoom=iso.getZoom();tick(1000);assert.equal(iso.getZoom(),zoom);
 size.width=390;size.height=844;iso.resize();assert.equal(JSON.stringify(iso.getCirculation().connections),links);
 iso.home(0);const frame=iso.getWorldFrame();assert.ok(frame.left>=0&&frame.top>=0&&frame.right<=390&&frame.bottom<=844);
 const reduced=engine(390,844,true);reduced.iso.start();const before=reduced.iso.getZoom();reduced.iso.focus(1,-1,.9);assert.notEqual(reduced.iso.getZoom(),before);
});
test('a fin save keeps levels, budget, workforce, event and raw bytes on the new floor',()=>{
 const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/fin-28c1de8-save.json',import.meta.url),'utf8')),raw=JSON.stringify(fixture.state);
 const store={getItem:k=>k===M.KEY?raw:null},loaded=M.read(store);assert.equal(loaded.ok,true);L.ensureLiving(loaded.state);
 for(const k of ['budget','receipts','team','staff','finance','events'])assert.deepEqual(loaded.state[k],fixture.state[k]);
 const before=JSON.stringify(loaded.state);engine();assert.equal(JSON.stringify(loaded.state),before);assert.equal(store.getItem(M.KEY),raw);
});
