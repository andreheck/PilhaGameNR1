import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {RULES} from '../data/continuous/catalog.js';import {ROBOT,robotStatus} from '../simulation/blue-robot.js';
import {specialStatus,specialMultiplier} from '../simulation/hero-specials.js';
import fs from 'node:fs';import vm from 'node:vm';
import {NPC_MOTION} from '../simulation/npc-motion.js';
test('legacy120s saves keep week fraction, money, purchases, health and pending events on read',()=>{
 for(const paused of [false,true])for(const activeMs of [0,60000,119999]){
  const old=L.ensureLiving(M.fresh());delete old.clockWeekMs;old.week=25;old.activeMs=activeMs;old.paused=paused;old.lastWallMs=1000;old.budget=750;
  const raw=JSON.stringify(old),store={getItem:k=>k===M.KEY?raw:null};const read=M.read(store);assert.ok(read.ok);
  const s=read.state;assert.equal(s.week,25);assert.equal(s.activeMs/RULES.weekMs,activeMs/120000);assert.equal(s.clockWeekMs,RULES.weekMs);assert.equal(s.budget,750);assert.deepEqual(s.staff,old.staff);assert.deepEqual(s.receipts,old.receipts);assert.deepEqual(s.events,old.events);assert.equal(store.getItem(M.KEY),raw);
  assert.deepEqual(M.upgradeClock(JSON.parse(JSON.stringify(s))),s);
 }
});
test('migration writes atomically and new weekly income waits for the remaining half week',async()=>{
 const old=L.ensureLiving(M.fresh());delete old.clockWeekMs;old.activeMs=60000;old.lastWallMs=1000;old.team={principal:'PILHA-H01',support:'PILHA-H02'};let raw=JSON.stringify(old);const original=raw;let fail=true;
 const store={getItem:()=>raw,setItem:(k,v)=>{if(fail)throw Error('disk-full');raw=v;}};
 const action=s=>L.tickAt(s,1000);assert.equal((await M.transact(store,action)).ok,false);assert.equal(raw,original);fail=false;
 const first=await M.transact(store,action);assert.ok(first.ok);assert.equal(first.state.budget,old.budget);assert.equal(first.state.activeMs,RULES.weekMs/2);
 const almost=L.tickAt(first.state,1000+RULES.weekMs/2-1);assert.equal(almost.state.week,1);
 const paid=L.tickAt(almost.state,1000+RULES.weekMs/2);assert.equal(paid.state.week,2);assert.equal(paid.state.weeklyIncome.total,1000);
 assert.deepEqual(L.tickAt(paid.state,1000+RULES.weekMs/2).state,paid.state);
});
test('calendar and robot share the15minute week, with no duplicate calendar scale',()=>{
 assert.equal(RULES.weekMs,15*60000);assert.equal(ROBOT.dayMs,RULES.weekMs/7);const s=L.ensureLiving(M.fresh());s.paused=true;s.activeMs=RULES.weekMs/2;assert.equal(L.simulatedTime(s).progress,.5);
 s.blueRobot=true;s.activeMs=ROBOT.dayMs*(1-ROBOT.rechargeShare/2);assert.ok(robotStatus(s).recharging);assert.ok(Math.abs(robotStatus(s).battery-60)<1e-8);
});
test('unsupported pacing or corrupt values fail instead of overwriting a save',()=>{
 for(const changes of [{clockWeekMs:0},{clockWeekMs:60000},{activeMs:-1},{activeMs:'60000'}]){const raw=JSON.stringify({...M.fresh(),...changes}),store={getItem:()=>raw};assert.equal(M.read(store).ok,false);assert.equal(store.getItem(),raw);}
});
test('a power used halfway through a legacy week keeps its fractional cooldown after migration',()=>{
 const fresh=M.fresh(),old=M.purchase(fresh,M.quote(fresh,'escritorio','lide')).state;
 old.week=25;old.activeMs=60000;delete old.clockWeekMs;old.heroSpecials={'PILHA-H06':{at:25.5,targets:[0]}};
 const raw=JSON.stringify(old),read=M.read({getItem:()=>raw});assert.ok(read.ok,read.error);
 assert.equal(specialStatus(read.state,'PILHA-H06').remaining,4);assert.equal(specialMultiplier(read.state,0),1.2);
});
test('complete patio and meeting routes no longer require sprinting in either map layout',()=>{
 const window={};vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),{window,Math,Set});vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window,Math,Set});
 const nav=window.PilhaIso.navigation,router=window.PilhaNpcRoutes,aisle=nav.aisle,keys=['escritorio','producao','atendimento','restauracao'];let max=0;
 for(const tall of [false,true])for(const health of [40,70]){
  const defs=keys.map((key,i)=>({key,bx:tall?i*10:i%2*14,by:tall?i*10:Math.floor(i/2)*10,depth:key==='restauracao'?18:8}));
  const s=L.ensureLiving(M.fresh());for(const p of Object.values(s.staff))p.health=health;const rows=L.routines(s);
  for(const row of rows){const group=rows.filter(r=>r.sid===row.sid).sort((a,b)=>a.id.localeCompare(b.id)),seat=group.findIndex(r=>r.id===row.id),start=router.sample([...aisle,aisle[0]],(seat+.5)/group.length);
   for(const space of ['patio','meeting:'+seat]){const path=router.route(defs,aisle,nav.connections(defs),row.sid,space,row.id,start);assert.ok(path.length>1);const distance=path.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-path[i].x,p.y-path[i].y),0),seconds=space==='patio'?row.outEnd*(RULES.weekMs*2/7)/1000:NPC_MOTION.meetingTravelMs/(NPC_MOTION.walkRate*row.speed)/1000;
    const speed=distance/seconds;max=Math.max(max,speed);assert.ok(speed<3.5,row.id+' '+space+' '+speed);if(space.startsWith('meeting:'))assert.ok(path.at(-1).y-defs[3].by>=15.2);
   }
  }
 }
 console.log('Maximum full-route walking speed, both layouts:',max.toFixed(2),'map units/s');
});
