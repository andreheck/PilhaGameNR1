import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import vm from 'node:vm';
const root=new URL('../',import.meta.url),manifest=JSON.parse(fs.readFileSync(new URL('data/continuous/expanded-cast.json',root))),intro=JSON.parse(fs.readFileSync(new URL('data/continuous/intro-cast.json',root)));
test('all ten supplied models have verified animated atlases, without publishing master GLBs',()=>{
 assert.equal(manifest.actors.length,10);assert.equal(new Set(manifest.actors.map(a=>a.id)).size,10);
 for(const actor of manifest.actors){assert.match(actor.source,/All_animation\.glb$/);assert.match(actor.sourceSha256,/^[a-f0-9]{64}$/);assert.ok(actor.inventory.some(c=>c.name==="Walking"));assert.ok(actor.joints>=23);assert.ok(actor.actions.walk);for(const clip of Object.values(actor.actions)){
  assert.ok(actor.inventory.some(c=>c.name===clip.sourceClip));const bytes=fs.readFileSync(new URL(clip.url.slice(1),root));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256);assert.equal(bytes.readUInt32BE(16),clip.frames*128);assert.equal(bytes.readUInt32BE(20),768);assert.ok(clip.frames===1||clip.distinctFrames>1);assert.ok(clip.renderHeight>3&&clip.renderHeight<4);assert.ok(clip.anchorY>.6&&clip.anchorY<.9);
 }assert.ok(!fs.existsSync(new URL('dist/assets/expanded-cast/'+actor.source,root)));}
});
test('identities and natural activity clips remain explicit',()=>{
 assert.deepEqual(manifest.actors.filter(a=>a.binding).map(a=>[a.id,a.binding]),[['mariana','NPC-07'],['garoto','NPC-08']]);assert.equal(manifest.actors.find(a=>a.id==='mariana').actions.sit,undefined,'rejected retarget must not ship');
 const yoga=manifest.actors.find(a=>a.id==='yoga');for(const key of ['breathe','floor-sit','floor-idle','rise'])assert.ok(yoga.actions[key]);assert.equal(yoga.sector,'restauracao');assert.equal(manifest.actors.find(a=>a.id==='advogado').sector,'escritorio');
 assert.equal(intro.models.length,18);for(const a of manifest.actors){const i=intro.models.find(i=>i.id===a.id);assert.equal(i.file,a.actions.walk.url);assert.equal(i.frames,16);}
});
test('supporting visitor pauses and resumes from the same place at cycle boundaries',()=>{
 const actor=manifest.actors.find(a=>a.id==='advogado'),context={Math,expandedCast:[actor],time:0,AISLE_LENGTH:100,aislePoint:d=>({x:d,y:1})};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('ui/expanded-cast-runtime.js',root),'utf8'),context);
 const sample=t=>{context.time=t;return context.expandedPose('advogado',{items:[]});};
 assert.ok(Math.abs(sample(10).x-sample(0).x-5.6)<1e-9);assert.equal(sample(21).x,sample(31.99).x);
 const before=sample(31.999),after=sample(32.001);assert.ok(Math.hypot(after.x-before.x,after.y-before.y)<.002,'no teleport at restart');assert.equal(before.action,'idle');assert.equal(after.action,'walk');
});
