# Caminhada e conciliação de PRs — 08/11/2026

Base: `codex/unified-social-agenda`, PR #69, `a867822`. Sem merge ou alteração de main.

## Correção implementada

As tarefas usavam porcentagens fixas do intervalo disponível. Um intervalo curto entre viagens comprimia uma tarefa inteira, causando picos de velocidade. O novo `pacedWorkPlan` reserva tempo para cada caminho real e para computador/coleta/colocação antes de começar. Quando não cabe a tarefa completa, usa ida/conversa/volta; se nem isso cabe, aguarda no ponto de origem. Não acelera para alcançar o próximo compromisso.

Limite das tarefas: 1,8 × fator individual × fator de saúde × ritmo global, em unidades do mapa por segundo. Os 16 ritmos individuais e a redução de 40% abaixo de saúde 55 continuam ativos. Ritmo global 0,85 → 0,70, reduzindo os deslocamentos agendados em aproximadamente 18%; cadência procedural das pernas reduzida. Elenco da abertura usa a duração própria do clipe, com velocidades menores.

Não altera dinheiro, regras de receita, saúde salva nem frequência prevista de pausas/reuniões. A duração da semana foi alterada pela decisão posterior do PM abaixo. A fase visual é derivada; nenhum novo registro é salvo.

## Semana de15 minutos — decisão do PM implementada

O PM escolheu semana de **15 minutos reais (900000 ms)**, preservando pausas e reuniões. A viagem ordinária passou de0,08 para0,095 do período de referência por perna; escalas individuais e de saúde mantidas. Sete pausas e duas reuniões em14 dias continuam completas e sem sobreposição. As reuniões agora chegam ao pátio ampliado, com pontos distintos por participante e orientação para o grupo.

A medição dos caminhos completos (patio/reunião, 16 funcionários, saúde40/70, layouts desktop/celular) passou de cerca de10–21 para **no máximo2,94 unidades/s**. As tarefas possuem limite separado por velocidade individual e distância real. Os testes cobrem continuidade, intervalos curtos e origem/destino.

`RULES.weekMs` governa calendário, renderer, rotina e robô; removidos os120000 fixos nesses consumidores. Bateria continua com recarga diária e receita semanal inalterada. A orientação inicial informa15 minutos; guia de regras já calcula o valor do catálogo. Conversas e reuniões preservam duração proporcional no calendário; a conversa visual se alinha à mesma janela da agenda.

Saves sem `clockWeekMs` são reconhecidos como120 s: `activeMs` é convertido proporcionalmente, mantendo semana, saldo, saúde, compras, eventos, poderes e histórico. A migração é idempotente, sem recompensa/avanço e só é gravada pela transação usual. Erro de armazenamento preserva o JSON original. O teste de poder usado no meio da semana protege recarga fracionária, inclusive antes da validação das habilidades. Recarregar páginas antigas após publicar; uma aba que ainda executa o bundle anterior não conhece a nova duração. Rollback precisa de código compatível com `clockWeekMs`, não de retorno cego ao motor de2 minutos.

O QA encontrou uma disputa no aviso: depois de11 s lendo, Escape podia deixar o alerta expirar antes de reabri-lo. Há agora5 s de tolerância após leitura/foco/hover; fechar manualmente continua imediato. Fluxo real é verificado no navegador.

## Conciliação de PRs

Inventário com heads, bases, arquivos e prova de ancestralidade: `docs/qa/REVISAO-PRS-2026-11-08.json` (47 PRs abertas no instante da coleta; inventário não é revisão integral de todos os diffs).

Encerradas como substituídas, **sem merge**, 21 PRs cujo head completo já é ancestral de `a867822`: **#20, #23, #24, #25, #26, #27, #28, #32, #33, #34, #36, #37, #38, #39, #40, #43, #44, #45, #46, #47 e #48**. Descrições apontam à #69 e registram SHA preservado. Nenhuma branch removida.

As demais continuam abertas: não basta uma funcionalidade parecer equivalente para descartar commits exclusivos. #49–56 têm ports seletivos; fila de ações, centro de avisos e agenda cíclica já estão na #69. Nesta revisão foram conferidos novamente os deltas de avisos/decisões da #56 e a presença da implementação correspondente. HUD antigo não foi importado.

#74 avançou durante a revisão para `ba945d8`: sala envidraçada, móveis e aquário no `world3d.js` legado, ainda sem QA visual e com TV placeholder. A referência atual foi preservada em `docs/planejamento/SALA-GESTOR-PROPOSTA-PR74.md`. Requer adaptação ao renderer contínuo; não copiar o motor antigo sobre a entrada publicada.

#64 continua sem os PNGs finais da TV; #58/#62/#63 são documentação/auditoria de bases anteriores e precisam confronto atualizado. Fichas/poderes ainda não implementados, animações riggadas de sentar/carregar, encaixe dos novos assentos e QA em aparelhos físicos continuam pendentes. PRs antigas de conteúdo exclusivo permanecem disponíveis para revisão, sem alegar que todo o backlog foi encerrado.

## Verificação executada (cada evidência identifica a versão)

- `npm test`: passou, incluindo testes de movimento, intervalos mínimos, continuidade, limite de velocidade e tarefas preservadas.
- Empresa viva + agenda + caminhada: **55/55**, incluindo sete pausas/duas reuniões por ciclo, capacidade, saúde baixa, reload/fronteiras e pausa manual.
- Na primeira correção (`c461dc6`), `qa-company-living.py`: **5 resoluções**, 320×844, 1366×768, 390×844, 844×390 e 1440×900; sem exceções. Caminhada riggada, computador, transporte de material, compras, contratação, receita, avisos e persistência verificados. Capturas desktop e celular inspecionadas.
- Sem backend/API da partida: a jornada é navegador → módulos locais → estado sintético/localStorage → renderer. Nenhuma nova variável de ambiente ou chamada paga necessária.
- Evidências em `artifacts/living/`; logs em `artifacts/walk-*.log`. A validação de15 minutos inclui seis testes próprios de migração, poderes, robô e velocidade dos trajetos; anexo e robô passaram também no navegador desktop/celular. CI e evidência final da nova cadência serão vinculados na PR.
