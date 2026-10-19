/** Roster transcribed from PR #22, docs/herois/README.md (85e9282).
 * Selection preview only: no invented abilities, bonuses or unapproved artwork.
 */
export const HERO_ROSTER = Object.freeze([
  {id:'PILHA-H01',name:'Diretor',specialization:'Coordenação / Operações',rarity:'Épico',initials:'DI',status:'Ficha conceitual aprovada'},
  {id:'PILHA-H02',name:'Psicóloga',specialization:'Saúde psicossocial / comportamento humano',rarity:'A definir',initials:'PS',status:'Ficha individual em validação'},
  {id:'PILHA-H03',name:'Dados & IA',specialization:'Ciência de dados / inteligência aplicada',rarity:'A definir',initials:'IA',status:'Ficha individual em validação'},
  {id:'PILHA-H04',name:'Eng. de Segurança',specialization:'Segurança do trabalho / prevenção de riscos',rarity:'A definir',initials:'ES',status:'Ficha individual em validação'},
  {id:'PILHA-H05',name:'P&D Tech',specialization:'Pesquisa, desenvolvimento e tecnologia',rarity:'A definir',initials:'PD',status:'Ficha individual em validação'},
  {id:'PILHA-H06',name:'RS & TD',specialization:'Recursos, talentos e desenvolvimento',rarity:'A definir',initials:'TD',status:'Ficha individual em validação'}
].map(hero=>Object.freeze({...hero,availableInBeta:true})));
export const getHero = id => HERO_ROSTER.find(hero=>hero.id===id)||null;
