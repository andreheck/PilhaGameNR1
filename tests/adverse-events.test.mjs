import test from 'node:test';import assert from 'node:assert/strict';
import {EVENT_CATALOG as C} from '../simulation/event-catalog.js';
import {FIRST_EVENT_MS,EVENT_GAP_MS,emptyEvents,initializeEvents,eventState,eventClock,eventInflation,eventVisuals,nextEvent,beginEvent,chooseEvent,finishEvent} from '../simulation/adverse-events.js';
import {initialInvestmentState,UPGRADES,applyUpgrade,forecastUpgrades,BUDGET_KEY} from '../simulation/investment.js';
import {transactEconomy,readEconomy,buyHeroLevel,resetStructuralInvestments} from '../simulation/hero-progression.js';
import {companyVisuals} from '../ui/company-visuals.js';
function storage(){const map=new Map();return {map,getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('all 19 Claude events have affordable free exits, valid effects, and complete decision/result flows',()=>{
 assert.equal(C.LIST.length,19);assert.equal(new Set(C.LIST.map(e=>e.id)).size,19);
 for(const d of C.LIST)for(let i=0;i<d.opts.length;i++){
  const s=initialInvestmentState(),copy=JSON.stringify(s);assert.ok(d.opts.some(o=>o.cost===0));
  const opened=beginEvent(s,d.id,d.sec[0],FIRST_EVENT_MS,{preview:true});assert.equal(opened.ok,true,d.id);
  const chosen=chooseEvent(opened.state,1,i);assert.equal(chosen.ok,true,d.id);assert.equal(eventState(chosen.state).current.stage,'result');
  assert.equal(finishEvent(chosen.state,1).ok,true);assert.equal(JSON.stringify(s),copy,'preview reducers never mutate saves');
  const poor=beginEvent({...s,budget:0},d.id,d.sec[0],FIRST_EVENT_MS,{preview:true});assert.equal(chooseEvent(poor.state,1,d.opts.findIndex(o=>o.cost===0)).ok,true,d.id);
 }
});
test('events wait 10 active minutes and the next one waits 15 then 20; purchases do not advance time',()=>{
 let s=initialInvestmentState();assert.equal(beginEvent(s,'equip','producao',FIRST_EVENT_MS-1).error,'not-due');
 s=applyUpgrade(s,'pausas');assert.equal(eventState(s).clockMs,0);assert.equal(eventState(s).nextAt,FIRST_EVENT_MS);
 for(let n=0;n<2;n++){const e=eventState(s),d=nextEvent(s);s=beginEvent(s,d.id,d.sec[0],e.nextAt).state;s=chooseEvent(s,n+1,d.opts.findIndex(o=>!o.cost)).state;s=finishEvent(s,n+1).state;assert.equal(eventState(s).nextAt-eventState(s).clockMs,EVENT_GAP_MS[n]);}
});
test('events, upgrades and hero formation share one atomic budget with duplicate and stale choice protection',async()=>{
 const st=storage();await transactEconomy(st,s=>beginEvent(s,'equip','producao',FIRST_EVENT_MS));
 assert.equal(eventState(readEconomy(st).state).current.stage,'decide','reload resumes pending decision');
 const results=await Promise.all([transactEconomy(st,s=>chooseEvent(s,1,0)),transactEconomy(st,s=>chooseEvent(s,1,0))]);
 assert.equal(results.filter(r=>r.ok).length,1);assert.equal(readEconomy(st).state.budget,9300);
 await transactEconomy(st,s=>buyHeroLevel(s,'PILHA-H01',1));assert.equal(readEconomy(st).state.budget,8800);
 const before=st.map.get(BUDGET_KEY);st.setItem=()=>{throw Error('quota');};assert.equal((await transactEconomy(st,s=>finishEvent(s,1))).ok,false);assert.equal(st.map.get(BUDGET_KEY),before);
});
test('canonical protection maps to owned resources, negatives recover over weeks, positives persist',()=>{
 const base=initialInvestmentState(),protectedState={...base,upgrades:['pausas']};
 const a=beginEvent(base,'fadiga','producao',FIRST_EVENT_MS).state,b=beginEvent(protectedState,'fadiga','producao',FIRST_EVENT_MS).state;
 assert.equal(eventVisuals(a,companyVisuals()).producao.carga,22-8);assert.equal(eventVisuals(b,companyVisuals()).producao.carga,22-4);
 let c=chooseEvent(a,1,0).state;const after=eventVisuals(c,companyVisuals()).producao.carga;
 c=eventClock(c,FIRST_EVENT_MS+3600000).state;assert.ok(eventVisuals(c,companyVisuals()).producao.carga>after);
 assert.equal(resetStructuralInvestments(c).adverseEvents.current.stage,'result');
});
test('inflation quotes match actual purchases in both shops, decay by active week, and never change training costs',()=>{
 let s=beginEvent(initialInvestmentState(),'infl','escritorio',FIRST_EVENT_MS).state;
 s=chooseEvent(s,1,2).state;const quote=forecastUpgrades(s).find(u=>u.id==='ergonomia');assert.equal(quote.cost,1944);
 const bought=applyUpgrade(s,'ergonomia');assert.equal(s.budget-bought.budget,quote.cost);assert.equal(bought.history.at(-1).cost,quote.cost);
 s=eventClock(s,FIRST_EVENT_MS+3600000).state;assert.equal(eventInflation(s),7);
 assert.equal(buyHeroLevel(s,'PILHA-H01',1).cost,500);assert.ok(UPGRADES.every(u=>u.cost>0));
});
test('malformed event saves block writes and preserve data instead of resetting progress',async()=>{
 const st=storage(),s=initialInvestmentState();s.adverseEvents=emptyEvents();s.adverseEvents.current={id:'equip',sid:'producao',serial:1,stage:'result',pick:0,before:{budget:10000}};
 st.setItem(BUDGET_KEY,JSON.stringify(s));const before=st.getItem(BUDGET_KEY);assert.equal(readEconomy(st).ok,false);
 assert.equal((await transactEconomy(st,x=>finishEvent(x,1))).ok,false);assert.equal(st.getItem(BUDGET_KEY),before);
});

test('existing long-running saves receive a full grace period when installing events',()=>{const state=initialInvestmentState();const initialized=initializeEvents(state,3*3600000).state;assert.equal(eventState(initialized).nextAt,3*3600000+FIRST_EVENT_MS);assert.equal(beginEvent(initialized,'equip','producao',3*3600000+1).error,'not-due');assert.equal(initializeEvents(initialized,4*3600000).noWrite,true);});
