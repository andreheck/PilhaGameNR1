# PilhA+ Game — Sessão 22 | Experimento Biblioteca 3D

Data: 13/10/2026. Versão: Alpha 1.3 **prévia experimental**, sem substituir a Alpha 1.2 validada em lógica.

## Propósito

Conectar uma cena 3D clicável às três estações já aprovadas na **Missão 01 — Conhecendo a NR-1 no Brasil**, preservando os conceitos e a pontuação existentes. O conteúdo oficial continua vindo de `content/mission01.json` (fonte única).

## O que foi criado

- `biblioteca3d.html`, `biblioteca3d.css`, `biblioteca3d.js`: cena Three.js com câmera isométrica, avatar móvel, mentor GLB, três hotspots clicáveis (01 saúde mental, 02 fatores de risco psicossociais, 03 segurança psicológica), diálogo de conteúdo, pontos por leitura e entrada 2D mantida.
- `assets/v13/biblioteca-modular-prototipo.glb`: ambiente modular local de aproximadamente 8,6 × 8,6 unidades, com estantes, mesa, cadeiras, três terminais, plantas e paredes abertas. Geometria PBR leve e nomes de objetos próprios.
- `assets/v13/gestor-mentor-prototipo.glb`: modelo low-poly próprio, **estático**, de homem negro de óculos, blazer azul-marinho e roupa de trabalho clara, consistente com o briefing. Ele **não foi criado no Meshy**, não possui rigging e não substitui o personagem definitivo.
- `assets/v13/biblioteca-3d-preview.png` e `assets/v13/gestor-mentor-preview.png`: renders de inspeção off-line dos GLBs; **não são screenshots do navegador**.
- `mission01.js`, `mission01.css`: link opcional da etapa de exploração para a nova biblioteca 3D; a rota anterior, o glossário, o quiz e o caso logístico continuam intactos.

## Integração com progresso

- A página 3D **lê e grava a mesma chave** `localStorage['pilha-missao01-v1']` da Alpha 1.2.
- Cada `id` de estação gravado em `explored[]` vale os mesmos 20 pontos da biblioteca 2D; revisitar não duplica entradas.
- A página 3D **não altera** respostas, nota final, `certified`, `passed`, `bestScore`, nem o estado `pilha-case017-v2`.
- Após concluir três leituras, o jogador retorna a `/missao01.html` para responder às três perguntas. Pré-requisito inalterado: **mínimo 70/100 e dois acertos**.
- É possível usar as três estações pelos botões de texto sem WebGL, pela aproximação com **E** ou clicando nos marcadores do cenário.

## Técnica e limitações

- Fonte do renderizador: Three.js 0.180.0 via CDN (mesma família de implementação de `scene3d.html`). Se WebGL ou a CDN falhar, há link para a versão 2D; sem o módulo importado, os cartões da página 3D também não são carregados.
- `GLTFLoader` abre os GLBs locais. Câmera ortográfica com rotação restrita; movimento WASD/setas, corrida Shift e direcional móvel; colisões simples por caixas em regiões principais.
- Não há animação óssea nem blendshape facial do mentor. Requer Meshy disponível para substituir o modelo por versão riggada, clips `idle/talk/point` e revisar escala, pivôs e performance em dispositivo real.
- O galpão FBX original permanece em arquivo separado; não foi convertido nesta etapa. Não declarar progresso de conversão.
- Não há dados clínicos pessoais na cena. O índice é **pedagógico fictício**, não ferramenta clínica ou avaliação de conformidade NR-1.

## QA

- GLBs testados com `trimesh.load()` e cabeçalho `glTF`: biblioteca 146 meshes / 3484 triângulos (aproximados); mentor 44 meshes / 2936 triângulos.
- `node --check` em scripts novos e da Missão 01.
- `node tests/library3d-logic.test.mjs` confirma mapeamento dos IDs, registro idempotente e preservação do score anterior.
- `node tests/mission01.test.mjs` e `node tests/static-flow.mjs` confirmam as regras anteriores da missão e do Caso 017.
- Preview offline inspecionado. **Captura web desktop/mobile não realizada**: não há binário Chromium instalado para o Playwright neste ambiente. Validar com navegador real antes de tornar 3D padrão.

## Próximas entregas

1. Habilitar CLI Meshy 0.4.0 via Node 22 e conectar conta autorizada, respeitando os créditos do projeto; solicitar o modelo definitivo do mentor em A-pose e textura PBR.
2. Verificar a miniatura e riggar mentor; importar `idle/talk/point` se disponíveis e confirmar as transições.
3. Substituir o protótipo da biblioteca por GLB Meshy modular e confirmar os 3 hotspots/colliders com as novas medidas.
4. Fazer QA visual 1440×900 e 390×844 e testar fluxo inteiro de 3D para quiz e Caso 017.
5. Trabalhar a conversão do galpão FBX para GLB apenas após escolher ferramenta compatível, sem destruir os originais.
