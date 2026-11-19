# Vídeo e elenco da abertura — 07/11/2026

Pedido PM: vídeo gemini_generated_video_c8c1c802.mp4 antes dos setores; Conhecer o jogo leva à apresentação interativa existente, com os modelos 3D em loop se compatíveis.

Vídeo original preservado: 1280×720, 20,032 s, 5.467.334 bytes. Poster extraído do próprio arquivo. Reprodução inline em loop, sem som inicial, controles nativos, pausa/reprodução e Conhecer o jogo sempre disponíveis. Preferência por movimento reduzido mantém o vídeo pausado; falha/autoplay bloqueado não bloqueia a passagem. Vídeo descarregado e listeners removidos ao sair. Esta página não grava o save nem concede recompensas.

Sequência: vídeo → Conhecer o jogo → setores interativos diretamente, sem repetir a vinheta da logo → Preparar minha equipe/Pular introdução → orientação → dupla → contratação/mapa existentes. Rever abertura repete essa sequência. A instância do elenco decorativo não se mistura à equipe ou à seleção dos heróis.

Quinze entradas animadas distribuídas por Escritório, Produção e Atendimento, com sprites de quatro direções derivados dos FBX/GLB locais. Doze atlas preparados nesta entrega; três reaproveitados (duas personagens já vinculadas e robô). As duas cópias byte a byte idênticas ficam como aliases no manifesto. Duas variantes de arquivo adicionais usam a mesma aparência/caminhada; não representam novas identidades canônicas. O arquivo Boy não tem clipe de caminhada identificado e não foi apresentado deslizando como se estivesse animado. Tudo está rastreado em data/continuous/intro-cast.json. Os FBX/GLB e texturas da coleção local não são copiados para o build; somente os atlas necessários. Script local de preparação: tools/render-intro-cast.py.

Validação: qa-cinematic-intro.py em 1366×768, 390×844, 844×390 e 320×640. Confere reprodução/loop/inline/mudo, botão dentro da viewport e teclado Enter, retirada do vídeo, 15 atlas carregados e personagens mudando posição/quadro nos três setores, ausência de escrita em localStorage na apresentação, entrada na orientação e ausência de exceções. Testa também vídeo indisponível com movimento reduzido. Contact sheet dos 15 modelos e capturas desktop/móveis examinadas. Empresa viva: 38/38 após a integração inicial.

Limites: cinema não vira cenário jogável; animações dos modelos são amostradas em atlas, mantendo o renderer leve existente. Não foram criados poderes, cargos, NPCs contratáveis, clipes de sentar ou efeitos econômicos nesta entrega. Boy continua pendente de caminhada. Som depende do arquivo e do controle nativo. Teste em dispositivos físicos permanece pendente.
