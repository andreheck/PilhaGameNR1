# Primeiros passos na empresa — 11/11/2026

## Objetivo

Conduzir quem acabou de escolher os heróis e contratar a equipe inicial por uma primeira decisão observável. Preservar o orçamento, o relógio e as escolhas do jogador.

## Entrega

- Após confirmar as três gerências e três funcionários, aparece um guia opcional de 60–90 segundos.
- A abertura distingue heróis-consultores dos NPCs que trabalham nos setores e explica que o pacote inicial não cobra créditos nem folha extra.
- O guia leva à Produção e explica como comparar preço, fatores e prazo nos cards da loja.
- A compra é sempre decisão do jogador. O guia reage apenas a uma compra concluída no motor e apresenta o setor, o custo e o prazo registrados.
- A orientação explica que compras não avançam o calendário, a semana simulada dura 15 minutos ativos e chamadas de eventos pausam o relógio até a decisão.
- “Pular guia” e fechar preservam a etapa; “Menu → Primeiros passos” permite retomar ou rever. Preferência fica em uma chave local própria, fora do save da empresa.
- Não atribui bônus, compra item automaticamente ou altera o tempo do jogo.

## Evidências e aceite técnico

- QA Playwright isolado em 1440×900 e 1024×768: contratação inicial, seleção da Produção, compra real escolhida pelo teste, conclusão, pular e retomar; sem erros de navegador.
- QA completo da empresa viva em 320×844, 390×844, 844×390, 1366×768 e 1440×900; cadeira/influências também em 1366×768 e 390×844.
- Testes de leitura/escrita da preferência local, corrupção, armazenamento bloqueado e preservação do save empresarial.
- `npm test` inclui o novo teste `tests/first-objective.test.mjs`.

## Estado de revisão

Preparado em `codex/unified-social-agenda`; CI da PR #69 passou em `91eace3100976abd53d00a9cce1f1d65cfb21248` (test, browser, atlas e regression). Aguarda aprovação do PM antes de merge ou publicação. O guia em si não é evidência de teste com jogadores reais.
