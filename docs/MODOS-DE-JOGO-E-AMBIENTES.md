# Modos de jogo e ambientes

Atualizado em 23/11/2026. Integração do menu de modalidades e da reorganização espacial da empresa avançada.

## Modos

| ID | Modalidade | Dificuldade | Ambientes funcionais | Apoio |
| --- | --- | --- | ---: | --- |
| `home-office` | Home office remoto | Fácil | 1 posto individual | Banheiro acessível |
| `cowork` | Cowork híbrido | Moderado | 4: bancada coletiva, reunião, descanso e copa | Banheiro coletivo |
| `office` | Escritório presencial | Avançado | 10 salas/áreas ocupadas em uma empresa conectada | Circulação compartilhada |

Os IDs e as descrições ficam em `data/continuous/game-modes.js`; a apresentação está em `ui/game-mode-selection.js` e `ui/game-modes.css`. O modo escolhido é salvo dentro da partida (`gameMode`) e aparece no HUD. Saves anteriores sem esse campo migram para `office`, sem alterar saldo ou progresso. Depois da primeira escolha, o modo fica bloqueado naquela partida.

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
- O terreno externo foi compactado para um quadrado de 52 unidades, sem lotes vazios desenhados ao redor do campus. A recepção fica ao sudeste do pátio, conectada pela calçada.
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

Esta etapa melhora a leitura da planta focada no Escritório. A recepção continua com capacidade física de 1–2 postos, mas ainda não atribui funcionários automaticamente: essa escolha permanece na Gestão de pessoal.

### Pendências de implementação

1. Conectar os perfis `home-office` e `cowork` a layouts espaciais próprios no renderizador e à distribuição de personagens. Nesta entrega, o motor visual existente ainda representa o escritório presencial para as três opções; portanto, os dois modos menores não devem ser anunciados como cenários jogáveis concluídos.
2. Completar no mapa a escala e a ocupação dinâmica das salas avançadas, incluindo cobertura de recepção e participação em reuniões, sem criar novos setores de simulação.
3. Balancear frequências de eventos, recursos e simultaneidade por modalidade com testes de simulação; os níveis Fácil/Moderado/Avançado ainda são rótulos de progressão, sem regras numéricas próprias.
4. QA manual em navegador nas rotas de primeira entrada, save existente e retorno ao mapa; confirmar teclado, leitor de tela e desktop/tablet.

## Verificação

O teste automatizado `tests/game-modes.test.mjs` valida os três perfis, contagem de ambientes, persistência, bloqueio de troca após início e migração de saves antigos. A suíte geral de testes também deve ser executada antes de publicar.
