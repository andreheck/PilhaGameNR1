/** Playable setting profiles. Room counts describe distinct work rooms, not simulation sectors. */
export const GAME_MODES=Object.freeze([
 {id:'home-office',name:'Home office',subtitle:'Remoto · Fácil',difficulty:'Fácil',level:1,color:'#56d6bf',description:'Uma pessoa, um posto de trabalho e banheiro acessível. Aprenda a cuidar da rotina, ergonomia, isolamento e comunicação à distância.',preview:'home-office',rooms:[
  {id:'home-work',name:'Espaço de trabalho',kind:'work',staffing:'Uma pessoa · 1 posto',staffed:true},
  {id:'home-bathroom',name:'Banheiro',kind:'support',staffing:'Apoio · não é posto de trabalho',staffed:false}
 ],functionalRooms:1},
 {id:'cowork',name:'Cowork',subtitle:'Híbrido · Moderado',difficulty:'Moderado',level:2,color:'#47c6f0',description:'Trabalho compartilhado, colaboração e distrações em uma rotina híbrida. Observe circulação, privacidade e uso comum dos recursos.',preview:'cowork',rooms:[
  {id:'cowork-bench',name:'Bancada coletiva',kind:'work',staffing:'Equipes em escala',staffed:true},
  {id:'cowork-meeting',name:'Sala de reuniões',kind:'work',staffing:'Equipes em reunião',staffed:true},
  {id:'cowork-rest',name:'Espaço de descanso',kind:'work',staffing:'Pausas compartilhadas',staffed:true},
  {id:'cowork-kitchen',name:'Copa',kind:'work',staffing:'Convivência e apoio',staffed:true},
  {id:'cowork-bathroom',name:'Banheiro coletivo',kind:'support',staffing:'Apoio · não é posto de trabalho',staffed:false}
 ],functionalRooms:4},
 {id:'office',name:'Escritório presencial',subtitle:'Empresa completa · Avançado',difficulty:'Avançado',level:3,color:'#ffca45',description:'A empresa conectada que estamos construindo: setores, salas com equipes, hierarquias e decisões que afetam áreas diferentes.',preview:'office',rooms:[
  {id:'reception',name:'Entrada e recepção',kind:'work',staffing:'Atendimento · 1 a 2 pessoas',staffed:true},
  {id:'people',name:'Recursos Humanos',kind:'work',staffing:'RH · equipe de pessoas',staffed:true},
  {id:'administration',name:'Escritório administrativo',kind:'work',staffing:'Escritório · equipe administrativa',staffed:true},
  {id:'management',name:'Sala da gerência',kind:'work',staffing:'Gerente do setor',staffed:true},
  {id:'meeting',name:'Sala de reuniões',kind:'work',staffing:'Equipes por escala e reunião',staffed:true},
  {id:'service',name:'Atendimento',kind:'work',staffing:'Equipe de atendimento',staffed:true},
  {id:'production',name:'Produção',kind:'work',staffing:'Equipe de produção',staffed:true},
  {id:'warehouse',name:'Galpão logístico',kind:'work',staffing:'Equipe de logística',staffed:true},
  {id:'cafeteria',name:'Copa e convivência',kind:'work',staffing:'Pessoas em pausas e rodízio',staffed:true},
  {id:'restorative-yard',name:'Pátio restaurativo',kind:'work',staffing:'Pessoas em pausas e atividades',staffed:true}
 ],functionalRooms:10}
]);
export const GAME_MODE_BY_ID=Object.freeze(Object.fromEntries(GAME_MODES.map(mode=>[mode.id,mode])));
export const DEFAULT_GAME_MODE='office';
export function validGameMode(id){return Object.hasOwn(GAME_MODE_BY_ID,id);}
