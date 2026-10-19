# PilhA+ Game — desenvolvimento atual

**Fonte canônica:** [Visão de Produto (18/10/2026)](docs/PRODUTO-CANONICO-2026-10-18.md). A versão Alpha 1.4 da main continua publicada; esta branch contém candidata de integração de investimentos, prólogo opcional, navegação por colisão, fallback 2D e estado global, pendente de testes.

**Áreas:** Casos 01–05, Equipe, Investimentos, Biblioteca e Progresso. O novo mapa costeiro e os sistemas de currículos, mobilidade e contratação são especificações atuais ainda não implementadas como gameplay.

**Testes:** `npm test` e QA manual em mobile/desktop. Não fazer merge ou deploy de produção sem revisão.

---

## Histórico da Alpha 1.4

# PilhA+ Game — Alpha 1.4

Versão principal: **[Abrir o simulador](https://pilha-plus-game-preview.vercel.app/)**. O novo hub ocupa uma tela, inclui cinco casos educativos sequenciais, câmera isométrica com transições suaves, três personagens GLB animados e painéis contextuais. A meta pedagógica de cada caso é **75/100**, com pontuação máxima de 100. Os Casos 02 a 05 estão jogáveis em alpha, sujeitos a revisão pedagógica.

- **Missão 01 / Fundamentos da NR-1:** [Biblioteca e quiz](https://pilha-plus-game-preview.vercel.app/missao01.html).
- **Caso 01 anterior aprofundado:** [Fluxo de investigação](https://pilha-plus-game-preview.vercel.app/caso01.html).
- **Biblioteca 3D experimental:** [Acessar](https://pilha-plus-game-preview.vercel.app/biblioteca3d.html).
- **Especificação e limitações:** [Alpha 1.4](docs/ALPHA-14.md).
- **Testes:** `node tests/alpha14.test.mjs`.
- **Roadmap de produto:** [Módulos, simulador de propostas e vídeo motion graphics](docs/ROADMAP-PRODUTO.md).

> Os modelos 3D são otimizados de originais fornecidos para o projeto. O escritório é uma construção procedural provisória; não se deve confundir pontuações fictícias com medição real da saúde, diagnóstico ou conformidade legal. O progresso fica salvo neste navegador.

---

## Histórico de versões

A Alpha 1.3 integra a biblioteca 3D experimental ao endereço principal da Vercel e preserva a experiência 2D como alternativa para o estudo. Foram incluídos: [Biblioteca 3D experimental](./biblioteca3d.html), protótipos reais GLB (mentor e ambiente), interação nas três estações, gravação do progresso compartilhado com a Missão 01 e navegação ao quiz anterior.

Os modelos 3D aqui foram criados **localmente a partir de primitivas geométricas**, sem geração Meshy e sem custo em créditos. Têm qualidade de protótipo e não representam os assets 3D definitivos do PilhA+.

### Como usar

1. Abra `/missao01.html`, clique em `Entrar na biblioteca` e escolha `Explorar esta biblioteca em 3D`.
2. Use **WASD/setas** para andar, **E** ou clique nos ícones 01–03 para explorar. No celular use o direcional e os cartões.
3. Registre as três leituras (+20 cada) e escolha `Continuar na Missão 01` para fazer o quiz.
4. Se o dispositivo não suportar a cena, conclua a missão pela versão 2D.

### Regras preservadas

`pilha-missao01-v1`, 60 pontos por leitura, 30 pontos por respostas, 10 por conclusão; 70/100 e 2/3 acertos para liberar o Caso 01. O caso continua com meta 75/100. Progresso existente não é apagado.

### Arquivos

`biblioteca3d.html`, `biblioteca3d.js`, `biblioteca3d.css`, `assets/v13/*.glb`, `assets/v13/*.png`, `docs/SESSAO-22-BIBLIOTECA-3D.md`, `tests/library3d-logic.test.mjs`, `tests/test_glbs.py`.

### Pendente

Geração do modelo final via Meshy (CLI não disponível nesta execução), rigging e animações, biblioteca definitiva, conversão do galpão FBX e QA visual no navegador. Nenhuma alegação de liberação mobile/performance oficial nesta versão.

### Publicação e acesso

- Entrada principal: `https://pilha-plus-game-preview.vercel.app/`
- Missão 01: `/missao01.html`
- Biblioteca 3D: `/biblioteca3d.html`
- Fallback: em falha do carregamento de módulos 3D, as estações em texto continuam acessíveis, inclusive em dispositivos sem WebGL.


---

## Módulo de produto: Simulador de Propostas de Trabalho

O **Simulador de Propostas de Trabalho** pertence ao PilhA+ Game e será desenvolvido neste repositório como um módulo independente. O PilhA+ Game permanece separado do repositório principal do PilhA+ App.

A experiência prevista permitirá configurar uma proposta, ajustar remuneração, benefícios e condições de trabalho, comparar cenários e posicionar a oferta em faixas de referência **baixa, média e alta** quando houver benchmarks válidos. A especificação também prevê explorar indicadores de atratividade/aceitação, permanência, risco de adoecimento, acidentes, afastamentos, felicidade/bem-estar e motivação.

Esses impactos são hipóteses de simulação e **não devem ser apresentados como causalidade comprovada nem como previsão individual**. Fontes, metodologia, horizonte temporal, incerteza e validação precisam estar documentados antes de exibir estimativas numéricas. O módulo não deve classificar ou recomendar rejeição de candidatos com base em inferências psicológicas ou clínicas.

- **Especificação do módulo:** [simuladores/propostas-de-trabalho/README.md](simuladores/propostas-de-trabalho/README.md)
- **Status:** especificação/backlog; não declarar como funcionalidade pronta antes da implementação e dos testes.
- **Limite de integração:** não pertence ao `pilha-plus-app`; evolui dentro do repositório próprio do Game.
