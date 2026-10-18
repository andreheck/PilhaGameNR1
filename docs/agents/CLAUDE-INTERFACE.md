> PRIORIDADE CANÔNICA 18/10/2026: a branch `integration/pilha-current-vision` reconcilia os módulos mais recentes com a `main`. Novas especificações de cidade, deslocamento, currículos, salário e propostas negociáveis são prioridades de produto vigentes, embora ainda não estejam implementadas como jogos. Não seguir instruções de retomar os IDs 017–021 ou aba separada 'Visão geral'. Ver `docs/PRODUTO-CANONICO-2026-10-18.md`.

# Instruções de continuidade — Claude (Interface PilhA+)
Data-base 17/10/2026 | Função: UX/UI, microinterações e acessibilidade. Não executar merge/deploy.

## Leia antes de alterar
GitHub andreheck/PilhaGameNR1; AGENTS.md; docs/PLANO-DIRETOR-2026-10-17.md; docs/ALPHA-14.md; docs/EXPERIENCIA-INTEGRADA.md; docs/SESSAO-17-MENU-INICIAL-UX.md; docs/CONTINUIDADE-INVESTIMENTOS-MANUS-CODEX.md. Main em a33e0a65071e; PR 13 em conflito e AINDA não integrada. Peça ao PO/Manus o branch de integração estável; não altere a main nem assuma que a PR 13 foi aprovada.

## Objetivo de interface
Criar uma jornada de jogo onde o cenário 3D é a referência espacial, o painel contextual explica desafios e ações e o usuário entende claramente situação -> investigação -> decisão -> custo -> consequência -> acompanhamento. Priorizar 320–430 CSS px mobile, depois desktop >= 1440x900; fallback 2D acessível. Evitar aspecto de formulário e de dashboard corporativo descontextualizado.

## P0 — entregas na ordem
1. Auditar fluxo de entrada existente, rotas e navegação atual da main (Casos, Equipe, Biblioteca, Progresso), comparando com a PR 13 que propõe Investimentos e prólogo. Apresentar mapa de navegação único para decisão do PO, sem duplicar abas.
2. Integrar prólogo como leitura OPCIONAL na página de entrada, com cinco quadros temáticos text-first, abertura manual, avançar/voltar, fechar, acesso por teclado e versão mobile sem bloquear a cena. Usa marca e imagens aprovadas; não improvisar avatares.
3. Mobile-first: canvas visível, painel no fluxo vertical (sem ocultar a cena), navegação inferior utilizável e safe area; nenhum overflow horizontal; alvos clicáveis confortáveis, foco visível e suporte a motion reduced.
4. Refinar feedback contextual: ao selecionar setor/personagem, abrir diálogo e destacar setor sem deslocar a experiência; mostrar orçamento, custo, alteração dos indicadores fictícios e confirmação de ação.
5. Criar estados completos: carregando, indisponível 3D/2D, não iniciado, progresso, concluído, erro, compra bloqueada, sem saldo, dado salvo e retorno ao jogo.
6. Harmonizar retratos e modelos existentes: operadora, psicóloga, psiquiatra, gestor-mentor; colaborador personalizável em retrato até chegar GLB definitivo. Preservar mesmos padrões de escala e estilo.

## Identidade
Câmera isométrica 2.5D/3D; arquitetura modular legível. Marinho/grafite como base, off-white em superfícies, amarelo para CTA, laranja para atenção, verde sálvia para prevenção/efeitos positivos. Animações curtas e só quando tiverem propósito; respeito a preferências por movimento reduzido. Não gerar imagens para suprir ausência de arquivo 3D. Não usar cores como único canal de significado. Textos e labels em pt-BR.

## Limites de edição
Responsável prioritário por index.html, play.css e camada visual do play.js somente em colaboração explícita com Manus. Não alterar simulation/*, world3d.js, persistência, lógica econômica ou pontuação por conta própria. Se precisar de eventos do motor, especificar contrato para Manus e mock separado. Não introduzir framework por conveniência na Alpha atual; respeitar HTML/CSS/JS e Three.js existentes.

## Testes e evidência obrigatórios
Apresentar capturas reais (quando disponíveis) 390x844 e 1440x900; idealmente 320/375/430 px e paisagem. Testar Chrome Android e Safari iOS real ou marcar "não verificado". Percorrer entrada, missão, Caso 01, resultados, Investimentos e volta; mouse/touch/teclado, foco, scroll, modal, áudio, reduced-motion. Documentar problemas encontrados; nunca declarar QA visual de navegador que não executou.

## Entrega esperada
A. Checklist de inconsistências e opções de correção.
B. Fluxo de navegação validável e especificação dos componentes/estados.
C. Branch de interface com PR e antes/depois quando autorizado.
D. Lista de arquivos alterados, testes e pontos que exigem Manus/PO.
E. Não mesclar nem publicar produção sem autorização expressa.

## Pedido inicial sugerido
"Avalie a interface atual da main e a proposta PR 13, sem editar o motor. Entregue primeiro diagnóstico mobile/desktop, arquitetura de informação unificada e prioridades P0; depois proponha alterações em branch própria, preservando casos, progresso e cena 3D."
