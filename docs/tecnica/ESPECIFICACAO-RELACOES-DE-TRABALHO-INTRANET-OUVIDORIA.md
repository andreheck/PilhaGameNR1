# Especificação de produto — Ao Trabalho: relações de trabalho, voz e proteção

**Nome do jogo:** Ao Trabalho  
**Subtítulo:** Desafios da implementação da NR-1  
**Repositório:** andreheck/PilhaGameNR1  
**Branch documental:** docs/hero-roster-beta  
**Status:** proposta de produto para validação; não implementada.

> Este documento amplia a Bíblia narrativa e as especificações técnicas existentes. A inclusão destas mecânicas não significa que estejam implementadas. Antes de codificar, o agente deve inspecionar a arquitetura real e propor integração incremental, preservando os sistemas atuais.

## 1. Direção de produto

O nome público passa a ser **Ao Trabalho — Desafios da implementação da NR-1**. “PilhA+” e “PilhA+ Game” deixam de ser o nome principal, mas podem permanecer como nomes de produtos, protótipos ou ativos legados quando necessário para não quebrar URLs, chaves locais, referências e integrações.

O jogo representa uma organização em funcionamento. O jogador precisa compreender que decisões sobre custos, contratação, terceirização, organização coletiva, condições de trabalho, prevenção e resposta institucional produzem efeitos sobre pessoas, operação, confiança, saúde organizacional e sustentabilidade econômica.

Princípio pedagógico: **não existe decisão neutra quando a organização distribui riscos, poder, recursos e oportunidades.**

## 2. Novos módulos

1. Terceirização e fornecedores: contratação de prestadores de duas empresas concorrentes, Taresolvido e Xacomigo.
2. Organização sindical: contratação de trabalhadores sindicalizados e adesão voluntária de trabalhadores já contratados.
3. Intranet social: feed interno semelhante a uma rede de micropublicações, com 33 reações contextuais.
4. Ouvidoria e proteção: canal de relatos de violações, triagem, proteção, apuração, resposta e acompanhamento.
5. Comitê/Conselho: instância colegiada que delibera sobre casos e acompanha consequências das decisões.

Os módulos devem conversar entre si: uma decisão de terceirização pode alterar o clima e gerar manifestações; uma denúncia pode exigir proteção imediata e deliberação; a resposta do comitê pode alterar confiança, risco, permanência, custo e operação.

## 3. Terceirização — Taresolvido e Xacomigo

### 3.1 Conceito

O jogador poderá contratar serviços terceirizados de duas empresas fictícias: **Taresolvido** e **Xacomigo**.

As empresas devem ter perfis distintos, vantagens, limitações, custos e histórico de desempenho. Não apresentar uma delas como escolha obviamente correta. O jogador deverá comparar proposta, escopo, preço, capacidade, qualidade, continuidade, treinamento, condições de trabalho e histórico de prevenção.

Os perfis específicos e seus parâmetros numéricos devem ser balanceados em cenários sintéticos antes da implementação. Não inventar uma vantagem fixa que torne uma empresa dominante.

### 3.2 Variáveis comparáveis

Cada proposta deve apresentar:
- preço inicial e custo recorrente;
- escopo, quantidade de postos/horas e prazo;
- experiência e capacidade de entrega;
- rotatividade estimada no cenário;
- plano de integração, formação e supervisão;
- condições de saúde e segurança informadas;
- canais de escuta e participação dos trabalhadores alocados;
- histórico ficcional de incidentes, atrasos e medidas corretivas;
- cláusulas de continuidade, substituição e encerramento;
- evidências e pontos ainda não verificados.

Não reduzir a decisão ao menor preço. O custo baixo pode vir acompanhado de rotatividade, falhas de integração, sobrecarga da equipe própria, descontinuidade, riscos ocupacionais ou perda de confiança. Um fornecedor mais caro também não deve receber automaticamente melhor avaliação.

### 3.3 Acompanhamento e responsabilidade

Após a contratação, o jogador acompanha indicadores de qualidade, continuidade, integração, incidentes, condições de trabalho e cumprimento do escopo. A decisão deve permitir auditoria, diálogo, plano corretivo, suspensão ou encerramento contratual conforme a gravidade e a evolução.

A simulação não deve sugerir que a terceirização elimina deveres de prevenção ou permite ignorar riscos. A organização contratante precisa considerar os riscos relacionados à atividade, a coordenação entre empresas e a proteção de todas as pessoas que trabalham no ambiente. Não converter o jogo em parecer jurídico sobre responsabilidade trabalhista.

Trabalhadores terceirizados entram nos indicadores do ambiente e na experiência de trabalho quando expostos às condições do setor, sem serem duplicados no cadastro de empregados próprios. Distinguir vínculo, empregador, local de prestação e população exposta.

### 3.4 Consequências possíveis

- custo e capacidade operacional;
- integração ou fragmentação entre equipes;
- confiança e percepção de justiça;
- rotatividade e continuidade;
- exposição a fatores psicossociais e riscos de segurança;
- reclamações, relatos e necessidade de intervenção;
- impacto sobre prazos, qualidade e reputação interna.



### 3.5 Regra financeira já implementada parcialmente

Na simulação logística, a contratação de um fornecedor desconta do orçamento o custo do primeiro período. Cada avanço de período desconta novamente o valor dos contratos ativos. O histórico registra o lançamento e o saldo após a cobrança. A contratação inicial é recusada quando não há saldo suficiente para o primeiro período; obrigações recorrentes podem levar o caixa a saldo negativo, tornando visível a pressão financeira. Esta mecânica ainda não representa fluxo de caixa completo, impostos, reajustes, multas, encerramento contratual ou integração com todos os módulos econômicos do jogo.

**Diretriz de dificuldade:** o custo recorrente deve competir com investimentos preventivos e capacidade operacional. O jogador não deve conseguir manter indefinidamente todos os contratos e todas as intervenções sem priorização. O saldo negativo deve gerar consequências sistêmicas em etapa posterior, sem penalidade aleatória ou punição instantânea sem explicação.

## 4. Sindicalização e representação coletiva

### 4.1 Duas possibilidades do jogador

- Contratar pessoas que já são sindicalizadas, respeitando os critérios profissionais e sem usar filiação sindical como vantagem ou desvantagem na seleção.
- Permitir que trabalhadores atuais optem por se sindicalizar, de forma voluntária, individual e sem coerção.

A adesão ou não adesão não pode alterar negativamente contratação, remuneração, promoção, avaliação, escala, permanência ou acesso a oportunidades. É vedado criar metas para sindicalização, pressionar trabalhadores ou revelar filiação individual à liderança sem base legítima e necessidade claramente definida.

A decisão de sindicalizar-se pertence ao trabalhador. O jogador administra condições para diálogo e negociação coletiva, não escolhe quem deve se filiar.

### 4.2 Benefícios e efeitos a representar

O jogo pode apresentar benefícios possíveis de uma organização coletiva, sem prometer que sejam automáticos ou universais:
- representação e negociação coletiva;
- acesso a orientação e apoio sindical;
- fortalecimento da voz coletiva;
- participação em debates sobre jornada, remuneração, segurança e condições de trabalho;
- acesso a serviços ou convênios oferecidos pela entidade sindical, quando previstos no cenário;
- maior capacidade de acompanhar acordos e reivindicações.

Distinguir benefícios negociados, serviços oferecidos pela entidade e direitos legais. Não apresentar como benefício garantido aquilo que depende de convenção, acordo, estatuto ou política específica.

### 4.3 Mecânica de relações coletivas

A representação coletiva pode encaminhar pautas ao RH, liderança ou comitê; solicitar reunião; participar de consulta e negociação; acompanhar compromissos e prazos; questionar mudanças de escala, metas, segurança e condições de trabalho; e apoiar a comunicação de problemas sem expor indevidamente indivíduos.

A existência de representação sindical pode aumentar a capacidade de diálogo e a qualidade da informação disponível, mas também exige tempo, negociação, transparência e disposição para rever decisões. Não tratar reivindicação, paralisação ou conflito como comportamento irracional por padrão. As consequências devem decorrer do contexto e das decisões de gestão.

## 5. Intranet social — feed de reações

### 5.1 Experiência

Criar uma área visual de intranet inspirada em uma rede de micropublicações. Periodicamente, um balão/cartão aparece com:
- nome fictício do funcionário ou identificação “Anônimo”;
- setor e contexto, quando não houver risco de identificação;
- mensagem curta;
- categoria temática;
- sentimento/sinal: elogio, preocupação, crítica, pergunta ou sugestão;
- data/ciclo e eventual resposta institucional.

A frequência e a seleção das mensagens dependem do estado do setor, de eventos, de decisões recentes e de mudanças que não aconteceram. Não exibir as 33 mensagens em sequência; selecionar as que fazem sentido para o estado do jogo, com cooldown e diversidade temática.

O anonimato deve ser respeitado dentro da narrativa. Não permitir que o jogador descubra o autor de uma mensagem anônima por dedução artificial, nem usar anonimato para tornar uma acusação automaticamente verdadeira. Uma publicação não substitui apuração.

### 5.2 Regras de geração contextual

Cada mensagem deve possuir metadados de gatilho: setor ou população relacionada; condição ou evento que habilita a mensagem; tendência ou limiar do indicador; decisão que a torna relevante; possibilidade de repetição e cooldown; polaridade e tema; nível de confidencialidade; resposta esperada ou encaminhamento.

A mensagem deve ser coerente com o estado atual e com a experiência da pessoa. Não gerar elogios artificiais quando os indicadores estão ruins, nem reclamações aleatórias sem gatilho. Permitir opiniões diferentes no mesmo setor, pois trabalhadores não são um bloco homogêneo.

### 5.3 Banco de 33 frases iniciais

As frases são conteúdo ficcional e devem ser vinculadas a gatilhos; nomes de pessoas são preenchidos pelo sistema a partir de personagens sintéticos elegíveis. “Anônimo” deve ser usado em mensagens sensíveis ou quando o cenário assim determinar.

**Reconhecimento e melhorias**
1. “Depois que ajustaram as pausas, o turno ficou menos pesado.”
2. “A equipe foi ouvida antes da mudança de escala. Fez diferença.”
3. “O novo equipamento reduziu um esforço que parecia inevitável.”
4. “Finalmente temos clareza sobre quem faz o quê.”
5. “A integração com o pessoal terceirizado melhorou bastante.”
6. “A formação foi útil porque tratou de situações que acontecem de verdade.”
7. “A liderança voltou para contar o que foi feito com as sugestões.”
8. “O canal de escuta respondeu e explicou os próximos passos.”
9. “A reunião com a representação dos trabalhadores trouxe encaminhamentos concretos.”
10. “Estamos conseguindo entregar sem depender de horas extras todos os dias.”

**Preocupações e problemas persistentes**
11. “A meta mudou no painel, mas a quantidade de pessoas continua a mesma.”
12. “Falaram que as pausas seriam respeitadas. Na prática, seguimos sem conseguir parar.”
13. “O sistema novo deveria facilitar, mas está criando retrabalho.”
14. “A equipe terceirizada muda tanto que precisamos ensinar tudo de novo.”
15. “O menor preço venceu, mas ninguém explicou como ficará a qualidade.”
16. “Tem gente acumulando função e isso já virou rotina.”
17. “As reuniões acontecem, mas as decisões não chegam até o turno.”
18. “O problema foi registrado no mês passado e continua no mesmo lugar.”
19. “Parece que só lembram da segurança quando acontece um incidente.”
20. “Não está claro quem responde quando o problema envolve duas empresas.”
21. “A gente quer participar, mas os horários das reuniões não permitem.”
22. “A cobrança é igual para todos, mas as condições de trabalho não são.”
23. “O ambiente melhorou para um setor, mas a pressão foi transferida para outro.”

**Voz coletiva, confiança e direitos**
24. “Queria entender melhor como funciona a representação sindical aqui.”
25. “A filiação deve ser uma escolha de cada pessoa, sem pressão de ninguém.”
26. “Precisamos de uma conversa coletiva sobre jornada e dimensionamento.”
27. “Não basta abrir um canal; precisamos saber o que acontece depois do relato.”
28. “Tenho receio de sofrer consequências se falar sobre o que aconteceu.”
29. “Uma pessoa relatou uma situação séria. Espero que haja proteção e apuração.”
30. “Não quero que tratem uma denúncia como problema de comportamento de quem falou.”
31. “O comitê precisa explicar por que escolheu esse encaminhamento.”
32. “A resposta foi rápida, mas ainda não sabemos se a situação mudou.”
33. “A confiança só volta quando as medidas deixam de ser promessa e aparecem no trabalho.”

### 5.4 Regras éticas e de jogo

- Não transformar intranet em vigilância de produtividade ou monitoramento individual.
- Não usar mensagens para inferir diagnóstico, personalidade ou filiação sindical.
- Não punir trabalhador por crítica, denúncia, anonimato ou participação coletiva.
- Não publicar detalhes que identifiquem denunciantes, pessoas afetadas ou testemunhas.
- A moderação pode remover conteúdo abusivo ou dados pessoais, mas não apagar críticas legítimas para melhorar artificialmente o clima.
- Distinguir percepção, relato, evidência e conclusão de apuração.

## 6. Ouvidoria — relatos de violações e proteção

### 6.1 Entrada de relatos

A intranet terá acesso a uma **Ouvidoria** com opção de registrar:
- assédio moral ou sexual;
- discriminação e racismo;
- retaliação;
- violência, ameaça ou humilhação;
- violação de jornada, pausas ou condições de segurança;
- violação de direitos de trabalhadores próprios ou terceirizados;
- falha de proteção, omissão ou descumprimento de compromissos;
- outras situações relacionadas ao trabalho.

Permitir relato identificado ou anônimo. Solicitar apenas informações necessárias: descrição, local/setor, período aproximado, pessoas ou funções envolvidas se a pessoa quiser informar, existência de risco atual e necessidade imediata de proteção. Não exigir prova para acolher o relato.

### 6.2 Fluxo de tratamento

1. **Recebimento:** gerar protocolo fictício e confirmar recebimento.
2. **Triagem:** classificar natureza, gravidade, urgência, risco atual e conflito de interesse.
3. **Proteção imediata:** avaliar medidas para interromper exposição e prevenir retaliação, sem presumir culpa nem transferir o ônus para quem relatou.
4. **Encaminhamento:** definir instância competente e pessoas estritamente necessárias.
5. **Apuração:** buscar informações de forma imparcial, com escuta segura e registro de evidências.
6. **Deliberação:** comitê/conselho decide providências dentro de sua competência.
7. **Comunicação:** informar ao relator o andamento possível sem revelar dados protegidos de terceiros.
8. **Acompanhamento:** verificar se a violação cessou, se houve retaliação e se as medidas foram efetivas.
9. **Encerramento ou reabertura:** encerrar somente com justificativa e possibilidade de reabrir se houver novos fatos ou falha das medidas.

### 6.3 Princípios de proteção

- Denúncia não é prova automática nem motivo para punição automática da pessoa apontada.
- Denúncia isolada nunca reduz score do denunciante nem ativa penalidade contra o setor por si só.
- Não exigir identificação ou documentação para receber o relato.
- Proteger confidencialidade e restringir acesso por necessidade funcional.
- Prevenir retaliação e monitorar consequências posteriores.
- Separar acolhimento, apuração, decisão e eventual medida disciplinar.
- Em risco grave e imediato, priorizar segurança e encaminhamento apropriado, sem aguardar reunião ordinária.
- Evitar reproduzir detalhes gráficos ou sensacionalistas de violência.

## 7. Comitê/Conselho — decisões e desdobramentos

### 7.1 Papel

O Comitê/Conselho é a instância colegiada de análise, deliberação e acompanhamento de situações relevantes. Deve receber síntese protegida do caso, não acesso indiscriminado a todos os dados pessoais.

Sua composição, papéis e limites de competência precisam ser definidos no desenho narrativo. Pessoas com conflito de interesse devem declarar impedimento e não participar da deliberação daquele caso.

### 7.2 Decisões possíveis

Conforme o caso, o jogador e o comitê podem:
- determinar proteção imediata e ajuste temporário de condições;
- encaminhar apuração independente;
- ouvir trabalhadores e representantes coletivos;
- solicitar evidências e esclarecimentos;
- revisar escala, metas, supervisão, contratos ou procedimentos;
- suspender atividade ou contrato quando necessário para proteção;
- pactuar plano corretivo com responsáveis e prazo;
- recomendar formação, mudança de processo ou responsabilização conforme apuração;
- comunicar instâncias competentes quando extrapolar sua atribuição;
- acompanhar e reavaliar medidas.

Não oferecer “abafar”, “descobrir quem denunciou” ou “punir quem reclamou” como escolhas aceitáveis. Se a narrativa apresentar uma resposta inadequada como erro do jogador, explicitar o dano e os desdobramentos sem recompensá-la.

### 7.3 Consequências sistêmicas

As decisões podem afetar confiança na organização e segurança para falar; recorrência de violações e risco de retaliação; permanência, absenteísmo e rotatividade simulados; continuidade da operação e qualidade; custos de correção e contratação; relação com fornecedores e representação sindical; FI — Fator de Inclusão; e elegibilidade a bônus coletivo, respeitando o bloqueio de proteção.

A quantidade de denúncias não deve ser usada como indicador isolado de piora: um aumento pode refletir maior confiança no canal. Avaliar gravidade, resposta, recorrência, proteção, tempo de tratamento e efetividade das medidas.

## 8. Integração com diversidade, inclusão e economia

- Trabalhadores próprios e terceirizados devem ser identificados por vínculo e população exposta, sem duplicidade.
- Acesso a oportunidades, formação, remuneração comparável e permanência deve considerar grupos elegíveis e vínculos comparáveis, sem misturar populações incompatíveis.
- A filiação sindical é dado sensível no contexto da relação de trabalho e não deve alimentar ID, FI, avaliação individual ou decisão de contratação.
- Relatos de discriminação, assédio grave sem resposta, retaliação ou falha grave de proteção podem acionar o bloqueio de proteção já especificado.
- A existência de denúncia, por si só, não aciona bloqueio.
- O impacto econômico é consequência coletiva e contextual; nunca reduzir remuneração individual nem penalizar o denunciante.
- A mecânica de diversidade e inclusão continua independente da existência de sindicato.

## 9. Modelo de dados conceitual

Adaptar aos modelos reais já existentes; não criar cadastro paralelo de funcionários ou setores.

- Supplier: fornecedor, perfil de proposta, indicadores e contrato.
- Contract: escopo, custo, vigência, setor, fornecedor e status.
- WorkerEngagement: pessoa, vínculo, empregador, local de prestação, setor e exposição.
- UnionRepresentation: existência de representação e pautas coletivas; não expor lista individual de filiados.
- IntranetPost: texto, autor público ou anônimo, tema, gatilhos, setor, ciclo, confidencialidade e estado.
- OmbudsReport: protocolo, categoria, descrição, anonimato, urgência, estado e acesso restrito.
- ProtectionAction: medida, responsável, prazo, status e evidência de acompanhamento.
- CommitteeDecision: deliberação, justificativa, impedimentos, responsável, prazo e consequências.
- CaseTimelineEvent: histórico auditável de recebimento, triagem, decisão, comunicação e revisão.

Todos os dados e personagens devem ser sintéticos. Não armazenar dados reais de saúde, denúncias ou filiação sindical.

## 10. Requisitos de interface

- Nova área “Intranet” no ambiente da organização.
- Feed com cartões compactos, autor/Anônimo, setor quando seguro, mensagem e resposta.
- Filtros simples por setor e tema, sem ferramenta de busca por pessoa.
- Acesso destacado à “Ouvidoria”.
- Painel de acompanhamento com protocolo, status, prazo e próxima etapa, respeitando permissões.
- Área “Comitê/Conselho” com pauta, síntese protegida, opções de deliberação, impedimentos e acompanhamento.
- Painel de fornecedores com comparação de propostas e histórico.
- Área de representação coletiva com pautas e acordos, sem exibir filiação individual.
- Interface acessível em mobile e desktop, com navegação por teclado e leitores de tela.

## 11. Cenários mínimos de teste

1. Menor preço não vence automaticamente a comparação de fornecedores.
2. Contrato terceirizado melhora custo, mas piora integração e rotatividade.
3. Trabalhador terceirizado é contado uma única vez na população exposta e não duplicado como empregado próprio.
4. Falha de coordenação entre empresas aparece no feed e nos riscos.
5. Trabalhador pode optar por sindicalização sem coerção.
6. Não sindicalizado e sindicalizado têm os mesmos critérios individuais de seleção, avaliação e promoção.
7. Nenhum dado individual de filiação aparece para liderança.
8. Feed seleciona mensagens por gatilho e cooldown, sem repetição excessiva.
9. Opiniões diferentes coexistem no mesmo setor.
10. Mensagem anônima não revela autor por inferência ou metadados.
11. Crítica legítima não é removida para elevar indicador de clima.
12. Relato anônimo é recebido sem exigir prova ou identificação.
13. Denúncia isolada não aciona bloqueio nem penaliza denunciante ou setor automaticamente.
14. Caso grave com risco atual aciona proteção imediata.
15. Conflito de interesse afasta integrante do comitê da deliberação.
16. Comitê decide, justifica, atribui responsável e prazo.
17. Ausência de resposta ou retaliação gera consequências mais graves do que o registro da denúncia.
18. Acompanhamento verifica efetividade e possibilidade de reabertura.
19. Quantidade de relatos não é usada isoladamente como indicador negativo.
20. Integração com ID/FI respeita vínculo, comparabilidade e privacidade.
21. Economia, casos, heróis, mapa, NR-1 e mecânicas existentes permanecem funcionais.

## 12. Plano de implementação recomendado

### Etapa A — inspeção técnica
1. Mapear a aplicação atual, telas, estado, persistência, personagens, setores, economia e testes.
2. Identificar o que já existe de contratação e propostas, sem duplicar mecânicas.
3. Localizar os pontos de integração da intranet, eventos, ouvidoria e decisões.
4. Entregar plano de arquivos e riscos; não alterar código nesta etapa.

### Etapa B — domínio e cenários
1. Criar modelos e dados sintéticos para fornecedores, contratos, feed, relatos, ações e decisões.
2. Definir regras e gatilhos determinísticos para as 33 mensagens.
3. Criar testes unitários de fluxo, privacidade e consequências.
4. Validar o fluxo de sindicalização voluntária sem exposição individual.

### Etapa C — interfaces e integração
1. Implementar comparação e acompanhamento de fornecedores.
2. Implementar feed contextual.
3. Implementar ouvidoria, triagem e proteção.
4. Implementar deliberação e acompanhamento do comitê.
5. Integrar consequências à economia, clima, riscos, FI e eventos.

### Etapa D — validação
1. Executar testes, lint e build disponíveis.
2. Testar acessibilidade e experiência mobile/desktop.
3. Revisar linguagem e conteúdo com foco em direitos, prevenção e não retaliação.
4. Atualizar documentação com estado real: implementado, parcial ou pendente.

## 13. Questões de produto ainda abertas

1. Quais serviços e setores podem contratar Taresolvido e Xacomigo? Os dois fornecedores concorrem nos mesmos serviços ou têm especialidades diferentes?
2. Quais benefícios sindicais serão oferecidos no cenário? Separar benefícios negociados, serviços da entidade e direitos legais.
3. Quem compõe o Comitê/Conselho e quais decisões pode tomar diretamente?
4. A ouvidoria terá fluxo de urgência com um personagem responsável pela triagem?
5. Qual periodicidade do feed: por dia de jogo, por ciclo ou após eventos/decisões? Recomendação inicial: gatilhos por evento e cooldown por mensagem, não postagem aleatória.
6. Quais personagens podem aparecer com nome nas mensagens, preservando a privacidade de relatos sensíveis?

---

**Relações documentais:** complementa a Bíblia narrativa inicial e a especificação técnica de Diversidade e Inclusão. Esta proposta não substitui normas legais, políticas reais de ouvidoria, procedimentos de investigação ou orientação jurídica.
