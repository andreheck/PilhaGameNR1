import test from 'node:test';
import assert from 'node:assert/strict';
import {SECTOR_CASES,mapSnapshot,purchaseMapUpgrade} from '../ui/sector-model.js';
import {BUDGET_KEY,initialInvestmentState} from '../simulation/investment.js';
import {transactEconomy,buyHeroLevel,readEconomy,heroProgress} from '../simulation/hero-progression.js';
import {createCampaign,registerPurchase,setCampaignRunning,advanceCampaign,realMsForDays} from '../simulation/mission-timeline.js';
import {HERO_CONCEPTS} from '../hero-concepts.js';
import {ABILITIES} from '../simulation/hero-abilities.js';
const pair={principal:'PILHA-H01',support:'PILHA-H02'};
function storage(){
 const map=new Map([[BUDGET_KEY,JSON.stringify(initialInvestmentState())],['pilha-case01-v2','legacy-progress'],['pilha-hero-teams-v1','existing-team'],['pilha-mapa-v1','unused-claude-save']]);
 return {map,getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
}
test('three visual sectors retain all five case IDs without duplicating them',()=>{
 assert.deepEqual(Object.values(SECTOR_CASES).flat().sort(),['01','02','03','04','05']);
});
test('P&D Tech has the four documented concepts without executable temporal effects',()=>{
 assert.deepEqual(HERO_CONCEPTS['PILHA-H05'].map(s=>s.name),['Visão de Sistemas','Laboratório de Transformação','Ecossistema de Inovação','Singularidade de Transformação']);
 assert.equal(ABILITIES.some(a=>a.heroId==='PILHA-H05'),false);
});
test('new psychologist sheet is conceptual and cannot be activated as a runtime ability',()=>{
 assert.deepEqual(HERO_CONCEPTS['PILHA-H02'].map(s=>s.name),['Radar Psicossocial','Escuta Estratégica','Confiança Coletiva','Reequilíbrio Organizacional']);
 assert.equal(ABILITIES.some(a=>a.heroId==='PILHA-H02'),false);
});
test('map purchases and formation use the same budget and preserve unrelated saves',async()=>{
 const st=storage();await transactEconomy(st,s=>buyHeroLevel(s,'PILHA-H01',1));
 assert.equal((await purchaseMapUpgrade(st,'ergonomia')).ok,true);
 const current=readEconomy(st).state;
 assert.equal(current.budget,7700);assert.equal(heroProgress(current,'PILHA-H01').level,2);
 assert.equal(mapSnapshot(st,null,'01').balance,7700);
 assert.equal(st.map.get('pilha-case01-v2'),'legacy-progress');
 assert.equal(st.map.get('pilha-hero-teams-v1'),'existing-team');
 assert.equal(st.map.get('pilha-mapa-v1'),'unused-claude-save');
});
test('repeated or concurrent map purchases charge a shared upgrade only once',async()=>{
 const st=storage();const results=await Promise.all([purchaseMapUpgrade(st,'escuta-segura'),purchaseMapUpgrade(st,'escuta-segura')]);
 assert.equal(results.filter(r=>r.ok).length,1);
 assert.equal(mapSnapshot(st,null,'01').balance,9100);
 assert.deepEqual(mapSnapshot(st,null,'04').owned,['escuta-segura']);
 assert.equal((await purchaseMapUpgrade(st,'not-real')).ok,false);
});
test('storage failure and malformed saves cannot confirm a map purchase or overwrite saves',async()=>{
 const st=storage(),before=st.map.get(BUDGET_KEY);st.setItem=()=>{throw Error('quota');};
 assert.equal((await purchaseMapUpgrade(st,'ergonomia')).ok,false);assert.equal(st.map.get(BUDGET_KEY),before);
 st.map.set(BUDGET_KEY,'broken');assert.equal((await purchaseMapUpgrade(st,'ergonomia')).ok,false);
 assert.equal(mapSnapshot(st,null,'01').storageAvailable,false);assert.equal(st.map.get(BUDGET_KEY),'broken');
});
test('installation changes inventory but never accelerates time or immediately increases axes',async()=>{
 const st=storage();let c=createCampaign('01',pair);const before=mapSnapshot(st,c,'01');
 await purchaseMapUpgrade(st,'ergonomia');c=registerPurchase(c,'ergonomia').campaign;
 const after=mapSnapshot(st,c,'01');assert.deepEqual(after.axes,before.axes);assert.equal(c.elapsedMs,0);assert.equal(after.owned.length,1);
 c=advanceCampaign(setCampaignRunning(c,true),realMsForDays(14));
 assert.ok(mapSnapshot(st,c,'01').axes.space>50);assert.equal(c.status,'running');
});
