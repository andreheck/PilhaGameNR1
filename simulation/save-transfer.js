/** Explicit local-file transfer between origins. Only game-owned keys; no account credentials. */
import * as M from './company-continuous.js';
import {validateLiving} from './company-living.js';
import {readEconomy} from './hero-progression.js';
export const BACKUP_KEYS=Object.freeze(['pilha-investment-v1','pilha-hero-teams-v1','pilha-game-preferences-v1','pilha-company-phone-v1',M.KEY]);
const cap=1500000;
export function inspectBackup(text){
 if(typeof text!=='string'||text.length>cap)throw Error('Arquivo muito grande.');
 const v=JSON.parse(text);if(v?.format!=='pilha-game-backup'||v.version!==1||!v.storage||typeof v.storage!=='object'||Array.isArray(v.storage))throw Error('Formato de backup inválido.');
 const entries={};for(const key of Object.keys(v.storage)){if(!BACKUP_KEYS.includes(key)||typeof v.storage[key]!=='string'||v.storage[key].length>(key===M.KEY?500000:250000))throw Error('Conteúdo de backup inválido.');JSON.parse(v.storage[key]);entries[key]=v.storage[key];}
 if(!entries[M.KEY])throw Error('O arquivo não contém uma partida.');
 const storage={getItem:key=>entries[key]??null},r=M.read(storage);if(!r.ok)throw Error('Partida inválida: '+r.error);validateLiving(r.state);
 if(entries['pilha-investment-v1']&&!readEconomy(storage).ok)throw Error('Progressão dos heróis inválida.');
 return {entries,state:r.state};
}
export function exportBackup(storage,now=Date.now()){
 const entries={};for(const key of BACKUP_KEYS){const raw=storage.getItem(key);if(raw!==null)entries[key]=raw;}
 const text=JSON.stringify({format:'pilha-game-backup',version:1,createdAt:new Date(now).toISOString(),storage:entries},null,2);inspectBackup(text);return text;
}
export function importBackup(storage,text,now=Date.now()){
 const {entries,state}=inspectBackup(text);if(!Number.isFinite(now)||now<0)throw Error('Relógio inválido.');
 state.paused=true;state.lastWallMs=now;M.validate(state);validateLiving(state);entries[M.KEY]=JSON.stringify(state);
 const prior=Object.fromEntries(BACKUP_KEYS.map(k=>[k,storage.getItem(k)]));
 try{for(const key of BACKUP_KEYS){if(entries[key]!==undefined)storage.setItem(key,entries[key]);else storage.removeItem(key);}}
 catch(error){for(const key of BACKUP_KEYS){try{if(prior[key]===null)storage.removeItem(key);else storage.setItem(key,prior[key]);}catch{}}throw Error('Não foi possível gravar o backup. A importação foi interrompida.');}
 return state;
}
