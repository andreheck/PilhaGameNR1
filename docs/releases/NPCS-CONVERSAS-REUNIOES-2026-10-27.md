# NPCs: ritmo, conversas e reunião semanal — 27/10/2026

Base: codex/escala-mobiliario, dc1dd4a (PR #54); empresa contínua da #53. Pedido PM: desacelerar um pouco, criar tempo de conversa e reunir funcionários com seu gerente no pátio uma vez por semana.

## Regras desta entrega

Constantes em simulation/npc-motion.js: ritmo relativo 0,85, permanência breve de até 5 s para conversa e 6 s de reunião no tempo de tela ativo. São hipóteses visuais configuráveis; não alteram os 120000 ms da semana C3. A desaceleração nas pernas de movimento é de 15%, adicional ao fator 0,6 já aprovado para saúde-base abaixo de 55. A cadência das pernas/clipes acompanha o fator. Não se afirma calibração em 1,2 m/s; a conversão física absoluta do briefing anterior permanece avaliação PO.

Colegas do mesmo setor que se encontram na janela de permanência conversam parados. Pareamento recíproco e determinístico por IDs, sem usar personalidade, idade ou atributos sensíveis. Os dois ficam em posições próximas distintas, com sinal de conversa; Mariana usa o clipe de fala aprovado. Uma janela sem parceiro é apenas uma parada breve. O intervalo não acelera o deslocamento seguinte para recuperar o tempo parado.

Cada setor tem uma reunião semanal com o gerente atualmente designado, incluindo a escolha inicial do jogador. Só ativos participam; gerente afastado/desligado não é clonado nem substituído silenciosamente. Há seis posições distintas no pátio, com aproximações por corredores/portas e área livre de móveis. O gerente recebe a indicação Reunião, e os participantes ficam voltados ao grupo. Não são heróis do conselho.

Agenda derivada do tempo ativo salvo: ida → reunião → retorno. Conflitos com uma pausa são deslocados como intervalo completo, sem cortar um trajeto. O caminho de trabalho termina/inicia na origem das viagens, evitando salto nos limites normais da agenda. Avanço manual/catch-up continua sendo salto de calendário. Pausa manual congela atores e clipes; resize não reconstrói a agenda.

Menu → Zonas e melhorias mostra a agenda dos três setores, data/hora simulada, gerente e quantidade de colegas. Fichas mostram Conversando, A caminho da reunião, Reunião semanal ou Retornando. Painel de Restauração distingue pessoas efetivamente em pausa de participantes da reunião; pessoas em trânsito não ocupam assento de pausa. Corrigido o aviso inicial que sugeria ausência de contratação mesmo com equipe ativa.

## Dados e benefícios

Nenhuma chave nova e nenhuma migração de save. Nada é gravado por participar de conversa ou assistir uma reunião; não há XP, pagamento ou prêmio novo. Os benefícios já existentes dos recursos restaurativos também influenciam quem está no pátio e permanecem temporários, limitados a 8. A reunião não altera a regra semanal de saúde dos gestores ou aportes.

O grafo recebeu seis âncoras e aproximações ortogonais de reunião. Zonas/IDs/origens, câmera, móveis pagos, efeitos e orçamento permanecem. Tráfego e lotação de pausa são distintos: o limite de seis assentos não proíbe outras pessoas de andar pelos corredores. A reunião usa a área reservada do pátio.

## Verificação

Novos testes verificam desaceleração nas pernas, imobilidade, pares recíprocos, gerente escolhido/ausente, uma reunião por setor/semana, posições distintas, agenda determinística após reload, benefícios limitados e origem contínua. Teste de rotas ampliado a todas as âncoras de reunião, proibindo segmentos diagonais e travessia de paredes. Testes antigos de pausa usam a agenda real, em vez de presumir horários que agora podem coincidir com a reunião; limite refere-se a assentos ocupados, não ao trânsito.

CI de interface: desktop 1440×900, celular 390×844 e 320×640, reunião dos três setores, conversa congelada, retorno à circulação, agenda textual, integridade de caixa/saúde e axe. Capturas/resultados finais serão registrados na PR.

## Limitações

Movimento ainda é o motor isométrico atual, com ritmo relativo; não é simulação física de trânsito/fila ou navegação de GLB. Ajustes de corpos/colisões e postos individuais completos seguem no backlog. Conversas são contextuais, sem diálogo narrativo gerado. Reunião não cria histórico persistente de presença. Aparelho físico/FPS/leitores de tela pendentes. Revisão PM/PO, sem merge, promoção ou alteração do alias público.
