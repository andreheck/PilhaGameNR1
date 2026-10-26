import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {BUDGET_KEY} from '../simulation/investment.js';import {HERO_TEAM_KEY} from '../simulation/hero-team.js';import {TIMELINE_KEY} from '../simulation/mission-timeline.js';import {COMPANY_STATE_KEY} from '../simulation/company-state.js';
import {STORAGE_KEYS,STORAGE_LOCK_NAMES,storageKeyInfo} from '../simulation/storage-keys.js';
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/fin-28c1de8-save.json',import.meta.url),'utf8'));
const memory=()=>{const map=new Map();return {map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))};};
test('active and legacy modules have unique documented keys and separate Web Lock names',()=>{
 assert.equal(new Set(STORAGE_KEYS.map(r=>r.key)).size,STORAGE_KEYS.length);
 for(const key of [M.KEY,BUDGET_KEY,HERO_TEAM_KEY,TIMELINE_KEY,COMPANY_STATE_KEY])assert.ok(storageKeyInfo(key));
 for(const r of STORAGE_KEYS){assert.ok(r.owner&&r.format&&r.scope&&r.migration);assert.equal(Object.isFrozen(r),true);}
 assert.ok(STORAGE_LOCK_NAMES.every(k=>storageKeyInfo(k)===null));assert.equal(storageKeyInfo('unknown'),null);
});
test('a real synthetic fin save opens without losing budget, purchases, team, health, finance or pending event',()=>{
 assert.equal(fixture.source.sha,'28c1de843d15ee5f0cc71e7dd9ff6bf980fa0320');
 const st=memory(),raw=JSON.stringify(fixture.state);st.setItem(M.KEY,raw);const r=M.read(st);assert.ok(r.ok,r.error);L.ensureLiving(r.state);L.validateLiving(r.state);
 for(const key of ['budget','week','activeMs','paused','team','receipts','staff','staffing','finance','events','history','lastWallMs'])assert.deepEqual(r.state[key],fixture.state[key],key);
 assert.equal(r.state.initialHiring,undefined,'old workforce is not reset into initial hiring');assert.equal(r.state.weeklyIncome.total,0,'no retroactive weekly income');assert.equal(r.state.weeklyIncome.lastWeek,r.state.week);assert.equal(st.getItem(M.KEY),raw,'reading does not rewrite original bytes');
});
test('first current transaction preserves legacy records and does not rehire or duplicate currency',async()=>{
 const st=memory(),raw=JSON.stringify(fixture.state),economy=JSON.stringify({version:2,budget:8200,upgrades:[],heroProgression:{preserved:true}});st.setItem(M.KEY,raw);st.setItem(BUDGET_KEY,economy);
 const r=await M.transact(st,s=>({ok:true,state:L.ensureLiving(s)}));assert.ok(r.ok,r.error);assert.equal(r.state.revision,fixture.state.revision+1);assert.equal(r.state.budget,fixture.state.budget);assert.deepEqual(r.state.staff,fixture.state.staff);assert.equal(st.getItem(BUDGET_KEY),economy);assert.equal(r.state.weeklyIncome.total,0);
});
test('unknown versions and corrupted JSON are rejected without overwriting a save',()=>{
 for(const raw of ['{broken',JSON.stringify({...fixture.state,version:99})]){const st=memory();st.setItem(M.KEY,raw);assert.equal(M.read(st).ok,false);assert.equal(st.getItem(M.KEY),raw);}
});
