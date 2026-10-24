# Governança vigente — PM / PO / Codex

> **Entrega atual — 23/10/2026:** Fase 1 dos 16 NPCs em `codex/npcs-fase1-perfis`, baseada em `fix/npc-focus-codex-continuation` (`70c6428`). Integrar somente artes aprovadas e narrativa canônica em lista, ficha e catálogo. Preservar motor, calendário, câmera, sprites, economia e saves. Entregar testes, evidências e PR para aprovação; sem merge ou publicação em produção. Escopo: `docs/specs/NPCS-FASE1-2026-10-23.md`.

> **Próxima entrega aprovada pelo PM — 22/10/2026:** conectar visualmente os três departamentos e ajustar a circulação em campo, a partir da galeria publicada `0c3dba6`. Branch `codex/empresa-conectada-circulacao`; escopo, testes e limitações em `docs/releases/EMPRESA-CONECTADA-2026-10-22.md`. Preservar estilo, dados, economia e relógio. A autorização vigente para atualizar o Vercel de testes continua aplicável; não autoriza merge.

> **Entrega de galeria autorizada em 22/10/2026:** integrar o pacote visual e os seis retratos enviados pelo PM, com as fichas canônicas do GitHub e progresso real salvo. Preservar principal/apoio distintos, orçamento, ciclo e habilidades existentes. A autorização vigente de atualizar o Vercel de testes acompanha esta entrega; não autoriza merge. Relatório: `docs/releases/GALERIA-HEROIS-2026-10-22.md`. Os retratos são para a galeria; não substituem os GLBs dos NPCs.

> **Entrega autorizada em 21/10/2026:** André pediu jornada inicial com escolha da dupla, NPCs animados, alertas, mobiliário, logo/orbes e integração dos 19 eventos do Claude C2. Autorizou explicitamente publicar a versão operacional no projeto Vercel de testes. Branch `codex/jornada-npcs-empresa`, baseada na PR #28 / `1340f4a`; detalhes em `docs/releases/JORNADA-EVENTOS-2026-10-21.md`. Preservar carência inicial de 10 minutos ativos, intervalos de 15–20 minutos, orçamento compartilhado e relógio canônico. Publicar esta entrega não autoriza merge. Novos visuais dos seis heróis estão em outra frente do PM; os GLBs atuais são usados somente como NPCs no mapa.

> **Decisão posterior do PM — 20/10/2026:** André autorizou o desenvolvimento com os três setores do pacote Claude como nova base visual (Escritório, Produção e Atendimento). A navegação do mapa pode incluir Visão geral para enquadrar esses setores; isso não restaura a antiga área de dashboard. Esta decisão substitui a exigência visual anterior de salão único. Preservar os cinco casos, dupla, orçamento/XP compartilhados, ciclo de 30 dias e dados existentes. Integração em `codex/ux-tres-setores`; relatório em `docs/releases/TRES-SETORES-2026-10-20.md`. Não inferir autorização de merge ou publicação.

**Ponto de entrada da continuidade:** [`docs/HANDOFF-CODEX-2026-10-20.md`](docs/HANDOFF-CODEX-2026-10-20.md). A preparação da transição está concluída: base consultada, diferenças entre branch/main/deployment, backlog PG-001–PG-008 e critérios do primeiro pacote estão registrados. Comece por **PG-001**, sem presumir autorização de merge ou publicação.

Leia também [`docs/GOVERNANCA-PM-PO-CODEX.md`](docs/GOVERNANCA-PM-PO-CODEX.md).

- **André / Heck é o PM:** supervisiona, define a alocação e os papéis das IAs e decide escopo, prazos e autorização de publicação.
- **ChatGPT da conversa de gestão é o PO:** mantém visão de produto, backlog, requisitos, critérios de aceite e pareceres sobre entregas. Não inicia implementação ou deploy nesta frente sem novo pedido explícito.
- **Codex assume o desenvolvimento principal:** implementa as entregas aprovadas, mantém testes e devolve PR/SHA, evidências, limitações e decisões pendentes.
- **Claude, Manus, Kimi e ChatGPT Grátis — André** continuam como frentes de apoio, acionadas e designadas pelo PM. Descrições de responsabilidade abaixo servem como histórico/referência quando conflitarem com esta governança.
- Não existe sincronização automática entre conversas ou contas. Ler o estado atual do GitHub antes de agir, preservar contribuições concorrentes e não assumir que a `main` contém todas as versões implantadas.
- Aceite funcional do PO não equivale a autorização de merge/publicação do PM. Esta mudança de governança não autoriza alterações técnicas, migrações destrutivas ou custos reais.

> **Atualização documental 20/10/2026:** a PR #22 avançou para `76e02efe65e43f53bf9b9af0f3766cf410d1a2e9` e passou a incluir a ficha `docs/herois/pd-tech.md` (P&D Tech, Arquiteto da Transformação, Lendário). Seus poderes estão documentados, mas não foram executados no runtime de referência desta passagem. Leia a ficha atual antes de tratar esse herói como não documentado; não importe o motor antigo da PR #22 nem invente temporização ou balanceamento. Referências completas no handoff.

> **Precedência 19/10/2026:** preservar salão único, abertura do App, faixa permanente da dupla/níveis/relógio e motor temporal; ler `docs/releases/RECUPERACAO-PROGRESSAO-2026-10-19.md`. Nível de herói não é nível da habilidade; não criar poder permanente ao comprar nível 21. XP idempotente e formação usam uma transação local do orçamento. Elétrons estão SOMENTE documentados, sem dados de saúde, serviços ou carteira ativa.

# Prioridade de produto — 19/10/2026: acionista e ciclo temporal

O usuário é o acionista, não um especialista. Leia `docs/MOTOR-ESTATISTICO-TEMPORAL.md` e `docs/reviews/TRIAGEM-KIMI-2026-10-19.md`. Preserve salão único, dupla visível, inventário, taxa7dias/hora, ciclo30dias e limitações de protótipo. Não retome avanço instantâneo30dias. A revisão Kimi refere-se a uma base anterior e não valida este motor novo. Preservar as fichas consolidadas de Diretor, Cientista de Dados e Engenheiro de Segurança; reconhecer também a nova ficha P&D Tech na referência de 20/10/2026 acima. Não inventar poderes da Psicóloga ou RS & TD enquanto suas fichas estiverem pendentes, nem confundir aprovação conceitual de uma ficha com execução temporal validada.

# Prioridade vigente de produto — 18/10/2026

Ler primeiro `docs/PRODUTO-CANONICO-2026-10-18.md`, `docs/PLANO-DIRETOR-2026-10-17.md` e os handoffs Claude/Manus/Kimi/ChatGPT Grátis — André. Toda instrução de sessão anterior que contradiga decisões atuais deve ser tratada como histórico. Não reintroduzir IDs 017–021, aba Visão geral ou eliminar estado global da empresa/fallback 2D. Cidade, mobilidade, currículos e negociação são **prioridades especificadas**, não funcionalidades já entregues. Alterações somente em branch/PR; validar antes de mesclar e publicar.

# Quinto agente — ChatGPT Grátis — André
- Frente diária (sob acionamento humano): QA exploratório e registro de bugs com evidência.
- Guia: `docs/agents/CHATGPT-GRATIS-ANDRE-QA.md`; checklist: `docs/qa/CHECKLIST-DIARIO-ANDRE.md`.
- Manus corrige falhas técnicas; Claude ajusta UX; Kimi verifica conteúdo; coordenação decide prioridades.
- Não pressupor acesso à conta gratuita, repositório privado, deploy ou execução automática.

# Orientações para Codex — PilhA+ Game
- Escrever interfaces em pt-BR; manter responsividade mobile-first e acesso desktop.
- Separar lógica de simulação de apresentação/UI; usar dados sintéticos.
- Não apresentar avaliações fictícias como cumprimento de NR-1, GRO ou PGR.
- Não diagnosticar saúde mental individual ou associar decisão à culpa do trabalhador.
- Priorizar medidas organizacionais, escuta e participação.
- Preservar três perspectivas: liderança, RH/SST e trabalhadores.
- Evitar dependências desnecessárias: fase inicial HTML/CSS/JS, futura migração React + TypeScript + Phaser.
- Documentar mudanças e testar navegação por toque, teclado e desktop.
- Não incluir credenciais, dados reais de empresas ou dados de saúde.
