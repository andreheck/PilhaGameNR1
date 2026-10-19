# Entrega — acionista, dupla visível, ciclo e revisão Kimi

## Origem e escopo
Base funcional: `feature/collab-hero-duos`, `c 319 fb 34 fe 8 c 3 c 275216 c 7 cdd 5542 baf 320 bc 29 b` (salão/dupla da PR #24). Referência da abertura: `andreheck/pilha-plus-pwa-preview`, `branding/pilha-logo-puro.png`, classes `entry-orbit` do App publicado; não foi alterado o repositório do App. As regras de jogo vêm do pedido de 19/10/2026. Os coeficientes novos estão identificados como protótipos.

## Implementado
- Abertura com a marca original do App, órbitas 20/18/14 segundos e transformações contínuas. Removida animação contínua de blur; animações pausam quando a aba fica oculta. O contador da abertura segue frames em primeiro plano e não pula automaticamente por tempo suspenso. Carregamento do 3D ocorre somente depois de terminar a transição de saída.
- Faixa permanente no salão: acionista, nomes do especialista principal e apoio, relógio, dia simulado, pausa/retomada e painel Habilidades e ciclo. Continua visível ao trocar as cinco áreas e durante decisões.
- Motor puro e versionado com 7 dias/hora, horizonte 30 dias (4 h 17 min 09 s), marcos 7/14/21/28/30, armazenamento defensivo, bloqueio de relógio entre abas e sem tempo offline automático.
- Dupla congelada após iniciar; anteriores escolhas salvas permanecem. Inventário não é apagado pela nova funcionalidade.
- Passiva e ativa do Diretor com preparação, rampa, duração e recarga de protótipo. Outros dois poderes do Diretor estão apresentados conceitualmente, não ativados. A situação de cada ficha e de cada poder fica explícita; confira a atualização de fichas ao final deste registro. Nenhum novo GLB foi inventado.
- Novas missões temporizadas dependem de plano aprovado e conclusão do ciclo; antigas conquistas são históricas, preservadas. Avanço instantâneo 30 dias removido do fluxo principal.
- Kimi P 1: flags impeditivas, teto 49 e justificativas visíveis por escolha. Catálogo distingue SST/físico/ergonômico de fatores psicossociais. Modelo de eixos com retornos decrescentes e sinergia piloto, sem probabilidades clínicas.

## Testes executados antes da publicação
Suíte existente e 12 testes novos em `tests/mission-timeline.test.mjs` passaram no ambiente de desenvolvimento. O fechamento completo foi exercitado por testes puros com deltas controlados, **não por uma sessão humana contínua de 4 h 17 min**.

Chromium headless em 1440 × 900 e 390 × 844:20 amostras de transformação orbital em movimento; nenhum GLB antes da aceitação; cincoGLBs após entrada; dupla exibida em todas as áreas; relógio real avança/pausa/persiste; habilidade fica Preparando e não pode ser repetida; compra de ergonomia preservada; violação de sigilo não aprova o caso; nenhum overflow horizontal/exceçãoJavaScript observados. Evidências em `docs/qa/evidence/timeline/`.

Na versão anterior, a amostragem também mostrou que a órbita conseguia movimentar-se no executor: a parada relatada pelo usuário não foi reproduzida como congelamento permanente. A correção trata custos gráficos e transições concorrentes identificados no código, sem afirmar uma causa única confirmada no computador do usuário. Validar novamente em aparelho real.

## Pendências explícitas
Sessão longa real; Android/iOS físicos; leitor de tela; desempenho em hardware de entrada; refinamento de coeficientes; fichas restantes; sincronização com servidor; execução animada dos novos heróis 3D; unificação dos dois motores do Caso 01; reponderação de silence noCaso 02; quiz fonte por item; aprovação especializada. A revisão original do Kimi não é um atestado deste motor novo.

## Referências de continuidade
- `docs/MOTOR-ESTATISTICO-TEMPORAL.md`: fórmulas, unidades, fontes e hipóteses.
- `docs/reviews/TRIAGEM-KIMI-2026-10-19.md`: prioridadesP 1–P 10 sem alteração silenciosa da revisão recebida.
- `docs/FONTES-E-MAPEAMENTO.md`: matriz inicial, campos não verificados marcados pendentes.

Claude deve preservar a faixa de dupla/relógio e a identidade doApp. Manus deve preservar o motor puro, evitar contagem por frame e validar a longa duração. Kimi revisa fundamentos sem transformar coeficientes fictícios em estatísticas empíricas. André valida fluidez da abertura, ciclo e papéis no próprio aparelho.


### Fichas novas encontradas antes do fechamento
Na verificação final da PR22, commit `a7660cb78e768b95266280ea709992791df33c67`, os colaboradores haviam consolidado Cientista de Dados e Engenheiro de Segurança. As fichas originais foram preservadas, os nomes/status atualizados no catálogo e seus oito poderes conceituais incorporados ao painel. Eles não estão classificados como fichas ausentes. Sua execução temporal permanece pendente do contrato de dados/inspeção e balanceamento; não se confundem com os dois poderes temporizados do Diretor.


### Guardas adicionais verificadas
Teste separado em Chromium: preferência por movimento reduzido desativa as órbitas; os oito poderes conceituais novos são apresentados sem ativações inventadas; um Web Lock mantido em outra aba bloqueia uma segunda contagem; evento de ocultação controlado pausa o ciclo sem acumular tempo. Evidência `docs/qa/evidence/timeline/guards.json`.
