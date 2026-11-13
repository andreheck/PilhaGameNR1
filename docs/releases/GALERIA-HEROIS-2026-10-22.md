# Galeria dos heróis — 22/10/2026

## Escopo e base

André solicitou integrar o pacote visual do Claude e preencher as fichas com os dados reais consolidados no GitHub. Mantida a autorização anterior de atualizar o projeto Vercel de testes; não há autorização de merge. Branch `codex/galeria-herois-canonica`, baseada em `0aafd4bf4cef290d74e763befdb169870c6af52f` da PR #32. A correção de circulação desktop dessa base já foi publicada em `dpl_2Hx861aG7TubaaGMYkPwLvKUZdGY` (READY).

Antes da alteração foram consultadas as branches/contribuições recentes. As seis fichas locais são idênticas às de `docs/hero-roster-beta` em `f9299430e3001cca961ce0d9a7bd2ac64c78d759`, incluindo P&D Tech da PR #22. A contribuição `feat/npc-balanceamento-contextual` foi identificada como frente independente de documentação/dados; seu runtime antigo não foi importado.

## Entrega

- Seis retratos WebP fornecidos pelo PM, sem regeneração, e grade/ficha do pacote `pilha-herois-pacote/herois`. Desktop com lista e ficha roláveis separadamente; celular com perfil em tela cheia.
- Principal e apoio distintos, troca de funções, cancelamento e confirmação explícita. A seleção usa o armazenamento canônico por caso, sem criar `pilha-heroi-v1`.
- Dupla em ciclo iniciado pode ser consultada, com edição bloqueada. Validação é repetida no momento de salvar; falha de armazenamento mantém a seleção aberta.
- Identidade, raridade, arquétipo, especialização, missão, seis atributos conceituais e quatro habilidades por herói obtidos das fichas do repositório. `tools/build-hero-sheets.mjs` gera `ui/hero-sheets.js` de forma reproduzível.
- Nível/XP/formação e histórico vêm da economia existente. O anel mostra progresso de nível e o segundo bloco mostra XP conquistado; energia pessoal e pontos de estratégia fictícios do exemplo foram removidos. Marcos são derivados do estado salvo, sem conceder novas recompensas.
- Apenas duas habilidades do Diretor são identificadas como protótipo implementado, com parâmetros atuais do motor. As demais permanecem identificadas como conceitos documentados.

## Validação executada

- Todos os 18 arquivos de teste de `npm test` passaram, incluindo cinco testes novos de galeria: identidades/retratos, reprodução documental e habilidades, XP/formação/histórico, estado inválido e contrato da dupla. `git diff --check` aprovado.
- Navegador local desktop: abrir galeria, escolher P&D Tech, cancelar e recuperar Diretor anterior; impedir duplicidade; salvar nova dupla; consultar dupla bloqueada após início/pausa de ciclo.
- Navegador com viewport móvel: abrir ficha da Psicóloga, histórico real vazio, Escape retorna à lista sem encerrar seleção, escolher/salvar principal.
- Origem local vazia: jornada missão → como jogar → dupla; seleção principal avança ao apoio, salvar permanece desabilitado enquanto incompleta. Falha de `Storage.setItem` simulada temporariamente por instrumentação, aviso explícito confirmado, método restaurado e salvamento concluído; apresentação recebeu Cientista de Dados + Engenheiro de Segurança.
- Economia, XP e recompensas não são alterados pela consulta das fichas. Circulação desktop herdada da base permanece ativa por padrão, com pausa visível independente de efeitos decorativos reduzidos.

Na conferência pública, o foco dos cards podia rolar programaticamente o contêiner externo no desktop. O contêiner externo agora usa `overflow: clip`; somente a lista e a ficha rolam, mantendo cabeçalho e controles da dupla visíveis.

## Limitações e decisões pendentes

A arte visual mantém os retratos aprovados enviados, enquanto os nomes seguem a ficha canônica: Diretor e Engenheiro de Segurança, por exemplo. As novas imagens não substituem GLBs dos NPCs. Habilidades conceituais, energia pessoal e pontos de estratégia exigem regras aprovadas antes de execução; a galeria não as inventa. Não houve nova sessão de quatro horas do ciclo nem teste em todos os navegadores físicos. Merge e aceite final do PO/PM continuam pendentes.
