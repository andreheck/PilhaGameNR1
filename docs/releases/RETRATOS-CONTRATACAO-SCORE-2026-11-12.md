# Embalagens na contratação e retratos por score — 12/11/2026

## Entrega

- As 16 fichas canônicas usam a arte de embalagem nos cards de contratação inicial e nas contratações canônicas posteriores.
- Após contratação, a lista de funcionários, a ficha aberta pelo mapa e o organograma usam o retrato sem embalagem correspondente à saúde simulada atual.
- Os oito candidatos adicionais mantêm o avatar sintético existente até receberem arte individual.
- Heróis continuam como conselheiros e personagens especiais permanecem visitantes; não foram adicionados como funcionários.
- A galeria de contratação mostra embalagens em cards compactos; clicar na embalagem abre a visualização ampliada e as abas Perfil, Contribuições e Apoios.
- A galeria não altera os controles de seleção ou contratação. Resumo e função ficam no card, e detalhes narrativos ficam recolhidos na visualização ampliada.
- Pedro (NPC-08) usa a embalagem de brinquedo verde aprovada em `Pilha Game/Personagens/Herois/Cards de compra/Card Pedro Ativista Verde.png`; a versão anterior do pacote era um infográfico de perfil.
- A escolha inicial de explorador do mapa exibe Jovem Profissional, Advogado e Diretora de Ensino em embalagens; Yoga saiu apenas dessa seleção. Retrato e animação continuam como assets independentes após a escolha.
- O atlas animado do Jovem Profissional foi associado ao funcionário canônico Pedro (NPC-08). A ficha dele continua usando o retrato sem embalagem.
- O Robô Azul tem embalagem de automação e uma opção separada em Contratação e gestão de pessoal. Pode ser ligado e desligado sem ocupar vaga humana; sua contribuição de produção acompanha o estado salvo.

## Recursos novos e integração visual — 12/11/2026

- Embalagens aprovadas de Jovem Profissional, Advogado e Diretora de Ensino são usadas no catálogo de primeira escolha. A pessoa jogadora vê o perfil, confirma uma opção e a seleção única é salva sem alterar o caixa ou o elenco contratado.
- A ficha lateral foi compactada para manter perfil e botão de escolha visíveis juntos em desktop/tablet (1366×768 e 1024×768).
- O atlas animado do Jovem Profissional fica associado ao registro canônico NPC-08; nome, cargo, setor e demais dados vêm do cadastro existente.
- O Robô Azul ganhou card próprio com sua embalagem, estado, carga e botão para ativar/desativar. Saves sem a propriedade recebem o padrão ativo uma única vez; saves com escolha explícita preservam o valor.
- Validação: `npm test`; `python tools/qa-expanded-cast.py`; `python tools/qa-blue-robot.py`; navegador isolado para catálogo em 1366×768 e 1024×768 (imagens carregadas, botão visível, seleção persistida); alternância do robô em 1366×768 (NPC some da cena sem alterar os 16 funcionários, escolha persiste, sem erros).
- Evidências de tela: `artifacts/expanded-qa/selection-1366.png`, `artifacts/expanded-qa/selection-1024.png` e `artifacts/robot-qa/`.

## Faixas visuais

| Valor mostrado no jogo | Retrato usado |
| --- | --- |
| 0–29 | 20 |
| 30–49 | 40 |
| 50–69 | 60 |
| 70–90 | 80 |
| 91–100 | 90+ |

Os arquivos estão em `assets/employee-packages`, `assets/employee-portraits` e `assets/employee-score/NPC-XX`. A mudança afeta apenas apresentação; não altera saúde, economia, contratações ou regras de simulação. O retrato é uma metáfora visual de um indicador fictício e não representa diagnóstico individual.
