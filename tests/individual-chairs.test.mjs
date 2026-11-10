import {historicalSeg} from './fixtures/legacy-seg.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {CHAIR_ITEMS} from '../data/continuous/individual-chairs.js';import {RULES,SECTORS} from '../data/continuous/catalog.js';
import {chairBenefit} from '../simulation/individual-chairs.js';import {employeeInfluences} from '../simulation/employee-influences.js';
import {createFurniturePresentation} from '../ui/furniture-presentation.js';import {FURNITURE_VISUALS as V} from '../data/continuous/furniture-visuals.js';
import {staffAction} from '../simulation/staffing-management.js';
const setup=()=>L.ensureLiving(M.fresh());
const purchase=(s,id,targetId)=>{const q=M.quote(s,'escritorio',id,{targetId}),r=M.purchase(s,q);assert.ok(r.ok,r.error);return r.state;};
test('chairs require an active local user, charge once, and never improve the collective index',()=>{
 let s=setup();const metric=M.metrics(s,'escritorio'),money=s.budget,raw=JSON.stringify(s);
 assert.equal(M.quote(s,'escritorio','cadeira-producao').error,'chair-target-required');assert.equal(M.quote(s,'escritorio','cadeira-producao',{targetId:'NPC-09'}).ok,false);
 const q=M.quote(s,'escritorio','cadeira-producao',{targetId:'NPC-01'});s=M.purchase(s,q).state;assert.equal(s.budget,money-900);assert.equal(M.purchase(s,q).ok,false);assert.deepEqual(M.metrics(s,'escritorio'),metric);assert.equal(JSON.parse(raw).receipts.length,0);
 assert.equal(M.quote(s,'escritorio','cadeira-pensamento',{targetId:'NPC-01'}).ok,false);M.validate(s);
});
test('only the actual, assigned seated user receives a temporary health bonus',()=>{
 let s=purchase(setup(),'cadeira-producao','NPC-01');const before=JSON.stringify(s),plain=L.staffView(s),live=L.staffView(s,[{id:'NPC-01',chairInUse:'cadeira-producao'},{id:'NPC-02',chairInUse:'cadeira-producao'}]);
 assert.equal(live.find(p=>p.id==='NPC-01').health,plain.find(p=>p.id==='NPC-01').health+2);assert.equal(live.find(p=>p.id==='NPC-02').chairBonus,null);assert.equal(chairBenefit(s,'NPC-01','cadeira-pensamento'),null);
 assert.equal(L.staffView(s).find(p=>p.id==='NPC-01').chairBonus,null);assert.equal(JSON.stringify(s),before);
 s.staff['NPC-01'].employment='leave';assert.equal(chairBenefit(s,'NPC-01','cadeira-producao'),null);
 s.staff['NPC-01'].employment='active';s.staff['NPC-01'].health=100;assert.equal(L.staffView(s,[{id:'NPC-01',chairInUse:'cadeira-producao'}]).find(p=>p.id==='NPC-01').health,100);
});
test('three levels renovate one seat; reassignment is free, exclusive and idempotent',()=>{
 let s=setup();for(let i=0;i<3;i++)s=purchase(s,'cadeira-producao','NPC-01');assert.equal(M.level(s,'escritorio','cadeira-producao'),3);assert.equal(chairBenefit(s,'NPC-01','cadeira-producao').healthBonus,4);
 const before=s.budget;s=M.assignChair(s,'escritorio','cadeira-producao','NPC-02').state;assert.equal(s.budget,before);assert.equal(chairBenefit(s,'NPC-01','cadeira-producao'),null);assert.equal(chairBenefit(s,'NPC-02','cadeira-producao').level,3);assert.deepEqual(M.assignChair(s,'escritorio','cadeira-producao','NPC-02').state,s);
 const split=structuredClone(s);split.receipts[0].targetId='NPC-03';assert.throws(()=>M.validate(split),/split-chair-user/);
});
test('failed persistence does not charge, assign a seat or lose the existing save',async()=>{
 const state=setup(),raw=JSON.stringify(state),store={getItem:()=>raw,setItem:()=>{throw Error('full');}};const q=M.quote(state,'escritorio','cadeira-producao',{targetId:'NPC-01'});const r=await M.transact(store,s=>M.purchase(s,q));assert.equal(r.ok,false);assert.equal(store.getItem(),raw);
});
test('reassignment reserves the seat until the former user finishes the current work window',()=>{
 let s=purchase(setup(),'cadeira-producao','NPC-01');const row=L.routines(s).find(r=>r.id==='NPC-01');let pose;
 for(let t=0;t<RULES.weekMs;t+=1000){const p=row.sampleAt(t);if(p.kind==='work'&&p.holding){s.activeMs=t;pose=p;break;}}
 assert.ok(pose);const next=M.assignChair(s,'escritorio','cadeira-producao','NPC-04');assert.ok(next.ok);s=next.state;const receipt=s.receipts[0];assert.ok(receipt.chairAvailableAt>=pose.workEnd/RULES.weekMs+1);assert.equal(chairBenefit(s,'NPC-04','cadeira-producao'),null);M.validate(s);
});
test('supplied chair clips keep their frame timing, scale and seat markers',()=>{
 const noop=()=>{},draw=createFurniturePresentation();for(const c of CHAIR_ITEMS){const a=V.assets.find(a=>a.id==='chair-'+c.asset),x=[];assert.equal(a.seats.length,1);assert.ok(Math.abs(a.seats[0].height-.56)<.001);assert.equal(a.animation.frames,8);assert.ok(a.scale.width<.8&&a.scale.depth<.9);const ctx={save:noop,restore:noop,drawImage:(...args)=>x.push(args[1])},it={t:'individualChair',visualAsset:a.id,x:0,y:0,w:a.scale.width,d:a.scale.depth,h:a.scale.height};for(const time of [0,a.animation.duration*.4,a.animation.duration*.4])draw.draw({ctx,P:()=>[0,0],unit:30,scale:1,time},it,{key:'escritorio'},{catalog:V,images:{[a.id]:{complete:true,naturalWidth:a.animation.frameWidth*8,naturalHeight:a.bounds[3]}},reveal:{}});assert.notEqual(x[0],x[1]);assert.equal(x[1],x[2]);}
});
test('weekly management influences include additional hires after onboarding',()=>{
 let s=staffAction(setup(),'hire',{sector:'escritorio',candidateId:'NOVO-01'}).state;
 s=L.advanceRunning(s).state;s=L.advanceRunning(s).state;assert.equal(s.staff['NOVO-01'].employment,'active');assert.ok(s.staff['NOVO-01'].leadership);assert.equal(s.staff['NOVO-01'].leadership.week,s.week);L.validateLiving(s);
});
test('live influences explain negative events, positive purchases and active seat usage without applying again',()=>{
 let s=purchase(setup(),'cadeira-producao','NPC-01');s.eventEffects.push({sid:'escritorio',factor:'carga',delta:-6,at:s.week});s=purchase(s,'cadeira-pensamento','NPC-02');
 const raw=JSON.stringify(s),p=L.staffView(s,[{id:'NPC-01',chairInUse:'cadeira-producao'}]).find(p=>p.id==='NPC-01'),r=employeeInfluences(s,p);
 assert.ok(r.direct.some(x=>x.title==='Cadeira da Produção'&&x.health===2));assert.ok(r.sources.some(x=>x.factors.some(f=>f.id==='carga'&&f.delta===-6)));assert.equal(r.conditions.length,6);assert.ok(r.context.some(x=>x.scope.includes('próximo fechamento')));assert.equal(JSON.stringify(s),raw);
});
test('source chips reconcile with actual sector factors before the0–100 clamp',()=>{
 let s=setup();s=historicalSeg(s);s=M.purchase(s,M.quote(s,'escritorio','ergo')).state;s.week=4;s.eventEffects.push({sid:'escritorio',factor:'carga',delta:-8,at:1});s.activeMs=RULES.weekMs*.3;
 const person=L.staffView(s).find(p=>p.id==='NPC-01'),report=employeeInfluences(s,person),base=SECTORS.find(r=>r.id==='escritorio').base,actual=M.values(s,'escritorio');
 for(const id of Object.keys(base)){const sum=report.sources.flatMap(r=>r.factors).filter(f=>f.id===id).reduce((n,f)=>n+f.delta,0);assert.ok(Math.abs(Math.max(0,Math.min(100,base[id]+sum))-actual[id])<.04,id);}
 assert.ok(report.sources.some(r=>r.title==='Segurança Psicológica'));assert.ok(report.sources.some(r=>r.factors.some(f=>f.delta<0)));
});
test('renderer reaches each real seat and grants the bonus only during its seated pause',()=>{
 let s=setup();for(const [i,c] of CHAIR_ITEMS.entries())s=purchase(s,c.id,'NPC-0'+(i+1));
 const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop}),window={devicePixelRatio:1,requestAnimationFrame:()=>1,cancelAnimationFrame:noop};
 vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),{window,Math,Set});vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window,Math,Set,performance:{now:()=>0}});
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:700})});iso.resize();iso.setWorld(SECTORS.map((c,i)=>({key:c.id,bx:i%2*14,by:Math.floor(i/2)*10})));iso.setFurniturePresentation(createFurniturePresentation());iso.setFurnitureCatalog(V);iso.setSectorInventory(M.snapshot(s).levels);iso.setEmployees(L.staffView(s));const used=new Set();
 for(let t=0;t<RULES.weekMs;t+=RULES.weekMs/300){s.activeMs=t;iso.setEmployees(L.staffView(s));iso.setRoutineClock({...s,paused:true},L.routines(s));const actors=iso.getEmployees();for(const a of actors.filter(a=>a.chairInUse)){used.add(a.chairInUse);assert.equal(a.activity,'using-chair');assert.equal(a.sitting,true);const chair=iso.furnitureLayout().find(r=>r.id==='escritorio').items.find(it=>it.id===a.chairInUse||it.visualIds.includes(a.chairInUse));assert.ok(a.x>=chair.x&&a.x<=chair.x+chair.w&&a.y>=chair.y&&a.y<=chair.y+chair.d);const view=L.staffView(s,actors).find(p=>p.id===a.id);assert.ok(view.chairBonus);assert.equal(view.health,Math.round(a.health));}}
 assert.equal(used.size,3,'all three supplied seats are actually used');
});
