import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the UI's actual change boundary with a controllable storage write.
const source=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
const changeSource=source.slice(source.indexOf('async function change('),source.indexOf('\nlet heroes='));
function harness(){
 let record={week:1,revision:0,decided:false,budget:1000},release,fail=false;
 const barrier=new Promise(resolve=>{release=resolve;});let first=true,writes=0;
 const context={state:structuredClone(record),busy:false,changeInFlight:Promise.resolve(),map:null,refresh(){},tell(){},errorText:x=>x,
  L:{ensureLiving(){},validateLiving(){},staffingSummary:()=>({active:16})},
  M:{read:()=>({ok:true,state:structuredClone(record)}),async transact(_,action,revision){
   if(first){first=false;await barrier;}
   if(fail){fail=false;throw new Error('write interrupted');}
   if(revision!==null&&revision!==record.revision)return {ok:false,error:'stale-state'};
   const result=action(structuredClone(record));
   if(result.ok){record=result.state;record.revision++;writes++;}
   return result;
  }},store:{}};
 const change=vm.runInNewContext(changeSource+';change',context);
 return {change,release,failNext:()=>{fail=true;},read:()=>record,writes:()=>writes};
}
const tick=s=>({ok:true,state:s});
const decide=s=>s.decided?{ok:false,error:'stale-event'}:{ok:true,state:{...s,decided:true,budget:s.budget-200}};
test('player decision waits for clock storage, redundant ticks drop, duplicate decision charges once',async()=>{
 const h=harness(),clock=h.change(tick,null,true),decision=h.change(decide),duplicate=h.change(decide);
 assert.equal((await h.change(tick,null,true)).error,'busy');assert.equal(h.writes(),0);
 h.release();assert.equal((await clock).ok,true);assert.equal((await decision).ok,true);
 assert.equal((await duplicate).error,'stale-event');assert.equal(h.read().budget,800);assert.equal(h.writes(),2);
});
test('unexpected write rejection releases queued actions without deadlock',async()=>{
 const h=harness();h.failNext();const clock=h.change(tick,null,true),queued=h.change(decide);
 const rejected=assert.rejects(clock,/write interrupted/);h.release();await rejected;
 assert.equal((await queued).ok,true);assert.equal(h.read().budget,800);
});
test('queued purchases retain their quoted revision and reject stale prices',async()=>{
 const h=harness(),clock=h.change(tick,null,true),purchase=h.change(decide,0);h.release();await clock;
 assert.equal((await purchase).error,'stale-state');assert.equal(h.read().budget,1000);
});
