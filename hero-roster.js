/** Roster reconciled with PR #22, docs/herois/README.md (1737278).
 * Selection preview only: no invented abilities, bonuses or unapproved artwork.
 */
export const HERO_ROSTER = Object.freeze([
  {id:'PILHA-H01',name:'Diretor',specialization:'Coordenação / Operações',rarity:'Épico',initials:'DI',status:'Ficha conceitual aprovada'},
  {id:'PILHA-H02',name:'Psicóloga',specialization:'Prevenção Psicossocial · Guardiã do Equilíbrio Humano',rarity:'Épico',initials:'PS',status:'Ficha conceitual documentada · execução temporal pendente'},
  {id:'PILHA-H03',name:'Cientista de Dados',specialization:'Análise, hipóteses e inteligência aplicada',rarity:'Épico',initials:'IA',status:'Ficha conceitual documentada'},
  {id:'PILHA-H04',name:'Engenheiro de Segurança',specialization:'Higiene Ocupacional / prevenção de riscos',rarity:'Épico',initials:'ES',status:'Ficha conceitual documentada'},
  {id:'PILHA-H05',name:'P&D Tech',specialization:'Arquiteto da Transformação · inovação híbrida',rarity:'Lendário',initials:'PD',status:'Ficha conceitual documentada · execução temporal pendente'},
  {id:'PILHA-H06',name:'RS & TD',specialization:'Recursos, talentos e desenvolvimento',rarity:'A definir',initials:'TD',status:'Ficha individual em validação'}
].map(hero=>Object.freeze({...hero,availableInBeta:true})));
export const getHero = id => HERO_ROSTER.find(hero=>hero.id===id)||null;
