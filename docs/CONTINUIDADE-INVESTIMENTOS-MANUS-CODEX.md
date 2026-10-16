# Continuidade para Manus / Codex — investimentos PilhA+ Game

## Estado atual
Branch: `feat/investment-psychosocial-domains`
PR: https://github.com/andreheck/PilhaGameNR1/pull/13
Não fazer merge nem deploy de produção sem autorização expressa do responsável pelo projeto.

## O que foi implementado nesta etapa
- Apresentação narrativa text-first de cinco telas no início do jogo: missão, venda fictícia da empresa e requisitos ESG/conselho, pessoas e riscos psicossociais, orçamento de 10.000 créditos, e horizonte de 30 dias. A seleção de imagens fica para uma etapa posterior.
- Navegação por botões, pontos de progresso, avançar/voltar, pular, fechar e teclas de seta/Escape. A nova versão é identificada por `storyVersion: 2` para reaparecer a usuários que já viram a apresentação anterior.
- Identidade visual usa o logotipo e símbolo do repositório `andreheck/pilha-plus-pwa-preview` por URLs raw do GitHub; CTAs amarelos, ilustrações estilizadas em CSS e layout responsivo.
- Decisão de escopo: a narrativa inicial é intencionalmente textual nesta etapa. Depois, localizar assets oficiais compatíveis e associá-los às telas; não gerar avatares procedurais como substitutos.
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


## Atualização de usabilidade mobile e prólogo integrado (2026-10-16)
- O prólogo de gestão do conhecimento agora aparece dentro da tela inicial do jogo, com resumo da narrativa de venda/ESG, ciclo Observar → Conhecer → Decidir → Acompanhar, recursos iniciais de 10.000 créditos e horizonte simulado de 30 dias. O leitor pode abrir a sequência completa dos cinco reels por um botão, em vez de receber uma tela/modal automaticamente em cada visita.
- Ajustes de CSS para mobile: layout sem overflow horizontal, cena 3D com altura limitada e responsiva, rótulos de setores com quebra de linha, barra de eventos legível, painel integrado ao fluxo da página (sem sobreposição sobre 60% do canvas), navegação inferior de seis áreas e safe-area para iOS.
- Commits desta etapa: `298c4b688d72ea63c3b6fdde8f716bf5ef2ebbfc` (prólogo integrado em `play.js`); `ff2c2281b943dfecae3d7e45956268af5acd0ded` (ajustes de `play.css`).
- Não declarar resolvida a experiência mobile sem teste real em Safari iOS e Android. Verificar canvas GLB/câmera/touch, alvos clicáveis, scroll da página e do painel, todos os seis destinos da navegação, modal da história aberta manualmente, orientação retrato/paisagem, viewport 320–430 px e console sem erros.
- A apresentação completa continua disponível como leitura opcional; os quadros ainda são text-first, aguardando seleção de assets de personagens existentes.


## Prioridade operacional seguinte — mobile-first QA
1. Confirmar que o CSS de mobile não mantém o painel fixo por cima do canvas. Painel deve ficar no fluxo vertical; cenário deve permanecer visível e com altura previsível.
2. Navegação inferior em linha única, com rolagem horizontal quando necessário e alvos táteis confortáveis; verificar seis destinos (Visão geral, Casos, Equipe, Investimentos, Biblioteca, Progresso).
3. Testar iPhone Safari e Android Chrome em 320, 375, 390 e 430 CSS px, retrato e paisagem. Validar toque nos setores/personagens, zoom/pan da câmera, rolagem do documento, abrir/fechar prólogo e navegação entre abas.
4. Executar `npm test` localmente ou em CI; registrar resultado real e corrigir regressões. Não declarar teste de navegador executado sem evidência.
5. Conferir acessibilidade: contraste, foco visível, labels, reduced motion e safe area iOS.
6. Depois do mobile, revisar interação de investimento: orçamento 10.000 por navegador, cards/preços/potencial estimado, compra persistente, toast e feedback de setor.
7. Nenhum merge nem publicação em produção sem autorização explícita.
