import assert from 'node:assert/strict';
import test from 'node:test';
import {INITIAL_BUDGET,BUDGET_KEY,UPGRADES,initialInvestmentState,applyUpgrade,forecastUpgrades,readInvestmentState,persistInvestmentState} from '../simulation/investment.js';
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
 assert.equal(applyUpgrade(s,'dimensionamento').error,'insufficient-budget');
 s=applyUpgrade(initialInvestmentState(),'escuta');
 assert.equal(applyUpgrade(s,'escuta').error,'already-installed');
 assert.ok(s.budget>=0);
});
test('previsões diferenciam instalada, disponível e sem orçamento',()=>{
 let s=initialInvestmentState();s.budget=1000;s=applyUpgrade(s,'escuta');
 const f=forecastUpgrades(s);
 assert.equal(f.find(x=>x.id==='escuta').forecastStatus,'scheduled');
 assert.equal(f.find(x=>x.id==='pausas').forecastStatus,'available');
 assert.equal(f.find(x=>x.id==='dimensionamento').forecastStatus,'needs-budget');
});
test('hub contém aviso flutuante, tela de investimentos e feedback visual',()=>{
 const html=read('index.html'),play=read('play.js'),css=read('play.css'),world=read('world3d.js');
 assert.match(html,/welcome-alert/);assert.match(play,/Ver melhorias/);assert.match(play,/pilha-welcome-alert-v1/);
 assert.match(play,/10.000 créditos fictícios/);assert.match(play,/data-upgrade/);
 assert.match(css,/floating-alert/);assert.match(css,/investment-card/);
 assert.match(world,/function applyInvestmentUpgrade/);assert.match(world,/Melhoria instalada/);
});
console.log('Investment budget, forecasts, persistence and floating alerts: PASS');
