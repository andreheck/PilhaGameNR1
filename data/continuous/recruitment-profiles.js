/** Narrative profiles for optional hires, separate from the 16 canonical NPCs. */
export const SAMIR_HADDAD_PROFILE = Object.freeze({
  id: 'NOVO-09',
  name: 'Samir Haddad',
  type: '—',
  archetype: 'O Articulador',
  group: 'novos',
  portrait: '/assets/character-concepts/2026-11/scores/samir-haddad/base.webp',
  age: 34,
  roleLabel: 'Analista de processos e conformidade',
  summary: 'Conecta procedimentos às rotinas reais e ajuda a equipe a encontrar soluções claras e praticáveis.',
  strengths: [
    'Analisa processos e identifica etapas que geram retrabalho',
    'Escuta diferentes perspectivas antes de propor mudanças',
    'Comunica procedimentos com clareza e respeito intercultural'
  ],
  watchouts: [
    'Mudanças de procedimento sem tempo para adaptação',
    'Regras ambíguas ou aplicadas de modo inconsistente',
    'Pausas e rotinas pessoais desconsideradas no planejamento'
  ],
  favorableConditions: [
    'Agenda previsível e pausas respeitadas',
    'Participação nas mudanças que afetam os processos',
    'Critérios e responsabilidades documentados'
  ],
  adverseConditions: [
    'Retrabalho frequente por orientações contraditórias',
    'Pressão por conformidade sem recursos ou instruções suficientes',
    'Decisões que ignoram a experiência de quem executa o processo'
  ],
  situationalSignals: [],
  proposedSynergies: ['NPC-01', 'NPC-05'],
  environments: null,
  proposedEffects: null,
  status: 'narrativa_editorial_v1',
  disclaimer: 'Perfil narrativo fictício; identidade religiosa, idade e aparência não determinam saúde, competência ou desempenho.'
});
