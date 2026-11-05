# Revisão da frente única — 05/11/2026

Base conferida: PR #69, branch `codex/unified-social-agenda`, head `eef2a88`, base main `846f88d`. Aberta, draft, sem merge; nenhuma thread de revisão ou review submetido na consulta. Worktree inicialmente limpo. Inventário de 46 PRs abertas em `docs/qa/REVISAO-PRS-2026-11-05.json`; inventário não equivale a revisão integral dos diffs ou prova de ancestralidade.

## Correção desta entrega

A PR #56 (`047f81d`) já corrigia cliques descartados durante uma gravação do relógio. A frente #69 ainda retornava `busy` imediatamente para ações do jogador. Agora elas aguardam a transação em andamento; ticks redundantes podem continuar descartados. Validação de revisão, serial de evento e gravação atômica permanecem no motor existente.

Os testes exercitam a função real da UI: relógio bloqueado, decisão enfileirada, duplicata sem cobrança dupla, preço com revisão antiga rejeitado e liberação da fila após exceção. O QA Playwright também segura um Web Lock real, clica na decisão de evento e libera o relógio, verificando consequência salva e saldo da opção gratuita.

## PRs conferidas nesta rodada

| PR | Head | Resultado e encaminhamento |
| --- | --- | --- |
| #69 | eef2a88 | Frente operacional única; integrações anteriores preservadas. Esta entrega adiciona a fila de ações e o QA concorrente. |
| #56 | 047f81d | Portada seletivamente a correção de ações concorrentes. Agenda e avisos requerem adaptação; não incorporar o HUD antigo junto. |
| #58 | 20d830c | Pacote documental lido. Auditoria dos seis heróis e variantes desgastadas ainda precisam ser feitas contra o runtime contínuo atual. Não tratar especificação como arte final. |
| #62 | 342fb35 | Plano de QA da base d504d36; evidência antiga não homologa a frente atual. Os novos checks executam a jornada atual. |
| #63 | be331ac | Diagnóstico documental útil para inventário/recibos. Referências a 24 itens e index/play.js precisam atualização: hoje são 38 itens no build contínuo. Não importar uma entrada antiga. |
| #64 | e53b883 | Arquivos da PR confirmam CSS e documentação, sem os quatro PNGs finais de TV. Integração visual exige binários e calibração de máscaras. |
| #51–#55 | heads conferidos no GitHub | Cadeia antiga de CI/HUD/mundo/móveis/convivência; partes já portadas seletivamente. Não declarar equivalência integral nem encerrar sem conferir os deltas restantes. |

As demais PRs listadas no JSON receberam somente inventário nesta rodada. Nenhuma foi mesclada, aprovada ou encerrada automaticamente.

## Pendência reproduzida: agenda na fronteira

Base eef2a88, semana 2, todos os NPCs com saúde 40: para NPC-02, `sampleAt(239999)` calculado pela agenda montada no início da semana difere da mesma consulta após reconstruí-la em activeMs=119999. Não foi observado overlap na amostra de semanas 2–3; foi observada instabilidade de posição após recálculo.

A correção de ciclo fixo da #56 não pode ser copiada isoladamente: na experiência atual, ritmos individuais e limitação compartilhada de seis trajetos exigem adaptação conjunta. O ensaio não preservou as sete pausas de um NPC em 14 dias, portanto não foi incluído nesta entrega.

Próxima entrega: agenda determinística de 14 dias, mantendo sete pausas e duas reuniões por funcionário, trajetos completos, capacidade de seis visitas ordinárias, ritmos individuais e posições estáveis em reload/fronteiras de semana e ciclo. Testar também saúde baixa e gerente ausente/escolhido. Reuniões são contabilizadas separadamente das visitas ordinárias no motor atual.

Depois: correspondência ficha×código dos seis heróis (incluindo H06), inventário envelhecido/TV com artes aprovadas, avisos simultâneos e acessibilidade. Controle integral dos heróis, homologação em dispositivos físicos e revisão PM permanecem pendências explícitas.

## Verificação

Build, testes de concorrência/eventos/empresa e compilação do QA foram executados nesta entrega. Evidência final e status do CI vinculados à PR #69 no commit enviado. Preview é para testes; não há merge, promoção ou alteração do domínio de produção.
