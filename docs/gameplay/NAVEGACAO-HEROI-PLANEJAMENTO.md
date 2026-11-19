# Navegação do herói — fatia de planejamento

## Objetivo

Preparar a navegação do herói controlado sem acoplar a lógica de caminho ao Canvas, à câmera, ao renderizador 3D ou à simulação empresarial.

## Entrega desta fatia

- `simulation/hero-navigation.js` implementa busca A* determinística em grade ortogonal.
- O caminho inclui célula inicial e destino.
- Obstáculos são recebidos como células bloqueadas pelo adaptador do mapa.
- Diagonais não são permitidas; isso evita cortar cantos de móveis e paredes.
- Destino bloqueado, entrada inválida ou caminho impossível retorna `null`.
- A mesma entrada sempre produz o mesmo caminho.

## Contrato com o mapa

O adaptador de mapa será responsável por:
1. converter a posição do herói em célula lógica;
2. converter clique/toque em célula de destino;
3. fornecer obstáculos a partir do sistema de colisão/mobiliário existente;
4. converter o caminho lógico em pontos do mundo isométrico;
5. avançar o herói e orientar o modelo 3D conforme o vetor de deslocamento.

O planejador não cria um mapa novo, não altera o movimento dos NPCs e não modifica saves, economia, calendário, XP ou indicadores.

## Próximas fatias

1. Adaptador de coordenadas do mapa isométrico e picking de destino.
2. Entidade controlável consumindo o planejador e o ativo 3D Acionista Heck.
3. Câmera de acompanhamento e comandos por clique/toque/teclado.
4. Navegação autônoma do parceiro usando especialidade e objetivos, sem compras ou decisões irreversíveis automáticas.

## Limite de validação

A suíte unitária valida o planejador em grade abstrata. A integração com geometria real, colisões do mobiliário e animação do FBX/GLB continua pendente de execução no navegador e não deve ser declarada pronta antes desse teste.
