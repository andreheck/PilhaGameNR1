# Abertura Ao Trabalho: vídeo, layout e áudio — 10/11/2026

- Fundo da abertura ajustado para `#000711`, amostrado dos cantos da arte do vídeo.
- Desktop e tablet usam duas colunas: vídeo menor à esquerda; apresentação e ação à direita. Em telas estreitas, o conteúdo volta a uma coluna.
- A animação inicia automaticamente em loop e tenta começar com áudio. Se o navegador bloquear autoplay com som, o vídeo continua sem som e mostra o controle **Ativar som**. O usuário também pode silenciar pelo mesmo controle.
- O vídeo respeita a preferência de movimento reduzido e as configurações do jogo.
- Validação com `tools/qa-cinematic-intro.py`: 4 viewports, 18 personagens de abertura, navegação por teclado, autoplay/loop, layout responsivo, vídeo indisponível e movimento reduzido.

Limite: navegadores podem bloquear áudio automático sem interação; nesses casos, a pessoa precisa ativar o som pelo controle exibido sobre o vídeo.
