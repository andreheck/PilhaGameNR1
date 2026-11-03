# Ciclo 1 — QA de estabilidade e experiência

**Branch:** `qa/cycle-1-stability`  
**Base:** `dc6a7e5be64704c4b31bcab06a3751e0ea588d2f`  
**Commit da documentação inicial:** `3f49e97f934f7649b164d58f865630ce559cc1d5`  
**Commit de integração testado pelo GitHub Actions:** `1a1f42365424bc308d051552b30ec8c905c5fbcc` (merge sintético da PR #61)  
**Escopo:** abertura Ao Trabalho, onboarding, seleção inicial da dupla, navegação, persistência e compatibilidade.  
**Status:** testes automatizados e regressão de navegador aprovados; validação específica da abertura Ao Trabalho e revisão manual final ainda pendentes.

## Objetivo

Confirmar que a jornada de entrada e o núcleo atual são confiáveis antes de adicionar novas mecânicas. Este ciclo não altera regras de jogo, economia, pontuação, conteúdo pedagógico ou dados salvos.

## Leitura estática inicial

### O que está presente no código

- A tela Ao Trabalho é uma camada independente do hub do jogo.
- O botão Jogar dispara o evento `ao-trabalho:start`.
- A camada de abertura oculta e torna inerte o hub até a entrada.
- O onboarding possui as etapas missão, como jogar, equipe inicial e entrar.
- A seleção inicial usa a dupla persistida e oferece a galeria quando não há dupla válida.
- A galeria trabalha com seis heróis canônicos e salva a dupla no armazenamento local.
- O onboarding não deve solicitar novamente a dupla quando já existe uma dupla válida ou uma campanha congelada.
- Há testes automatizados dedicados à dupla, à galeria, à experiência do jogador e à navegação/fallback.

### Pontos que exigem validação específica

1. **Retorno à tela inicial:** confirmar se clicar no logo lateral retorna à abertura e se Jogar reabre corretamente a experiência sem reiniciar campanha, timer, dupla ou progresso.
2. **Reentrada após primeira visita:** o fluxo de onboarding é iniciado no carregamento da aplicação. Confirmar se, ao retornar à abertura na mesma sessão, a intenção é entrar diretamente no jogo ou reapresentar a missão sem repetir a escolha da dupla.
3. **Persistência da dupla:** testar primeira escolha, recarga, retorno à home, nova entrada e campanha já iniciada. A dupla congelada da campanha deve prevalecer.
4. **Acessibilidade dos modais da abertura:** o modal possui rótulo e foco inicial, mas a implementação observada não demonstra contenção de foco (focus trap) nem tornar o fundo inerte enquanto aberto. Validar teclado e leitor de tela; corrigir se confirmado.
5. **Configurações:** validar redução de animações e alto contraste após recarga, inclusive se a preferência afeta os componentes relevantes do jogo, não apenas a tela inicial.
6. **Mobile:** verificar a abertura e os modais em telas estreitas, incluindo rolagem, altura útil, botões e sobreposição.
7. **Carregamento:** verificar se falhas de módulos 3D ou recursos externos mantêm a alternativa 2D e não bloqueiam a entrada.
8. **Dados antigos/corrompidos:** garantir que dados inválidos não apaguem registros válidos nem impeçam a abertura do jogo.

## Evidências automatizadas — 03/11/2026

A PR #61 acionou duas execuções de GitHub Actions. Ambas foram concluídas com `success`.

### 1. Workflow “Validar jogo” — run 41732251941

- Job `test`: concluído com sucesso.
- Executou `npm test` no Node.js 22.23.4.
- A suíte agregada percorreu testes de casos, integração, estado da empresa, mecânicas, navegação/fallback, investimentos, equipe, linha do tempo, progressão, mapa, eventos, galeria, NPCs, mobiliário e gestão de pessoas.
- Resultado do job: **PASS**.

### 2. Workflow “Validar equipe viva e calendário” — run 41732251904

- Job `regression`: concluído com sucesso.
- Executou `npm test`, `npm run test:continuous`, `npm run test:living`, `npm run test:npcs` e `python tools/qa-company-living.py`.
- Os scripts `test:continuous` e `test:living` executam `npm run build` antes de seus testes; portanto o build foi exercitado por esses fluxos.
- A automação Playwright percorreu os viewports 320×844, 390×844, 844×390, 1366×900 e 1440×900.
- A saída registrou `errors: []` e nenhuma exceção não tratada do navegador.
- Foram verificados, entre outros pontos, navegação do mapa, perfis de colaboradores, calendário, persistência, fallback de imagens, equipe e eventos.
- Resultado do job: **PASS**.

### Limite importante das evidências

A regressão Playwright aprovada está centrada na experiência “empresa viva” e no calendário. Ela não comprova, por si só, todos os critérios da nova abertura Ao Trabalho: retorno pelo logo lateral, modais Sobre/Créditos, configurações de contraste/animação, contenção de foco e repetição controlada do onboarding. Esses pontos continuam pendentes de teste direcionado.

## Checklist de QA manual — desktop e mobile

### A. Abertura Ao Trabalho
- [ ] Primeira visita abre na tela Ao Trabalho, sem exibir o hub por trás.
- [ ] Logo, tagline e quatro ações aparecem sem cortes.
- [ ] Jogar abre a jornada sem tela branca ou clique duplicado.
- [ ] Sobre o jogo abre e fecha corretamente.
- [ ] Créditos abre e fecha corretamente.
- [ ] Configurações refletem preferências salvas após recarga.
- [ ] Escape fecha o modal e o foco retorna a um controle coerente.
- [ ] Logo lateral retorna à abertura sem navegar para fora ou perder progresso.

### B. Onboarding e dupla
- [ ] Primeira entrada apresenta missão e instruções.
- [ ] Galeria apresenta os seis heróis e suas fichas.
- [ ] Não permite escolher o mesmo herói como principal e apoio.
- [ ] Não permite avançar sem dupla válida.
- [ ] Salvar a dupla persiste após recarga.
- [ ] Próxima entrada não solicita novamente a escolha da dupla.
- [ ] Campanha iniciada mantém a dupla congelada.
- [ ] Cancelar/fechar a galeria não salva seleção incompleta.

### C. Navegação e estado
- [ ] As cinco áreas abrem: Casos, Equipe, Investimentos, Biblioteca e Progresso.
- [ ] Navegação desktop e mobile permanecem sincronizadas.
- [ ] Voltar do navegador não cria tela inconsistente.
- [ ] Retorno à home e nova entrada preservam caso, orçamento, inventário, XP e níveis.
- [ ] Logo lateral não reinicia timer nem ciclo de 30 dias.
- [ ] Links e rotas legadas continuam acessíveis.

### D. Responsividade e acessibilidade
- [x] Regressão automatizada em viewports 320×844, 390×844, 844×390, 1366×900 e 1440×900 para a experiência empresa viva/calendário.
- [ ] Abertura Ao Trabalho verificada em desktop e mobile.
- [ ] Teclado: Tab, Shift+Tab, Enter, Espaço e Escape na abertura e nos modais.
- [ ] Foco visível em botões e links da abertura.
- [ ] Contraste e ampliação de texto não ocultam controles.
- [ ] Redução de movimento respeitada na abertura e nas telas relevantes.
- [ ] Sem rolagem horizontal indevida; painéis internos continuam alcançáveis.

### E. Compatibilidade e recuperação
- [x] Regressão automatizada de fallback de imagens e recuperação sem troca de identidade.
- [x] Regressão automatizada de navegação/fallback 2D.
- [ ] WebGL/3D indisponível ou falha simulada: fallback 2D continua utilizável em teste direcionado.
- [ ] Armazenamento local bloqueado/corrompido produz aviso claro e não declara salvamento falso.
- [ ] Recarregar durante uma missão preserva o estado esperado.

## Registro de evidências

Para cada falha, registrar:

- URL e SHA do commit;
- navegador, sistema e tamanho de viewport;
- etapa e passos exatos para reproduzir;
- resultado esperado e resultado observado;
- captura de tela ou vídeo, quando possível;
- severidade: bloqueador, alta, média ou baixa.

## Critérios de conclusão do Ciclo 1

- [x] `npm test` aprovado no workflow de CI.
- [x] Build exercitado por `npm run test:continuous` e `npm run test:living`.
- [x] Regressão Playwright aprovada nos cinco viewports listados para a experiência empresa viva/calendário.
- [ ] Fluxo da abertura e retorno à home aprovado em desktop e mobile.
- [ ] Persistência da dupla e reentrada aprovadas em teste direcionado.
- [ ] Acessibilidade dos modais e configurações classificada e corrigida ou aceita com justificativa.
- [ ] Compatibilidade/fallback e recuperação de armazenamento verificados em teste direcionado.
- [ ] Revisão final do diff e aprovação explícita antes de merge/deploy.

## Limites desta auditoria

Os workflows de CI demonstram que as suítes executadas passaram no commit de integração da PR. Isso não equivale à validação manual completa da abertura Ao Trabalho nem a testes com leitor de tela, dispositivos físicos, condições reais de armazenamento bloqueado ou falhas de rede. Nenhum desses itens deve ser marcado como aprovado sem execução e evidência.
