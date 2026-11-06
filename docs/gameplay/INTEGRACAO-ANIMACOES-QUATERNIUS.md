# Quaternius Universal Animation Library — análise e plano de integração

**Projeto:** Ao Trabalho (base v1.5+)  
**Branch de referência:** `feat/ao-trabalho-hero-control-foundation`  
**Personagem piloto:** Acionista Heck (FBX rigado fornecido pelo projeto)  
**Status:** pesquisa documentada; análise dos arquivos e integração ainda não executadas.

## Objetivo para o Codex

Investigar as bibliotecas de animação humanoide da Quaternius e determinar, com evidências do repositório e dos arquivos reais, se e como podemos reutilizá-las no personagem 3D Acionista Heck e, posteriormente, nos demais heróis/NPCs.

A tarefa deve começar por auditoria e prova de compatibilidade. Não implementar uma segunda engine de personagens, não substituir a circulação de NPCs existente e não declarar integração concluída sem teste executado no jogo.

## Fontes oficiais

- Universal Animation Library: https://quaternius.itch.io/universal-animation-library
- Universal Animation Library 2: https://quaternius.itch.io/universal-animation-library-2
- Página de catálogo/formats: https://quaternius.com/packs/universalanimationlibrary.html
- Visualizador: https://quaternius.com/animviewer.html
- Atualização sobre Root Motion (16/06/2026): https://quaternius.itch.io/universal-animation-library/devlog/1555893/added-root-motion-and-other-fixes
- Atualização da UAL2 sobre Root Motion: https://quaternius.itch.io/universal-animation-library-2/devlog/1555892/added-root-motion-and-other-fixes

## O que as páginas oficiais informam

### Universal Animation Library (UAL1)

- Pacote descrito pelo autor como contendo 120+ animações em um rig humanoide universal, preparado para retargeting.
- A página lista locomoção em oito direções, caminhada, corrida/jog, sprint, empurrar, rastejar, nadar, sentar, combate e emotes, entre outras categorias.
- O autor declara compatibilidade/exports para Unity, Unreal e Godot, e compatibilidade com rigs comuns como Mixamo.
- A página declara licença CC0 e uso pessoal, educacional e comercial.
- Downloads listados no itch.io: Standard (gratuito/name-your-price), Pro e Source. A página consultada lista Standard ZIP de 15 MB, Pro ZIP de 41 MB e Source ZIP de 46 MB; Pro e Source têm condições de pagamento indicadas na própria página.

### Universal Animation Library 2 (UAL2)

- Pacote complementar descrito como contendo 130+ animações, com parkour, combos, agricultura, pesca, locomoção zumbi e outras ações.
- Também é descrito como rig humanoide universal, pronto para retargeting, com compatibilidade indicada para Unity, Unreal e Godot e rigs comuns como Mixamo.
- A página declara licença CC0 e uso pessoal, educacional e comercial.
- Downloads listados: Standard (gratuito/name-your-price), ZIP de 17 MB, e Source ZIP de 50 MB, sujeito às condições indicadas no itch.io.

**Atenção:** não assumir que todos os 120+/130+ clips estão incluídos nos ZIPs Standard. A contagem, os nomes e a disponibilidade efetiva de cada clip devem ser extraídos dos arquivos baixados. A página e os tiers podem mudar; confirmar a licença, o conteúdo e os termos no momento da aquisição.

## Root Motion: decisão técnica obrigatória

A atualização oficial de 16/06/2026 informa que os pacotes passaram a oferecer duas variantes exportadas:
- arquivos terminados em `_RM`: Root Motion incorporado/baked nas animações;
- arquivos sem `_RM`: Root Motion desabilitado.

A mesma atualização menciona correções de sincronização das animações direcionais e de escala. Não misturar variantes inadvertidamente.

**Hipótese inicial para o Ao Trabalho:** preferir animações sem Root Motion, deixando o deslocamento do personagem sob controle do sistema de navegação do jogo. O motor do jogo deve determinar posição, velocidade, colisão e caminho; a animação deve representar visualmente o movimento. Só escolher Root Motion se a auditoria do motor provar que essa abordagem é necessária e não cria dupla aplicação de deslocamento.

## Contexto técnico conhecido do Ao Trabalho

- A linha de desenvolvimento usa a base v1.5+ e o motor isométrico existente em `ui/claude/pilha-iso.js`, com sincronização/orquestração em `ui/claude/pilha-mapa.js`.
- A circulação contínua de NPCs, rotas, pausas, espaçamento, orientação e animação por sprites já existe. Preservar esse comportamento.
- A renderização principal do mapa é Canvas 2D. Um FBX/GLB não pode ser tratado como se fosse um sprite 2D pronto.
- Há referências históricas no repositório a experiências 3D com Three.js, GLTFLoader e AnimationMixer. Verificar o estado real e a disponibilidade dessas integrações na branch atual antes de propor qualquer novo runtime.
- O Acionista Heck foi fornecido como FBX rigado, acompanhado de mapas de textura de cor, roughness e metallic. A existência do rig/curvas no arquivo foi observada preliminarmente, mas a compatibilidade completa e a execução das animações ainda não foram comprovadas.
- Existe uma fundação lógica de controle alternável de dupla de heróis e um planejador A* em grade ortogonal, mas isso não significa que o personagem já se mova no mapa. Não presumir integração entre o A* e o motor isométrico.
- A PR #65 é draft. Não fazer merge nem deploy de produção sem autorização explícita.

## Escopo da investigação do Codex

### 1. Auditoria do repositório antes de alterar código

1. Confirmar branch, HEAD, estado da PR e baseline v1.5+.
2. Ler os módulos atuais de renderização, circulação, sprites, câmera, picking, colisão e carregamento de assets.
3. Localizar implementações ou dependências existentes de Three.js, GLTFLoader, FBXLoader, AnimationMixer, loaders GLB/FBX e renderização 3D.
4. Verificar se existe uma camada 3D utilizável, se está ativa ou é apenas legado/experimento, e quais são seus pontos de entrada.
5. Verificar assets já existentes, seus formatos, rigs, escalas, licenças, tamanhos e regras de versionamento.
6. Não duplicar dependências, cenas, loops de renderização, câmeras ou sistemas de movimento.

### 2. Obter e inventariar as bibliotecas

Se os arquivos ainda não estiverem disponíveis no repositório ou ambiente de trabalho, obter os pacotes Standard pelas páginas oficiais, respeitando os fluxos e termos do itch.io. Não automatizar pagamentos nem contornar autenticação.

- UAL1: https://quaternius.itch.io/universal-animation-library
- UAL2: https://quaternius.itch.io/universal-animation-library-2

Após obter os arquivos:

1. Registrar nome exato, versão/data, tamanho e hash SHA-256 de cada ZIP.
2. Ler os READMEs e arquivos de licença incluídos.
3. Inventariar recursivamente arquivos e formatos, distinguindo Standard, Pro e Source.
4. Extrair os nomes reais dos clips e metadados (duração, taxa de quadros, loop, tracks e rig), usando ferramentas disponíveis no projeto.
5. Identificar claramente quais animações estão disponíveis em cada pacote efetivamente obtido.
6. Não commitar ZIPs ou grandes arquivos binários automaticamente. Avaliar o padrão de assets do repositório, tamanho final, necessidade de distribuição e política de versionamento. Se os binários não forem adicionados, documentar o procedimento reproduzível para colocá-los localmente.
7. Preservar os arquivos de licença e a proveniência. Mesmo com CC0, manter registro interno de origem, URL, versão e data.

### 3. Comparar os rigs — Acionista Heck x Quaternius

Executar análise técnica do FBX do Acionista Heck e dos modelos/rigs fornecidos pela Quaternius:

- hierarquia e nomes dos ossos;
- bone count e correspondência de segmentos;
- pose de repouso (T-pose/A-pose);
- orientação dos eixos e convenção de frente;
- escala/unidades e altura relativa;
- transformações do root/hips/pelvis;
- pesos de skinning e deformação em ombros, cotovelos, quadris e joelhos;
- tracks de animação e possíveis ossos ausentes;
- compatibilidade com retargeting direto ou necessidade de perfil/mapeamento intermediário.

Não concluir que a compatibilidade com Mixamo garante compatibilidade automática com o FBX do Acionista Heck. Produzir uma tabela de mapeamento de ossos e apontar incompatibilidades.

### 4. Prova de conceito de retargeting

Fazer primeiro um teste mínimo, fora do fluxo principal do jogo se necessário, com três animações:

1. `Idle` / repouso;
2. `Walk` / caminhada;
3. `Walk Formal` / caminhada formal.

Selecionar os nomes reais dos clips no inventário, sem supor que a grafia acima seja idêntica à dos arquivos.

A prova de conceito deve:
- carregar o Acionista Heck e as animações Quaternius;
- retargetar as três animações para o rig do personagem;
- reproduzir cada animação e alternar entre elas;
- avaliar pés deslizando, torções, deformações, escala, orientação, clipping e transições;
- comprovar se o personagem permanece no lugar com os clips sem Root Motion;
- registrar screenshot ou vídeo curto, se o ambiente permitir;
- não modificar a versão publicada nem o motor de produção para conseguir apenas uma demonstração isolada.

Se o retargeting direto falhar, investigar mapeamento/retargeting intermediário e conversão FBX/GLB. Não alterar o modelo original de forma destrutiva; preservar uma cópia de origem.

### 5. Escolher o caminho de integração

Só após a prova de conceito, recomendar uma das opções, justificando custo e risco:

- **A.** Reutilizar camada Three.js/GLTFLoader/AnimationMixer já existente, caso esteja funcional e integrável;
- **B.** Criar adaptador mínimo entre o Canvas isométrico e um personagem 3D, sem criar uma segunda engine de mapa;
- **C.** Converter/retargetar o personagem e as animações para sprites ou atlas 2D, se isso for mais coerente com a arquitetura atual;
- **D.** Adiar integração 3D se o custo/risco for alto, mantendo o resultado da análise e os assets preparados.

A recomendação deve considerar performance em dispositivos móveis, tamanho dos arquivos, carregamento, memória, acessibilidade/reduced motion e consistência visual com o mapa isométrico.

### 6. Integração futura: contrato esperado

Se a prova de conceito for aprovada e houver caminho seguro, a integração deve respeitar:

- O motor isométrico atual continua responsável por posição no mapa, navegação, colisão, câmera e interação com setores.
- A animação 3D é uma camada visual do ator, não um novo sistema de navegação.
- Movimento e animação não podem deslocar o personagem duas vezes. Preferência inicial: clips sem Root Motion.
- Estados mínimos: `idle`, `walk`, `jog/run`, `talk`, `interact`, com fallback seguro quando um clip estiver ausente.
- Direção do personagem deve acompanhar o vetor de deslocamento e a câmera/isometria, sem saltos de orientação.
- A alternância entre herói controlado e parceiro não deve recriar atores ou interromper NPCs.
- A ausência ou falha de um asset 3D deve degradar graciosamente para a representação visual já existente.
- Não alterar economia, calendário, saves, indicadores psicossociais ou lógica dos NPCs como efeito colateral.
- Não fazer o parceiro autônomo executar compras ou decisões irreversíveis sem confirmação.

## Conjunto de clips prioritário a procurar

Os nomes abaixo são categorias de busca, não garantias de que o clip exista no pacote Standard. O Codex deve associar cada necessidade ao nome real encontrado no inventário.

| Prioridade | Movimento | Uso no Ao Trabalho |
|---|---|---|
| P0 | Idle loop | Herói aguardando/parado |
| P0 | Walk loop | Navegação normal |
| P0 | Walk formal | Identidade do Acionista Heck |
| P1 | Jog / Sprint | Deslocamento acelerado, se necessário |
| P1 | Idle talking / Talking | Conversa com funcionários |
| P1 | Sitting / Sitting talking | Reuniões |
| P1 | Interact | Interação contextual |
| P2 | Pick up / Carry walk | Transporte de objetos |
| P2 | Fixing / Kneeling | Manutenção e tarefas operacionais |
| P2 | Yes / No / Fold arms | Expressividade e personalidade |

A UAL2 deve ser avaliada como complemento, não como substituta automática da UAL1. Priorizar gestos e ações que façam sentido em um simulador de empresa; não incorporar combate, armas, zumbis ou parkour apenas porque existem no pacote.

## Critérios de aceite da análise

A tarefa de análise só pode ser considerada concluída quando houver:

- [ ] Inventário reproduzível dos arquivos realmente obtidos, com versão, hash e licença.
- [ ] Lista de clips presentes nos pacotes Standard utilizados.
- [ ] Relatório de compatibilidade entre os rigs Quaternius e Acionista Heck.
- [ ] Mapeamento de ossos ou explicação técnica da incompatibilidade.
- [ ] Prova visual/execução de Idle, Walk e Walk Formal no Acionista Heck, ou registro claro do bloqueio e evidências.
- [ ] Decisão justificada sobre Root Motion.
- [ ] Recomendação de arquitetura compatível com o motor atual.
- [ ] Plano de integração incremental, sem duplicar mapa ou circulação de NPCs.
- [ ] Testes executados e limitações registradas.

**Não marcar como concluído** se houver apenas documentação, inspeção estática ou testes unitários sem reprodução real das animações.

## Entregáveis esperados

1. Este documento atualizado com as conclusões.
2. Inventário técnico dos pacotes e clips (por exemplo, `docs/assets/QUATERNIUS-ANIMATION-INVENTORY.md`).
3. Relatório da prova de conceito, com screenshots/artefatos quando disponíveis.
4. Se houver integração, código isolado, testes e documentação do adaptador.
5. Resumo no PR com o que foi analisado, o que foi testado em execução e o que continua pendente.

## Regras de execução

- Trabalhar na branch da PR #65, salvo se a auditoria justificar uma branch isolada.
- Fazer primeiro a análise; não iniciar refatoração ampla.
- Commits pequenos e com escopo claro.
- Rodar os testes relevantes e registrar resultados reais.
- Não fazer merge, release ou deploy de produção sem autorização explícita.
- Ao final, reportar separadamente: **documentado**, **inventariado**, **testado em unidade**, **testado visualmente**, **integrado no jogo**.
