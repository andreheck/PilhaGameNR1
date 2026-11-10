import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import crypto from 'node:crypto';
import {FURNITURE_VISUALS as V} from '../data/continuous/furniture-visuals.js';
import {ITEMS} from '../data/continuous/catalog.js';
test('approved, generated and supplied restorative art IDs retain canonical furniture mappings',()=>{
 assert.equal(V.assets.filter(a=>!a.id.startsWith('rest2-')&&!a.id.startsWith('chair-')&&a.id!=='arvore-sombra'&&a.id!=='galpao-logistico').length,25);assert.equal(V.assets.filter(a=>a.id.startsWith('rest2-')).length,10);assert.equal(new Set(V.assets.map(x=>x.id)).size,V.assets.length);
 assert.equal(Object.keys(V.upgrades).length,27);
 const furnitureItems=ITEMS.filter(item=>!item.origin?.startsWith('PM 29/10/2026'));
 assert.equal(furnitureItems.length,27);
 for(const item of furnitureItems){const visual=V.upgrades[item.id];assert.ok(visual,item.id);
 assert.equal(visual.levels,3);assert.equal(visual.physical,!!visual.asset);
 if(visual.asset)assert.ok(V.assets.find(a=>a.id===visual.asset));}
 for(const item of ITEMS.filter(item=>item.origin?.startsWith('PM 29/10/2026')))assert.equal(V.upgrades[item.id],undefined,'benefits have no furniture mapping: '+item.id);
});
test('the poof is visual only and triggers after canonical successful purchase',()=>{
 const code=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 const i=code.indexOf('if(r.ok){tone(\'success\');if(FURNITURE_VISUALS.items?.[id]?.physical){map?.iso.revealFurniture');
 assert.ok(i>0);assert.match(code,/M\.purchase\(s,q\)/);
 assert.doesNotMatch(fs.readFileSync(new URL('../ui/furniture-effects.js',import.meta.url),'utf8'),/localStorage|purchase\(|budget\s*[-+]=/);
});
test('build includes visual effect style and no double charging',()=>{
 const build=fs.readFileSync(new URL('../tools/build-continuous.mjs',import.meta.url),'utf8');
 assert.match(build,/furniture-effects\.css/);
 assert.equal(V.poof.frames,12);assert.equal(V.poof.revealFrame,5);
 assert.equal(V.poof.durationMs,780);
});

test('baseline furniture uses approved assets without masquerading as a paid improvement',()=>{
 for(const mapping of Object.values(V.baseline))for(const id of Object.values(mapping))assert.ok(V.assets.some(a=>a.id===id));assert.equal(V.baseline.escritorio.desk,'mesa-escritorio');assert.equal(V.baseline.producao.machine,'maquina-producao');assert.equal(V.baseline.atendimento.desk,'estacao-atendimento');
 const code=fs.readFileSync(new URL('../tools/build-furniture.mjs',import.meta.url),'utf8');assert.match(code,/!it.installed&&basics/);assert.match(code,/it.visualLevel=0/);assert.match(code,/baselineArt=true/);
});

test('new generated sprites are RGBA, distinct files with versioned provenance',()=>{const manifest=JSON.parse(fs.readFileSync(new URL('../assets/furniture/generated/generation-manifest.json',import.meta.url),'utf8'));assert.equal(manifest.assets.length,5);for(const a of V.assets.filter(a=>a.source==='imagegen-built-in')){const bytes=fs.readFileSync(new URL('..'+a.url,import.meta.url));assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes[25],6);assert.equal(a.status,'generated-for-testing');}});

test('supplied shade tree replaces the same inventory item, preserving costs and existing fruit tree',()=>{
 const a=V.assets.find(a=>a.id==='arvore-sombra'),r=JSON.parse(fs.readFileSync(new URL('../assets/nature/tree-provenance.json',import.meta.url))),png=fs.readFileSync(new URL('..'+a.url,import.meta.url));
 assert.equal(V.upgrades.arvore.asset,a.id);assert.equal(V.items.arvore.asset,a.id);assert.equal(V.upgrades.frutifera.asset,'arvore-frutifera');assert.equal(ITEMS.find(i=>i.id==='arvore').cost,700);
 assert.equal(a.rotationViews,4);assert.equal(png.readUInt32BE(16),r.frameWidth);assert.equal(png.readUInt32BE(20),r.frameHeight*4);assert.equal(crypto.createHash('sha256').update(png).digest('hex'),r.sha256);assert.equal(a.sourceSha256,r.sourceSha256);assert.ok(r.originalVertices>7e6&&r.previewVertices<2e5);assert.ok(png.length<2e6);assert.equal(a.sitPoint,null,'a tree must not advertise a chair seat');
 assert.ok(!fs.existsSync(new URL('../dist/assets/nature/'+r.source,import.meta.url)),'352MB master is not deployed');
});
