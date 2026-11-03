# Ciclo 1 — QA de estabilidade e experiência

**Branch:** `qa/cycle-1-stability`  
**Base:** `dc6a7e5be64704c4b31bcab06a3751e0ea588d2f`  
**Escopo:** abertura Ao Trabalho, onboarding, seleção inicial da dupla, navegação, persistência e compatibilidade.  
**Status:** auditoria estática inicial; testes automatizados e QA interativo ainda não executados nesta rodada.

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

### Pontos que exigem validação

1. **Retorno à tela inicial:** confirmar se clicar no logo lateral retorna à abertura e se Jogar reabre corretamente a experiência sem reiniciar campanha, timer, dupla ou progresso.
2. **Reentrada após primeira visita:** o fluxo de onboarding é iniciado no carregamento da aplicação. Confirmar se, ao retornar à abertura na mesma sessão, a intenção é entrar diretamente no jogo ou reapresentar a missão sem repetir a escolha da dupla.
3. **Persistência da dupla:** testar primeira escolha, recarga, retorno à home, nova entrada e campanha já iniciada. A dupla congelada da campanha deve prevalecer.
4. **Acessibilidade dos modais da abertura:** o modal possui rótulo e foco inicial, mas a implementação observada não demonstra contenção de foco (focus trap) nem tornar o fundo inerte enquanto aberto. Validar teclado e leitor de tela; corrigir se confirmado.
5. **Configurações:** validar redução de animações e alto contraste após recarga, inclusive se a preferência afeta os componentes relevantes do jogo, não apenas a tela inicial.
6. **Mobile:** verificar rolagem, altura útil, botões, sobreposição e teclado virtual em telas estreitas.
7. **Carregamento:** verificar se falhas de módulos 3D ou recursos externos mantêm a alternativa 2D e não bloqueiam a entrada.
8. **Dados antigos/corrompidos:** garantir que dados inválidos não apaguem registros válidos nem impeçam a abertura do jogo.

## Roteiro de testes automatizados

Executar na raiz do repositório:

```bash
npm test
```

O script principal agrega testes de casos, integração da experiência, estado da empresa, mecânicas, navegação/fallback, investimentos, equipe, linha do tempo, progressão, mapa, eventos, galeria, NPCs, mobiliário e gestão de pessoas.

Também executar:

```bash
npm run build
```

Registrar comando, ambiente, commit, resultado e saída de falhas. Não considerar o deployment `READY` como substituto dos testes.

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
- [ ] Viewport desktop 1440×900.
- [ ] Viewport mobile 390×844.
- [ ] Teclado: Tab, Shift+Tab, Enter, Espaço e Escape.
- [ ] Foco visível em botões e links.
- [ ] Contraste e ampliação de texto não ocultam controles.
- [ ] Redução de movimento respeitada.
- [ ] Sem rolagem horizontal indevida; painéis internos continuam alcançáveis.

### E. Compatibilidade e recuperação
- [ ] WebGL/3D disponível: cena carrega e controles respondem.
- [ ] WebGL indisponível ou falha simulada: fallback 2D continua utilizável.
- [ ] Imagens/modelos ausentes não bloqueiam navegação e decisões.
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

- [ ] `npm test` aprovado.
- [ ] `npm run build` aprovado.
- [ ] Fluxo A–C aprovado em desktop e mobile.
- [ ] Fallback e persistência verificados.
- [ ] Problemas de acessibilidade classificados e corrigidos ou aceitos com justificativa.
- [ ] Nenhum dado/progresso existente perdido.
- [ ] Revisão final do diff e aprovação explícita antes de merge/deploy.

## Limites desta auditoria

A inspeção de código não confirma renderização, toque, leitor de tela, desempenho, rede ou comportamento real do navegador. Nenhum desses itens deve ser marcado como aprovado sem execução e evidência.
