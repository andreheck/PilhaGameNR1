# PilhA+ Game — Alpha 1.4

Versão principal: **[Abrir o simulador](https://pilha-plus-game-preview.vercel.app/)**. O hub reúne casos educativos, câmera isométrica, personagens e painéis contextuais. A meta pedagógica dos casos é 75/100, com pontuação máxima de 100.

- **Missão 01 / Fundamentos da NR-1:** [Biblioteca e quiz](https://pilha-plus-game-preview.vercel.app/missao01.html).
- **Caso 017:** [Fluxo de investigação](https://pilha-plus-game-preview.vercel.app/caso017.html).
- **Biblioteca 3D experimental:** [Acessar](https://pilha-plus-game-preview.vercel.app/biblioteca3d.html).
- **Novo protótipo de gestão de ambiente logístico:** abrir `/logistica-simulacao.html` na prévia da branch ou consultar [a tela no GitHub](logistica-simulacao.html).
- **Especificação do gameplay psicossocial:** [Documento](docs/GAMEPLAY-SIMULACAO-PSICOSSOCIAL.md).
- **Motor de simulação:** `src/psychosocial-simulation.js`.
- **Testes:** `npm test`.

> Os scores e efeitos da simulação são fictícios. Não constituem avaliação real de saúde, diagnóstico psicológico, instrumento validado ou evidência de conformidade com NR-1/GRO/PGR. O progresso da simulação logística é salvo localmente neste navegador.

## Protótipo logístico

A branch `feat/psychosocial-environment-simulation` agora contém uma tela piloto separada, acessível em `/logistica-simulacao.html`. Ela demonstra quatro personagens sintéticos, emojis de humor, seis domínios individuais, alertas separados do score médio, catálogo de intervenções, orçamento fictício, aplicação por equipe ou personagem e histórico local.

A implementação visual é independente da tela principal por enquanto: **não está integrada ao mapa 3D nem à navegação principal**, e ainda precisa de validação automatizada e QA no navegador antes de ser considerada pronta para merge ou publicação. O motor e os efeitos são parâmetros de jogo para aprendizagem, não estimativas de eficácia real.

## Histórico de versões

A Alpha 1.3 integra a biblioteca 3D experimental e preserva a experiência 2D como alternativa. Os modelos 3D atuais são protótipos locais e não representam os assets definitivos do PilhA+.

### Como usar a biblioteca 3D

1. Abra `/missao01.html`, entre na biblioteca e escolha a experiência 3D.
2. Use WASD/setas para mover a câmera, ou os controles disponíveis no celular.
3. Registre as leituras e continue para o quiz.
4. Se o dispositivo não suportar a cena, conclua a missão pela versão 2D.

### Regras preservadas

O progresso legado da Missão 01 e do Caso 017 deve continuar preservado. O protótipo logístico utiliza uma chave local independente para que a simulação não altere o progresso das missões existentes.

### Próximos passos

- Integrar a tela piloto à navegação e ao mapa atual, após QA.
- Comparar o estado anterior e posterior de cada intervenção.
- Acrescentar pré-requisitos, tempo de efeito e consequências contextuais.
- Executar `npm test` e revisar acessibilidade em mobile/desktop.
- Revisão técnico-científica e testes com trabalhadores, liderança e RH/SST antes de qualquer uso profissional.

### Publicação e acesso

- Entrada principal: `https://pilha-plus-game-preview.vercel.app/`
- Missão 01: `/missao01.html`
- Biblioteca 3D: `/biblioteca3d.html`
- Protótipo logístico (na branch): `/logistica-simulacao.html`
