# Auditoria do repositório PilhA+ Game — 03/11/2026

## Escopo e método

Consulta ao repositório GitHub, README da branch padrão, histórico recente de commits e pull requests abertas. Esta auditoria é documental e de estado de integração: não executou o projeto localmente, não reproduziu testes no navegador e não inspecionou todos os arquivos de todas as branches.

## Estado da branch padrão

- O README da branch padrão ainda identifica o produto como **Alpha 1.4**.
- O último commit da branch padrão consultado é `a0cb244f4950ffbbbd5ad466402c9d702419adb0`, de 19/10/2026, que adicionou o link do roadmap.
- O status Vercel anteriormente consultado para esse SHA estava verde. Isso não equivale a validação integral de todos os fluxos atuais.
- Há entregas posteriores em pull requests abertas, sem merge. Portanto, não devem ser descritas como parte da versão principal publicada.

## Pull requests abertas relevantes observadas em 03/11/2026

| PR | Tema | Situação observada | Próxima ação |
|---|---|---|---|
| [#60](https://github.com/andreheck/PilhaGameNR1/pull/60) | Abertura “Ao Trabalho” antes da experiência legada | Draft; 12 commits; sem testes/QA visual reportados | Executar build/testes e QA desktop/mobile; validar navegação, retorno ao início e preservação do fluxo legado |
| [#59](https://github.com/andreheck/PilhaGameNR1/pull/59) | Comparador de impacto de intervenções | Draft; branch isolada do baseline aprovado; validação pendente | Rodar `npm test`, build e QA visual; conferir limites, projeções e estados vazios |
| [#58](https://github.com/andreheck/PilhaGameNR1/pull/58) | Pacote de auditoria Codex das últimas 48h | Draft; documentação, sem alteração de runtime declarada | Usar como checklist de conciliação; não considerar itens auditados como implementados sem evidência |
| [#57](https://github.com/andreheck/PilhaGameNR1/pull/57) | Seleção compacta de heróis e 14 benefícios | Draft; descrição registra CI aprovado no SHA `b693dce15008453f621c79b0682229f4b54d277b` e QA automatizado; homologação física pendente | Revisão de produto e QA manual em aparelhos reais antes do aceite |
| [#56](https://github.com/andreheck/PilhaGameNR1/pull/56) | Correções de calendário, atalhos e central de avisos | Draft; descrição registra pipelines aprovados no SHA `047f81de7fa01abfc04cb9e6d1c2e37986010765` | Verificar ancestralidade/dependências e não integrar isoladamente fora da sequência |
| [#41](https://github.com/andreheck/PilhaGameNR1/pull/41) | NPCs animados Beatriz e Mariana | Aberta; descrição registra testes e QA automatizado anteriores, com homologação física pendente | Revisar dependências e cadeia de PRs antes de qualquer integração |

A listagem retornou outras PRs abertas, muitas empilhadas em bases diferentes. Não é seguro fazer merge isolado sem conciliar a árvore de dependências e os baselines. A existência de várias PRs abertas não significa que todas devam ser integradas.

## Distinções importantes de produto

1. **Investimentos/intervenções no jogo:** o sistema de orçamento fictício, catálogo de domínios psicossociais, compras e evolução de indicadores já aparece em documentação de implementação e em branches/PRs anteriores. Indicadores são mecânicas educativas, não medição psicossocial real.
2. **Comparador de impacto de intervenções (#59):** compara indicadores atuais com projeção educativa de uma melhoria; é uma camada do sistema de investimentos do Game.
3. **Simulador de Propostas de Trabalho:** continua sendo um módulo separado planejado dentro deste repositório, documentado em `simuladores/propostas-de-trabalho/README.md`. Não confundir com o comparador de intervenções nem afirmar que já foi implementado.
4. **Abertura “Ao Trabalho” (#60):** esse é o nome adotado para a nova entrada do jogo. A implementação está na PR draft e ainda depende de validação; o nome já está definido, mas a integração só deve ocorrer após QA e aceite.

## Atualizações documentais recomendadas

- Manter o README explícito sobre a diferença entre versão principal e trabalho em PRs.
- Atualizar o roadmap para refletir os módulos e o estado real: missões/casos, investimentos/intervenções, comparador, simulador de propostas e camada de entrada.
- Registrar que as PRs são drafts e não devem ser consideradas releases.
- Preservar a regra de não fazer merge, alterar alias principal ou publicar em produção sem autorização explícita.

## Plano de ação priorizado

1. **Conciliação técnica:** construir um mapa de dependências entre PRs e identificar qual baseline representa a última versão aprovada.
2. **PR #60 — Ao Trabalho:** validar a abertura, o retorno à página inicial e a convivência com o fluxo legado, sem remover funcionalidades aprovadas.
3. **PR #59:** validar cálculos, limites 0–100, comparações e linguagem de estimativa.
4. **PR #57/#56/#41:** revisar cadeia de dependências e homologação manual; aproveitar evidências automatizadas existentes, sem tratá-las como substitutas de teste físico.
5. **Simulador de propostas:** iniciar descoberta e protótipo isolado após estabilizar a arquitetura do Game.
6. **Release:** só promover uma versão após revisão de produto, testes, QA visual, acessibilidade e autorização expressa.

## Limites desta auditoria

Não foram executados `npm install`, `npm test`, `npm run build` nem testes Playwright nesta sessão. Os resultados de CI citados são os que constam nas descrições das respectivas PRs; foram registrados como evidências declaradas, não reexecutadas nesta auditoria. Nenhuma PR foi mesclada, fechada ou publicada.
