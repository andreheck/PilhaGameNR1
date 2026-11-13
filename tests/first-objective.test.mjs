import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readFirstObjective,writeFirstObjective} from '../ui/first-objective.js';

function memoryStorage(){const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),values};}

test('guided objective starts clean, resumes safely, and persists the selected purchase summary',()=>{
 const storage=memoryStorage();assert.deepEqual(readFirstObjective(storage),{version:1,status:'new',step:0});
 assert.equal(writeFirstObjective(storage,{status:'pending',step:2,purchase:{name:'Melhoria',sector:'Produção',cost:1250,timing:'Início imediato'}}),true);
 assert.deepEqual(readFirstObjective(storage),{version:1,status:'pending',step:2,purchase:{name:'Melhoria',sector:'Produção',cost:1250,timing:'Início imediato'}});
});

test('corrupt, oversized, and blocked preferences never mutate the company save',()=>{
 const raw=new Map([['pilha-company-continuous-v2','game-save']]);
 const storage={getItem:key=>key==='pilha-first-objective-v1'?'not-json':raw.get(key)||null,setItem:(key,value)=>raw.set(key,value)};
 assert.deepEqual(readFirstObjective(storage),{version:1,status:'new',step:0});
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(writeFirstObjective(blocked,{status:'pending',step:1}),false);
 assert.deepEqual(readFirstObjective(blocked),{version:1,status:'new',step:0});
 assert.equal(raw.get('pilha-company-continuous-v2'),'game-save');
});

test('the initial-hiring flow exposes an optional resumable objective without altering the weekly clock contract',()=>{
 const ui=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8'),module=fs.readFileSync(new URL('../ui/first-objective.js',import.meta.url),'utf8');
 assert.match(ui,/firstObjective\.startAfterHiring\(\)/);assert.match(ui,/data-company="guide">Primeiros passos/);assert.match(ui,/case'guide':more\.open=false;firstObjective\.open\(\)/);
 assert.match(ui,/Heróis são conselheiros do conselho; não ocupam postos no mapa\./);assert.match(module,/15 minutos reais ativos/);assert.match(module,/status:'skipped'/);assert.match(module,/pilha:guided-purchase/);
});
