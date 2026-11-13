# NPCs nos móveis: correção da agenda real — 05/11/2026

Relato do PM: personagens não se aproximavam dos móveis nem os manipulavam no site. Base conferida: PR #69 / 3a9a2ce.

## Causa

A agenda social fornece sampleAt. O renderer retornava desse ramo depois de caminhar apenas no corredor, sem executar workActivity. O teste antigo desativava sampleAt e validava somente o fallback anterior. Além disso, as cadeiras eram capturadas antes do reposicionamento do mobiliário, produzindo coordenadas desatualizadas.

## Correção

- A fase de trabalho da agenda agora executa tarefas nos móveis antes do encontro/conversa e retorna ao ponto de origem antes da próxima pausa.
- Escritório e Atendimento: aproximação ao posto real, pose sentada/digitação, manuseio de pasta e deslocamento carregando-a.
- Produção: aproximação a caixas/estantes, gesto de pegar, transporte até esteira/máquina/bancada e gesto de colocação.
- Âncoras de interação são derivadas da geometria já organizada, incluindo móveis renovados. Cada mesa usada tem um posto distinto. Candidatos bloqueados por outros móveis são descartados.
- Caminhos locais contornam os limites dos móveis com margem para o corpo; o cache é invalidado pela versão da geometria e tem tamanho limitado.
- Conversas, pausas, reuniões, ritmos individuais e redução por saúde continuam na mesma agenda. Nenhuma chave de save, fórmula de saúde, preço ou recompensa foi adicionada.

## Evidências exigidas e testes

O teste de integração usa L.routines real sem remover sampleAt e percorre uma semana com mobiliário básico e com todas as melhorias no nível máximo. Verifica os 11 funcionários administrativos nos computadores, assentos únicos, caixas na Produção, manuseio junto ao item e pastas visíveis. Um teste adicional amostra as rotas até os móveis para detectar interseções com a mobília.

O QA no navegador observa atividades reais, pausa o jogo e localiza o funcionário pela interface para capturar computador e transporte de caixa em desktop/celular. Não injeta uma agenda alternativa para essas capturas. Evidências e SHA final ficam na PR #69 antes de atualizar o site de testes.

A etapa visual usa uma equipe ativa no save sintético de QA, após concluir os testes financeiros e de afastamento. O primeiro ensaio havia chegado à captura com os 16 funcionários afastados, causando timeout legítimo por ausência de atores; a captura de falha foi examinada. Essa preparação não muda regras ou dados de jogadores: a agenda e o renderer usados continuam sendo os reais.

## Limites visuais

As poses de sentar/digitar/manusear são procedurais: os dois modelos riggados fornecidos ainda não possuem esses clipes específicos. Os objetos nas mãos são props visuais; não representam um inventário físico persistente de caixas/pastas. Não são declaradas novas animações FBX entregues.
