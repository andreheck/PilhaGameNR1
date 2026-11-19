# Revisão do endereço de testes — 25/10/2026

## Solicitação e base
André relatou créditos ausentes em `https://pilha-plus-game-preview.vercel.app/`, solicitou barras/menus transparentes, mobiliário aprovado substituindo a base procedural, explicação de XP e NPCs abaixo de55 mais lentos. O endereço resolvia para `dpl_DriAi9ezjo2yK18ukaZWVjK8EWM6`, commit40b2944748455ee8f96ff8497e5fb2e9b1e774b1, branchfeat/npc-absence-resignation-release. Esse build era anterior ao aporte semanal; as entregas recentes estavam somente nos previews separados. A atualização solicitada é deste projeto de testes, sem merge de GitHub ou publicação em outro projeto.

## Alterações
- Entregar no endereço solicitado a base integrada e validada da PR41. Aporte500+250 por épico da dupla independente do faturamento, pessoal ativo ou saúde. Legado não recebe retroativo fictício: inicializa o controle na semana salva e paga na próxima semana. Save de regressão na semana658, caixa0, dupla Psicóloga/P&D Tech e todos desligados recebe750 na semana659, uma única vez. HUD distingue aporte de faturamento/despesas.
- Superfícies de cabeçalho, navegação, indicadores, menus e painéis recebem transparência com desfoque e textos contrastantes. Canvas continua abaixo de toda a barra; não colocar o mapa sob controles para simular transparência.
- Mesas completas, mesas de reunião, poltronas, sofás, mesas de centro, plantas, gaveteiros, quadros e caixas da base usam exclusivamente as artes aprovadas. Troca estética sem conceder compras ou benefícios. Melhorias continuam com níveis, custo, Poof e efeitos próprios. Máquinas/esteiras/estantes industriais sem arte equivalente preservam fallback procedural.
- Saúde de base abaixo55: caminhada a60% (40% mais lenta), tanto ida/volta quanto circulação no setor.55exato mantém velocidade normal. Relógio da empresa não muda. Rodízio a cada dois dias permanece: trânsito mais longo e menor percurso de trabalho, com retorno contínuo ao ponto de saída. No máximo seis em deslocamento/pausa. Personalidade não determina velocidade/saúde. Ficha explica o ritmo reduzido.
- Ajuda expansível na galeria explica as recompensas canônicas históricas:25XP por situação e150por caso, uma vez por recompensa válida, formação separada. Ver histórico mostra origens registradas. Nesta versão contínua, semanas/móveis/pausas ainda não geram XP; nenhuma regra nova foi inventada. A integração de XP por objetivos da empresa segue pendente de definição do PM.

## Validação / evidências
Regressões de save658, idempotência, limiar54.99/55, duração de deslocamento, limite6, renderizador, base/arte aprovada e programas expirados. Todas as suítes existentes e QA de navegador em cinco resoluções são executados antes da atualização do endereço. Resultado, commit e URLs finais registrados na PR41; verificar conclusão real do CI.

## Pendências
Lista de assets a criar: `docs/backlog/MOBILIARIO-BASE-ASSETS.md`. Prioridade: máquina, esteira, estante industrial, bancada de operação e estação de atendimento/headset. Depois recepção, cadeira de trabalho avulsa, armário EPI e palete/carrinho. Evitar duplicar móveis já aprovados. Persistem homologação física/Safari, leitor de tela, contraste formal, zoom200% e sessão humana longa. Rigs/sprites individuais permanecem em entrega própria.
