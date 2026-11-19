import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DEPARTMENTS} from '../data/continuous/organization.js';
import {EMPLOYEES} from '../data/continuous/employees.js';
import {assessTeam,individualTeamTraits,randomInitialHiring} from '../simulation/team-synergy.js';
import {completeInitialHiring} from '../simulation/initial-hiring.js';
import * as M from '../simulation/company-continuous.js';
import * as L from '../simulation/company-living.js';

test('initial random hiring chooses three distinct managers by sector and three distinct employees',()=>{
 const result=randomInitialHiring(()=>0);assert.deepEqual(Object.keys(result.managers),DEPARTMENTS);assert.equal(Object.keys(result.managers).length,3);assert.equal(result.employees.length,3);
 const ids=[...Object.values(result.managers),...result.employees];assert.equal(new Set(ids).size,6);
 for(const sector of DEPARTMENTS)assert.equal(EMPLOYEES.find(p=>p.id===result.managers[sector])?.home,sector);
 const fresh=L.ensureLiving(M.fresh());fresh.initialHiring={version:1,status:'pending'};const complete=completeInitialHiring(fresh,result.managers,result.employees);assert.ok(complete.ok);assert.equal(L.staffingSummary(complete.state).active,6);
});

test('team synergy is deterministic, explained, and exposes exactly five named compositions',()=>{
 const production=assessTeam(['NPC-03','NPC-09','NPC-11','NPC-13','NPC-15','NPC-01']);
 const creativity=assessTeam(['NPC-02','NPC-04','NPC-08','NPC-14','NPC-16','NPC-03']);
 const steady=assessTeam(['NPC-05','NPC-06','NPC-07','NPC-10','NPC-12','NPC-16']);
 const trusted=assessTeam(['NPC-05','NPC-07','NPC-12','NPC-10','NPC-03','NPC-11']);
 const balanced=assessTeam(['NPC-01','NPC-02','NPC-04','NPC-09','NPC-13','NPC-15']);
 assert.equal(production.archetype,'Produção Acima de Tudo');assert.equal(creativity.archetype,'Máquina de Criatividade');assert.equal(steady.archetype,'Devagar e Sempre');assert.equal(trusted.archetype,'Laços que Entregam');assert.equal(balanced.archetype,'Equilíbrio em Ação');
 for(const team of [production,creativity,steady,trusted,balanced]){assert.ok(team.synergy>=0&&team.synergy<=100);assert.ok(team.illnessRisk>=0&&team.illnessRisk<=100);assert.equal(team.explanations.length,4);assert.ok(team.explanations.every(text=>text.length>8));}
 assert.notEqual(production.illnessRisk,steady.illnessRisk);
});

test('individual strengths and attention values use colored bands without changing health',()=>{
 for(const person of EMPLOYEES){const traits=individualTeamTraits(person.id);assert.equal(traits.length,3);assert.ok(traits.every(t=>['positive','balanced','negative'].includes(t.tone)&&t.value>=0&&t.value<=100));}
 const state=M.fresh(),before=JSON.stringify(state);assessTeam(['NPC-02','NPC-09','NPC-14']);assert.equal(JSON.stringify(state),before);
});

test('hiring screen provides live side score, random option, colored individual traits, and the simulation disclaimer',()=>{
 const ui=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 assert.match(ui,/data-hiring-random/);assert.match(ui,/assessTeam\(draftIds\)/);assert.match(ui,/individualTeamTraits\(p\.id\)/);assert.match(ui,/Chance simulada de afastamento por adoecimento/);assert.match(ui,/Não é previsão clínica/);
});
