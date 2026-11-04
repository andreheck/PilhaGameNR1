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


## 10. Mapa do estado, economia e persistência — auditoria v1.5+

**Módulos auditados:** `simulation/company-continuous.js`, `simulation/improvement-lifecycle.js`, `data/continuous/catalog.js`, `ui/continuous-game.js`, `tests/company-continuous.test.mjs` e `tests/improvement-lifecycle.test.mjs`. O mapa abaixo descreve o motor da empresa contínua; não deve ser confundido com o sistema legado importado por `play.js`.

### 10.1 Fonte de verdade e estrutura do estado

- Chave principal no navegador: `pilha-company-continuous-v2` (constante `KEY`).
- Estado inicial: versão 2, revisão 0, orçamento inicial de 10.000 créditos fictícios, semana 1, relógio ativo zerado, jogo não pausado, dupla de heróis vazia, recibos, efeitos de eventos, inflação, agenda de eventos, histórico e visitas.
- A validação central rejeita versões/formas inválidas, saldo negativo ou fora do limite, semana/revisão inválidas, equipes inválidas, recibos duplicados ou incoerentes, ciclos de vida inválidos, eventos e efeitos inconsistentes, excesso de histórico e visitas inválidas.
- A revisão (`revision`) funciona como controle otimista de concorrência: cotações carregam a revisão vigente; uma transação bem-sucedida incrementa a revisão.

### 10.2 Fluxo de cotação e compra

1. A interface solicita `quote(state, setor, item)`.
2. A cotação valida se o item pertence ao setor, calcula o próximo nível (máximo 3), aplica custo-base, multiplicador do nível, inflação e arredondamento para o passo de preço configurado.
3. A cotação calcula sinergia da dupla escolhida e registra os efeitos projetados, temporização e ciclo de vida. A sinergia vale apenas para categorias compatíveis e fica congelada no recibo daquela compra.
4. `purchase(state, quote)` recalcula a cotação e rejeita revisão, nível ou custo divergentes; também rejeita saldo insuficiente e compra enquanto uma decisão de evento está pendente.
5. A compra deduz o saldo, cria um recibo com setor, item, nível, custo, semana, bônus e ciclo de vida, e registra a operação no histórico.
6. A camada `transact(storage, action, expectedRevision)` relê o estado persistido, confere revisão, executa a ação, incrementa a revisão, valida novamente e grava o JSON. Quando disponível, usa `navigator.locks` para serializar operações entre abas.
7. A transação só retorna sucesso depois da gravação. Se o armazenamento negar escrita, retorna falha; o teste automatizado cobre esse cenário.

### 10.3 Efeitos no tempo

- O catálogo define seis fatores e quatro setores: três setores de trabalho e um setor de restauração.
- O índice do setor é a média dos seis fatores; o índice da empresa é a média dos três setores de trabalho.
- A compra não deve ser confundida com efeito instantâneo integral: maturação, atraso, progressão e duração são calculados ao consultar os valores na semana simulada.
- O ciclo de vida descreve efeitos permanentes ou temporários, frequência única ou mensal e progressão estável ou gradual. Contribuições mensais não criam recibos duplicados a cada período.
- Ao avançar semana, o motor atualiza semana, relógio ativo, inflação, visitas/restauração, histórico e agenda de eventos. Um evento pendente bloqueia avanço e novas compras até a decisão ser concluída.
- Recursos restaurativos podem habilitar espaços/capacidade e visitas; sua contribuição é limitada por teto configurado. Sem instalação elegível, não há visita nem benefício.

### 10.4 Migração e integridade dos saves

- Se a chave v2 existir, `read(storage)` valida e carrega esse estado; conteúdo corrompido não é silenciosamente substituído por um estado novo.
- Na ausência da chave v2, o motor reconhece `pilha-investment-v1` e `pilha-mapa-v1`, importa saldo e melhorias equivalentes/níveis e preserva os registros originais.
- A dupla pode ser recuperada de `pilha-hero-teams-v1` quando válida.
- A leitura de um save legado produz um estado migrado em memória; a persistência na chave v2 acontece na primeira transação bem-sucedida. A documentação e a interface devem deixar claro que ler/migrar não significa apagar o save de origem.
- O sistema de empresa contínua usa armazenamento local do navegador. Não foi identificada, nesta auditoria, persistência remota/conta sincronizada para esse estado.

### 10.5 Cobertura de testes encontrada

Os testes da empresa contínua cobrem, entre outros pontos:
- orçamento e métricas iniciais dos setores;
- catálogo de 12 intervenções estruturais e 12 restaurativas;
- custos e vetores de efeito dos itens estruturais nos três níveis;
- efeitos imediatos, tardios e progressivos;
- limites dos fatores e ausência de acúmulo por simples renderização;
- sinergia da dupla congelada no recibo;
- transação única, revisão obsoleta e falha de escrita;
- estado corrompido não descartado;
- migração preservando os bytes do registro legado;
- eventos, decisões pendentes, visitas e limites de restauração.

O teste de ciclo de vida verifica os 24 itens, progressão de segurança psicológica, expiração de atividade temporária sem nova cobrança e compatibilidade de recibos legados.

### 10.6 Pontos de atenção para a próxima etapa

1. A chave `pilha-company-continuous-v2` é a fonte de verdade do motor contínuo; não misturar com `pilha-investment-v1` nem com a chave do painel antigo.
2. A operação de compra precisa manter o padrão cotação → transação → atualização de interface. Não antecipar feedback de sucesso antes da confirmação de gravação.
3. A dupla e a sinergia devem ser explicadas como regra de jogo experimental, não como efeito científico validado.
4. Os índices de estresse, absenteísmo e produtividade são fórmulas simuladas. Não os apresentar como previsão real de adoecimento, indicador clínico ou medição de conformidade com a NR-1.
5. A restauração é um complemento. A comunicação do inventário deve priorizar eliminar/reduzir riscos na organização do trabalho e não deslocar para o trabalhador a responsabilidade de se recuperar de condições nocivas.
6. A auditoria foi estática por leitura dos módulos e testes existentes. A execução de testes e a inspeção do fluxo real no navegador continuam como etapa de validação antes de qualquer alteração de runtime.


## 11. Fechamento do ciclo documental e de arquitetura

**Status:** concluído para diagnóstico, documentação e definição do contrato técnico. A implementação visual dos cartões e a validação funcional ponta a ponta não fazem parte do que foi efetivamente entregue neste fechamento.

### Entregas concluídas
- Distinção documentada entre a entrada principal Ao Trabalho Alpha 1.5+ e o fluxo legado.
- Catálogo de 24 melhorias, ciclo de vida, ativos visuais e identidade existente inventariados.
- Fonte de verdade do motor contínuo, estrutura de estado, compra, cotação, transações, revisão, migração e persistência mapeadas.
- README atualizado para refletir a linha Alpha 1.5+.
- Critérios de aceite e sequência segura para a etapa de implementação registrados.

### Verificações de integração
- GitHub Actions no commit `efef5532a1608c2340a877c3a6895770132b36a3`: workflows **Validar jogo** e **Validar equipe viva e calendario** concluídas com sucesso.
- Check Vercel para o commit: sucesso; deployment de preview em estado `READY`.
- O deployment de preview contém a branch documental; como as alterações deste ciclo não modificaram o runtime, o estado READY confirma a publicação do preview, não uma validação visual/funcional das melhorias.
- Nenhuma publicação em produção foi solicitada ou realizada.

### Limites e pendências transferidas
- Executar percurso real no navegador: entrar, abrir setor, consultar melhoria, comprar, confirmar instalação, avançar semana e recarregar.
- Conferir múltiplas abas, saldo insuficiente, nível máximo, evento pendente, expiração e serviço recorrente na interface.
- Revisar visualmente cartões em mobile e desktop, contraste, foco por teclado e redução de movimento.
- Implementar os ajustes visuais somente após essa validação e rodar regressão completa.

**Decisão de encerramento:** considerar concluída a fase de diagnóstico e arquitetura do Ciclo 2. Não declarar concluída a modernização visual nem a validação funcional do inventário. Essas entregas permanecem explicitamente pendentes para a etapa de implementação, evitando que documentação e checks de integração sejam confundidos com teste de experiência real.
