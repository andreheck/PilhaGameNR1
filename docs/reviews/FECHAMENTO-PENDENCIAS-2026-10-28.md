# Fechamento das pendências técnicas — 28/10/2026

## Entrega na PR #56

Continuação expressa do PM após a revisão das PRs. Base: `523006a404a1917dc97813c2d21c3d16b154c69e`, branch `codex/revisao-prs-2026-10-28`. Heads #50 e #56 e threads conferidos no GitHub antes de editar; nenhuma contribuição concorrente identificada nesta branch. A versão no alias público continua `837d582`, distinta desta prévia.

### Avisos no celular

Os cartões simultâneos deixam de cobrir o mapa: um botão de 44 px exibe quantidade e atenção. O diálogo apresenta textos completos e ações existentes, alertas primeiro. Enquanto o jogador lê, o descarte automático aguarda; Escape e fechar retornam o foco. Uma ação libera o diálogo antes de abrir outro fluxo. No desktop, os cartões permanecem disponíveis e a pilha tem altura limitada. Fila efêmera limitada a oito, descartando informação antes de atenção quando cheia. Nenhum aviso é convertido em transação, nenhum novo armazenamento ou efeito financeiro.

QA de navegador nos layouts clássico e HUD v2, em 320×640, 390×844 e 1440×900: alvo e área do mapa, texto de atenção, foco, Escape, leitura acima do prazo original, ação real de examinar Produção e preservação de orçamento, recibos, semana, pausa, dupla e equipe. Capturas e axe são anexados ao CI. Testes de navegador executados no CI, sem declarar teste em aparelho físico.

### Dependência da PR #50

A falha de CRLF do harness original já está corrigida na #51 e é coberta pelo CI cumulativo da #56. Não há correção de produto a duplicar nem necessidade de reescrever a branch histórica #50. Seu head isolado continua sem CI de Actions encontrado; a evidência isolada 208+1 e o ensaio com harness 209 foram preservados na revisão anterior. A liberação deve avaliar a cadeia completa, em vez de liberar #50 isoladamente. Essa ressalva de integração permanece explícita para o PM.

### Disputa entre relógio e decisão de evento — revisão 29/10

A regressão encontrou um clique de decisão descartado enquanto `change` estava ocupado com um tick. A UI agora aguarda a alteração em andamento antes de processar uma ação do jogador; ticks concorrentes continuam descartados e as proteções de revisão/serial do modelo permanecem. O teste prende uma transação real de relógio com Web Locks, clica na opção gratuita e só então libera o relógio: a consequência deve ser salva uma vez, sem débito. Não muda o ritmo ou as regras de eventos.

## Critérios e evidências

- Central usa os mesmos elementos e callbacks dos avisos existentes; não altera decisões de eventos, compras, calendário, saúde, câmera ou saves.
- Sem novas dependências externas e sem nova chave localStorage.
- Build, suíte automatizada, regressão e capturas finais: resultados e SHA registrados no corpo da PR #56 ao concluir o CI.
- Documentos históricos não são convertidos em aceite. O backlog inicial foi identificado como histórico, com link para este estado atual.

## Pendências que exigem evidência externa ou decisão

| Item | Situação / próxima evidência | Responsável |
|---|---|---|
| Aceite funcional e visual | Examinar prévia e capturas da #56 e registrar parecer | PO |
| Merge / atualização do alias público | Decidir depois do aceite; nenhuma autorização inferida deste fechamento técnico | PM |
| iOS/Android e desktop físico | Conferir toque, zoom, foco, pausas, reunião e reload no mesmo save de teste | QA/PM |
| FPS / sessão longa em aparelho | Medir com hardware identificado, inclusive abas ocultas e retomadas; CI não substitui medição real | QA |
| Leitores de tela | NVDA/Firefox, VoiceOver/iOS e TalkBack; conferir central e equivalência textual do mapa | QA |
| Alto contraste | Emulação automática e inspeção visual ajudam; validação real com tecnologia assistiva permanece pendente | QA |
| PRs históricas divergentes | Revisão individual de escopo; não fechar ou mesclar em lote | PM/PO |
| Colisões avançadas / postos completos / poderes individuais | Evoluções separadas do produto, não bugs declarados resolvidos por esta revisão | PO define critérios / PM prioriza |

Esses itens não foram declarados concluídos sem evidência. Este fechamento entrega a correção técnica e uma prévia de PR; não representa homologação de produto ou produção.
