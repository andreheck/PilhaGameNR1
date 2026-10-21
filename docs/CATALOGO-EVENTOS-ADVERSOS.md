# Catálogo de eventos adversos — Pilha Game NR1

**Status:** especificação de gameplay para prototipagem e inclusão no backlog de implementação.  
**Escopo:** 19 eventos distribuídos em cinco categorias. Todos os efeitos numéricos são parâmetros fictícios de balanceamento, não previsões reais nem estimativas científicas.

## Princípio de design

Os eventos introduzem incerteza e desafios mesmo quando a organização investe em melhorias e conta com heróis bem desenvolvidos. Heróis e intervenções melhoram preparação, detecção e resposta; não anulam automaticamente problemas. A simulação não deve culpar trabalhadores por riscos organizacionais, recompensar produtividade à custa da saúde ou tratar treinamento individual como substituto de mudanças estruturais.

Cada evento deve ter, no mínimo: ID, categoria, gatilhos, probabilidade-base configurável, gravidade, duração, possibilidade de prevenção/mitigação, efeitos por domínio, efeitos operacionais/financeiros, decisões disponíveis, custo das respostas, condições de encerramento e histórico. Parâmetros numéricos só devem ser fixados após testes de jogo.

## Categorias e eventos

### 1. Operacionais e tecnológicos

#### EVT-01 — Falha de equipamento
- **Gatilhos:** desgaste, uso intenso, manutenção incompleta ou evento aleatório.
- **Efeitos:** capacidade temporariamente reduzida, atrasos, risco de retrabalho e pressão sobre a equipe.
- **Respostas:** manutenção corretiva segura, equipamento alternativo, replanejamento da demanda.
- **Mitigação:** manutenção preventiva e redundância reduzem probabilidade/duração, sem zerá-las.

#### EVT-02 — Indisponibilidade de sistema ou erro após atualização
- **Gatilhos:** atualização, integração defeituosa ou falha externa de serviço.
- **Efeitos:** filas, retrabalho, frustração e atraso.
- **Respostas:** rollback controlado, contingência manual segura, suporte técnico e comunicação transparente.
- **Mitigação:** testes, cópias de segurança e plano de continuidade reduzem impacto.

#### EVT-03 — Gargalo entre setores
- **Gatilhos:** melhoria local aumenta demanda em processo dependente ou capacidade desigual entre etapas.
- **Efeitos:** um indicador local melhora enquanto filas, carga e atraso aumentam em outro setor.
- **Respostas:** mapear fluxo, renegociar prioridades, ajustar capacidade e redesenhar processo.
- **Mitigação:** visão sistêmica e métricas de fluxo ponta a ponta.

### 2. Humanos e psicossociais

#### EVT-04 — Resistência ou baixa adesão à mudança
- **Gatilhos:** mudança sem participação, comunicação insuficiente, ferramenta inadequada ou baixa confiança.
- **Efeitos:** adoção parcial, erros, retrabalho e tensão.
- **Respostas:** escuta com devolutiva, teste-piloto, participação dos trabalhadores, treinamento contextualizado e correção das barreiras.
- **Salvaguarda:** não rotular automaticamente a reação como falha individual; investigar condições e desenho da mudança.

#### EVT-05 — Conflito interpessoal ou ambiguidade de papéis
- **Gatilhos:** responsabilidades sobrepostas, prioridades incompatíveis ou comunicação falha.
- **Efeitos:** cooperação reduzida, tensão e atraso.
- **Respostas:** clarificar papéis, mediar o conflito, ajustar processo e canais de decisão.

#### EVT-06 — Fadiga acumulada
- **Gatilhos:** semanas intensas, pausas insuficientes, jornada/carga inadequadas ou recuperação insuficiente.
- **Efeitos:** maior chance simulada de erros, irritabilidade, absenteísmo e piora do bem-estar.
- **Respostas:** rever carga, prazos, jornada e dimensionamento; garantir recuperação.
- **Salvaguarda:** mobiliário e ações de bem-estar não compensam sobrecarga estrutural.

### 3. Financeiros e estratégicos

#### EVT-07 — Corte inesperado de orçamento
- **Gatilhos:** redução de receita, custo imprevisto ou decisão estratégica externa à equipe.
- **Efeitos:** investimentos adiados e menor margem de resposta.
- **Respostas:** priorizar controles essenciais, replanejar fases e buscar alternativas sem remover salvaguardas críticas.

#### EVT-08 — Pico inesperado de demanda
- **Gatilhos:** sazonalidade, novo contrato, pedido urgente ou mudança de mercado.
- **Efeitos:** potencial de receita junto com risco de horas extras, erros, sobrecarga e afastamentos.
- **Respostas:** renegociar prazo/escopo, priorizar entregas ou investir em capacidade sustentável.
- **Escolha estratégica:** aceitar toda a demanda pode elevar receita no curto prazo e custos humanos/operacionais depois.

#### EVT-09 — Investimento com baixo retorno
- **Gatilhos:** solução escolhida não ataca a causa principal, baixa adoção ou diagnóstico insuficiente do processo.
- **Efeitos:** orçamento consumido e pequena melhoria nos resultados.
- **Respostas:** reavaliar evidências, envolver usuários, executar piloto e redirecionar investimento.
- **Salvaguarda:** não atribuir culpa a trabalhadores por uma solução mal especificada.

### 4. Saúde, segurança e ambiente

#### EVT-10 — Novo risco após alteração do layout
- **Gatilhos:** mudança de fluxo, instalação de equipamento ou reorganização física.
- **Efeitos:** cruzamento perigoso, obstrução, ergonomia inadequada ou rota de emergência comprometida.
- **Respostas:** interromper a condição insegura quando necessário, reavaliar riscos e redesenhar o layout antes de retomar.
- **Mitigação:** análise prévia de mudanças e participação de quem executa o trabalho.

#### EVT-11 — Quase acidente
- **Gatilhos:** barreira de controle fraca, risco não tratado ou evento aleatório.
- **Efeitos:** alerta crítico, necessidade de investigação e potencial de evento mais grave se nada mudar.
- **Respostas:** proteger pessoas, registrar e investigar sem culpabilização, corrigir causas e verificar eficácia.
- **Salvaguarda:** nunca premiar ocultação ou subnotificação.

#### EVT-12 — Condição ambiental extrema ou falha de infraestrutura
- **Gatilhos:** calor intenso, enchente, falha de climatização/ventilação ou outra condição ambiental.
- **Efeitos:** indisponibilidade de área, desconforto, risco à saúde e interrupção operacional.
- **Respostas:** contingência, manutenção, adaptação de atividade, pausa ou suspensão segura quando necessário.

### 5. Externos e socioeconômicos

#### EVT-13 — Inflação
- **Gatilhos:** evento macroeconômico ou aumento acumulado de preços.
- **Efeitos:** aumento de custos e redução do poder de compra; pressão sobre orçamento e satisfação.
- **Respostas:** revisar orçamento, renegociar contratos, proteger itens essenciais e avaliar remuneração sustentável.

#### EVT-14 — Juros altos
- **Gatilhos:** condições de crédito desfavoráveis.
- **Efeitos:** financiamento mais caro, investimentos adiados e pressão de caixa.
- **Respostas:** priorizar investimentos críticos, renegociar passivos e escalonar melhorias sem abandonar controles essenciais.

#### EVT-15 — Custo de vida elevado
- **Gatilhos:** aumento de moradia, alimentação, transporte e serviços essenciais.
- **Efeitos:** estresse financeiro simulado, menor satisfação e maior intenção de saída; atrasos/absenteísmo podem aparecer conforme o contexto.
- **Respostas:** avaliar remuneração, alimentação, transporte, flexibilidade e benefícios relevantes, respeitando viabilidade e equidade.
- **Salvaguarda:** não presumir que benefícios substituem remuneração adequada nem penalizar trabalhadores por dificuldades econômicas.

#### EVT-16 — Epidemia local
- **Gatilhos:** evento sanitário externo e condições locais de transmissão. Frequência e gravidade são parâmetros de cenário, não previsões epidemiológicas.
- **Efeitos:** propagação simulada entre colaboradores, ausências simultâneas, menor capacidade, preocupação coletiva e possível sobrecarga dos que permanecem.
- **Respostas:** medidas preventivas apropriadas, ventilação/higiene, comunicação confiável, reorganização segura do trabalho, contingência de equipes e orientação de saúde pública pertinente.
- **Progressão de prototipagem:** em cada nova ocorrência deste evento na mesma partida/campanha, a taxa-base simulada de colaboradores afetados progride para **25% na 1ª ocorrência, 40% na 2ª e 60% na 3ª e nas seguintes**.
- **Cálculo:** colaboradores afetados = arredondamento configurável de (equipe elegível × taxa da ocorrência), limitado ao tamanho da equipe. Documentar regra de arredondamento e tratamento de equipes pequenas nos testes.
- **Mitigação:** prevenção, ventilação, organização do espaço e planos de continuidade podem reduzir a taxa efetiva ou as consequências, conforme parâmetros do jogo. A taxa escalonada é um valor-base de gameplay, não uma lei epidemiológica.
- **Regras de estado:** cada personagem afetado recebe um estado temporário de indisponibilidade/recuperação; duração e retorno devem ser configuráveis. Evitar reinfecção instantânea ou contagem dupla sem regra explícita. Não exigir que colegas sintomáticos permaneçam trabalhando.
- **Salvaguarda:** não usar diagnóstico real nem dados de saúde de pessoas reais; não apresentar esses percentuais como orientação médica ou previsão científica.

#### EVT-17 — Atraso de fornecedor
- **Gatilhos:** ruptura logística, atraso de entrega ou interrupção do fornecedor.
- **Efeitos:** falta de insumos, parada parcial e pressão sobre prazos.
- **Respostas:** fornecedor alternativo, estoque crítico proporcional, replanejamento e comunicação de prazo.

#### EVT-18 — Saída ou indisponibilidade de profissional-chave
- **Gatilhos:** desligamento, afastamento ou indisponibilidade inesperada.
- **Efeitos:** perda temporária de conhecimento, atraso e redistribuição de carga.
- **Respostas:** documentação, sucessão, redundância de competências, redistribuição sustentável e reposição.
- **Salvaguarda:** não presumir causa pessoal ou clínica para a ausência.

#### EVT-19 — Escassez de candidatos qualificados
- **Gatilhos:** mercado restrito, requisitos muito estreitos ou baixa atratividade da proposta.
- **Efeitos:** tempo de contratação maior, vagas descobertas e pressão sobre a equipe.
- **Respostas:** revisar requisitos essenciais, desenvolver talentos internos, ampliar canais e avaliar salário, jornada, flexibilidade e condições de trabalho.

## Modelo comum de evento

Cada evento deve usar parâmetros configuráveis, evitando valores rígidos espalhados pela interface:

- ID, categoria, título e descrição;
- probabilidade-base, gravidade, duração em ciclos e intervalo de recorrência;
- gatilhos, fatores de prevenção e fatores de mitigação;
- domínios afetados, efeitos operacionais e financeiros;
- opções de decisão com custo, requisitos, benefícios, efeitos adversos e horizonte temporal;
- modificadores de heróis, aplicados somente quando a competência for pertinente;
- chave de histórico e contador de ocorrências, necessários para progressão de eventos recorrentes.

Os campos e nomes acima são uma proposta de contrato de dados; adaptar ao padrão real do motor após inspecionar a implementação.

## Regras para heróis e balanceamento

- Heróis aumentam capacidade de detecção, prevenção, coordenação ou resposta; não tornam a equipe imune a crises.
- Bônus só se aplicam quando houver relação explícita entre competência e evento.
- Não somar bônus ilimitados: definir limites, ordem de aplicação e duração.
- Eventos externos podem exceder a capacidade de controle da empresa; a pontuação deve valorizar escolhas responsáveis e adaptação, não a eliminação de toda adversidade.
- Não premiar receita/produtividade quando a escolha implicar negligência de saúde, segurança ou dignidade.
- Avaliar efeitos imediatos e acumulados em vários ciclos, incluindo orçamento, segurança, saúde, cooperação, qualidade e continuidade operacional.

## Critérios de aceite para implementação

1. Os 19 eventos ficam catalogados por ID e categoria e podem ser carregados pelo motor sem lógica duplicada na UI.
2. Probabilidade, gravidade, duração, prevenção, mitigação e efeitos são configuráveis.
3. O sistema registra evento, escolha, custo, resultado e riscos remanescentes no histórico.
4. As intervenções prévias alteram risco/impacto apenas quando houver regra explícita e testável.
5. A epidemia mantém contador por campanha e aplica taxas-base de 25%, 40% e 60% nas ocorrências 1, 2 e 3+.
6. A mitigação de epidemia não remove automaticamente todos os afetados nem elimina a necessidade de continuidade segura.
7. Testes cobrem equipes pequenas, arredondamento, limite de pessoas, recorrência, duração, mitigação, orçamento e persistência.
8. A UI distingue parâmetros fictícios de fatos reais e não exibe a taxa de epidemia como previsão epidemiológica.
9. Nenhum evento penaliza moralmente os trabalhadores nem transforma o score coletivo em diagnóstico.
10. Testes automatizados e validação manual desktop/mobile devem ser executados antes de considerar a implementação concluída.

## Próximas etapas técnicas

1. Inspecionar o motor atual (src/psychosocial-simulation.js), a interface e os testes antes de escolher a integração.
2. Criar o esquema de dados dos eventos e testes unitários.
3. Implementar seleção de eventos com probabilidade/duração configuráveis e histórico por campanha.
4. Implementar primeiro a epidemia como caso de recorrência, depois migrar os demais eventos para o mesmo contrato.
5. Integrar UI de evento e escolhas, mantendo acessibilidade e estado anterior/posterior.
6. Executar testes e revisar a documentação e o backlog com resultados reais.
