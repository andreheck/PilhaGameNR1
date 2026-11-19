import {RULES} from '../data/continuous/catalog.js';
export const PLAYER_ACTIVITIES=Object.freeze({idle:'Em pé',walk:'Caminhando',sit:'Sentado',meditate:'Meditando',read:'Lendo',play:'Jogando',talk:'Conversando',observe:'Observando',work:'Interagindo',rest:'Descansando'});
const clamp=n=>Math.max(0,Math.min(100,n));
export const playerElapsed=s=>(s.week-1)*RULES.weekMs+s.activeMs;
export function settlePlayerWellbeing(state,context={}){
 if(!state.playerCharacterId)return state;
 const elapsed=playerElapsed(state),old=state.playerWellbeing;
 const valid=old?.id===state.playerCharacterId&&Number.isFinite(old.health)&&Number.isFinite(old.at);
 const sector=context.sector||old?.sector||'escritorio',activity=context.moving?'walk':context.activity||'idle';
 const quality=Math.max(0,Math.min(100,Number.isFinite(context.quality)?context.quality:old?.quality??50));
 const restorative=['meditate','sit','rest','read','play'].includes(activity);
 const nextRate=activity==='meditate'?12:activity==='talk'?6:restorative?8:sector==='patio'||sector==='restauracao'?4:(quality-50)*.12;
 const delta=valid?Math.max(0,elapsed-old.at):0;
 // One elapsed interval is settled once, independently of refresh frequency or clicks.
 const rate=valid&&Number.isFinite(old.rate)?old.rate:0;
 const health=clamp((valid?old.health:80)+rate*delta/RULES.weekMs);
 state.playerWellbeing={version:1,id:state.playerCharacterId,health,at:elapsed,sector,activity,quality,rate:nextRate};
 return state;
}
export function playerWellbeingView(state,actor,profile){
 const saved=state?.playerWellbeing,activity=actor?.moving?'walk':actor?.activity||'idle';
 return {id:state?.playerCharacterId,name:profile?.nome||profile?.name||actor?.name||'Seu personagem',portrait:profile?.explorer?.portrait||profile?.portrait||profile?.img||null,health:saved?.id===state?.playerCharacterId?saved.health:80,sector:actor?.sector||saved?.sector||'escritorio',activity,activityLabel:PLAYER_ACTIVITIES[activity]||'Explorando',paused:!!state?.paused,quality:saved?.quality??50,rate:saved?.rate??0};
}
