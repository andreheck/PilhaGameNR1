import {getHero} from '../hero-roster.js';
export const HERO_TEAM_KEY='pilha-hero-teams-v1';
export const HERO_CASE_IDS=Object.freeze(['01','02','03','04','05']);
export function validateHeroPair(caseId,pair){
  if(!HERO_CASE_IDS.includes(caseId))return 'invalid-case';
  if(!pair||!pair.principal||!pair.support)return 'incomplete-pair';
  if(!getHero(pair.principal)||!getHero(pair.support))return 'unknown-hero';
  if(pair.principal===pair.support)return 'duplicate-hero';
  return null;
}
export function normalizeHeroTeams(value){
  const clean={version:1,teams:{}};
  if(!value||value.version!==1||!value.teams||typeof value.teams!=='object')return clean;
  for(const caseId of HERO_CASE_IDS){
    const pair=value.teams[caseId];
    if(!validateHeroPair(caseId,pair))clean.teams[caseId]={principal:pair.principal,support:pair.support,updatedAt:Number.isFinite(pair.updatedAt)?pair.updatedAt:0};
  }
  return clean;
}
export function readHeroTeams(storage){
  try{const raw=storage?.getItem(HERO_TEAM_KEY);if(!raw||raw.length>20000)return normalizeHeroTeams(null);return normalizeHeroTeams(JSON.parse(raw));}
  catch{return normalizeHeroTeams(null);}
}
export function saveHeroTeam(storage,caseId,pair,now=Date.now()){
  const error=validateHeroPair(caseId,pair);if(error)return {ok:false,error};
  const state=readHeroTeams(storage);
  const team={principal:pair.principal,support:pair.support,updatedAt:Number.isFinite(now)?now:0};
  state.teams[caseId]=team;
  try{if(!storage?.setItem)return {ok:false,error:'storage-unavailable'};storage.setItem(HERO_TEAM_KEY,JSON.stringify(state));return {ok:true,team};}
  catch{return {ok:false,error:'storage-unavailable'};}
}
export function getHeroTeam(storage,caseId){return readHeroTeams(storage).teams[caseId]||null;}
