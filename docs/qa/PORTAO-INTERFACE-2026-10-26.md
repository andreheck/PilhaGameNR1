# Portão de interface e acessibilidade — 26/10/2026

Entrega A.2 de infraestrutura, após o mapa da PR #49. Base local
`codex/unificacao-mapa-2026-10-26`, `2cb4e99`. Não modifica regras de jogo,
chaves persistentes nem layouts. Não executa merge ou deploy manual.

## Portão automatizado

`.github/workflows/test.yml` passa a exigir:

1. Build, `npm test` e todos os arquivos `tests/*.test.mjs` com Node 22.
2. Chromium/Playwright 1.57.0 e axe-core 4.10.3, instalados somente no CI.
3. Auditoria WCAG A/AA (2.0, 2.1, 2.2) em 390×844 e 1440×900.
4. Dez telas por tamanho: início, apresentação, heróis, contratação de
   gerentes, contratação de equipe, mapa, gestão, resultados financeiros,
   evento e consequência. Cada tela gera PNG e JSON completo do axe.
5. Falha com qualquer violação serious/critical, exceção JavaScript,
   fluxo incompleto ou overflow horizontal na página do mapa.

Relatórios incompletos do axe são preservados para revisão humana. Uma tela
não implementada não conta como aprovada: a retrospectiva de ciclo consta
explicitamente no relatório como pendente. Resultados financeiros não são
equivalentes à retrospectiva de decisões do bloco C2.

Os arquivos ficam no artifact `accessibility-qa` por sete dias, inclusive
quando o teste falha. A workflow de regressão da empresa continua validando
movimentação, câmera, pausa, contratações, calendário e finanças em cinco
resoluções. É necessário configurar os checks como obrigatórios nas regras
de proteção do tronco; a existência da workflow não altera proteção de branch.

## Verificação local

Os 213 testes passaram após normalizar CRLF no harness da missão introdutória.
O teste mantém as mesmas verificações de pontuação, aprovação e persistência.
Compilação sintática do script Python e `git diff --check` executadas.
Resultados de navegador/axe serão registrados a partir do CI, sem atribuir
um resultado visual a uma execução que ainda não ocorreu.

## Roteiro manual ainda não executado

| Ambiente | Roteiro | Resultado |
|---|---|---|
| NVDA + Firefox, Windows | Abertura → dupla → contratação → mapa → evento; títulos, nomes, Tab/Shift+Tab, Esc, foco devolvido | Pendente |
| VoiceOver + Safari, iOS | Mesma jornada por gestos, rotor e leitura de alterações | Pendente |
| TalkBack + Chrome, Android | Mesma jornada, exploração por toque e anúncios | Pendente |
| Windows alto contraste | Controles, bordas, estado textual e legibilidade do mapa/lista | Pendente |
| Teclado sem leitor | Sem armadilha; foco visível e retorno ao disparador em cada modal | Pendente |

Para cada execução manual registrar data, versões do sistema/leitor/navegador,
passo, resultado esperado/observado e captura quando útil. Não preencher
“passou” a partir do axe: leitores, navegação e equivalência do canvas exigem
verificação própria. Alternativa textual do mapa, estados sem depender de cor
e ajustes visuais pertencem às entregas B/C4 e continuam no backlog.
