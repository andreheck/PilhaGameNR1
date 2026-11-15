# Painel do Explorador e sala de jogos

Entrega do commit `5a513aa8a7263ca0830bd8830581712cb0a8cdf1`, branch `codex/unified-social-agenda`. Destino público confirmado pelo PM: `https://vaideplanob.com.br/ao-trabalho/`, dentro do site principal.

## Explorador e score visual

- O retrato sem fundo no painel inferior acompanha, a cada segundo, o bem-estar atual do Explorador selecionado.
- As cinco faixas são: 20 (0–29), 40 (30–49), 60 (50–69), 80 (70–90) e 90+ (91–100).
- Pedro/Jovem Profissional, Advogado e Diretora de Ensino têm cinco arquivos WebP transparentes cada. Os retratos preservam cada personagem e seguem as expressões especificadas para os níveis.
- A seleção da Diretora também foi validada por catálogo e teste de existência das cinco imagens.

## Mapa e sala de restauração

- A área de restauração foi ampliada para 26 m de profundidade, separando Conferência Wi-Fi, espaço de Yoga/restauração e sala de jogos.
- O Professor de Yoga só aparece como visitante de apoio quando Yoga está comprado.
- Um pebolim é o jogo inicial gratuito. Sinuca, pingue-pongue, air hockey, arcade, pinball e jogo de tabuleiro aparecem como compras independentes.
- Os jogos ocupam o inventário, oferecem ações de interação e contribuem para bem-estar/relacionamento de acordo com seu item. A passagem central continua livre.
- O arranjo do escritório distribui mesas individuais pelos postos ativos sem duplicar funcionários.

## Verificação e publicação

- `npm test` e o build completo passaram após a inclusão das cinco imagens da Diretora.
- A revisão visual local em desktop confirmou o retrato de 80/100 carregado, transparência, enquadramento e controles inferiores. Os testes de mobiliário cobriram níveis iniciais e máximos, corredores, acessos e separação da sala.
- A release foi preparada fora do diretório público, validada por hash em 654 arquivos e ativada no caminho existente `hbuilds/current/nodejs/dist/public/ao-trabalho`.
- A versão anterior está guardada em `aotrabalho-releases/backups/20261115-before-5a513aa/ao-trabalho` para rollback.
- Verificação HTTP pública: página, JavaScript do jogo, amostras da sala de jogos e os 15 retratos retornaram HTTP 200; o JavaScript público contém a ligação entre `playerScorePortrait` e `updateExplorerDock`.

## Limites

- As ações de jogos são interações e efeitos simulados; esta entrega não adiciona física esportiva nem multiplayer.
- A revisão interativa da galeria de mistérios e do temporizador narrativo continua separada desta validação visual do mapa.
