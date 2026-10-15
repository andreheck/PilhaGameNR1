# Gameplay e simulação de ambientes psicossociais — proposta implementável

**Status:** especificação inicial para protótipo. Todas as pontuações e consequências são ficcionais e destinadas à aprendizagem.

## Objetivo

Transformar o PilhA+ Game em um simulador de decisões organizacionais. A pessoa jogadora explora ambientes predefinidos, observa sinais nos personagens, investiga fatores de trabalho e escolhe intervenções. O sistema mostra custo, justificativa, impacto simulado e riscos que permanecem.

## Loop principal

1. Entrar em um ambiente (escritório de TI, logística, saúde, construção civil ou operação industrial/portuária).
2. Observar personagens e sinais visuais; clicar em um personagem abre a ficha individual.
3. Consultar indicadores, evidências e fatores do ambiente, sem inferir diagnóstico clínico.
4. Selecionar uma melhoria adequada ao fator identificado.
5. Conferir orçamento, requisitos, prazo e alcance da intervenção.
6. Aplicar a ação e comparar estado anterior e posterior.
7. Acompanhar os efeitos e revisar o plano quando o problema persistir.

## Personagem e humor

A ficha do personagem exibe seis domínios de aprendizagem (0–100): saúde física percebida, bem-estar emocional, conexão/apoio social, satisfação no trabalho, condições de segurança/ambiente e recuperação/descanso. Valores altos indicam condições simuladas mais favoráveis. O score geral é uma média ponderada configurável; no protótipo inicial, pesos iguais.

O emoji é uma síntese lúdica do score, nunca uma medição clínica. Faixas iniciais sugeridas: 0–39 😡 crítico no jogo; 40–59 😟 atenção; 60–74 😐 instável; 75–89 🙂 favorável; 90–100 😄 muito favorável. São faixas de UX não validadas e devem ser revisadas com especialistas e usuários.

**Salvaguarda:** riscos críticos de segurança e alertas específicos aparecem separadamente e não podem ser apagados por uma média elevada. Não usar emojis para rotular ou culpabilizar trabalhadores. Exibir “sinal para investigar”, não “diagnóstico”.

## Catálogo inicial de intervenções

| Intervenção | Categoria | Domínios que pode afetar no jogo | Princípio |
|---|---|---|---|
| Ajustar cadeira, mesa e monitor | Ergonomia | saúde física; condições ambientais | Corrigir inadequação do posto |
| Melhorar iluminação/ventilação/ruído | Ambiente | condições ambientais; saúde física | Adequar a condição à tarefa |
| Simplificar software e reduzir retrabalho | Processo digital | satisfação; bem-estar emocional | Remover fricção operacional real |
| Fornecer EPI adequado e treinar uso | Segurança | condições de segurança; saúde física | Complementa a hierarquia de controles; não substitui proteção coletiva |
| Revisar metas, jornada e carga | Organização do trabalho | descanso; bem-estar emocional; satisfação | Priorizar causas organizacionais |
| Redimensionar equipe e redistribuir tarefas | Organização do trabalho | descanso; conexão social; satisfação | Tratar capacidade e distribuição de trabalho |
| Desenvolver liderança e clareza de papéis | Gestão | apoio social; satisfação; bem-estar emocional | Apoio, autonomia, respeito e previsibilidade |
| Escuta participativa com devolutiva | Participação | apoio social; satisfação | Envolver trabalhadores na identificação e avaliação |
| Palestra ou ação individual de bem-estar | Complementar | efeito restrito e contextual | Nunca substituir mudanças necessárias no trabalho |

Os efeitos do catálogo são parâmetros de jogo, não estimativas científicas de eficácia. Intervenções podem ter custo, requisitos, efeitos limitados e necessidade de acompanhamento.

## Modelo de dados

- **Ambiente:** id, tipo, riscos observados, recursos, melhorias instaladas, orçamento e histórico.
- **Personagem:** id fictício, função, turno opcional e scores sintéticos por domínio. Não armazenar dados clínicos reais.
- **Intervenção:** id, custo, categoria, domínios-alvo, efeito simulado, escopo, requisitos, duração e explicação pedagógica.
- **Evento:** estado anterior/posterior, decisão, justificativa, custo, efeito observado e riscos remanescentes.

O motor fica separado da interface. A UI pode ser HTML/CSS/JS hoje e migrar para React/TypeScript/Phaser no futuro sem reescrever as regras de negócio.

## Regras de cálculo e prevenção de atalhos

- Normalizar os scores para 0–100.
- Score individual = média ponderada dos domínios disponíveis.
- Score coletivo = média dos scores individuais, acompanhado da distribuição e dos alertas, não apenas de um número.
- O score não é “índice de risco psicossocial” validado, indicador epidemiológico nem evidência de conformidade NR-1/GRO/PGR.
- Alertas críticos permanecem visíveis independentemente da média.
- Ações individuais de bem-estar não corrigem automaticamente metas inviáveis, assédio, falta de pessoal ou condições inseguras.
- Não penalizar trabalhadores por apresentar score baixo. A responsabilidade da simulação é investigar o contexto e corrigir condições de trabalho.
- Mostrar a razão do efeito: “esta ação afeta estes domínios porque…”, com linguagem de aprendizagem.
- Manter dados fictícios, sem login e sem dados pessoais reais no MVP.

## Critérios de aceite do primeiro protótipo

1. Clique em personagem abre ficha com seis domínios, score geral, emoji e alertas separados.
2. Catálogo mostra custo, categoria, efeito esperado, requisitos e justificativa.
3. Intervenção reduz orçamento e altera apenas domínios configurados, respeitando limites 0–100.
4. Ação sem orçamento ou com requisito não atendido não altera o estado.
5. Histórico registra ação, custo e resultado.
6. Score alto não elimina alertas críticos.
7. Interface funciona em mobile, teclado e desktop; emoji tem rótulo textual acessível.
8. Testes automatizados cobrem cálculo, limites, orçamento, efeitos e salvaguardas.

## Próxima etapa de produto

Começar com um ambiente-piloto de logística, cinco personagens sintéticos e seis a nove intervenções. Validar compreensão e equilíbrio com representantes de liderança, RH/SST e trabalhadores antes de multiplicar ambientes. A revisão técnico-científica e jurídica deve preceder qualquer uso como ferramenta profissional de avaliação.
