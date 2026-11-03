# Pacote de auditoria e implementação — Codex
**Data:** 02/11/2026  
**Escopo:** trabalho aprovado e decisões registradas nas últimas 48 horas para o PilhA+ Game / PilhaGameNR1.

## Objetivo
Auditar o estado real do repositório, reconciliar as entregas recentes e implementar somente o que estiver suficientemente especificado e aprovado. Não fazer uma reescrita geral nem substituir a experiência existente por protótipos isolados.

## Contexto e decisões do Product Owner

### 1. Elenco de seis heróis — criação encerrada
A criação e validação conceitual dos seis heróis foi concluída pelo PO. **Não reabrir a etapa de criação, não redesenhar identidades e não alterar atributos/poderes por preferência do agente.**
O trabalho agora é uma auditoria de correspondência entre as fichas aprovadas e o código:
- conferir identidade, raridade, atributos, poderes e especializações;
- verificar progressão até o nível 30;
- verificar sinergias, balanceamento e consistência entre heróis;
- apontar divergências entre documentação e implementação;
- implementar correções estritamente necessárias para refletir as fichas aprovadas.
H06: **Arquiteto de Talentos**, raridade **Épico**. Conferir a ficha oficial no diretório de heróis da branch de roster antes de alterar qualquer dado.
As fichas aprovadas estão documentadas na linha de desenvolvimento `docs/hero-roster-beta`; essa branch não deve ser presumida como base de produção nem mesclada cegamente.

### 2. Inventário de objetos antigos/desgastados
Decisão aprovada: preservar os GLBs originais e criar variantes visuais com estados de conservação distintos (usado, precário e sucateado), sem destruir ou substituir os assets originais.
Requisitos:
- preservar escala, pivôs, orientação, convenções de nomes e compatibilidade com o pipeline atual;
- priorizar computadores/monitores, notebooks, livros, mesas, cadeiras e estantes;
- os primeiros protótipos isolados previstos são computador e notebook;
- verificar se as variantes são de fato assets 3D integrados ao inventário, e não apenas uma página de demonstração;
- não declarar os assets 3D concluídos se só houver especificação, seletor ou protótipo.
A branch `art/aged-office-inventory` contém uma especificação e protótipo isolado (`aged-inventory.html/js`), mas isso não comprova integração ao jogo principal nem criação de variantes GLB finais.

### 3. Consolidação do jogo e publicação
A versão atualmente publicada foi apontada para `docs/hero-roster-beta` / commit `03d4b305...`, e o usuário observou que ela apresenta recursos antigos. HTTP 200 não é critério suficiente de validação.
Branches já identificadas na investigação:
- `main`: referência principal do repositório, mas não contém todo o desenvolvimento que está nas branches paralelas;
- `docs/hero-roster-beta`: contém fichas e documentação dos heróis, diverge de `main`;
- `integration/pilha-current-vision`: integra partes da visão atual, investimentos, navegação e fallback 2D;
- `integration/unificado-2026-10-26`: candidata abrangente de integração, porém ainda não validada e alguns commits atrás de `main`;
- `release/alpha15-opening-characters`: trabalho de abertura/personagens;
- `art/aged-office-inventory`: protótipo/especificação de itens desgastados.
Não escolher uma branch apenas pelo nome, quantidade de commits ou data. Comparar ancestrais, diffs, dependências e testes antes de propor a base canônica.

## Instruções de execução

### Fase A — inventário e mapa de divergências
1. Registrar SHA e data de cada branch relevante.
2. Comparar branches e identificar commits/arquivos exclusivos, duplicados, revertidos e divergentes.
3. Verificar PRs abertos/fechados e histórico de merges.
4. Produzir matriz por funcionalidade: documentada, implementada, integrada, testada, publicada.
5. Mapear dependências de assets, imports, rotas, scripts e armazenamento local.
6. Não presumir que documentação significa implementação funcional.

### Fase B — auditoria dos seis heróis
1. Localizar as seis fichas aprovadas e identificar o commit/branch que as contém.
2. Localizar a implementação efetiva no runtime.
3. Gerar tabela ficha × código para atributos, habilidades, raridade e progressão 1–30.
4. Validar limites, desbloqueios, custos, sinergias e balanceamento por testes automatizados.
5. Corrigir divergências de implementação sem alterar o conceito aprovado.
6. Não remover dados salvos nem quebrar compatibilidade de progresso.

### Fase C — inventário envelhecido
1. Inspecionar `aged-inventory.html/js`, especificação e assets existentes.
2. Identificar o catálogo real de mobiliário e o sistema de inventário utilizado pelo jogo.
3. Definir mapeamento entre item original e variantes de conservação.
4. Preservar GLBs originais e garantir que variantes não alterem dimensões/pivôs indevidamente.
5. Integrar primeiro computador e notebook somente se os assets e o pipeline permitirem.
6. Se os modelos finais não existirem, implementar estrutura de dados/integração sem simular que o trabalho artístico foi concluído; documentar os assets pendentes com precisão.

### Fase D — integração do produto
1. Avaliar as branches de integração e identificar a base que preserva o maior conjunto coerente de funcionalidades aprovadas.
2. Integrar em branch própria; nunca escrever diretamente em produção.
3. Preservar os Casos 01–05, navegação, fallback 2D, estado empresarial, investimentos e recursos existentes.
4. Manter o simulador de propostas de trabalho dentro deste repositório, em diretório/módulo próprio, sem misturá-lo ao fluxo central do jogo.
5. Não converter especificações futuras (mapa costeiro completo, currículos/contratação, economia ou eventos adversos) em alegações de funcionalidades prontas.

### Fase E — qualidade e release candidate
Executar:
- `npm test` e todos os scripts adicionais de QA definidos no `package.json`;
- build de produção;
- verificações de imports e referências a assets;
- testes de navegação e rotas;
- persistência e migração de estado local;
- regressão dos Casos 01–05, equipe, investimentos, biblioteca e progresso;
- viewport desktop e mobile, incluindo fallback sem WebGL;
- console/network errors e carregamento de GLBs.
Registrar cada teste com comando, resultado e evidência. Não marcar como aprovado um teste que não foi executado.

## Restrições obrigatórias
- Não fazer deploy de produção nem promover domínio principal sem autorização explícita do PO.
- Não mesclar branches divergentes automaticamente.
- Não descartar commits, arquivos ou assets existentes para “limpar” o projeto.
- Não alterar as fichas aprovadas dos heróis.
- Não substituir GLBs originais.
- Não apagar ou reinicializar progresso salvo.
- Não inventar assets, testes, resultados ou funcionalidades.
- Não apresentar status HTTP 200 como prova de qualidade.
- Fazer commits pequenos e rastreáveis; explicar cada alteração e seu motivo.
- Se houver conflito sem resolução segura, parar, documentar opções e pedir decisão ao PO.

## Entregáveis exigidos do Codex
1. `docs/qa/RELATORIO-AUDITORIA-CODEX-2026-11-02.md`: estado encontrado, branches/SHA, matriz de funcionalidades, riscos e divergências.
2. `docs/qa/MATRIZ-HEROIS-FICHA-VS-CODIGO-2026-11-02.md`: comparação completa dos seis heróis e progressão até nível 30.
3. `docs/qa/INVENTARIO-OBJETOS-DESGASTE-STATUS-2026-11-02.md`: catálogo, assets originais, variantes existentes e pendências reais.
4. Branch de integração proposta, com commits rastreáveis e sem deploy.
5. Relatório de testes executados, falhas e limitações.
6. README atualizado apenas para descrever funcionalidades verificadas e a versão correta.
7. Lista explícita do que ficou fora do escopo ou depende de asset/decisão do PO.

## Critério de conclusão
A tarefa só está concluída quando o relatório diferencia claramente **especificado**, **implementado**, **integrado**, **testado** e **publicado**; as fichas aprovadas correspondem ao runtime; os itens desgastados têm status real documentado; os testes executados têm resultados registrados; e existe uma branch candidata reproduzível. Produção permanece intocada até autorização do PO.
