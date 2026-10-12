import test from "node:test";
import assert from "node:assert/strict";
import { WORLD, NPCS, OBSTACLES, project, unproject, inside, blocked, findPath, pathToNpc } from "../src/world.js";
test("projecao isometrica corresponde a grade logica", () => {
  for(let y=0;y<WORLD.rows;y++)for(let x=0;x<WORLD.columns;x++){ const p=project(x,y); assert.deepEqual(unproject(p.x,p.y),{x,y}); }
});
test("obstaculos nao aceitam destino de caminhada", () => {
  for(const o of OBSTACLES) assert.equal(findPath(WORLD.spawn,{x:o.x,y:o.y}),null);
});
test("caminhos so usam celulas livres adjacentes", () => {
  const goals=[{x:0,y:0},{x:12,y:9},{x:4,y:5},{x:7,y:7}];
  for(const goal of goals){const path=findPath(WORLD.spawn,goal);if(!path)continue;let prev=WORLD.spawn;
  for(const step of path){assert.equal(blocked(step.x,step.y),false);assert.equal(Math.abs(step.x-prev.x)+Math.abs(step.y-prev.y),1);prev=step;}
  assert.deepEqual(prev,goal);}
});
test("NPCs tem espaco adjacente alcançavel e sem duplicidade",()=>{
  assert.equal(new Set(NPCS.map(n=>n.id)).size,NPCS.length);
  for(const n of NPCS){assert.equal(inside(n.x,n.y),true);assert.equal(OBSTACLES.some(o=>o.x===n.x&&o.y===n.y),false);const path=pathToNpc(WORLD.spawn,n);assert.ok(path!==null,"NPC inacessivel: "+n.id);}
});
