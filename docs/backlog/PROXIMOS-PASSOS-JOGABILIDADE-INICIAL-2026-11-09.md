# Pendências e próximas entregas — experiência inicial

Base: branch `codex/unified-social-agenda`, após a entrega de abertura/mobiliário/sala do gerente/árvore. Propostas de escopo para o PM/PO; não significam mecânicas já implementadas nem autorização para alterar balanceamento.

## Atualização em 11/11/2026

Os dois primeiros itens P1 estão implementados na branch em revisão: guia opcional dos primeiros passos após contratação inicial e explicação de heróis-consultores, seis contratações incluídas e semana simulada de 15 minutos. Evidências e limites: `docs/releases/PRIMEIROS-PASSOS-2026-11-11.md`. A CI completa da PR #69 passou no commit `91eace3`; falta o aceite do PM para merge/publicação. Os demais itens abaixo continuam como backlog.

## Já atendido nesta entrega

- Abertura usa as artes atuais dos três setores e carrega apenas os assets necessários.
- Sala do gerente em extensão ligada ao Escritório, com posto do gerente real, vidro, acesso e mobiliário reutilizado.
- Divisórias internas com prioridade para circulação e posições existentes.
- Árvore recebida no item já existente, com quatro vistas, miniatura e custo/efeitos preservados.
- Compras passam a respeitar posições e giros salvos antes de distribuir itens novos.

## Prioridade recomendada

| Prioridade | Entrega proposta | Critério para o jogador |
|---|---|---|
| P1 | Primeiro objetivo guiado, opcional, de 60–90 segundos após contratar a equipe | Saber qual setor observar, escolher uma melhoria, entender custo e quando ela fará efeito; conseguir pular e retomar ajuda |
| P1 | Clareza da primeira contratação e do tempo | Distinguir heróis consultores, três gerentes e três funcionários; perceber que a semana dura 15 minutos e que eventos/compras não são a mesma coisa |
| P1 | Comparação antes/depois de uma escolha | Ver o que mudou imediatamente, o que está amadurecendo e o que é apenas arte; sem prometer cura ou benefício automático por decoração |
| P1 | Poses e interações riggadas nos postos | Sentar/levantar/digitar/carga sincronizados ao próprio esqueleto e aos alvos, sem trocar identidades ou deformar Mariana; testar rotas com layout personalizado |
| P2 | Fila visual de itens aguardando espaço e desfazer organização | Localizar um objeto adquirido que não coube, posicioná-lo e confirmar layout sem perder o que já arrumou |
| P2 | Atividades na sala do gerente | Conversa individual e reunião com entrada/saída visíveis; preservar a reunião semanal no pátio e definir novos efeitos somente com requisitos aprovados |
| P2 | Ocupação dos 16 lugares Wi-Fi e reserva de objetos | Entender quem usa cada lugar, evitar sobreposição e alternar tarefas sem disputar o mesmo assento |
| P2 | Metas da empresa e XP contínuo | Objetivos claros e recompensa idempotente; definir valores e elegibilidade com PM/PO antes de criar XP por semana ou compra |
| P2 | Quatro poderes restantes e controle completo de heróis | Saber alvo, efeito, prazo e recarga; respeitar a recarga já aprovada de quatro semanas |
| P3 | Giro das artes de uma vista, TV BI e aquário da #74 | Usar orientação coerente e mostrar dados reais da simulação, sem inventar indicadores ou substituir assets aprovados por placeholders silenciosos |

## Testes e homologação ainda necessários

- Sessões prolongadas com várias semanas, contratações/afastamentos, mudanças de gerente e numerosas reorganizações.
- Desktop com zoom do navegador, GPU modesta e pouco espaço/memória; rede lenta na primeira abertura e retomada após suspensão de aba.
- Celular físico Android/iOS e leitor de tela. A QA automatizada mobile usa emulação de viewport, não aparelhos reais.
- Revisão humana das transições nativas disponíveis, proporções e correspondência de IDs antes de retargetear clipes de uma pessoa para outra.
- Conferência pelo PM da nova área, porta, transparência e equilíbrio entre legibilidade e detalhe. Recursos sintéticos não devem ser apresentados como avaliação de saúde real ou conformidade normativa.

## Itens preservados como limitações

Mariana ainda usa a pose procedural validada nos assentos; a adaptação incorreta foi rejeitada. Apoios yoga/advogado não ocupam vagas nem geram bônus automáticos. O inventário de materiais carregados ainda é visual, sem logística persistente de caixas/pastas. Nenhum desses pontos deve ser considerado concluído apenas porque há animação demonstrada na galeria.
