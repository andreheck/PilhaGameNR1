# PilhA+ Game — Alpha 1.3 | Biblioteca 3D Experimental

A Alpha 1.3 integra a biblioteca 3D experimental ao endereço principal da Vercel e preserva a experiência 2D como alternativa para o estudo. Foram incluídos: [Biblioteca 3D experimental](./biblioteca3d.html), protótipos reais GLB (mentor e ambiente), interação nas três estações, gravação do progresso compartilhado com a Missão 01 e navegação ao quiz anterior.

Os modelos 3D aqui foram criados **localmente a partir de primitivas geométricas**, sem geração Meshy e sem custo em créditos. Têm qualidade de protótipo e não representam os assets 3D definitivos do PilhA+.

### Como usar

1. Abra `/missao01.html`, clique em `Entrar na biblioteca` e escolha `Explorar esta biblioteca em 3D`.
2. Use **WASD/setas** para andar, **E** ou clique nos ícones 01–03 para explorar. No celular use o direcional e os cartões.
3. Registre as três leituras (+20 cada) e escolha `Continuar na Missão 01` para fazer o quiz.
4. Se o dispositivo não suportar a cena, conclua a missão pela versão 2D.

### Regras preservadas

`pilha-missao01-v1`, 60 pontos por leitura, 30 pontos por respostas, 10 por conclusão; 70/100 e 2/3 acertos para liberar o Caso 017. O caso continua com meta 75/100. Progresso existente não é apagado.

### Arquivos

`biblioteca3d.html`, `biblioteca3d.js`, `biblioteca3d.css`, `assets/v13/*.glb`, `assets/v13/*.png`, `docs/SESSAO-22-BIBLIOTECA-3D.md`, `tests/library3d-logic.test.mjs`, `tests/test_glbs.py`.

### Pendente

Geração do modelo final via Meshy (CLI não disponível nesta execução), rigging e animações, biblioteca definitiva, conversão do galpão FBX e QA visual no navegador. Nenhuma alegação de liberação mobile/performance oficial nesta versão.

### Publicação e acesso

- Entrada principal: `https://pilha-plus-game-preview.vercel.app/`
- Missão 01: `/missao01.html`
- Biblioteca 3D: `/biblioteca3d.html`
- Fallback: em falha do carregamento de módulos 3D, as estações em texto continuam acessíveis, inclusive em dispositivos sem WebGL.
