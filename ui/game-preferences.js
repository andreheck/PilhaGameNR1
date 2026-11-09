import {setSoundEnabled} from './living-audio.js';
export const PREFERENCES_KEY='pilha-game-preferences-v1';
export const DEFAULT_PREFERENCES=Object.freeze({sound:true,motion:'system',showOrb:true});
export function normalizePreferences(raw={}){return {sound:typeof raw?.sound==='boolean'?raw.sound:true,motion:['system','reduced','full'].includes(raw?.motion)?raw.motion:'system',showOrb:typeof raw?.showOrb==='boolean'?raw.showOrb:true};}
export function readPreferences(storage){try{const raw=storage?.getItem(PREFERENCES_KEY);if(!raw)return {...DEFAULT_PREFERENCES};if(raw.length>10000)return {...DEFAULT_PREFERENCES};return normalizePreferences(JSON.parse(raw));}catch{return {...DEFAULT_PREFERENCES};}}
export const decorativeMotionAllowed=(preferences,reduced=false)=>preferences.motion==='full'||preferences.motion==='system'&&!reduced;
let current={...DEFAULT_PREFERENCES},store=null,media=null;
export const getPreferences=()=>({...current});
function apply(){setSoundEnabled(current.sound);if(typeof document==='undefined')return;document.documentElement.dataset.gameMotion=decorativeMotionAllowed(current,media?.matches)?'full':'reduced';document.documentElement.dataset.gameOrb=current.showOrb?'on':'off';window.dispatchEvent(new CustomEvent('pilha:preferences',{detail:getPreferences()}));}
export function initializePreferences(storage){store=storage;current=readPreferences(storage);media=window.matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',apply);window.addEventListener('storage',e=>{if(e.key===PREFERENCES_KEY){current=readPreferences(store);apply();}});apply();}
export function setPreferences(patch){current=normalizePreferences({...current,...patch});let saved=false;try{if(store){store.setItem(PREFERENCES_KEY,JSON.stringify(current));saved=true;}}catch{}apply();return {saved,preferences:getPreferences()};}
