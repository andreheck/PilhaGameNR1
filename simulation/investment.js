/** Psychosocial investment catalog with educational 30-day scenarios. */
export const INITIAL_BUDGET = 10000;
export const BUDGET_KEY = "pilha-investment-v1";
export const DOMAINS = Object.freeze([
 {id:"seguranca-psicologica",name:"Segurança psicológica",icon:"🛡️",summary:"Confiança para falar, discordar, pedir ajuda e relatar erros sem humilhação."},
 {id:"assedio-respeito",name:"Prevenção ao assédio e respeito",icon:"🤝",summary:"Prevenir assédio moral/sexual, discriminação, retaliação e violência."},
 {id:"psicoeducacao",name:"Psicoeducação e saúde mental",icon:"🧠",summary:"Letramento em saúde mental, reconhecimento de sinais e acesso a apoio."},
 {id:"ergonomia",name:"Ergonomia e adequação da tarefa",icon:"🪑",summary:"Postos, ferramentas, postura, repetitividade, esforço e pausas."},
 {id:"ambiente-fisico",name:"Condições físicas do ambiente",icon:"🌡️",summary:"Temperatura, ventilação, ruído, iluminação e qualidade do ar."},
 {id:"espaco-confinamento",name:"Espaço, altura e confinamento",icon:"📐",summary:"Altura, espaço disponível, acesso, confinamento e circulação segura."},
 {id:"carga-ritmo",name:"Carga, ritmo e jornada",icon:"⏱️",summary:"Volume, prazos, ritmo, horas extras, pausas e recuperação."},
 {id:"autonomia-papel",name:"Autonomia e clareza de papel",icon:"🧭",summary:"Prioridades, controle sobre o trabalho, responsabilidades e recursos."},
 {id:"lideranca-justica",name:"Liderança e justiça organizacional",icon:"⚖️",summary:"Tratamento justo, feedback, previsibilidade e decisões transparentes."},
 {id:"relacoes-conflitos",name:"Relações e gestão de conflitos",icon:"💬",summary:"Cooperação, resolução de conflitos, apoio e comunicação."},
 {id:"mudanca-inseguranca",name:"Mudanças e segurança no emprego",icon:"🔄",summary:"Comunicação sobre mudanças, participação e redução de incerteza evitável."},
 {id:"apoio-recuperacao",name:"Apoio, recuperação e retorno",icon:"🌱",summary:"Acolhimento, adaptações razoáveis, retorno ao trabalho e prevenção de recaídas."}
]);
export const UPGRADES = Object.freeze([
 {id:"escuta-segura",domain:"seguranca-psicologica",name:"Rituais de escuta segura",category:"pessoas",cost:900,icon:"🛡️",description:"Rodas de escuta com regras de respeito, canal de relato e retorno sobre providências.",effects:{trust:9,wellbeing:5},forecast:"Mais condições para pedir ajuda e sinalizar riscos sem receio de retaliação",days:30,priority:"alta"},
 {id:"protocolo-ant assedio".replace(" ",""),domain:"assedio-respeito",name:"Protocolo de prevenção ao assédio",category:"pessoas",cost:1400,icon:"🤝",description:"Definir canais seguros, proteção contra retaliação, apuração responsável e comunicação.",effects:{trust:8,wellbeing:5,turnoverRisk:-3},forecast:"Maior clareza de como relatar, acolher e encaminhar situações",days:30,priority:"crítica"},
 {id:"psicoeducacao",domain:"psicoeducacao",name:"Trilha de psicoeducação",category:"pessoas",cost:1100,icon:"🧠",description:"Conteúdo breve sobre estresse, recuperação, apoio e limites de confidencialidade.",effects:{wellbeing:7,trust:3},forecast:"Maior repertório para reconhecer sinais e procurar apoio",days:30,priority:"alta"},
 {id:"ergonomia",domain:"ergonomia",name:"Adequação ergonômica do posto",category:"ambiente",cost:1800,icon:"🪑",description:"Revisar mobiliário, ferramentas, postura, repetitividade e organização da tarefa.",effects:{workload:-5,wellbeing:7},forecast:"Menor desconforto e melhor adequação entre tarefa, pessoa e posto",days:30,priority:"alta"},
 {id:"clima-ventilacao",domain:"ambiente-fisico",name:"Temperatura, ventilação e iluminação",category:"ambiente",cost:2200,icon:"🌡️",description:"Inspecionar conforto térmico, ventilação, iluminação e fontes de ruído; encaminhar correções técnicas.",effects:{wellbeing:6,workload:-2},forecast:"Condições ambientais mais adequadas após correções efetivamente realizadas",days:30,priority:"alta"},
 {id:"espaco-seguro",domain:"espaco-confinamento",name:"Circulação, altura e espaço seguro",category:"ambiente",cost:2600,icon:"📐",description:"Avaliar espaço, acessos, trabalho em altura e espaços confinados; sinalizar e encaminhar riscos críticos.",effects:{wellbeing:5,workload:-3},forecast:"Melhor circulação e encaminhamento de perigos físicos prioritários",days:30,priority:"crítica"},
 {id:"pausas",domain:"carga-ritmo",name:"Pausas e cobertura de jornada",category:"rotina",cost:1200,icon:"☕",description:"Cobertura planejada para pausas, recuperação e intervalos sem penalizar a equipe.",effects:{workload:-8,wellbeing:8,trust:4},forecast:"Rotina mais sustentável e pausas efetivamente realizadas",days:30,priority:"alta"},
 {id:"papel-autonomia",domain:"autonomia-papel",name:"Prioridades, autonomia e papéis",category:"gestao",cost:1000,icon:"🧭",description:"Acordar responsabilidades, autonomia, critérios de prioridade e recursos necessários.",effects:{workload:-5,trust:4},forecast:"Menos ambiguidade e melhor previsibilidade do trabalho",days:30,priority:"média"},
 {id:"lideranca",domain:"lideranca-justica",name:"Formação de liderança justa",category:"pessoas",cost:1500,icon:"⚖️",description:"Formação em feedback, distribuição justa, prevenção de vieses e decisões transparentes.",effects:{trust:6,workload:-3,wellbeing:4},forecast:"Conversas mais claras e maior consistência no tratamento da equipe",days:30,priority:"alta"},
 {id:"conflitos",domain:"relacoes-conflitos",name:"Mediação e acordos de equipe",category:"pessoas",cost:950,icon:"💬",description:"Criar acordos de convivência e fluxo de encaminhamento de conflitos com proteção e imparcialidade.",effects:{trust:6,wellbeing:3},forecast:"Conflitos identificados mais cedo e encaminhados com maior clareza",days:30,priority:"média"},
 {id:"comunicacao-mudancas",domain:"mudanca-inseguranca",name:"Comunicação e participação nas mudanças",category:"gestao",cost:850,icon:"🔄",description:"Explicar o que muda, quando, por quê e como as pessoas podem contribuir.",effects:{trust:5,wellbeing:3},forecast:"Menos incerteza evitável e mais participação na implementação",days:30,priority:"média"},
 {id:"apoio-retorno",domain:"apoio-recuperacao",name:"Plano de apoio e retorno ao trabalho",category:"pessoas",cost:1300,icon:"🌱",description:"Combinar acompanhamento confidencial, ajustes de trabalho e retorno gradual quando indicado.",effects:{wellbeing:7,trust:5,turnoverRisk:-3},forecast:"Melhor coordenação do apoio e das adaptações necessárias",days:30,priority:"alta"}
]);
export const INITIAL_INDICATORS=Object.freeze({workload:50,wellbeing:50,trust:50,turnoverRisk:20});
const withEffects=(indicators,effects)=>{const next={...INITIAL_INDICATORS,...(indicators||{})};for(const [key,delta] of Object.entries(effects||{})){if(key in next)next[key]=Math.max(0,Math.min(100,next[key]+delta));}return next;};
export function initialInvestmentState(){return {version:2,budget:INITIAL_BUDGET,spent:0,upgrades:[],day:0,history:[],indicators:{...INITIAL_INDICATORS},resolvedForecasts:[],dayEvents:[],updated:null};}
export function applyUpgrade(state,id,now=0){
 const upgrade=UPGRADES.find(x=>x.id===id);
 if(!upgrade)throw new Error("Melhoria desconhecida");
 if(state.upgrades.includes(id))return {...state,error:"already-installed"};
 if(state.budget<upgrade.cost)return {...state,error:"insufficient-budget"};
 const entry={id,domain:upgrade.domain,day:state.day||0,cost:upgrade.cost,appliedAt:now,forecastDay:(state.day||0)+upgrade.days,forecast:upgrade.forecast,effects:{...upgrade.effects}};
 return {...state,budget:state.budget-upgrade.cost,spent:state.spent+upgrade.cost,upgrades:[...state.upgrades,id],history:[...(state.history||[]),entry],indicators:withEffects(state.indicators,upgrade.effects),updated:now,error:null};
}
export function advanceInvestmentDay(state,days=1,now=0){
 const amount=Math.max(1,Math.floor(Number(days)||1)),day=(state.day||0)+amount;
 const resolved=new Set((state.resolvedForecasts||[]));
 const due=(state.history||[]).filter(entry=>entry.forecastDay<=day&&!resolved.has(entry.id));
 for(const entry of due)resolved.add(entry.id);
 return {...state,day,resolvedForecasts:[...resolved],lastAdvanceAt:now,dayEvents:due.map(entry=>({id:entry.id,day:entry.forecastDay,name:UPGRADES.find(u=>u.id===entry.id)?.name||entry.id,forecast:entry.forecast,effects:{...entry.effects}}))};
}
export function forecastUpgrades(state){return UPGRADES.map(u=>({...u,owned:state.upgrades.includes(u.id),affordable:state.budget>=u.cost,forecastDay:(state.day||0)+u.days,forecastStatus:state.upgrades.includes(u.id)?"scheduled":state.budget>=u.cost?"available":"needs-budget"}));}
export function readInvestmentState(storage){
 try{const saved=JSON.parse(storage.getItem(BUDGET_KEY)||"null");if([1,2].includes(saved?.version)&&Number.isFinite(saved.budget)&&Array.isArray(saved.upgrades))return {...initialInvestmentState(),...saved,version:2,history:Array.isArray(saved.history)?saved.history:[],indicators:{...INITIAL_INDICATORS,...(saved.indicators||{})},resolvedForecasts:Array.isArray(saved.resolvedForecasts)?saved.resolvedForecasts:[],dayEvents:Array.isArray(saved.dayEvents)?saved.dayEvents:[]};}catch{}
 const initial=initialInvestmentState();try{storage.setItem(BUDGET_KEY,JSON.stringify(initial));}catch{}return initial;
}
export function persistInvestmentState(storage,state){try{storage.setItem(BUDGET_KEY,JSON.stringify({...state,version:2}));return true;}catch{return false;}}
