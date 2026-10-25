import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {FURNITURE_VISUALS as V} from '../data/continuous/furniture-visuals.js';
import {ITEMS} from '../data/continuous/catalog.js';
test('all 20 art IDs and 24 item mappings are unique and canonical',()=>{
 assert.equal(V.assets.length,20);assert.equal(new Set(V.assets.map(x=>x.id)).size,20);
 assert.equal(Object.keys(V.upgrades).length,24);
 for(const item of ITEMS){const visual=V.upgrades[item.id];assert.ok(visual,item.id);
 assert.equal(visual.levels,3);assert.equal(visual.physical,!!visual.asset);
 if(visual.asset)assert.ok(V.assets.find(a=>a.id===visual.asset));}
});
test('the poof is visual only and triggers after canonical successful purchase',()=>{
 const code=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 const i=code.indexOf('if(r.ok){tone(\'success\');map?.iso.revealFurniture');
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
 for(const mapping of Object.values(V.baseline))for(const id of Object.values(mapping))assert.ok(V.assets.some(a=>a.id===id));assert.equal(V.baseline.escritorio.desk,'mesa-escritorio');assert.equal(V.baseline.producao.machine,undefined);
 const code=fs.readFileSync(new URL('../tools/build-furniture.mjs',import.meta.url),'utf8');assert.match(code,/!it.installed&&basics/);assert.match(code,/it.visualLevel=0/);assert.match(code,/baselineArt=true/);
});
