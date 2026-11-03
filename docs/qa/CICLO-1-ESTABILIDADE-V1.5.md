# QA — Ciclo 1 de estabilidade (base Ao Trabalho v1.5+)

**Versão-base obrigatória:** preview v1.5+ informado pelo responsável do produto  
**Deployment Vercel:** `dpl_BJvQ2GzEAhTRJVe91MbZTWaVMi43`  
**Preview:** https://pilha-plus-game-preview-dgkzz31jh-andrehecks-projects.vercel.app/  
**Branch de origem:** `feat/comparador-impacto-intervencao`  
**Commit-base:** `d504d36c5f4215c2ac1e445be9a6a75637360813`  
**Branch de QA:** `qa/cycle-1-stability-v1.5`  
**Status:** em execução — nenhuma aprovação de QA ou deploy de produção implícita.

## Regra de versionamento

Todo trabalho deste ciclo e dos ciclos seguintes deve partir da linha de desenvolvimento v1.5 ou posterior indicada pelo responsável do produto. A branch antiga `qa/cycle-1-stability`, baseada no commit `dc6a7e5` (Ao Trabalho anterior à v1.5), não é mais base válida para implementação nem para aprovação.

Os testes anteriormente registrados na branch antiga são apenas evidência histórica daquela base. **Não devem ser considerados prova de qualidade da v1.5+.** Esta branch reinicia a validação no commit `d504d36`.

## Escopo do Ciclo 1

1. Abertura e fluxo inicial da versão atual.
2. Onboarding e seleção/persistência da dupla de heróis.
3. Navegação entre áreas e retorno à home.
4. Persistência de campanha, orçamento, inventário, XP, níveis, timer e ciclo de 30 dias.
5. Responsividade, teclado, foco, contraste e redução de movimento.
6. Compatibilidade, fallback 2D e recuperação de erros de armazenamento/recursos.

## Plano de execução

### A. Identificar a versão e preservar a base
- [x] Confirmar deployment preview READY.
- [x] Confirmar SHA e branch de origem pelo metadado do deployment.
- [x] Criar branch de QA diretamente do SHA da v1.5+.
- [ ] Registrar diff entre base e branch de QA.
- [ ] Confirmar que nenhum código de versão anterior foi copiado para a branch.

### B. Testes automatizados na base v1.5+
- [ ] Executar `npm test`.
- [ ] Executar `npm run build`.
- [ ] Executar `npm run test:continuous`.
- [ ] Executar `npm run test:living`.
- [ ] Executar `npm run test:npcs`.
- [ ] Registrar logs, contagem de testes e SHA exato.

### C. Jornada inicial
- [ ] Primeira visita abre na home correta da v1.5+.
- [ ] Jogar conduz à missão/onboarding correto.
- [ ] Seleção de dois heróis ocorre apenas quando necessária.
- [ ] Dupla permanece salva após reload e retorno à home.
- [ ] Campanha iniciada mantém a dupla congelada.
- [ ] Cancelar a galeria não salva seleção incompleta.
- [ ] Voltar à home e entrar novamente não reinicia campanha nem timer.

### D. Navegação e persistência
- [ ] Casos, Equipe, Investimentos, Biblioteca e Progresso.
- [ ] Navegação browser back/forward.
- [ ] Retorno à home pelo logo e nova entrada.
- [ ] Preservação de orçamento, inventário, XP, níveis e progresso.
- [ ] Ciclo de 30 dias e eventos sem duplicação ou perda de estado.

### E. Acessibilidade e responsividade
- [ ] Desktop 1440×900.
- [ ] Mobile 390×844.
- [ ] Tablet/paisagem 844×390.
- [ ] Teclado Tab, Shift+Tab, Enter, Espaço e Escape.
- [ ] Foco visível e comportamento correto de modais.
- [ ] Contraste, zoom e redução de movimento.
- [ ] Sem overflow horizontal indevido.

### F. Compatibilidade e recuperação
- [ ] WebGL/3D indisponível com fallback 2D utilizável.
- [ ] Recursos externos ausentes ou com falha.
- [ ] Armazenamento local bloqueado/corrompido.
- [ ] Reload durante missão.
- [ ] Sem exceções não tratadas no console.

## Registro de evidências

Cada execução deve registrar:
- SHA do commit e URL do preview;
- workflow/job ou roteiro manual executado;
- navegador e viewport;
- resultado esperado e observado;
- logs e captura quando aplicável;
- severidade e status da correção.

## Critérios de aceite

O Ciclo 1 só será concluído quando os testes automatizados passarem na base v1.5+, os fluxos centrais forem verificados no preview correspondente, os problemas críticos forem corrigidos e o diff for revisado. Merge e deploy de produção exigem autorização explícita.

**Atenção:** o deployment v1.5+ está READY, mas isso confirma apenas que a implantação foi construída. Não comprova que os critérios funcionais e de acessibilidade acima foram aprovados.
