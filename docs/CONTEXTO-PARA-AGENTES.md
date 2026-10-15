# Pilha Game NR1 — Contexto de continuidade para agentes

> Documento de handoff para qualquer agente que continue o desenvolvimento deste repositório. Leia este arquivo antes de alterar código.

## 1. Objetivo do trabalho

O Pilha+ Game NR1 explora uma experiência gamificada para tornar visíveis fatores psicossociais do trabalho, apoiar reflexão e testar intervenções preventivas. A simulação atual é um protótipo pedagógico, não um instrumento psicométrico validado, diagnóstico clínico, avaliação ocupacional validada nem prova de conformidade com a NR-1.

A intenção é desenvolver a experiência gradualmente, sem perder o jogo existente nem confundir dados simulados com evidências reais.

## 2. Estado conhecido do projeto

- Repositório: [andreheck/PilhaGameNR1](https://github.com/andreheck/PilhaGameNR1)
- PR de referência: [#1 — feat: base de simulação psicossocial para o Pilha Game](https://github.com/andreheck/PilhaGameNR1/pull/1)
- Branch de trabalho: `feat/psychosocial-environment-simulation`
- Commit inicial conhecido da implementação: `12af2c77edc18316b8135b8ba12c92a715a54677`
- Deploy de preview Vercel ficou com status **Ready** e o responsável pelo projeto confirmou que abriu a página corretamente.
- Preview da simulação: [logistica-simulacao.html](https://pilha-plus-game-preview-git-feat-psy-48ab59-andrehecks-projects.vercel.app/logistica-simulacao.html)
- Preview base do projeto: [pilha-plus-game-preview.vercel.app](https://pilha-plus-game-preview.vercel.app/)

**Importante:** URLs de preview de branch podem mudar quando novos deploys são criados. Se a URL acima deixar de funcionar, verifique o deployment mais recente da branch no Vercel; não presuma que um deploy antigo representa o código mais novo.

## 3. O que o protótipo de simulação contém

A implementação descrita no PR inclui:
- cenário demonstrativo de logística;
- quatro colaboradores fictícios;
- seleção/interação com colaboradores;
- seis domínios/indicadores psicossociais;
- emojis para interação com estados de humor;
- alertas de situações críticas;
- catálogo de intervenções;
- orçamento para simular escolhas;
- histórico local salvo no navegador (`localStorage`);
- motor de simulação em JavaScript e testes;
- documentação inicial e backlog.

Os valores, efeitos de intervenção, perfis e relações causais devem ser tratados como **dados e regras fictícios para prototipação**, salvo se houver documentação explícita e validação posterior. Não apresentar resultados como diagnóstico de pessoas ou como mensuração científica validada.

## 4. Limitação arquitetural já conhecida

A página `logistica-simulacao.html` é uma experiência separada. No estado registrado na criação do PR, ela **ainda não está integrada à navegação principal nem ao mapa 3D do jogo**. Não dizer que essa integração já existe sem verificar o código e testar a experiência.

## 5. Recomendações de continuidade — ordem sugerida

### P0 — Entender e preservar o estado atual
1. Ler o README, backlog, PR #1, arquivos da simulação e testes antes de editar.
2. Confirmar a branch atual e os arquivos existentes; não sobrescrever trabalho recente de outro agente.
3. Rodar os testes existentes e registrar o resultado real.
4. Identificar como o mapa 3D, as missões e a navegação principal estão organizados antes de planejar a integração.

### P1 — Integrar sem quebrar o jogo existente
1. Criar um ponto de entrada claro para a simulação a partir da navegação principal/mapa 3D, respeitando a arquitetura real do repositório.
2. Definir como a missão de logística começa, como o usuário entra/sai dela e como retorna ao jogo.
3. Preservar as missões e os fluxos existentes; não substituir a experiência principal por uma página isolada.
4. Garantir comportamento responsivo, acessibilidade básica, navegação por teclado quando aplicável e estados vazios/erro claros.
5. Testar o caminho completo no preview Vercel, não apenas a abertura direta do HTML.

### P2 — Tornar as decisões e consequências compreensíveis
1. Apresentar contexto de missão, objetivo e restrições antes das decisões.
2. Mostrar estado inicial e comparação antes/depois de cada intervenção.
3. Tornar explícito o horizonte temporal simulado e distinguir efeito imediato de efeito acumulado.
4. Demonstrar consequências organizacionais de forma pedagógica (por exemplo, qualidade do trabalho, segurança, cooperação, absenteísmo simulado e recursos), sem afirmar que os resultados são previsões reais.
5. Explicar por que cada alerta aparece e qual intervenção pretende responder ao problema.
6. Evitar que um único indicador ou emoji seja interpretado como diagnóstico individual.

### P3 — Validar e preparar evolução
1. Testar cenários de uso, orçamento insuficiente, ausência de dados e repetição de ações.
2. Verificar persistência, atualização e eventual opção de reiniciar a simulação.
3. Avaliar com usuários se os alertas, termos, indicadores e consequências são compreensíveis e não estigmatizantes.
4. Se houver intenção de uso real em saúde ocupacional ou conformidade normativa, separar claramente o protótipo de qualquer processo profissional validado, envolver especialistas e revisar requisitos legais, éticos, de privacidade e segurança antes de usar dados reais.
5. Documentar decisões arquiteturais, premissas, limitações e evidências de teste.

## 6. Regras de segurança para agentes que continuarem

- Trabalhar em branch de funcionalidade; não fazer commit direto na branch principal.
- Não fazer merge do PR #1, publicar em produção, alterar configurações de produção ou remover funcionalidades sem autorização explícita do responsável.
- Antes de alterar arquivos, conferir a versão atual do repositório/branch e o histórico recente.
- Não adicionar dados reais de trabalhadores, dados pessoais ou informações sensíveis à demonstração. Manter perfis fictícios nos exemplos.
- Não inventar resultados de testes, validações, evidências científicas ou status de deploy.
- Não tratar o protótipo como diagnóstico, recomendação clínica individual ou comprovação de conformidade com NR-1.
- Manter documentação e testes alinhados com o comportamento real; atualizar este documento quando as limitações e prioridades mudarem.

## 7. Critérios mínimos de conclusão para a próxima etapa

A integração pode ser considerada pronta para revisão quando:
- há um caminho funcional da navegação principal/mapa 3D até a simulação e retorno;
- missões e fluxos preexistentes continuam funcionando;
- as decisões e suas consequências simuladas estão explicadas;
- a experiência funciona em telas móveis e desktop;
- os testes automatizados disponíveis passam;
- o preview da branch foi testado ponta a ponta;
- README/backlog e PR descrevem fielmente o que foi entregue e o que ainda falta.

## 8. Instrução para o próximo agente

Comece inspecionando o repositório, o PR #1, o README, o backlog, o mapa 3D e a navegação. Faça primeiro um diagnóstico curto do estado atual e proponha um plano de implementação compatível com a arquitetura encontrada. Depois implemente em branch própria ou na branch de funcionalidade acordada, com alterações pequenas, testes e documentação. Não assuma que recomendações listadas aqui já foram implementadas.
