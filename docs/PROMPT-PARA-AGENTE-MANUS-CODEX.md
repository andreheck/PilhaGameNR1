# Retomada do Pilha+ Game — Manus / Codex

Repositório: https://github.com/andreheck/PilhaGameNR1
PR de referência: https://github.com/andreheck/PilhaGameNR1/pull/1
Branch de referência: `feat/psychosocial-environment-simulation`

## Instruções iniciais

1. Leia `AGENTS.md`, `README.md` e `docs/CONTEXTO-PARA-AGENTES.md`.
2. Inspecione o PR #1, o estado atual da branch e as mudanças recentes antes de editar arquivos.
3. Examine `index.html`, `play.js`, `play.css`, `world3d.js`, `logistica-simulacao.html`, `logistica-simulacao.js`, `src/psychosocial-simulation.js` e os testes.
4. Execute `npm test` e registre o resultado real antes de modificar código.

## Estado conhecido

- O protótipo logístico é uma página independente, com personagens e indicadores fictícios, alertas, intervenções, orçamento e histórico local.
- A navegação principal desktop e móvel foi atualizada nesta branch para incluir acesso à “Simulação logística”. A página de simulação tem um link para retornar ao jogo.
- O acesso por link não significa que o galpão logístico já esteja incorporado à cena 3D principal. Essa integração ainda exige diagnóstico da arquitetura.
- Preview de referência: https://pilha-plus-game-preview-git-feat-psy-48ab59-andrehecks-projects.vercel.app/logistica-simulacao.html . Verifique o deployment mais recente se este link estiver desatualizado.

## Objetivo imediato

Validar navegação desktop e móvel, corrigir regressões, confirmar entrada e retorno entre jogo e simulação, e executar `npm test`. Verifique que a Missão 01, os casos e o progresso local continuam funcionando. Não declare QA visual sem testar em navegador.

## Próxima etapa

Depois da validação, inspecione `world3d.js`, `play.js`, `index.html` e os assets para propor uma integração gradual da missão logística ao mapa 3D. Primeiro documente a abordagem e os impactos; só depois implemente alterações compatíveis com a arquitetura real.

## Regras

- Trabalhe em branch de funcionalidade, com commits pequenos e claros.
- Não faça merge, deploy de produção ou alterações de configuração de produção sem autorização explícita.
- Não sobrescreva trabalho recente de outros agentes nem remova funcionalidades existentes.
- Use apenas dados e personagens sintéticos. Scores e efeitos são pedagógicos; não são diagnóstico, instrumento validado ou comprovação de conformidade com NR-1/GRO/PGR.
- Priorize medidas organizacionais, escuta e participação; não atribua culpa individual aos trabalhadores.
- Atualize documentação e testes conforme o que realmente foi entregue.
- Ao terminar, informe arquivos alterados, commits/PR, testes executados e resultados, limitações restantes e preview verificado.

## Critérios de aceite

- Navegação desktop e móvel funciona e é legível.
- Entrada e retorno da simulação funcionam.
- `npm test` passa, incluindo os testes de navegação.
- Não há regressões observadas nos fluxos existentes.
- Documentação corresponde ao estado real.
- Produção permanece intocada sem autorização.

## Nova entrega em andamento — ambiente vivo (15/10/2026)

Foi criada a branch `feat/living-office-simulation` a partir da branch de simulação psicossocial. Ela adiciona o módulo independente `src/office-actor-brain.js` com estados sintéticos de personagem (`idle`, `working`, `exploring`, `talking`, `resting`, `worried`), duração determinística por seed, transições por risco e helpers de waypoints/colisão. A suíte `tests/office-actor-brain.test.mjs` foi adicionada ao `npm test`.

**Atenção: o módulo ainda não foi ligado ao loop visual do `world3d.js`.** Não declarar que animações, colisões reais no cenário, sons, demissão ou consequências de 30 dias estão implementados. Esta branch é a base testável para continuar a integração.

## Ordem de trabalho agora

1. Rode `npm test` nesta branch e corrija qualquer falha.
2. Inspecione os GLBs existentes e os nomes de animações reais. Não invente animações nem use avatar procedural como substituto visual quando não houver modelo compatível; registre o modelo ausente e mantenha a representação existente.
3. Integre a máquina de estados ao `world3d.js` gradualmente, usando apenas clipes existentes nos GLBs. Estados sem clipe compatível devem manter o clipe seguro existente e sinalizar o estado por HUD/ícone, sem trocar por avatar inventado.
4. Construa rotas/waypoints apenas em corredores transitáveis. Teste colisões com paredes e móveis, retorno ao setor de origem e rotinas distintas por personagem.
5. Defina medidas de proteção como eventos de jogo com efeitos imediato, persistido e horizonte sintético de 30 dias; acrescente animação de melhoria, som com opção de silenciar, atualização visual do setor e toast curto.
6. Trate adoecimento e demissão com cuidado pedagógico: a demissão não deve ser uma punição automática ou consequência inevitável de um emoji. Modele uma sequência explicável de sinais, apoio não realizado, oportunidades de intervenção e decisão organizacional; mostre também cenários positivo, neutro e negativo. Dados apenas fictícios.
7. Persistência versionada no `localStorage`, com migração defensiva, botão de reiniciar a simulação e testes para cenários positivo/neutro/negativo e horizonte de 30 dias.
8. Rode os testes, abra o preview mais recente no navegador em desktop e celular, verifique GLBs, câmera, cliques, diálogos, sons, rotinas, responsividade e console. Corrija erros críticos e repita os testes. Não declare teste de navegador sem realmente executá-lo.

## Critérios de aceite adicionais

- Os seis estados estão conectados à lógica do jogo e respeitam durações/transições.
- Personagens não atravessam paredes/móveis nem ficam presos/flutuando durante os trajetos testados.
- As rotinas retornam ao setor de origem e variam por personagem.
- Cada medida de proteção tem ação, estado alterado, feedback visual/sonoro, consequência sintética em 30 dias e persistência.
- Existe uma sequência de consequências por adoecimento que não estigmatiza nem presume causalidade clínica individual.
- Resultados de cenário positivo, neutro e negativo são reproduzíveis em testes.
- Sem erros críticos de console no navegador validado.
