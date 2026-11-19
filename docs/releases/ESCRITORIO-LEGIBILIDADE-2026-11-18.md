# Ala administrativa do Escritório — 18/11/2026

## Alterações

- Diferenciados visualmente os pisos da Gerência, da Sala de reuniões e do RH, com tons de azul, verde-azulado e violeta dentro da paleta atual.
- Reforçados os limites de cada cômodo e os limiares das portas, mantendo a ala conectada ao Escritório e o acesso entre reunião e RH.
- Atualizados os letreiros para mostrar nome e capacidade: um posto de liderança, mesa para quatro pessoas e um posto de atendimento de RH.
- Mantidos os móveis existentes, coordenadas, rotas, setor de simulação e posições salvas.
- Documentada a distinção entre reunião física e reunião semanal no pátio; a rotina social não foi duplicada.
- Incluídas etiquetas de ocupação na Gerência, RH e Sala de reuniões, com nomes quando há pessoas no cômodo e indicação de sala livre quando não há.
- A agenda já existente sinaliza no próprio pátio os nomes dos participantes durante a reunião semanal. A reunião continua acontecendo uma vez por gerente no pátio; nenhum novo agendamento foi criado.

## Pendências da fase do novo escritório

- Validar visualmente a ala em desktop e tablet com câmera focada no Escritório e no mapa geral.
- Integrar layouts próprios de Home Office e Cowork; a planta atual é do modo presencial avançado.

## Continuação: alocação da recepção

- Gestão de pessoal permite alocar e liberar até dois funcionários ativos do Escritório nos postos da entrada.
- O gerente e a pessoa fixa do RH não aparecem como opções; alocados ficam sentados na recepção e saem do ciclo visual de circulação e pausa.
- A alocação é apenas de posto: não altera setor oficial, cargo, remuneração, saúde simulada nem contagem da equipe.
- O estado é retrocompatível com partidas salvas antes da inclusão da lista `staffing.reception`.

## Verificação

- Corrigido o ponto de inserção das animações rigadas: o builder agora usa a linha atual do sprite renderer. A fala usa o estado `talking`, inclusive durante conversas em pé, e o estado de QA registra duração, tempo e quadros da animação.
- Corrigido o escopo das etiquetas: cada legenda recebe o ambiente renderizado junto do descritor de mundo correspondente. Isso evita falha ao focar uma sala e preserva o mapa de três e quatro setores.
- O ar-condicionado comprado fica fora da área dos postos e é marcado como suspenso na parede, sem bloquear as rotas de caminhada; o catálogo visual e a cena gerada usam a mesma posição.
- Builders derivados da cena foram alinhados à nova metadata de móveis suspensos para manter o build reproduzível.
- Corrigidas expectativas de testes financeiros e de benefícios: fatores corporativos usam a média dos três setores; receita e lucro semanal refletem saúde, ambiente e valores arredondados do motor.
- `npm test` passou integralmente em 19/11/2026, incluindo build, rotas, circulação, lugares de trabalho, compras, efeitos, economia, elenco e persistência.
- `git diff --check` e `node --check` dos builders e da cena compilada passaram.
- Inspeção visual do fluxo de primeira partida concluída em desktop (1440×1000) e tablet (1024×768): bairro, entrada, introdução, escolha de modo, personagem, contratação inicial, revelação do explorador e mapa com guia opcional. O mapa mantém a barra dentro do viewport e não reintroduz indicadores por setor na faixa inferior.
- A checagem real do fluxo identificou `setReceptionStaff` tentando ler `office.env.people`, embora `envs.escritorio` já seja o ambiente. Corrigido para `office.people`; depois da reconstrução, o fluxo completo não registrou exceções JavaScript nem requisições falhas.
- A suíte integral foi executada novamente após a correção: todos os testes passaram; build e `git diff --check` também passaram.
- Publicado no projeto Vercel `pilha-plus-game-preview`; deployment `dpl_7jFt3Y8Mvxev4tAgqxqjJ3jmEDTX` ficou `READY`, com alias oficial `https://pilha-plus-game-preview.vercel.app/` e commit `48501cfc7f0863fb45cc6f9d7cb120a78f7b6981`.
