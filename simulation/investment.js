/** Initial investment budget and deterministic, pedagogical upgrade forecasts. */
export const INITIAL_BUDGET = 10000;
export const BUDGET_KEY = "pilha-investment-v1";
export const UPGRADES = Object.freeze([
 {id:"ergonomia",name:"Ergonomia e estação de trabalho",category:"ambiente",cost:1800,icon:"🪑",description:"Ajustes ergonômicos, organização e ferramentas adequadas.",effects:{workload:-5,wellbeing:7,trust:1},forecast:"Menor desconforto e melhor fluidez operacional",days:30},
 {id:"pausas",name:"Pausas e cobertura de jornada",category:"rotina",cost:1200,icon:"☕",description:"Cobertura planejada para pausas e intervalos sem penalizar a equipe.",effects:{workload:-8,wellbeing:8,trust:4},forecast:"Rotina mais sustentável e pausas efetivamente realizadas",days:30},
 {id:"escuta",name:"Canal de escuta e acompanhamento",category:"pessoas",cost:900,icon:"💬",description:"Rituais de escuta protegida, retorno e acompanhamento.",effects:{trust:9,wellbeing:5,turnoverRisk:-4},forecast:"Maior confiança para relatar obstáculos e pedir apoio",days:30},
 {id:"dimensionamento",name:"Redimensionar capacidade da equipe",category:"gestao",cost:3200,icon:"👥",description:"Revisar distribuição de demanda, capacidade e metas.",effects:{workload:-12,wellbeing:6,turnoverRisk:-6},forecast:"Menor sobrecarga quando a capacidade acompanha a demanda",days:30},
 {id:"lideranca",name:"Formação de liderança",category:"pessoas",cost:1500,icon:"🧭",description:"Treinar liderança em feedback, prioridade e prevenção.",effects:{trust:6,workload:-3,wellbeing:4},forecast:"Conversas mais claras e melhor encaminhamento de riscos",days:30},
 {id:"sinalizacao",name:"Reorganizar layout e circulação",category:"ambiente",cost:2100,icon:"🧱",description:"Sinalizar áreas, organizar circulação e reduzir obstáculos.",effects:{workload:-3,wellbeing:3,trust:1},forecast:"Fluxos mais claros e menos interrupções no setor",days:30}
]);
export function initialInvestmentState(){return {version:1,budget:INITIAL_BUDGET,spent:0,upgrades:[],day:0,history:[],updated:null};}
export function applyUpgrade(state,id,now=0){
 const upgrade=UPGRADES.find(x=>x.id===id);
 if(!upgrade)throw new Error("Melhoria desconhecida");
 if(state.upgrades.includes(id))return {...state,error:"already-installed"};
 if(state.budget<upgrade.cost)return {...state,error:"insufficient-budget"};
 const entry={id,day:state.day||0,cost:upgrade.cost,appliedAt:now,forecastDay:(state.day||0)+upgrade.days,forecast:upgrade.forecast,effects:{...upgrade.effects}};
 return {...state,budget:state.budget-upgrade.cost,spent:state.spent+upgrade.cost,upgrades:[...state.upgrades,id],history:[...(state.history||[]),entry],updated:now,error:null};
}
export function forecastUpgrades(state){return UPGRADES.map(u=>({ ...u,owned:state.upgrades.includes(u.id),affordable:state.budget>=u.cost,forecastDay:(state.day||0)+u.days,forecastStatus:state.upgrades.includes(u.id)?"scheduled":state.budget>=u.cost?"available":"needs-budget"}));}
export function readInvestmentState(storage){
 try{const saved=JSON.parse(storage.getItem(BUDGET_KEY)||"null");if(saved?.version===1&&Number.isFinite(saved.budget)&&Array.isArray(saved.upgrades))return {...initialInvestmentState(),...saved};}catch{}
 const initial=initialInvestmentState();
 try{storage.setItem(BUDGET_KEY,JSON.stringify(initial));}catch{}
 return initial;
}
export function persistInvestmentState(storage,state){try{storage.setItem(BUDGET_KEY,JSON.stringify(state));return true;}catch{return false;}}
