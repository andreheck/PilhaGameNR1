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

## 13. Proposta de trabalho negociável
Além de selecionar faixa baixa/média/alta, o jogador poderá montar uma proposta com componentes ajustáveis e apresentá-la ao candidato. O sistema mostra a estimativa de aceite e a posição de cada componente em relação às preferências e aos limites do perfil.

### Componentes negociáveis
- Salário mensal, ajustável dentro dos limites do jogo e comparado visualmente às faixas baixa, média e alta.
- Benefícios configuráveis: apoio/transporte, alimentação, saúde e bem-estar, flexibilidade quando compatível com a função, descanso adicional quando permitido pelo cenário, formação, bônus, previdência ou apoio familiar.
- Jornada, turnos, previsibilidade de escala, flexibilidade e pausas, respeitando as exigências da função.
- Integração, capacitação, acompanhamento da liderança e progressão.
- Condições de trabalho: ergonomia, acessibilidade, segurança, ferramentas, clareza de papel e canais contra assédio.

Cada componente terá custo para a empresa, valor percebido pelo candidato e condições de elegibilidade. São parâmetros de jogo, não aconselhamento jurídico ou representação automática de direitos trabalhistas reais.

### Faixas e limites de negociação
Para cada candidato, configurar limites e identificar se a proposta está abaixo, dentro ou acima das faixas baixa/média/alta. Mostrar salário oferecido vs. mínimo aceitável/referência/faixa alta; valor estimado dos benefícios e pacote total (sem tratar benefício não monetário como dinheiro); custo mensal/anual para a empresa; competitividade e chance estimada de aceite; ajustes possíveis e custo incremental; alerta de oferta inviável ou abaixo do limite configurado.

Não garantir aceite apenas pelo salário. Considerar preferências, função, benefícios, deslocamento, cultura, segurança psicológica, condições físicas, liderança e alternativas fictícias. A probabilidade é uma regra de jogo configurável, com incerteza, não uma previsão real de comportamento humano.

### Indicadores impactados
Cada pacote influencia, em graus configuráveis e incertos:
- **Permanência/retenção:** chance simulada de continuar e risco de saída.
- **Adoecimento/risco psicossocial:** indicador preventivo agregado, nunca diagnóstico individual. Remuneração e benefícios não neutralizam assédio, sobrecarga ou perigo.
- **Acidentes:** risco simulado influenciado principalmente por segurança, treinamento, fadiga, jornada, equipamentos e ambiente, não atribuído simplesmente à personalidade.
- **Afastamentos:** indicador agregado estimado relacionado a carga, saúde e segurança, condições e suporte; não inferir doença individual nem penalizar quem se afasta.
- **Felicidade/bem-estar:** satisfação, humor e equilíbrio trabalho-vida no jogo.
- **Motivação/engajamento:** motivadores atendidos, autonomia, reconhecimento, aprendizagem, justiça e sentido do trabalho.

Separar indicadores em painel e registrar a cadeia simulada: oferta → percepção/aceitação → condições e motivadores → estado imediato → projeção de 30 dias → resultado observado no jogo. Exibir incerteza e evitar causalidade determinística.

### Tela e fluxo
1. Selecionar candidato e consultar currículo.
2. Ajustar salário e benefícios em controles visuais.
3. Ver em tempo real faixa salarial, custo total e custo incremental.
4. Consultar aceite estimado e razões principais, inclusive fatores não salariais.
5. Comparar propostas alternativas antes do envio.
6. Enviar oferta; candidato responde com aceite, contraproposta ou recusa conforme regras fictícias.
7. Persistir proposta, resposta, custo e indicadores-base.
8. Exibir feedback visual/sonoro breve e atualizar o HUD sem interromper a navegação.

### Modelo de dados adicional
```json
{
  "offerId": "offer-001",
  "candidateId": "candidate-ops-01",
  "monthlySalary": null,
  "salaryBandPosition": "medium",
  "benefits": [
    {"id": "transport_support", "monthlyEmployerCost": null, "perceivedValue": 0.7},
    {"id": "training_budget", "monthlyEmployerCost": null, "perceivedValue": 0.8}
  ],
  "workConditions": {"schedulePredictability": 0.7, "flexibility": 0.4, "ergonomics": 0.7, "managerSupport": 0.6},
  "estimatedAcceptance": null,
  "response": "pending",
  "estimatedOutcomes30d": {"retention": null, "psychosocialRisk": null, "incidentRisk": null, "absenceRisk": null, "wellbeing": null, "motivation": null},
  "kind": "fictional_simulation"
}
```
Valores nulos são calculados por regras configuradas ou permanecem indisponíveis; nunca viram zero silenciosamente.

### Testes e critérios de aceite
- Ajustar e comparar propostas sem enviá-las automaticamente.
- Mostrar salário abaixo/dentro/acima das faixas do candidato.
- Separar custo empresarial e valor percebido dos benefícios, sem confundi-los com salário.
- Aceite, contraproposta e recusa respeitam preferências e limites configurados e têm explicação legível.
- Alterações atualizam prévia sem persistir até confirmação.
- Confirmar registra componentes e resposta em persistência.
- Os seis indicadores recebem efeitos explicáveis, testáveis e com incerteza explícita.
- Salário/benefícios não mascaram riscos graves de assédio, sobrecarga ou segurança.
- Testar ofertas baixas, médias, altas, abaixo do limite, benefícios alternativos, contraproposta, recusa, reload e projeção de 30 dias.
- Métricas são simulações educativas, não diagnósticos nem estatísticas empíricas.
