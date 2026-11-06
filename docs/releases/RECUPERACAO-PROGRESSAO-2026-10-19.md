# Recuperação da entrega e progressão dos especialistas
## Diagnóstico verificado
A rodada anterior ficou registrada na branch `feature/shareholder-timeline-kimi`, SHA `e955638f396f49d2b1ff83e74c530303768abbb8`. A versão pública ainda apontava para a etapa anterior de duplas (`c319fb3`). Não houve perda dos arquivos: faltou fechar a publicação e entregar a confirmação ao usuário. Na retomada, uma sessão remota já encerrada precisou ser restaurada. Os logs também mostram timeout na captura de tela do executor; os testes funcionais da prévia, executados sem aquela captura, tinham passado. Isso não prova a causa da pausa relatada no dispositivo do usuário.

A suíte do código recuperado foi executada novamente antes de novas alterações e passou. A arquitetura e as fichas dos colaboradores foram preservadas: Diretor, Cientista de Dados e Engenheiro de Segurança constam na revisão PR22 `a7660cb`; não se voltou às fichas antigas nem às cinco pequenas salas.

## Recuperado e mantido
- Abertura referenciada no código/arte do PilhA+ App: órbitas contínuas 20/18/14s, contador de frames em primeiro plano, suspensão respeitada e entrada no WebGL somente após fechar a abertura.
- Faixa permanente da dupla e do relógio, jogador acionista, poderes temporizados do Diretor, painel de conceitos dos demais perfis.
- 7 dias por hora; fechamento aos 30 dias em 4h17min09s ativos; sem salto instantâneo, com pausa e persistência.
- Revisão Kimi original preservada, triagem separada, flags éticas que impedem aprovação por soma de pontos em escolhas de exposição/sigilo; domínios SST classificados sem chamar tudo de psicossocial.

## Implementação nova
- Botão **Evoluir heróis** sempre disponível na faixa do salão.
- Seis fichas com nível, XP conquistado, formação e preço de +1 nível; cancelamento/confirmacão explícitos.
- Saldo compartilhado com inventário, gravação atômica, cotação protegida por nível esperado e erro de armazenamento sem compra falsa.
- 25 XP por situação adequada confirmada; 150 XP após plano aprovado e ciclo completo; primeiros eventos por caso/herói, sem duplicação no replay.
- Níveis persistidos e exibidos na dupla, na seleção e no painel de habilidades. Crescimento máximo de protótipo: 30.
- Fator limitado por nível capturado na ativação dos poderes executáveis do Diretor. Não acelera o relógio, não torna habilidades permanentes e não cria poderes ausentes.
- Estruturas reiniciadas não apagam formação/XP. Animação do salão pausa atrás de diálogos nativos e com a aba oculta, evitando gastar GPU em conteúdo coberto; o relógio segue sua própria regra de tempo em primeiro plano.
- Arquitetura de elétrons do App documentada; nenhuma conexão/dado pessoal importado.

## Evidências e limites
Suíte anterior mais sete testes de progressão/economia/recompensas/snapshots. Ensaios de tempo longo usam deltas controlados no motor puro; NÃO houve sessão humana contínua de 4h17. QA de navegador em `docs/qa/evidence/progression/` identifica viewport, erros, passos, capturas obtidas e limitações do executor. Emulação Chromium não substitui testes em aparelhos Android/iOS reais ou revisão de acessibilidade assistiva.

O motor usa parâmetros fictícios e determinísticos. Kimi não validou cientificamente o modelo novo. Preços e XP são uma primeira calibração testável e precisam de validação do PO. localStorage não é carteira financeira ou mecanismo antifraude; não há checkout/cobrança em reais.

## Continuidade
Leia `docs/PROGRESSAO-HEROIS-2026-10-19.md`, `docs/MOTOR-ESTATISTICO-TEMPORAL.md` e `docs/INTEGRACAO-ELETRONS-PILHA-APP.md`. Claude preserva nomes, níveis e tempos visíveis; Manus valida sessão longa/estado/ledger; Kimi revisa coerência e incentivos; André testa investimento, cancelamento, XP e retomada em aparelho real. Não mesclar automaticamente PRs antigas ou alterar o App para criar uma recompensa ainda não aprovada.

### Resultado observado no ambiente de desenvolvimento
Chromium 1440×900 e 390×844 confirmaram movimento orbital em 20 amostras antes de qualquer GLB; dupla persistente; seis cartões de formação; cancelamento sem débito; formação por 500 créditos; XP da dupla; replay sem repetição; plano concluído sem bônus final antes de 30 dias; níveis/XP/tempo pausado restaurados; compra estrutural de 1.800 depois da formação, deixando 7.700. Nenhuma exceção JavaScript nos fluxos exercitados. A captura de tela desktop apresentou timeout no executor; o reteste funcional sem captura passou. A captura mobile foi obtida. Não tratar o timeout como evidência de congelamento permanente no dispositivo do usuário.
