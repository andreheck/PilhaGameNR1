# Equipe viva, abertura, calendario e mundo PilhA+

Pedido autorizado pelo PM em 23/10/2026. Base publicada: 32501c7. Nova branch feat/equipe-viva-calendario; sem merge na main.

## Entrega
- Restaurar abertura PilhaIntro -> explicacao -> dupla, sem alternador de animacao.
- Movimento automatico de 16 identidades NPC-01..NPC-16; selecionar no mapa abre ficha de saude simulada, setor, atividade, variacao e contexto. Lista vertical da maior para a menor saude.
- Sons suaves de notificacao via WebAudio, somente apos gesto real do jogador; restricoes do navegador permanecem respeitadas.
- Tempo decorrido continua em outra aba e durante consultas; somente pausa manual congela. lastWallMs persistido e Web Locks evitam contabilizacao duplicada entre abas. Suspensao do navegador e reconciliada ao retornar; nao existe processamento em servidor com navegador fechado. Recuperacao em lotes, sem descartar tempo.
- Calendario ficticio: origem 23/10/2026 08:00 UTC, uma semana/120s reais. Relogio visivel, progresso semanal, mes navegavel e dia atual destacado. Datas sao narrativas, nao agenda real.
- Botao O mundo corporativo de PilhA+: proposta, regras, seis herois, 16 NPCs, Heck e Leticia da biblioteca como especiais, catalogo dos19eventos somente leitura. Removido catalogo de testes do HUD; alerta pendente continua acessivel.

## Saude: balanceamento de jogo, nao evidencia clinica
Estado no mesmo registro continuo, sem alterar saldo, recibos, XP ou saves legados. Inicial = clamp(70+(indiceSetor-50)*0.35). Por semana, alvo = clamp(30+indiceSetor*0.65+bonusRestauracao ate8). Saude aproxima20% da diferenca para o alvo. Escala0..100, saudavel>=70, atencao>=45, cuidado<45. Personalidade, idade e aparencia nao entram no calculo. Usar somente para orientar apoio a personagens ficticios.

Fonte das identidades: feat/npc-balanceamento-contextual/data/npcs/catalogo-v1.json. Oito idades ainda ausentes no registro ficam null. Setores atribuidos por narrativa, nao aptidao psicologica.

## Limites
Avatares compactos e personagens do mapa sao representacoes procedurais; nao afirmamos ter aplicado a arte final/modelo3D de todos16. Retratos oficiais dos seis herois e dos mentores foram preservados. Rodizio para restauracao continua por reposicionamento semanal, sem trajeto completo posto-recurso-retorno. Nao implementa calendario de compromissos reais. Decisoes pendentes nunca sao respondidas automaticamente; novos eventos aguardam resolucao do atual. Tempo avanca sem suspender a partida por popup.

## Validacao
npm test; npm run test:continuous; npm run test:living; Chromium tools/qa-company-living.py. Capturas e relatorio no artefato living-qa. Resultado final e SHA de publicacao registrados na PR apos QA.
