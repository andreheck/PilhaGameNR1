> Atualização de 19/10/2026: o jogador é o acionista; a dupla permanece visível; o ciclo usa 7 dias simulados por hora e 30 dias por missão. Regras e hipóteses em [motor temporal](MOTOR-ESTATISTICO-TEMPORAL.md). Poderes não documentados continuam pendentes. A seção abaixo descreve a base histórica preservada.

# PilhA+ — Visão Canônica Atual (18/10/2026)
## Fonte de verdade
A evolução de produto mais recente precede conceitos antigos: o PilhA+ é uma simulação de gestão viva, socioespacial e educativa, na qual o jogador observa o trabalho, escuta pessoas, investiga, intervém, investe e acompanha consequências. Decisões do GDD e das sessões Alpha 1.0–1.3 são histórico, não instruções para recriar comportamentos substituídos.

## Decisões irrevogadas até nova validação do PO
1. Ambiente 3D isométrico compartilhado com alternativa 2D, cinco casos identificados 01–05 e progressão preservada.
2. Navegação de produto: Casos, Equipe, Investimentos, Biblioteca, Progresso. O prólogo educativo é opcional em Casos; não reintroduzir aba Visão geral.
3. Financiamento fictício: 10.000 créditos, 12 domínios de melhoria, previsões educativas de 30 dias, efeitos visuais claros, ações protetivas e estado empresarial persistido; não confundir simulação com diagnóstico ou certificação.
4. Mundo costeiro em zonas legíveis com porto/logística, bairros diferenciados, centro comercial, parque/lagoa, saúde/serviços e transporte. Mobilidade e acesso a serviços são variáveis de contexto, nunca determinação de competência ou estado mental.
5. Currículos com competências, experiências, 3 faixas salariais configuráveis, motivações, remuneração e pacote negociável, benefícios, resposta de aceite/contraproposta/recusa, acompanhamento organizacional e limites éticos. **Estão especificados; ainda não implementados no jogo.**
6. Identidade de personagens isométricos 3D estilizados; modelos GLB existentes são preservados. Não inventar novos GLBs para substituir artistas/personagens ainda em desenvolvimento.
7. Investigação aprofundada dos Casos 01 e 02 deve ser portada ao mesmo shell, não descartada; suas rotas anteriores podem continuar como compatibilidade até a migração funcional.
8. Diferenciar risco psicossocial relacionado ao trabalho, riscos físicos e ergonomia. Intervenções graves e iminentes não podem ser condicionadas a aquisição fictícia.

## Código conciliado na branch
Branch `integration/pilha-current-vision`, criada da `main` em `a33e0a65071e`. Os módulos mais recentes de investimentos e detecção de colisões foram incorporados; `play.js` incorpora investimento e prólogo preservando `simulation/company-state.js` e IDs 01–05. `world3d.js` integra a navegação recente e feedback de upgrades com IDs 01–05. `index.html` preserva fallback 2D e acrescenta apresentação opcional, `play.css` inclui estilos responsivos e os estilos do fallback. Em todos os casos, requer inspeção do CI e QA do navegador: código integrado **não é sinônimo de versão validada**.

## Não reimplantar legado
- IDs 017–021, progresso reindexado sem migração, aba Visão geral antiga, links compulsórios para páginas separadas ao iniciar um caso.
- Silenciar os efeitos da gestão global ou eliminar o fallback 2D.
- Exibir documentos de cidade/recrutamento como funcionalidade já jogável.
- Questionários estáticos como substitutos do loop de decisões e consequências.
- Diagnóstico clínico ou inferência de capacidade, saúde ou valor de pessoas por bairro, renda, raça ou deficiência.

## Governança e próximas entregas
**Manus:** fazer CI e QA da PR de integração, revisar migrações, checar colisões, GLBs, persistência, feedback e navegação. Primeiro resolver bugs, depois iniciar dados de cidade e contratação.

**Claude:** revisar a interface reconciliada (390×844 e 1440×900); entregar UX para mapa costeiro, seleção de bairro/transporte, currículos, pacotes remuneratórios, contraproposta e efeitos sobre personagens.

**Kimi:** auditar NR-1, NR-17 e fundamentos de medidas preventivas; diferenciar hipóteses de jogo de informação normativa/empírica, especialmente para o sistema socioespacial e de emprego.

**ChatGPT Grátis — André (novo agente, disponibilidade diária):** QA exploratório independente com execução humana do André; teste de navegação, casos, investimentos, 3D/2D, linguagem e acessibilidade. Registra bugs reproduzíveis com URL/SHA, navegador e evidência; encaminha implementação ao Manus, ajustes visuais ao Claude e dúvidas de fundamento ao Kimi. Não tem autonomia para editar GitHub/produção. Guia: `docs/agents/CHATGPT-GRATIS-ANDRE-QA.md`.

**Coordenação:** decidir prioridades e validar antes de merge na main ou deploy de produção. PR #13 e PRs históricas #10–#12 continuam sem merge automático.

## Referências
- `docs/MAPA-MUNDO-MOBILIDADE-CUSTO-VIDA.md`
- `docs/SISTEMA-COLABORADORES-CURRICULOS-SALARIOS-MOTIVADORES.md`
- `docs/DOMINIOS-DE-INVESTIMENTO-PSICOSSOCIAL.md`
- `docs/PLANO-DIRETOR-2026-10-17.md`
- `docs/agents/CHATGPT-GRATIS-ANDRE-QA.md` e `docs/qa/CHECKLIST-DIARIO-ANDRE.md`
- `docs/agents/{CLAUDE-INTERFACE,MANUS-INTEGRACAO,KIMI-PESQUISA}.md`
