# PilhA+ Game — Alpha 1.4 · escritório vivo

## Visão geral

Esta versão substitui a tela inicial por uma interface desktop que cabe em `100dvh`, com barra lateral, visualização tridimensional do escritório modular e painel contextual. Em mobile, a navegação usa cinco botões inferiores e o painel de decisões é recolhível; o usuário pode alternar entre contexto 3D e mapa ilustrativo 2D. A experiência preserva as páginas legadas `/missao01.html`, `/caso017.html`, `/biblioteca3d.html`, `/scene3d.html` e `/viewer3d.html`.

## Casos jogáveis (alpha)

- 017 — Galpão logístico: sobrecarga, jornada, turnos e conflitos;
- 018 — Liderança e reuniões: segurança psicológica e silêncio;
- 019 — Gestão de pessoas: autonomia, papéis e demandas contraditórias;
- 020 — Saúde e bem-estar: sigilo, escuta e prevenção;
- 021 — Tecnologia e TI: hiperconexão, plantões e descanso.

Cada caso possui quatro escolhas situacionais (investigação, interpretação, intervenção e acompanhamento), com três alternativas por etapa e uma pontuação de 0 a 100. A meta é 75, desbloqueando o próximo cenário. O cálculo considera somente uma escolha por etapa; as consequências educacionais aparecem no relatório final. Conclusões antigas do Caso 017 em `pilha-case017-v2` com >=75 continuam reconhecidas.

## Personagens

Modelos GLB originais do usuário incorporados após otimização JPEG 1024px, com seus canais de animação e esqueletos preservados:

- `assets/actors/operadora.glb`: 3 animações, aprox. 1.18 MB;
- `assets/actors/psicologa.glb`: 4 animações, aprox. 1.86 MB;
- `assets/actors/psiquiatra.glb`: 4 animações, aprox. 1.46 MB.

A câmera move-se suavemente entre setores; os personagens associados caminham para a região ativa, com transição animada (crossfade). Personagens podem ser selecionados para uma descrição contextual. O colaborador personalizável permanece no modo de retrato, ainda sem modelo GLB animado entregue.

## Limitações e transparência

O escritório 3D atualmente é uma **reconstrução modular procedural** (mesas, paredes, racks e servidores), não a importação de um modelo completo de escritório do Meshy. Os retratos WebP e a imagem panorâmica existente continuam como alternativa 2D. O modelo real do galpão do Meshy em FBX/ZIP ainda aguarda transformação para GLB otimizado, ajustes de escala e colisões. As decisões dos Casos 018–021 são protótipos pedagógicos jogáveis, ainda sem revisão externa especializada. Para telas pequenas ou fontes ampliadas, não é possível garantir leitura de todos os detalhes simultaneamente sem expandir um painel; usamos abas e painéis recolhíveis para evitar rolagem da página inteira.

## Testes

`node tests/alpha14.test.mjs` verificou cinco casos, níveis de pontuação, desbloqueio, compatibilidade com progresso anterior, arquivos GLB, animações e CSS. Inspeção visual real do Chrome/Safari e controle com toque permanecem pendentes.

## Progresso

- Caso 017 anterior: `localStorage['pilha-case017-v2']` (preservado).
- Casos desta versão: `localStorage['pilha-case-0XX-alpha14']`, com respostas, passo, estado e pontuação.
- Missão 01: `localStorage['pilha-missao01-v1']` (preservado).

Este jogo é uma simulação educativa; pontuações não demonstram conformidade com a NR-1 nem avaliam a saúde clínica de pessoas reais.

## Ajustes de finalização

- Caminho de carregamento 3D corrigido para `/assets/actors/*.glb`, correspondendo aos arquivos realmente publicados.
- Panorâmica via WASD ou setas implementada com limites de câmera.
- Repetir um caso não apaga a melhor pontuação já conquistada nem bloqueia um próximo caso anteriormente liberado.
- A rolagem da página permanece desativada. Caso a janela seja pequena, somente o painel contextual poderá ter rolagem interna, evitando cortes de texto e botões.
