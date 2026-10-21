# Economia, produtividade e sustentabilidade financeira — Pilha Game NR1

**Status:** especificação de gameplay para backlog e prototipagem. Todos os valores de produtividade, custos, efeitos e multiplicadores são parâmetros fictícios ajustáveis; não representam produtividade ou custo real de trabalhadores.

## Objetivo de design

O jogador administra uma empresa com caixa inicial limitado e obrigações recorrentes. Precisa manter a entrega, pagar salários e custos mensais, contratar quando necessário, financiar melhorias e responder a eventos adversos. A empresa pode ter lucro e ainda assim deteriorar suas condições de trabalho; também pode investir em saúde e segurança de modo sustentável sem maximizar o lucro imediato.

A economia deve criar escolhas com consequências no curto, médio e longo prazo. Não deve premiar jornadas inseguras, intensificação contínua, ocultação de adoecimento nem redução de controles essenciais para fechar o caixa.

## 1. Recursos financeiros e ciclos

O modelo deve separar:
- **Caixa disponível:** saldo utilizável no início de cada ciclo.
- **Entrega produzida:** valor simulado de trabalho/serviço realizado no período.
- **Receita reconhecida/recebida:** receita faturada ou recebida, que pode ter defasagem em relação à entrega.
- **Custos fixos mensais:** salários, encargos/custos contratuais configurados, infraestrutura, licenças, aluguel e demais compromissos.
- **Custos variáveis:** insumos, manutenção, logística, retrabalho e custos por demanda.
- **Investimentos:** intervenções no ambiente, tecnologia, segurança, capacidade e desenvolvimento.
- **Custo de contratação:** recrutamento/seleção, integração e demais custos iniciais configurados.
- **Resultado operacional:** receitas menos custos operacionais no período.
- **Lucro/prejuízo acumulado:** resultado agregado ao longo dos ciclos.
- **Reserva/risco de liquidez:** sinaliza quando o caixa não cobre obrigações próximas.

Não misturar caixa, lucro e orçamento de investimento como se fossem o mesmo indicador. Uma empresa pode apresentar lucro simulado e não ter caixa suficiente na data de vencimento de uma conta.

## 2. Produção monetária por funcionário e por setor

Como valor inicial de prototipagem, uma pessoa trabalhando em condições simuladas saudáveis gera **R$ 10 por dia** de valor de entrega no setor de referência. É uma unidade fictícia para testar a mecânica, não uma estimativa de produtividade humana real.

- O valor diário-base deve ser configurável por setor.
- O valor individual pode variar conforme nível do cargo, senioridade/competência e complexidade da atividade, usando parâmetros explícitos e limitados.
- Cada setor pode ter valor econômico-base diferente por funcionário, conforme o tipo de entrega e a estrutura de receita da missão.
- As condições de trabalho afetam a capacidade de entrega de modo gradual, contextual e reversível; não transformam a pessoa em culpada pelo resultado.
- Separar valor gerado de receita efetivamente reconhecida/recebida.
- Considerar turnos, dias ativos, ausências e capacidade disponível sem contar a mesma pessoa duas vezes.

### Curva inicial de exemplo (parâmetros de protótipo)

| Condição simulada | Fator inicial | Exemplo sobre base de R$ 10/dia |
|---|---:|---:|
| Condições saudáveis e trabalho sustentável | 1,00 | R$ 10,00 |
| Condição instável / fricções moderadas | 0,85 | R$ 8,50 |
| Condição de adoecimento moderada | 0,70 | R$ 7,00 |
| Condição grave ou capacidade reduzida | 0,50 ou menos | R$ 5,00 ou menos |
| Ausência/afastamento temporário | 0,00 de entrega direta no período | R$ 0,00 |

A tabela é uma configuração inicial para balanceamento, não uma função clínica nem um diagnóstico. Os resultados decorrem de condições de trabalho, desenho do processo, contexto e capacidade disponível. Evitar usar um único score médio para calcular tudo: considerar setor, gravidade, duração e intervenções, com limites para impedir efeitos extremos inesperados.

### Exemplo de diferenciação por setor e cargo

Fórmula simples, configurável e auditável:

`valor_diario = base_setor × fator_cargo × fator_condicoes × fator_capacidade`

- `base_setor`: valor-base econômico da entrega por pessoa/dia naquele setor.
- `fator_cargo`: multiplicador limitado por nível/cargo, baseado no modelo de cargos já existente.
- `fator_condicoes`: efeito simulado das condições relevantes de trabalho, sem equivaler a diagnóstico.
- `fator_capacidade`: considera tempo ativo, disponibilidade e interrupções.
- Aplicar tetos/pisos configuráveis e registrar como o valor foi calculado.

Não presumir que cargos mais altos são sempre mais produtivos nem que toda atividade de maior valor deve receber prioridade social. O multiplicador reflete o modelo econômico fictício da missão, não o valor humano do profissional.

## 3. Entrega e nível de serviço

Cada missão/setor deve definir uma meta de entrega por dia ou ciclo. O jogador acompanha:
- entrega planejada versus realizada;
- receita potencial versus efetivamente reconhecida;
- backlog de pedidos e atrasos;
- qualidade/retrabalho;
- capacidade disponível por setor;
- custos e margem de contribuição;
- efeitos acumulados na saúde, segurança, cooperação e retenção.

Se a entrega ficar abaixo da meta, consequências configuráveis podem incluir atraso de recebimento, penalidade contratual, perda de confiança do cliente ou demanda futura menor. Isso depende do contrato e da missão. Aceitar mais demanda do que a capacidade sustentável pode aumentar receita de curto prazo, mas também sobrecarga, erros, afastamentos e custo futuro.

## 4. Contas mensais e contratação

A contratação não é gratuita nem gera receita instantânea sem custo. Reutilizar os parâmetros já definidos na mecânica de contratação/proposta de trabalho, quando existentes:
- cargo/setor e competências;
- faixa salarial/proposta e expectativa do candidato;
- nível/experiência e compatibilidade com a função;
- custo mensal recorrente;
- custo inicial de recrutamento/seleção e integração, se configurado;
- prazo de preenchimento da vaga;
- data de início e disponibilidade real para produzir;
- risco de aceite/saída conforme proposta e condições de trabalho.

O motor financeiro deve reutilizar os dados de contratação existentes em vez de criar uma segunda tabela conflitante de salários ou de aceite. Se faltar um parâmetro, documentar o padrão provisório e deixá-lo configurável.

No fechamento de cada mês simulado:
1. calcular entregas e receitas do período;
2. registrar custos variáveis e investimentos;
3. pagar obrigações recorrentes conforme a regra temporal definida;
4. incluir o custo de novas contratações e o início do salário no período correto;
5. atualizar caixa, resultado acumulado, contas pendentes e previsões;
6. verificar se o saldo cobre compromissos próximos;
7. apresentar resumo explicável e itens que exigem decisão.

A periodicidade deve ser consistente: se um ciclo equivale a um dia, acumular dias até o fechamento mensal; não cobrar salário mensal integral a cada dia. Definir tratamento para contratações no meio do mês, afastamentos, saídas e ciclos incompletos.

## 5. Escolhas e trade-offs

O jogador pode:
- contratar para reduzir gargalos, sabendo que aumentará custos recorrentes;
- ajustar proposta salarial e condições para buscar aceite dentro dos limites do orçamento;
- adiar/fasear investimentos não críticos quando houver restrição de caixa;
- proteger controles críticos de saúde e segurança mesmo sob pressão financeira;
- rever prazos, escopo e prioridades em vez de transferir toda a pressão à equipe;
- investir em prevenção, ergonomia, sistemas, treinamento contextualizado e redesenho do trabalho;
- manter reserva de caixa para eventos adversos;
- reduzir custos com eficiência real (menos retrabalho, falhas e desperdício), não apenas intensificando o trabalho.

Cada opção deve exibir custo imediato e recorrente, impacto esperado, incerteza, prazo para efeito e riscos remanescentes.

## 6. Integração com eventos adversos

Os eventos do catálogo podem alterar receitas, custos, capacidade, demanda e caixa:
- inflação: eleva custos configurados e pode pressionar poder de compra;
- juros altos: elevam o custo do crédito e podem adiar investimentos;
- custo de vida elevado: pode afetar satisfação/retensão simuladas e tornar a remuneração menos atrativa;
- epidemia: reduz temporariamente a disponibilidade e pode elevar custo de contingência;
- falha de sistema/equipamento: diminui entrega, aumenta retrabalho ou exige reparo;
- pico de demanda: cria receita potencial, mas pode elevar custos e riscos;
- saída de pessoa-chave: reduz capacidade até reposição ou redistribuição sustentável.

Evitar aplicar duas vezes o mesmo efeito quando um evento já modificou a capacidade ou o custo. Cada impacto deve ter origem identificável no histórico.

## 7. Regras de equidade e ética

- Saúde, segurança e dignidade são restrições do sistema, não variáveis sacrificáveis para maximizar lucro.
- Não permitir produção normal forçada durante afastamento.
- Não transformar score psicossocial em coeficiente clínico nem avaliação real de desempenho individual.
- Não atribuir a uma pessoa a responsabilidade por perda de entrega decorrente de condições estruturais, falta de recursos, risco não controlado ou decisão gerencial.
- Não premiar ocultação de acidentes, adoecimento ou afastamentos.
- Setores podem ter diferentes valores econômicos, mas a interface não deve sugerir que alguns trabalhadores têm maior valor humano.
- Se a empresa ficar insolvente, oferecer escolhas realistas sem remover salvaguardas críticas.

## 8. Critérios de aceite

1. Valor-base configurável de R$ 10 por funcionário/dia no setor de referência em condições sustentáveis.
2. Fatores configuráveis por setor, nível de cargo, condições de trabalho e capacidade, com limites e explicação.
3. Separação entre entrega produzida, receita reconhecida, lucro/prejuízo e caixa disponível.
4. Custos mensais recorrentes e custos iniciais de contratação contabilizados no período correto.
5. Reutilização dos parâmetros de contratação/proposta existentes, sem duplicação conflitante.
6. Meta de entrega e backlog comparados por setor e período.
7. Efeitos de adoecimento/ausência contextualizados, não diagnóstico nem culpa individual.
8. Eventos adversos afetam economia e capacidade com registro de origem e sem duplicidade.
9. Restrições críticas de saúde e segurança permanecem protegidas sob pressão financeira.
10. Testes cobrem passagem de dia/mês, contratação no meio do ciclo, ausência, rotatividade, caixa insuficiente, custos recorrentes, receita atrasada e persistência.
11. Resumo financeiro compreensível, acessível e responsivo em mobile/desktop.

## 9. Plano de implementação

1. Inspecionar mecânica atual de contratação, proposta, salários e setores; mapear campos reutilizáveis.
2. Definir contrato de dados financeiro e relógio de simulação (dia/ciclo/mês).
3. Implementar cálculo isolado de produção/entrega por setor e colaborador.
4. Implementar livro-caixa e fechamento mensal com testes unitários.
5. Conectar contratação existente sem alterar suas regras de aceite sem validação.
6. Conectar eventos adversos à capacidade, custos e receita sem duplicar efeitos.
7. Construir UI de resumo: caixa, receita, custos, resultado, entrega e obrigações futuras.
8. Testar cenários normais, crise, caixa insuficiente, crescimento e recuperação; documentar resultados reais.
