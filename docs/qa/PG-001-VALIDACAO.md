# PG-001 — base validada com ressalvas

Entrega para parecer do PO e decisão do PM. Nenhuma alteração de runtime, merge ou publicação. Consulta remota realizada nesta sessão; marco documental 20/10/2026 UTC.

## Base utilizada

- Checkout isolado: `PilhaGameNR1-pg001`, branch `codex/pg-001-validacao`.
- Commit testado: `171b396ef010fa434eb5d5fbf627c74ed3e9276d`, HEAD da PR #27 (`docs/governanca-pm-po-codex`).
- Runtime: PR #26, `feature/hero-progression-recovery`, `93e2d61a06c11ca25ce97b80d8e42f98fb123a47`.
- Alias Vercel `pilha-plus-game-preview.vercel.app`: deployment `dpl_C1m9sJLqfNR3usGnbzwxCtSdbnXv`, READY, target production do projeto de testes, SHA `93e2d61`. Consulta de metadados, não teste de navegador.
- Main: `a0cb244f4950ffbbbd5ad466402c9d702419adb0`. Diff main → base: 90 arquivos, 4745 inserções e 108 exclusões; inclui código, documentação e assets.
- Diff runtime → base: somente `AGENTS.md`, governança e handoff. Código testado coincide com o publicado.
- PR #22: `76e02efe65e43f53bf9b9af0f3766cf410d1a2e9`. Novidades documentais desde a7660cb: README dos heróis e `docs/herois/pd-tech.md`.
- PRs #23–27 continuam abertas e em rascunho; #22 aberta. Não confundir sequência de entregas com integração na main.
- Checkout anterior em main/ca1d47b contém alterações locais preexistentes. Preservado integralmente; referências remotas atualizadas por `git fetch origin` sem reset ou troca de seus arquivos.

## Testes realmente executados

Windows/PowerShell, Node v24.18.1. Sem instalar dependências.

1. `npm.cmd test`: falha em `tests/static-flow.mjs:26` (`code.includes(end)`).
2. Todos os 14 comandos `node tests/...` declarados no package.json foram executados individualmente: 13 passam, static-flow falha. Saídas integrais em `evidence/pg001/`; resumo em `results.json`. Inclui os testes de dupla, relógio, progressão, inventário, navegação e salão.
3. Diagnóstico CRLF: `core.autocrlf=true`; o teste busca um trecho literal com LF. Cópia temporária do teste normalizando CRLF→LF somente na leitura passou e foi removida. Log `static-flow-lf-probe.log`. Isso não torna verde a suíte original nem altera seus arquivos.
4. `node --check` em todos os 55 arquivos JS/MJS rastreados: zero falhas.
5. `git diff --check`: aprovado para a base.
6. `node --check` nos três JS externos do Claude: aprovado. Não equivale a execução do fluxo visual.

Não executados nesta entrega: navegador desktop/mobile, Lighthouse, leitor de tela, dispositivos físicos, sessão contínua de 4h17, validação visual das animações ou transações reais entre abas. Evidências antigas não foram reapresentadas como testes novos.

## P&D Tech

Ficha integral lida na referência atual da PR #22: Arquiteto da Transformação, Lendário; Visão de Sistemas, Laboratório de Transformação, Ecossistema de Inovação e Singularidade de Transformação. Percentuais são protótipos condicionados à viabilidade, recursos e compatibilidade. Especial limitado a uma vez por missão.

O catálogo executável `simulation/hero-abilities.js` contém somente dois poderes do Diretor. P&D Tech não está no catálogo conceitual atual `hero-concepts.js`. Documentação temporal antiga ainda o chama de ficha pendente; AGENTS/handoff mais recentes corrigem essa informação. Proposta: incorporar seletivamente a ficha e atualizar o estado conceitual em PG-003, sem importar o motor legado da PR #22. Redução do tempo de experimentação não autoriza reduzir o ciclo obrigatório de 30 dias.

## Pacote Claude — comparação preliminar

Foram lidos o guia CODEX-PILHA-UX.md e trechos relevantes dos módulos recebidos, verificadas as sintaxes e examinadas as duas imagens anexas. O guia é material de referência; sua alegação de prioridade absoluta não substitui o escopo PG-001 nem a governança do PM.

| Pacote recebido | Base vigente / consequência para integração |
|---|---|
| Três setores em canvas 2D, aba Visão geral | Salão único com cinco setores, cinco casos, WebGL e fallback 2D; mudança requer decisão explícita de produto |
| Saldo independente em `pilha-mapa-v1` | Orçamento comum com formação/XP em `pilha-investment-v1`; copiar diretamente criaria duas economias |
| 12 melhorias por setor, três níveis, preços/efeitos próprios | Inventário e curva atuais devem ser preservados até conciliação e migração aprovadas |
| Compra aumenta imediatamente índices e gera previsão de afastamento | Efeito humano temporal, determinístico e educativo; não transformar índice fictício em probabilidade de saúde |
| Reiniciar retorna ao estado inicial do mapa | Base protege rastreabilidade de ciclos e preserva progresso; reset não pode apagar dados existentes |
| Layout navy/dourado, painel lateral/bottom-sheet, feedback visual | Bom candidato para adaptação de apresentação sobre os contratos atuais |
| Pessoas em loop e modo estático por reduced-motion | Movimento reduzido intencional não é falha; animação do runtime atual ainda requer observação em navegador |

O mapa recebido já possui `destroy()` (o guia diz desmontar apenas removendo o container). Deve-se chamar sua limpeza ao integrar. A compra altera estado/UI antes de `saveState`, que suprime falhas de storage; não usar esse fluxo como substituto da gravação atômica existente. Os nomes locais com ` (1)` precisam de mapeamento explícito; não sobrescrever os módulos homônimos atuais.

## Backlog confrontado com a base

- PG-002: testes puros temporais/economia passam; sessão longa, abas e storage em navegador continuam pendentes.
- PG-003: ficha P&D existe; incorporação seletiva e matriz ficha/arte/runtime/teste pendentes.
- PG-004: duas implementações do Caso 01 permanecem; suíte não comprova unificação.
- PG-005: proteção ética já existe e testes passam; silence, harmonização dos motores profundos e fontes por item continuam pendentes.
- PG-006: painel temporal existe; atuação visual completa dos especialistas e poderes adicionais não está homologada.
- PG-007: progressão passa nos testes puros; balanceamento e acessibilidade real permanecem pendentes.
- PG-008: elétrons apenas documentados, sem ativação nesta tarefa.

## Plano não destrutivo e próxima entrega proposta

1. Manter esta base isolada com governança; reconciliar alterações antigas por arquivo e propósito, nunca copiar o checkout antigo inteiro.
2. Corrigir a portabilidade CRLF do teste como manutenção pequena, com nova execução integral, sem alterar regras do jogo.
3. Seguir PG-002 para evidência da economia/persistência/relógio em navegador antes de conectar uma nova UI.
4. PO refina um pacote visual separado para o Claude: abertura, HUD, painel responsivo e feedback sobre o estado atual. PM decide se mantém salão/casos ou aprova mudança para três setores; definir adaptação dos índices, compras, tempo e textos antes de implementar o mapa.
5. PG-003 incorpora somente documentação recente e estados conceituais. Consolidar main, mesclar PRs e publicar constituem decisão separada do PM.

## Aceite e limites

Critérios PG-001 atendidos: SHAs/deployment mapeados; divergências explicadas; suíte executada com falha reproduzida; P&D reconhecido; backlog revisado; contribuições e dados preservados; relatório entregue. Base validada com ressalva de portabilidade do teste, não homologada em navegador. PR de referência #27; nenhuma nova PR aberta nesta rodada, evitando disparar preview automático. Relatório e logs locais disponíveis para revisão. Sem custos reais, merge, publicação ou mudança de economia.
