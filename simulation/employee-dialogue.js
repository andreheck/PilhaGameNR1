import {SECTORS} from '../data/continuous/catalog.js';

export const PLAYER_DIALOGUE=[
 {id:'hope',text:'As coisas vão melhorar',health:2},
 {id:'honest',text:'Não vejo solução tão rápida agora para os problemas',factor:'seg',factorDelta:-1},
 {id:'resign',text:'Se está ruim, peça mudança de setor ou demissão',health:-3},
 {id:'patience',text:'Já estamos cuidando disso, tenha um pouco mais de paciência',health:2},
 {id:'resolved',text:'Já resolvemos isso, logo você sentirá os efeitos da mudança',health:3}
];

const factorNames={carga:'ritmo e carga de trabalho',auton:'autonomia',relac:'relações na equipe',lider:'liderança',recon:'reconhecimento',seg:'segurança psicológica'};
const factorName=id=>factorNames[id]||'condições de trabalho';

export function employeeDialogue(person,state){
 const health=Number(person?.health??50),factors=person?.factors||{},lowest=Object.entries(factors).sort((a,b)=>a[1]-b[1])[0],sector=SECTORS.find(item=>item.id===person?.home)?.name||person?.home||'setor';
 const alert=state?.events?.current?.sid===person?.home?' O alerta desta semana também deixou a equipe apreensiva.':'';
 const name=person?.name||'a equipe';
 const lines=health>=70
  ? [`Tenho conseguido trabalhar bem em ${sector}; a equipe está se apoiando.`,`O reconhecimento e a colaboração ajudam bastante no meu dia a dia.`,`Quero manter esse ambiente bom também para quem chega agora.`]
  : health>=45
   ? [`Em ${sector}, estamos seguindo, mas ainda precisamos ajustar ${factorName(lowest?.[0])}.`,`Algumas coisas melhoraram, embora eu ainda esteja acompanhando como a equipe reage.`,`Uma conversa respeitosa já ajudaria a entender o que está funcionando.`]
   : [`O trabalho em ${sector} está pesando; ${factorName(lowest?.[0])} é a minha maior preocupação agora.${alert}`,`Preciso que o problema seja ouvido e acompanhado sem me culpar por relatá-lo.`,`Uma mudança concreta nas condições do setor faria diferença para mim.`];
 // Keep a compact, deterministic set of up to three lines for every NPC.
 return {speaker:name,lines,selected:health>=70?0:health>=45?1:0,options:PLAYER_DIALOGUE};
}

export function applyEmployeeDialogue(state,employeeId,choiceId){
 const person=state.staff?.[employeeId],choice=PLAYER_DIALOGUE.find(row=>row.id===choiceId);
 if(!person||person.employment&&person.employment!=='active'||!choice)return {ok:false,error:'invalid-dialogue-target'};
 if(person.lastExplorerDialogueWeek===state.week)return {ok:false,error:'dialogue-already-used'};
 if(choice.health)person.health=Math.max(0,Math.min(100,person.health+choice.health));
 if(choice.factor){person.factorAdjustments??={};person.factorAdjustments[choice.factor]=Math.max(-100,Math.min(100,(person.factorAdjustments[choice.factor]||0)+choice.factorDelta));}
 person.lastExplorerDialogueWeek=state.week;
 person.lastExplorerLine=choice.text;
 state.history.push({type:'employee-dialogue',text:`Explorador conversou com ${employeeId}: ${choice.text}`,week:state.week});
 state.history=state.history.slice(-100);
 return {ok:true,state};
}
