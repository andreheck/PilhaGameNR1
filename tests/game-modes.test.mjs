import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../simulation/company-continuous.js';
import {GAME_MODES,GAME_MODE_BY_ID,DEFAULT_GAME_MODE} from '../data/continuous/game-modes.js';
import fs from 'node:fs';

class MemoryStorage{constructor(entries={}){this.data=new Map(Object.entries(entries));}getItem(key){return this.data.get(key)??null;}setItem(key,value){this.data.set(key,String(value));}}

test('three mode profiles define the work rooms and keep support spaces out of the room count',()=>{
 assert.deepEqual(GAME_MODES.map(mode=>mode.id),['home-office','cowork','office']);
 assert.equal(GAME_MODE_BY_ID['home-office'].functionalRooms,1);
 assert.equal(GAME_MODE_BY_ID['home-office'].rooms.length,1);
 assert.equal(GAME_MODE_BY_ID['home-office'].rooms[0].staffing,'Explorador · 1 posto');
 assert.equal(GAME_MODE_BY_ID['home-office'].mapLayout,'home-office');
 assert.equal(GAME_MODE_BY_ID.cowork.rooms.filter(room=>room.kind==='work').length,4);
 assert.equal(GAME_MODE_BY_ID.cowork.mapLayout,'cowork');
 assert.equal(GAME_MODE_BY_ID.cowork.rooms.find(room=>room.id==='cowork-bathroom').staffed,false);
 assert.equal(GAME_MODE_BY_ID.office.rooms.length,10);
 assert.equal(GAME_MODE_BY_ID.office.mapLayout,'office');
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

test('the saved mode selects a compact, shared, or advanced map footprint without changing sector environments',()=>{
 const source=fs.readFileSync(new URL('../ui/claude/pilha-mapa.js',import.meta.url),'utf8');
 assert.match(source,/o\.mapLayout === "home-office"\) return \[\{ key: "escritorio", name: "Quarto · home office"/);
 assert.match(source,/SECTORS\.filter\(function \(s\) \{ return o\.mapLayout !== "home-office" \|\| s\.id === "escritorio"; \}\)/);
 assert.match(source,/o\.mapLayout === "home-office" \? 0 : sel/);
 assert.match(source,/cowork:\s*\{\s*escritorio:\s*\[0,\s*0\],\s*producao:\s*\[15,\s*0\],\s*atendimento:\s*\[0,\s*11\],\s*restauracao:\s*\[15,\s*11\]/);
 assert.match(source,/office:\s*\{\s*escritorio:\s*\[0,\s*0\],\s*producao:\s*\[18,\s*0\],\s*atendimento:\s*\[0,\s*14\],\s*restauracao:\s*\[18,\s*14\]/);
 assert.match(source,/var L = LAYOUTS\[o\.mapLayout\] \|\| LAYOUTS\.office/);
 const game=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 assert.match(game,/PilhaMapa\.mount\(\{container:app,mapLayout:mode\.mapLayout/);
 assert.match(game,/const remote=state\.gameMode==='home-office'/);
 const iso=fs.readFileSync(new URL('../ui/claude/pilha-iso.js',import.meta.url),'utf8');
 assert.match(iso,/if\(e\.homeOffice\)/);assert.match(iso,/visibleVisitors\.filter\(function\(p\)\{return p\.isPlayer;\}\)/);
 assert.match(iso,/it\.installed&&!it\.annex&&!it\.visualProgram/);assert.match(iso,/it\.t===\"chair\"&&it\.z===0&&!firstChair/);assert.doesNotMatch(iso,/it\.visualId\|\|it\.visualAsset\)return true/);
 assert.match(game,/function currentCollectiveSummary\(\).*name:'Casa'/);assert.match(game,/state\.gameMode==='home-office'\?\[\{key:'escritorio',bx:0,by:0,width:12,depth:8\}\]/);assert.match(game,/Seu espaço de trabalho em casa é a base da partida/);
 assert.match(source,/Mapa isométrico do espaço de trabalho em casa; somente o personagem explorador aparece no cômodo/);
 const phone=fs.readFileSync(new URL('../ui/company-phone.js',import.meta.url),'utf8');
 assert.match(phone,/a\[0\]!=='team'/);assert.match(phone,/colleagues\[3\]/);assert.match(phone,/data-phone-team-reply/);
 assert.match(game,/mode\.name\.toUpperCase\(\)\+' · SEMANA '/);
});

test('home office onboarding explains the remote team and keeps hiring labels remote',()=>{
 const entry=fs.readFileSync(new URL('../ui/living-entry.js',import.meta.url),'utf8');
 assert.match(entry,/if\(gameMode==='home-office'\)/);
 assert.match(entry,/um gerente online e quatro colegas/);
 assert.match(entry,/app Equipe no celular/);
 assert.doesNotMatch(entry,/R\$ 250,00 por herói épico/);
 const game=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 assert.match(game,/role:'Gerente online',remote:true/);
 assert.match(game,/role:'Colega',remote:true/);
 assert.match(game,/remote\?'Equipe remota'/);
 assert.match(game,/Contrate quatro colegas\. O gerente e os colegas aparecem no Celular, nunca no cômodo do explorador\./);
});

test('new mode selection reveals the lightweight static world before hero selection',()=>{
 const source=fs.readFileSync(new URL('../ui/continuous-game.js',import.meta.url),'utf8');
 assert.match(source,/await showWorldReveal\(modeId\)/);
 assert.match(source,/function openCityEntry\(\)\{if\(!load\(\)\)return;void startExperience\(\);\}/);
 assert.doesNotMatch(source,/await showWorldReveal\(\);mountMap\(\)/);
 const entry=fs.readFileSync(new URL('../ui/living-entry.js',import.meta.url),'utf8');
 assert.match(entry,/world-expansion\/platform\/world-map-preview\.webp/);
 assert.match(entry,/data-world-enter>Continuar/);
 assert.doesNotMatch(entry,/Arraste para o lado|nr1-ao-trabalho-isometrico\.png/);
 const preview=new URL('../assets/world-expansion/platform/world-map-preview.webp',import.meta.url);
 assert.ok(fs.statSync(preview).size<250_000,'static map preview remains lightweight');
 const scene=fs.readFileSync(new URL('../ui/expanded-city-scene.js',import.meta.url),'utf8');
 assert.match(scene,/barraco-06-azul-coral\.png/);
 assert.doesNotMatch(scene,/community-huts\/barraco-0[789]/);
 assert.match(scene,/kind:'model',file:'food\/paradinho-cafe\.glb'/);
 assert.match(scene,/kind:'model',file:'food\/bolinho-kiosk\.glb'/);
 assert.match(scene,/if\(p\.kind==='model'\)/);
 for(const file of ['paradinho-cafe.glb','bolinho-kiosk.glb']){
  const model=new URL(`../assets/world-expansion/food/${file}`,import.meta.url);
  assert.ok(fs.statSync(model).size<10_000_000,`${file} stays below 10 MB`);
 }
});
