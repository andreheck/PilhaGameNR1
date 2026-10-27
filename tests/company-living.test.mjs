import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';import {EMPLOYEES} from '../data/continuous/employees.js';import {RULES,SECTORS,ITEMS} from '../data/continuous/catalog.js';
const now=1000000,near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`),setup=()=>L.tickAt(M.fresh(),now).state;
test('16 canonical identities; ages missing from registry remain null',()=>{assert.equal(EMPLOYEES.length,16);assert.equal(new Set(EMPLOYEES.map(p=>p.id)).size,16);assert.equal(EMPLOYEES[3].name,'Raimunda');assert.ok(EMPLOYEES.slice(8).every(p=>p.age===null));});
test('migration adds workforce without resetting money or purchases',()=>{const a=M.purchase(M.fresh(),M.quote(M.fresh(),'producao','jorn')).state,b=JSON.parse(JSON.stringify(a));L.ensureLiving(a);assert.equal(a.budget,8800);assert.deepEqual(a.receipts,b.receipts);assert.equal(Object.keys(a.staff).length,16);assert.equal(a.version,2);});
test('wall clock advances with pending events without choosing a response',()=>{let s=setup();s=L.tickAt(s,now+RULES.weekMs*5+1500).state;assert.equal(s.week,6);assert.equal(s.activeMs,1500);assert.equal(s.events.current.stage,'decision');assert.equal(s.events.current.pick,null);M.validate(s);L.validateLiving(s);});
test('same timestamps are idempotent and backward system-clock changes are safe',()=>{const s=L.tickAt(setup(),now+RULES.weekMs+300).state;assert.deepEqual(L.tickAt(s,now+RULES.weekMs+300).state,s);assert.deepEqual(L.tickAt(s,now-200).state,s);});
test('sequential tabs do not double elapsed time',()=>{let s=setup();s=L.tickAt(s,now+500).state;s=L.tickAt(s,now+501).state;assert.equal(s.activeMs,501);});
test('manual pause freezes elapsed time; resume starts from current timestamp',()=>{let s=L.setPaused(setup(),true,now+1000).state;s=L.tickAt(s,now+50*RULES.weekMs).state;assert.equal(s.week,1);assert.equal(s.activeMs,1000);s=L.setPaused(s,false,now+60*RULES.weekMs).state;s=L.tickAt(s,now+60*RULES.weekMs+100).state;assert.equal(s.activeMs,1100);});
test('catch-up is chunked without dropping elapsed debt',()=>{let s=setup(),future=now+RULES.weekMs*500+220;s=L.tickAt(s,future).state;assert.equal(s.week,241);assert.ok(s.lastWallMs<future);s=L.tickAt(s,future).state;s=L.tickAt(s,future).state;assert.equal(s.week,501);assert.equal(s.activeMs,220);assert.equal(s.lastWallMs,future);});
test('health is bounded, persisted and independent from personality',()=>{let s=setup();const a=L.staffView(s);assert.equal(a.length,16);assert.ok(a.every(x=>x.health>=0&&x.health<=100));assert.equal(new Set(a.filter(x=>x.home==='escritorio').map(x=>x.health)).size,1);s.events.nextWeek=999;for(let i=0;i<20;i++)s=L.advanceRunning(s).state;assert.ok(L.staffView(s).every(x=>x.health>=0&&x.health<=100));assert.ok(L.staffView(s).every((p,i,a)=>i===0||a[i-1].health>=p.health));});
test('restoration uses canonical IDs without duplicates',()=>{let s=setup();s.budget=100000;for(const id of ['puff','arvore','livros','tapete','cursos','intervalo'])s=M.purchase(s,M.quote(s,'restauracao',id)).state;s.events.nextWeek=999;for(let i=0;i<8;i++)s=L.advanceRunning(s).state;const a=L.attendance(s);assert.ok(a.filter(p=>p.inRestArea).length<=6);assert.equal(new Set(a.map(p=>p.id)).size,a.length);assert.ok(a.every(p=>EMPLOYEES.some(e=>e.id===p.id)));assert.ok(s.visits.every(p=>p.worker.startsWith('NPC-')));});
test('corrupted health and timestamps are rejected rather than silently replaced',()=>{const s=setup();s.staff['NPC-01'].health=999;assert.throws(()=>L.ensureLiving(s),/invalid-employee/);const t=setup();t.lastWallMs='yesterday';assert.throws(()=>L.ensureLiving(t),/invalid-wall-clock/);});
test('fictional calendar follows fractional weeks and respects pause',()=>{const s=setup(),a=L.simulatedTime(s,now),b=L.simulatedTime(s,now+1000);assert.equal(a.iso,'2026-10-23T08:00:00.000Z');near(b.date-a.date,7*86400000/RULES.weekMs*1000);assert.equal(L.calendarMonth(s,0,now).count,31);assert.equal(L.calendarMonth(s,1,now).count,30);s.paused=true;assert.equal(L.simulatedTime(s,now).iso,L.simulatedTime(s,now+999999).iso);});
function engine(){let raf,clock=0;const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});const window={devicePixelRatio:1,requestAnimationFrame:fn=>(raf=fn,1),cancelAnimationFrame:()=>{raf=null;}};vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),{window,Math,Set});vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window,Math,Set,performance:{now:()=>clock}});const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:700})});iso.resize();iso.setWorld(SECTORS.map((s,i)=>({key:s.id,name:s.name,bx:i%2*14,by:Math.floor(i/2)*10})));iso.setEmployees(L.staffView(setup()));iso.setStatic(false);iso.start();return {iso,tick:ts=>{clock=ts;raf?.(ts);}};}
test('all16 actors walk automatically, can be picked and respect manual pause',()=>{const {iso,tick}=engine();const before=JSON.stringify(iso.getEmployees());for(let i=1;i<=120;i++)tick(i*16);assert.notEqual(JSON.stringify(iso.getEmployees()),before);const people=iso.getEmployees();assert.equal(people.length,16);assert.equal(new Set(people.map(p=>p.id)).size,16);assert.ok(people.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.screen.x)));const p=people[0];assert.equal(iso.pickEmployee(p.screen.x,p.screen.y),p.id);iso.setManualPause(true);const paused=JSON.stringify(iso.getEmployees());iso.start();tick(3000);assert.equal(JSON.stringify(iso.getEmployees()),paused);iso.setManualPause(false);tick(3100);tick(3300);assert.notEqual(JSON.stringify(iso.getEmployees()),paused);});
test('restoring visitors keeps exactly16 rendered identities',()=>{const {iso}=engine();iso.setRestVisitors([{id:'NPC-01',sid:'escritorio',space:'biblioteca'}]);assert.equal(iso.getEmployees().length,16);assert.equal(iso.getEmployees().filter(p=>p.id==='NPC-01').length,1);assert.equal(iso.getEmployees().find(p=>p.id==='NPC-01').sector,'restauracao');iso.setEmployees(L.staffView(setup()));iso.setRestVisitors([]);assert.equal(iso.getEmployees().find(p=>p.id==='NPC-01').sector,'escritorio');});
test('built entry includes opening, calendar, world and employee list with no animation toggle',()=>{const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(html,/continuous\/intro.js/);const intro=fs.readFileSync(new URL('../dist/ui/continuous/intro.js',import.meta.url),'utf8');assert.doesNotMatch(intro,/class="pi-motion"|motionButton/);const ui=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');assert.match(ui,/data-company="employees"/);assert.match(ui,/data-company="world"/);assert.doesNotMatch(ui,/'case\d|play\.js|document.hidden\|\|/);assert.match(ui,/await playOpening\(\);await explainGame/);});

test('pausing after a long suspension consumes all elapsed batches before freezing',()=>{
 const future=now+RULES.weekMs*500+220;
 const r=L.setPaused(setup(),true,future);
 assert.equal(r.ok,true);assert.equal(r.weeks,500);
 assert.equal(r.state.week,501);assert.equal(r.state.activeMs,220);
 assert.equal(r.state.lastWallMs,future);assert.equal(r.state.paused,true);
 const same=L.tickAt(r.state,future+RULES.weekMs*10).state;
 assert.equal(same.week,501);assert.equal(same.activeMs,220);
 assert.equal(same.budget,r.state.budget);
 assert.deepEqual(same.events.current,r.state.events.current);
});

test('locate employee centers the person in both working and restoration sectors',()=>{
 const {iso,tick}=engine();for(let i=1;i<=70;i++)tick(i*16);
 const id='NPC-01';assert.equal(iso.focusEmployee('NPC-99',0),false);
 assert.equal(iso.focusEmployee(id,0),true);
 let p=iso.getEmployees().find(p=>p.id===id);
 assert.ok(Math.abs(p.screen.x-600)<20,'working actor centered horizontally');
 assert.ok(Math.abs(p.screen.y-350)<20,'working actor centered vertically');
 assert.equal(iso.pickEmployee(p.screen.x,p.screen.y),id);
 iso.setRestVisitors([{id,sid:'escritorio',space:'biblioteca'}]);
 assert.equal(iso.focusEmployee(id,0),true);
 p=iso.getEmployees().find(p=>p.id===id);
 assert.equal(p.sector,'restauracao');
 assert.ok(Math.abs(p.screen.x-600)<20,'resting actor centered horizontally');
 assert.ok(Math.abs(p.screen.y-350)<20,'resting actor centered vertically');
 iso.setManualPause(true);assert.equal(iso.focusEmployee(id,0),true);
 p=iso.getEmployees().find(p=>p.id===id);
 assert.ok(Math.abs(p.screen.x-600)<20,'pause keeps person in viewport');
});


// Management rules use real sector stress context and a weekly pre-effect snapshot.
const management=await import('../simulation/leadership-effects.js');
const factorsAt=(s,sid,value)=>{for(const [factor,base] of Object.entries(SECTORS.find(x=>x.id===sid).base))s.eventEffects.push({sid,factor,delta:value-base,at:s.week});};
test('management uses strict >40 stress and >70 health thresholds, with exact boundaries',()=>{
 const s=setup();factorsAt(s,'escritorio',60);s.staff['NPC-03'].health=70;let c=management.leadershipConditions(s).find(c=>c.sid==='escritorio');near(c.stress,40);assert.equal(c.penalty,0);assert.equal(c.bonus,0);
 s.staff['NPC-03'].health=70.01;c=management.leadershipConditions(s)[0];assert.equal(c.bonus,7);
 s.eventEffects=[];factorsAt(s,'escritorio',59.99);assert.ok(management.leadershipConditions(s)[0].stress>40);assert.equal(management.leadershipConditions(s)[0].penalty,-5);
});
test('stress reduces every sector member including manager; healthy manager helps only subordinates',()=>{
 const s=setup();for(const p of EMPLOYEES)s.staff[p.id].health=60;s.staff['NPC-03'].health=80;const other=s.staff['NPC-11'].health;
 management.applyLeadershipEffects(s,EMPLOYEES.filter(p=>p.home==='escritorio').map(p=>p.id));
 assert.equal(s.staff['NPC-03'].health,75);for(const p of EMPLOYEES.filter(p=>p.home==='escritorio'&&p.id!=='NPC-03')){assert.equal(s.staff[p.id].health,62);assert.equal(s.staff[p.id].leadership.penalty,-5);assert.equal(s.staff[p.id].leadership.bonus,7);}assert.equal(s.staff['NPC-11'].health,other);
 const once=JSON.stringify(s);management.applyLeadershipEffects(s,EMPLOYEES.filter(p=>p.home==='escritorio').map(p=>p.id));assert.equal(JSON.stringify(s),once);
});
test('management applies clamps and snapshots before effects, independent of employee ordering',()=>{
 let s=setup();factorsAt(s,'escritorio',100);for(const p of EMPLOYEES.filter(p=>p.home==='escritorio'))s.staff[p.id].health=99;s.staff['NPC-03'].health=80;management.applyLeadershipEffects(s);assert.equal(s.staff['NPC-01'].health,100);assert.equal(s.staff['NPC-01'].leadership.delta,1);assert.equal(s.staff['NPC-03'].health,80);
 s=setup();for(const p of EMPLOYEES)s.staff[p.id].health=1;management.applyLeadershipEffects(s);assert.ok(Object.values(s.staff).every(p=>p.health===0));L.validateLiving(s);
 s=setup();s.staff['NPC-03'].health=71;management.applyLeadershipEffects(s);assert.equal(s.staff['NPC-03'].health,66);assert.equal(s.staff['NPC-01'].leadership.bonus,7,'manager was above70 in shared snapshot before losing5');
});
test('weekly management changes actual persisted health, environment average and keeps finances intact',()=>{
 const s=setup();s.staff['NPC-03'].health=90;const before=JSON.stringify(s),r=L.advanceRunning(s);assert.ok(r.ok);assert.equal(JSON.stringify(s),before);const n=r.state;
 for(const p of EMPLOYEES){const target=30+M.metrics(n,p.home).index*.65;const baseline=s.staff[p.id].health+(target-s.staff[p.id].health)*.2;const a=n.staff[p.id];near(a.health,Math.max(0,Math.min(100,baseline+a.leadership.penalty+a.leadership.bonus)));assert.equal(a.leadership.week,n.week);}
 assert.equal(n.budget,s.budget+500+n.finance.ledger.at(-1).revenue-n.finance.ledger.at(-1).costs);assert.deepEqual(n.receipts,s.receipts);const summary=management.leadershipSummary(n)[0];near(summary.averageHealth,EMPLOYEES.filter(p=>p.home==='escritorio').reduce((sum,p)=>sum+n.staff[p.id].health,0)/6);M.validate(n);L.validateLiving(n);
 const restored=JSON.parse(JSON.stringify(n));assert.deepEqual(L.ensureLiving(restored),n);const readOnly=JSON.stringify(n);L.staffView(n);management.leadershipSummary(n);assert.equal(JSON.stringify(n),readOnly);
});
test('legacy saves get no retroactive management damage; pause and catch-up stay idempotent',()=>{
 const s=setup();s.week=50;for(const p of Object.values(s.staff))p.week=50;const old=JSON.stringify(s);L.ensureLiving(s);assert.equal(JSON.stringify(s),old);
 const paused=L.setPaused(s,true,now).state;assert.deepEqual(L.tickAt(paused,now+RULES.weekMs*5).state.staff,paused.staff);
 const a=setup(),time=now+RULES.weekMs*3;const one=L.tickAt(a,time).state;let chunks=a;for(let i=1;i<=3;i++)chunks=L.tickAt(chunks,now+RULES.weekMs*i).state;assert.deepEqual(one.staff,chunks.staff);assert.deepEqual(L.tickAt(one,time).state,one);
 const broken=JSON.parse(JSON.stringify(one));broken.staff['NPC-01'].leadership.bonus=100;assert.throws(()=>L.ensureLiving(broken),/invalid-leadership/);
});


const income=await import('../simulation/weekly-income.js');
test('weekly budget counts only canonical epic heroes in the selected valid duo',()=>{
 const s=setup();assert.equal(income.weeklyIncomeQuote(s).total,500);s.team={principal:'PILHA-H01',support:'PILHA-H02'};assert.deepEqual(income.weeklyIncomeQuote(s),{base:500,bonus:500,epics:['PILHA-H01','PILHA-H02'],total:1000});s.team.support='PILHA-H05';assert.equal(income.weeklyIncomeQuote(s).total,750);s.team={principal:'PILHA-H05',support:'PILHA-H06'};assert.equal(income.weeklyIncomeQuote(s).bonus,250);s.team={principal:'PILHA-H01',support:'PILHA-H01'};assert.equal(income.weeklyIncomeQuote(s).total,500);
});
test('new week deposits usable funds once, persists its composition and never pays on team changes',()=>{
 let s=setup();s.team={principal:'PILHA-H01',support:'PILHA-H02'};const original=JSON.stringify(s);s=L.advanceRunning(s).state;assert.equal(s.budget,10000+s.weeklyIncome.total+s.finance.earned-s.finance.operationalCosts);assert.equal(s.weeklyIncome.lastPayment.amount,1000);assert.equal(s.weeklyIncome.lastPayment.bonus,500);const paid=JSON.stringify(s);income.grantWeeklyIncome(s);assert.equal(JSON.stringify(s),paid);s.team.support='PILHA-H05';income.grantWeeklyIncome(s);assert.equal(s.budget,10000+s.weeklyIncome.total+s.finance.earned-s.finance.operationalCosts);s=L.advanceRunning(s).state;assert.equal(s.budget,10000+s.weeklyIncome.total+s.finance.earned-s.finance.operationalCosts);assert.equal(s.weeklyIncome.total,1750);assert.equal(s.weeklyIncome.lastPayment.bonus,250);const restored=L.ensureLiving(JSON.parse(JSON.stringify(s)));assert.equal(restored.budget,s.budget);assert.deepEqual(restored.weeklyIncome,s.weeklyIncome);assert.equal(JSON.parse(original).budget,10000);
});
test('income respects pause, repeated clocks, missed-week reconciliation and legacy initialization',()=>{
 let s=setup();s.team={principal:'PILHA-H01',support:'PILHA-H02'};const paused=L.setPaused(s,true,now).state;assert.equal(L.tickAt(paused,now+RULES.weekMs*3).state.budget,10000);const one=L.tickAt(s,now+RULES.weekMs*3).state;let parts=s;for(let i=1;i<=3;i++)parts=L.tickAt(parts,now+RULES.weekMs*i).state;near(one.budget,10000+one.weeklyIncome.total+one.finance.earned-one.finance.operationalCosts);assert.deepEqual(one.weeklyIncome,parts.weeklyIncome);assert.equal(L.tickAt(one,now+RULES.weekMs*3).state.budget,one.budget);
 const legacy=M.fresh();legacy.week=40;L.ensureLiving(legacy);assert.equal(legacy.budget,10000);assert.equal(legacy.weeklyIncome.lastWeek,40);const next=L.advanceRunning(legacy).state;assert.equal(next.budget,10000+500+next.finance.earned-next.finance.operationalCosts);
});
test('deposited income can be spent through existing purchase flow; malformed ledgers reject',()=>{
 let s=setup();s.events.nextWeek=999;s.budget=0;s.team={principal:'PILHA-H01',support:'PILHA-H02'};s=L.advanceRunning(s).state;const candidates=ITEMS.filter(i=>!i.rest).map(i=>M.quote(s,'escritorio',i.id)).filter(q=>q.ok&&q.affordable);assert.ok(candidates.length);const q=candidates[0],r=M.purchase(s,q);assert.ok(r.ok);assert.equal(r.state.budget,s.budget-q.cost);assert.deepEqual(r.state.weeklyIncome,s.weeklyIncome);L.validateLiving(r.state);
 for(const corrupt of [l=>l.total=-1,l=>l.lastWeek=999,l=>l.lastPayment.amount=9999]){const bad=JSON.parse(JSON.stringify(s));corrupt(bad.weeklyIncome);assert.throws(()=>L.ensureLiving(bad),/invalid-weekly-income/);}
 s.budget=1e9-100;s=L.advanceRunning(s).state;assert.equal(s.budget,1e9);assert.ok(s.weeklyIncome.lastPayment.amount<=100);M.validate(s);L.validateLiving(s);
});

test('weekly deposit is atomic on storage failure and serialized tabs consume one timestamp',async()=>{
 const initial=setup();initial.team={principal:'PILHA-H01',support:'PILHA-H02'};let raw=JSON.stringify(initial),fail=true;const store={getItem:()=>raw,setItem:(k,v)=>{if(fail)throw Error('storage-unavailable');raw=v;}};
 const failed=await M.transact(store,s=>L.tickAt(s,now+RULES.weekMs));assert.equal(failed.ok,false);assert.equal(raw,JSON.stringify(initial));fail=false;
 const paid=await M.transact(store,s=>L.tickAt(s,now+RULES.weekMs));assert.ok(paid.ok);assert.equal(paid.state.budget,10000+1000+paid.state.finance.earned-paid.state.finance.operationalCosts);const another=await M.transact(store,s=>L.tickAt(s,now+RULES.weekMs));assert.ok(another.ok);assert.equal(another.state.budget,paid.state.budget);assert.equal(another.state.weeklyIncome.total,1000);
});

const routines=await import('../simulation/rest-routines.js');
test('every active NPC retains rest journeys alongside weekly meetings without duplicate identities or permanent scores',()=>{
 const s=setup(),raw=JSON.stringify(s),seen=new Map(EMPLOYEES.map(p=>[p.id,new Set()]));
 for(let t=0;t<RULES.weekMs;t+=100){s.activeMs=t;const rows=L.routines(s);assert.equal(new Set(rows.map(r=>r.id)).size,16);
  for(const r of rows){seen.get(r.id).add(r.stage);assert.ok(r.healthBonus>=0&&r.healthBonus<=8);if(!r.influenced)assert.equal(r.healthBonus,0);}
  assert.ok(rows.filter(r=>r.stage==='rest').length<=6,'six rest seats; additional workers may travel in corridors');
 }
 for(const stages of seen.values())for(const stage of ['outbound','rest','return','afterglow'])assert.ok(stages.has(stage),stage);
 s.activeMs=0;assert.equal(JSON.stringify(s),raw);
});

test('approved patio upgrades increase temporary benefits without mutating saved health',()=>{
 let s=setup();s.activeMs=routines.ROUTINE_PERIOD*.16;const base=L.staffView(s).find(p=>p.id==='NPC-01'),original=s.staff['NPC-01'].health;s.budget=100000;s=M.purchase(s,M.quote(s,'restauracao','banco')).state;s.activeMs=routines.ROUTINE_PERIOD*.16;
 const improved=L.staffView(s).find(p=>p.id==='NPC-01');assert.ok(improved.temporaryBonus>base.temporaryBonus);assert.equal(s.staff['NPC-01'].health,original);assert.ok(improved.health<=100);const once=JSON.stringify(s);L.staffView(s);L.staffView(s);assert.equal(JSON.stringify(s),once);s.activeMs=RULES.weekMs*.995;assert.equal(L.staffView(s).find(p=>p.id==='NPC-01').temporaryBonus,0);
});
test('all departments have complete routes through connected aisles in both layouts',()=>{
 const g={};vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),{window:g,Math,Set});
 const w={};vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window:w,Math,Set});
 for(const tall of [false,true]){const defs=SECTORS.map((s,i)=>({key:s.id,bx:tall?0:i%2*14,by:tall?i*10:Math.floor(i/2)*10})),nav=w.PilhaIso.navigation;
 for(const home of SECTORS.slice(0,3))for(const space of ['patio','bosque','biblioteca','auditorio','meditacao']){const path=g.PilhaNpcRoutes.route(defs,nav.aisle,nav.connections(defs),home.id,space);assert.ok(path.length>3,home.id+' '+space);for(let i=1;i<path.length;i++)assert.ok(Math.abs(path[i].x-path[i-1].x)<.001||Math.abs(path[i].y-path[i-1].y)<.001,'no diagonal through furniture');const a=g.PilhaNpcRoutes.sample(path,0),b=g.PilhaNpcRoutes.sample(path,1);assert.notDeepEqual(a,b);}
 }
});

test('real routine renderer keeps16 finite selectable identities through a complete trip and manual pause',()=>{
 const {iso,tick}=engine(),s=setup();iso.setRoutineClock(s,L.routines(s));let before=iso.getEmployees();
 for(let t=16;t<routines.ROUTINE_PERIOD*2;t+=200){tick(t);const people=iso.getEmployees();assert.equal(people.length,16);assert.equal(new Set(people.map(p=>p.id)).size,16);assert.ok(people.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.screen.x)&&Number.isFinite(p.screen.y)));}
 assert.notEqual(JSON.stringify(iso.getEmployees()),JSON.stringify(before));s.paused=true;iso.setRoutineClock(s,L.routines(s));iso.setManualPause(true);const frozen=JSON.stringify(iso.getEmployees());tick(999999);assert.equal(JSON.stringify(iso.getEmployees()),frozen);
});

test('pause companions use distinct standing positions rather than overlapping portraits',()=>{
 const g={};vm.runInNewContext(fs.readFileSync(new URL('../ui/npc-route-navigation.js',import.meta.url),'utf8'),{window:g,Math,Set});const w={};vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window:w,Math,Set});const defs=SECTORS.map((s,i)=>({key:s.id,bx:i%2*14,by:Math.floor(i/2)*10})),nav=w.PilhaIso.navigation;
 const paths=['NPC-11','NPC-12'].map(id=>g.PilhaNpcRoutes.route(defs,nav.aisle,nav.connections(defs),'producao','patio',id));assert.notDeepEqual(paths[0].at(-1),paths[1].at(-1));
});

test('temporary restoration programs stop influencing routines when their purchased term expires',()=>{
 let s=setup();s.budget=100000;s=M.purchase(s,M.quote(s,'restauracao','intervalo')).state;const active=routines.restResources(s);assert.ok(active.environment>1);assert.ok(active.spaces.includes('bosque'));s.week+=8;const expired=routines.restResources(s);assert.equal(expired.environment,1);assert.ok(!expired.spaces.includes('bosque'));L.validateLiving(s);
});

test('below55 health slows transit by40percent without removing daily clock or pause coverage',()=>{
 assert.equal(routines.walkingFactor(54.99),.6);assert.equal(routines.walkingFactor(55),1);assert.equal(routines.walkingFactor(100),1);
 const fast=routines.routinePhase(routines.ROUTINE_PERIOD*.04,0,16,55),slow=routines.routinePhase(routines.ROUTINE_PERIOD*.04,0,16,54);
 near(slow.progress,fast.progress*.6);assert.ok(slow.outEnd>fast.outEnd);assert.ok(slow.tripEnd>fast.tripEnd);
 const s=setup();for(const p of Object.values(s.staff))p.health=40;for(let t=0;t<routines.ROUTINE_PERIOD;t+=100){s.activeMs=t;assert.ok(L.attendance(s).filter(p=>p.inRestArea).length<=6);assert.ok(L.routines(s).every(r=>r.speed===.6));}
});

test('legacy public save at week658 with empty cash and no productive employees receives next750 investment',()=>{
 const old=M.fresh();old.week=658;old.budget=0;old.team={principal:'PILHA-H02',support:'PILHA-H05'};L.ensureLiving(old);for(const p of Object.values(old.staff))p.employment='resigned';const initial=JSON.stringify(old),next=L.advanceRunning(old).state;
 assert.equal(JSON.stringify(old),initial);assert.equal(next.week,659);assert.equal(next.budget,750);assert.equal(next.weeklyIncome.lastPayment.amount,750);assert.equal(next.finance.ledger.at(-1).revenue,0);const once=JSON.stringify(next);income.grantWeeklyIncome(next);assert.equal(JSON.stringify(next),once);L.validateLiving(next);
});
