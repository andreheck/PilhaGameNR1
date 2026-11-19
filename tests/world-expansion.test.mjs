import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {WORLD_PLOT} from '../data/continuous/world-expansion.js';
import {OFFICE_SPACE} from '../data/continuous/office-space.js';
import {SECTORS} from '../data/continuous/catalog.js';
import {FURNITURE_VISUALS} from '../data/continuous/furniture-visuals.js';
import {createFurniturePresentation} from '../ui/furniture-presentation.js';
import {workTargets} from '../ui/npc-work-targets.js';

const active=[
 {id:'office',x:0,y:0,w:12,h:8},
 {id:'manager-office',x:0,y:-6,w:8,h:6},
 {id:'meeting-room',x:8,y:-6,w:8,h:6},
 {id:'human-resources',x:16,y:-6,w:8,h:6},
 {id:'production-and-warehouse',x:16,y:0,w:25,h:12},
 {id:'service',x:0,y:12,w:12,h:8},
 {id:'restoration-and-patio',x:16,y:12,w:12,h:26},
 {id:'entrance-lobby',x:31,y:28,w:6,h:7}
];
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

test('all existing spaces fit inside an expanded square world with six clear expansion blocks',()=>{
 assert.equal(WORLD_PLOT.size,64);assert.equal(WORLD_PLOT.reservedLots.length,6);
 for(const room of active){assert.ok(room.x>=WORLD_PLOT.x&&room.y>=WORLD_PLOT.y,room.id+' starts outside world');assert.ok(room.x+room.w<=WORLD_PLOT.x+WORLD_PLOT.size&&room.y+room.h<=WORLD_PLOT.y+WORLD_PLOT.size,room.id+' exceeds square world');}
 for(const [i,lot] of WORLD_PLOT.reservedLots.entries()){
  assert.equal(lot.size,9);assert.ok(lot.x>=WORLD_PLOT.x&&lot.y>=WORLD_PLOT.y&&lot.x+lot.size<=WORLD_PLOT.x+WORLD_PLOT.size&&lot.y+lot.size<=WORLD_PLOT.y+WORLD_PLOT.size,lot.id+' exceeds world');
  for(const room of active)assert.equal(overlaps(lot,{x:room.x,y:room.y,w:room.w,h:room.h}),false,lot.id+' overlaps '+room.id);
  for(const other of WORLD_PLOT.reservedLots.slice(i+1))assert.equal(overlaps(lot,{x:other.x,y:other.y,w:other.size,h:other.size}),false,lot.id+' overlaps '+other.id);
 }
});

test('HR annex shares an open doorway with the meeting room and the entrance has a clear door, walls and counter',()=>{
 assert.deepEqual({x:OFFICE_SPACE.hr.x,y:OFFICE_SPACE.hr.y,width:OFFICE_SPACE.hr.width,depth:OFFICE_SPACE.hr.depth,door:OFFICE_SPACE.hr.door},{x:16,y:-6,width:8,depth:6,door:{side:'west',offset:3,width:1.6}});
 const upper=OFFICE_SPACE.walls.find(w=>w.id==='meeting-right-upper'),lower=OFFICE_SPACE.walls.find(w=>w.id==='meeting-right-lower');
 assert.ok(upper&&lower);assert.ok(upper.y+upper.d<=-3.8);assert.ok(lower.y>=-2.2);
 const lobby=WORLD_PLOT.plannedSpaces.find(p=>p.id==='entrada'),door=lobby.door,south=lobby.walls.filter(w=>Math.abs(w.y-(lobby.y+lobby.depth-.12))<.001);
 assert.equal(door.side,'south');assert.equal(south.length,1);assert.equal(south[0].x, lobby.x+door.width);assert.ok(lobby.counter.width>1&&lobby.counter.height>1);assert.ok(lobby.walls.length>=4);
 const builder=fs.readFileSync(new URL('../tools/build-logistics-space.mjs',import.meta.url),'utf8'),officeBuild=fs.readFileSync(new URL('../tools/build-office-space.mjs',import.meta.url),'utf8'),office=fs.readFileSync(new URL('../data/continuous/office-space.js',import.meta.url),'utf8'),player=fs.readFileSync(new URL('../ui/player-exploration-runtime.js',import.meta.url),'utf8'),playerBuild=fs.readFileSync(new URL('../tools/build-player-exploration.mjs',import.meta.url),'utf8');
 assert.match(builder,/PILHA\+  ·  ENTRADA/);assert.match(builder,/place\.walls\.forEach/);assert.match(office,/RH · Pessoas/);assert.match(officeBuild,/JSON\.stringify\(OFFICE_SPACE\)/);assert.match(player,/place\.walls/);assert.match(playerBuild,/lx<24/);assert.match(playerBuild,/a<23\.8/);
});

test('lobby reception has two distinct equipment positions and capacity for one or two staff',()=>{
 const lobby=WORLD_PLOT.plannedSpaces.find(p=>p.id==='entrada');
 assert.deepEqual(lobby.staffCapacity,{min:1,max:2});assert.equal(lobby.workstations.length,2);
 assert.equal(new Set(lobby.workstations.map(p=>p.id)).size,2);
 for(const post of lobby.workstations){assert.ok(post.x>=lobby.x&&post.x<=lobby.x+lobby.width);assert.ok(post.y>=lobby.y&&post.y<=lobby.y+lobby.depth);assert.ok(post.x<lobby.counter.x+lobby.counter.width&&post.x>lobby.counter.x);}
 assert.ok(lobby.counter.width>=3.4&&lobby.counter.x+lobby.counter.width<=lobby.x+lobby.width);
 const renderer=fs.readFileSync(new URL('../tools/build-logistics-space.mjs',import.meta.url),'utf8');assert.match(renderer,/place\.workstations/);assert.match(renderer,/accent=i\?'#53cad7':'#ffd24b'/);
});

test('renderer frames and labels reserved parcels while logistics workers use warehouse cargo posts',()=>{
 const renderer=fs.readFileSync(new URL('../tools/build-logistics-space.mjs',import.meta.url),'utf8'),workers=fs.readFileSync(new URL('../tools/build-living.mjs',import.meta.url),'utf8');
 assert.match(renderer,/drawWorldPlot\(\)/);assert.match(renderer,/worldPlot\.reservedLots/);assert.match(renderer,/worldPlot\.size/);assert.match(workers,/logisticsSources=anchors\.sources\.filter/);assert.match(workers,/logisticsDestinations=anchors\.destinations\.filter/);
});

test('player route can reach HR through the meeting doorway',()=>{
 const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop}),window={devicePixelRatio:1,requestAnimationFrame:()=>1,cancelAnimationFrame:noop};
 vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),{window,Math,Set});
 vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window,Math,Set,performance:{now:()=>0}});
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:800})});iso.resize();
 iso.setWorld(SECTORS.map((s,i)=>({key:s.id,name:s.name,bx:i===1?14:i===3?14:0,by:i===2?10:i===3?10:0})));
 iso.setFurniturePresentation(createFurniturePresentation());iso.setFurnitureCatalog(FURNITURE_VISUALS);iso.setPlayerCharacter({id:'test-explorer',name:'Exploradora',color:'#ffd24b'});
 const point=iso.worldToScreen(20,-3);assert.equal(iso.movePlayerToScreen(point.x,point.y),true);assert.equal(iso.getPlayerCharacter().moving,true);
 const entry=iso.worldToScreen(34,33.4);assert.equal(iso.movePlayerToScreen(entry.x,entry.y),true,'outdoor route passes through the entry door');
});

test('Raimunda has a dedicated HR workstation with a clear route from the office aisle',()=>{
 const assets=new Map(FURNITURE_VISUALS.assets.map(a=>[a.id,a]));
 const items=OFFICE_SPACE.furniture.map(p=>{const a=p.asset&&assets.get(p.asset);return {t:p.type,x:p.x,y:p.y,w:a?.scale.width||p.w||.7,d:a?.scale.depth||p.d||.7,managerRoom:!['hr','meeting'].includes(p.room),meetingRoom:p.room==='meeting',hrRoom:p.room==='hr',managerDesk:!!p.managerDesk,hrEmployeeId:p.employeeId||null};}).concat(OFFICE_SPACE.walls.map(w=>({...w,t:'glass-wall',structural:true})));
 const axisX=[.35,4,8,11.75],axisY=[.28,4,7.7],aisle=[[0,0],[1,0],[1,1],[2,1],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[0,2],[0,1]].map(([x,y])=>({x:axisX[x],y:axisY[y]}));
 const anchors=workTargets(items,aisle),desk=anchors.hrStations.find(s=>s.hrOnly==='NPC-04');
 assert.ok(desk,'Raimunda receives the named HR desk');assert.equal(desk.item.type,'desk');
 const sandbox={globalThis:{},Math,Set};vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),sandbox);
 const path=sandbox.globalThis.PilhaNpcRoutes.routeWithin(aisle,{x:8,y:4},desk,items);
 assert.ok(path.length>1,'route connects the office aisle to the HR workstation');
 assert.ok(path.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 assert.ok(path.some(p=>p.x>10.8&&p.x<12.2&&p.y<0),'route uses the meeting-room doorway');
 assert.ok(path.some(p=>p.x>16&&p.x<24&&p.y<0),'route enters the HR annex');
 const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop}),window={devicePixelRatio:1,requestAnimationFrame:()=>1,cancelAnimationFrame:noop};
 vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window,Math,Set,performance:{now:()=>0}});
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:800})});iso.resize();iso.setWorld(SECTORS.map((s,i)=>({key:s.id,name:s.name,bx:i%2?14:0,by:i>1?10:0})));iso.setFurniturePresentation(createFurniturePresentation());iso.setFurnitureCatalog(FURNITURE_VISUALS);iso.setSectorInventory({escritorio:{},producao:{},atendimento:{}});
 iso.setEmployees([{id:'NPC-04',name:'Raimunda',home:'escritorio',health:74,organization:{rank:'operacional'}}]);
 const raimunda=iso.getEmployees().find(p=>p.id==='NPC-04');assert.ok(raimunda);assert.ok(raimunda.workstation.x>16,'live employee assignment uses the HR post');
});
