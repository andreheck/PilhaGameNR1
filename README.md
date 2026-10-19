## Atualização: acionista, dupla visível e ciclo de 30 dias

Referência atual: [motor temporal e hipóteses](docs/MOTOR-ESTATISTICO-TEMPORAL.md), [entrega e testes](docs/releases/ACIONISTA-CICLO-KIMI-2026-10-19.md) e [triagem da revisão Kimi](docs/reviews/TRIAGEM-KIMI-2026-10-19.md). A revisão original permanece arquivada sem alterações.

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


## Integracao das contribuicoes - 19/10/2026

- [Registro de integracao e QA](docs/releases/INTEGRACAO-COLABORADORES-2026-10-19.md): guarda de animacao do Manus e selecao experimental de dupla, sem bonus automaticos.
- [Herois da beta](docs/herois/README.md) e [Diretor](docs/herois/diretor.md): documentos preservados da PR #22.
- [Roadmap de produto](docs/ROADMAP-PRODUTO.md) e [propostas de trabalho](simuladores/propostas-de-trabalho/README.md): especificacoes preservadas da main, nao funcionalidades novas desta entrega.
