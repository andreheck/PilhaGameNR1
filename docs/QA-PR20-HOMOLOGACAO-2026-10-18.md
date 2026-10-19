# Homologação técnica — PR #20 / Alpha 1.5 candidata

**Status:** EM REVISÃO — não aprovada para merge ou produção.

**Base auditada:** PR #20, branch `integration/pilha-current-vision`, SHA `060390a1d037255816af1a5521e9da62a13ba689`.

**Branch de correção:** `fix/pr20-mobile-glb-qa`, baseada no SHA acima. Correção aplicada no commit `ff56fbf`.

**Ambiente:** cópia local servida por `python3 -m http.server 4173`, Chromium `154.0.8037.57` headless, emulação CDP com dimensões CSS exatas, WebGL SwiftShader. As capturas são de navegador emulado; não representam Android Chrome nem Safari iOS em dispositivo físico.

## Resultado

A integração está funcional para uma revisão técnica, mas ainda não deve ser marcada como release validada. A suíte automatizada passou integralmente. O navegador reproduziu dois problemas concretos no hub 3D: as etiquetas dos personagens eram renderizadas fora da posição indicada e um GLB sem animações provocava uma exceção no loop de rotinas. Ambos foram corrigidos na branch de correção e retestados.

O fluxo de investimentos também foi exercitado após os fixes: orçamento inicial de 10.000 créditos, compra de `pausas`, saldo de 8.800, bloqueio de compra duplicada, avanço ao dia 30 e restauração do estado após recarga. O fallback 2D foi forçado com WebGL desabilitado e exibiu o mapa de compatibilidade.

## Testes automatizados

Executados na branch `fix/pr20-mobile-glb-qa`:

- `npm test`: passou em todos os módulos existentes, incluindo casos 01–05, integração do Caso 01, Caso 02, estado global, decisões de gestão, fluxo estático, navegação/fallback, colisões e investimentos.
- `node --check world3d.js`: passou.
- `node --check play.js`: passou.
- `git diff --check`: passou.
- O teste `tests/qa-navigation-fallback.test.mjs` foi ampliado para proteger os dois fixes.

## QA de navegador emulado

### Hub 3D em 390×844

A cena 3D ficou visível, com setores, móveis, personagens e navegação inferior. As quatro etiquetas dos personagens ficaram dentro do palco e próximas das coordenadas esperadas. As posições computadas após a correção foram, em pixels CSS, aproximadamente: Operadora `[40,430–185,458]`, Psicóloga `[209,434–332,462]`, Psiquiatra `[253,295–385,323]` e Gestor-mentor `[145,211–298,239]`.

[Captura do hub — 390×844](evidence/pr20/hub-390x844.png)

### Hub 3D em 1440×900

A barra lateral, o escritório modular, os cinco setores, os personagens GLB e o painel de casos ficaram visíveis. As etiquetas deixaram de se acumular na borda esquerda.

[Captura do hub — 1440×900](evidence/pr20/hub-1440x900.png)

### Jornada do Caso 01

A entrada da Missão 01 continuou legível em retrato e desktop, com o prólogo, biblioteca de aprendizagem, progressão visual e acesso ao modo 3D/2D.

[Captura do Caso 01 — 390×844](evidence/pr20/caso01-390x844.png)  
[Captura do Caso 01 — 1440×900](evidence/pr20/caso01-1440x900.png)

O percurso completo do Caso 01 — prólogo, três estações, quiz, conversas, quatro decisões, resultado e desbloqueio — já havia sido exercitado durante a auditoria da PR #20. O patch `ff56fbf` não altera `cases-data.js`, `play.js`, os motores de simulação ou o fluxo do caso; a jornada visual foi retestada nos dois viewports após a correção.

### GLB, animações e console

As requisições de recursos confirmaram os quatro GLBs de atores do hub: `operadora.glb`, `psicologa.glb`, `psiquiatra.glb` e `v13/gestor-mentor-prototipo.glb`, além do mobiliário Kenney. A exceção observada antes da correção vinha de `mixer.clipAction(undefined)` quando um GLB chegava sem clipes de animação. `animate()` agora retorna `false` quando o mixer não existe ou quando `a.clips` está vazio.

Após a correção, o CDP registrou **zero exceções JavaScript não relacionadas ao favicon** nos dois viewports. Permanece um `404` não funcional para `/favicon.ico`; ele é um achado P2 de acabamento e não interrompe o jogo.

### Fallback 2D

Com `--disable-gpu --disable-webgl`, o navegador carregou a classe `scene show-static`, exibiu o status `Visão geral 2D · selecione um setor ou personagem`, apresentou `fallback-map` com `display: block` e não manteve o canvas 3D visível. O fallback preserva os controles e os casos jogáveis.

### Investimentos e persistência

O smoke test no navegador confirmou:

1. `¤ 10.000` no primeiro carregamento.
2. Compra de `pausas` por `¤ 1.200`, com estado persistido e saldo de `¤ 8.800`.
3. O controle da mesma melhoria ficou desabilitado após a compra.
4. O avanço simulou o dia 30 e registrou o evento de consequência.
5. Após recarregar, o painel exibiu `Investido: ¤ 1.200 · 1 melhorias adquiridas · Dia 30/30`.
6. Os cinco destinos `01, 02, 03, 04, 05` estavam presentes no palco e nos controles do hub.

## Achados corrigidos

### QA-DATA-01 — etiquetas fora do palco

A classe `.actor-point` tinha `left` e `top` inline, mas não tinha `position:absolute`. O `transform: translate(-50%, -50%)` era aplicado em itens estáticos, fazendo todas as etiquetas começarem pela borda esquerda e prejudicando leitura e toque. A correção adiciona `position:absolute` e foi protegida por teste estático.

### QA-DATA-02 — GLB sem animação interrompia a rotina

A rotina chamava `mixer.clipAction(undefined)` quando `gl.animations` era vazio. A correção trata animação como capacidade opcional do asset e retorna `false` antes de procurar clipe inexistente. O modelo continua podendo ser renderizado sem declarar animação inexistente.

## Limitações e pendências

Este QA foi feito em navegador Chromium headless com emulação CDP. Não houve teste em Android Chrome físico, Safari iOS físico, leitor de tela, toque real, orientação paisagem em dispositivo real ou medição de FPS/uso de memória em hardware móvel. O CI da branch de correção passou no SHA `73c671231c349238c963d4937359b5a98a2c3583`.

O Caso 02 ainda está compacto em comparação com o aprofundamento pedagógico do Caso 01. A tela de investimentos usa cenários sintéticos e educativos; não é avaliação de risco real, diagnóstico, comprovação de conformidade ou previsão causal validada. A revisão técnico-pedagógica da NR-1 continua dependente de Kimi, especialistas e PO.

O `favicon.ico` ausente gera um erro de rede não funcional no console. Recomenda-se corrigir em uma alteração pequena de acabamento, sem misturar com a integração dos casos.

## Próximos responsáveis

- **Manus:** enviar esta branch, acompanhar CI, manter a correção de runtime e preparar a PR revisável. Não fazer merge nem deploy sem autorização.
- **Claude:** revisar densidade dos rótulos, alvos de toque e hierarquia mobile após a correção técnica.
- **Kimi e especialistas:** revisar as afirmações e intervenções pedagógicas relacionadas à NR-1 antes de qualquer aceite.
- **Coordenação/PO:** decidir merge da correção, autorizar preview público e priorizar Caso 02 aprofundado.

## Evidência de código

- PR canônica: [#20](https://github.com/andreheck/PilhaGameNR1/pull/20)
- CI da branch de correção: [workflow 39179153636](https://github.com/andreheck/PilhaGameNR1/actions/runs/39179153636)
- Preview local usada neste relatório: `http://127.0.0.1:4173/`
- Branch de correção: `fix/pr20-mobile-glb-qa`
