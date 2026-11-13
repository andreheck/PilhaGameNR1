import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {WORLD_PLOT} from '../data/continuous/world-expansion.js';

const active=[
 {id:'office',x:0,y:0,w:12,h:8},
 {id:'manager-office',x:0,y:-6,w:8,h:6},
 {id:'production-and-warehouse',x:14,y:0,w:25,h:12},
 {id:'service',x:0,y:10,w:12,h:8},
 {id:'restoration-and-patio',x:14,y:10,w:12,h:18}
];
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

test('all existing spaces fit inside a square world with six clear expansion blocks',()=>{
 assert.equal(WORLD_PLOT.size,48);assert.equal(WORLD_PLOT.reservedLots.length,6);
 for(const room of active){assert.ok(room.x>=WORLD_PLOT.x&&room.y>=WORLD_PLOT.y,room.id+' starts outside world');assert.ok(room.x+room.w<=WORLD_PLOT.x+WORLD_PLOT.size&&room.y+room.h<=WORLD_PLOT.y+WORLD_PLOT.size,room.id+' exceeds square world');}
 for(const [i,lot] of WORLD_PLOT.reservedLots.entries()){
  assert.equal(lot.size,9);assert.ok(lot.x>=WORLD_PLOT.x&&lot.y>=WORLD_PLOT.y&&lot.x+lot.size<=WORLD_PLOT.x+WORLD_PLOT.size&&lot.y+lot.size<=WORLD_PLOT.y+WORLD_PLOT.size,lot.id+' exceeds world');
  for(const room of active)assert.equal(overlaps(lot,{x:room.x,y:room.y,w:room.w,h:room.h}),false,lot.id+' overlaps '+room.id);
  for(const other of WORLD_PLOT.reservedLots.slice(i+1))assert.equal(overlaps(lot,{x:other.x,y:other.y,w:other.size,h:other.size}),false,lot.id+' overlaps '+other.id);
 }
});

test('renderer frames and labels reserved parcels while logistics workers use warehouse cargo posts',()=>{
 const renderer=fs.readFileSync(new URL('../tools/build-logistics-space.mjs',import.meta.url),'utf8'),workers=fs.readFileSync(new URL('../tools/build-living.mjs',import.meta.url),'utf8');
 assert.match(renderer,/drawWorldPlot\(\)/);assert.match(renderer,/worldPlot\.reservedLots/);assert.match(renderer,/worldPlot\.size/);assert.match(workers,/logisticsSources=anchors\.sources\.filter/);assert.match(workers,/logisticsDestinations=anchors\.destinations\.filter/);
});
