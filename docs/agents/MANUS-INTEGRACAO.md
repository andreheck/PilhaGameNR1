# Instruções de continuidade — Manus (Engenharia e Integração)
Data-base 17/10/2026 | Papel: engenharia, integração controlada, testes, qualidade técnica, previews.

## Contexto verificável
Repo privado https://github.com/andreheck/PilhaGameNR1
main a33e0a65071e0ba529befbd6a0818a472c298390; Vercel principal READY na main; CI main passou.
PR 10 living-office baseada em branch antiga (pode duplicar machine de estados);
PR 11 colisão segmentada, rascunho;
PR 12 orçamento e upgrades, rascunho, inclui código associado à 11;
PR 13 narrativa + 12 domínios + investimentos, rascunho, head 69e3a209374def57b0b4549668e6c9da90afcf76, mergeable_state dirty, 53 commits à frente/6 atrás main, preview Vercel READY, workflow inicial da PR falhou. Verificar estados atualizados antes de decidir.
Documentos MAPA-MUNDO... e SISTEMA-COLABORADORES... da PR 13 são ESPECIFICAÇÕES, não funcionalidades comprovadas.

## Primeira missão — estabilização, ANTES de mais features
1. Examinar base main, diffs PR 10/11/12/13, conflitos, changelog, dependências e arquivos alterados. Identificar intersecção world3d.js / play.js / simulation/navigation.js / simulation/investment.js. Registrar matriz conservar/descartar/reimplementar.
2. Identificar se branch PR 13 deve ser atualizada/rebaseada ou se é melhor criar uma branch limpa de integração a partir da main. Não fazer merge automático de PRs sobrepostas.
3. Executar comandos reais: npm test, node --check nos JS de fluxo/motor, git diff --check; registrar SHA, saída, data, erros e correções. Validar CI do SHA candidato.
4. Testar manualmente preview em desktop e mobile com evidência de navegação, renderização GLB, compras, créditos, projeção dia 30, persistência, fallback 2D, console e performance. Não afirmar testes de navegador feitos se não foram.
5. Apresentar relatório de bloqueios e PR candidata para aprovação PO, sem merge e sem produção.

## Segunda missão — vertical slice íntegro
- Garantir entrada -> missão no shell compartilhado -> seleção de Caso 01 -> evidências -> decisões -> feedback -> investimento -> evolução de 30 dias -> resumo, tudo sem navegação quebrada e sem apagar dados legados.
- Preservar chaves de localStorage e implementar migração explícita/versionada quando necessário. Testar estado limpo, legado e corrompido.
- Compartilhar um motor de casos, separando dados de narração de UI e da simulação; Caso 02 precisa de roteiro mais rico antes dos demais.
- Integrar investimentos sintéticos: 10.000 créditos iniciais locais, catálogo de 12 domínios, confirmação, não duplicação, saldo >=0, histórico e previsões educativas. Corrigir colisão nos movimentos com proteção por segmento e testes.
- Aprimorar gradualmente efeitos visuais 3D das intervenções, usando GLBs compatíveis e mantendo carga de renderização reduzida e fallback 2D.
- Guardar variáveis de simulação em módulo isolado, com casos neutro/positivo/negativo; não misturar pontuação do quiz com avaliação real de saúde.

## Colaboração
Manus é dono de simulation/*, world3d.js, testes, build/CI e contratos com play.js. Claude é dono da linguagem/UX em index.html, play.css e componentes de apresentação; play.js é compartilhado. Fazer acordos por interface, tickets e PRs pequenas antes de edições concorrentes. Não reescrever a UI sem necessidade; não alterar decisões editoriais do PO.

## Guardrails
- Não inventar dados reais de saúde ou perfis profissionais; não usar dados pessoais reais.
- Nenhuma classificação diagnóstica, comprovação automática NR-1/GRO/PGR, causa automática de adoecimento, punição por afastamento ou estereótipos baseados em bairro, renda ou aparência.
- Proteção em riscos graves não pode ficar condicionada à compra de upgrade.
- Não criar avatar 3D procedural substituindo o colaborador customizável sem autorização/modelo aprovado.
- A etapa de mapa urbano e sistema de currículos/salários é backlog Beta, não compromisso da Alpha 1.5.
- Não realizar merge, deploy de produção ou gasto de créditos Meshy sem aprovação explícita.

## Aceite a apresentar ao PO
- Matriz de branches e proposta de integração.
- Testes e links de CI do SHA final, logs verdadeiros.
- Capturas reais 390x844 e 1440x900, lista de cenários QA e console.
- Notas sobre performance/GLB/colisão e acessibilidade.
- PR revisável, changelog, riscos remanescentes, sem publicação não autorizada.

## Pedido inicial sugerido
"Audite a main e PRs #10–#13 do PilhaGameNR1; proponha estratégia sem merge automático, reproduza os testes e prepare um plano de integração verificável. Priorize o fluxo vertical 3D/fallback, investimentos sintéticos e QA; reporte bloqueios e não publique em produção."
