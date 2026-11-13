import {FACTORS,ITEMS,RULES,SECTORS} from '../data/continuous/catalog.js';
import {recurringContribution} from './improvement-lifecycle.js';
import {specialMultiplier} from './hero-specials.js';
import {sectorStaffing} from './staffing-management.js';
import {leadershipSummary} from './leadership-effects.js';
import {routineRows} from './rest-routines.js';
import {EMPLOYEES} from '../data/continuous/employees.js';
/** Explain existing mechanics; never apply them again while rendering a profile. */
export function employeeInfluences(state,person){
 const direct=[],sources=[],context=[];if(!person)return {direct,sources,context};
 const active=person.employment==='active',factor=(id,delta)=>({id,delta:+delta.toFixed(2)});
 if(person.temporaryBonus)direct.push({title:'Pausa restaurativa e convívio',scope:'Agora · expira ao fim deste ciclo',health:person.temporaryBonus,factors:[],detail:'Ambiente +'+person.temporaryEnvironment.toFixed(1)+' · social +'+person.temporarySocial.toFixed(1)+'. Benefício total limitado a 8.'});
 if(person.chairBonus)direct.push({title:person.chairBonus.name,scope:'Agora · somente durante o uso',health:person.chairBonus.healthBonus,factors:Object.entries(person.chairBonus.effects).map(([k,v])=>factor(k,v)),detail:'Nível '+person.chairBonus.level+' · benefício exclusivo de '+person.name+'.'});
 for(const [index,r] of state.receipts.entries()){
  if(r.sid!==person.home)continue;const c=ITEMS.find(c=>c.id===r.id);if(!c||c.individual)continue;
  const progress=r.lifecycle?recurringContribution(r,state.week,c):Math.max(0,Math.min(1,c.timing.ramp?(state.week-r.at-c.timing.delay)/c.timing.ramp:state.week-r.at>=c.timing.delay?1:0));
  const k=RULES.effects[r.level-1]*(1+r.bonus)*progress*specialMultiplier(state,index),factors=Object.entries(c.factors).map(([id,v])=>factor(id,v*k)).filter(f=>f.delta!==0);
  if(factors.length)sources.push({title:c.name,scope:'Contribuição ao setor · nível '+r.level,factors});
 }
 for(const e of state.eventEffects.filter(e=>e.sid===person.home)){
  const delta=e.delta*(e.delta<0?Math.pow(.75,state.week-e.at):1);if(Math.abs(delta)<.01)continue;
  sources.push({title:'Ocorrências e decisões',scope:'Efeito da semana '+e.at+(e.delta<0?' · reduz com o tempo':''),factors:[factor(e.factor,delta)]});
 }
 const staffing=sectorStaffing(state,person.home);if(staffing.pressure)sources.push({title:'Vagas sem cobertura',scope:'Contexto atual do setor',factors:[factor('carga',-staffing.pressure),factor('relac',-staffing.pressureRelations)]});
 const leadership=leadershipSummary(state).find(x=>x.sid===person.home);
 if(leadership&&active){
  const isManager=leadership.managerId===person.id,penalty=leadership.stress>40?-5:0,bonus=!isManager&&leadership.health>70?7:0;
  context.push({title:'Gestão do setor',scope:'Previsão para o próximo fechamento semanal',health:penalty+bonus,factors:[],detail:(penalty?'−5 por estresse contextual do gestor acima de 40%. ':'Sem penalidade de estresse na regra atual. ')+(bonus?'+7 para subordinados pela saúde do gestor acima de 70%.':'Bônus de subordinados ainda não ativo.')+' A gestão usa a saúde de base do gestor no fechamento, sem bônus temporários.'});
 }
 if(person.leadership)context.push({title:'Gestão já contabilizada',scope:'Aplicado na semana '+person.leadership.week,health:person.leadership.delta,factors:[],detail:'Saldo já incluído na saúde de base; consultar não aplica novamente.'});
 const visits=state.visits.filter(v=>v.sid===person.home).reduce((n,v)=>n+v.dose*Math.max(0,1-(state.week-v.at)/3),0);
 if(visits)sources.push({title:'Cobertura restaurativa recente',scope:'Contribuição compartilhada · reduz ao longo de 3 semanas',factors:[factor('carga',Math.min(RULES.restCap,visits)),factor('relac',Math.min(RULES.restCap,visits*.5))]});
 const pauses=routineRows(state,EMPLOYEES.filter(p=>p.home===person.home&&state.staff[p.id]?.employment==='active'));
 if(pauses.length){const environment=pauses.reduce((n,p)=>n+p.environmentBonus,0)/pauses.length,social=pauses.reduce((n,p)=>n+p.socialBonus,0)/pauses.length;if(environment||social)sources.push({title:'Restauração compartilhada em andamento',scope:'Média das pausas e do convívio da equipe',factors:[factor('carga',environment),factor('relac',social)]});}
 const actual=person.factors||SECTORS.find(s=>s.id===person.home)?.base||{};
 const individual=person.chairBonus?.effects||{};
 const conditions=FACTORS.map(f=>({...f,value:Math.min(100,Math.max(0,(actual[f.id]||0)+(individual[f.id]||0)))}));
 return {direct,sources,context,conditions,active};
}
