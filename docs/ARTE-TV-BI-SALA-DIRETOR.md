# TV de BI da sala do diretor — pacote de arte

## Arte aprovada nesta rodada
Quatro estados individuais da TV widescreen em perspectiva isométrica frontal, com estrutura, escala e câmera coerentes:
- `tv_bi_novo.png` — painel íntegro, brilho azul e LED verde.
- `tv_bi_usado.png` — desgaste superficial e brilho reduzido.
- `tv_bi_precario.png` — interferências, trincas e falhas de exibição.
- `tv_bi_sucateado.png` — tela quebrada, carcaça queimada, faíscas e cabos expostos.

Todos os PNGs foram exportados em canvas 768 × 512, RGBA, com canal alfa. A prévia e o pacote ZIP foram entregues na conversa de trabalho. Os arquivos binários ainda não estão versionados neste repositório.

## Direção de implementação
- Usar PNG estático como camada-base.
- Aplicar brilho, scanlines e interferência com CSS; partículas de avaria podem usar Canvas.
- Ajustar máscaras à geometria real da tela e às áreas de avaria. Os seletores CSS existentes são uma base, não uma integração validada.
- GIFs são protótipos de visualização; não usar como formato final de gameplay.
- Testar em escala real na sala do diretor e no inventário antes de aprovar integração.

## Conteúdo do BI
A TV representa indicadores coletivos do setor: produtividade/entregas, qualidade/retrabalho, segurança, clima e ações preventivas. Métricas exibidas na arte são ilustrativas. No jogo, usar dados agregados ou fictícios; não exibir ranking individual de saúde mental nem criar mecanismos de vigilância psicossocial.

## QA
- [x] Quatro estados exportados individualmente.
- [x] Perspectiva frontal isométrica consistente, inclusive no estado sucateado.
- [x] PNGs com canal alfa.
- [ ] Binários adicionados ao GitHub.
- [ ] Máscaras CSS calibradas sobre os PNGs finais.
- [ ] Teste de escala, legibilidade, desempenho e acessibilidade de movimento no cenário.
- [ ] Preview do jogo validado com a TV posicionada na sala do diretor.

## Estado
A arte está concluída como entrega visual local. A integração no jogo permanece pendente até que os binários sejam versionados e os efeitos/máscaras sejam validados no cenário.