# Caminhada e conciliação de PRs — 08/11/2026

Base: `codex/unified-social-agenda`, PR #69, `a867822`. Sem merge ou alteração de main.

## Correção implementada

As tarefas usavam porcentagens fixas do intervalo disponível. Um intervalo curto entre viagens comprimia uma tarefa inteira, causando picos de velocidade. O novo `pacedWorkPlan` reserva tempo para cada caminho real e para computador/coleta/colocação antes de começar. Quando não cabe a tarefa completa, usa ida/conversa/volta; se nem isso cabe, aguarda no ponto de origem. Não acelera para alcançar o próximo compromisso.

Limite das tarefas: 1,8 × fator individual × fator de saúde × ritmo global, em unidades do mapa por segundo. Os 16 ritmos individuais e a redução de 40% abaixo de saúde 55 continuam ativos. Ritmo global 0,85 → 0,70, reduzindo os deslocamentos agendados em aproximadamente 18%; cadência procedural das pernas reduzida. Elenco da abertura usa a duração própria do clipe, com velocidades menores.

Não altera dinheiro, regras de receita, saúde salva, frequência prevista de pausas/reuniões nem duração da semana. A fase visual é derivada; nenhum novo registro é salvo.

## Limitação reproduzida — decisão solicitada ao PM

O pátio ampliado levou alguns caminhos a mais de 60 unidades. Com semana de 120 s e sete visitas a cada duas semanas, a viagem ainda é comprimida em poucos segundos. Na amostra de origem do corredor, as velocidades de trânsito chegaram a cerca de 10–21 unidades/s mesmo depois da redução global. **A correção das tarefas não equivale a resolver esses trajetos longos.**

Foi solicitada escolha entre alongar a semana para 15 minutos mantendo a frequência prevista, ou manter 2 minutos e espaçar as visitas. Não adotar nenhuma dessas mudanças sem resposta: muda a experiência econômica/temporal. Ao retomar, unificar também os `120000` fixos do renderer e do robô com `RULES.weekMs`, preservar/migrar activeMs proporcionalmente, recalibrar viagens e testar saves antigos, crédito semanal e fronteiras. A recarga de bateria deve continuar diária no calendário simulado.

## Conciliação de PRs

Inventário com heads, bases, arquivos e prova de ancestralidade: `docs/qa/REVISAO-PRS-2026-11-08.json` (47 PRs abertas no instante da coleta; inventário não é revisão integral de todos os diffs).

Encerradas como substituídas, **sem merge**, 21 PRs cujo head completo já é ancestral de `a867822`: **#20, #23, #24, #25, #26, #27, #28, #32, #33, #34, #36, #37, #38, #39, #40, #43, #44, #45, #46, #47 e #48**. Descrições apontam à #69 e registram SHA preservado. Nenhuma branch removida.

As demais continuam abertas: não basta uma funcionalidade parecer equivalente para descartar commits exclusivos. #49–56 têm ports seletivos; fila de ações, centro de avisos e agenda cíclica já estão na #69. Nesta revisão foram conferidos novamente os deltas de avisos/decisões da #56 e a presença da implementação correspondente. HUD antigo não foi importado.

#74 avançou durante a revisão para `ba945d8`: sala envidraçada, móveis e aquário no `world3d.js` legado, ainda sem QA visual e com TV placeholder. A referência atual foi preservada em `docs/planejamento/SALA-GESTOR-PROPOSTA-PR74.md`. Requer adaptação ao renderer contínuo; não copiar o motor antigo sobre a entrada publicada.

#64 continua sem os PNGs finais da TV; #58/#62/#63 são documentação/auditoria de bases anteriores e precisam confronto atualizado. Fichas/poderes ainda não implementados, animações riggadas de sentar/carregar, encaixe dos novos assentos e QA em aparelhos físicos continuam pendentes. PRs antigas de conteúdo exclusivo permanecem disponíveis para revisão, sem alegar que todo o backlog foi encerrado.

## Verificação executada

- `npm test`: passou, incluindo três novos testes de movimento, intervalos mínimos, continuidade, limite de velocidade e tarefas preservadas.
- Empresa viva + agenda + caminhada: **50/50**, incluindo sete pausas/duas reuniões por ciclo, capacidade, saúde baixa, reload/fronteiras e pausa manual.
- `qa-company-living.py`: **5 resoluções**, 320×844, 1366×768, 390×844, 844×390 e 1440×900; sem exceções. Caminhada riggada, computador, transporte de material, compras, contratação, receita, avisos e persistência verificados. Capturas desktop e celular inspecionadas.
- Sem backend/API da partida: a jornada é navegador → módulos locais → estado sintético/localStorage → renderer. Nenhuma nova variável de ambiente ou chamada paga necessária.
- Evidências em `artifacts/living/`; logs em `artifacts/walk-*.log`. CI e publicação serão vinculados na PR quando concluídos.
