# Mapa do mundo PilhA+ Game — mobilidade, serviços e custo de vida

**Status:** especificação de design para protótipo; valores são premissas fictícias do jogo, não dados empíricos de uma cidade real.  
**Branch:** `feat/investment-psychosocial-domains`

## Objetivo
Criar um mapa costeiro legível e modular, com poucos edifícios únicos, separados e bem definidos para futura modelagem 3D. As áreas devem ser reconhecíveis à distância e ligadas por ruas, rodovias, transporte público e caminhos pedonais. O mapa é um sistema de simulação socioespacial: localização residencial, tempo de deslocamento e acesso a serviços influenciam custo de vida, fadiga, tempo disponível, humor e risco psicossocial.

## Macrozonas e conteúdo

1. **Moradias — lado esquerdo do mapa, em três faixas**
   - **Alto padrão:** casas e condomínios com terrenos amplos, no trecho inferior/lateral em frente ao mar. Poucas casas, cada uma com silhueta e lote distintos.
   - **Classe média:** apartamentos populares de altura baixa/média, na faixa central esquerda. Blocos separados, com espaços públicos e acessos visíveis.
   - **Morro e favela:** moradias precárias agrupadas no canto superior esquerdo, em encosta. Distinguir visualmente a topografia e a densidade, sem estereótipos de pessoas.

2. **Área médica e comunitária — parte superior/central**
   - Hospital, UPA, clínicas médicas, clínica de psicologia, bombeiros e catedral.
   - NA e AA representados como pequenas casas comunitárias (não como grandes hospitais).
   - Comunidade Terapêutica (CT), CAPS AD e farmácia de pequeno comércio.
   - Os edifícios devem ser individuais, sinalizados e acessíveis por vias claras.

3. **Centro comercial — zona própria, distinta do parque**
   - Shopping, banco, mercado público e estádio de futebol.
   - Feira e pequeno parquinho urbano associados à praça comercial.
   - Não confundir este espaço cívico/comercial com o parque ecológico e a lagoa.

4. **Parque e lagoa — zona verde recreativa separada**
   - Lagoa, caminhos pedonais, árvores e pequenas áreas de descanso. Não ocupar a área operacional do porto.

5. **Empresa — setor administrativo**
   - Prédio administrativo da empresa na zona central do mapa, acima da operação logística e portuária.
   - Deve ter identidade visual própria e conexão viária direta com o setor operacional.

6. **Operação logística e portuária**
   - Armazéns, pátios de contêineres, docas, guindastes e circulação de veículos, abaixo da área administrativa.
   - Porto, molhe e praia na borda inferior junto ao mar. Manter o terminal e a praia visualmente distintos, embora próximos.

## Estações de acesso por bloco residencial

Distribuir **três pontos/estações de transporte em frente a cada bloco de moradia**, próximos às saídas e ligados à rede viária. A tabela define tempos de referência do cenário do jogo para chegar ao trabalho (não são previsões reais):

| Perfil residencial | Modal/estação | Tempo de referência até o trabalho |
|---|---|---:|
| Alto padrão | Passarela / percurso pedonal | 10 min |
| Classe média | Uber | 15–30 min |
| Classe média | Via expressa | 15–30 min |
| Morro e favela | Metrô | 45 min |
| Morro e favela | Táxi | 30–45 min |
| Morro e favela | Rodoviária / ônibus interurbano | 1–2 h |

Os tempos fornecidos para a classe média e para o morro/favela são intervalos ou estimativas de jogo. Para os cálculos, usar respectivamente 22,5 min, 22,5 min, 45 min, 37,5 min e 90 min como valores médios iniciais, mantendo também o intervalo original para exibição. Não inferir que moradores de uma classe só podem usar determinado modal: as estações são opções contextuais e podem ser desbloqueadas/acessadas por personagens conforme cenário e orçamento.

## Uso nos fatores psicossociais e custo de vida

Persistir os dados como **parâmetros de cenário**. Não rotular pessoas nem inferir saúde mental a partir da classe social. O jogo deve avaliar condições estruturais e escolhas de mobilidade:

- **Tempo diário de deslocamento:** somar ida e volta; considerar dias de trabalho por semana.
- **Carga de deslocamento:** maior tempo pode reduzir descanso, lazer, sono e disponibilidade para cuidado; representar como efeito potencial, não diagnóstico automático.
- **Custo de transporte:** valor em créditos do jogo configurável por modal; manter os custos como parâmetros editáveis até definir uma economia equilibrada.
- **Acesso a serviços:** calcular proximidade/tempo de acesso a saúde, saúde mental, alimentação, lazer e apoio comunitário.
- **Indicadores influenciados:** tempo livre, pressão financeira, fadiga, bem-estar, carga percebida e risco de insatisfação/rotatividade. Mudanças devem ser graduais e transparentes.
- **Equidade:** permitir que investimentos públicos em transporte e serviços reduzam desigualdades de acesso sem exigir mudança de moradia do personagem.

### Fórmulas iniciais sugeridas

- `commute_round_trip_minutes = 2 * commute_one_way_minutes`
- `weekly_commute_hours = commute_round_trip_minutes * workdays_per_week / 60`
- `monthly_transport_cost = daily_transport_cost * workdays_per_month`

Valores padrão sugeridos para protótipo: 5 dias de trabalho por semana e 22 dias por mês, ambos configuráveis. O tempo de deslocamento e custo de transporte devem ser parâmetros separados; não criar preços monetários sem decisão de design.

## Dados iniciais (exemplo de configuração)

```json
{
  "mapVersion": 1,
  "residentialProfiles": {
    "alto_padrao": {
      "label": "Alto padrão",
      "stations": [
        {"mode": "passarela", "label": "Passarela", "minMinutes": 10, "maxMinutes": 10, "defaultMinutes": 10}
      ]
    },
    "classe_media": {
      "label": "Classe média",
      "stations": [
        {"mode": "uber", "label": "Uber", "minMinutes": 15, "maxMinutes": 30, "defaultMinutes": 22.5},
        {"mode": "via_expressa", "label": "Via expressa", "minMinutes": 15, "maxMinutes": 30, "defaultMinutes": 22.5}
      ]
    },
    "morro_favela": {
      "label": "Morro e favela",
      "stations": [
        {"mode": "metro", "label": "Metrô", "minMinutes": 45, "maxMinutes": 45, "defaultMinutes": 45},
        {"mode": "rodoviaria", "label": "Rodoviária / ônibus", "minMinutes": 60, "maxMinutes": 120, "defaultMinutes": 90},
        {"mode": "taxi", "label": "Táxi", "minMinutes": 30, "maxMinutes": 45, "defaultMinutes": 37.5}
      ]
    }
  },
  "workdaysPerWeek": 5,
  "workdaysPerMonth": 22,
  "transportCosts": {
    "status": "to_be_balanced",
    "currency": "credits",
    "note": "Definir valores em créditos durante balanceamento; não inventar preços."
  }
}
```

## Requisitos para implementação 3D
- Usar nove macroquadrantes como guia de composição, mas privilegiar a legibilidade espacial em vez de linhas de grade visíveis.
- Manter o mapa navegável e com corredores/rotas reais; estações de transporte devem ser objetos clicáveis com rótulo e tempo.
- Edifícios separados, poucos e distintos, evitando aglomerações que impeçam leitura ou futura modelagem.
- Cada estação mostra modal, tempo, custo configurável e efeito estimado sobre tempo livre/pressão financeira.
- A compra de melhorias de transporte/serviços deve atualizar o cenário e os indicadores em tempo real e manter estado persistente.
- Prever cenários positivo, neutro e negativo e permitir comparar antes/depois da intervenção.
- Todos os efeitos devem ser explicáveis e educativos; tempos e associações não constituem evidência clínica ou retrato de uma cidade real.

## Critérios de aceite
1. As seis opções de mobilidade acima aparecem associadas aos blocos residenciais corretos.
2. O mapa diferencia centro comercial, parque/lagoa, operação logística, porto/praia, empresa administrativa e zona médica.
3. Os tempos são visíveis e persistidos; cálculos de ida/volta e horas semanais conferem.
4. Custos de transporte permanecem configuráveis até serem balanceados.
5. Uma intervenção em transporte ou acesso a serviços recalcula indicadores e mostra o efeito visual/notificação correspondente.
6. Nenhum teste de navegador deve ser declarado concluído sem execução real e registro dos resultados.
