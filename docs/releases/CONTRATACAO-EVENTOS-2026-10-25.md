# Contratação inicial, mobiliário e eventos — 25/10/2026

Entrega solicitada pelo PM na continuidade da PR #41, branch `codex/npcs-fase1-perfis`. Sem merge. Atualização destinada exclusivamente ao projeto Vercel de testes já autorizado.

## Comportamento
- Nova partida: abertura → explicação → dois heróis → contratação de três gerentes (um por setor) → contratação de três funcionários distintos → mapa com seis pessoas. Cards usam retratos aprovados, nomes, personalidade, forças e condições de apoio canônicos.
- As seis admissões iniciais estão incluídas: sem desconto de capital ou folha adicional. Outras dez pessoas canônicas ficam disponíveis para contratação no menu de gestão, com o padrão de entrada já existente de 900 créditos +140/semana e integração na semana seguinte. Não se duplicam identidades. Os oito candidatos adicionais existentes continuam disponíveis.
- Gerentes escolhidos são persistidos e passam a reger o organograma, reporte e efeitos semanais −5/+7. Gerentes canônicos anteriores tornam-se especialistas táticos quando outro gerente é escolhido naquela nova partida. Partidas existentes conservam gerentes, equipe, saúde, histórico, dinheiro e melhorias.
- Sem redefinição de equipe nem retorno assistido gratuito: afastamentos e desligamentos existentes seguem suas regras. NPC não contratado não anda, não recebe efeitos de saúde e não se afasta antes de trabalhar.
- Cabeçalho sem fundo sólido, compacto; Menu abre controles secundários, seta recolhe indicadores para ampliar mapa sem redefinir zoom. Controles essenciais de tempo permanecem disponíveis enquanto expandido.
- Eventos seguem a composição do anexo: ícone existente do catálogo, urgência/categoria, título/contexto, chips de impacto, proteção real e opções com custo/efeitos. Preservados catálogo, transações, prazos, pausa, orçamento e resposta gratuita. Não inventado bônus da Psicóloga mostrado apenas como exemplo na imagem: proteção atual válida usa a melhoria realmente adquirida.
- Cinco PNGs transparentes gerados a partir da mesa de referência: máquina, esteira, estante industrial, bancada e estação de atendimento. Total25 sprites. Arte básica não constitui compra nem concede benefício. Níveis/efeitos/Poof de compras preservados. Manifesto registra procedência; não confundir novas artes geradas para teste com o kit original20 aprovado.

## Validação e limitações
Testes incluem nova equipe, escolhas inválidas, hierarquia dinâmica, candidato fora das rotinas, admissão adicional/folha idempotente e migração sem reset. QA de navegador existente ampliado para contratação, quadro legado completo16, cinco sprites, cabeçalho compacto/recolhível e apresentação/decisão dos eventos em cinco resoluções. Resultado final e artefatos na PR.

Validação visual local pela ferramenta de navegador bloqueada pela revisão automática por falta de créditos do workspace; ação não executada e bloqueio não contornado. CI do repositório permanece a via padrão de regressão automatizada. Homologação em aparelhos físicos/Safari e sessão humana longa continuam pendentes.

Cartas de contratação exibem personalidade como narrativa: não determinam saúde ou desempenho. As dez vagas remanescentes mantêm a pressão organizacional existente; o início com seis pessoas requer expandir equipe/cobertura. Alterações futuras de balanceamento e XP contínuo ficam no backlog.
