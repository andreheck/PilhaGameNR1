import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {HERO_ROSTER} from '../hero-roster.js';
import {HERO_TEAM_KEY,validateHeroPair,normalizeHeroTeams,readHeroTeams,saveHeroTeam,getHeroTeam} from '../simulation/hero-team.js';
const pair={principal:'PILHA-H01',support:'PILHA-H04'};
function fixture(){const map=new Map([['pilha-investment-v1','untouched-budget'],['pilha-case01-v2','untouched-progress']]);return {map,getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('seis heróis da PR22, todos disponíveis, sem bônus numéricos inventados',()=>{
 assert.equal(HERO_ROSTER.length,6);assert.equal(new Set(HERO_ROSTER.map(h=>h.id)).size,6);assert.ok(HERO_ROSTER.every(h=>h.availableInBeta));
 assert.deepEqual(HERO_ROSTER.map(h=>h.name),['Diretor','Psicóloga','Dados & IA','Eng. de Segurança','P&D Tech','RS & TD']);
 assert.equal(HERO_ROSTER[0].rarity,'Épico');assert.ok(HERO_ROSTER.slice(1).every(h=>h.rarity==='A definir'));
 assert.ok(HERO_ROSTER.every(h=>!('bonus' in h)&&!('score' in h)));
});
test('dupla exige duas identidades diferentes e um Caso 01–05',()=>{
 assert.equal(validateHeroPair('01',pair),null);
 assert.equal(validateHeroPair('017',pair),'invalid-case');
 assert.equal(validateHeroPair('01',{principal:'PILHA-H01'}),'incomplete-pair');
 assert.equal(validateHeroPair('01',{principal:'PILHA-H01',support:'PILHA-H01'}),'duplicate-hero');
 assert.equal(validateHeroPair('01',{principal:'other',support:'PILHA-H01'}),'unknown-hero');
});
test('salva/restaura uma dupla por caso, sem tocar orçamento ou progresso',()=>{
 const store=fixture();assert.deepEqual(readHeroTeams(store),{version:1,teams:{}});
 assert.equal(saveHeroTeam(store,'01',pair,123).ok,true);
 assert.equal(saveHeroTeam(store,'02',{principal:pair.support,support:pair.principal},124).ok,true);
 assert.deepEqual(getHeroTeam(store,'01'),{...pair,updatedAt:123});
 assert.equal(getHeroTeam(store,'02').principal,pair.support);assert.equal(getHeroTeam(store,'03'),null);
 assert.equal(store.map.get('pilha-investment-v1'),'untouched-budget');assert.equal(store.map.get('pilha-case01-v2'),'untouched-progress');
 assert.equal(store.map.size,3);
});
test('seleção inválida não destrói uma dupla anterior',()=>{
 const store=fixture();saveHeroTeam(store,'01',pair,123);const before=store.map.get(HERO_TEAM_KEY);
 assert.equal(saveHeroTeam(store,'01',{principal:pair.principal,support:pair.principal}).ok,false);
 assert.equal(store.map.get(HERO_TEAM_KEY),before);
});
test('estado ausente, corrompido, excessivo, legado e registros inválidos são seguros',()=>{
 const store=fixture();for(const text of ['null','{notJSON','[]','{"version":0}','x'.repeat(20001)]){store.map.set(HERO_TEAM_KEY,text);assert.deepEqual(readHeroTeams(store),{version:1,teams:{}});assert.equal(store.map.get(HERO_TEAM_KEY),text);}
 const sanitized=normalizeHeroTeams({version:1,teams:{'01':pair,'02':{principal:'PILHA-H01',support:'PILHA-H01'},'017':pair}});
 assert.deepEqual(Object.keys(sanitized.teams),['01']);
});
test('armazenamento bloqueado não declara sucesso falso',()=>{
 const fail={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(getHeroTeam(fail,'01'),null);assert.deepEqual(saveHeroTeam(fail,'01',pair),{ok:false,error:'storage-unavailable'});
 assert.deepEqual(saveHeroTeam(null,'01',pair),{ok:false,error:'storage-unavailable'});
});
test('proteção Manus cobre lista vazia e ausência de clipe compatível',()=>{
 const code=fs.readFileSync(new URL('../world3d.js',import.meta.url),'utf8');
 const start=code.indexOf(' function animate('),end=code.indexOf(' return {project,',start);assert.ok(start>0&&end>start);
 for(const clips of [null,[],[{name:'falling_down'}]]){
  const ctx={actors:[{key:'gestor',mixer:{clipAction(){throw Error('undefined clip should not be played')}},clips}],focusedActor:null,setEmotion(){}};
  vm.createContext(ctx);vm.runInContext(code.slice(start,end),ctx);assert.equal(vm.runInContext("animate('gestor','talk')",ctx),false);
 }
});
