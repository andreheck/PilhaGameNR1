import {ACHIEVEMENTS} from '../data/continuous/achievements.js';
const ids=new Set(ACHIEVEMENTS.map(a=>a.id)),sectors=['escritorio','producao','atendimento'];
export function validateAchievements(s){
 const a=s.achievements;if(a===undefined)return true;
 if(!a||a.version!==1||!a.unlocked||typeof a.unlocked!=='object'||Array.isArray(a.unlocked)||Object.keys(a.unlocked).length>10||!a.streaks||typeof a.streaks!=='object'||Array.isArray(a.streaks)||!a.currentPT22||!Array.isArray(a.currentPT22)||a.currentPT22.some(id=>!sectors.includes(id))||new Set(a.currentPT22).size!==a.currentPT22.length)throw Error('invalid-achievements');
 for(const [id,r] of Object.entries(a.unlocked))if(!ids.has(id)||!r||!Number.isInteger(r.week)||r.week<1||r.week>s.week||r.sector&&!sectors.includes(r.sector))throw Error('invalid-achievement-record');
 for(const [id,r] of Object.entries(a.streaks)){if(!['care',...sectors].includes(id)||!r||!Number.isInteger(r.week)||r.week<1||r.week>s.week||!Number.isInteger(r.count)||r.count<0||r.count>s.week)throw Error('invalid-achievement-streak');}
 return true;
}
