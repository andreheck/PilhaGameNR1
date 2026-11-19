# Postos e circulação de RH — 16/11/2026

## Entrega

- Mobília a sala de RH existente no anexo do Escritório com mesa de atendimento, arquivo baixo, estante de materiais e mural de pessoas, usando exclusivamente IDs do catálogo aprovado.
- Atribui a estação identificada de RH à Raimunda (`NPC-04`) quando ela estiver na equipe. O vínculo usa o ID canônico; não cria personagem, contratação automática, novo cargo ou efeito de saúde.
- Separa os metadados espaciais das salas da diretoria, reunião e RH para o planejamento de rotas de trabalho.
- Estende a busca de caminhos para atravessar o corredor principal, usar a abertura da sala de reuniões e entrar no RH sem atravessar paredes ou móveis.
- Ajusta o build do mapa para aceitar tanto a antiga âncora de rotas quanto a atual, evitando falha de build quando a navegação já contém as salas novas.

## Limites preservados

O RH continua sendo uma área física dentro do setor Escritório, sem índice, economia ou regras de simulação próprios. Raimunda mantém a função canônica de Analista administrativa; a mesa apenas representa seu posto físico. Recepção e RH não recebem NPCs automaticamente quando não estiverem na equipe.

## Verificação

- `npm run build`: passou.
- Testes focados de mundo, estação de trabalho e circulação, escala de mobiliário, agenda social, rotas da empresa e logística: passaram após ajuste dos critérios de localização do RH.
- Teste novo: confirma o caminho da circulação do Escritório, pelo vão da reunião, até a estação de RH e a associação em runtime do posto a `NPC-04`.
- `npm test`: interrompido em `tests/staffing-management.test.mjs` por `ReferenceError: candidateFor is not defined` em `simulation/company-continuous.js:48`. A falha está fora desta alteração espacial e já ocorria na suíte focada anterior; os testes seguintes da sequência não foram executados pela interrupção.
- Sem commit, merge, PR ou publicação.

## Próxima etapa sugerida

Validar visualmente o RH e o saguão em desktop/tablet, confirmar legibilidade dos cômodos em zoom normal e aproximado, e revisar com PM quem ocupa a recepção. Depois, corrigir `candidateFor` numa entrega de simulação separada antes de exigir a suíte integral verde.
