# Governança vigente — PM / PO / Codex

Leia primeiro [`docs/GOVERNANCA-PM-PO-CODEX.md`](docs/GOVERNANCA-PM-PO-CODEX.md).

- **André / Heck é o PM:** supervisiona, define a alocação e os papéis das IAs e decide escopo, prazos e autorização de publicação.
- **ChatGPT da conversa de gestão é o PO:** mantém visão de produto, backlog, requisitos, critérios de aceite e pareceres sobre entregas. Não inicia implementação ou deploy nesta frente sem novo pedido explícito.
- **Codex assume o desenvolvimento principal:** implementa as entregas aprovadas, mantém testes e devolve PR/SHA, evidências, limitações e decisões pendentes.
- **Claude, Manus, Kimi e ChatGPT Grátis — André** continuam como frentes de apoio, acionadas e designadas pelo PM. Descrições de responsabilidade abaixo servem como histórico/referência quando conflitarem com esta governança.
- Não existe sincronização automática entre conversas ou contas. Ler o estado atual do GitHub antes de agir, preservar contribuições concorrentes e não assumir que a `main` contém todas as versões implantadas.
- Aceite funcional do PO não equivale a autorização de merge/publicação do PM. Esta mudança de governança não autoriza alterações técnicas, migrações destrutivas ou custos reais.

> **Precedência 19/10/2026:** preservar salão único, abertura do App, faixa permanente da dupla/níveis/relógio e motor temporal; ler `docs/releases/RECUPERACAO-PROGRESSAO-2026-10-19.md`. Nível de herói não é nível da habilidade; não criar poder permanente ao comprar nível 21. XP idempotente e formação usam uma transação local do orçamento. Elétrons estão SOMENTE documentados, sem dados de saúde, serviços ou carteira ativa.

# Prioridade de produto — 19/10/2026: acionista e ciclo temporal

O usuário é o acionista, não um especialista. Leia `docs/MOTOR-ESTATISTICO-TEMPORAL.md` e `docs/reviews/TRIAGEM-KIMI-2026-10-19.md`. Preserve salão único, dupla visível, inventário, taxa7dias/hora, ciclo30dias e limitações de protótipo. Não retome avanço instantâneo30dias. A revisão Kimi refere-se a uma base anterior e não valida este motor novo. Preservar as fichas consolidadas de Diretor, Cientista de Dados e Engenheiro de Segurança; não inventar poderes da Psicóloga, P&D Tech ou RS & TD enquanto suas fichas estiverem pendentes.

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
