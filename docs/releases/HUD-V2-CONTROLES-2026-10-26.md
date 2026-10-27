# HUD v2 — controles experimentais, 26/10/2026

Primeira fatia do bloco B, após CI/compatibilidade da PR #51. Ativa somente
com `?hud=v2`. A versão padrão, regras, relógio e saves são preservados.
Referência: `hud-v2-mock.html` recebido do PM; hierarquia aplicada aos
componentes reais, sem usar Ana/Rui ou valores fictícios do mock.

## Implementado nesta fatia

- Controles existentes reorganizados por `ui/hud-v2.js/css`: Menu, calendário
  desktop, saldo, índice/meta, pausa e avanço de semana.
- Dois retratos canônicos, papel principal/apoio e acesso direto à ficha.
  Poderes individuais não são executados pela empresa contínua: o texto
  visível é “Em breve”, com explicação acessível. Não apresenta recarga falsa.
- Setores com nome completo, índice, forma e estado textual usando os mesmos
  limites da cor atual (<40 / <65 / demais), sem fórmula nova de saúde.
- Menu modal nativo, Esc e retorno de foco; calendário e abertura dentro dele.
- Atalhos Espaço/N/M/H/?, desativáveis. Ignoram campos, combinações com
  modificadores, repetição e diálogos abertos.
- Preferências `pilha-hud-preferences-v1` catalogadas: expandido e atalhos.
  Leitura não sobrescreve registros inválidos; falha ao salvar é informada.
- Dupla continua visível ao recolher detalhes. Avisos ficam na parte inferior.
- Aviso semanal líquido desde a última semana observada, sem anúncios a cada
  tick. O valor junto ao saldo é o **próximo aporte semanal**, não lucro ou
  variação líquida: o histórico atual não fornece um saldo inicial semanal
  universal para saves antigos. Nenhum novo ledger financeiro é criado.

## Verificação

Testes unitários para flag, limites visuais, preferência inválida/bloqueada e
isolamento dos saves. Playwright/axe em 320×640, 390×844 e 1440×900: orçamento
de altura expandida, alvos 44px, foco, Esc, atalhos, input, contratação antiga,
receita semanal existente, recarregar preferência e progresso, estados de
alerta/evento/menu/setor. Capturas e relatório no artifact `hud-v2-qa`.

Resultados devem ser conferidos no CI desta PR antes de considerar a fatia
validada. Os testes padrão continuam verificando a página sem a flag.

## Ainda pendente no bloco B

- Folha setorial com três posições e alça arrastável/botões alternativos:
  preserva-se a folha atual nesta fatia.
- Fechar os ajustes de camadas de todos os diálogos legados; o HUD documenta
  a ordem, mas não altera em lote abertura, galeria e outras rotas.
- Estado real de poderes no HUD depende da integração C1; não transformar
  propostas PO de temporização em ações disponíveis.
- Revisão humana completa de contraste, leitores de tela e Windows alto
  contraste. Axe não equivale a essa validação.
- V2 como padrão, merge e publicação dependem do PM; nenhuma promoção aqui.
