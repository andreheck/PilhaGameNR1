import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildHeroGalleryData,heroHistory} from '../ui/hero-gallery-data.js';
import {HERO_ROSTER} from '../hero-roster.js';
import {HERO_SHEETS} from '../ui/hero-sheets.js';
import {BUDGET_KEY,initialInvestmentState} from '../simulation/investment.js';
import {applyXpRewards,buyHeroLevel} from '../simulation/hero-progression.js';
import {saveHeroTeam} from '../simulation/hero-team.js';
const store=()=>{const map=new Map();return {map,getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};};
test('galeria usa seis identidades canônicas e os seis retratos aprovados',()=>{
 const s=store(),d=buildHeroGalleryData(s);assert.equal(d.SAMPLE,false);assert.equal(d.LIST.length,6);
 assert.deepEqual(d.LIST.map(h=>[h.id,h.nome]),HERO_ROSTER.map(h=>[h.id,h.name]));
 assert.equal(new Set(d.LIST.map(h=>h.img)).size,6);
 for(const h of d.LIST){assert.ok(fs.existsSync(new URL('..'+h.img,import.meta.url)));assert.equal(h.nivel,1);assert.equal(h.xp,0);assert.equal(h.pontos,0);assert.equal(h.trainingXp,0);assert.equal(h.energia,0);}
 assert.equal(s.map.size,0,'consultar galeria não cria outro armazenamento');
});
test('fichas geradas reproduzem a documentação e identificam apenas habilidades existentes no motor',async()=>{
 const before=fs.readFileSync(new URL('../ui/hero-sheets.js',import.meta.url),'utf8');const {heroSheetSource}=await import('../tools/build-hero-sheets.mjs');assert.equal(heroSheetSource().replace(/\r\n/g,'\n'),before.replace(/\r\n/g,'\n'));assert.equal(fs.readFileSync(new URL('../ui/hero-sheets.js',import.meta.url),'utf8'),before);
 const heroes=buildHeroGalleryData(store()).LIST;for(const h of heroes){const source=HERO_SHEETS.find(x=>x.id===h.id);assert.equal(h.skills.length,4);assert.equal(h.attributes.length,6);assert.equal(h.especializacao,source.specialization);assert.equal(h.habilidade,source.purpose);assert.ok(h.source.includes(source.source));}
 assert.deepEqual(heroes.flatMap(h=>h.skills.filter(a=>a.runtime).map(a=>[h.id,a.name])),[['PILHA-H01','Visão Sistêmica'],['PILHA-H01','Reorganização Estratégica']]);
 assert.equal(heroes[4].frase,'Arquiteto da Transformação');
});
test('níveis, XP, formação e histórico refletem o mesmo saldo persistido sem nova recompensa',()=>{
 const s=store(),id='PILHA-H02',earned=applyXpRewards(initialInvestmentState(),[{heroId:id,eventId:'xp1:01:step0:'+id}],123);assert.equal(earned.ok,true);
 const trained=buyHeroLevel(earned.state,id,1,124);assert.equal(trained.ok,true);s.setItem(BUDGET_KEY,JSON.stringify(trained.state));saveHeroTeam(s,'01',{principal:'PILHA-H01',support:id});
 const before=JSON.stringify([...s.map]),h=buildHeroGalleryData(s).LIST[1];assert.equal(h.nivel,2);assert.equal(h.pontos,25);assert.equal(h.trainingXp,75);assert.equal(h.xp,0);assert.ok(h.conquistas.every(c=>c.ok));
 assert.deepEqual(heroHistory(s,id),{available:true,earnedXp:25,trainingXp:75,entries:[{caseId:'01',label:'Situação 1',xp:25,at:123}]});
 assert.equal(JSON.stringify([...s.map]),before,'consulta não altera orçamento nem progresso');
});
test('leitura inválida preserva o registro original e informa indisponibilidade',()=>{
 const s=store();s.setItem(BUDGET_KEY,'{invalid');const d=buildHeroGalleryData(s);assert.ok(d.LIST.every(h=>h.nivel===null&&h.progressAvailable===false));assert.deepEqual(heroHistory(s,'PILHA-H01'),{available:false,entries:[]});assert.equal(s.getItem(BUDGET_KEY),'{invalid');
});
test('novos controles conservam dupla canônica, bloqueio por ciclo e falha de persistência explícita',()=>{
 const ui=fs.readFileSync(new URL('../hero-team-ui.js',import.meta.url),'utf8'),renderer=fs.readFileSync(new URL('../ui/claude/herois/pilha-herois.js',import.meta.url),'utf8');
 assert.match(ui,/persist:false/);assert.match(ui,/saveHeroTeam\(storage\(\),editingCase,draft\)/);assert.match(ui,/readTimeline\(storage\(\)\).campaigns\[editingCase\]/);assert.match(ui,/storage-unavailable/);assert.match(renderer,/o.readOnly \|\| duplicate/);
 const icons=fs.readFileSync(new URL('../ui/claude/herois/pilha-herois-dados.js',import.meta.url),'utf8');assert.doesNotMatch(icons,/SAMPLE|LIST|1240|2050/);
});
