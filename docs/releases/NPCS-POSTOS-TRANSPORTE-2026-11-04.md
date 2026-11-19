# NPCs: postos de trabalho e transporte de materiais — 04/11/2026

## Estado

Em revisão na branch `codex/npc-workstation-interactions`, derivada da PR #65 (`b54a7f8`). Sem merge ou publicação de produção.

## Entrega

- Funcionários dos setores Escritório e Atendimento recebem assentos exclusivos, derivados dos pontos de cadeira existentes junto às mesas e monitores.
- No ciclo de trabalho de dois dias já usado pelas rotinas, percorrem o corredor até o posto, permanecem sentados em atividade de computador, levantam e seguem a circulação. O trajeto usa a malha de corredores existente.
- Funcionários da Produção alternam manuseio parado e transporte de caixas ao longo dos corredores. Os outros funcionários administrativos podem levar pastas durante as rondas.
- As duas personagens com atlas riggado continuam a usar a animação aprovada ao caminhar. Como ainda não há clipe riggado sentado/trabalhando, essa pose usa o desenho procedural atual de tronco, cabeça e mãos; o rig original não é apresentado como se tivesse uma animação que não contém.
- A atividade é visual e determinística; não altera saúde, benefícios, calendário, compras, progresso ou estrutura dos saves.

## Dimensão e mobiliário

O cenário já contém 12 lugares de mesa por setor administrativo para seis funcionários em Escritório e cinco em Atendimento. O protótipo mantém os dioramas atuais de 12×8 e a escala dos móveis: a passagem até as cadeiras e os corredores continuam desobstruídos nos testes geométricos. Ampliar a planta agora criaria mais área de câmera sem resolver falta observada de postos.

## Critérios e validação

- [x] Reserva de cadeira sem atribuir o mesmo posto a dois NPCs.
- [x] Caminho de ida e volta entre corredor e posto por segmentos ortogonais.
- [x] Computador, pastas e caixas representados conforme a tarefa.
- [x] Ciclos de pausa, câmera, seleção, rigging, estado de saúde e persistência mantidos nos testes do motor.
- [x] `npm run build`.
- [x] `node tests/company-living.test.mjs` — 36 verificações.
- [x] `node tests/work-agenda.test.mjs` — 3 verificações.
- [x] `node tests/npc-rigged.test.mjs` — 5 verificações.

## Limites e próximo backlog visual

Os braços de digitação são movimento procedural, e as pastas/caixas são adereços visuais carregados pelo NPC, não objetos persistentes do inventário. Não há animações específicas de sentar/levantar ou manipular objetos nos rigs atuais. A próxima etapa pode adicionar clipes aprovados para essas ações e móveis com pontos de interação explícitos: cadeira ergonômica, estação modular com monitor/teclado, arquivo e gaveteiro, caixa dobrável e carrinho de materiais. Antes de acrescentar variantes, conferir os ativos Kenney e o pacote de mobiliário já versionado para evitar duplicação.

`npm run test:living` foi tentado, mas o runner do Node falhou com `spawn EPERM` ao iniciar `node --test` neste ambiente Windows. Os mesmos três arquivos relevantes foram executados diretamente com `node` e passaram; o CI da PR deverá confirmar o runner padrão.
