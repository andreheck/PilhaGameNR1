# Ritmos individuais dos NPCs

Pedido do PM: velocidades de caminhada diferentes independentemente da saúde.

Cada NPC recebe um multiplicador visual estável pelo ID, na faixa de 0,82 a 1,18 do ritmo base. Os 16 NPCs canônicos têm ritmos distintos; recarregar ou reordenar a equipe não muda seu ritmo. Personalidade, cargo e saúde não definem essa variação.

A redução anterior de 40% quando a saúde está abaixo de 55 continua sendo aplicada sobre o ritmo individual. Ida, retorno, circulação, viagem para reunião e cadência dos rigs usam o mesmo fator. Pausas continuam completas e a capacidade restaurativa segue limitada. Calendário e dados salvos não recebem novos campos.

Validação: build, testes de agenda/ritmo individual, renderização dos rigs e regressão do ciclo vivo. PR #69, sem merge ou produção.
