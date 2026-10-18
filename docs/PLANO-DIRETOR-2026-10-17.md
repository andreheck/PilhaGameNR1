# PilhA+ Game — Plano diretor de retomada
Data-base: 17/10/2026 | Responsável por decisões: PO do projeto | Documento de planejamento, não certificação de release.

## 1. Fontes verificadas
- Repositório privado: https://github.com/andreheck/PilhaGameNR1
- Principal: https://pilha-plus-game-preview.vercel.app/
- main em 17/10: a33e0a65071e0ba529befbd6a0818a472c298390 (16/10); Vercel em produção READY nesse SHA; workflow GitHub Actions da main aprovado.
- PR 13: https://github.com/andreheck/PilhaGameNR1/pull/13, branch feat/investment-psychosocial-domains, head 69e3a209374def57b0b4549668e6c9da90afcf76, 53 commits à frente e 6 atrás da main, mergeable_state=dirty, draft, não integrada. Prévia Vercel READY em 17/10, sem comprovação de QA mobile. Primeiro workflow da PR 13 falhou; sucesso do deployment Vercel não prova sucesso da suíte.
- PR 11 (colisão), PR 12 (investimentos, com elementos da 11), PR 10 (brain de agentes): abertas em rascunho e exigem revisão de sobreposição; não mesclar em cadeia.
- Docs canônicos a considerar: AGENTS.md, README.md, TODO.md, docs/GDD.md, docs/ALPHA-14.md, docs/EXPERIENCIA-INTEGRADA.md, docs/CONTINUIDADE-INVESTIMENTOS-MANUS-CODEX.md, docs/ETICA-E-VALIDACAO.md.

## 2. Baseline — o que já existe
- Alpha 1.4 com central isométrica/3D e fallback 2D; cinco casos alpha 01–05; Caso 01 com investigação aprofundada e indicadores de 30 dias, Casos 02–05 compactos.
- Três GLBs animados otimizados (operadora, psicóloga, psiquiatra). Gestor-mentor tem GLB de protótipo. Colaborador personalizável não possui GLB definitivo: não criar substituto procedural como se fosse aprovado.
- Rotinas autônomas, estados narrativos, decisões protetivas/neutras/negativas, persistência local e testes na main.
- A PR 13 acrescenta, AINDA FORA DA MAIN: prólogo opcional, 10.000 créditos fictícios, investimentos em 12 domínios, previsões educativas, integração inicial à cena compartilhada, ajustes mobile.
- MAPA-MUNDO-MOBILIDADE-CUSTO-VIDA e SISTEMA-COLABORADORES-CURRICULOS-SALARIOS-MOTIVADORES foram ESPECIFICADOS em 17/10, não concluídos em código.

## 3. Norte de produto
PilhA+ é jogo educativo com perspectiva de liderança, RH/SST e trabalhadores, focado em fatores psicossociais ligados à organização do trabalho. Loop: observar -> escutar/investigar -> identificar/priorizar -> intervir -> acompanhar -> explicar consequências. A narrativa de gestão (empresa fictícia, ESG, orçamento e conselho) é ficção do jogo, não exigência legal universal. Diferenciar incidentes de segurança, riscos físicos e psicossociais sem misturar escopos.

## 4. Priorização
P0: estabilizar main + PRs, experiência fluida desktop/mobile, 3D/2D acessível, jornada Caso 01 completa no shell compartilhado, economia fictícia sem bugs, QA com evidência.
P1: melhorar Caso 02 e padronizar arquitetura de casos; segurança pedagógica e rastreabilidade de fontes; ampliar efeitos ambientais 3D sem perder performance.
P2: mapa costeiro, transporte/serviços, currículos, salários, contratação e propostas negociáveis. Primeiro validar modelo ético e de dados; não prometer implementação na próxima alpha. Não transformar contexto socioeconômico em atributo determinista individual.

## 5. Cronograma-base de 8 sprints (1h/dia útil do PO, ~5h/semana; trabalho de agentes adicional e variável)
| Sprint | Datas | Meta | Responsável principal | Evidência de aceite |
|---|---|---|---|---|
| S0 | 19–23/10 | Auditoria de PR 10–13, resolver conflitos, plano de integração sem merge em produção | Manus, PO | Relatório de diferenças, testes, PR candidata; decisão registrada |
| S1 | 26–30/10 | Arquitetura e linguagem da interface; onboarding opcional, mobile e acessibilidade | Claude + Manus | Fluxo e capturas 390x844, 1440x900; checklist de navegação |
| S2 | 02–06/11 | Investimentos e missão no shell 3D único, fallback e estado persistente | Manus + Claude | Compra/reload/dia 30 demonstráveis sem perda de progresso |
| S3 | 09–13/11 | Navegação segura, GLBs, melhorias e feedback ambiental | Manus | Rotas sem atravessar móveis; performance e erros documentados |
| S4 | 16–20/11 | Caso 02 aprofundado e motor comum de investigação/decisão | Manus + Claude | Cenário 02 com começo, decisão, consequência e retorno |
| S5 | 23–27/11 | Revisão técnico-pedagógica da NR-1 e conteúdo dos cinco casos | Perplexity + especialistas + PO | Matriz de afirmações, fontes, ajustes e pontos não validados |
| S6 | 30/11–04/12 | QA em mobile/desktop, privacidade, regressão e acessibilidade | Manus + Claude | Testes automatizados aprovados e testes reais documentados |
| S7 | 07–11/12 | Congelamento e demonstração de Alpha 1.5 candidata | PO + equipe | Checklist final, changelog, roteiro demonstrável e pendências da beta |

Datas são metas de referência, não compromissos. Se blockers de S0 não forem resolvidos, deslocar etapas seguintes em vez de fingir aprovação. Feriados e tempo de revisão externa impactam horas reais.

## 6. Entregas por agente
- Claude (UI/UX): docs/agents/CLAUDE-INTERFACE.md
- Manus (integração, código, testes, Vercel): docs/agents/MANUS-INTEGRACAO.md
- Perplexity (norma, evidências e pedagogia): docs/agents/PERPLEXITY-PESQUISA.md
- PO: valida design, identidade visual, pedagógico, escopo, orçamento Meshy, autorização de merge/deploy e registro de decisões.

## 7. Regras para evitar conflitos
1. Branch por entrega e PR descritiva; nunca gravar diretamente na main sem decisão explícita.
2. Manus coordena arquitetura e integração. Claude é dono da experiência, não reescreve simulação. Arquivo play.js é área compartilhada: combinar mudanças antes de editar.
3. PR 12 contém parte do trabalho da PR 11; PR 13 evolui investimentos da PR 12. Identificar o código atual e escolher uma linha de integração; NÃO mesclar 11 + 12 + 13 cegamente. PR 10 pode duplicar máquinas de estado da main.
4. Antes de decidir integração, atualizar branch com base atual, resolver conflitos, executar npm test, verificar checks e testes em navegador. A PR 13 não é mergeável no estado observado.
5. Não quebrar progresso legado/localStorage; documentar migrações e estados corrompidos.
6. Não criar novos personagens GLB procedurais para simular assets aprovados; preservar arquivos e direitos de uso de assets.
7. Sem merge ou produção sem autorização expressa. Preview não equivale a aprovação.
8. Registrar outputs com hash, URL, testes reais e problemas. Sem alegações de QA não realizado.

## 8. Checklist de saída Alpha 1.5 candidata
- [ ] Fluxo único de entrada -> missão -> Caso 01 -> decisão -> investimento -> avanço simulado -> resultado -> retorno.
- [ ] Casos 02–05 claramente rotulados quanto à profundidade; ao menos Caso 02 aprofundado.
- [ ] Tela de investimentos diferencia dados sintéticos de observações reais e não apresenta certeza causal.
- [ ] Compras inválidas não alteram saldo; persistência recupera estado após recarga e progresso anterior permanece.
- [ ] Sem erros críticos no console; npm test e workflow CI aprovados no SHA candidato.
- [ ] QA documentado em Android Chrome, Safari iOS e desktop (pelo menos 390x844 e 1440x900), com toque, teclado, foco visível, contraste, movimento reduzido e fallback 2D.
- [ ] Revisão das alegações NR-1/NR-17, termos e intervenções por especialista, com fontes oficiais identificadas.
- [ ] Nenhum diagnóstico individual, ranqueamento discriminatório ou inferência automática por bairro/classe.
- [ ] Aceite explícito do PO antes de merge/deploy.

## 9. Rotina de governança — 60 minutos úteis por dia
10 min: consultar PRs, CI, risco e prioridade única. 40 min: validar entrega, orientar agente e tomar decisões. 10 min: registrar status, bloqueios, evidência, próximo responsável e próxima ação.
Ritual de sexta: 1 resultado demonstrável, 3 riscos, 3 decisões, prioridade da próxima semana.
Status único: A FAZER / EM ANDAMENTO / EM REVISÃO / BLOQUEADO / VALIDADO. Nenhum "concluído" só porque um commit foi criado.
