import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {pointBlocked,segmentBlocked,moveSafely} from '../simulation/navigation.js';
const rects=[[0.5,-0.5,1.0,0.5]];
const bounds={minX:-3,maxX:3,minZ:-3,maxZ:3};
test('detecta obstáculo no segmento mesmo quando início e destino estão livres',()=>{
 assert.equal(pointBlocked(0,0,rects),false);
 assert.equal(pointBlocked(1.5,0,rects),false);
 assert.equal(segmentBlocked({x:0,z:0},{x:1.5,z:0},rects),true);
});
test('movimento longo não atravessa parede estreita (tunneling)',()=>{
 const result=moveSafely({x:0,z:0},{x:2,z:0},rects,bounds,0.1);
 assert.equal(result.blocked,true);
 assert.ok(result.x<0.5-0.1 || result.z < -0.5-0.1 || result.z > 0.5+0.1);
 assert.equal(segmentBlocked({x:0,z:0},{x:result.x,z:result.z},rects,0.1),false);
});
test('permite deslizar pelo eixo livre quando o trajeto diagonal bloqueia',()=>{
 const result=moveSafely({x:0,z:0},{x:1.5,z:1.2},rects,bounds,0.1);
 assert.equal(result.blocked,true);
 assert.equal(segmentBlocked({x:0,z:0},{x:result.x,z:result.z},rects,0.1),false);
});
test('respeita limites do escritório e impede passagem em corredor obstruído',()=>{
 const wall=[[-3,-3,3,-2.7]];
 const result=moveSafely({x:0,z:0},{x:8,z:-2.9},wall,bounds,0.1);
 assert.equal(result.blocked,true);
 assert.ok(result.x<=2.9);
 assert.ok(result.z>=-2.6);
});
const world=fs.readFileSync(new URL('../world3d.js',import.meta.url),'utf8');
assert.match(world,/import \{moveSafely\} from '.\/simulation\/navigation\.js'/);
assert.match(world,/moveSafely\(current,\{x,z\},collisionRects/);
console.log('Navigation swept collision tests: PASS');
