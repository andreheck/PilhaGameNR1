# Simulador de Propostas de Trabalho — PilhA+ Game

**Status:** especificação de produto; não declarar implementação concluída até que exista código funcional e testes de aceitação.

## 1. Relação com o produto

O Simulador de Propostas de Trabalho é um módulo do **PilhA+ Game**, mantido no repositório próprio `andreheck/PilhaGameNR1`. Ele não faz parte do repositório principal `pilha-plus-app` e deve evoluir como módulo do Game, compartilhando identidade visual e conceitos de gamificação quando adequado.

O propósito é explorar como salário, benefícios e condições de trabalho compõem uma proposta e como diferentes configurações podem afetar a atratividade e a experiência do candidato. O simulador deve apoiar reflexão e planejamento, não prometer resultados individuais nem substituir pesquisa de mercado ou julgamento humano.

## 2. Objetivo da experiência

Permitir que a pessoa usuária configure uma oferta, altere componentes da proposta e compare cenários para compreender trade-offs entre competitividade, custo e condições de trabalho.

### Capacidades previstas

- Criar e editar uma proposta de trabalho.
- Aumentar ou diminuir opções/componentes da oferta dentro de limites configuráveis.
- Comparar a proposta com um intervalo de referência (*range*) dividido em faixas **baixa, média e alta**.
- Mostrar em qual faixa a proposta se encontra e quais componentes contribuem para essa posição.
- Configurar benefícios e condições de trabalho para comparar cenários alternativos.
- Apresentar um resumo comparativo de cenários e suas premissas.
- Integrar progressão, feedback e identidade visual do PilhA+ Game quando isso melhorar a experiência, sem transformar pessoas em pontuações simplistas.

## 3. Componentes configuráveis

A configuração deve permitir, conforme o modelo de dados que vier a ser aprovado:

- remuneração fixa e variável;
- benefícios monetários e não monetários;
- flexibilidade e condições de jornada;
- desenvolvimento, formação e oportunidades de crescimento;
- outras condições relevantes da proposta, com campos e limites configuráveis.

Os itens acima são categorias candidatas de produto; a lista final, suas unidades e regras ainda precisam ser definidas. Não inventar valores de mercado ou faixas sem fonte, região, ocupação e data de referência.

## 4. Indicadores e cenários

O briefing inicial prevê estimar e comparar possíveis impactos de cada configuração em:

- atratividade/aceitação da proposta;
- permanência e retenção;
- risco de adoecimento;
- acidentes;
- afastamentos;
- felicidade/bem-estar;
- motivação.

Esses indicadores não devem ser apresentados como efeitos causais comprovados. Antes de exibir previsões numéricas, cada indicador precisará de definição operacional, fonte de dados, população de referência, horizonte temporal, método de cálculo, incerteza e plano de validação. Se a evidência não for suficiente, apresentar cenários qualitativos ou indicar explicitamente que a estimativa está indisponível.

## 5. Faixas baixa, média e alta

A interface deverá:

1. mostrar o intervalo de referência utilizado e sua origem;
2. identificar as faixas baixa, média e alta;
3. posicionar a proposta atual no intervalo, se houver dados comparáveis suficientes;
4. permitir comparar alternativas sem sugerir que uma faixa garante aceitação ou permanência;
5. registrar a data, região, família ocupacional e critérios do benchmark.

A definição numérica dos limites está pendente. Eles não devem ser codificados como constantes arbitrárias nem ser tratados como universais para todas as funções ou regiões.

## 6. UX e gamificação

- Manter linguagem clara, não punitiva e não determinista.
- Explicar por que a alteração de um componente mudou a comparação.
- Comparar cenários lado a lado.
- Usar o robô e a linguagem visual do PilhA+ Game como guias de interação, sem atribuir ao personagem autoridade científica.
- Diferenciar dados informados, benchmarks externos e simulações.
- Oferecer estados vazios e exemplos demonstrativos claramente identificados como fictícios.
- Projetar para desktop e dispositivos móveis e considerar acessibilidade por teclado, contraste, leitores de tela e redução de movimento.

## 7. Ética, privacidade e uso responsável

- Não usar o simulador para inferir características psicológicas ou clínicas de candidatos.
- Não produzir ranking automatizado de candidatos nem recomendar rejeição de pessoas.
- Não representar adoecimento, acidente ou afastamento como destino individual de um candidato.
- Evitar discriminação direta ou indireta e revisar variáveis que possam funcionar como proxies de características protegidas.
- Minimizar dados pessoais; usar dados agregados e benchmarks legítimos sempre que possível.
- Exibir limitações, incertezas e fontes de forma compreensível.
- Exigir revisão humana antes de qualquer decisão real.
- Submeter o desenho a revisão de privacidade, jurídica, ética e de acessibilidade antes de uso organizacional real.

## 8. Critérios de aceite propostos

- A pessoa usuária consegue configurar e editar uma proposta.
- O intervalo e as faixas baixa/média/alta são exibidos apenas quando existe benchmark válido e rastreável.
- A alteração de cada campo recalcula a comparação de forma reproduzível.
- Cenários podem ser comparados sem perder a configuração original.
- Dados fictícios são identificados como demonstração.
- Cada indicador tem definição, fonte, método e limitação documentados; indicadores sem evidência não recebem valores inventados.
- A interface distingue claramente dados observados, benchmarks e estimativas.
- Testes cobrem limites, dados ausentes, combinações inválidas, acessibilidade e responsividade.
- Nenhum dado de candidato é enviado ou persistido sem finalidade, consentimento/base legal e controles definidos.

## 9. Etapas de desenvolvimento

1. **Descoberta:** definir público, jornada, cenário de uso e problema principal.
2. **Modelo de proposta:** aprovar campos, unidades, regras de edição e validações.
3. **Benchmark:** identificar fontes de mercado por região/ocupação e definir metodologia de faixas.
4. **Protótipo visual:** criar a experiência de configuração e comparação usando dados demonstrativos.
5. **Motor de simulação:** implementar somente regras justificadas e versionadas; manter indicadores sem evidência fora de previsões numéricas.
6. **Validação:** testar compreensão, acessibilidade, vieses, segurança e consistência dos cálculos.
7. **Integração ao Game:** conectar navegação, identidade visual e progressão sem acoplar o módulo ao aplicativo principal PilhA+.
8. **Liberação controlada:** publicar somente após revisão de qualidade, privacidade e transparência.

## 10. Decisões ainda abertas

- Nome e identidade final do módulo.
- Campos obrigatórios e opcionais da proposta.
- Unidade e metodologia para as faixas de referência.
- Fontes e atualização dos benchmarks.
- Se os impactos serão inicialmente qualitativos ou quantitativos.
- Como representar incerteza e qualidade dos dados.
- Persistência local ou backend, papéis de acesso e política de retenção.
- Como a progressão do Game será conectada ao simulador.
- Critérios de validação com profissionais de recrutamento e pessoas candidatas.

## 11. Relação com o PilhA+ App

O simulador pertence ao **PilhA+ Game**, que é um projeto separado do aplicativo principal de autocuidado e bem-estar. Não importar dados biométricos, psicométricos ou clínicos do PilhA+ App para pontuar candidatos. Qualquer integração futura exige finalidade explícita, arquitetura, autorização e revisão de privacidade próprias.
