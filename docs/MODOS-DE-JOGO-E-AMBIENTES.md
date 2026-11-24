# Modos de jogo e ambientes

Atualizado em 23/11/2026. Integração do menu de modalidades e da reorganização espacial da empresa avançada.

## Modos

| ID | Modalidade | Dificuldade | Ambientes funcionais | Apoio |
| --- | --- | --- | ---: | --- |
| `home-office` | Home office remoto | Fácil | 1 posto individual no quarto/casa do explorador | Equipe de 5 pessoas, incluindo gerente online, acessível pelo celular |
| `cowork` | Cowork híbrido | Moderado | 4: bancada coletiva, reunião, descanso e copa | Banheiro coletivo |
| `office` | Escritório presencial | Avançado | 10 salas/áreas ocupadas em uma empresa conectada | Circulação compartilhada |

Os IDs e as descrições ficam em `data/continuous/game-modes.js`; a apresentação está em `ui/game-mode-selection.js` e `ui/game-modes.css`. O modo escolhido é salvo dentro da partida (`gameMode`) e aparece no HUD. Saves anteriores sem esse campo migram para `office`, sem alterar saldo ou progresso. Depois da primeira escolha, o modo fica bloqueado naquela partida.

### Home office

O cenário exibe apenas o cômodo doméstico do explorador, com um posto de trabalho. O jogador circula e interage nesse espaço. O gerente online e quatro colegas não são desenhados no mapa e não ocupam postos presenciais: são contratados na configuração inicial e aparecem no aplicativo `Equipe` do celular, em um canal digital com mensagens semanais e respostas do jogador. Essa equipe remota continua participando dos indicadores e da simulação de saúde como um único grupo de trabalho.

As três modalidades usam dioramas isométricos próprios em \`assets/game-modes/\`. As prévias começam em escala de cinza; o modo selecionado ganha cor.

## Dez ambientes do modo Avançado

Os dez ambientes são salas e áreas dentro da mesma empresa. Funcionários ocupam postos fixos ou participam por escala nos espaços compartilhados; isso não cria dez setores de indicadores. A simulação continua usando os três setores canônicos — Escritório, Produção e Atendimento — mais Restauração como espaço coletivo.

| # | Ambiente | Lotação/função | Base visual ou mecânica existente |
| ---: | --- | --- | --- |
| 1 | Entrada e recepção | 1–2 pessoas de atendimento | `WORLD_PLOT.plannedSpaces[entrada]`, balcão e postos |
| 2 | Recursos Humanos | Equipe de pessoas | `OFFICE_SPACE.hr`, posto da Raimunda e arquivo |
| 3 | Escritório administrativo | Equipe do setor Escritório | Área principal do setor e postos |
| 4 | Sala da gerência | Gerente do setor | `OFFICE_SPACE.manager` e mesa de gerência |
| 5 | Sala de reuniões | Participantes por escala | `OFFICE_SPACE.meeting`, mesa de quatro lugares |
| 6 | Atendimento | Equipe do setor Atendimento | Setor existente e postos de atendimento |
| 7 | Produção | Equipe do setor Produção | Setor existente e equipamentos de operação |
| 8 | Galpão logístico | Equipe logística em circulação e trabalho | Anexo logístico de Produção |
| 9 | Copa e convivência | Pessoas em pausa e rodízio | Área de restauração e mobiliário de apoio |
| 10 | Pátio restaurativo | Pessoas em pausas e atividades | Anexo restaurativo/pátio |

Banheiro e corredores são apoio/circulação; não entram na contagem. Sala de gerência, reunião e RH são cômodos contíguos ao escritório principal, não novos setores de simulação. Cada um tem entrada voltada para a área compartilhada; o RH deixou de depender da passagem pela sala de reuniões.

## Arquitetura e estado desta entrega

- Uma única simulação e um único formato de save; cada partida guarda o ID do modo.
- Compatibilidade de progresso existente: modo presencial/Avançado como padrão de migração.
- Catálogo descreve ambientes e ocupação sem duplicar a lógica dos três setores.
- Menu selecionável de três cartões, teclado/setas, foco visível, leitor de tela e layout responsivo.
- A seleção é persistida e o modo fica visível no HUD.
- O mapa Avançado começa em uma malha 2x2: Escritório e Produção na fileira superior; Atendimento e Pátio na inferior. As salas têm folgas uniformes para corredores, com conexões de circulação nos quatro lados do conjunto.
- A área de jogo visível acompanha os quatro setores, seus anexos e os corredores; o envelope quadrado de expansão não é mais desenhado como um grande gramado vazio nem como molduras em volta de cada setor. A recepção fica ao sudeste do pátio: a calçada interna conecta o pátio à entrada, e um acesso público independente chega à porta pelo limite sul do terreno, sem exigir a travessia do pátio. O enquadramento reserva espaço acima do painel inferior para manter a recepção inteira visível.
- O salão administrativo foi organizado em cinco baias de postos duplos e uma mesa de colaboração. Divisórias de vidro alinham as baias sem fechar os corredores centrais; a sala de reuniões separada continua sendo o espaço para encontros formais.

### Organização do cenário Avançado

\`\`\`
      Gerência · Reunião · RH
      (anexo norte do Escritório)

  Escritório  ── corredor ──  Produção ── Galpão logístico
       │                          │
   corredor                   corredor
       │                          │
 Atendimento ─── corredor ─── Pátio restaurativo ─── Recepção
\`\`\`

O arranjo usa a mesma coordenada inicial em desktop e tablet para evitar que o cenário mude de lugar quando o painel lateral ou a janela redimensiona. Espaços do mapa e móveis continuam em coordenadas locais, preservando compras e posicionamentos salvos.

#### Ala administrativa

O Escritório agora mostra a ala norte dividida visualmente em Gerência, Sala de reuniões e RH. Cada cômodo tem tom de piso e letreiro próprios; os letreiros indicam a capacidade de uso. A Gerência mantém um posto, a reunião mantém sua mesa de quatro lugares e o RH mantém o posto já vinculado à Raimunda. As entradas, as dimensões 8 × 6 m e as rotas permanecem no lugar; a reunião continua sendo um ambiente físico, enquanto os encontros de rotina seguem acontecendo no pátio conforme a agenda existente.

Esta etapa melhora a leitura da planta focada no Escritório. A recepção tem capacidade de 1–2 postos, com alocação manual em Gestão de pessoal. Funcionários alocados aparecem sentados nos postos do mapa; o letreiro mostra a ocupação atual. A alocação é visual e operacional: não muda o setor oficial, cargo, folha, saúde ou índices do Escritório. O gerente permanece na sala da gerência e Raimunda continua vinculada ao RH.

Os encontros semanais dos três setores acontecem no pátio, com o gerente e os integrantes reunidos no mesmo horário. O mapa exibe os participantes durante o encontro. A sala de reuniões da ala administrativa continua disponível para o jogador e para atividades que venham a usar esse espaço; a reunião recorrente da simulação não é duplicada ali.

#### Estado da ocupação dinâmica

- Concluída: alocação de até duas pessoas ativas do Escritório na recepção, com retorno ao posto de origem ao liberar a vaga.
- Concluída: presença visual de cada recepcionista em sua cadeira e indicador `RECEPÇÃO · n/2` na entrada.
- Concluída: reuniões semanais dos setores no pátio, com presença dos participantes e do respectivo gerente.
- Verificada por testes: atribuição respeita lotação, mantém o vínculo de setor e não altera saldo nem os indicadores de saúde.

### Composição jogável por modalidade

O mapa agora recebe o layout da modalidade salva antes de criar a cena. O redimensionamento para desktop/tablet reenquadra o mapa sem trocar as coordenadas ou reorganizar os móveis já salvos.

| Modalidade | Distância entre os quatro ambientes | Leitura espacial |
| --- | ---: | --- |
| Home office | Sem corredores | Um cômodo com posto individual |
| Cowork | 3 unidades | Áreas compartilhadas ligadas por corredores intermediários |
| Escritório presencial | 6 unidades | Malha ampla do cenário avançado existente |

O Home office concentra a equipe em um grupo remoto. Cowork e Escritório mantêm a organização por setores e os trajetos entre salas.

### Pendências de implementação

1. Avaliar o balanceamento econômico de cada modalidade com dados de partidas.
2. Balancear frequências de eventos, recursos e simultaneidade por modalidade com simulações; Fácil/Moderado/Avançado ainda não têm parâmetros de dificuldade próprios.
3. QA manual em navegador nos três mapas, com movimentação entre salas, primeira entrada e saves existentes; confirmar câmera, teclado, leitor de tela e desktop/tablet.

## Verificação

Os testes `tests/game-modes.test.mjs`, `tests/world-expansion.test.mjs`, `tests/staffing-management.test.mjs` e `tests/npc-social-agenda.test.mjs` cobrem modos, organização do espaço, lotação/alocação da recepção e agenda de reuniões no pátio. A suíte geral continua indicada antes de publicar mudanças transversais.
