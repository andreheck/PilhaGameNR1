import test from 'node:test';
import assert from 'node:assert/strict';
import {createHeroControl,selectControlledHero,switchControlledHero,isValidHeroPair} from '../simulation/hero-control.js';

const pair={principal:'PILHA-H01',support:'PILHA-H03'};

test('validates the existing canonical pair without changing it',()=>{
  assert.equal(isValidHeroPair(pair),true);
  assert.deepEqual(pair,{principal:'PILHA-H01',support:'PILHA-H03'});
  assert.equal(isValidHeroPair({principal:'PILHA-H01',support:'PILHA-H01'}),false);
  assert.equal(isValidHeroPair({principal:'PILHA-H01',support:'NPC-01'}),false);
});

test('defaults to principal manually controlled and support autonomous',()=>{
  const state=createHeroControl(pair);
  assert.deepEqual(state,{
    controlledHeroId:'PILHA-H01',
    autonomousHeroId:'PILHA-H03',
    controlledRole:'principal',
    autonomousRole:'support'
  });
  assert.equal(Object.isFrozen(state),true);
});

test('selecting support swaps manual and autonomous roles without mutating the saved pair',()=>{
  const before=createHeroControl(pair);
  const next=selectControlledHero(pair,before,'PILHA-H03');
  assert.equal(next.controlledHeroId,'PILHA-H03');
  assert.equal(next.autonomousHeroId,'PILHA-H01');
  assert.equal(next.controlledRole,'support');
  assert.equal(next.autonomousRole,'principal');
  assert.equal(before.controlledHeroId,'PILHA-H01');
  assert.deepEqual(pair,{principal:'PILHA-H01',support:'PILHA-H03'});
});

test('switching control is reversible and idempotent state derivation is deterministic',()=>{
  const initial=createHeroControl(pair);
  const switched=switchControlledHero(pair,initial);
  const restored=switchControlledHero(pair,switched);
  assert.deepEqual(restored,initial);
  assert.deepEqual(switchControlledHero(pair,initial),switched);
});

test('rejects invalid pairs, non-pair heroes and malformed control state',()=>{
  assert.throws(()=>createHeroControl({principal:'PILHA-H01',support:'PILHA-H01'}),/invalid-hero-pair/);
  assert.throws(()=>createHeroControl(pair,'PILHA-H02'),/hero-not-in-pair/);
  assert.throws(()=>selectControlledHero(pair,null,'PILHA-H04'),/hero-not-in-pair/);
  assert.throws(()=>switchControlledHero(pair,{controlledHeroId:'PILHA-H02'}),/invalid-control-state/);
});
