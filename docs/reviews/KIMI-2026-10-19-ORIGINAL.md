# Revisão pedagógica e técnica — PilhA+ Game NR1 (Alpha 1.4 + branch de investimentos)
Data da revisão: 2026-10-19 · Escopo: main (Alpha 1.4) + branch feat/investment-psychosocial-domains (PR #13)

## 1. Panorama do que foi revisado

### Os cinco casos jogáveis (main)
| # | Caso | Tema | Mecânica | Risco inicial |
|---|------|------|----------|---------------|
| 01 | Galpão logístico | Sobrecarga, jornada, turnos, conflitos | Motor profundo (simulation/case01.js: 8 ações, 6 monitoramentos, modificador de qualidade da investigação, violações) | 78/100 |
| 02 | Liderança e reuniões | Segurança psicológica, silêncio | 4 escolhas fixas + simulação própria (simulation/case02.js) | 72/100 |
| 03 | Gestão de pessoas | Autonomia, papéis, demandas contraditórias | 4 escolhas in-shell (cases-data.js) | 70/100 |
| 04 | Saúde e bem-estar | Sigilo, escuta, prevenção | 4 escolhas in-shell | 64/100 |
| 05 | Tecnologia e TI | Plantões, hiperconexão, descanso | 4 escolhas in-shell | 76/100 |

Pontuação: pesos 0–25 por opção, meta 75/100, desbloqueio sequencial, melhor pontuação preservada, estado persistido em localStorage.

### Os 12 domínios de investimento psicossocial (branch PR #13 — simulation/investment.js)
1. Segurança psicológica · 2. Prevenção ao assédio e respeito · 3. Psicoeducação e saúde mental · 4. Ergonomia e adequação da tarefa · 5. Condições físicas do ambiente · 6. Espaço, altura e confinamento · 7. Carga, ritmo e jornada · 8. Autonomia e clareza de papel · 9. Liderança e justiça organizacional · 10. Relações e gestão de conflitos · 11. Mudanças e segurança no emprego · 12. Apoio, recuperação e retorno

Mecânica: orçamento de 10.000 créditos, 12 melhorias compráveis (custo total 16.800 → obriga triagem), prioridades crítica/alta/média, efeitos em 4 indicadores (workload, wellbeing, trust, turnoverRisk), previsões educacionais com linguagem hedged resolvidas em 30 dias, persistência local.

### Sistemas transversais
- company-state.js: estado global da empresa com histórico (últimos 12 eventos) e modificadores que alteram a dificuldade dos Casos 02–05.
- management.js: decisão de gestão diante de sinal de adoecimento (acolher/adiar/demitir) — demitir gera trust −22, turnoverRisk +28, status "unattended", ensinando que demissão não trata risco organizacional.
- Missão 01 (NR-1): biblioteca + quiz 2D/3D, 70/100 e 2/3 acertos para liberar o Caso 01.

## 2. Fontes oficiais — âncoras normativas e científicas

### Normas brasileiras (verificar numeração antes de citar em material público)
- NR-1/GRO e PGR — Portaria SEPRT nº 6.734/2020 (inclui riscos psicossociais no inventário, em vigor desde jan/2022) e atualização pela Portaria MTE nº 1.419/2024.
- Portaria MTE nº 3.733/2024 — guias técnicos de Inventário de Riscos e de PGR.
- NR-17 (Ergonomia) e NR-5 (CIPA) como complementares aos domínios 4–7.
- Resolução CFP nº 02/2019 (SATEPSI) e Código de Ética do Psicólogo (Resolução CFP nº 010/2005) — para os conteúdos de escuta, sigilo e consentimento (Caso 04).
- LGPD (Lei 13.709/2018) — dados sensíveis de saúde; reforça as escolhas anti-"prontuário nominal" dos casos.
- Lei 14.457/2022? Não — verificar: possível ratificação brasileira da Convenção OIT nº 190 (violência e assédio) — confirmar status antes de citar.

### Referências internacionais para fundamentar os 12 domínios
- ISO 45003:2021 — primeiríssima norma internacional de saúde psicológica e segurança no trabalho; mapeamento direto com os 12 domínios.
- HSE Management Standards (Reino Unido) — 6 áreas: demands, control, support, relationships, role, change; taxonomia consolidada e gratuita, boa âncora pedagógica.
- COPSOQ III (Copenhagen Psychosocial Questionnaire) — repositório validado de fatores psicossociais.
- WHO/ILO Guidelines on mental health at work (2022).

Recomendação documental: criar docs/FONTES-E-MAPEAMENTO.md com uma matriz domínio → âncora normativa (NR-1/NR-17/ISO 45003/HSE) → caso(s) que o exercitam → upgrade(s) que o financiam → pergunta(s) do quiz Missão 01. Isso fecha o ciclo de rastreabilidade pedagógica e blinda o projeto contra a crítica de conteúdo sem fonte.

## 3. Oportunidades de aprimoramento pedagógico (priorizadas)

### P1 — Violações de ética não falham o caso nos Casos 02–05 (inconsistência interna)
Caso 01 (motor profundo) registra violações (surveillance, healthfiles) e o Caso 02 (case02.js) aplica −25. Mas a pontuação in-shell de cases-data.js (outcome()) soma apenas pesos: escolher "Publicar os nomes de quem procurou atendimento" (0 pts) no Caso 01-in-shell ou "Exigir dados clínicos nominais" (Caso 04) ainda permite passar com 75 se as outras três escolhas forem perfeitas. Pedagogicamente, violação de sigilo/ética deveria falhar o caso independentemente da soma — o próprio jogo ensina isso. Implementar flag de violação em cases-data.outcome().

### P2 — Escore do Caso 02 ignora o próprio métrico central
case02.js ajusta e reporta `silence` (e aplica modificador de silêncio da empresa), mas a fórmula de pontuação usa só psychologicalSafety, learning e leadershipTrust. Ou entra silence na fórmula ou sai do relatório — hoje o aluno vê um número que não influencia nada.

### P3 — Duas fontes de verdade para o Caso 01
Caso 01 existe como motor profundo (caso01.js, 8 ações/6 monitoramentos) e como 4 escolhas fixas em cases-data.js (usadas no hub/listagem). Risco de deriva pedagógica: atualizar um e esquecer o outro. Unificar: o hub deveria usar o motor profundo, e cases-data.js deixar de carregar steps para o Caso 01.

### P4 — Curva de aprovação binária demais
75 = exatamente 3×25. Um acerto parcial em duas etapas reprova (25+25+8+8=66), mas uma violação grave com três acertos perfeitos passa (ver P1). Sugestões: (a) implementar violações (P1) já corrige o pior caso; (b) testar meta 70 ou pesos 0/10/20/25 em piloto; (c) permitir "revisar com dica" sem zerar tentativa — o jogo já preserva bestScore, então custo baixo.

### P5 — Feedback dos Casos 02–05 é genérico na reprovação
O motor do Caso 02 emite uma única linha genérica quando o caminho não é o "seguro", embora cada opção já carregue texto justificativo em cases-data.js. Mostrar as justificativas das escolhas feitas (não só das corretas) no relatório final — material pedagógico já existe, só não é exibido por opção.

### P6 — Catálogo de 12 domínios mistura grupos de risco do GRO com fatores psicossociais estritos
Domínios 4–6 (ergonomia, condições físicas, espaço/altura/confinamento) são grupos físico/ergonômico do inventário NR-1, não psicossociais. Duas saídas honestas: (a) renomear o módulo para "investimentos em SST/prevenção" e justificar a integração; ou (b) reorganizar com hierarquia (fatores psicossociais puros × condições físicas que os modulam). Como está, um especialista pode apontar incoerência conceitual.

### P7 — Efeitos das melhorias são aditivos e sem interação
Todas as 12 melhorias somam deltas fixos nos mesmos 4 indicadores. Oportunidade pedagógica de ouro: introduzir sinergias (ergonomia × pausas) e retornos decrescentes, ensinando pensamento sistêmico — exatamente a tese do GDD ("Detectar → Investigar → Identificar → Priorizar → Intervir → Acompanhar → Evoluir"). Manter previsões hedged.

### P8 — Ausência de domínio de reconhecimento/recompensa e DE&I
Comparando com HSE/COPSOQ: "role" e "change" estão cobertos (domínios 8 e 11), mas reconhecimento justo e diversidade/equidade/inclusão aparecem só de passagem (liderança-justiça, assédio-respeito). Considerar 13º/14º domínio ou explicitar no sumário por que ficam fora do escopo do jogo.

### P9 — Quiz da Missão 01 sem rastreabilidade verificada
Conteúdo da biblioteca/quiz precisa de conferência item a item contra o texto oficial da NR-1 (Portaria 6.734/2020 e guias da Portaria 3.733/2024), com referência por item. Hoje não há docs com a chave de respostas auditada.

### P10 — Acessibilidade e mobile com devedores declarados
O próprio ALPHA-14.md admite: inspeção visual real Chrome/Safari e toque pendentes; painel mobile recolhível; leitura de detalhes limitada em telas pequenas. Plano: WCAG 2.2 AA, axe-core no CI, teste em aparelho físico iOS/Android, alternativa 2D garantida (já existe fallback — formalizar como critério de aceite).

## 4. Recomendações para Claude e Manus

### Claude (consistência conceitual, redação pedagógica, documentação)
1. Gerar docs/FONTES-E-MAPEAMENTO.md: matriz 12 domínios × âncoras (NR-1, NR-17, ISO 45003, HSE) × casos × upgrades × quiz. Cada célula com citação real e verificável; onde não houver fonte, marcar "sem âncora — revisar".
2. Red-team pedagógico das 20 perguntas dos casos: nível de leitura (ensino médio como alvo), ambiguidade, desejabilidade social, viés cultural/regionais. Entregar tabela item × risco × sugestão.
3. Redigir feedbacks específicos de reprovação para os Casos 02–05 a partir dos textos justificativos já existentes em cases-data.js (entrega pronta para colar).
4. Propor spec técnica de violação em outcome(): quais option-ids disparam flag, copy da mensagem, efeito em score (sugestão: cap 49 ou fail direto para violações graves).
5. Script de revisão por especialistas (psicólogo organizacional + engenheiro de segurança do trabalho): rubrica adaptada dos Gates 1–4 do projeto Caramelo (mesmo autor, mesmo padrão de qualidade).
6. Cercas: nunca inventar número de portaria; nunca afirmar validade/conformidade; marcar tudo como hipótese editorial sujeita a revisão humana.

### Manus (QA funcional, navegador, acessibilidade, pipeline)
1. Executar node tests/alpha14.test.mjs e tests/investment-system.test.mjs (branch) e registrar saída real no PR #13 — o doc de continuidade exige isso explicitamente.
2. Estender cobertura: fronteiras de score (74/75/76), persistência/migração de estado, lógica de desbloqueio, dupla fonte do Caso 01, e teste de regressão para o P1 (violação + 75 pts deve falhar após a correção).
3. QA de navegador pendente (declarado nos docs): desktop + mobile 320/375/390/430 px, retrato/paisagem, Safari iOS e Android Chrome físicos, toque nos setores/personagens GLB, console limpo. Evidenciar com screenshots/vídeo no PR.
4. Rodar axe-core + verificação de contraste/foco/labels/reduced motion; abrir issues com WCAG SC específico.
5. Auditoria de localStorage: chaves, ausência de PII, comportamento em modo privado/quota excedida.
6. Cercas: sem merge/deploy sem autorização expressa (já é regra do repo); não declarar teste executado sem evidência; não criar avatares procedurais como substituto de assets.

## 5. Síntese executiva
O projeto está pedagogicamente maduro para um alpha: narrativa correta (foco organizacional, não individual), violações de privacidade tratadas como erros no Caso 01, sistema de continuidade entre casos ensina consequência de gestão, e o catálogo de 12 domínios com triagem orçamentária (10k vs 16,8k) é uma excelente mecânica de priorização. Os três maiores retornos pedagógicos por esforço: (1) violações falham caso em todos os cinco casos; (2) matriz de fontes rastreável; (3) feedback específico por escolha nos Casos 02–05. Os devedores críticos são de QA real de navegador/mobile e revisão externa especializada — ambos já admitidos na documentação, o que é sinal de governança saudável.
