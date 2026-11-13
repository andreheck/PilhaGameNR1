import {getHeroTeam,validateHeroPair} from '../simulation/hero-team.js';
import {readTimeline} from '../simulation/mission-timeline.js';
import {HERO_ROSTER} from '../hero-roster.js';
import {PLAYER_EXPLORERS,getPlayerExplorer} from '../data/continuous/player-explorers.js';
export const PLAYER_CHARACTER_KEY='pilha-player-character-v1';
// A running campaign owns its pair even if the editable team save differs.
export function initialPair(storage){
 const pair=readTimeline(storage).campaigns['01']?.team||getHeroTeam(storage,'01');
 return validateHeroPair('01',pair)?null:pair;
}
export function legacyPlayerHero(storage){const pair=readTimeline(storage).campaigns['01']?.team||getHeroTeam(storage,'01');return !validateHeroPair('01',pair)?pair.principal:null;}
export function readPlayerCharacter(storage){
 try{
  const raw=storage?.getItem(PLAYER_CHARACTER_KEY);
  if(raw===null||raw===undefined)return {ok:true,heroId:null};
  const value=JSON.parse(raw);
  if(value?.version!==1||(!HERO_ROSTER.some(hero=>hero.id===value.heroId)&&!getPlayerExplorer(value.heroId)))return {ok:false,error:'invalid-player-character',heroId:null};
  return {ok:true,heroId:value.heroId};
 }catch{return {ok:false,error:'storage-unavailable',heroId:null};}
}
export function savePlayerCharacter(storage,heroId){
 if(!HERO_ROSTER.some(hero=>hero.id===heroId)&&!getPlayerExplorer(heroId))return {ok:false,error:'invalid-player-character'};
 try{if(!storage?.setItem)return {ok:false,error:'storage-unavailable'};storage.setItem(PLAYER_CHARACTER_KEY,JSON.stringify({version:1,heroId}));return {ok:true,heroId};}
 catch{return {ok:false,error:'storage-unavailable'};}
}
