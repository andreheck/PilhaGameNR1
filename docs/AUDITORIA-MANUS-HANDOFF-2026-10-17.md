# Auditoria de integração — handoff Manus

**Data da auditoria:** 17/10/2026–18/10/2026  
**Base auditada:** `main` em `a33e0a65071e0ba529befbd6a0818a472c298390` (`a33e0a6`)  
**Escopo:** PRs #10–#13, testes locais, CI disponível e smoke test da preview pública.  
**Decisão:** não houve merge, deploy novo ou alteração de produção.

## Estado da base principal

A base `main` está consistente para a Alpha 1.4. A suíte `npm test` passou em um worktree limpo do SHA `a33e0a6`, incluindo os testes de navegação e fallback 2D. Também passaram `node --check` para `play.js`, `case01.js`, `case02.js`, `simulation/case01.js`, `simulation/case02.js` e `world3d.js`, além de `git diff --check`.

O CI correspondente terminou com sucesso: [workflow do SHA a33e0a6](https://github.com/andreheck/PilhaGameNR1/actions/runs/38959341078). A execução mais recente da `main` é a referência de validação; não foram usados checks inferidos ou resultados de branches diferentes.

## Matriz de branches e propostas

| Unidade | Estado atual | Evidência | Decisão recomendada |
|---|---|---|---|
| PR #10 — `feat/living-office-simulation` | Aberta, draft, baseada em `feat/psychosocial-environment-simulation`; `mergeable` no próprio base, mas não é uma candidata direta contra `main` | `npm test` falha em `tests/office-actor-brain.test.mjs`: movimento real `{x:2,z:0}` contra expectativa `{x:0,z:0}` | **Não mesclar.** Preservar a ideia da máquina de estados somente após corrigir o contrato de movimento e conectá-la ao `world3d.js` atual. Reimplementar ou portar em partes numa branch limpa se a rotina for necessária. Os documentos da PR são especificação, não funcionalidade integrada. |
| PR #11 — `fix/navigation-segment-collision` | Aberta, draft, conflitante com `main` (`mergeable: CONFLICTING`, `mergeStateStatus: DIRTY`) | Suíte própria passa; adiciona `simulation/navigation.js`, teste segmentado e quatro alterações em `world3d.js` | **Portar seletivamente.** O algoritmo `segmentBlocked`/`moveSafely` e seus testes são a melhor unidade isolada, mas precisam ser rebaseados sobre `main` e retestados contra as colisões atuais. Não fazer merge do branch inteiro. |
| PR #12 — `feat/investment-prediction-alerts` | Aberta, draft, conflitante com `main` | Suíte própria passa; sobrepõe `world3d.js`, `play.js`, `index.html`, `play.css`, navegação e package script | **Descartar como unidade de merge.** Usar somente como referência inicial do contrato de orçamento e histórico. A versão v1 tem seis melhorias e agenda previsões, mas não amadurece efeitos ao avançar o dia 30. Reimplementar sobre um módulo isolado e sobre o `main` atual. |
| PR #13 — `feat/investment-psychosocial-domains` | Aberta, draft, conflitante com `main` (`mergeable: CONFLICTING`, `mergeStateStatus: DIRTY`) | 903 linhas adicionadas; `npm test` falha no `alpha14.test.mjs` porque a expectativa `O trabalho muda` não está presente no HTML; mantém referências a Caso 017 e arquivos `case017-*` | **Não mesclar nem rebasear como bloco.** Aproveitar o catálogo v2 de 12 domínios, migração de estado v1/v2 e teste de maturação no dia 30. Criar branch limpa a partir de `main` e portar o motor em pequena PR. Os documentos de mapa urbano e currículos/salários permanecem backlog/especificação. |

## Interseção técnica encontrada

A sobreposição crítica é real:

- `world3d.js`: PRs #11, #12 e #13;
- `play.js`: PRs #12 e #13;
- `simulation/navigation.js`: PRs #11, #12 e #13;
- `simulation/investment.js`: PRs #12 e #13;
- `index.html`, `play.css` e `package.json`: PRs #12 e #13.

Por isso, o caminho seguro é uma branch limpa baseada em `main`, com contratos pequenos entre `simulation/*`, `world3d.js` e `play.js`. A PR #13 não deve ser usada como branch de integração, pois ela combina investimento, narrativa, alterações visuais, referências antigas de numeração e documentação de escopo diferente.

## Resultados reproduzidos por branch

- `main` em `a33e0a6`: suíte completa PASS; CI PASS.
- PR #10: FAIL no teste de `office-actor-brain`. O teste espera que um movimento de `(0,0)` para `(2,0)` permaneça em `(0,0)`, mas a implementação retorna `(2,0)`, que está livre no cenário definido. Há um desacordo entre o contrato do teste e a implementação, não uma aprovação da máquina de estados.
- PR #11: suíte própria PASS, mas branch conflitante com `main`.
- PR #12: suíte própria PASS, mas branch conflitante e com sobreposição ampla.
- PR #13: FAIL em `tests/alpha14.test.mjs` antes de concluir a suíte. A falha aponta texto esperado ausente no `index.html`; não há evidência suficiente para tratá-la como candidata verde.

Os checks individuais das PRs não foram declarados como sucesso com base em suposição: a API de Checks retornou `403 Resource not accessible by integration` para esses commits. Os resultados acima são reproduções locais reais nos respectivos worktrees.

## Smoke test da preview pública

A preview principal carregou em [pilha-plus-game-preview.vercel.app](https://pilha-plus-game-preview.vercel.app/). Foram observados:

- shell principal carregado;
- navegação `Casos`, `Equipe`, `Biblioteca` e `Progresso`;
- canvas 3D visível;
- quatro pontos de personagens no escritório;
- modelos/objetos visíveis no cenário;
- Caso 01 disponível e Casos 02–05 bloqueados sequencialmente;
- console sem saída de erro após o carregamento observado.

A captura real obtida pelo navegador foi [893×768](file:///home/ubuntu/screenshots/pilha-plus-game-prev_2026-10-18_02-09-11_6092.webp). Ela não deve ser apresentada como captura de 390×844 ou 1440×900. A ferramenta disponível nesta execução não permitiu configurar esses dois viewports exatos; portanto, esses critérios do handoff continuam pendentes.

Também não foi afirmada compra, projeção no dia 30 ou persistência de investimento na preview da `main`, porque o módulo de investimentos ainda está apenas nas PRs #12/#13 e não está presente na base publicada auditada. O fallback 2D possui cobertura automatizada em `tests/qa-navigation-fallback.test.mjs`, mas não foi forçado manualmente durante este smoke test.

## Bloqueios para a próxima etapa

1. Não mesclar PRs #10–#13 diretamente.
2. Corrigir o contrato do teste e da implementação da PR #10 antes de reutilizar a máquina de estados.
3. Rebasear ou portar apenas a colisão segmentada da PR #11.
4. Portar o motor de investimentos v2 da PR #13 para uma branch limpa, corrigindo a numeração para Casos 01–05 e adicionando migração explícita de estado.
5. Integrar a UI de investimentos por uma interface pequena em `play.js`, sem substituir o shell atual inteiro.
6. Adicionar teste de estado limpo, estado legado, JSON corrompido, compra repetida, saldo zero e avanço até o dia 30.
7. Reexecutar QA com viewports exatos de 390×844 e 1440×900, incluindo console, fallback 2D, GLB, navegação, persistência e performance.

## Proposta de branch candidata

Criar a partir de `origin/main`:

```text
integration/alpha15-vertical-slice
```

Ordem recomendada:

1. adicionar `simulation/navigation.js` e seus testes, sem tocar na narrativa;
2. adicionar `simulation/investment.js` v2 e testes de migração/30 dias;
3. definir os contratos `world.applyInvestmentUpgrade`, `world.resetInvestmentUpgrades` e atualização de indicadores;
4. adicionar a tela de investimentos em `play.js` com mudanças mínimas em `index.html`/`play.css`;
5. atualizar `package.json` e CI;
6. rodar a suíte completa e validar preview em desktop/mobile;
7. abrir uma PR revisável para aprovação do PO.

Essa sequência preserva o Caso 01 já funcional, evita apagar chaves existentes de `localStorage`, mantém o fallback 2D e separa o motor determinístico da apresentação.

## Riscos remanescentes

O ambiente 3D continua sujeito a riscos que não são cobertos pela suíte Node: escala visual, personagens presos em móveis, atravessamento sob frames específicos, custo de renderização em dispositivos móveis e disponibilidade real de WebGL. A suíte garante contratos e arquivos, mas não substitui a inspeção visual nos dois viewports exigidos.

As pontuações, indicadores e projeções devem continuar explicitamente educativas. Não podem ser apresentadas como diagnóstico, avaliação individual de saúde, comprovação de NR-1/GRO/PGR ou garantia de prevenção.
