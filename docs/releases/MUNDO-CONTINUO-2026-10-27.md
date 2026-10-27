# Mundo contínuo — entrega 1, 27/10/2026

Base: codex/hud-v2-controles, f8d02bd6ce8fc7d4da5eabaad473c1eb6e22e70e (PR #52 aberta, sem merge). Branch desta entrega: codex/mundo-continuo. Referência: PROMPT-CODEX-LAYOUT-MUNDO-2026-10-26.md enviado pelo PM.

## Entrega e critérios

Um piso de 26 × 18 células com quatro zonas de 12 × 8: escritorio (0,0), producao (14,0), atendimento (0,10), restauracao (14,10). Os mesmos IDs e coordenadas são usados no desktop e celular; o redimensionamento altera somente a câmera. Corredores centrais e oito portais têm duas células. As conexões existentes foram reaproveitadas, não descartadas. Foco termina em até 400 ms e é imediato com movimento reduzido. Zoom mínimo enquadra o conjunto; pan e pinça continuam disponíveis.

simulation/world-graph.js contém nós de portas, corredores, âncoras de postos e cinco espaços restaurativos. Rotas determinísticas conectam os 16 NPCs aos espaços de pausa pelas portas. Atribuição diária de postos, filas e agenda dos heróis pertencem às próximas entregas; não foram acrescentadas aqui.

Menu → Zonas e melhorias oferece leitura textual dos quatro índices, fatores, níveis e próximos custos, com tabelas semânticas e botões para focar cada setor. A leitura é um snapshot atualizável, não altera o progresso. Há também acesso por teclado junto ao canvas.

## Código fonte e compatibilidade

Migrados do pós-build para a fonte: paleta/variantes de Restauração, ausência de figurantes padrão nesse espaço, localização de funcionários sem painel cobrindo o alvo, CSS mobile existente, getWorldFrame e preservação da câmera no resize. Nenhum novo patch de dist foi criado para o mundo.

Persistem os adaptadores C3 e de rotinas ligados ao estado privado do renderer legado. Em build-living-layout, cada âncora agora precisa ocorrer exatamente uma vez, ou o build falha. Build, testes de circulação/rotas e validação do renderer compilado no navegador verificam essa compatibilidade. A extração total do motor legado permanece dívida técnica explícita.

## Dados e decisões preservadas

Nenhuma chave localStorage adicionada; nenhuma migração. pilha-company-continuous-v2 e preferências existentes são preservados. Posições do mundo são apresentacionais, não gravadas no save. Fixture fin verifica orçamento, níveis, equipe, gestão, finanças e evento; a leitura não reescreve o original.

O anexo repete o relógio antigo de sete dias/hora. Preservada a decisão posterior expressa do PM pelo C3: semana de 120000 ms ativos. Não foram alterados aportes, saúde, pausas, XP, melhorias, progressão ou orçamento. As seis fichas canônicas já existem; poderes individuais não executados continuam identificados como pendentes. Números propostos pelo PO para velocidade, rotina e negociação não foram aplicados nesta entrega geométrica.

## Validação

Build concluído; 221 testes automatizados aprovados, incluindo cinco novos testes do grafo, portas, câmera, movimento reduzido e save antigo. CI de interface verifica 1440×900, 390×844 e 320×640, pan, pinça, zoom, foco, resize/orientação, circulação e recarga do save. Resultados visuais e links de execução serão registrados na PR após a execução remota. Não equivalem a teste em aparelho físico nem medição de 45 fps.

## Próximas entregas separadas

2. Escala e âncoras de mobiliário/personagens.
3. Velocidade visual e aceleração, sem mudar calendário.
4. Rotina, postos e tráfego.
5. Presença da dupla no mundo.
6. Galeria compacta e retratos.
7. Retorno direto com dupla válida.
8. Resumo de retorno, com critérios aprovados.
9. Histórico transacional e idempotente.
10. Negociação, após parâmetros do PO e aprovação do PM.

HUD v2 permanece experimental em ?hud=v2. Folha setorial em três posições e normalização dos diálogos continuam pendências anteriores. Esta entrega não autoriza merge, promoção ou mudança do alias público de testes. Somente PR e preview automático para revisão.
