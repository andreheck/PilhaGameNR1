import {EMPLOYEES} from '../data/continuous/employees.js';
import {DEPARTMENTS} from '../data/continuous/organization.js';

// Fictional gameplay attributes. They describe team balance, never a real person's diagnosis or ability.
const TEAM_TRAITS=Object.freeze({
 'NPC-01':{relationships:58,creativity:72,productivity:78},'NPC-02':{relationships:54,creativity:90,productivity:58},
 'NPC-03':{relationships:62,creativity:66,productivity:90},'NPC-04':{relationships:58,creativity:86,productivity:64},
 'NPC-05':{relationships:88,creativity:72,productivity:67},'NPC-06':{relationships:90,creativity:82,productivity:56},
 'NPC-07':{relationships:92,creativity:74,productivity:74},'NPC-08':{relationships:78,creativity:94,productivity:66},
 'NPC-09':{relationships:62,creativity:54,productivity:90},'NPC-10':{relationships:88,creativity:62,productivity:68},
 'NPC-11':{relationships:60,creativity:54,productivity:94},'NPC-12':{relationships:90,creativity:68,productivity:76},
 'NPC-13':{relationships:56,creativity:70,productivity:84},'NPC-14':{relationships:78,creativity:82,productivity:60},
 'NPC-15':{relationships:62,creativity:72,productivity:86},'NPC-16':{relationships:80,creativity:86,productivity:72}
});
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const round=n=>Math.round(clamp(n));
const employee=id=>EMPLOYEES.find(p=>p.id===id);
const linked=(a,b)=>employee(a)?.profile?.proposedSynergies?.includes(b)||employee(b)?.profile?.proposedSynergies?.includes(a);

export function individualTeamTraits(id){
 const traits=TEAM_TRAITS[id];if(!traits)return null;
 return Object.entries(traits).map(([key,value])=>({key,value,label:{relationships:'Relacionamentos',creativity:'Criatividade',productivity:'Produtividade'}[key],tone:value>=75?'positive':value<50?'negative':'balanced'}));
}

export function assessTeam(ids=[]){
 const selected=[...new Set(ids)].map(id=>({id,traits:TEAM_TRAITS[id]})).filter(person=>person.traits);
 if(!selected.length)return {count:0,synergy:0,relationships:0,creativity:0,productivity:0,linkedPairs:0,pairCount:0,illnessRisk:0,archetype:'Aguardando equipe',explanations:['Selecione profissionais para montar o time.']};
 const mean=key=>selected.reduce((total,person)=>total+person.traits[key],0)/selected.length;
 const relationships=round(mean('relationships')),creativity=round(mean('creativity')),productivity=round(mean('productivity'));
 let linkedPairs=0,pairCount=0;
 for(let i=0;i<selected.length;i++)for(let j=i+1;j<selected.length;j++){pairCount++;if(linked(selected[i].id,selected[j].id))linkedPairs++;}
 const linkRate=pairCount?linkedPairs/pairCount*100:50;
 const synergy=round(relationships*.34+creativity*.24+productivity*.25+linkRate*.17);
 let archetype;
 if(productivity>=80&&relationships<68)archetype='Produção Acima de Tudo';
 else if(creativity>=80&&productivity>=62)archetype='Máquina de Criatividade';
 else if(relationships>=78&&productivity>=55&&productivity<78)archetype='Devagar e Sempre';
 else if(relationships>=78&&productivity>=78)archetype='Laços que Entregam';
 else archetype='Equilíbrio em Ação';
 // This is a composition-only chance in the game scenario, not a clinical prediction.
 const overload=Math.max(0,productivity-relationships);
 const illnessRisk=round(18+(100-relationships)*.35+overload*.25+Math.max(0,60-creativity)*.1-linkRate*.08);
 const explanations=[];
 explanations.push(relationships>=75?'Relações bem distribuídas ajudam a reduzir atritos no cenário.':relationships<55?'O grupo começa com pouco apoio relacional entre perfis; vale acompanhar conversas e clima.':'Há uma base relacional intermediária, com espaço para fortalecer acordos.');
 explanations.push(creativity>=78?'O grupo reúne perfis com criação e experimentação diversas.':creativity<58?'Há poucos perfis de exploração de ideias; mudanças podem pedir apoio adicional.':'Criatividade distribuída de forma equilibrada.');
 explanations.push(overload>=16?'A entrega simulada supera o apoio relacional; acompanhe carga e pausas.':productivity>=78?'Boa capacidade de entrega simulada, apoiada por rotinas e metas claras.':'Ritmo de entrega moderado, com margem para planejamento.');
 explanations.push(linkedPairs?`${linkedPairs} sinergia(s) de colaboração registradas no catálogo canônico.`:'Nenhuma dupla de colaboração registrada neste grupo; isso não significa conflito pessoal.');
 return {count:selected.length,synergy,relationships,creativity,productivity,linkedPairs,pairCount,illnessRisk,archetype,explanations};
}

export function randomInitialHiring(random=Math.random){
 const managers={};
 for(const sector of DEPARTMENTS){const candidates=EMPLOYEES.filter(p=>p.home===sector);if(!candidates.length)return null;managers[sector]=candidates[Math.floor(clamp(random(),0,.999999)*candidates.length)].id;}
 const managerIds=new Set(Object.values(managers)),available=EMPLOYEES.filter(p=>!managerIds.has(p.id)),employees=[];
 while(employees.length<3&&available.length){const index=Math.floor(clamp(random(),0,.999999)*available.length);employees.push(available.splice(index,1)[0].id);}
 return employees.length===3?{managers,employees}:null;
}

export const TEAM_TRAIT_DEFINITIONS=Object.freeze([
 {key:'relationships',label:'Relacionamentos'},
 {key:'creativity',label:'Criatividade'},
 {key:'productivity',label:'Produtividade'}
]);
