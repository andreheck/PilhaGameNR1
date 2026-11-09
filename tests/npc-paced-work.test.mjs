import test from 'node:test';import assert from 'node:assert/strict';
import {pacedWorkPlan} from '../ui/npc-paced-work.js';
const points={home:{x:0,y:0},station:{x:3,y:2},source:{x:1,y:2},destination:{x:5,y:3},gather:{x:2,y:0}};
const paths=Object.fromEntries(Object.entries(points).flatMap(([a,p])=>Object.entries(points).map(([b,q])=>[a+'|'+b,[p,{x:q.x,y:p.y},q]])));
function position(plan){if(!plan.moving)return points[plan.to];let d=plan.path.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-plan.path[i].x,p.y-plan.path[i].y),0)*plan.route;for(let i=1;i<plan.path.length;i++){const a=plan.path[i-1],b=plan.path[i],len=Math.hypot(b.x-a.x,b.y-a.y);if(d<=len&&len)return {x:a.x+(b.x-a.x)*d/len,y:a.y+(b.y-a.y)*d/len};d-=len;}return plan.path.at(-1);}
test('tiny gaps do not squeeze a complete work trip into a sprint',()=>{for(const ms of [0,1,100,500,1000])for(const p of [0,.25,.5,.99,1]){const plan=pacedWorkPlan(p,{durationMs:ms,speed:.7,sector:'producao',paths});assert.equal(plan.moving,false);assert.equal(plan.to,'home');}});
test('each work leg is bounded by walking pace across turns, holds and task boundaries',()=>{
 for(const speed of [.34,.6,.7,.83])for(const durationMs of [1200,6500,12000,45000])for(const sector of ['escritorio','producao']){
  const config={durationMs,speed,sector,hasWorkstation:sector==='escritorio',paths};let previous=points.home;
  for(let t=0;t<=durationMs;t+=20){const plan=pacedWorkPlan(t/durationMs,config),p=position(plan);assert.ok(Math.hypot(p.x-previous.x,p.y-previous.y)<=1.8*speed*.02+1e-8,'no boundary teleport or acceleration');previous=p;}
  const last=position(pacedWorkPlan(1,config));assert.ok(Math.hypot(last.x,last.y)<1e-8);
 }
});
test('long gaps retain computer, pickup, carrying and placing instead of freezing all workers',()=>{
 const kinds=sector=>new Set(Array.from({length:1001},(_,i)=>pacedWorkPlan(i/1000,{durationMs:45000,speed:.7,sector,hasWorkstation:sector==='escritorio',paths}).activity));
 assert.ok(kinds('escritorio').has('computer'));assert.ok(kinds('producao').has('handling'));assert.ok(kinds('producao').has('moving-material'));
});
