import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';
import {GAME_MODES,GAME_MODE_BY_ID,DEFAULT_GAME_MODE} from '../data/continuous/game-modes.js';
import fs from 'node:fs';

class MemoryStorage{constructor(entries={}){this.data=new Map(Object.entries(entries));}getItem(key){return this.data.get(key)??null;}setItem(key,value){this.data.set(key,String(value));}}

test('three mode profiles define the work rooms and keep support spaces out of the room count',()=>{
 assert.deepEqual(GAME_MODES.map(mode=>mode.id),['home-office','cowork','office']);
 assert.equal(GAME_MODE_BY_ID['home-office'].functionalRooms,1);
 assert.equal(GAME_MODE_BY_ID.cowork.rooms.filter(room=>room.kind==='work').length,4);
 assert.equal(GAME_MODE_BY_ID.cowork.rooms.find(room=>room.id==='cowork-bathroom').staffed,false);
 assert.equal(GAME_MODE_BY_ID.office.rooms.length,10);
 assert.ok(GAME_MODE_BY_ID.office.rooms.every(room=>room.staffed));
});

test('new partidas save a single selectable mode and lock it once the game starts',()=>{
 const storage=new MemoryStorage();let state=M.fresh();
 assert.equal(state.gameMode,null);
 const selected=M.setGameMode(state,'cowork');assert.equal(selected.ok,true);state=selected.state;
 storage.setItem(M.KEY,JSON.stringify(state));assert.equal(M.read(storage).state.gameMode,'cowork');
 assert.equal(M.setGameMode(state,'office').error,'game-mode-locked');
 state=M.setPlayerCharacter(state,'PILHA-H05').state;
 assert.equal(M.setGameMode(state,'cowork').error,'game-mode-locked');
 assert.equal(M.setGameMode(M.fresh(),'not-a-mode').error,'invalid-game-mode');
});

test('legacy saves without a mode migrate to the existing office flow without losing progress',()=>{
 const old=M.fresh();delete old.gameMode;old.budget=3480;old.week=7;old.receipts=[{sid:'escritorio',id:'ergo',level:1,at:2,bonus:0,cost:1800}];
 const storage=new MemoryStorage({[M.KEY]:JSON.stringify(old)}),result=M.read(storage);
 assert.equal(result.ok,true);assert.equal(result.state.gameMode,DEFAULT_GAME_MODE);assert.equal(result.state.budget,3480);assert.equal(result.state.week,7);assert.equal(result.state.receipts.length,1);
});

test('mode selector is wired into first entry, exposed in the HUD, and has keyboard/reduced-motion support',()=>{
 const source=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 assert.match(source,/chooseGameMode\(\)/);assert.match(source,/M\.setGameMode\(s,modeId\)/);assert.match(source,/dataset\.gameMode/);assert.match(source,/GAME_MODE_BY_ID\[state\.gameMode/);
 const ui=fs.readFileSync(new URL('../ui/game-mode-selection.js',import.meta.url),'utf8');
 assert.match(ui,/role="radiogroup"/);assert.match(ui,/ArrowRight/);assert.match(ui,/aria-live="polite"/);assert.match(ui,/modo-home-office-isometrico\.png/);
 const css=fs.readFileSync(new URL('../ui/game-modes.css',import.meta.url),'utf8');
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/@media\(max-width:760px\)/);
 const build=fs.readFileSync(new URL('../tools/build-continuous.mjs',import.meta.url),'utf8');assert.match(build,/ui\/game-modes\.css/);
});
