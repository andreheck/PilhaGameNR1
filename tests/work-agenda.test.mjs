import test from 'node:test';
import assert from 'node:assert/strict';
import {workActivity} from '../simulation/work-agenda.js';

test('postos de computador têm entrada, período sentado e saída antes da ronda',()=>{
 assert.deepEqual(workActivity(.08,{sector:'escritorio',hasWorkstation:true}),{activity:'to-workstation',moving:true,sit:false,carrying:null,route:.5});
 assert.equal(workActivity(.4,{sector:'atendimento',hasWorkstation:true}).activity,'computer');
 assert.equal(workActivity(.4,{sector:'atendimento',hasWorkstation:true}).sit,true);
 assert.equal(workActivity(.7,{sector:'escritorio',hasWorkstation:true}).activity,'from-workstation');
 assert.equal(workActivity(.9,{sector:'escritorio',hasWorkstation:true}).carrying,'folder');
});

test('tarefas de operação carregam caixas sem alterar a agenda de descanso',()=>{
 assert.equal(workActivity(.02,{sector:'producao'}).activity,'handling');
 const carrying=workActivity(.4,{sector:'producao'});
 assert.equal(carrying.activity,'moving-material');assert.equal(carrying.carrying,'box');assert.equal(carrying.moving,true);
 assert.equal(workActivity(.9,{sector:'producao'}).activity,'handling');
});

test('progresso fora dos limites é limitado e setores administrativos usam pastas',()=>{
 assert.equal(workActivity(-1,{sector:'atendimento'}).route,0);
 assert.equal(workActivity(2,{sector:'escritorio'}).carrying,null);
 assert.equal(workActivity(.4,{sector:'atendimento'}).carrying,'folder');
});

import {workTask} from '../simulation/work-agenda.js';
test('coleta e colocação progridem junto ao móvel antes e depois do transporte',()=>{const stages=Array.from({length:1001},(_,i)=>workTask(i/1000,{sector:'producao',speed:.85}));const pickup=stages.filter(x=>x.interaction==='pickup'),place=stages.filter(x=>x.interaction==='place');assert.ok(pickup.length>0&&place.length>0);for(const rows of [pickup,place]){assert.ok(rows.every(x=>x.handlingProgress>=0&&x.handlingProgress<=1&&!x.moving&&x.carrying==='box'));assert.ok(rows.at(-1).handlingProgress>rows[0].handlingProgress);}assert.ok(stages.some(x=>x.moving&&x.carrying==='box'));assert.equal(pickup[0].to,'source');assert.equal(place[0].to,'destination');});
