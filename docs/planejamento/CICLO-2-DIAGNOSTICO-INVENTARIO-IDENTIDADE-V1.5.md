# Ciclo 2 — Diagnóstico de identidade visual, inventário e melhorias

**Base auditada:** `feat/comparador-impacto-intervencao`  
**Commit-base:** `d504d36c5f4215c2ac1e445be9a6a75637360813`  
**Versão identificada na entrada principal:** Alpha 1.5  
**Status:** diagnóstico documental; nenhuma alteração de runtime ou publicação.

## 1. Escopo e método

Levantamento estático da árvore do repositório e leitura dos módulos de catálogo, ciclo de vida, renderização da empresa contínua, identidade visual, ativos de mobiliário e testes relacionados. Este documento não afirma inspeção visual manual em navegador nem execução local dos testes.

## 2. Arquitetura identificada — atenção a duas experiências

A entrada principal `index.html` carrega `play.js`, `play.css` e a interface de mapa/setores. Ela identifica a Alpha 1.5 e apresenta a experiência principal do jogo.

Há também uma arquitetura anterior de painel/hub em arquivos como `app.js`, `app.css` e `simulation/investment.js`, com fluxo próprio de investimentos. Ela contém testes e elementos de catálogo, mas não deve ser confundida automaticamente com a interface principal atual. O Ciclo 2 deve priorizar o caminho efetivamente carregado pela entrada principal e só reutilizar código da arquitetura anterior após verificar compatibilidade e estado compartilhado.

## 3. Inventário e melhorias já existentes

### 3.1 Empresa contínua

- `data/continuous/catalog.js` define 6 fatores, 4 setores (Escritório, Produção, Atendimento e Restauração) e 24 melhorias.
- As 24 melhorias se dividem em 12 intervenções estruturais/preventivas e 12 recursos restaurativos.
- O catálogo inclui custos, fatores afetados, temporização, espaço/capacidade e descrições.
- `ui/continuous-game.js` renderiza categorias, cartões de melhoria, níveis (até 3 por setor), efeitos estimados, custos, disponibilidade e ação de compra.
- O estado de compra é controlado por cotação/transação; há proteções para saldo insuficiente, nível máximo, cotação desatualizada, estado alterado em outra aba e evento pendente.
- O ciclo de vida em `simulation/improvement-lifecycle.js` representa início imediato/tardio, duração temporária/permanente, frequência e progressão. Atividades temporárias podem expirar; serviços mensais não empilham cópias do mesmo efeito.
- `tests/improvement-lifecycle.test.mjs` cobre as 24 melhorias e regras de duração; `tests/investment-system.test.mjs` cobre outro fluxo de investimento e não deve ser tomado como prova isolada da interface principal.

### 3.2 Representação visual

- `data/continuous/furniture-visuals.json` e `.js` mantêm manifesto de ativos, âncoras, larguras de referência e efeito Poof.
- Há 20 sprites WebP aprovados, além de cinco assets gerados para teste (máquina, esteira, estante industrial, bancada operacional e estação de atendimento).
- `ui/furniture-effects.js` e `.css` cuidam do feedback visual de instalação.
- `docs/backlog/MOBILIARIO-BASE-ASSETS.md` registra cobertura visual e ativos futuros.
- O backlog diferencia explicitamente mobiliário visual de melhorias adquiridas: a substituição dos móveis-base não representa compra gratuita, não altera save e não concede efeitos.

## 4. Identidade visual existente

- `design/tokens.json` declara navy `#14273D`, laranja `#F58A2B`, off-white `#F7F4EF`, sage `#7B9F85` e alerta `#D85B48`, com cartões de raio 16 e botões 12.
- A interface Alpha 1.5 usa linguagem própria em `play.css` e módulos `ui/*`; portanto, os tokens ainda precisam ser comparados com o CSS real para verificar aderência.
- O repositório contém ativos e experiências experimentais (biblioteca 3D, laboratório 3D e protótipos). Não incorporar esses elementos ao fluxo principal sem decisão explícita de produto.

## 5. Lacunas e riscos observados

1. **Documentação de versão desatualizada:** o README ainda descreve a Alpha 1.4 como publicada e a branch como candidata, enquanto `index.html` identifica Alpha 1.5. Corrigir essa divergência é prioridade documental.
2. **Possível duplicidade conceitual de investimento:** existem o fluxo legado `simulation/investment.js` e o motor da empresa contínua (`data/continuous/catalog.js`, `ui/continuous-game.js` e módulos associados). Não unificar nem duplicar catálogos sem rastrear estado, persistência e rotas de entrada.
3. **Inventário não é uma mochila genérica:** o sistema atual funciona como catálogo de melhorias por setor, com compras e níveis. A evolução deve preservar essa semântica e tornar mais clara a relação entre problema, intervenção, custo, efeito, prazo e manutenção.
4. **Economia e eficácia precisam de comunicação responsável:** índices são fictícios e educativos. Melhorias restaurativas (yoga, livros, pausas, plano de saúde etc.) não podem ser apresentadas como substitutas de prevenção organizacional, correção de sobrecarga ou combate ao assédio.
5. **Arte em teste:** cinco assets industriais constam como gerados para teste. Não promovê-los a arte final sem avaliação visual e validação de escala, transparência, perspectiva e leitura.
6. **Identidade distribuída:** tokens, CSS da entrada principal, estilos da empresa contínua e páginas experimentais coexistem. É necessário definir qual sistema visual é canônico para o gameplay atual.

## 6. Direção proposta para o Ciclo 2

### Etapa A — Contrato funcional do inventário
- Mapear o caminho do jogador: setor → fator → melhoria → orçamento → compra → instalação → efeito temporal → acompanhamento.
- Definir campos obrigatórios do cartão: nome, problema-alvo, tipo de intervenção, custo, nível atual/próximo, efeitos simulados, início, duração, recorrência e ressalvas.
- Separar visualmente intervenções preventivas/estruturais de recursos restaurativos, sem sugerir equivalência de eficácia.

### Etapa B — Economia e progressão
- Auditar fórmulas, cotações, sinergias, níveis, recibos, orçamento e persistência.
- Explicitar custo único versus serviço recorrente e expiração.
- Verificar se a progressão recompensa decisões sustentáveis, não apenas acumulação de itens.
- Preservar saves existentes e compatibilidade com recibos legados.

### Etapa C — Sistema visual
- Comparar tokens com os estilos realmente carregados na Alpha 1.5.
- Definir componentes e estados comuns: cartão, botão, indicador, selo de categoria, custo, nível, bloqueio, confirmação e feedback.
- Revisar contraste, tipografia, densidade, foco, movimento reduzido e layouts mobile/desktop.
- Avaliar assets existentes antes de solicitar novas imagens.

### Etapa D — Integração e QA
- Testar compra, atualização visual, recarga, múltiplas abas, falta de saldo, nível máximo, evento pendente, expiração e serviço mensal.
- Validar que móveis-base não são interpretados como melhorias compradas.
- Executar testes de regressão e revisão visual nas cinco resoluções já usadas no QA.

## 7. Critérios de aceite do Ciclo 2

- Uma única fonte canônica documentada para catálogo e estado de melhorias da empresa contínua.
- Nenhuma duplicação entre o fluxo legado e o fluxo principal.
- Cada cartão comunica claramente problema, custo, efeito, prazo e limites.
- Separação compreensível entre prevenção organizacional e restauração/bem-estar.
- Compra e instalação persistem corretamente, com feedback visual coerente.
- Identidade visual consistente com a Alpha 1.5 e acessível em mobile/desktop.
- Testes automatizados e revisão visual aprovados antes da publicação.

## 8. Fora do escopo desta etapa

- Redesenho completo do mapa 3D.
- Troca indiscriminada dos 20 sprites aprovados.
- Tornar definitivos os cinco assets gerados para teste.
- Unificação técnica do painel legado com a empresa contínua sem análise de migração.
- Publicação em produção antes da validação e revisão.

## 9. Próxima ação técnica

A próxima implementação deve começar pelo rastreamento do estado e da persistência do catálogo da empresa contínua (módulos de estado, economia e renderização), seguido da correção do README para refletir a versão real. Só então alterar componentes visuais dos cartões de melhoria. Não alterar o motor de compra antes de fechar o mapa de estado e os testes de regressão.
