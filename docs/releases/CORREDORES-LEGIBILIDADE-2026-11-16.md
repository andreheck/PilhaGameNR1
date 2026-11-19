# Legibilidade dos corredores — 16/11/2026

## Escopo desta etapa

Os três departamentos já tinham duas passagens físicas conectadas por portas, usadas pela movimentação dos NPCs e do explorador. Esta alteração torna o traçado mais fácil de identificar no mapa geral: piso um pouco mais largo, contorno quente de alto contraste, linha central tracejada e juntas de pavimentação.

O desenho é apenas visual. Coordenadas, portas, grafo de navegação, colisões, agenda, câmera e posições das salas permanecem inalterados. O galpão segue como anexo da Produção: a checagem de navegador confirmou que o menu o abre e que o NPC-09 alcança a área de carga.

## Validação

- `npm run build` e `git diff --check` passaram.
- `node --test tests/company-circulation.test.mjs tests/navigation-collision.test.mjs tests/logistics-space.test.mjs`: 9 testes passaram; rotas, portas, obstáculos e circulação sem alterações.
- QA no Chromium em 1440×900: mapa geral, setores sem a antiga fileira de botões, corredor visível e nenhum erro de JavaScript.

## Próximas etapas propostas

1. Validar se o novo corredor está legível nos dois pontos de ligação e no zoom normal.
2. Com o corredor aprovado, revisar a posição relativa das salas no terreno de 50×50 sem ocupar os lotes reservados.
3. Ajustar a disposição interna dos móveis depois de estabilizar a posição das salas.
