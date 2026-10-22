import {HERO_ROSTER} from '../hero-roster.js';
import {readEconomy,heroProgress} from '../simulation/hero-progression.js';
import {readHeroTeams} from '../simulation/hero-team.js';
import {readTimeline} from '../simulation/mission-timeline.js';
import {ABILITIES} from '../simulation/hero-abilities.js';
import {HERO_SHEETS} from './hero-sheets.js';
const portraits=[['comandante','#ffc41f','bolt',1.12],['psicologa','#2ee59d','heart',1.12],['dados','#1ccbe6','chart',1.12],['seguranca','#ff9a2e','shield',1.1],['tecnologia','#3aa0ff','code',1.12],['rstd','#a56bff','users',1]];
export function buildHeroGalleryData(storage){
 const loaded=readEconomy(storage),state=loaded.ok?loaded.state:null;
 const teams=[...Object.values(readHeroTeams(storage).teams),...Object.values(readTimeline(storage).campaigns).map(c=>c.team)];
 return {SAMPLE:false,LIST:HERO_ROSTER.map((hero,i)=>{
  const sheet=HERO_SHEETS.find(s=>s.id===hero.id),p=heroProgress(state,hero.id),art=portraits[i];
  const pair=teams.some(t=>t.principal===hero.id||t.support===hero.id);
  return {id:hero.id,nome:hero.name,cargo:hero.rarity+' · '+hero.initials,cor:art[1],icone:art[2],nivel:loaded.ok?p.level:null,xp:p.atCap?1:p.xpInLevel,xpMax:p.atCap?1:p.xpSpan,atCap:p.atCap,progressAvailable:loaded.ok,
   resumo:sheet.purpose.split(/(?<=\.)\s/)[0],especializacao:sheet.specialization,habilidade:sheet.purpose,frase:sheet.archetype,
   energia:p.atCap?100:Math.round(p.xpInLevel/p.xpSpan*100),pontos:p.earnedXp,trainingXp:p.trainingXp,
   conquistas:[{nome:'Dupla definida',icone:'users',ok:pair},{nome:'XP de missão',icone:'star',ok:p.earnedXp>0},{nome:'Formação realizada',icone:'shield',ok:p.trainingXp>0},{nome:'Nível 2 ou mais',icone:'chart',ok:p.level>=2}],
   img:'/ui/claude/herois/assets/'+art[0]+'.webp',alt:hero.name+' · arte aprovada para a galeria do PilhA+ Game',crop:{z:art[3],y:0},
   source:'https://github.com/andreheck/PilhaGameNR1/blob/'+sheet.source+'/docs/herois/'+sheet.file+'.md',attributes:sheet.attributes,
   skills:sheet.skills.map(skill=>{const runtime=ABILITIES.find(a=>a.heroId===hero.id&&a.name===skill.name);return {...skill,runtime:!!runtime,runtimeText:runtime?runtime.description+' Preparação: '+runtime.delayDays+' dia(s); duração: '+runtime.durationDays+' dias; recarga: '+runtime.cooldownDays+' dias.':null};})};
 })};
}
export function heroHistory(storage,id){
 const e=readEconomy(storage);if(!e.ok)return {available:false,entries:[]};
 const p=heroProgress(e.state,id);
 return {available:true,earnedXp:p.earnedXp,trainingXp:p.trainingXp,entries:Object.entries(e.state.heroProgression.claims).filter(([key])=>key.endsWith(':'+id)).map(([key,value])=>({caseId:key.split(':')[1],label:key.split(':')[2]==='case'?'Caso concluído':'Situação '+(+key.split(':')[2].slice(4)+1),xp:value.xp,at:value.at})).sort((a,b)=>b.at-a.at)};
}
