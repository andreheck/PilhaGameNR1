# PilhA+ Game — Sessão 20, Alpha 1.1

Data: 13/10/2026

## Escopo realizado

- A **tela inicial** passou a mostrar a ilustração panorâmica isométrica de toda a organização, enviada pelo usuário. Ela foi otimizada e mantida completa, sem cortes.
- O **galpão** e seus indicadores de risco foram transferidos para `/?view=casos`. A seção apresenta **5 casos**: 017 disponível; 018 Liderança e Reuniões, 019 Gestão de Pessoas, 020 Saúde e Bem-estar, 021 Tecnologia e Trabalho — em desenvolvimento.
- `/?view=equipe` usa os quatro retratos aprovados: operadora, psicóloga, psiquiatra e colaborador personalizável.
- `caso017.html` foi reconstruído como **caso completo e mais difícil**, com decisões encadeadas e pontuação de saúde do ambiente.
- `scene3d.html` foi criado como **laboratório de integração 3D**, independente do caso, que lê GLBs animados já importados e guardados no IndexedDB do `viewer3d.html`. Inclui cenário 3D provisório, deslocamento do personagem, animações de caminhada/corrida e interação com NPCs quando os GLBs estiverem disponíveis no mesmo navegador. O galpão FBX original ainda não foi convertido para a cena final.

## Modelo pedagógico e pontuação

Pontuação fictícia de 0 a 100, com meta **75/100** para cumprir o pré-requisito de progressão. O índice não é clinicamente validado e não representa conformidade com NR-1.

Etapas:

1. **Investigar**: no mínimo três evidências, com 6 unidades de esforço. As escutas dos personagens enriquecem a investigação.
2. **Analisar**: hipótese causal principal e devolutiva ética.
3. **Planejar**: escolher pelo menos duas medidas dentro de **12 unidades de orçamento**; avaliar custo, benefício e prioridades.
4. **Acompanhar**: escolher ao menos dois indicadores e um momento de revisão do plano.
5. **Resultado**: pontuação discriminada por evidências, análise, plano e acompanhamento. Resultado abaixo de 75 permite revisar escolhas.

A exposição indevida de dados clínicos/nominais ou a interpretação causal incompatível com o cenário limita a pontuação e impede alcançar o mínimo. Os casos 018 a 021 permanecem identificados como **em desenvolvimento**, mesmo quando o usuário atinge a meta de 75 pontos, para não criar falsas expectativas de liberação imediata.

## Arquivos principais

- `index.html`, `app.css`, `app.js`: SPA responsiva — visão geral, casos, equipe, biblioteca, configurações, sobre.
- `caso017.html`, `case.css`, `case.js`: jogo educativo do Caso 017, pontuação e salvamento local.
- `scene3d.html`: laboratório técnico 3D com Three.js e armazenamento local compartilhado com `viewer3d.html`.
- `assets/v11/`: 11 arquivos WebP, incluindo o panorama geral, quatro miniaturas dos cenários futuros, quatro personagens e dois estudos de galpão.
- `tests/static-flow.mjs`: verificações de cenários de sucesso e falha, guardrails éticos, navegação e integridade dos assets.

## Persistência

- Alpha 1.1: `localStorage['pilha-case017-v2']`.
- Alpha anterior: `localStorage['pilha-case017-v1']` e `localStorage['pilha-v08']` não são apagados e permanecem preservados. Mudança de esquema não migra automaticamente a pontuação da versão anterior.
- Preferências de interface: `localStorage['pilha-menu-preferences-v1']`.
- Modelos animados privados: IndexedDB `pilha-plus-personagem-v02`, objectStore `files` com chaves `operadora`, `psicologa` e `psiquiatra`.

## Verificações

Testes de lógica Node.js executados localmente para jornadas bem-sucedidas e malsucedidas, proteção de privacidade, cálculo dos pontos, status dos casos, presença dos retratos e integridade de arquivos WebP. O Chromium deste ambiente retornou `ERR_BLOCKED_BY_ADMINISTRATOR` mesmo ao interceptar as requisições; portanto, a **verificação visual no navegador continua pendente**. Não declarar QA visual concluído nem desempenho mobile validado.

## Próximas etapas

1. Converter/exportar o galpão FBX e objetos individuais para GLB com otimização de texturas e polígonos.
2. Substituir geometria provisória de `scene3d.html` pelo galpão modelado e adicionar colisões, pontos de interação e percurso.
3. Validar escala, pivôs, animações, transições e performance em Android e iOS reais.
4. Criar animações para o colaborador personalizável e expandir o elenco sem associar sofrimento a características físicas.
5. Testar a UX do início ao fim e consolidar a rubrica pedagógica com especialistas de NR-1 e gestão de riscos.

