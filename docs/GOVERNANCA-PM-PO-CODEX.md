# PilhA+ Game — governança PM / PO / Codex

**Decisão do PM:** o desenvolvimento passa a continuar no Codex; esta conversa do ChatGPT permanece como espaço de gestão de produto. André supervisiona o projeto como PM e define os papéis, prioridades de alocação e acionamento das demais IAs.

**Natureza deste registro:** documentação de governança. Não altera código, parâmetros, cronograma aprovado, produção ou permissões de ferramentas. Em caso de conflito de responsabilidades com documentos anteriores, esta divisão prevalece. As restrições técnicas, de privacidade e de segurança continuam válidas.

## 1. Responsabilidades e autoridade

| Participante | Responsabilidade nesta fase | Limite de autoridade |
|---|---|---|
| **André / Heck — PM** | Supervisionar execução; definir objetivos, orçamento, prazos, disponibilidade, papéis e acionamento das IAs; aprovar mudanças de escopo e publicação | Decisão final sobre alocação, compromissos e liberação. Não confundir seu papel de PM com o acionista fictício dentro do jogo |
| **ChatGPT desta conversa — PO** | Manter visão de produto e backlog; propor ordenação por valor/risco; refinar requisitos, histórias e critérios de aceite; analisar entregas e registrar decisões, dependências e riscos | Aceite funcional baseado em evidências, sujeito à supervisão do PM. Não iniciar programação ou deploy nesta frente sem novo pedido explícito |
| **Codex — desenvolvimento principal** | Implementar as tarefas aprovadas; analisar arquitetura; corrigir bugs; manter testes e documentação técnica; preparar commits/PRs e evidências | Autonomia técnica dentro do escopo atribuído. Não mudar regras de produto, fazer migração destrutiva, merge ou publicação sem autorização aplicável do PM |
| **Claude — apoio de interface e arte** | Frente de referência: UX/UI, hierarquia visual, redação de interface e assets aprovados | Ativação, escopo e eventual programação definidos pelo PM; combinar arquivos/interfaces com Codex antes de edições concorrentes |
| **Manus — apoio de validação técnica** | Frente de referência: QA, testes longos, persistência, desempenho, 3D e infraestrutura | Missões e participação em código atribuídas pelo PM; não duplicar a implementação principal sem acordo |
| **Kimi — apoio de pesquisa e revisão** | Frente de referência: rastreabilidade de fontes, coerência pedagógica e crítica dos incentivos/modelos | Distinguir norma, evidência, hipótese de jogo e conteúdo não verificado. Não declarar validação do novo motor com base na revisão de uma versão anterior |
| **ChatGPT Grátis — André — apoio de QA exploratório** | Guiar testes realizados pelo André, registrar problemas reproduzíveis e conferir correções | Não presumir acesso ao repositório ou execução automática. Relatos humanos, emulação e testes automatizados são evidências diferentes |

As frentes de apoio acima preservam a organização existente como referência. **Não representam novas tarefas enviadas ou alocações impostas pelo PO. André continua definindo quem atua e quando.**

## 2. Fluxo de trabalho

**PM define o objetivo → PO refina a entrega → PM confirma a alocação → Codex e apoios executam → PO verifica critérios e evidências → PM decide liberação e próximo ciclo.**

1. O PM informa objetivo, restrições, disponibilidade e mudanças de direção.
2. O PO transforma isso em uma entrega pequena e verificável, com prioridade proposta, valor esperado, dependências e critérios de aceite.
3. O PM aprova ou ajusta o escopo e designa o executor. Só então se registra um compromisso de prazo.
4. O executor confere a base atual e as contribuições concorrentes no GitHub antes de alterar arquivos.
5. A devolutiva informa o que mudou, branch/SHA/PR, testes realmente executados, limitações, riscos e pendências.
6. O PO emite parecer de produto: aceito, aceito com ressalvas ou devolvido para ajuste, sempre indicando evidências e lacunas.
7. O PM decide merge, publicação, prioridade seguinte e realocação das IAs.

### Estados de acompanhamento

Backlog → Refinado/pronto → Em execução → Em revisão → Aceite de produto → Liberado pelo PM → Publicado. Bloqueios são registrados com causa, dono da decisão e próxima ação.

**Implementado não significa testado; testado não significa homologado; aceite do PO não significa publicação autorizada.**

## 3. Ponto de continuidade conferido nesta transição

- Repositório: `andreheck/PilhaGameNR1`.
- Última entrega de implementação identificada nesta retomada: **PR #26**, aberta e em rascunho na consulta.
- Branch da PR #26: `feature/hero-progression-recovery`.
- HEAD consultado: `93e2d61a06c11ca25ce97b80d8e42f98fb123a47`.
- Base da PR #26: `feature/collab-hero-duos`, e não `main`.
- O registro anterior de publicação e testes está na conversa da PR #26 e em `docs/releases/RECUPERACAO-PROGRESSAO-2026-10-19.md`.

**Esse SHA é uma referência de transição, não uma ordem para voltar a ele.** Antes de começar, Codex deve consultar os heads atuais, mudanças dos colaboradores e o deployment vigente. Não assumir que `main` já contém todas as entregas publicadas nem confundir uma PR aberta com uma PR integrada. Esta rodada de governança não repetiu testes de runtime ou verificou novamente o Vercel.

### Leitura prioritária

1. `docs/GOVERNANCA-PM-PO-CODEX.md` — papéis, decisões e passagem de trabalho.
2. `AGENTS.md` — instruções e limites técnicos.
3. `docs/releases/RECUPERACAO-PROGRESSAO-2026-10-19.md` — estado e pendências da última entrega.
4. `docs/MOTOR-ESTATISTICO-TEMPORAL.md` — unidades, relógio, efeitos e hipóteses do modelo.
5. `docs/PROGRESSAO-HEROIS-2026-10-19.md` — formação, XP, preços e limites de protótipo.
6. `docs/INTEGRACAO-ELETRONS-PILHA-APP.md` — integração futura, ainda não ativa.
7. `docs/reviews/TRIAGEM-KIMI-2026-10-19.md` e revisão original — achados, escopo revisado e pendências.

## 4. Decisões de produto a preservar

- O jogador é o **acionista**: seleciona especialistas, autoriza intervenções e distribui créditos fictícios entre formação e recursos do inventário.
- Manter salão único, cinco casos 01–05, alternativa 2D, identidade visual do App e faixa visível de dupla/níveis/tempo.
- Manter a equivalência de sete dias simulados por hora real ativa. Quatro semanas correspondem a 28 dias/4h; 30 dias correspondem a aproximadamente 4h17min09s. Não reintroduzir salto instantâneo no fluxo normal.
- Manter atraso de início, duração e recarga; efeitos permanentes exigem regra explícita. Nível de herói não é nível de habilidade.
- Preservar orçamento, XP, formação, inventário e conquistas anteriores. Comprar formação não compra aprovação pedagógica nem autoriza tratar créditos como dinheiro real.
- Preços, XP e coeficientes são hipóteses de balanceamento. O motor atual é uma simulação determinística, não um modelo empírico de saúde.
- Elétrons do App estão documentados, mas não há autorização nesta transição para conectar contas, consultar score, importar dados pessoais ou emitir recompensas reais.
- Os seis perfis selecionáveis não equivalem a seis modelos 3D definitivos. Preservar arte aprovada e não inventar substitutos como entregas finais.

## 5. Fila inicial recomendada pelo PO — sujeita ao PM

| Ordem | Objetivo de produto | Evidência esperada para aceite |
|---|---|---|
| P0 | Confirmar uma base de trabalho comum entre branches, PRs e versão implantada | Mapa curto de versões e plano não destrutivo de conciliação; nenhum retorno silencioso a código obsoleto |
| P0 | Validar a jornada longa e a persistência | Sessão de ciclo completo, pausas/retomadas, fechamento, duas abas, saldo/XP sem duplicação e limites de dispositivo explicitados |
| P1 | Unificar a experiência do Caso 01 | Inventário das duas implementações, contrato de dados e migração preservando conteúdo, progresso e bloqueios éticos |
| P1 | Tornar visível a atuação dos especialistas | Estado disponível/preparando/atuando/em recarga, ação explicada no ambiente e correspondência com o relógio; sem inventar poderes ausentes |
| P1 | Refinar progressão e apresentação | Proposta de balanceamento e testes de compreensão de XP versus formação; assets e fichas aprovados pelo PM |
| Futuro | Amadurecer a integração de elétrons | Política de conversão, vínculo opcional, privacidade e livro-razão definidos antes de ativar qualquer integração |

Não há sprint, prazo fechado ou tarefa delegada automaticamente por esta tabela. O PM determina capacidade e ordem efetiva. Os achados antigos do Kimi devem ser verificados contra o código atual antes de reabrir problemas já corrigidos.

## 6. Modelo do pacote de trabalho do PO

```text
ID e título:
Objetivo e valor para o jogador:
Origem da decisão / aprovação do PM:
Prioridade proposta:
Executor e apoios (confirmados pelo PM):
Base de código e documentação de referência:
Escopo incluído:
Fora do escopo:
Regras e dados a preservar:
Critérios de aceite observáveis:
Dependências e decisões pendentes:
Evidências exigidas (PR/SHA/testes/capturas/limitações):
Estimativa do executor e prazo aprovado pelo PM:
```

### Devolutiva esperada do executor

```text
ID da tarefa:
Entrega e alterações realizadas:
Branch / commit / PR / preview:
Testes executados e ambiente:
Critérios atendidos e não atendidos:
Riscos e regressões conhecidas:
Próxima decisão necessária do PM/PO:
```

## 7. Regras para evitar conflito entre agentes

Cada entrega tem um responsável primário. Se dois agentes precisarem editar o mesmo módulo, o PM coordena a distribuição e o executor combina a interface antes das alterações. Não reescrever trabalho de outro colaborador sem ler seu código/documentação e registrar a justificativa.

O GitHub concentra backlog, decisões, PRs e evidências. As conversas do PM e do PO orientam o trabalho, mas precisam ser traduzidas em registros compartilháveis. Não existe sincronização automática entre esta conversa, Codex, Manus, Claude, Kimi ou outra conta de ChatGPT. A atuação acontece nas sessões acionadas ou em automações expressamente configuradas.

Atualizações documentais de gestão podem ser preparadas pelo PO em branch/PR. Alteração de código, publicação, custos reais, mudança de proteção, dados sensíveis ou operações destrutivas continuam exigindo autorização compatível com o escopo.

## 8. Orientação inicial para a sessão do Codex

> Você assume o desenvolvimento principal do PilhA+ Game. André é o PM e define escopo, alocação e autorização de publicação. O ChatGPT da conversa de gestão é o PO e prepara backlog e critérios de aceite. Leia este documento, AGENTS.md e os registros atuais antes de agir. Confira branches, PRs e versão implantada; a PR #26/93e2d61 é apenas o marco conhecido desta transição. Preserve salão único, dupla visível, relógio, formação/XP e revisão ética. Execute uma entrega aprovada por vez e devolva PR/SHA, testes, limitações e decisões pendentes. Não mescle ou publique por presumir que a mudança de papéis autoriza isso.
