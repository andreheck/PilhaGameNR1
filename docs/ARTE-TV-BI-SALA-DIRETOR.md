# TV de BI da sala do diretor — pacote de arte

## Entrega local desta rodada
Foram exportados quatro PNGs individuais com transparência e quatro GIFs animados, todos em canvas 768 × 512:

- `tv_bi_novo.png` / `tv_bi_novo.gif`
- `tv_bi_usado.png` / `tv_bi_usado.gif`
- `tv_bi_precario.png` / `tv_bi_precario.gif`
- `tv_bi_sucateado.png` / `tv_bi_sucateado.gif`

Os PNGs têm canal alfa e os GIFs têm ciclos animados. O pacote ZIP e a prévia foram entregues na conversa. Os binários ainda não foram adicionados a este repositório.

## Revisão de qualidade — ressalvas antes da integração
- Os estados novo/usado/precário mantêm enquadramento frontal isométrico semelhante.
- O estado sucateado foi ilustrado pelo lado traseiro, portanto não preserva a mesma vista frontal dos demais. Tratar como conceito de avaria, não como conjunto final consistente; refazer esse estado na mesma câmera antes de aprovar a biblioteca.
- As animações GIF são protótipos. Na integração, preferir PNG + CSS/Canvas com máscaras ajustadas à tela.
- Revisar os GIFs quadro a quadro e conferir que brilho/partículas não escapem da área da tela ou da avaria.
- Confirmar escala no cenário da sala do diretor e no inventário.

## Papel do objeto
A TV representa o painel coletivo de BI da sala do diretor. O dashboard deve trabalhar com dados agregados e fictícios/de jogo: produtividade, qualidade, segurança, clima e ações preventivas. Não exibir ranking individual de saúde mental nem transformar indicadores psicossociais em mecanismo de vigilância.

## Estado da entrega
- [x] PNGs individuais exportados localmente.
- [x] GIFs individuais exportados localmente.
- [x] Prévia de quatro estados criada.
- [x] Diretrizes de efeitos CSS documentadas em `assets/v12/bi-display-effects.css`.
- [ ] Binários enviados ao GitHub.
- [ ] Estado sucateado refeito na mesma perspectiva.
- [ ] Integração e teste no cenário do jogo.
