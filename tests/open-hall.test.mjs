import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {HALL_RESOURCES} from '../resource-catalog.js';
import {UPGRADES,applyUpgrade,initialInvestmentState,readInvestmentState,persistInvestmentState,advanceInvestmentDay} from '../simulation/investment.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('os 12 recursos fisicos correspondem ao catalogo financeiro existente',()=>{
 assert.equal(HALL_RESOURCES.length,12);assert.equal(new Set(HALL_RESOURCES.map(r=>r.id)).size,12);
 assert.deepEqual(HALL_RESOURCES.map(r=>r.id).sort(),UPGRADES.map(r=>r.id).sort());
 for(const r of HALL_RESOURCES){assert.equal(r.at.length,2);assert.ok(r.at.every(Number.isFinite));assert.ok(['01','02','03','04','05'].includes(r.sector));assert.ok(r.size.every(x=>x>0));}
});
test('melhoria, duplicacao, recarga e 30 dias mantem contrato de simulacao',()=>{
 let s=applyUpgrade(initialInvestmentState(),'ergonomia',123);assert.equal(s.budget,8200);assert.equal(applyUpgrade(s,'ergonomia',124).error,'already-installed');
 const m=new Map(),storage={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};persistInvestmentState(storage,s);s=readInvestmentState(storage);assert.deepEqual(s.upgrades,['ergonomia']);assert.equal(s.budget,8200);s=advanceInvestmentDay(s,30,300);assert.ok(s.indicators.workload<50);assert.equal(s.resolvedForecasts.length,1);
});
test('malhas fornecidas preservam esqueletos e animacoes em arquivos locais leves',()=>{
 for(const file of ['mentor-pilha.glb','mentora-biblioteca.glb']){const b=fs.readFileSync(new URL('../assets/actors/'+file,import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');const n=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+n).toString());assert.ok(j.skins?.[0]?.joints.length>=20);assert.ok(j.animations.length>=6);assert.ok(j.animations.some(a=>/idle/i.test(a.name)));assert.ok(b.length<3e6);}
});
test('transformacao e restauracao sao explicitas e nao apenas alteracao da cor do setor',()=>{
 const w=read('world3d.js'),h=read('open-hall.js'),p=read('play.js');
 assert.match(w,/createOpenHall\(scene,regions\)/);assert.doesNotMatch(w,/box\(r\.w,\.58/);assert.match(h,/r\.basic\.visible=false/);assert.match(h,/r\.upgraded\.visible=true/);assert.match(h,/prefers-reduced-motion/);assert.match(w,/hall\.upgrade\(upgrade\.id,options\)/);assert.match(p,/animate:false/);assert.match(p,/data-resource/);assert.match(p,/Aplicar melhoria no espaço/);
});
