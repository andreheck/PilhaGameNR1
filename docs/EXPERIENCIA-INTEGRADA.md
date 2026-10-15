# Revisão da experiência integrada — PilhA+ Game

Data: 15/10/2026

## Direção consolidada

A experiência mantém a direção visual já aprovada nos artefatos do projeto:

- central de gestão em visão isométrica 2.5D/3D;
- paleta azul-marinho, laranja, amarelo e verde para distinguir contexto, atenção, decisão e melhoria;
- personagens estilizados com leitura rápida em desktop e mobile;
- painéis modulares, com o ambiente visual ao fundo e decisões organizadas por etapas;
- linguagem de simulação educativa, sem transformar aparência, sofrimento ou pontuação em diagnóstico.

A referência de composição da central de gestão orienta o mapa, o painel de riscos e a sequência **Investigar → Analisar → Intervir → Acompanhar → Evoluir**. O guia de personagens orienta os retratos, os GLBs e a diferenciação de papéis.

## Jornada canônica

```text
/                         Central Alpha 1.4
  /?view=casos             Seleção de cenário
  /missao01.html           Prólogo educativo e pré-requisito NR-1
  /caso017.html            Caso 017 completo, com simulação de 30 dias
  /biblioteca3d.html       Biblioteca 3D experimental
  /viewer3d.html           Laboratório de personagens e animações
  /scene3d.html            Cena técnica experimental do galpão
```

A central agora encaminha o Caso 017 para `/caso017.html`, evitando que o jogador entre por engano no questionário compacto legado da central. A entrada continua respeitando o portão pedagógico da Missão 01 e preserva conclusões antigas em `pilha-case017-v2`.

## Caso 017 — entrega atual

O Caso 017 possui a experiência mais completa do produto:

- quatro etapas de investigação e acompanhamento;
- conversa com quatro personagens;
- evidências com custo de esforço;
- hipótese causal e devolutiva à equipe;
- orçamento de intervenção;
- monitoramento e ponto de revisão;
- motor determinístico de consequências organizacionais;
- indicadores finais após 30 dias;
- variações no dashboard em relação à condição inicial;
- salvamento local e preservação de melhor pontuação;
- avisos de privacidade e de não equivalência com avaliação clínica ou normativa.

## Casos 018–021 — estado honesto da Alpha

Os quatro casos estão definidos em `cases-data.js` com perguntas, alternativas, feedback e desbloqueio sequencial. Eles continuam sendo **protótipos pedagógicos compactos** no fluxo Alpha 1.4; ainda não possuem a mesma investigação multi-etapas, personagens contextuais, orçamento e motor de consequências do Caso 017.

A interface deve apresentar essa diferença como estado de produção, sem sugerir que os quatro cenários já têm a mesma profundidade do Caso 017. A expansão recomendada é criar um motor de caso comum e, depois, um simulador específico para cada cenário:

- 018 — segurança psicológica e reuniões;
- 019 — autonomia, papéis e demandas contraditórias;
- 020 — sigilo, escuta e prevenção;
- 021 — hiperconexão, plantões e descanso.

## Estado visual e técnico

### Entregue

- central full-screen com fallback 2D;
- mapa visual do escritório e hotspots de casos;
- três personagens GLB publicados e personagem colaborador em retrato;
- laboratório 3D separado da jornada principal;
- layout mobile com painel recolhível;
- dashboard do Caso 017 conectado ao resultado simulado;
- indicadores com variação positiva/negativa;
- compatibilidade com progresso legado.

### Limites explícitos

- a cena 3D do galpão ainda é uma reconstrução procedural, não o FBX definitivo;
- colisões, escala e posicionamento demandam validação com o GLB final;
- a inspeção visual em navegador real ainda deve ser feita em 1440×900 e 390×844;
- casos 018–021 precisam de conteúdo e simulação próprios antes de uma versão comercial;
- os textos NR-1 devem passar por revisão técnica, jurídica e por pessoas trabalhadoras antes de qualquer alegação de conformidade.

## Critério de completude da próxima versão

A experiência pode ser considerada pronta para uma demonstração Alpha coerente quando:

1. o jogador parte da central, conclui a Missão 01 e chega ao Caso 017 completo sem bifurcação legada;
2. a conclusão do Caso 017 atualiza o dashboard e o histórico sem apagar a melhor pontuação;
3. a interface informa claramente que os indicadores são fictícios;
4. o fluxo mobile mantém leitura, foco, retorno e ações essenciais;
5. os casos 018–021 aparecem como em desenvolvimento até receberem profundidade equivalente;
6. o QA visual real confirmar a composição isométrica, os retratos, os controles 3D e os estados de resultado.

## Vertical slice do ambiente padrão

A próxima evolução adota um único escritório modular como laboratório de aprendizagem. O hub agora trata o ambiente como uma cena viva: o setor selecionado recebe um pulso visual, os personagens próximos caminham para a área ativa e a interface mostra um evento contextual com estado de atualização. A composição usa cinco presenças 3D: Operadora, Psicóloga, Psiquiatra, Gestor-mentor e Colaborador. Três usam GLBs animados publicados; o Gestor-mentor usa o protótipo GLB da biblioteca e o Colaborador permanece como avatar procedural 3D até que seu modelo final seja entregue. Essa escolha evita multiplicar ambientes prematuramente e permite validar o loop de investigação, decisão e consequência antes de replicá-lo em outros setores.
