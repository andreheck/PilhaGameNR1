import test from 'node:test';
import assert from 'node:assert/strict';
import {HUD_KEY,readHudPreferences,writeHudPreferences} from '../simulation/hud-preferences.js';
import {storageKeyInfo} from '../simulation/storage-keys.js';
import {hudEnabled,sectorStatus} from '../ui/hud-v2.js';

test('HUD flag is opt-in and sector labels follow existing visual thresholds',()=>{
 for(const q of ['', '?hud=v1', '?hud=true', '?view=casos'])assert.equal(hudEnabled(q),false);
 assert.equal(hudEnabled('?hud=v2'),true);
 assert.equal(sectorStatus(39.9).text,'Crítico');assert.equal(sectorStatus(40).text,'Atenção');assert.equal(sectorStatus(65).text,'Estável');
 assert.equal(new Set([0,40,65].map(n=>sectorStatus(n).symbol)).size,3);
});
test('HUD preferences round-trip independently without changing old game records',()=>{
 const records=new Map([['pilha-company-continuous-v2','original-company'],['pilha-investment-v1','original-xp']]);
 const storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,v)};
 assert.ok(storageKeyInfo(HUD_KEY));
 assert.deepEqual(readHudPreferences(storage),{version:1,expanded:true,shortcuts:true});
 assert.equal(records.has(HUD_KEY),false);
 assert.equal(writeHudPreferences(storage,{version:1,expanded:false,shortcuts:false}),true);
 assert.deepEqual(readHudPreferences(storage),{version:1,expanded:false,shortcuts:false});
 assert.equal(records.get('pilha-company-continuous-v2'),'original-company');assert.equal(records.get('pilha-investment-v1'),'original-xp');
});
test('blocked storage and corrupt/unknown preferences preserve original bytes',()=>{
 for(const raw of ['{bad',JSON.stringify({version:99,expanded:false,shortcuts:false}),JSON.stringify({version:1,expanded:0,shortcuts:true})]){
  let original=raw;const storage={getItem:()=>original,setItem:()=>{throw Error('blocked')}};
  assert.equal(readHudPreferences(storage).expanded,true);assert.equal(original,raw);
  assert.equal(writeHudPreferences(storage,{version:1,expanded:false,shortcuts:false}),false);
 }
 assert.equal(writeHudPreferences(null,{version:1,expanded:true,shortcuts:true}),false);
});
