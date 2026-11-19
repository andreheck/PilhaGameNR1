# Trajetos, pausas e pátio — integração de 24/10/2026

## Escopo solicitado pelo PM
Corrigir o mapa cortado no cabeçalho e concluir trajetos → pausas → pátio → efeitos temporários. A branch mostrada no print contém contribuições posteriores de mobiliário, pessoal e finanças. Integração preserva essas contribuições de `origin/fix/revenue-produced-worker-health` (`75c5b23`) e o cabeçalho/gestão/receita da PR41 (`5a40ad7`). Sem merge na branch de destino ou promoção para produção.

## Funcionamento
- Cabeçalho ocupa sua própria linha; canvas mede somente o espaço abaixo. Visão geral reserva margem de14% e enquadra os quatro ambientes completos. Aproximar/arrastar continua disponível, assim como voltar à visão geral.
- Cada funcionário ativo percorre um ciclo determinístico a cada dois dias simulados: saída do corredor de origem, passagens entre departamentos, espaço de pausa e retorno pelo mesmo trajeto. Dentro do setor percorre os corredores existentes. Não cria um NPC extra ao sair.
- Rota calculada sobre o grafo de corredores e pontes existentes, com interseções nas portas; trechos ortogonais. Trabalho termina/inicia no mesmo ponto de saída, sem salto entre ciclos. Layout horizontal/vertical recalcula o grafo.
- Pátio básico oferece descanso mesmo sem mobiliário. Compras maduras distribuem visitas por biblioteca, bosque, meditação, auditório e pátio. Rodízio escalonado limita a seis deslocamentos/pausas simultâneos, inclusive com novas contratações; afastados/desligados não circulam.
- Escala de tempo acelerada do protótipo preservada:120s reais por semana. Frações do ciclo:12% ida,8% pausa,12% volta,18% benefício residual; restante em trabalho. É ritmo visual de jogo, não recomendação de jornada ou duração real de pausa. Mais de16 atores reduz proporcionalmente as janelas para preservar cobertura.
- Saúde exibida = saúde de base + bônus temporário, limitada a100. Ambiente:1 básico + qualidade das melhorias maduras (máximo4); convívio: contribuição relacional das melhorias (máximo3) e1 por companhia no mesmo espaço. Total máximo8. Ativo na pausa, retorno e breve período residual; expira antes da próxima pausa, sem empilhamento e sem gravar o acréscimo na saúde base.
- Carga e relações do setor recebem a média transitória dos benefícios dos seus integrantes. Ficha mostra saúde de base, bônus e atividade. Personalidade não determina saúde.
- Calendário, pausa manual, abas e save usam o mesmo tempo persistido. Rotina derivada não exige migração destrutiva nem crédito retroativo. Mantidos efeitos semanais de gestão, visitas legadas, eventos, compras e progresso.
- Receita de produção e aporte de investimento são rubricas distintas: faturamento variável da equipe preservado +500 de investimento e250 por épico. Testes contabilizam ambos. Corrigido teto de1bilhão também na entrada de faturamento.

## Verificação
Suítes de regressão existentes e testes de ciclo por identidade, cobertura, bônus/expiração, pureza dos dados, grafo nos dois layouts e motor real durante dois ciclos sem coordenadas inválidas. QA de navegador verifica cinco resoluções, mapa abaixo do cabeçalho e limites projetados dos quatro ambientes. Resultados finais e links de execução registrados na PR41; não tratar configuração como homologação.

Evidência local: `docs/qa/npcs-fase1/rotinas-mapa-desktop.png`.

## Limitações / próximas entregas
Artes individuais aprovadas continuam nas fichas; esta entrega usa os atores existentes do mapa. Rigs/GLBs e novos sprites individuais não fazem parte deste pedido. Ainda faltam avaliação humana do ritmo, dispositivos físicos/Safari, leitor de tela, contraste formal, zoom200% e sessão longa. A simulação não é avaliação clínica ou comprovação normativa.
