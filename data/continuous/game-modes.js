/** Playable setting profiles. Room counts describe distinct work rooms, not simulation sectors. */
export const GAME_MODES=Object.freeze([
 {id:'home-office',name:'Home office',subtitle:'Remoto · Fácil',difficulty:'Fácil',level:1,color:'#56d6bf',description:'Um espaço de trabalho no quarto ou em casa. O explorador atua presencialmente; gerente e colegas formam uma equipe remota de cinco pessoas, acessível pelo celular.',preview:'home-office',mapLayout:'home-office',rooms:[
  {id:'home-work',name:'Quarto · espaço de trabalho',kind:'work',staffing:'Explorador · 1 posto',staffed:true}
 ],functionalRooms:1,homeOfficeKit:{
  room:{id:'home-office-room',name:'Sala isométrica vazia',url:'/assets/game-modes/home-office/Empty_Isometric_Room.glb',kind:'base'},
  inventory:[
   {id:'desk-with-computer',name:'Mesa com computador',url:'/assets/game-modes/home-office/Office_Desk_with_Comp.glb',kind:'3D'},
   {id:'swivel-chair',name:'Cadeira giratória',url:'/assets/game-modes/home-office/Office_Swivel_Chair.glb',kind:'3D'},
   {id:'monitor',name:'Monitor de escritório',url:'/assets/kenney-furniture/computerScreen.glb',kind:'3D'},
   {id:'puff-azul',name:'Puff azul',url:'/assets/furniture/sprites/webp/puff-azul.webp',kind:'2D'},
   {id:'mesa-escritorio',name:'Mesa de escritório',url:'/assets/furniture/sprites/webp/mesa-escritorio.webp',kind:'2D'},
   {id:'poltrona-azul-a',name:'Poltrona azul',url:'/assets/furniture/sprites/webp/poltrona-azul-a.webp',kind:'2D'},
   {id:'sofa-azul',name:'Sofá azul',url:'/assets/furniture/sprites/webp/sofa-azul.webp',kind:'2D'},
   {id:'gaveteiro',name:'Gaveteiro',url:'/assets/furniture/sprites/webp/gaveteiro.webp',kind:'2D'},
   {id:'armario-baixo',name:'Armário baixo',url:'/assets/furniture/sprites/webp/armario-baixo.webp',kind:'2D'},
   {id:'estante-livros',name:'Estante de livros',url:'/assets/furniture/sprites/webp/estante-livros.webp',kind:'2D'},
   {id:'planta-grande',name:'Planta grande',url:'/assets/furniture/sprites/webp/planta-grande.webp',kind:'2D'},
   {id:'planta-pequena',name:'Planta pequena',url:'/assets/furniture/sprites/webp/planta-pequena.webp',kind:'2D'},
   {id:'quadro',name:'Quadro',url:'/assets/furniture/sprites/webp/quadro.webp',kind:'2D'}
  ]
 }},
 {id:'cowork',name:'Cowork',subtitle:'Híbrido · Moderado',difficulty:'Moderado',level:2,color:'#47c6f0',description:'Espaços compartilhados para trabalho, reunião e convivência, ligados por corredores centrais. Observe circulação, privacidade e uso comum dos recursos.',preview:'cowork',mapLayout:'cowork',rooms:[
  {id:'cowork-bench',name:'Bancada coletiva',kind:'work',staffing:'Equipes em escala',staffed:true},
  {id:'cowork-meeting',name:'Sala de reuniões',kind:'work',staffing:'Equipes em reunião',staffed:true},
  {id:'cowork-rest',name:'Espaço de descanso',kind:'work',staffing:'Pausas compartilhadas',staffed:true},
  {id:'cowork-kitchen',name:'Copa',kind:'work',staffing:'Convivência e apoio',staffed:true},
  {id:'cowork-bathroom',name:'Banheiro coletivo',kind:'support',staffing:'Apoio · não é posto de trabalho',staffed:false}
 ],functionalRooms:4},
 {id:'office',name:'Escritório presencial',subtitle:'Empresa completa · Avançado',difficulty:'Avançado',level:3,color:'#ffca45',description:'A empresa conectada que estamos construindo: setores, salas com equipes, hierarquias e decisões que afetam áreas diferentes.',preview:'office',mapLayout:'office',rooms:[
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
