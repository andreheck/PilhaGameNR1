# Design QA — Alpha 1.1

**final result: blocked**

## Referências
- Design principal: `/mnt/data/Escritório Isométrico com Operações Integradas.png`, 1536 × 1024 px, usado integralmente na visão geral.
- Referências aprovadas: imagens de galpão e quatro personagens, já mantidas na biblioteca visual do PilhA+.

## Implementação
- `index.html`: abertura responsiva com panorama geral, navegação, progresso e cinco etapas.
- `/?view=casos`: Galpão logístico e mapa de riscos; quatro cartões de futuros casos.
- `/?view=equipe`: quatro retratos aprovados, descrições e links de 3D.
- `caso017.html`: jornada educativa com pontuação e possibilidade de revisão.

## Evidências que foram possíveis
- Otimização das imagens verificada com Pillow.
- `node --check` passou para `app.js` e `case.js`.
- `tests/static-flow.mjs` passou: resultado bem-sucedido 100 pontos, malsucedido 23 pontos, pontuação limitada em violações de privacidade, cinco casos com quatro indisponíveis, equipe e ativos válidos.

## Bloqueio
- Chromium e Playwright retornaram `net::ERR_BLOCKED_BY_ADMINISTRATOR`, inclusive para domínio simulado com interceptação de rede.
- Não foi possível capturar uma screenshot renderizada da implementação e comparar com a referência no mesmo viewport.
- **Sem captura real, não é possível atribuir `passed` ao design QA.**

## Itens pendentes para inspeção humana/browser
- Desktop 1440 × 900 e mobile 390 × 844: tipografia, espaçamento, cores, enquadramento da imagem e qualidade dos personagens.
- Overflow horizontal, estados de foco, botões e seleção de casos.
- Percurso completo da pontuação e comportamento do laboratório 3D em dispositivos reais.

