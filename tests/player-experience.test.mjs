import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {initialPair} from '../ui/player-entry-state.js';
import {companyVisuals,motionPreference,workerMotionPreference} from '../ui/company-visuals.js';
import {saveHeroTeam} from '../simulation/hero-team.js';
import {createCampaign,TIMELINE_KEY} from '../simulation/mission-timeline.js';
import {mapSnapshot,purchaseMapUpgrade} from '../ui/sector-model.js';
const pair={principal:'PILHA-H01',support:'PILHA-H06'};
function storage(){const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};}
test('entry requires a persisted valid pair and preserves the frozen campaign pair',()=>{
 const st=storage();assert.equal(initialPair(st),null);
 assert.equal(saveHeroTeam(st,'01',{...pair,support:pair.principal}).ok,false);assert.equal(initialPair(st),null);
 saveHeroTeam(st,'01',pair);assert.equal(initialPair(st).support,pair.support);
 st.setItem(TIMELINE_KEY,JSON.stringify({version:1,campaigns:{'01':createCampaign('01',pair)}}));
 saveHeroTeam(st,'01',{principal:'PILHA-H02',support:'PILHA-H03'});
 assert.deepEqual(initialPair(st),pair);
 assert.equal(initialPair({getItem(){throw Error('blocked');}}),null);
});
test('motion follows the system until the player explicitly chooses and survives blocked storage',()=>{
 const st=storage();assert.equal(motionPreference(st,true),true);assert.equal(motionPreference(st,false),false);
 st.setItem('pilha-motion-v1','on');assert.equal(motionPreference(st,true),false);
 st.setItem('pilha-motion-v1','off');assert.equal(motionPreference(st,false),true);
 assert.equal(motionPreference({getItem(){throw Error('blocked');}},true),true);
});
test('organizational installation restores its visual signal without changing temporal scores',async()=>{
 const st=storage(),c=createCampaign('01',pair),before=mapSnapshot(st,c,'01');
 assert.ok(before.visual.producao.seg<35);
 await purchaseMapUpgrade(st,'escuta-segura');const after=mapSnapshot(st,c,'01');
 assert.ok(after.visual.producao.seg>35);assert.deepEqual(after.axes,before.axes);
 assert.equal(after.balance,before.balance-900);assert.equal(c.elapsedMs,0);
 assert.deepEqual(companyVisuals(),before.visual);
});
function engine(){
 let raf;const calls=[];
 const ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:(...args)=>calls.push([k,...args])});
 const window={devicePixelRatio:1,requestAnimationFrame:fn=>(raf=fn,1),cancelAnimationFrame:()=>{raf=null;}};
 vm.runInNewContext(fs.readFileSync(new URL('../ui/claude/pilha-iso.js',import.meta.url),'utf8'),{window,Math,Set});
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:800})});
 iso.resize();iso.setEnv('producao');
 return {iso,calls,tick:ts=>raf?.(ts)};
}
test('desktop workers move, then stop in reduced motion, and render existing model walking frames',()=>{
 const {iso,calls,tick}=engine();const e=iso.getEnv('producao');
 iso.setSharedIndexMode(true);iso.setNpcSheets([{}]);iso.start();
 const before=e.people.filter(p=>!p.sit).map(p=>[p.x,p.y]);
 for(let i=1;i<=90;i++)tick(i*50);
 assert.notDeepEqual(e.people.filter(p=>!p.sit).map(p=>[p.x,p.y]),before);
 assert.ok(calls.some(c=>c[0]==='drawImage'&&c[2]>0),'walking frame changes');
 iso.stop();iso.setStatic(true);const paused=e.people.map(p=>[p.x,p.y]);
 iso.start();tick(6000);assert.deepEqual(e.people.map(p=>[p.x,p.y]),paused);
 iso.render();assert.ok(calls.some(c=>c[0]==='fillText'&&c[1]==='!'),'warning remains visible');
});
test('installed furniture is visible once per sector and restores idempotently',()=>{
 const {iso}=engine();const e=iso.getEnv('producao'),count=e.items.length;
 iso.setInventory(['pausas','escuta-segura']);assert.equal(e.items.length,count+2);
 assert.deepEqual(Array.from(e.items.filter(i=>i.installed),i=>i.t).sort(),['sofa','table']);
 iso.setInventory(['pausas','escuta-segura']);assert.equal(e.items.length,count+2);
 iso.setInventory([]);assert.equal(e.items.length,count);
});
test('NPC atlases come from existing GLBs and contain complete four-direction walking sheets',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../assets/npc-sprites/manifest.json',import.meta.url)));
 assert.equal(manifest.length,3);
 for(const item of manifest){
  assert.ok(fs.existsSync(new URL('../assets/actors/'+item.source,import.meta.url)));
  assert.match(item.clip,/Walking/);const png=fs.readFileSync(new URL('../assets/npc-sprites/'+item.key+'.png',import.meta.url));
  assert.equal(png.readUInt32BE(16),128*item.frames);assert.equal(png.readUInt32BE(20),192*item.directions);
 }
});

test('worker circulation starts on desktop and mobile even when decorative motion is reduced',()=>{const st=storage();assert.equal(motionPreference(st,true),true);assert.equal(workerMotionPreference(st),false);st.setItem('pilha-motion-v1','off');assert.equal(workerMotionPreference(st),true);st.setItem('pilha-motion-v1','on');assert.equal(workerMotionPreference(st),false);assert.equal(workerMotionPreference({getItem(){throw Error('blocked');}}),false);});
