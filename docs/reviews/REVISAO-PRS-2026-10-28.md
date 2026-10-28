# Revisão técnica das PRs — 28/10/2026

## Escopo e limites

Snapshot de 40 PRs abertas antes desta entrega. Revisão técnica da cadeia recente #50 → #49 → #51 → #52 → #53 → #54 → #55; as outras 33 receberam inventário e comparação de ancestralidade, não uma aprovação de conteúdo. Nenhuma branch foi removida, PR fechada, revisão humana substituída, merge executado ou alias publicado. Os heads de todos os 40 itens foram conferidos no GitHub; todos os commits existem localmente.

Base integrada examinada: `f6afe4328f64381c0f1038bcda53457c2954aaca`. Correções em `codex/revisao-prs-2026-10-28`, empilhada sobre #55, sem reescrever as sete branches anteriores. Inventário rastreável: [JSON](../qa/revisao-prs-2026-10-28.json).

## Parecer por PR

| Ordem | PR | Head examinado | Parecer técnico |
|---|---|---|---|
| 1 | [#50](https://github.com/andreheck/PilhaGameNR1/pull/50) | `14e9166` | Depende da correção CRLF já presente na #51; CI próprio de Actions não encontrado no head. |
| 2 | [#49](https://github.com/andreheck/PilhaGameNR1/pull/49) | `2cb4e99` | Sem novo bloqueio técnico identificado no contrato de save. |
| 3 | [#51](https://github.com/andreheck/PilhaGameNR1/pull/51) | `d819876` | Sem novo bloqueio técnico identificado; revisão manual de acessibilidade continua pendente. |
| 4 | [#52](https://github.com/andreheck/PilhaGameNR1/pull/52) | `f8d02bd` | P2: Espaço em botões era interceptado pelo atalho de pausa. Corrigido nesta entrega. |
| 5 | [#53](https://github.com/andreheck/PilhaGameNR1/pull/53) | `db52714` | Sem novo bloqueio técnico identificado na geometria e nas rotas. |
| 6 | [#54](https://github.com/andreheck/PilhaGameNR1/pull/54) | `dc1dd4a` | Sem novo bloqueio técnico identificado na lotação/escala atual; parâmetros visuais e interação com assentos seguem revisão PO. |
| 7 | [#55](https://github.com/andreheck/PilhaGameNR1/pull/55) | `f6afe43` | P2: pausa remarcada podia sobrepor a seguinte. Corrigido nesta entrega. |

Sem threads de revisão pendentes encontradas nas sete PRs consultadas. Isso não equivale a parecer de UX ou aceite do PO. Todas seguem rascunho para essas etapas e para decisão do PM.

## Achados corrigidos

### P2 — pausas remarcadas sobrepostas (#55)

Reprodução no head f6afe43: NPC-02, saúde-base 40, semana 2. Pausa A em 42.747–55.560 ms da semana e pausa B em 53.571–66.385 ms: quase dois segundos de sobreposição. Ao terminar a primeira, o renderer encontra a segunda já em andamento e salta no trajeto. A causa era deslocar cada pausa isoladamente para liberar a reunião, sem reservar a pausa vizinha.

A correção resolve um ciclo determinístico de 14 dias (sete pausas e duas reuniões), respeitando todas as reservas anteriores. Não remove pausas nem paga novos benefícios. Normaliza apenas ruído de ponto flutuante nas fronteiras temporais. Templates em cache privado limitado; datas e IDs absolutos reconstruídos sem gravar estado. Testes cobrem saúde 0/40/54,99/55/70/100, semanas 1/2/3/20/99999, sete pausas por quinzena, reunião semanal única, ausência de sobreposição e continuidade após refresh/reload no intervalo problemático.

### P2 — Espaço interceptado em controles focados (#52)

O listener global tratava Espaço como pausa mesmo com foco no botão Menu ou Avançar semana. A correção preserva a ativação nativa de botões, links, summary e controles ARIA; Espaço no canvas continua como atalho de jogo. O teste de navegador antigo reproduzia o comportamento errado ao manter foco em Menu. Foi corrigido e ampliado: Menu abre por Espaço sem mudar pausa; Avançar semana ativa uma vez por Espaço; N continua funcionando fora de diálogos/campos e o segundo aporte ocorre apenas uma vez. Atalhos desativáveis, proteção em inputs e foco/Esc continuam testados. O roteiro aguarda o evento de fechamento e a restauração do foco antes de focar o canvas. A regressão dos rigs aguarda uma fase real de caminhada e exige avanço dos frames de walk; pausas/conversas não são falsamente tratadas como falha de animação.

### P2 — Botão Semana comprimido no celular com painel aberto (#52)

Capturas da revisão revelaram que ocultar a meta no painel setorial deslocava automaticamente os controles na grade móvel: Semana ocupava a coluna de 44 px. Colunas e linha dos cinco controles agora são explícitas, preservando os 84 px do avanço. QA verifica o texto também com painel aberto.

## Consolidação #50 e portão de CI

O head 14e9166 é descendente exato de fin/integration em 28c1de8. Não há necessidade de portar novamente galeria, fichas ou circulação. A consulta direta de check-runs retornou apenas Vercel Preview Comments aprovado; a consulta de workflows de PR não retornou execução desse head. Não confundir ausência de comentários da Vercel com testes de software.

Foi exportado o commit original para artifacts/pr50-review-source, sem alterar Git ou a branch. Build e npm test passaram. Executar todos os arquivos encontrou 208 testes aprovados e uma falha: mission01.test.mjs não injeta o harness quando mission01.js contém CRLF. A correção já existe na #51. Em experimento controlado, somente o harness de teste da #51 foi aplicado à exportação isolada: 209 testes aprovados. Isso não transforma o head original em um head sem falhas. A cadeia integrada e corrigida passa em 232 testes. A evidência de CI desta entrega será vinculada à PR; o CI próprio do head original #50 permanece uma ressalva para decisão de liberação.

## Evidências e critérios

Revisadas diferenças da consolidação, contrato de saves, metadados de armazenamento, CI/semântica acessível, handlers de teclado, câmera/grafo, lotação inicial/máxima de móveis, alturas dos rigs e agenda temporal. Testes sintéticos preservam orçamento, compras, equipe, saúde persistida e eventos do save fin. Nenhuma chave localStorage nova, versão alterada ou migração nesta revisão.

Verificação local: build, 232 testes, compilação do roteiro Python e git diff --check. Novas evidências de navegador e conclusões dos pipelines serão registradas no corpo da PR desta revisão, incluindo SHA e artefatos. As capturas anteriores da #55 estão em artifacts/social-accepted-review e foram mantidas como referência; não representam a execução nova das correções.

## PRs históricas

Das 33 anteriores, 22 são ancestrais do runtime examinado. As 11 com história divergente são #1, #10, #11, #12, #13, #18, #19, #21, #22, #31 e #35. Ancestralidade não prova equivalência funcional ou aprovação de produto; divergência não prova perda de conteúdo. Não mesclar nem fechar esses itens em lote. As fichas/dados que já foram incorporados não devem ser duplicados. A decisão de arquivar/fechar permanece do PM após conferir cada escopo.

## Ordem de aceite e decisões pendentes

1. Consolidar a avaliação #50/#49 junto das correções e do portão #51.
2. Avaliar HUD #52 com a correção de teclado desta revisão; a flag continua opcional.
3. Avaliar mundo #53, mobiliário #54 e rotina #55 com a correção de agenda desta revisão.
4. PO emite parecer de critérios/UX; PM decide merge e eventual atualização do link público. Nenhuma dessas decisões foi inferida.

Aparelhos físicos, FPS, leitores de tela, alto contraste, colisões avançadas, postos completos e poderes individuais permanecem nos respectivos backlogs. Esta revisão não os declara entregues.
