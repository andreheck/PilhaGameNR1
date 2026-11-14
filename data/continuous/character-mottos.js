// Frases editoriais dos personagens. São lemas ficcionais, não falas históricas.
export const CHARACTER_MOTTOS = Object.freeze({
  'NPC-01':'Planejar é abrir espaço para o trabalho acontecer.',
  'NPC-02':'Perguntar melhor é o começo de uma solução melhor.',
  'NPC-03':'Resultado sustentável começa com prioridades claras.',
  'NPC-04':'Uma boa pergunta também move a equipe.',
  'NPC-05':'Direitos respeitados fortalecem as relações de trabalho.',
  'NPC-06':'Escuta cuidadosa muda o jeito de trabalhar.',
  'NPC-07':'Uma decisão fica mais forte quando a equipe participa.',
  'NPC-08':'Ideias crescem quando a colaboração tem espaço.',
  'NPC-09':'Processo bem cuidado faz o trabalho fluir.',
  'NPC-10':'Cuidar da equipe também é organizar o trabalho.',
  'NPC-11':'Eficiência boa é a que preserva qualidade e segurança.',
  'NPC-12':'Acolhimento e clareza tornam o atendimento mais humano.',
  'NPC-13':'Melhoria prática começa observando como as coisas funcionam.',
  'NPC-14':'Um ambiente melhor começa com atenção aos detalhes.',
  'NPC-15':'Agilidade de verdade precisa de organização.',
  'NPC-16':'Criatividade também precisa de tempo e espaço.',
  'EXPLORER-JOVEM-PROFISSIONAL':'Cada lugar novo ensina algo sobre como trabalhamos.',
  'EXPLORER-ADVOGADO':'Direitos aparecem nas pequenas decisões do dia a dia.',
  'EXPLORER-DIRETORA-ENSINO':'Conhecimento compartilhado transforma o trabalho.'
});

export function characterMotto(id) {
  return CHARACTER_MOTTOS[id] || 'O trabalho melhora quando as pessoas têm espaço para contribuir.';
}
