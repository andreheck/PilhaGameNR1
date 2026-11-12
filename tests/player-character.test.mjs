import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HERO_ROSTER} from '../hero-roster.js';
import * as M from '../simulation/company-continuous.js';
import {ITEMS} from '../data/continuous/catalog.js';
import {activateSpecial,specialStatus} from '../simulation/hero-specials.js';
import {PLAYER_CHARACTER_KEY,legacyPlayerHero,readPlayerCharacter,savePlayerCharacter} from '../ui/player-entry-state.js';
import {PLAYER_EXPLORERS} from '../data/continuous/player-explorers.js';

function storage(){const data=new Map();return {getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,value),data};}

test('the player selects exactly one canonical character and the choice is one-time',()=>{
 const s=storage();assert.deepEqual(readPlayerCharacter(s),{ok:true,heroId:null});
 assert.equal(savePlayerCharacter(s,'PILHA-H03').ok,true);
 assert.deepEqual(readPlayerCharacter(s),{ok:true,heroId:'PILHA-H03'});
 assert.equal(s.data.size,1);assert.equal(s.data.has(PLAYER_CHARACTER_KEY),true);
 assert.equal(savePlayerCharacter(s,'NPC-07').ok,false);
 assert.deepEqual(readPlayerCharacter(s),{ok:true,heroId:'PILHA-H03'});
});

test('an existing hero pair can seed the new player choice without rewriting the pair save',()=>{
 const s=storage(),pairRaw=JSON.stringify({version:1,teams:{'01':{principal:'PILHA-H02',support:'PILHA-H06'}}});
 s.setItem('pilha-hero-teams-v1',pairRaw);const pairBefore=s.getItem('pilha-hero-teams-v1');
 assert.equal(legacyPlayerHero(s),'PILHA-H02');
 assert.equal(savePlayerCharacter(s,'PILHA-H02').ok,true);
 assert.equal(readPlayerCharacter(s).heroId,'PILHA-H02');assert.equal(s.getItem('pilha-hero-teams-v1'),pairBefore);
});

test('the selected character is stored in the campaign and cannot be replaced later',()=>{
 const selected=M.setPlayerCharacter(M.fresh(),'PILHA-H05');
 assert.equal(selected.ok,true);assert.equal(selected.state.playerCharacterId,'PILHA-H05');
 assert.equal(M.setPlayerCharacter(selected.state,'PILHA-H03').error,'player-character-locked');
 assert.equal(M.read({getItem:key=>key===M.KEY?JSON.stringify(selected.state):null}).state.playerCharacterId,'PILHA-H05');
});

test('the three animated explorer profiles can be saved without inventing canonical powers',()=>{
 const s=storage();for(const id of ['PILHA-H02','EXPLORER-ADVOGADO','EXPLORER-YOGA']){
  assert.equal(savePlayerCharacter(s,id).ok,true);assert.equal(readPlayerCharacter(s).heroId,id);
  const assigned=M.setPlayerCharacter(M.fresh(),id);assert.equal(assigned.ok,true);assert.equal(assigned.state.playerCharacterId,id);
 }
 assert.equal(PLAYER_EXPLORERS.length,3);assert.deepEqual(PLAYER_EXPLORERS.map(x=>x.castId),['psicologa','advogado','yoga']);
 assert.ok(PLAYER_EXPLORERS.every(x=>x.sprite.endsWith('-walk.png')&&x.frames>=8));
});

test('the selected explorer can activate their documented continuous power',()=>{
 let state=M.setPlayerCharacter(M.fresh(),'PILHA-H05').state;
 const improvement=ITEMS.find(item=>item.category==='Trabalho'&&!item.rest),quote=M.quote(state,'escritorio',improvement.id);
 state=M.purchase(state,quote).state;
 const power=activateSpecial(state,'PILHA-H05',[0]);
 assert.equal(power.ok,true);assert.equal(specialStatus(power.state,'PILHA-H05').ready,false);
 assert.equal(activateSpecial(power.state,'PILHA-H03',[0]).error,'special-not-selected');
});

test('the first-run catalog offers the three animated explorers with profiles and reduced-motion support',()=>{
 const js=fs.readFileSync(new URL('../ui/player-character-catalog.js',import.meta.url),'utf8');
 const css=fs.readFileSync(new URL('../ui/player-character-catalog.css',import.meta.url),'utf8');
 assert.equal(HERO_ROSTER.length,6);for(const h of HERO_ROSTER)assert.equal(h.availableInBeta,true);
 assert.equal(PLAYER_EXPLORERS.length,3);assert.match(js,/data-player-confirm/);assert.match(js,/PLAYER_EXPLORERS\.map/);assert.match(js,/h\.skills/);assert.match(js,/h\.frase/);assert.match(js,/cargo\.split/);
 assert.match(css,/\.player-hero-card:hover/);assert.match(css,/\.player-hero-card:focus-visible/);assert.match(css,/\.player-hero-art img,\.player-profile-art img\{height:100%\}/);assert.match(css,/prefers-reduced-motion:reduce/);
});

test('the selected explorer is wired into the existing map with accessible click-to-walk controls',()=>{
 const iso=fs.readFileSync(new URL('../ui/claude/pilha-iso.js',import.meta.url),'utf8');
 const map=fs.readFileSync(new URL('../ui/claude/pilha-mapa.js',import.meta.url),'utf8');
 const game=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 assert.match(iso,/setPlayerCharacter:function\(hero,onSector\)/);assert.match(iso,/routeWithin\(AISLE/);assert.match(iso,/stepPlayer\(dt\)/);assert.match(iso,/isPlayer:true/);
 assert.match(map,/data-player-control/);assert.match(map,/movePlayerToScreen\(p\.x,p\.y\)/);assert.match(map,/aria-pressed/);
 assert.match(game,/setPlayerCharacter\(\{id:heroMeta\.id,name:heroMeta\.nome,color:heroMeta\.cor/);assert.match(game,/sprite:x\.sprite,frames:x\.frames/);assert.match(iso,/playerSpriteImage/);assert.match(game,/Condição coletiva:/);
});
