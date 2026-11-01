# Especificação técnica — Diversidade, Inclusão e Bônus Coletivo

**Projeto:** Pilha Game NR1  
**Versão:** 1.0 — especificação para implementação assistida pelo Codex  
**Status:** aprovada como direção de produto; rubricas e parâmetros são iniciais e devem permanecer configuráveis durante o balanceamento.  
**Branch documental:** `docs/hero-roster-beta`

> Este documento especifica comportamento esperado. Não afirma que a mecânica já esteja implementada. O Codex deve primeiro inspecionar a arquitetura existente e adaptar os nomes e pontos de integração reais, sem criar sistemas paralelos.

## 1. Objetivo

Representar no simulador a relação entre composição diversa, inclusão organizacional e resultado coletivo. A mecânica deve incentivar diversidade com equidade de oportunidades, sem sugerir que diversidade isolada garante lucro, sem transformar identidades em atributos de valor individual e sem permitir que resultados financeiros compensem violações de direitos.

A mecânica é uma abstração de gameplay informada por evidências organizacionais, não uma calculadora de ROI real nem uma previsão causal.

## 2. Conceitos e resultados

- **ID — Índice de Diversidade (0–100):** mede a diversidade da composição populacional em três dimensões.
- **FI — Fator de Inclusão (0–100):** mede práticas e resultados institucionais de acesso, progressão, representação, remuneração e permanência/pertencimento/resposta.
- **Cobertura:** proporção de integrantes com dado válido em cada dimensão demográfica exigida.
- **Bloqueio de proteção:** condição prioritária que zera o bônus quando há violação grave sem resposta institucional adequada, retaliação ou falha grave de proteção.
- **Bônus:** modificador de até 6% aplicado exclusivamente à lucratividade simulada por hora do setor.

O ID e o FI são indicadores independentes. Não calcular FI a partir do ID nem usar ID como substituto de inclusão.

## 3. Configuração central

Manter em configuração tipada e validada, sem números mágicos dispersos:

```ts
type DiversityConfig = {
  dimensionWeights: {
    raceColor: 0.40;
    socioeconomicOrigin: 0.35;
    ethnicBelonging: 0.25;
  };
  minimumCoverage: 0.80;
  smallGroupThreshold: 8;
  comparisonDenominatorMinimum: 5;
  bonusCap: 0.06;
  inclusionWeights: {
    equitableAccess: 0.25;
    progressionMobility: 0.25;
    leadershipRepresentation: 0.20;
    comparablePayEquity: 0.15;
    retentionBelongingResponse: 0.15;
  };
  inclusionRollingCycles: 3;
  enabled: boolean;
};
```

Os valores são defaults de jogo. Validar:
- pesos de ID somam 1,00;
- pesos de FI somam 1,00;
- cobertura e limite de bônus estão entre 0 e 1;
- limites de amostra são inteiros positivos;
- configuração inválida impede ativação da mecânica e gera erro legível.

Manter feature flag para desligar cálculo e aplicação do bônus durante desenvolvimento e balanceamento.

## 4. Dados e modelo

Antes de criar modelos, inspecionar o modelo atual de funcionários, heróis, setores e ciclos. Reutilizar IDs e relações existentes.

Cada integrante elegível ao universo do ID precisa ter, no ambiente ficcional, valores explícitos e não inferidos para:
- raça/cor;
- pertencimento étnico;
- origem socioeconômica/classe;
- setor atual e status no ciclo.

Os seis heróis fazem parte do universo de funcionários se estiverem vinculados a setores no modelo do jogo. Cada entidade entra uma única vez. Não duplicar herói por aparecer também em roster, equipe ou lista de personagens.

Não inferir atributos por nome, imagem, aparência, voz, endereço, profissão, bairro ou comportamento. Se o atributo ficcional não estiver definido, manter ausente e contabilizar na cobertura. Não inventar nem preencher automaticamente os dados dos heróis.

### Catálogos de categorias

Definir catálogos estáveis e documentados no domínio. Para raça/cor, usar categorias ficcionais compatíveis com as categorias brasileiras de referência quando aplicável: branca, preta, parda, amarela e indígena, além de estado explícito de não informado para controle de cobertura (não como categoria de diversidade). Pertencimento étnico é campo distinto, com catálogo coerente com a narrativa e opção de não informado. Origem socioeconômica deve derivar de contexto narrativo explicitamente atribuído, não de raça/cor ou endereço.

Atenção: raça/cor e pertencimento étnico podem se sobrepor conceitualmente. Exibir subíndices separadamente e manter essa limitação documentada; não fundir, inferir ou contar a mesma classificação duas vezes sem uma decisão de produto futura.

## 5. Cálculo do ID

Para uma dimensão com (N) integrantes válidos e (K) categorias válidas do catálogo:

`p_i = n_i / N`

`D = 1 - Σ(p_i²)`

`D_max = 1 - 1/K`

`ID_dimensão = 100 × D / D_max`

Regras:
1. Usar catálogo estável para a dimensão; não retirar categorias vazias dinamicamente para inflar a nota. Para a normalização, K é o número de categorias válidas definidas no catálogo da dimensão.
2. Se K < 2, N = 0 ou os dados forem inválidos, a dimensão é não calculável; não dividir por zero nem inventar pontuação.
3. Ausência não é categoria. Cobertura = integrantes com dado válido / total de integrantes elegíveis.
4. Se a cobertura de qualquer dimensão estiver abaixo de 80%, exibir ID observado e cobertura, mas não conceder bônus.
5. ID do setor = média ponderada dos três subíndices válidos pelos pesos 40/35/25.
6. ID da empresa deve ser calculado diretamente sobre a população total da empresa em cada dimensão, e não pela média simples ou ponderada dos IDs dos setores.
7. Para setores com menos de 8 integrantes, marcar baixa robustez e suprimir detalhamentos que possam identificar pessoas ou grupos.

### Pseudocódigo do ID

```text
function calculateDimensionIndex(members, dimension, categoryCatalog):
    eligible = members
    valid = members where dimension is an explicit valid category
    coverage = count(valid) / count(eligible)

    if count(valid) == 0 or count(categoryCatalog) < 2:
        return { status: "not_calculable", coverage }

    counts = count valid members in each catalog category
    N = count(valid)
    D = 1 - sum((count(category) / N)^2 for category in categoryCatalog)
    Dmax = 1 - 1 / count(categoryCatalog)
    score = clamp(100 * D / Dmax, 0, 100)

    return { status: "calculated", score, coverage }

function calculateSectorID(sectorMembers):
    calculate each of the three dimension indices
    if any required dimension is not calculable:
        return incomplete
    score = 0.40 * raceColor.score
          + 0.35 * socioeconomicOrigin.score
          + 0.25 * ethnicBelonging.score
    bonusEligible = every dimension coverage >= 0.80
    return { score, subindices, coverages, bonusEligible }
```

Nota: os subíndices são calculados com dados válidos da dimensão; a cobertura impede que baixa qualidade de dados produza um bônus. Não esconder baixa cobertura por meio de normalização.

## 6. Cálculo do FI

O FI é a soma ponderada de cinco componentes de 0 a 100. Se algum componente necessário estiver incompleto, o FI geral é “incompleto”; não redistribuir seu peso entre os outros componentes.

### 6.1 Acesso equitativo — 25%

Três subindicadores com pesos iguais:
- acesso à contratação: taxa de avanço entre etapas seletivas por grupo elegível;
- acesso à formação: participação proporcional em formação, bolsas e capacitações;
- acesso a projetos relevantes: participação proporcional em projetos que ofereçam visibilidade, aprendizagem ou responsabilidade.

Para cada subindicador, comparar taxas equivalentes entre grupos: `score = 100 × menor taxa / maior taxa`. Se todas as taxas forem zero, marcar “sem oportunidade observada” e não atribuir 100. Exigir denominadores válidos. Componente = média simples dos três subindicadores.

### 6.2 Progressão e mobilidade — 25%

Comparar taxas de promoção e mobilidade para funções de maior responsabilidade entre pessoas elegíveis, em janela móvel de três ciclos. Para cada indicador: `score = 100 × menor taxa / maior taxa`. Comparar apenas populações com elegibilidade e oportunidades equivalentes. Componente = média simples de promoção e mobilidade.

### 6.3 Liderança e decisão — 20%

Para cada grupo com amostra válida:
`representationRatio = groupShareInLeadership / groupShareInEligiblePopulation`

`groupScore = 100 × min(representationRatio, 1)`

Componente = média ponderada pela população elegível dos grupos válidos. Exibir também as diferenças de representação. Não exigir paridade mecânica em todo cargo sem considerar elegibilidade e contexto.

### 6.4 Equidade remuneratória — 15%

Comparar remuneração por hora em funções, níveis, jornadas e vínculos comparáveis. Para cada grupo, em relação à referência comparável:
`score = max(0, 100 - 500 × absolutePayGap)`

Gap é uma proporção decimal: 0,05 representa 5%. O limiar de 5% é provisório para balanceamento, não limite legal nem conclusão automática de discriminação. Exibir gap e tamanho de amostra. Não comparar médias brutas de cargos distintos.

### 6.5 Permanência, pertencimento e resposta — 15%

Três subindicadores:
- permanência: paridade entre taxas de retenção por grupo na janela móvel de três ciclos, usando menor taxa / maior taxa × 100;
- pertencimento: resultado agregado de pesquisa ficcional consistente, transformado para escala 0–100;
- resposta institucional: proporção de situações com acolhimento, proteção contra retaliação, apuração tempestiva e providências documentadas. Se não houver casos, avaliar prontidão dos canais e protocolos; não presumir nota 100.

Componente = média simples dos três subindicadores. Uma violação grave sem resposta adequada pode ativar bloqueio independentemente da média.

### Regras transversais do FI

- Comparações só são válidas com denominadores, períodos, elegibilidade e oportunidades comparáveis.
- Denominador inferior a 5 não gera taxa de grupo; marcar não calculável.
- Se houver menos de dois grupos comparáveis ou ausência de oportunidade, marcar não calculável.
- Não usar quantidade de denúncias como penalidade. A denúncia isolada não ativa bloqueio.
- Se FI incompleto, cobertura demográfica insuficiente ou bloqueio de proteção ativo, bônus = 0.
- As notas devem exibir indicadores brutos e contexto; razão de taxas não prova causa nem discriminação.

### Pseudocódigo do FI

```text
function calculateInclusionFactor(componentResults, config):
    if any required component is not calculable:
        return { status: "incomplete", score: null }

    assert sum(config.inclusionWeights) == 1.0

    score =
        0.25 * equitableAccess.score +
        0.25 * progressionMobility.score +
        0.20 * leadershipRepresentation.score +
        0.15 * comparablePayEquity.score +
        0.15 * retentionBelongingResponse.score

    return { status: "calculated", score: clamp(score, 0, 100) }
```

## 7. Bloqueio de proteção e bônus

O bloqueio é independente das médias e tem prioridade máxima. Ativar quando o estado narrativo do jogo indicar:
- discriminação ou assédio grave sem resposta institucional adequada;
- retaliação;
- violação grave de direitos sem proteção ou providência adequada.

Uma denúncia isolada não ativa bloqueio. O sistema deve representar resposta institucional e proteção, nunca penalizar denunciante.

Fórmulas:
`FCI = 0.30 + 0.70 × (FI / 100)`

`bonusRate = 0.06 × (ID / 100) × FCI`

Aplicar:
`effectiveBonus = 0` se feature flag desativada, cobertura abaixo de 80%, ID/FI incompletos ou bloqueio ativo. Caso contrário, `effectiveBonus = min(bonusRate, 0.06)`.

O bônus incide exclusivamente sobre a lucratividade simulada por hora do setor. Não altera remuneração, produtividade, competência, potencial, avaliação ou valor de personagens individuais.

### Exemplos de referência

| ID | FI | FCI | Bônus |
|---:|---:|---:|---:|
| 50 | 80 | 0,86 | 2,58% |
| 80 | 100 | 1,00 | 4,80% |
| 100 | 100 | 1,00 | 6,00% |
| 100 | 40 | 0,58 | 3,48% |
| qualquer | qualquer | — | 0% se bloqueado ou cobertura insuficiente |

## 8. Integração com economia

O Codex deve localizar a função real que calcula lucratividade por hora. Aplicar o modificador uma única vez, em camada de resultado coletivo do setor, evitando acumular bônus em cada funcionário ou em cada tick.

Exemplo abstrato:
```text
sectorProfitPerHourBeforeBonus = existingEconomyCalculation(sector)
diversityResult = calculateDiversityAndInclusion(sector)
sectorProfitPerHour =
    sectorProfitPerHourBeforeBonus * (1 + diversityResult.effectiveBonus)
```

A consolidação da empresa deve ponderar resultados dos setores por contribuição econômica, conforme a estrutura econômica já existente. Não somar percentuais de bônus entre setores nem calcular média simples de percentuais sem ponderação.

ID deve ser recalculado quando composição válida mudar. FI deve atualizar por ciclos de gestão, com janela móvel de três ciclos para retenção e indicadores de inclusão. Contratação individual não concede bônus instantâneo nem altera automaticamente o FI.

## 9. Contrato de resultado sugerido

Adaptar ao padrão real do projeto; não impor esta interface se a arquitetura existente tiver convenção equivalente.

```ts
type MetricStatus = "calculated" | "incomplete" | "not_calculable";

type DiversityDimensionResult = {
  status: MetricStatus;
  score: number | null;
  coverage: number;
};

type DiversityInclusionResult = {
  status: MetricStatus;
  diversityIndex: number | null;
  diversitySubindices: {
    raceColor: DiversityDimensionResult;
    socioeconomicOrigin: DiversityDimensionResult;
    ethnicBelonging: DiversityDimensionResult;
  };
  inclusionFactor: number | null;
  inclusionComponents: Record<string, {
    status: MetricStatus;
    score: number | null;
  }>;
  protectionBlocked: boolean;
  effectiveBonus: number;
  bonusCap: number;
  warnings: string[];
};
```

## 10. Painel e comunicação

Exibir no painel setorial:
- ID geral e os três subíndices;
- FI geral e seus componentes;
- cobertura de cada dimensão;
- tamanho da população e alerta de baixa robustez;
- bônus atual e teto;
- estado de bloqueio e explicação objetiva;
- indicadores brutos relevantes para contextualizar a nota.

Usar estados claros: “dados insuficientes”, “não calculável”, “baixa robustez”, “bônus bloqueado” e “bônus ativo”. Não expor recortes que permitam identificar pessoas. Não criar ranking individual ou ranking competitivo de grupos demográficos.

## 11. Matriz mínima de testes

1. Distribuição homogênea versus distribuição equilibrada.
2. Catálogo com uma, duas e várias categorias; população vazia; categoria desconhecida.
3. Dados ausentes e cobertura em 79,9%, 80% e acima de 80%.
4. Setores com 7 e 8 integrantes e supressão de recortes identificáveis.
5. Cada funcionário/herói entra uma única vez.
6. ID de empresa calculado sobre população total, distinto de média simples de setores.
7. FI nos extremos 0 e 100; pesos somam 100%.
8. Bônus 0%, intermediário e teto, incluindo todos os exemplos desta especificação.
9. Bloqueio por falha institucional grave; nenhuma penalização por denúncia isolada.
10. Contratação pontual não gera salto instantâneo.
11. Consolidação econômica ponderada por setor.
12. Nenhum atributo demográfico altera variável individual.
13. Feature flag desativa cálculo/aplicação de forma segura.
14. Regressão: economia anterior, eventos adversos, mecânicas NR-1, carreira e seis heróis continuam funcionando.

## 12. Plano de trabalho obrigatório para Codex

### Etapa A — inspeção, sem alteração de código
1. Mapear estrutura, stack, comandos de teste/build/lint e arquitetura.
2. Localizar entidades e dados de funcionários, seis heróis, setores, ciclos e economia.
3. Identificar estado atual de branch e alterações pendentes.
4. Entregar plano com arquivos reais que serão alterados, riscos e dependências.
5. Reportar lacunas de dados narrativos dos heróis; não inventar.

### Etapa B — domínio e testes
1. Implementar configuração, tipos e funções puras de ID/FI/cobertura/bloqueio.
2. Criar fixtures exclusivamente sintéticas.
3. Criar testes unitários para fórmulas e limites.
4. Executar testes existentes e novos; corrigir regressões antes de integrar interface.

### Etapa C — integração e interface
1. Integrar ao cálculo econômico coletivo do setor.
2. Criar painel e estados de explicação.
3. Implementar atualização por ciclo e janela móvel.
4. Testar privacidade, grupos pequenos, feature flag e fluxo completo.

### Etapa D — entrega
1. Executar testes, lint e build disponíveis.
2. Informar arquivos alterados, comandos executados, resultados reais e limitações.
3. Atualizar documentação com estado real: implementado, parcial ou pendente.
4. Trabalhar em branch de feature; não fazer merge na main nem apagar branches sem autorização explícita.

### Restrições

- Não criar cadastro paralelo de pessoas ou setores.
- Não modificar fichas dos seis heróis sem validação narrativa.
- Não inferir atributos demográficos.
- Não alterar regras NR-1, eventos adversos, carreira ou indicadores psicossociais para acomodar o bônus sem necessidade documentada.
- Não instalar dependências nem substituir arquitetura sem justificativa.
- Não declarar concluído se FI estiver incompleto, testes falharem ou dados dos heróis não tiverem sido validados.

## 13. Questões que permanecem para validação de produto

1. Confirmar catálogo narrativo de pertencimento étnico e origem socioeconômica.
2. Validar atributos dos seis heróis com base nas fichas aprovadas, sem inferência visual.
3. Calibrar limiar de 5% da diferença remuneratória e os demais parâmetros com cenários sintéticos.
4. Decidir quais eventos narrativos caracterizam bloqueio grave e quais ações institucionais encerram o bloqueio.
5. Testar se o teto de 6% é relevante sem dominar a economia do jogo.
6. Validar como a interface comunica sub-representação e incerteza sem transformar grupos em alvos ou objetos de ranking.

---
**Relação documental:** complementa `docs/narrativa/BIBLIA-NARRATIVA-INICIAL.md`. Em caso de divergência, decisões de produto aprovadas na Bíblia prevalecem; esta especificação detalha sua tradução técnica.
