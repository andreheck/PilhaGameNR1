# Sessão 11 — Pathfinding e obstáculos

## Entrega
O protótipo em `prototypes/caminhos-sessao-11.html` incorpora uma grade lógica 12×8, obstáculos de mesas e equipamentos, seleção de destino por toque/clique e cálculo de rotas por **busca em largura (BFS)**, com movimento célula a célula. Um avatar pode ser exibido como operadora ou psicóloga; a malha é compartilhada.

## Critérios
O personagem não atravessa células bloqueadas. Destinos bloqueados geram aviso. Há visualização opcional da grade e do caminho.

## Limitações técnicas
O movimento ocorre em uma grade 2D ortogonal com decoração de sala, ainda **não é isométrico real**. Não existe colisão contínua, sprites finalizados, personagem controlado por teclado nem Phaser. O trabalho foca a validação das rotas.

## Sessão 12
Migrar o grafo 2D para grade isométrica renderizada, usar coordenadas de mundo e adicionar interação de conversa/contexto com NPCs.
