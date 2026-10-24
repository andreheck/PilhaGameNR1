import {NPC_PROFILES} from './npc-profiles.js';
/** Established NPC identities. Narrative types never determine health.
 * Source: feat/npc-balanceamento-contextual/data/npcs/catalogo-v1.json.
 * Last eight ages are absent in that registry: remain null. Appearance is procedural. */
const rows=[
 ['João','Arquiteto','INTJ',38,'escritorio','Planejamento e processos','Visão estratégica','Prioridades claras',0],
 ['Tiago','Lógico','INTP',27,'escritorio','Análise e tecnologia','Criatividade técnica','Tempo para análise',1],
 ['Fernanda','Comandante','ENTJ',41,'escritorio','Coordenação de equipes','Organização de recursos','Metas viáveis',2],
 ['Raimunda','Debatedora','ENTP',34,'escritorio','Administração','Questionamento construtivo','Acordos de prioridade',3],
 ['Aline','Advogada','INFJ',35,'atendimento','Clima e relações','Escuta atenta','Apoio e limites de demanda',3],
 ['Letícia','Mediadora','INFP',29,'atendimento','Experiência humana','Empatia e cooperação','Comunicação respeitosa',2],
 ['Mariana','Protagonista','ENFJ',37,'escritorio','Articulação de equipes','Decisões coletivas','Responsabilidades compartilhadas',2],
 ['Pedro','Ativista','ENFP',25,'atendimento','Ideias e colaboração','Criatividade colaborativa','Objetivos claros',1],
 ['Carlos','Logístico','ISTJ',null,'producao','Operação e logística',null,null,0],
 ['Ana','Defensora','ISFJ',null,'atendimento','Apoio à equipe',null,null,2],
 ['José','Executivo','ESTJ',null,'producao','Coordenação operacional',null,null,0],
 ['Maria','Cônsul','ESFJ',null,'atendimento','Relações e atendimento',null,null,3],
 ['Alisson','Virtuoso','ISTP',null,'producao','Recursos e operação',null,null,1],
 ['Camila','Aventureira','ISFP',null,'producao','Melhoria do ambiente',null,null,2],
 ['Lucas','Empreendedor','ESTP',null,'producao','Organização operacional',null,null,0],
 ['Beatriz','Artista','ESFP',null,'escritorio','Comunicação e criação',null,null,3]
];
const groups=[['analistas','#ac8be5'],['diplomatas','#4fce9b'],['sentinelas','#5bb5ec'],['exploradores','#f4c553']];
const skins=['#b77b54','#d6a17b','#c58c67','#6e422d'];
export const EMPLOYEES=Object.freeze(rows.map((r,i)=>Object.freeze({id:'NPC-'+String(i+1).padStart(2,'0'),profile:NPC_PROFILES['NPC-'+String(i+1).padStart(2,'0')]??null,portrait:NPC_PROFILES['NPC-'+String(i+1).padStart(2,'0')]?.portrait??null,name:r[0],archetype:r[1],type:r[2],age:r[3],home:r[4],role:r[5],strength:r[6],support:r[7],group:groups[Math.floor(i/4)][0],shirt:groups[Math.floor(i/4)][1],skin:skins[r[8]],hair:'#302622',hairStyle:r[8],source:'catalogo-v1',profileStatus:i<8?'registered':'identity-registered'})));
export const employee=id=>EMPLOYEES.find(p=>p.id===id)||null;
export const HEALTH_NOTE='Saúde simulada (0–100): parâmetro de jogo, não diagnóstico. Personalidade, idade e aparência não determinam a pontuação.';
