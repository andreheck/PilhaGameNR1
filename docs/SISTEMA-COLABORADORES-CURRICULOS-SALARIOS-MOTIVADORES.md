# Sistema de colaboradores, competências, remuneração e contexto socioeconômico

**Status:** especificação funcional para implementação futura no PilhA+ Game.
**Natureza:** simulação educativa; perfis, salários e efeitos começam como parâmetros fictícios configuráveis, não dados empíricos nem avaliação psicológica validada.

## 1. Objetivo
Criar um catálogo de candidatos contratáveis como currículos de personagens. Cada perfil inclui competências, experiência, expectativas salariais, região de origem, deslocamento, motivadores e necessidades de suporte. O desempenho pode variar conforme função, setor, cultura, recursos e políticas ativas.

A seleção não deve reduzir a pessoa à região ou classe social. A região informa contexto estrutural — mobilidade, custo de vida e acesso a serviços — enquanto competências, experiência e compatibilidade devem ser avaliadas individualmente.

## 2. Matriz de arquétipos
Cada região de origem do mapa terá quatro arquétipos-base:
1. Operacional: execução prática, logística ou operação de equipamentos.
2. Técnico: conhecimento específico, ferramentas, análise ou manutenção.
3. Administrativo: organização, comunicação e processos.
4. Gestor: liderança em área operacional, técnica ou administrativa.

Os três primeiros perfis existirão em cada uma das três regiões (alto padrão, classe média e morro/favela): 9 combinações. Somam-se três possibilidades de gestor, uma para cada área funcional, totalizando 12 arquétipos de referência expansíveis em personagens únicos.

Arquétipos não são estereótipos. A região não determina competência, ética, produtividade, saúde mental ou potencial de liderança. Variar atributos dentro de cada combinação.

## 3. Currículo individual
Cada personagem terá: identificação fictícia e modelo 3D disponível; região de origem; família profissional e área; competências com níveis; experiência e formação pertinente; compatibilidade com setores; lacunas e necessidades de integração/treinamento; três faixas salariais; desempenho-base por tarefa e curva de aprendizagem; motivadores individuais; tempo e custo estimado de deslocamento; satisfação, carga percebida, fadiga e humor de jogo; histórico de mudanças de setor, salário, benefícios, treinamento, ambiente e políticas; acessibilidade e acomodação razoável sem penalização automática.

Não usar saúde mental, raça, religião, orientação sexual, deficiência ou condição socioeconômica como filtro de contratação. Fatores psicossociais orientam prevenção e desenho do trabalho, não discriminação individual.

## 4. Compatibilidade e desempenho por setor
A adequação considera, com pesos configuráveis: competências exigidas; experiência relevante; recursos e clareza de função; integração, treinamento e apoio da liderança; carga, ergonomia e condições ambientais; cultura, segurança psicológica e gestão; deslocamento e descanso; remuneração e benefícios frente às expectativas; motivadores atendidos ou frustrados.

Desempenho não é atributo fixo. A mesma pessoa pode ter resultados diferentes em setores diferentes e melhorar com treinamento, ferramentas, acessibilidade, liderança e ambiente adequados. Explicar ao jogador os fatores que contribuíram para cada resultado; evitar pontuação opaca de valor humano.

## 5. Três faixas salariais por personagem
Cada pessoa terá faixas baixa, média e alta, configuradas individualmente. Baixa representa a faixa inferior da expectativa ou mínimo aceitável; média, expectativa de referência; alta, faixa superior que pode aumentar atratividade ou retenção. Os valores ficam em configuração editável e devem ser balanceados; não inventar salários de mercado.

| Faixa oferecida | Efeito simulado inicial |
|---|---|
| Baixa, ainda aceitável | Economia imediata; pode reduzir satisfação, atratividade ou retenção se houver desequilíbrio entre remuneração, esforço e expectativa. |
| Média | Referência de equilíbrio entre orçamento, expectativa e retenção. |
| Alta | Maior custo; pode elevar atratividade, reconhecimento percebido e retenção, sem garantir desempenho superior. |

Os efeitos dependem do perfil e contexto, não são automáticos nem iguais para todos. Salário alto não compensa assédio, insegurança ou sobrecarga; salário baixo não é causa única de adoecimento.

Separar: salário oferecido; custo total do empregador; mínimo aceitável; expectativa; justiça salarial percebida; satisfação com remuneração; orçamento/margem; probabilidade simulada de aceitar e risco de saída.

## 6. Custo de vida, origem e deslocamento
Reutilizar docs/MAPA-MUNDO-MOBILIDADE-CUSTO-VIDA.md. Parâmetros iniciais fictícios por trecho: alto padrão/passarela 10 min; classe média/Uber ou via expressa 15–30 min; morro/favela/metrô 45 min, táxi 30–45 min, rodoviária/ônibus 1–2 h.

Guardar mínimo, máximo e padrão; calcular ida e volta, horas semanais e custo mensal. Não restringir o modal apenas pela região: disponibilidade, orçamento e infraestrutura definem opções. O contexto pode influenciar tempo livre, fadiga, pontualidade e pressão financeira gradualmente, com variabilidade individual. Investimentos públicos podem reduzir barreiras sem exigir mudança de bairro.

## 7. Motivadores e influências
Cada pessoa pode ter 2–4 motivadores com intensidade configurável: reconhecimento e feedback justo; autonomia; aprendizagem e progressão; estabilidade; remuneração e benefícios; propósito; pertencimento e segurança psicológica; condições físicas e equilíbrio de rotina; confiança na liderança e clareza.

Motivadores só são ativados por intervenções compatíveis: reconhecimento, plano de desenvolvimento, formação, mudança de liderança, ergonomia, flexibilidade possível, benefícios, escuta, política antiassédio. A resposta é individual e probabilística, não universal.

## 8. Políticas e intervenções
Políticas possíveis: equidade/transparência salarial; benefícios e apoio à mobilidade; treinamento; prevenção de assédio/discriminação; segurança psicológica e participação; ergonomia/acessibilidade; temperatura, ruído, iluminação, altura e confinamento; jornada, pausas e dimensionamento; acesso responsável a saúde e psicologia; formação de gestores e comunicação.

Cada ação registra estado anterior, custo, mudança, personagens/setores afetados, efeito imediato, hipótese para 30 dias, resultado observado na simulação e reversibilidade. Distinguir previsão estimada de resultado observado.

## 9. Modelo de dados sugerido
Exemplo de perfil (valores ilustrativos, salários e custo não preenchidos):
```json
{
  "employeeId": "candidate-ops-01",
  "originRegion": "classe_media",
  "jobFamily": "operacional",
  "sectorFit": {"operacoes": 0.8, "administrativo": 0.45, "tecnologia": 0.35},
  "competencies": [{"id": "process_execution", "level": 3}, {"id": "safety_routines", "level": 2}],
  "experienceYears": 3,
  "salaryBands": {
    "low": {"monthly": null, "acceptable": true},
    "medium": {"monthly": null, "acceptable": true},
    "high": {"monthly": null, "acceptable": true}
  },
  "commute": {"mode": "uber", "minMinutesOneWay": 15, "maxMinutesOneWay": 30, "defaultMinutesOneWay": 22.5, "monthlyCostCredits": null},
  "motivators": [{"id": "recognition", "strength": 0.7}, {"id": "learning", "strength": 0.8}, {"id": "stability", "strength": 0.6}],
  "workState": {"satisfaction": 60, "perceivedLoad": 50, "wellbeing": 60, "mood": "neutro"},
  "notes": {"kind": "fictional_game_data", "notClinicalAssessment": true}
}
```
Escalas de exemplo: indicadores 0–100 e competências 1–5, configuráveis. Campos desconhecidos permanecem nulos, não zero silencioso.

## 10. Ciclo de simulação
1. Jogador consulta a vaga e exigências da função.
2. Compara currículos com compatibilidade explicada, pontos fortes e desenvolvimento necessário.
3. Escolhe candidato, setor, faixa salarial e integração.
4. Sistema calcula custo e aceitação simulada, sem efeitos determinísticos por classe social.
5. Políticas e investimentos alteram condições e podem ativar motivadores relacionados.
6. Personagem atualiza humor/rotina com feedback visual e evento no HUD.
7. Em checkpoints, como 7 e 30 dias, apresentar estimativas e resultados simulados com causas, incerteza e histórico.
8. Permitir comparar a mesma pessoa em condições diferentes para demonstrar a influência do ambiente e da gestão.

## 11. Persistência e testes
Persistir catálogo, contratações, salário oferecido, setor, políticas, intervenções, indicadores, eventos e histórico, usando o mecanismo central existente sem duplicar armazenamento.

Testes automatizados: 12 arquétipos-base; três faixas por pessoa; valores nulos não viram zero silenciosamente; contratação respeita orçamento; compatibilidade varia por setor; competências, experiência, integração e ambiente têm efeitos explicáveis; região não determina competência/humor/desempenho; políticas ativam motivadores relacionados; transporte calcula ida/volta, semana e mês; estado sobrevive a reload; previsões de 30 dias ficam identificadas como estimativas.

## 12. Critérios de aceite
- Catálogo navegável de currículos individuais.
- 12 arquétipos-base, expansíveis em personagens distintos.
- Seleção baseada em competências e compatibilidade, não estereótipos.
- Três faixas salariais editáveis por personagem, com efeitos distintos e explicados.
- Mobilidade e custo de vida integrados ao mapa e tempo disponível.
- Motivadores conectados a políticas e mudanças ambientais.
- Reações visuais e de humor no mesmo escritório 3D.
- Persistência e testes automatizados passando.
- Agente seguinte revisa arquitetura e testa antes de merge ou publicação.