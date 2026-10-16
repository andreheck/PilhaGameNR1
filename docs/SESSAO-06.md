# Sessão 06 — Camadas do cenário (v0.7)

## Resultado
A Central de Riscos recebeu um protótipo de cenário 2.5D em camadas separáveis. O usuário pode ativar/desativar paredes, mobiliário, personagens e interações. Os três pontos de interação continuam acessíveis por botões textuais e diretamente na cena. Todo conteúdo permanece fictício.

## Camadas implementadas
- `floor`: piso em perspectiva, base visual comum;
- `walls`: duas paredes, isoladas do piso;
- `furniture`: painel de indicadores, mesas e plantas;
- `characters`: dois personagens ilustrativos;
- `hotspots`: três botões que abrem informações educativas.

## Critérios de aceite
- Interface adaptativa para celular e desktop.
- Botões identificados e acionáveis pelo teclado.
- As camadas podem ser ocultadas independentemente.
- O fluxo completo do Caso 01 segue acessível.
- Estado educacional salvo localmente.

## Restrições
O cenário atual é CSS e ícones temporários, não arte final nem sprites animados. Ainda não há movimentação por caminhos, colisão ou motor Phaser. A localização de objetos está vinculada ao layout do protótipo e deverá ser normalizada num sistema de coordenadas do mundo.

## Sessão 07
1. Definir largura/altura lógicas e grade isométrica.
2. Externalizar metadados de camadas e objetos em JSON.
3. Criar os primeiros assets consistentes (piso, parede, estação de trabalho, personagem).
4. Implementar seleção por toque, mouse e teclado.
5. Fazer teste de legibilidade, contraste e adaptação.
