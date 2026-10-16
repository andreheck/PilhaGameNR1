# Alpha 1.4 — QA de navegação e experiência, 16/10/2026

Correções aplicadas sobre a versão mais recente do projeto, sem remover os Casos 01–05, a simulação global da empresa, as decisões gerenciais, as transições do escritório e os modelos GLB.

- A função interna `history()` foi renomeada para `progressView()`; agora o menu usa `window.history.replaceState` sem conflito de nomes.
- O relatório de conclusão dos Casos 03–05 recebe o mesmo estado global da empresa utilizado no cálculo da pontuação gravada. Evita relatório diferente do resultado.
- Os cartões dos personagens aparecem no painel contextual de cada caso, incluindo o colaborador ilustrado ainda sem GLB próprio.
- A navegação entre seções encerra corretamente a conversa contextual anterior.
- Se o 3D ou seus módulos não carregarem, o panorama isométrico 2D aparece com hotspots de setores e personagens, mantendo decisões e diálogos disponíveis.
- A página permanece restrita a uma viewport; em espaços pequenos, textos longos usam rolagem interna do painel, não da página.

Validações: `npm test` inclui o teste de regressão `tests/qa-navigation-fallback.test.mjs`; inspeção visual em navegadores reais continua recomendada. Esta versão é educativa e não uma avaliação NR-1.
