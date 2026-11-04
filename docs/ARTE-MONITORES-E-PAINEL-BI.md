# Biblioteca isométrica — monitores e tela de BI

## Direção visual
- Render 3D isométrico, com frente, lateral e base visíveis.
- Silhueta, escala, enquadramento e iluminação consistentes entre estados.
- PNG transparente como camada-base; animação em camadas CSS/Canvas na implementação final.
- GIFs são protótipos de validação visual, não formato final recomendado para gameplay.

## Monitores — quatro estados
| Estado | Sinal visual | Comportamento |
|---|---|---|
| Novo | Tela azul/ciano, LED verde | Brilho respirando, varredura lenta e LED pulsante |
| Usado | Tela funcional, marcas superficiais, LED âmbar | Brilho discreto e varredura lenta |
| Precário | Tela trincada, interferência, LED vermelho | Glitches curtos e apagões ocasionais |
| Sucateado | Tela destruída, fios expostos, carcaça rompida | Sem imagem; fogo/faíscas apenas como efeito de avaria, com intensidade moderada |

## Tela grande de BI — proposta
A tela grande representa um painel de indicadores do setor, não apenas um televisor decorativo.
- Estado novo: dashboard legível, barras e linhas com atualização sutil; indicadores luminosos discretos.
- Estado usado: painel funcional com brilho reduzido e sinais leves de desgaste.
- Estado precário: dados com interferência e atualização irregular.
- Estado sucateado: painel apagado/danificado; efeitos de faísca/fogo devem indicar avaria, nunca funcionamento.

### Conteúdo visual do BI
Usar dados fictícios ou dados agregados de jogo, sem informações pessoais:
- produtividade/entregas;
- qualidade e retrabalho;
- segurança e incidentes;
- clima/satisfação da equipe;
- riscos psicossociais e ações preventivas.
Não transformar indicadores de saúde mental em ranking individual ou instrumento de vigilância.

## Regras técnicas para animação
1. Manter o PNG base estático e transparente.
2. Aplicar efeitos apenas na área da tela, recortados por máscara/polígono.
3. Separar brilho, scanlines, glitch, LED e partículas em camadas independentes.
4. Respeitar `prefers-reduced-motion`; evitar flashes rápidos.
5. Usar CSS para efeitos simples e Canvas para partículas quando necessário.
6. Evitar GIF como formato final: tende a pesar mais, limita transparência e dificulta sincronizar estados com o gameplay.

## Critérios de aceite
- [ ] Transparência real, sem checkerboard residual.
- [ ] Objeto inteiro dentro do canvas, sem cortes.
- [ ] Quatro estados com câmera e escala consistentes.
- [ ] Efeitos confinados à tela/área de avaria.
- [ ] Teste em escala real de inventário e no cenário.
- [ ] Validar peso, FPS e acessibilidade de movimento.

## Arquivos de protótipo
Os arquivos PNG/GIF de revisão foram entregues nesta conversa em `monitores_revisados.zip`. Os binários ainda precisam ser adicionados ao repositório; este commit registra a especificação e os critérios de implementação, não os arquivos de imagem.
