# Abertura, sala do gerente, árvore e organização persistente

Entrega solicitada pelo PM em 09/11/2026, sobre `5eff11c`, na branch `codex/unified-social-agenda` / PR #69. Publicação apenas no preview autorizado, sem merge/main.

## Problemas e correções

**Abertura com móveis antigos.** A cena interativa usava o mesmo motor isométrico, mas a montagem da introdução não recebia o catálogo nem o adaptador de mobiliário. O renderizador de artes aprovadas também dependia de um inventário por setor inicializado. Agora a abertura recebe catálogo, apresentação e inventários demonstrativos vazios: reconhece as artes de base sem fingir melhorias compradas. Carrega somente as artes usadas nos três setores; cadeiras individuais, árvore e itens do pátio são carregados na partida. As 18 identidades visuais da abertura e o progresso do jogador permanecem preservados.

**Posições perdidas após uma compra.** O packing automático acontecia antes dos ajustes salvos. Se um item novo ocupava uma posição personalizada, a validação descartava visualmente todos os ajustes daquela sala. Agora posições/giros salvos são reservados primeiro e itens automáticos encontram espaço ao redor deles. Erro de um item não provoca retorno de toda a sala ao padrão. Posições válidas de móveis diferentes, inclusive um item girado, são verificadas após quatro compras e refresh. O save original não é apagado. Se faltar espaço, o item continua adquirido e o jogador recebe aviso para reorganizar; nenhum custo ou efeito é duplicado.

**Sala do gerente em área nova.** Extensão de 8 × 6 m fictícios ao norte do Escritório, conectada por uma porta de 1,2 m visual à circulação existente. Usa mesa com computador/cadeira, estante, sofá, mesa de apoio, mesa de reunião, quadro e planta já aprovados. Vidros translúcidos mantêm visibilidade, sem teto que cubra as ações. Colisões de paredes e abertura da porta entram no navegador de trajetos. O gerente ativo escolhido pelo jogador recebe o posto da sala; não é criado outro NPC. Sua agenda continua determinando caminhada, trabalho, pausas e reunião semanal no pátio. **Menu → Sala do gerente** enquadra o anexo.

Divisórias baixas de vidro organizam áreas do escritório e mantêm passagens. Os segmentos internos só são instalados quando livres de móveis: a prioridade é preservar a disposição do jogador. Paredes estruturais não aparecem como móveis arrastáveis. O mobiliário do anexo pode ser reorganizado; o cálculo de alvos acompanha as posições efetivas, inclusive se uma mesa for movida entre as áreas do mesmo setor.

## Relação com a PR #74

Consultada a PR #74, branch `feat/sala-gestor-administrativo`, SHA `ba945d85d78f2620a23b9bbf601eeab2b26a7000`, e seu plano. Foi adaptada a intenção de sala administrativa transparente, porta e reutilização de mobiliário. O código daquela frente é de `world3d.js`/Three.js e não foi importado sobre o renderer atual. O pedido atual do PM de uma **área nova** substitui a restrição anterior de usar somente uma porção do espaço existente. A PR paralela permanece preservada; TV BI e aquário não são declarados entregues nesta adaptação.

## Árvore fornecida

Mestre `Meshy_AI_tree_model_1109210605_image-to-3d-texture.glb`, SHA-256 `1c3c81af347c5fc58ded249895d05ba4c6341419ea8694e78dbbbc75440da513`, 352.000.924 bytes, 7.320.578 vértices / 7.667.726 triângulos. Original intacto e fora do deploy.

Preparação local por agrupamento espacial para gerar o atlas: 165.812 vértices / 385.840 triângulos e texturas de até 1024 px. São quatro vistas renderizadas no mesmo padrão de projeção do mobiliário. O público recebe somente o PNG e a proveniência; não o GLB original ou a malha intermediária. Sem API Meshy ou geração paga.

O item existente `arvore` passa a usar `arvore-sombra`, com miniatura no catálogo; mantém custo 700, três níveis, efeitos, carência e recibos anteriores. Não há nova cobrança de troca de arte. O modelo frutífero continua distinto. O volume de colisão representa o tronco/área de uso, 0,9 × 0,9 m; a copa é maior, altura visual 2,4 m. Não anuncia assento ou bônus instantâneo de cura. Múltiplas versões geométricas pequenas da antiga árvore deixam de competir com a nova arte; níveis continuam visíveis pelo marcador existente.

Reprodução: `python tools/prepare-tree-preview.py`, depois `python tools/render-tree.py`. Exige o mestre local, NumPy, Pillow, Playwright, Chrome e acesso ao CDN Three.js r180 durante a preparação. A CI valida a arte já versionada e não depende do mestre privado.

## Validação e aceite

- `npm test` local aprovado; regressões direcionadas de escala, layout, navegação, persistência, catálogo e proveniência.
- Baseline e catálogo máximo cabem; postos, incluindo o gerente, são alcançáveis com folga corporal. Trajeto para o anexo passa pela abertura da porta.
- QA de navegador isolado em 1366 × 768 e 390 × 844: abertura com artes atuais; gerente único do estado; edição real, compra pelo catálogo, débito único, layout e saúde/equipe/semana preservados, reload, compra da árvore e gerente sentado no computador pela agenda real. Sem exceções.
- Abertura em quatro resoluções, vídeo/fallback e elenco existentes; editor completo e regressões anteriores executados pelo CI.
- Evidências na execução CI do commit final: `office-layout-tree-qa`, `cinematic-intro-qa` e `furniture-editor-qa`. Confirmar SHA do preview na devolutiva.

## Limites e próximos passos

Dimensões e folgas são parâmetros fictícios de jogo, não projeto arquitetônico nem garantia normativa. A sala nova não oferece bônus de saúde, receita, consulta ou decisão gerencial automática. TV BI funcional, aquário e conversas individuais com o gerente ainda precisam de integração própria.

Uma organização anterior já descartada e sobrescrita não pode ser reconstruída a partir de posições ausentes; posições ainda presentes em `furnitureLayout` são respeitadas. Mudança incompatível de tamanho de uma arte pode exigir revisão do item específico. A fila visual para posicionar itens que não couberam ainda pode ser mais clara. Os próximos passos de jogabilidade estão em `docs/backlog/PROXIMOS-PASSOS-JOGABILIDADE-INICIAL-2026-11-09.md`.
