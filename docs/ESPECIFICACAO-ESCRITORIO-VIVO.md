# Especificação — Escritório vivo do PilhA+ Game

Status: especificação de implementação; distinguir sempre o que já existe no código do que ainda está planejado.

## Princípios

- O escritório deve ser legível como espaço de trabalho: setores nomeados, circulação contínua, corredores e áreas de pausa, paredes e objetos que não confundam caminhos.
- Usar os modelos GLB existentes e somente clipes de animação realmente presentes. Não criar avatar procedural como substituto visual de modelo ausente.
- Personagens e indicadores são inteiramente sintéticos. Emojis são sinais narrativos, nunca diagnósticos.
- Consequências de 30 dias são projeções pedagógicas reproduzíveis, não previsões reais ou métricas validadas.
- A demissão não deve ocorrer automaticamente por adoecimento nem por um emoji. A narrativa deve deixar visível a responsabilidade organizacional, as oportunidades de apoio e a decisão gerencial.

## Máquina de estados

Estados internos: `idle` (parado), `working` (trabalhando), `exploring` (explorando/deslocando), `talking` (conversando), `resting` (pausando) e `worried` (preocupado).

Cada estado tem duração com intervalo definido, transição ao expirar e indicação visual. Usar clipe GLB compatível quando disponível. Se não existir clipe correspondente, manter o clipe seguro existente e comunicar o estado com ícone/HUD; nunca inventar animação nem avatar. O estado de risco alto pode conduzir a `worried`, mas a leitura deve ser de alerta para rever condições de trabalho, não de diagnóstico pessoal.

Rotinas por personagem: lista de destinos válida, pausas em zona apropriada, conversa em ponto permitido, retorno à área de origem e variação determinística por identificador/seed. Movimento por waypoints em corredores válidos, com colisão por volume contra limites, paredes e móveis; bloquear deslocamento inválido e tentar eixo alternativo sem atravessar objetos.

## Ação de proteção e feedback

Para cada medida, a interface deve mostrar:
1. Ação escolhida, motivo e custo/limitação.
2. Mudança imediata de estado e indicadores afetados, com comparação antes/depois.
3. Animação curta de construção/instalação no setor, usando objeto/material já existente ou um efeito temporário simples sobre o objeto real.
4. Som curto de melhoria, com botão de silenciar e sem autoplay antes da primeira interação.
5. Notificação curta com medida aplicada e setor alterado.
6. Evento registrado no histórico local e agenda sintética de consequência para o dia 30.

## Matriz mínima de cenários

| Cenário | Ação do jogador | Estado alterado | Feedback | Resultado sintético no dia 30 |
|---|---|---|---|---|
| Positivo | Corrigir carga/jornada, ajustar capacidade e realizar escuta com devolutiva | Menor risco agregado; rotinas mais estáveis; equipe retoma trabalho/pausa de forma equilibrada | Setor atualizado, som e toast de melhoria | Risco simulado reduzido e apoio/coooperação melhorados |
| Neutro | Ação complementar sem tratar a causa principal | Indicadores principais quase estáveis | Toast informa efeito limitado; setor recebe mudança visual pequena | Sem mudança material no risco principal |
| Negativo | Adiar ação estrutural apesar de alertas sucessivos | Risco agregado permanece alto; estado preocupado pode persistir; pausas/rotinas se desorganizam | Aviso explícito, sem som punitivo, HUD mostra causa organizacional | Maior risco sintético e deterioração da rotina; não declarar que isso prevê adoecimento real |

A consequência precisa derivar das ações registradas, não de aleatoriedade irreproduzível. Os resultados devem ter limites e explicação legível.

## Fluxo pedagógico de adoecimento e desligamento

1. Apresentar sinais sintéticos agregados e contexto de trabalho, sem diagnosticar personagem.
2. Oferecer opções: escuta e acolhimento, ajuste de carga/jornada, apoio profissional adequado, investigação das condições, redistribuição temporária e acompanhamento.
3. Se o jogador ignorar sucessivas oportunidades, representar piora organizacional simulada e alertar que o apoio não ocorreu.
4. O desligamento só pode aparecer como uma decisão organizacional explícita posterior, com consequências para equipe, capacidade, confiança e custos; oferecer alternativa de retenção/recuperação e mostrar cenário comparativo.
5. Não enquadrar demissão como tratamento, recompensa ou resultado inevitável do adoecimento. Evitar frases que culpem o trabalhador.

## Persistência

Guardar sob uma chave versionada (por exemplo, `pilha-office-sim-v1`): versão, dia simulado, medidas aplicadas, timestamps de jogo, estados sintéticos, indicadores, notificações vistas e eventos. Validar JSON na leitura, recuperar estado inicial se estiver corrompido, migrar apenas quando houver regra explícita e permitir reiniciar com confirmação. Nunca guardar dados de trabalhadores reais.

## Testes obrigatórios

- Testes unitários para seis estados, duração, transições, risco, seed e rotas.
- Testes de colisão para paredes, móveis, limites, passagem de corredor, retorno à origem e alvo bloqueado.
- Testes de medida: orçamento, estado/indicadores, evento de feedback, som configurável e persistência.
- Testes do dia 30 para cenários positivo/neutro/negativo com resultados determinísticos.
- Testes da sequência de adoecimento, opções de apoio, adiamento, retenção e decisão explícita de desligamento.
- Testes de migração, JSON corrompido, reinício e repetição de ações.
- Teste real no navegador: GLBs e clipes carregam, câmera e cliques funcionam, personagem não atravessa objetos/não flutua/não fica preso, som é controlável, layout é responsivo e console não tem erros críticos. Repetir após correções.

## Estado de implementação conhecido (15/10/2026)

Foi adicionado o módulo base `src/office-actor-brain.js` e a suíte `tests/office-actor-brain.test.mjs` com helpers determinísticos de estado/colisão. Ainda é necessário validar o teste automatizado, conectar a máquina ao loop real de `world3d.js`, implementar efeitos visuais/sonoros, persistência e horizonte de 30 dias, e executar QA no navegador. Não afirmar que os requisitos posteriores já estão entregues.
