/** Presentation preferences only; never migrate or mutate the company save. */
export const HUD_KEY='pilha-hud-preferences-v1';
export const HUD_DEFAULTS=Object.freeze({version:1,expanded:true,shortcuts:true});
export function readHudPreferences(storage){
 try{const raw=storage?.getItem(HUD_KEY);if(!raw)return {...HUD_DEFAULTS};const p=JSON.parse(raw);
  if(p.version===1&&typeof p.expanded==='boolean'&&typeof p.shortcuts==='boolean')return p;
 }catch{}
 return {...HUD_DEFAULTS};
}
export function writeHudPreferences(storage,preferences){
 if(!storage||preferences.version!==1||typeof preferences.expanded!=='boolean'||typeof preferences.shortcuts!=='boolean')return false;
 try{storage.setItem(HUD_KEY,JSON.stringify(preferences));return true;}catch{return false;}
}
