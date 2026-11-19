# PilhA+ Game — fechamento da transição e passagem ao Codex

**Marco:** 20/10/2026 (UTC). **PM:** André / Heck. **PO:** ChatGPT desta conversa. **Desenvolvimento principal:** Codex.

**Estado deste pacote: concluído e pronto para continuidade.** O encerramento é da preparação da passagem de trabalho, não do desenvolvimento do jogo, da homologação da Alpha ou da integração das PRs. A solicitação do PM para concluir esta transição não é tratada como autorização geral para merge, deploy, pagamento, conexão com o App ou alterações destrutivas.

## 1. Base comum conferida

| Referência | Estado observado nesta conferência | Como usar |
|---|---|---|
| Repositório | `andreheck/PilhaGameNR1` | Fonte de código, decisões e evidências |
| Endereço de testes | https://pilha-plus-game-preview.vercel.app/ | Deployment consultado no Vercel, sem nova publicação |
| Deployment vigente | `dpl_C1m9sJLqfNR3usGnbzwxCtSdbnXv`, `READY`, target `production` do projeto de testes | READY confirma implantação, não homologação completa |
| Código publicado | `93e2d61a06c11ca25ce97b80d8e42f98fb123a47` | Marco de runtime conferido para esta passagem |
| Branch de implementação | `feature/hero-progression-recovery` | HEAD da PR #26 coincide com o SHA publicado |
| PR #26 | Aberta, rascunho; base `feature/collab-hero-duos` | Não foi integrada à main; preservar o histórico |
| `main` | `a0cb244f4950ffbbbd5ad466402c9d702419adb0` | NÃO presumir que é a versão implantada ou mais completa |
| Governança e este pacote | PR #27, branch `docs/governanca-pm-po-codex`, derivada do SHA publicado | Contém documentação de gestão sobre a base de implementação; não modifica o jogo |
| Novidade de colaborador | PR #22, `docs/hero-roster-beta`, HEAD `76e02efe65e43f53bf9b9af0f3766cf410d1a2e9` | Ler a nova ficha de P&D Tech antes de tratar este herói como não documentado |

**Reconsulta obrigatória ao começar:** se houver commits posteriores a este marco, comparar as diferenças e preservar contribuições novas. O SHA acima identifica a referência conferida; não autoriza retorno ou reset para uma versão anterior. A base de código e a base documental estão identificadas, mas isso não equivale a uma main consolidada.

## 2. O que já existe e o que continua pendente

### Implementado, com evidências anteriores registradas

- Salão único com cinco setores, alternativa 2D, cinco modelos de atores e 12 recursos de melhoria.
- Abertura com referência do PilhA+ App; carregamento dos GLBs posterior à saída da abertura.
- Seis perfis selecionáveis; uma dupla por caso, principal e apoio, preservada depois de iniciar o ciclo.
- Faixa permanente do acionista com dupla, níveis, relógio e ações.
- Relógio: sete dias simulados por hora real ativa; 30 dias em aproximadamente 4h17min09s; pausa, persistência e proteção de contagem simultânea.
- Formação comprada com créditos fictícios e XP por situações/casos; saldo compartilhado com inventário; recibos de recompensa para evitar duplicação.
- Dois poderes do Diretor com execução temporal de protótipo; demais poderes documentados não devem ser confundidos com runtime implementado.
- Aplicação parcial da revisão Kimi, incluindo flags impeditivas de aprovação por violações éticas no fluxo in-shell e distinção dos domínios de prevenção.

**Evidência anterior:** comentário de publicação da PR #26, https://github.com/andreheck/PilhaGameNR1/pull/26#issuecomment-6275433840, e `docs/qa/evidence/progression/`. O registro relata checkout limpo e suíte aprovados; testes de navegador em Chromium 1440×900 e 390×844; confirmação adicional no domínio público. Também registra timeouts do executor e retestes. **Nenhum desses testes foi repetido nesta rodada de gestão.**

### Ainda não homologado ou não implementado

- Sessão longa em navegador cobrindo o ciclo inteiro e retorno após pausas reais; iPhone/Android físicos; acessibilidade assistiva; hardware de entrada.
- Conciliação definitiva das branches com a main, incluindo estratégia de release e preservação das contribuições paralelas.
- Unificação do Caso 01 profundo e do Caso 01 in-shell; revisão do uso de `silence` na pontuação do Caso 02; rastreabilidade de fontes por item do quiz.
- Balanceamento de preços, XP, atrasos, duração, recargas e sinergias. Coeficientes atuais são hipóteses de jogo, não estimativas de saúde ou produtividade.
- Execução temporal completa dos poderes dos demais heróis; seis visuais/GLBs definitivos e sua atuação coerente no ambiente.
- Mapa urbano, mobilidade, currículos e propostas de trabalho como gameplay integral; permanecem direção de produto e especificações.
- Elétrons: apenas arquitetura futura; sem vínculo de contas, consulta de energia, carteira ativa, conversão ou transferência.

## 3. Atualização de colaborador encontrada no fechamento

A PR #22 recebeu dois commits após a revisão anteriormente usada na implementação (`a7660cb`):
- `0a19b1af1c08deb3b7a2b07d30400c94bf993e62`: acrescenta `docs/herois/pd-tech.md`;
- `76e02efe65e43f53bf9b9af0f3766cf410d1a2e9`: atualiza `docs/herois/README.md`.

Fonte integral: https://github.com/andreheck/PilhaGameNR1/blob/76e02efe65e43f53bf9b9af0f3766cf410d1a2e9/docs/herois/pd-tech.md .

A ficha descreve **P&D Tech — Arquiteto da Transformação**, raridade conceitual Lendário, com **Visão de Sistemas**, **Laboratório de Transformação**, **Ecossistema de Inovação** e **Singularidade de Transformação**. O documento condiciona os efeitos à viabilidade, recursos e compatibilidade, limita o especial a uma vez por missão e identifica números como protótipos a balancear.

**Decisão de passagem:** a ficha existe e deve ser considerada na próxima conciliação. Isso não significa que seus poderes estejam executáveis no deployment atual. Não copiar o motor antigo contido no histórico da PR #22 para obter essa documentação. Não inventar atrasos/recargas nem transformar uma redução do tempo de experimentação em redução do horizonte mínimo do caso. Levar essa interação para decisão de produto antes da implementação.

## 4. Backlog de continuidade preparado pelo PO

Prioridades propostas; alocação adicional, capacidade e prazos continuam sob o PM. Nenhum agente foi acionado automaticamente.

| ID | Prioridade | Entrega | Aceite observável | Situação |
|---|---|---|---|---|
| PG-001 | P0 | Confirmar base de trabalho no ambiente do Codex | Mapa de branch/commit/deployment; diferença entre main e versão publicada; novidades da PR #22; suíte da base e limitações registradas; plano não destrutivo de conciliação | Pronto para iniciar no Codex |
| PG-002 | P0 | Validar ciclo longo, persistência e economia | Evidência do ciclo completo; marcos 7/14/21/28/30; pausa/retomada, abas, reload, falha de storage; saldo/XP sem duplicação; aprovação ética e relógio independentes | Refinado; depende de PG-001 e capacidade de teste |
| PG-003 | P1 | Conciliar fichas recentes e estados dos poderes | P&D Tech fiel à PR #22; matriz por herói distinguindo ficha, arte, código temporal e teste; nenhuma habilidade não implementada exibida como ativa | Pronto para refinamento técnico |
| PG-004 | P1 | Unificar o Caso 01 sem perda pedagógica | Mapa das duas implementações; contrato de dados; preservação de investigação, escolhas, monitoramentos, legado e bloqueios; regressão de migração | Refinar após PG-001 |
| PG-005 | P1 | Fechar pendências pedagógicas verificáveis | Revalidar Kimi P1–P10 contra o código atual; resolver/justificar `silence`; mostrar feedback específico; fontes por item sem portarias inventadas | Revisão especializada e alocação pelo PM |
| PG-006 | P1 | Explicar a atuação dos especialistas no salão | Disponível/preparando/atuando/em recarga visíveis; alvo e contribuição explicados; vínculo real com o relógio; sem novos GLBs improvisados | Depende de fichas/contrato aprovado |
| PG-007 | P1 | Calibrar progressão e acessibilidade | Comparação documentada de curva de XP/formação; cotação/cancelamento/saldo claros; mobile e leitor de tela conforme plano de teste; decisão do PM sobre mudanças | Pendência de teste e decisão |
| PG-008 | Futuro | Amadurecer integração de elétrons | Política, conta vinculada opcional, minimização, idempotência, ledger e cenários de falha definidos antes de integração real | Documentado; não iniciar conexão |

Os rótulos de prioridade desta tabela pertencem ao backlog do PO. Os identificadores P1–P10 da revisão Kimi são a ordenação original do revisor e não devem ser confundidos com estes IDs.

## 5. Primeiro pacote de trabalho — PG-001

**Título:** assumir a base atual sem regressão ou sobrescrita de contribuições.

**Objetivo:** o Codex deve conseguir demonstrar qual código está sendo mantido, qual foi implantado, qual documentação governa o produto e o que falta conciliar antes de programar novas funcionalidades.

**Responsável principal:** Codex, conforme definição do PM. **PO:** ChatGPT. Apoios e prazo: a designar pelo PM, sem compromisso automático.

### Escopo

1. Ler `AGENTS.md`, este handoff, a governança, registros de release, motor temporal, progressão e triagem Kimi.
2. Atualizar referências remotas, identificar workspace/branch/SHA e mudanças locais ou concorrentes. Não usar reset destrutivo, force push ou exclusão de branches.
3. Reconsultar Vercel/PRs; confirmar ou atualizar a tabela da seção 1.
4. Usar uma branch de trabalho que preserve o runtime atual e carregue a documentação de governança. A branch `docs/governanca-pm-po-codex` é o pacote de referência; não presumir que sua existência significa merge concluído.
5. Executar a suíte existente e validações de sintaxe no ambiente realmente disponível. Informar comandos, SHA e saída; se um recurso de navegador ou acesso estiver indisponível, registrar bloqueio em vez de declarar teste feito.
6. Comparar os documentos recentes da PR #22; propor incorporação seletiva da ficha P&D Tech sem introduzir código legado.
7. Entregar relatório com base técnica, diferenças de branches, pendências e proposta de próxima entrega. Uma eventual consolidação na main deve ter plano separado e autorização do PM.

### Critérios de aceite do PO

- [ ] SHA do checkout e deployment identificados ou falta de acesso explicitada.
- [ ] Diferença entre main, runtime publicado e governança explicada; nenhum dado ou contribuição removido.
- [ ] Suíte executada com saída real e ambiente; falhas reproduzidas ou limitações declaradas.
- [ ] Ficha P&D Tech reconhecida como documentada, separando efeitos propostos de código ativo.
- [ ] Pendências PG-002–PG-008 revisadas contra a versão corrente, sem reabrir automaticamente problemas já resolvidos.
- [ ] Nenhum deploy, merge de código, mudança de economia, importação de dados pessoais ou custo real por inferência desta tarefa.
- [ ] Relatório entregue para parecer do PO e decisão do PM.

**Fora do escopo:** novos poderes, novas moedas, novos personagens, mapa urbano completo, migração de framework, publicação e encerramento de PRs antigas.

## 6. Regras de produto que a passagem não altera

Jogador acionista; salão único; casos 01–05; dupla visível; inventário; alternativa 2D; identidade visual do App. Sete dias por hora e ciclo de 30 dias continuam iguais. Formar/evoluir heróis não compra aprovação nem acelera o relógio. Nível de herói não equivale a nível de habilidade; permanência continua dependente de habilidade elegível acima do nível 20 ou exceção aprovada. Nenhum score de energia real foi conectado.

Preços de formação, recompensas e multiplicadores já implementados são hipóteses de balanceamento e não ficam definitivamente aprovados pelo encerramento da transição. O mesmo vale para os percentuais das fichas de heróis.

## 7. Encerramento e evidências desta rodada

Conferidos ao vivo: metadados das PRs #26/#27/#22, main, delta recente da PR #22, conteúdo da ficha P&D Tech e deployment do endereço habitual no Vercel. Os testes de runtime referidos nas seções anteriores são os registros da entrega anterior, não testes reexecutados por este PO.

Produzido nesta rodada: handoff, backlog, pacote PG-001, atualização das orientações documentais e preparação da PR #27 para revisão. **Não houve alteração de JavaScript, CSS, assets, economia, dados de usuário, main ou deployment.**

Governança: [GOVERNANCA-PM-PO-CODEX.md](GOVERNANCA-PM-PO-CODEX.md). Regra operacional: PM decide objetivo, alocação e liberação; PO refina e emite parecer; Codex implementa e devolve evidência. O recebimento pelo Codex ocorrerá na sessão aberta pelo PM; não há sincronização automática entre conversas.

## 8. Mensagem única para iniciar a sessão do Codex

> Continue o PilhA+ Game pela tarefa **PG-001** de `docs/HANDOFF-CODEX-2026-10-20.md`, disponível na branch `docs/governanca-pm-po-codex` e na PR #27. André é o PM e o ChatGPT da conversa de gestão é o PO. Confira as referências atuais antes de agir: o runtime conferido nesta passagem era `93e2d61`, mas não retorne a ele se houver trabalho posterior. Preserve os recursos atuais, confira a ficha nova de P&D Tech da PR #22, valide a base no seu ambiente e devolva um relatório com SHA/PR, testes, limitações e próximo pacote proposto. Não faça merge nem publique por presumir autorização nesta passagem.
