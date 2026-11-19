# Entrada e sala de RH — 16/11/2026

## Escopo entregue

- Mantido o mundo quadrado de 50 × 50 e os seis lotes de expansão existentes.
- Reservada a sala de RH ao lado da sala de reuniões (8 × 6 m), sem criar um quarto setor de simulação nem novos índices.
- Aberta a passagem entre a reunião e o RH; a rota de exploração agora reconhece a sala.
- Construído um saguão de entrada na borda sul (6 × 7 m), com vão de 1,6 m voltado para o caminho do pátio, paredes, placa `PILHA+ · ENTRADA` e balcão de recepção.
- Incluídos rótulos de RH e entrada no mapa; paredes e balcão bloqueiam o percurso do explorador fora das passagens.

## Verificação

- `npm run build`: concluído.
- Testes focados de mapa, passagens, rotas, colisão, mobiliário, personagem do jogador e logística: 38 aprovados.
- `git diff --check` e `node --check ui/employee-panel.js`: aprovados.
- `npm test`: interrompido em `tests/staffing-management.test.mjs`; `simulation/company-continuous.js` chama `candidateFor`, que não está definido. A falha pertence a alterações paralelas no mesmo worktree e não foi alterada nesta etapa.

## Continuação

O RH foi equipado e conectado à rotina na entrega registrada em `RH-POSTOS-CIRCULACAO-2026-11-16.md`. O saguão ganhou dois postos de recepção na entrega registrada em `RECEPCAO-POSTOS-2026-11-16.md`; a alocação de funcionários continua pendente de regra própria.

Branch de trabalho: `codex/unified-social-agenda`. Sem commit, merge ou publicação nesta etapa.
