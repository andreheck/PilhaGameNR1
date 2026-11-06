# Agenda cíclica dos NPCs — 05/11/2026

Continuação da frente unificada #69, base 7d2cff0. Reaproveita a ideia de ciclo fixo da PR #56 (047f81d) e adapta-a aos ritmos individuais da #69. Não importa seu HUD ou sua base antiga.

## Comportamento

- Cada NPC ativo tem sete viagens completas de pausa e, com gerente ativo no setor, duas reuniões por ciclo de 14 dias.
- Uma pausa conflitante é remarcada inteira, após o retorno anterior e fora das reuniões. Os eventos atravessam fronteiras sem duplicação ou exclusão.
- Templates são selecionados pela identidade nominal da pausa, depois normalizados ao ciclo. Filtrar somente pela data deslocada perdia pausas que atravessavam a fronteira.
- Datas próximas a milissegundos inteiros são normalizadas para evitar perda/duplicação na comparação de fronteiras por ponto flutuante.
- Recalcular a mesma situação perto da virada de semana ou ciclo não muda pose, progresso ou parceiro de conversa. Mudanças reais de equipe, recursos e faixa de velocidade por saúde continuam podendo replanejar a agenda.
- Ritmo próprio por ID, redução por saúde abaixo de 55, ida/volta, conversa e efeitos temporários são preservados. Sem novas chaves de save, pagamentos ou fórmula de saúde.

## Capacidade e trânsito

O limite de seis lugares ordinários considera pessoas permanecendo na Restauração. Pessoas nos corredores, a caminho ou retornando, não ocupam um lugar. A função attendance continua incluindo a viagem completa para preservar seus consumidores e a fórmula existente; para contar ocupação física, filtrar inRestArea. Reuniões continuam categoria separada, como na base anterior.

Reservar os seis lugares durante toda a ida e volta acumulava atrasos quando os funcionários estavam lentos. Os testes de capacidade agora medem a permanência física; testes independentes preservam identidade, trânsito, rotas completas e efeitos de saúde. Não é simulação física de filas ou colisões entre corpos.

## Validação

- Agenda: 9 testes, incluindo seis faixas de saúde, semanas 1/2/3/20/99999, contagem de sete pausas e duas reuniões, ausência de overlap por funcionário, reload na fronteira, ocupação física e continuidade na origem.
- Empresa viva: 36/36; rigs: 5/5; build aprovado.
- QA de navegador observa clipe walk real, pois uma conversa ou pausa pode legitimamente manter a mesma pose durante 600 ms.
- CI e evidências visuais no head final da PR #69. Solicitação do PM autoriza atualizar o site Vercel de testes; não implica merge da PR.
