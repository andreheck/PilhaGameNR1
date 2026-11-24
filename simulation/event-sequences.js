import {EVENT_CATALOG} from './event-catalog.js';

const ALL=['escritorio','producao','atendimento'];
const icon={
  protect:'M4 12h16M12 4v16M7 7l10 10M17 7L7 17',
  pause:'M6 5h4v14H6zM14 5h4v14h-4z',
  demand:'M4 18h16M6 15l4-4 3 3 5-7',
  safety:'M12 3l8 4v5c0 4-3 7-8 9-5-2-8-5-8-9V7zM9 12l2 2 4-5',
  alert:'M12 3l10 18H2zM12 9v4M12 16v.01'
};
const option=(l,d,cost,e,r)=>({l,d,cost,e,r});

/** Follow-ups are deliberately outside the random pool: only a prior choice can schedule them. */
export const FOLLOWUP_EVENTS=Object.freeze({
 'corte-acompanhamento-protecao':{
  id:'corte-acompanhamento-protecao',c:2,n:'O Essencial em Dia',an:'pulse',sev:'warn',sec:ALL,prot:null,ic:icon.protect,
  ctx:'Duas semanas após a decisão de {origem}, a equipe revisa o orçamento de {s} e confirma se os cuidados prioritários continuaram protegidos.',
  ind:['Continuidade a verificar','Confiança da equipe'],now:{},
  opts:[
   option('Renegociar itens não essenciais','Rever contratos e cronograma junto à equipe.',300,{mods:{auton:2,lider:2,seg:1}},'A revisão preservou os cuidados prioritários e deixou o plano mais claro.'),
   option('Replanejar com participação do setor','Ajustar prazos e prioridades com quem executa o trabalho.',0,{mods:{auton:3,relac:2,seg:2}},'A equipe participou dos ajustes e entendeu como as prioridades seriam mantidas.'),
   option('Acompanhar sem mudar o plano','Manter os controles e revisar o resultado no próximo ciclo.',0,{mods:{seg:1}},'Os controles prioritários permaneceram ativos; a empresa seguirá acompanhando o orçamento.')
  ]
 },
 'corte-impacto-pausas':{
  id:'corte-impacto-pausas',c:1,n:'Pausa no Vermelho',an:'sway',sev:'warn',sec:ALL,prot:'jorn',ic:icon.pause,
  ctx:'Após a decisão de {origem}, pausas e formação foram reduzidas em {s}. A energia e a confiança da equipe começam a cair.',
  ind:['Ritmo e carga ▼','Segurança psicológica ▼'],now:{mods:{carga:-3,seg:-2}},
  opts:[
   option('Restabelecer pausas e formação essencial','Recuperar tempo protegido e conteúdo indispensável.',650,{mods:{carga:7,seg:5,recon:2}},'As pausas e a formação voltaram ao planejamento e a equipe recuperou parte da confiança.'),
   option('Redistribuir o trabalho sem remover pausas','Rever prioridades e cobertura dos turnos.',350,{mods:{carga:5,auton:2,seg:2}},'A carga foi reorganizada e as pausas permaneceram protegidas.'),
   option('Manter os cortes por mais um ciclo','Adiar a revisão para preservar o caixa agora.',0,{mods:{carga:-5,seg:-4,recon:-2}},'O caixa foi preservado por enquanto, mas o ritmo e a confiança da equipe pioraram.')
  ]
 },
 'corte-sobrecarga':{
  id:'corte-sobrecarga',c:1,n:'Sem Fôlego',an:'sway',sev:'crit',sec:ALL,prot:'jorn',ic:icon.alert,
  ctx:'O corte de pausas continuou após {origem}. Em {s}, aumentaram o cansaço e a dificuldade de manter o trabalho no ritmo previsto.',
  ind:['Ritmo e carga ▼','Atenção à equipe'],now:{mods:{carga:-5,seg:-3}},
  opts:[
   option('Rever metas e proteger as pausas','Reduzir ou reprogramar entregas que excedem a capacidade.',0,{mods:{carga:7,seg:4,lider:2}},'As metas foram alinhadas à capacidade e as pausas voltaram à escala.'),
   option('Contratar cobertura temporária','Criar cobertura para pausas e períodos de maior volume.',700,{mods:{carga:6,relac:1}},'A cobertura reduziu a pressão sobre quem permaneceu no turno.'),
   option('Manter o ritmo atual','Esperar que o volume diminua sem rever a organização.',0,{mods:{carga:-6,seg:-4}},'A pressão permaneceu alta e a equipe continuou sem tempo suficiente de recuperação.')
  ]
 },
 'demanda-retrabalho':{
  id:'demanda-retrabalho',c:0,n:'Volta para Ajuste',an:'slide',sev:'warn',sec:['producao','atendimento','escritorio'],prot:'jorn',ic:icon.demand,
  ctx:'Depois de {origem}, parte das entregas voltou para correção em {s}. A equipe precisa decidir como recuperar qualidade sem transferir toda a pressão para o próximo turno.',
  ind:['Retrabalho ▲','Carga da equipe ▼'],now:{mods:{carga:-3,recon:-1}},
  opts:[
   option('Reservar capacidade para corrigir as causas','Priorizar qualidade e ajustar os próximos prazos.',250,{mods:{carga:5,auton:2,seg:1}},'As causas mais frequentes foram corrigidas e os novos prazos ficaram mais realistas.'),
   option('Distribuir as correções com a equipe','Combinar responsáveis e tempo protegido para revisão.',0,{mods:{relac:3,auton:2,carga:3}},'As correções foram distribuídas com responsabilidades e tempo definidos.'),
   option('Absorver o retrabalho no turno atual','Manter as entregas sem mudar capacidade ou prazos.',0,{mods:{carga:-5,seg:-2}},'As entregas foram mantidas, mas o cansaço e a chance de novos erros aumentaram.')
  ]
 },
 'demanda-integracao':{
  id:'demanda-integracao',c:0,n:'Novos Ritmos',an:'pulse',sev:'warn',sec:['producao','atendimento','escritorio'],prot:'auto',ic:icon.demand,
  ctx:'Após {origem}, profissionais temporários chegaram a {s}. O reforço ajuda, mas faltam alinhamento de papéis e tempo de integração.',
  ind:['Integração a acompanhar','Clareza de papéis'],now:{mods:{auton:-2,relac:-1}},
  opts:[
   option('Fazer integração com apoio de colegas','Apresentar processos, limites e pontos de contato.',250,{mods:{auton:4,relac:3,seg:2}},'A integração esclareceu responsabilidades e facilitou a cooperação.'),
   option('Reduzir entregas durante a adaptação','Reservar tempo para aprender sem elevar a carga da equipe.',0,{mods:{carga:3,auton:2}},'A adaptação ocorreu em ritmo sustentável e com expectativas mais claras.'),
   option('Colocar a equipe em operação imediatamente','Manter o volume previsto sem tempo adicional de integração.',0,{mods:{carga:-3,auton:-3,seg:-2}},'A entrada foi rápida, mas surgiram dúvidas e correções que poderiam ter sido evitadas.')
  ]
 },
 'demanda-capacidade':{
  id:'demanda-capacidade',c:2,n:'Promessa de Prazo',an:'pulse',sev:'warn',sec:['producao','atendimento','escritorio'],prot:null,ic:icon.demand,
  ctx:'Após {origem}, a empresa aceitou apenas o volume que conseguia atender. Agora alguns clientes pedem atualização sobre os prazos em {s}.',
  ind:['Expectativa de prazo','Retenção a acompanhar'],now:{},
  opts:[
   option('Comunicar prazos e prioridades','Explicar a capacidade e combinar novas datas.',0,{mods:{seg:2,relac:2,recon:1}},'Os prazos foram renegociados com transparência e a equipe manteve um ritmo sustentável.'),
   option('Rever o planejamento de capacidade','Mapear horários e recursos para atender novos pedidos.',400,{mods:{auton:3,lider:2,carga:2}},'O planejamento identificou onde ampliar capacidade sem pressionar o setor.'),
   option('Prometer a entrega original','Manter a expectativa inicial sem alterar os recursos disponíveis.',0,{mods:{carga:-4,seg:-2,recon:-2}},'A promessa foi mantida, mas a equipe voltou a operar acima da capacidade.')
  ]
 },
 'quase-verificacao':{
  id:'quase-verificacao',c:3,n:'Conferindo o Caminho',an:'pulse',sev:'warn',sec:['producao','escritorio'],prot:'psic',ic:icon.safety,
  ctx:'Após {origem}, a equipe revisa se as medidas adotadas realmente eliminaram a causa do quase acidente em {s}.',
  ind:['Ação preventiva','Relato sem culpabilização'],now:{},
  opts:[
   option('Conferir a mudança com quem executa a tarefa','Observar o procedimento e ajustar o que ainda dificulta o trabalho.',0,{mods:{seg:5,auton:2,lider:1}},'A verificação confirmou a mudança e recolheu sugestões para manter a prevenção.'),
   option('Registrar e acompanhar o plano','Definir responsáveis e uma data de nova revisão.',0,{mods:{seg:4,recon:1}},'O plano recebeu responsáveis e data de acompanhamento.'),
   option('Encerrar o registro sem nova checagem','Considerar suficiente a correção inicial.',0,{mods:{seg:-2,auton:-1}},'O registro foi encerrado sem confirmar se a causa foi removida.')
  ]
 },
 'quase-reincidencia':{
  id:'quase-reincidencia',c:3,n:'O Alerta se Repete',an:'blink',sev:'crit',sec:['producao','escritorio'],prot:'psic',ic:icon.alert,
  ctx:'A causa não foi verificada após {origem} e uma situação semelhante voltou a ocorrer em {s}. Ninguém se feriu, mas é preciso interromper a exposição e investigar.',
  ind:['Risco recorrente ▲','Correção imediata'],now:{mods:{seg:-5,auton:-2}},
  opts:[
   option('Interromper a tarefa e investigar a causa','Retomar somente depois de corrigir e verificar a condição.',0,{mods:{seg:7,auton:2,lider:2}},'A tarefa foi retomada com a causa corrigida e a equipe participou da verificação.'),
   option('Isolar a área e providenciar correção','Manter a área fora de uso até a revisão.',250,{mods:{seg:5,lider:1}},'O isolamento protegeu as pessoas enquanto a correção era preparada.'),
   option('Seguir com a tarefa como está','Adiar a investigação e manter a operação.',0,{mods:{seg:-7,auton:-3}},'A exposição permaneceu. A equipe perdeu confiança de que os relatos seriam tratados.')
  ]
 }
});

export const EVENT_DEFINITIONS=Object.freeze({...EVENT_CATALOG.BY,...FOLLOWUP_EVENTS});
export const getEventDefinition=id=>EVENT_DEFINITIONS[id]||null;

const chainMap={
 'corte:0':{id:'corte-acompanhamento-protecao',delayWeeks:2},
 'corte:1':{id:'corte-impacto-pausas',delayWeeks:2},
 'demanda:0':{id:'demanda-retrabalho',delayWeeks:2},
 'demanda:1':{id:'demanda-integracao',delayWeeks:2},
 'demanda:2':{id:'demanda-capacidade',delayWeeks:2},
 'quase:0':{id:'quase-verificacao',delayWeeks:2},
 'quase:1':{id:'quase-verificacao',delayWeeks:2},
 'quase:2':{id:'quase-reincidencia',delayWeeks:1},
 'corte-impacto-pausas:2':{id:'corte-sobrecarga',delayWeeks:2}
};
export function followupForDecision(eventId,choiceIndex){return chainMap[eventId+':'+choiceIndex]||null;}
const DECISION_TAGS={
 'corte:0':['budget:protect-health-safety'],
 'corte:1':['budget:cut-training-pauses'],
 'demanda:0':['demand:accept-all'],
 'demanda:1':['demand:hire-temporary'],
 'demanda:2':['demand:stay-within-capacity'],
 'quase:0':['safety:investigate-without-blame'],
 'quase:1':['safety:temporary-isolation'],
 'quase:2':['safety:defer-investigation'],
 'corte-impacto-pausas:0':['pauses:restore'],
 'corte-impacto-pausas:1':['pauses:preserve-reorganize-work'],
 'corte-impacto-pausas:2':['pauses:continue-cut']
};
export function tagsForDecision(eventId,choiceIndex){return [...(DECISION_TAGS[eventId+':'+choiceIndex]||[])];}
