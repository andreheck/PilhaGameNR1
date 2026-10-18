import assert from 'node:assert/strict';
import test from 'node:test';
import {INITIAL_BUDGET,BUDGET_KEY,DOMAINS,UPGRADES,initialInvestmentState,applyUpgrade,advanceInvestmentDay,forecastUpgrades,readInvestmentState,persistInvestmentState} from '../simulation/investment.js';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('cada nova sessão começa com 10000 créditos e persiste no localStorage',()=>{
 const map=new Map();const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const state=readInvestmentState(storage);
 assert.equal(state.budget,10000);assert.equal(state.spent,0);
 assert.equal(JSON.parse(map.get(BUDGET_KEY)).budget,INITIAL_BUDGET);
});
test('compra reduz saldo, guarda histórico e agenda previsão em 30 dias',()=>{
 let s=initialInvestmentState();s=applyUpgrade(s,'pausas',123);
 assert.equal(s.budget,8800);assert.equal(s.spent,1200);assert.deepEqual(s.upgrades,['pausas']);
 assert.equal(s.history[0].forecastDay,30);assert.equal(s.history[0].appliedAt,123);
 assert.equal(s.history[0].effects.workload,-8);
});
test('não permite saldo negativo nem comprar a mesma melhoria duas vezes',()=>{
 let s=initialInvestmentState();s.budget=500;
 assert.equal(applyUpgrade(s,'espaco-seguro').error,'insufficient-budget');
 s=applyUpgrade(initialInvestmentState(),'escuta-segura');
 assert.equal(applyUpgrade(s,'escuta-segura').error,'already-installed');
 assert.ok(s.budget>=0);
});
test('previsões diferenciam instalada, disponível e sem orçamento',()=>{
 let s=initialInvestmentState();s.budget=2200;s=applyUpgrade(s,'escuta-segura');
 const f=forecastUpgrades(s);
 assert.equal(f.find(x=>x.id==='escuta-segura').forecastStatus,'scheduled');
 assert.equal(f.find(x=>x.id==='pausas').forecastStatus,'available');
 assert.equal(f.find(x=>x.id==='espaco-seguro').forecastStatus,'needs-budget');
});
test('hub contém aviso flutuante, tela de investimentos e feedback visual',()=>{
 const html=read('index.html'),play=read('play.js'),css=read('play.css'),world=read('world3d.js');
 assert.match(html,/welcome-alert/);assert.match(play,/Ver melhorias/);assert.match(play,/pilha-welcome-alert-v1/);
 assert.match(play,/10.000 créditos fictícios/);assert.match(play,/data-upgrade/);
 assert.match(css,/floating-alert/);assert.match(css,/investment-card/);
 assert.match(world,/function applyInvestmentUpgrade/);assert.match(world,/Melhoria instalada/);
});
console.log('Investment budget, forecasts, persistence and floating alerts: PASS');

test('catálogo cobre fatores psicossociais e riscos físicos do trabalho',()=>{
 const ids=new Set(DOMAINS.map(d=>d.id));
 for(const id of ['seguranca-psicologica','assedio-respeito','psicoeducacao','ergonomia','ambiente-fisico','espaco-confinamento','carga-ritmo','autonomia-papel','lideranca-justica','relacoes-conflitos','mudanca-inseguranca','apoio-recuperacao']) assert.ok(ids.has(id),id);
 assert.ok(UPGRADES.some(u=>u.domain==='assedio-respeito'));
 assert.ok(UPGRADES.some(u=>u.domain==='ambiente-fisico'));
 assert.ok(UPGRADES.some(u=>u.domain==='espaco-confinamento'));
 const play=read('play.js');assert.match(play,/INVESTIMENTOS POR FATOR PSICOSSOCIAL/);assert.match(play,/Segurança vem antes da compra/);
});

test('efeitos nos indicadores só amadurecem ao avançar o horizonte de 30 dias',()=>{
 let s=applyUpgrade(initialInvestmentState(),'pausas',123);
 assert.equal(s.day,0);assert.equal(s.indicators.workload,50);assert.equal(s.indicators.wellbeing,50);
 s=advanceInvestmentDay(s,30,456);
 assert.equal(s.day,30);assert.equal(s.indicators.workload,42);assert.equal(s.indicators.wellbeing,58);
 assert.equal(s.dayEvents.length,1);assert.equal(s.dayEvents[0].id,'pausas');
 const again=advanceInvestmentDay(s,30,789);assert.equal(again.day,60);assert.equal(again.dayEvents.length,0);
});
test('estado dos indicadores e eventos permanece persistido',()=>{
 const map=new Map();const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 let s=applyUpgrade(initialInvestmentState(),'pausas',123);s=advanceInvestmentDay(s,30,456);persistInvestmentState(storage,s);
 const restored=readInvestmentState(storage);assert.equal(restored.day,30);assert.equal(restored.indicators.workload,42);assert.equal(restored.dayEvents.length,1);
});
