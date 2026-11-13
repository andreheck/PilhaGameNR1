# Revisão de testes e backlog — 24/10/2026

Escopo: fechar PR #41 (NPCs, organograma, gestão e receita semanal), sobre `a238a51`. Não integrar automaticamente novas mecânicas de branches concorrentes.

## Falha encontrada e correção

As suítes Node do commit `a238a51` passaram, mas o QA de navegador parou na abertura: clicava no splash enquanto a transição automática de 800 ms já o ocultava. O teste agora aguarda o botão real Pular introdução ficar visível. Não força cliques nem altera a abertura do produto. A nova rodada completa fica vinculada na PR. A cobertura ampliada também encontrou mapa com menos de200px em844×390: o layout landscape agora reserva240px ao canvas e permite rolagem vertical para acessar todos os controles, sem reduzir ou esconder ações.

## Matriz de cobertura da entrega

| Requisito do backlog | Cobertura executável atual |
|---|---|
| 16 IDs/artes canônicos, sem troca, alfa e arquivo íntegro | 9 testes de perfis; manifesto e hashes; todos os perfis no navegador |
| Fichas roxa/verde/azul/amarela, desktop e celular | Capturas versionadas e capturas de CI |
| Falha de retrato e recuperação | 404 controlado com SVG da mesma pessoa e estado inalterado |
| Movimento automático com redução decorativa de movimento | Testes do renderer e navegador com reduced-motion ativo |
| Pausa, câmera e localizar em setor/restauração | Testes unitários e navegador |
| Teclado e foco em ficha | Tab até Localizar, Shift+Tab/Enter para lista, retorno ao mesmo ID |
| Toque | Navegação por tap em contextos móveis com has_touch; sem aparelho físico |
| 1366×900, 390×844, tela320px, landscape e 1440×900 | QA completo em 1366×900, 390×844, 320×844, 844×390 e 1440×900 |
| Organograma, média dos setores e influência semanal | 3 gerentes/6 conselheiros/16 cargos; vínculo da ficha; atualização ao vivo após ciclo |
| Gestão >40/70, −5/+7, limites e persistência | 21 testes de empresa viva antes da receita; mantidos nos 26 atuais |
| Receita500 + épicos250; troca de dupla; uso em compras | Testes unitários + depósito1000/HUD no navegador |
| Múltiplas abas | Duas páginas reais no mesmo contexto, storage compartilhado/Web Locks, um crédito semanal; teste atômico Node com falha de escrita |
| Save antigo, recarga, eventos pendentes, orçamento | Migração sem retroativo; reload; decisão não respondida automaticamente; catálogo sem gastos |
| Portabilidade do static-flow antiga | npm test passa nas rodadas recentes, incluindo Windows e Linux; não é falha aberta nesta base |

Os resultados efetivos, erros e capturas de cada resolução ficam em `living-qa/report.json` no artefato da execução. Não confundir suíte configurada com suíte concluída: conferir a conclusão da rodada final na PR.

## Pendências que continuam abertas

- Leitor de tela real, contraste medido formalmente, zoom real do navegador a200%, aparelho físico/Safari e avaliação humana da compreensão/balanceamento. Não foram marcados como executados.
- Sessão humana longa e acompanhamento de memória por horas. A reconciliação de500semanas tem testes automatizados, mas não substitui uma sessão real longa.
- Fallback 2D/WebGL dos casos legados: escopo antigo arquivado, não confundir com fallback de retrato atual. Casos permanecem preservados e não foram reativados.
- Rotas completas diárias ao pátio, sprites individualizados, serviços, ausência/retorno e poderes SAMPLE: backlog de funcionalidades futuras, não testes faltantes da Fase1.
- Mobiliário/Poof tem instruções em `origin/feat/mobiliario-poof-asset-pipeline:docs/backlog/MOBILIARIO-POOF-CODEX.md`; binários e integração ficam em entrega própria. O teste da demo isolada não homologa o jogo.
- Novas branches financeiras, contratação, ausência e dashboard foram encontradas no remoto em24/10; não foram mescladas nesta revisão. Regras divergentes de receita/saúde precisam de integração explícita antes de validação conjunta.

## Fontes verificadas

`docs/backlog/CODEX-NPC-ARTS.md`, `docs/backlog/RESTAURACAO-CODEX.md`, `docs/qa/CHECKLIST-DIARIO-ANDRE.md`, `docs/qa/PG-001-VALIDACAO.md`, `design-qa.md`, especificação da Fase1 e relatórios de gestão/receita. Itens de tela antiga/Casos não são aceite do modo contínuo atual. Regras mais recentes do PM prevalecem sobre restrições históricas de não alterar saúde/economia.

O card de índice do cabeçalho também foi corrigido: o CI mediu329px em um viewport de320px; a grade e o rótulo agora podem encolher/quebrar sem cortar conteúdo. O commit4b59caf passou nas cinco resoluções, incluindo o teste real de duas abas e teclado. O pedido posterior do PM acrescentou cabeçalho translúcido e agrupamento dos elementos; a rodada final repete a mesma matriz e verifica cabeçalho/calendário. Relatório: `docs/releases/CABECALHO-2026-10-24.md`.

Sem merge ou publicação em produção. Aprovação final da PR continua com o PM.

## Continuação do PM: trajetos e pátio

O pedido posterior autorizou integrar trajetos, pausas, pátio e benefícios temporários, preservando a versão mostrada no print. As contribuições de mobiliário/Poof, pessoal e finanças de75c5b23 foram incorporadas na branch de revisão e testadas em conjunto, com os aportes semanais em rubrica separada. Os itens acima sobre integração futura dessas branches são históricos; não se referem ao estado desta continuação. Relatório: `docs/releases/ROTINAS-PATIO-2026-10-25.md`. Permanecem pendentes sprites/rigs individuais e a homologação humana/dispositivos/acessibilidade. Sem promoção de produção.
