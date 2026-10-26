# Unificação verificada — 26/10/2026

## Resultado e limites

Tronco `integration/unificado-2026-10-26` criado de `fin` em `28c1de8`, sem merge. A consolidação do runtime é uma proposta de PR: o tronco ainda não contém os 35 commits posteriores de `codex/npcs-fase1-perfis` (`14e9166`). Nenhuma branch removida, histórico reescrito, tag criada ou promoção executada.

Correção da contagem preliminar: são **48 branches nomeadas** antes do novo tronco, 49 depois. O alias simbólico `origin/HEAD`, apresentado pelo Git como `origin`, havia sido contado como branch; foi excluído deste inventário. A branch de auditoria ainda não estava publicada no instante deste snapshot.

## Publicado e bases

O alias https://pilha-plus-game-preview.vercel.app/ aponta para `837d582e7939fb21259f39e5c06e3d488812f30c`, deployment `dpl_RTaFTua4nNQcAowCoKy7KE7BEPjU` READY. O runtime em `14e9166` é idêntico: diferenças posteriores são documentação/evidências. Não houve deploy manual nem alteração do alias. Pushes podem gerar previews automáticos do Git.

`main` está em `a0cb244`. `main...fin` tem **4/130** commits exclusivos, não 46 à frente. Os quatro exclusivos de main são documentação (roadmap, simulador de propostas e README): os dois documentos estão idênticos no runtime; não se deve trazer o código antigo da main junto.

`staff` é ancestral de fin, faltam seis commits financeiros. Galeria e circulação são ancestrais de fin (78 e 77 commits até fin). `integration/pilha-current-vision` e `integration/alpha15-vertical-slice` também estão cobertas por ancestralidade. As seis fichas de `docs/hero-roster-beta` têm história divergente, mas `git diff` de `docs/herois` contra fin e runtime é vazio. Regenerar `ui/hero-sheets.js` não produziu alteração. Não duplicar essas entregas.

## Método

Fetch remoto; `git merge-base --is-ancestor`, `git rev-list --left-right --count`, `git branch -r --contains`, `git ls-tree` por SHA. Vercel: todas as páginas, 361 deployments, último registro por branch entre 45 branches encontradas. Snapshot completo de referências/ancestralidade, contagens e metadados em [JSON](qa/unificacao-2026-10-26.json). Deploy ausente não prova que nunca existiu. SHA divergente do último deploy é explicitado abaixo. Contagens indicam arquivos, não equivalência funcional.

## Mapa

Fin/runtime: sim significa que o SHA da linha é ancestral dessa base. Δ é fin-exclusivos/branch-exclusivos. Coberta não autoriza apagar a branch.

| Branch | SHA | Ancestral fin/runtime | Δ | Arquivos runtime/docs/testes/assets | Último deploy observado | Situação |
|---|---|---|---|---|---|---|
| `audit/manus-handoff-2026-10-17` | `7609133` | não/não | 130/1 | 38/29/15/38 | [7609133 BLOCKED](https://pilha-plus-game-preview-nw7n3p8xa-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `codex/empresa-conectada-circulacao` | `3448b98` | sim/sim | 77/0 | 85/134/26/51 | [3448b98 READY](https://pilha-plus-game-preview-dwom4shkp-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `codex/galeria-herois-canonica` | `0c3dba6` | sim/sim | 78/0 | 85/133/25/51 | [0c3dba6 READY](https://pilha-plus-game-preview-9tb9ap0v4-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `codex/jornada-npcs-empresa` | `0aafd4b` | sim/sim | 80/0 | 79/132/24/51 | [0aafd4b READY](https://pilha-plus-game-preview-1ii0p8vzm-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `codex/npcs-fase1-perfis` | `14e9166` | não/sim | 0/35 | 116/184/39/104 | [14e9166 READY](https://pilha-plus-game-preview-6y7qa3xjz-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `codex/revisao-equipe-viva` | `022a39d` | sim/sim | 58/0 | 98/139/30/52 | [022a39d READY](https://pilha-plus-game-preview-6meahlgyc-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `codex/ux-tres-setores` | `1340f4a` | sim/sim | 83/0 | 69/121/22/45 | [1340f4a READY](https://pilha-plus-game-preview-5fm0s9ufb-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `docs/governanca-pm-po-codex` | `171b396` | sim/sim | 85/0 | 61/70/21/45 | [171b396 READY](https://pilha-plus-game-preview-q4aqgtrj0-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `docs/hero-roster-beta` | `f929943` | não/não | 144/55 | 35/39/12/26 | [f929943 READY](https://pilha-plus-game-preview-4zvu355ur-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `docs/roadmap-handoff-2026-10-17` | `bce636d` | não/não | 130/7 | 38/32/15/38 | [bce636d READY](https://pilha-plus-game-preview-cxh67t1ul-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/empresa-continua-restauracao` | `32501c7` | sim/sim | 63/0 | 91/136/29/52 | [32501c7 READY](https://pilha-plus-game-preview-gklxbxo7u-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/equipe-viva-calendario` | `1a20797` | sim/sim | 59/0 | 98/138/30/52 | [1a20797 READY](https://pilha-plus-game-preview-r03fx6h76-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/game-navigation-handoff` | `01f8563` | não/não | 144/21 | 34/27/11/26 | [01f8563 READY](https://pilha-plus-game-preview-4puwgtchj-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/hero-selection-zoom-thumbnails` | `bd006d2` | não/não | 130/7 | 38/29/15/38 | [bd006d2 READY](https://pilha-plus-game-preview-63x88j7z5-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/hero-spotlight-codex` | `602a819` | sim/sim | 66/0 | 87/134/28/52 | [602a819 READY](https://pilha-plus-game-preview-h8iiur66r-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/investment-prediction-alerts` | `4eaf05e` | não/não | 136/17 | 39/30/15/38 | [4eaf05e READY](https://pilha-plus-game-preview-jg97nt3b6-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/investment-psychosocial-domains` | `69e3a20` | não/não | 136/53 | 39/34/15/38 | [69e3a20 READY](https://pilha-plus-game-preview-8ge8omwnw-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/living-office-simulation` | `6b5d530` | não/não | 144/30 | 35/29/12/26 | [6b5d530 READY](https://pilha-plus-game-preview-p6q7y5uzy-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/management-dashboard-scenario-preview` | `e232375` | não/sim | 0/5 | 108/153/37/92 | [e232375 READY](https://pilha-plus-game-preview-g5nxsbzwa-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/mobiliario-poof-asset-pipeline` | `84ba91a` | sim/sim | 26/0 | 102/153/32/92 | [84ba91a READY](https://pilha-plus-game-preview-i4ruuipge-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/npc-absence-resignation-release` | `40b2944` | sim/sim | 12/0 | 105/153/34/92 | [40b2944 READY](https://pilha-plus-game-preview-fcur36hmz-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/npc-balanceamento-contextual` | `3921a7b` | não/não | 130/7 | 38/30/15/38 | [3921a7b READY](https://pilha-plus-game-preview-a9832vn4m-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/npc-furniture-effect-lifecycle` | `a14776e` | sim/sim | 18/0 | 104/153/33/92 | [a14776e READY](https://pilha-plus-game-preview-beyk555ie-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/npc-restoration-walks-and-sprites` | `0f7c551` | sim/sim | 52/0 | 98/139/30/52 | não encontrado no snapshot | coberta no runtime; conservar |
| `feat/psychosocial-environment-simulation` | `41a4977` | não/não | 144/25 | 34/28/11/26 | [41a4977 READY](https://pilha-plus-game-preview-rihqah03v-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feat/quarterly-financial-targets` | `28c1de8` | sim/sim | 0/0 | 107/153/36/92 | [28c1de8 READY](https://pilha-plus-game-preview-rb8sa13hr-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feat/quarterly-profitability` | `adb5727` | sim/sim | 6/0 | 106/153/35/92 | não encontrado no snapshot | coberta no runtime; conservar |
| `feat/staffing-hiring-coverage` | `adb5727` | sim/sim | 6/0 | 106/153/35/92 | [adb5727 READY](https://pilha-plus-game-preview-mlvaatgwa-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feature/ambiente-3d-ampliado-cc0-audio` | `6d3eaa8` | não/não | 139/1 | 36/26/12/38 | [6d3eaa8 BLOCKED](https://pilha-plus-game-preview-o7e3m74qx-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feature/biblioteca-3d-alpha13` | `19ab857` | sim/sim | 147/0 | 26/24/8/23 | [f004c7a READY](https://pilha-plus-game-preview-6yotqawzq-andrehecks-projects.vercel.app) (SHA diferente) | coberta no runtime; conservar |
| `feature/caso-017-simulacao-consequencias` | `0af1767` | não/não | 144/11 | 32/26/11/26 | [0af1767 BLOCKED](https://pilha-plus-game-preview-acyfb8fyl-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feature/caso-018-lideranca-3d` | `4b0f1f5` | não/não | 141/1 | 36/26/12/26 | [4b0f1f5 BLOCKED](https://pilha-plus-game-preview-114wme9yf-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feature/collab-hero-duos` | `c319fb3` | sim/sim | 97/0 | 51/48/19/44 | [c319fb3 READY](https://pilha-plus-game-preview-kdsfzx8go-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feature/company-state-cases-018-021` | `58942ff` | não/não | 136/1 | 38/26/14/38 | [58942ff BLOCKED](https://pilha-plus-game-preview-6zckk6xbh-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feature/hero-progression-recovery` | `93e2d61` | sim/sim | 89/0 | 61/68/21/45 | [93e2d61 READY](https://pilha-plus-game-preview-8k10n77mh-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `feature/mecanica-demissao-estados-navegacao` | `d01fd19` | não/não | 137/1 | 37/26/13/38 | [d01fd19 BLOCKED](https://pilha-plus-game-preview-1f6ubxq2t-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `feature/shareholder-timeline-kimi` | `e955638` | sim/sim | 93/0 | 57/62/20/45 | [e955638 READY](https://pilha-plus-game-preview-f82iq8n7k-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `fix/case018-live-silence` | `f8a3274` | não/não | 135/1 | 38/26/14/38 | [f8a3274 BLOCKED](https://pilha-plus-game-preview-1xmsp18k5-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `fix/navigation-segment-collision` | `b19ac83` | não/não | 136/5 | 38/27/14/38 | [b19ac83 READY](https://pilha-plus-game-preview-mhm04lt42-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `fix/npc-focus-codex-continuation` | `0f7c551` | sim/sim | 52/0 | 98/139/30/52 | [0f7c551 READY](https://pilha-plus-game-preview-80gerz0jh-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `fix/pr20-mobile-glb-qa` | `20b2948` | não/não | 104/3 | 40/44/17/38 | [20b2948 BLOCKED](https://pilha-plus-game-preview-f3y7pq459-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `fix/revenue-produced-worker-health` | `75c5b23` | não/sim | 0/9 | 108/153/37/92 | [75c5b23 READY](https://pilha-plus-game-preview-a56u6f24j-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `integration/alpha15-vertical-slice` | `a33e0a6` | sim/sim | 130/0 | 38/28/15/38 | não encontrado no snapshot | coberta no runtime; conservar |
| `integration/pilha-current-vision` | `060390a` | sim/sim | 104/0 | 40/39/17/38 | [060390a READY](https://pilha-plus-game-preview-8nf59jxsu-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `main` | `a0cb244` | não/não | 130/4 | 38/29/15/38 | [a0cb244 READY](https://pilha-plus-game-preview-5cxv9fq3x-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `refactor/cases-01-05` | `aedc22c` | não/não | 134/1 | 38/26/14/38 | [aedc22c BLOCKED](https://pilha-plus-game-preview-hqzz5xnt9-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `refactor/sidebar-game-areas` | `2ed7b31` | não/não | 133/1 | 38/26/14/38 | [2ed7b31 BLOCKED](https://pilha-plus-game-preview-i4e3pwbm6-andrehecks-projects.vercel.app) (mesmo SHA) | divergente; revisar conteúdo com PM |
| `release/alpha15-opening-characters` | `a0a17ef` | sim/sim | 101/0 | 47/40/18/44 | [a0a17ef READY](https://pilha-plus-game-preview-cazxm28ku-andrehecks-projects.vercel.app) (mesmo SHA) | coberta no runtime; conservar |
| `integration/unificado-2026-10-26` | `28c1de8` | sim/sim | 0/0 | 107/153/36/92 | não encontrado no snapshot | tronco novo, somente fin; consolidação pendente |

## PRs antigas consultadas

Histórico aberto não implica conteúdo ausente. Manter abertas até decisão do PM:
- [#10](https://github.com/andreheck/PilhaGameNR1/pull/10): `6b5d530` → `feat/psychosocial-environment-simulation`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#11](https://github.com/andreheck/PilhaGameNR1/pull/11): `b19ac83` → `main`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#12](https://github.com/andreheck/PilhaGameNR1/pull/12): `4eaf05e` → `main`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#13](https://github.com/andreheck/PilhaGameNR1/pull/13): `69e3a20` → `main`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#20](https://github.com/andreheck/PilhaGameNR1/pull/20): `060390a` → `main`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#22](https://github.com/andreheck/PilhaGameNR1/pull/22): `f929943` → `main`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#28](https://github.com/andreheck/PilhaGameNR1/pull/28): `1340f4a` → `docs/governanca-pm-po-codex`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.
- [#32](https://github.com/andreheck/PilhaGameNR1/pull/32): `0aafd4b` → `codex/ux-tres-setores`, aberta e não mesclada no snapshot. Conferir cobertura acima antes de portar diferenças.

## Contrato de save e verificação

Inventário central em `simulation/storage-keys.js`: chave, versão real do envelope, proprietário, escopo e migração. Importar esse módulo não lê nem escreve armazenamento. Web Locks separados de chaves persistentes. Nenhuma chave nova de jogador criada.

Fixture sintética `tests/fixtures/fin-28c1de8-save.json` gerada executando os módulos originais de fin: dois heróis, compras, avanço até semana 3 e pausa. Quatro testes em `tests/storage-contract.test.mjs` verificam abertura e primeira transação atual sem perder saldo, equipe, saúde, compras, histórico, finanças e evento; sem contratação inicial retroativa, pagamento duplicado ou reescrita ao ler. JSON inválido/versão desconhecida são rejeitados sem sobrescrever. Ledger legado e empresa contínua permanecem separados. Não migra horas antigas para semanas novas.

Build e npm test do arquivo isolado de fin passaram. Regeneração de fichas sem diff. Na base atual passaram `npm run build`, `npm test` (inclui os quatro novos testes), `npm run test:continuous`, `npm run test:living`, `npm run test:npcs` e `git diff --check`. Não houve mudança visual neste bloco; as capturas existentes de NPCs em `docs/qa/npcs-fase1/` documentam o runtime, não são novas capturas desta auditoria.

## Entregas e portões

1. A.1: PR pequena de mapa, contrato e teste de compatibilidade, baseada no runtime atual.
2. A.2: PR de consolidação do runtime atual sobre o tronco criado de fin. Fin é ancestral: propor os 35 commits existentes, sem repetir galeria/fichas/circulação. Nenhum merge executado.
3. Configurar o portão ampliado: o CI atual já tem build, suites e Playwright em cinco resoluções na workflow continuous-qa; test.yml ainda não agrega build/browser/axe. Axe e consolidação desse portão seguem pendentes em PR própria antes de declarar tronco pronto para promoção.
4. Após aprovação da unificação: HUD B atrás de `?hud=v2`, usando o mock apenas como referência de hierarquia e dados reais. Sem troca de economia. Depois C1…C8 em PRs distintas.

## Decisões e pendências PM/PO

- Autorizar revisão/merge da consolidação antes da próxima etapa; nenhuma promoção à main ou publicação por inferência.
- Preservar runtime aprovado de semanas de 2 minutos/C3 e três setores + restauração. Documentos históricos descrevem 7 dias/hora e salão único: não reverter silenciosamente. Caso se deseje mudança, exige decisão PM e migração versionada.
- Seis fichas existem, mas vários parâmetros de execução das habilidades não foram aprovados. HUD não pode exibir efeito ativo fictício.
- Percentuais, objetivos, cooldowns, retrospectiva, pulso, negociação e facilitador do briefing continuam propostas quando marcados PO. Não converter exemplos em regras.
- HUD atual já foi compactado; a referência nova exige uma implementação isolada e testes próprios. Nenhuma mudança de layout neste bloco.
- Nada de limpar branches duplicadas, mesclar PRs antigas em lote, alterar saves ou publicar antes de autorização.

Fonte do escopo: briefing anexado `PROMPT-CODEX-2026-10-26.md`, ordem A → B → C e “um PR por item”. Este documento é diagnóstico; não declara os blocos B/C implementados.
