import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';import {SECTORS} from '../data/continuous/catalog.js';
const catalog=JSON.parse(fs.readFileSync(new URL('../data/continuous/npc-rigged.json',import.meta.url)));
const report=JSON.parse(fs.readFileSync(new URL('../assets/npc-sprites/rigged/report.json',import.meta.url)));
test('approved rigs bind Beatriz and Mariana without replacing canonical portraits or other identities',()=>{
 assert.deepEqual(catalog.bindings.map(b=>b.id),['NPC-16','NPC-07']);
 for(const b of catalog.bindings){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+b.sourceZip,import.meta.url))).digest('hex'),b.sha256);}
 assert.equal(report.retarget.matchedBones,report.retarget.totalBones);assert.equal(report.atlases.length,5);assert.equal(fs.existsSync(new URL('../dist/tools/npc-rigged-sources',import.meta.url)),false,'raw FBX archives are not published');
 for(const a of report.atlases){const bytes=fs.readFileSync(new URL('../assets/npc-sprites/rigged/'+a.file,import.meta.url));assert.equal(bytes.readUInt32BE(16),a.frames*128);assert.equal(bytes.readUInt32BE(20),768);assert.equal(a.anchor[0],.5);assert.ok(a.anchor[1]>.6&&a.anchor[1]<.9,'feet pivot lies on the rendered ground plane');assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);if(a.action==='idle')assert.equal(a.distinctFrames,1);else assert.ok(a.distinctFrames>1);}
});
function engine(s,{images=true}={}){
 let raf,clock=0;const calls=[],noop=()=>{},ctx=new Proxy({drawImage:(image,...args)=>calls.push([image.src,...args]),measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
 class Image{complete=true;naturalWidth=images?1024:0;naturalHeight=images?768:0;}
 const window={Image,devicePixelRatio:1,requestAnimationFrame:fn=>(raf=fn,1),cancelAnimationFrame:()=>{raf=null;}};
 const env={window,Math,Set,performance:{now:()=>clock}};
 vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),env);
 vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),env);
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:700})});iso.resize();iso.setWorld(SECTORS.map((p,i)=>({key:p.id,name:p.name,bx:i%2*14,by:Math.floor(i/2)*10})));iso.setEmployees(L.staffView(s).filter(p=>p.employment==='active'));iso.setRoutineClock(s,L.routines(s));iso.setStatic(false);iso.setManualPause(s.paused);iso.start();
 return {iso,calls,tick:n=>{clock=n;raf?.(n);}};
}
test('only the two approved actors draw rigged sheets and use animated frames without mutating saves',()=>{
 const s=L.ensureLiving(M.fresh());s.activeMs=12000;const before=JSON.stringify(s),{iso,calls,tick}=engine(s);tick(16);const first=iso.riggedAssetsStatus();tick(616);const next=iso.riggedAssetsStatus();
 assert.equal(next.loaded,5);assert.deepEqual(Array.from(next.bindings),['NPC-16','NPC-07']);assert.equal(next.drawn.length,2);assert.ok(next.drawn.every(p=>p.action==='walk'));assert.notEqual(next.drawn.find(p=>p.id==='NPC-16').frame,first.drawn.find(p=>p.id==='NPC-16').frame);
 assert.ok(calls.some(([src])=>src?.endsWith('/beatriz-walk.png')));assert.equal(iso.getEmployees().length,16);assert.equal(JSON.stringify(s),before);
 const p=iso.getEmployees().find(p=>p.id==='NPC-16');iso.focusEmployee(p.id,0);const focused=iso.getEmployees().find(q=>q.id===p.id);assert.equal(iso.pickEmployee(focused.screen.x,focused.screen.y),p.id);
});
test('manual pause freezes rig frames and low health slows the walking clip along with routes',()=>{
 const s=L.ensureLiving(M.fresh());s.activeMs=12000;const normal=engine(s);normal.tick(16);normal.tick(616);const regular=normal.iso.riggedAssetsStatus().drawn.find(p=>p.id==='NPC-16').frame;
 s.staff['NPC-16'].health=54;const slow=engine(s);slow.tick(16);slow.tick(616);assert.notEqual(slow.iso.riggedAssetsStatus().drawn.find(p=>p.id==='NPC-16').frame,regular);
 s.paused=true;const paused=engine(s),before=JSON.stringify(paused.iso.riggedAssetsStatus());paused.tick(9000);assert.equal(JSON.stringify(paused.iso.riggedAssetsStatus()),before);
});
test('unavailable sprite files keep all active actors visible through the existing renderer',()=>{
 const s=L.ensureLiving(M.fresh()),{iso,tick}=engine(s,{images:false});tick(1000);assert.equal(iso.riggedAssetsStatus().loaded,0);assert.equal(iso.riggedAssetsStatus().drawn.length,0);assert.equal(iso.getEmployees().length,16);
});

test('Mariana uses her supplied conversation clip during a restorative pause',()=>{
 const s=L.ensureLiving(M.fresh());s.activeMs=16286;const {iso,tick}=engine(s);tick(16);assert.equal(L.routines(s).find(p=>p.id==='NPC-07').stage,'rest');assert.equal(iso.riggedAssetsStatus().drawn.find(p=>p.id==='NPC-07').action,'talk');
});
