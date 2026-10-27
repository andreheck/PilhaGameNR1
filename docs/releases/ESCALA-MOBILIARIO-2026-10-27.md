# Escala e diversidade do mobiliário — 27/10/2026

Base: codex/mundo-continuo, db52714 (PR #53). Escopo adicional autorizado pelo PM: escala, mais diversidade, esteira animada, geladeira/televisão e melhor disposição. Movimentação e atividades sociais serão a próxima PR, empilhada nesta.

## Resultado

Régua configurável em furniture-visuals.js/json: célula de 1 m e adulto de referência de 1,70 m. Cada uma das 25 artes existentes tem dimensões, recorte alfa medido, âncora, pontos de interação e orientação. Alturas são hipóteses visuais revisáveis, sem efeito econômico ou de saúde.

Módulo ui/furniture-presentation.js desenha os móveis conforme a régua e dispõe os itens em áreas livres. Corredores, portas e aproximações de descanso ficam livres. Melhorias compatíveis renovam móveis existentes, evitando mesas duplicadas; cada compra mantém sua identidade/efeito e âncora para o poof. Teste de lotação máxima não permite objetos ocultos ou sobrepostos.

Copa básica de Restauração: geladeira, televisão informativa animada e bancada de café com vapor discreto, desenhadas em canvas no estilo isométrico. Não são imagens atribuídas a um artista nem novas melhorias compráveis. Não concedem bônus. A esteira recupera o movimento das faixas/caixas do desenho original que estava encoberto pelo sprite estático. Pausar congela a animação; movimento reduzido congela os detalhes decorativos.

O desenho raster foi retirado do patch de build e passou para um módulo real. O adaptador anterior mantém apenas metadados de instalação/carregamento/API compatível; não foram criados novos patches de renderização.

## Conferência

?debug=scale abre laboratório somente de leitura, com 28 itens e adulto/régua de referência. Não inicializa, migra ou altera partida. Capturas antes: artefato da PR #53. Capturas depois: CI desta PR, relatório em artifacts/furniture.

Build e 224 testes aprovados localmente. Novos testes: dimensões e proporções por categoria, recortes/âncoras, igualdade JSON/JS, lotação inicial/máxima com circulação livre, disposição idempotente e recuperação da esteira. CI acrescenta laboratório/empresa/copa em 1440×900, 390×844 e 320×640, circulação, axe e lotação máxima. Resultados finais e capturas registrados na PR.

## Limitações e pendências

Pontos sitPoint/standPoint são metadados de interação; esta PR não cria comportamento de sentar nos postos. Sem GLBs novos. Copa e TV são geometria procedural; aprovação estética e aparelho físico pendentes. Ajuste de cadência/velocidade, conversas e reunião semanal do gerente seguem na próxima entrega autorizada. Relógio, economia, IDs, receitas, saúde e progresso preservados.

Nenhuma chave localStorage nova, nenhuma migração. PR para revisão; sem merge, promoção ou alteração do alias público.
