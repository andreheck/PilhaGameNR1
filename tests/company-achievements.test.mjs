import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';
import {SECTORS,FACTORS} from '../data/continuous/catalog.js';import {EVENT_CATALOG} from '../simulation/event-catalog.js';
import {achievementProgress,recognizeAchievements,pt22Active} from '../simulation/company-achievements.js';
import {companyMessages,readPhone,PHONE_KEY} from '../simulation/company-messages.js';import {historicalSeg} from './fixtures/legacy-seg.mjs';
function healthy(){let s=L.ensureLiving(M.fresh());s.budget=1000000;for(const sec of SECTORS.filter(s=>!s.rest))for(const id of ['asse','psic','jorn','rela','lide'])s=M.purchase(s,M.quote(s,sec.id,id)).state;s.week=4;for(const p of Object.values(s.staff)){p.health=80;p.previous=80;p.week=4;}for(const sec of SECTORS.filter(s=>!s.rest))for(const f of FACTORS)s.eventEffects.push({sid:sec.id,factor:f.id,delta:100,at:s.week});return s;}
test('security classification cannot be purchased, including a stale quote; old receipts keep effects and history',()=>{
 const s=M.fresh(),before=JSON.stringify(s),q=M.quote(s,'escritorio','seg');assert.equal(q.error,'achievement-only');assert.equal(M.purchase(s,{sid:'escritorio',id:'seg',level:1,cost:900,revision:0}).error,'achievement-only');assert.equal(JSON.stringify(s),before);
 const old=historicalSeg(s);delete old.receipts[0].lifecycle;old.week=3;M.validate(old);assert.equal(M.values(old,'escritorio').seg,51.2);assert.equal(old.receipts.length,1);assert.equal(achievementProgress(old).currentPT22.length,0,'an old purchase is not a certificate');
});
test('ten goals are read only and sector75 uses people health, independently of the environmental index',()=>{
 const s=healthy(),before=JSON.stringify(s),p=achievementProgress(s);assert.equal(p.rows.length,10);assert.equal(new Set(p.rows.map(r=>r.id)).size,10);assert.equal(p.rows.find(r=>r.id==='sector75').met,true);for(const a of Object.values(s.staff))a.health=60;assert.equal(achievementProgress(s).rows.find(r=>r.id==='sector75').met,false);assert.ok(achievementProgress(s).sectors.every(x=>x.index===100));for(const a of Object.values(s.staff))a.health=80;assert.equal(JSON.stringify(s),before);companyMessages(s);assert.equal(JSON.stringify(s),before);
});
test('PT22 needs combined conditions and two distinct weeks, persists its trophy and loses active status when conditions fall',()=>{
 const s=healthy(),before=JSON.stringify(s);let n=recognizeAchievements(s);assert.equal(n.achievements.streaks.escritorio.count,1);for(let i=0;i<20;i++)n=recognizeAchievements(n);assert.equal(n.achievements.streaks.escritorio.count,1);assert.equal(pt22Active(n,'escritorio'),false);assert.equal(JSON.stringify(s),before);
 n.week++;n=recognizeAchievements(n);assert.equal(pt22Active(n,'escritorio'),true);assert.equal(n.achievements.unlocked.pt22.week,5);const budget=n.budget,receipts=JSON.stringify(n.receipts),staff=JSON.stringify(n.staff);M.validate(n);n=recognizeAchievements(n);assert.equal(n.budget,budget);assert.equal(JSON.stringify(n.receipts),receipts);assert.equal(JSON.stringify(n.staff),staff);
 n.eventEffects.push({sid:'escritorio',factor:'carga',delta:-10000,at:n.week});n=recognizeAchievements(n);assert.equal(pt22Active(n,'escritorio'),false);assert.ok(n.achievements.unlocked.pt22);assert.equal(n.achievements.currentPT22.includes('escritorio'),false);
});
test('missed observation weeks cannot fabricate consecutive progress; coverage and practices are mandatory',()=>{
 let s=recognizeAchievements(healthy());s.week+=3;s=recognizeAchievements(s);assert.equal(s.achievements.streaks.escritorio.count,1);s.staff['NPC-01'].employment='leave';s=recognizeAchievements(s);assert.equal(s.achievements.streaks.escritorio.count,0);const clean=healthy();clean.receipts=clean.receipts.filter(r=>r.id!=='psic');assert.equal(achievementProgress(clean).criteria.escritorio.find(c=>c.id==='programme-psic').met,false);
});
test('PT22 is recognition and never adds an undocumented event, health or cash bonus',()=>{
 let s=recognizeAchievements(healthy());s.week++;s=recognizeAchievements(s);const without=JSON.parse(JSON.stringify(s));delete without.achievements;const a=M.startEvent(s,'quase','escritorio',{preview:true}),b=M.startEvent(without,'quase','escritorio',{preview:true});assert.ok(a.ok&&b.ok);assert.deepEqual(a.state.eventEffects,b.state.eventEffects);assert.equal(a.state.budget,b.state.budget);assert.deepEqual(a.state.receipts,b.state.receipts);
});
test('achievement records survive reload, do not reset corrupt saves, and read preferences cannot alter game data',async()=>{
 const s=healthy(),map=new Map([[M.KEY,JSON.stringify(s)]]),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};const r=await M.transact(storage,x=>({ok:true,state:x}));assert.ok(r.ok);assert.ok(M.read(storage).state.achievements.unlocked.sector75);const raw=JSON.stringify({...r.state,achievements:{...r.state.achievements,unlocked:7}});map.set(M.KEY,raw);assert.equal(M.read(storage).ok,false);assert.equal(map.get(M.KEY),raw);assert.deepEqual(readPhone({getItem:()=>'{'}),{read:[],notices:[],sound:true});assert.equal(map.get(M.KEY),raw);
});
test('messages have stable identities and phone preferences read only their own bounded storage',()=>{
 const s=healthy();s.weeklyIncome.lastPayment={week:4,amount:500};const before=JSON.stringify(s),a=companyMessages(s),b=companyMessages(s);assert.deepEqual(a,b);assert.equal(a.filter(m=>m.id==='payment:4').length,1);assert.equal(JSON.stringify(s),before);
 const keys=[],prefs=readPhone({getItem:key=>{keys.push(key);return JSON.stringify({read:['payment:4'],notices:[{id:'n',title:'Mensagem',text:'Texto',week:4,target:'bad-target'}]});}});assert.deepEqual(keys,[PHONE_KEY]);assert.equal(prefs.notices[0].target,'messages');assert.equal(prefs.read[0],'payment:4');assert.equal(JSON.stringify(s),before);
});
