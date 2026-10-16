# Continuidade para Manus / Codex — investimentos PilhA+ Game

## Estado atual
Branch: `feat/investment-psychosocial-domains`
PR: https://github.com/andreheck/PilhaGameNR1/pull/13
Não fazer merge nem deploy de produção sem autorização expressa do responsável pelo projeto.

## O que foi implementado nesta etapa
- Tela de entrada/apresentação em `index.html`: marca PilhA+, proposta educativa, três passos (observar, decidir, acompanhar), orçamento de 10.000 créditos e nota de limites.
- Estilo responsivo e acessível da apresentação em `play.css`, com respeito a `prefers-reduced-motion`; apresentação exibida uma vez por navegador e estado salvo em `pilha-welcome-alert-v1`.
- Catálogo com 12 domínios psicossociais e itens compráveis, preços, prioridade, descrição e efeitos educativos.
- Orçamento inicial de 10.000 créditos fictícios, saldo gasto, bloqueio de compra duplicada/sem saldo e persistência em localStorage.
- A tela de investimentos mostra indicadores sintéticos de carga, bem-estar, confiança e risco de saída.
- Botão de simulação avança o horizonte para o dia 30; previsões vencidas são registradas uma vez, os efeitos são aplicados aos indicadores e eventos aparecem no painel.
- Histórico da compra e indicadores permanecem no estado salvo localmente.
- Interface provisória com emojis/ícones; não foram criados assets exclusivos nem objetos 3D novos.

## Arquivos centrais
- `simulation/investment.js`: catálogo, estado, compra, persistência, previsão e avanço de dias.
- `play.js`: renderização da tela e ações de compra/avanço.
- `play.css`: cartões de domínios e indicadores.
- `tests/investment-system.test.mjs`: testes unitários e cobertura dos domínios.
- `package.json`: comando `npm test`.

## Próximas tarefas do agente
1. Fazer checkout da branch e ler os arquivos acima antes de editar.
2. Executar `npm test`; corrigir todos os erros e registrar a saída real dos testes.
4. Abrir a demo/preview da branch e testar a tela de investimentos no navegador desktop e mobile: orçamento inicial, compra, saldo insuficiente, compra duplicada, reload/localStorage, avanço de 30 dias, indicadores e eventos.
5. Verificar console, event handlers e layout; confirmar que o estado visual do mundo 3D permanece consistente após reload.
6. Rever o modelo de tempo: hoje há um botão que simula diretamente o horizonte de 30 dias. Evoluir depois para avanço diário/por turno e consequências intermediárias, sem quebrar dados salvos existentes.
7. Conectar as consequências a rotinas e personagens 3D apenas após inspecionar `world3d.js` e a arquitetura existente; reutilizar modelos existentes, não criar avatares procedurais para compensar assets ausentes.
8. Atualizar este documento e o PR com testes e problemas reais encontrados.

## Regras de produto e segurança
- Créditos e indicadores são fictícios e educativos; não são avaliação psicossocial validada, diagnóstico, promessa de efeito ou evidência de conformidade com NR-1.
- Prioridade do jogo não substitui avaliação técnica nem obrigações legais. Risco grave/iminente, assédio, violência, altura ou espaço confinado exigem proteção e encaminhamento adequado; nunca devem aguardar uma compra.
- Não representar sofrimento emocional como causa automática de demissão. Resultados dependem das decisões e condições simuladas, e intervenções protetivas devem ser caminhos válidos.
- Não declarar testes, QA de navegador ou deploy como concluídos sem evidência.
- Não fazer merge ou publicar em produção sem autorização explícita.
