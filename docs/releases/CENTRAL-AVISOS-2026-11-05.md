# Central de avisos — 05/11/2026

Integração seletiva da PR #56 (047f81d) à frente #69, preservando o HUD atual.

- No celular, um botão com quantidade e indicação de atenção substitui os cartões sobrepostos ao mapa. Abre um diálogo nativo com os textos completos.
- Alertas aparecem antes das informações. O aviso real deixa de expirar automaticamente enquanto estiver aberto no diálogo, focado ou sob leitura com mouse.
- Fechar por Escape devolve o foco ao resumo. Uma ação do aviso libera o diálogo antes de executar o callback existente, permitindo abrir setor ou outro diálogo.
- Desktop mantém cartões completos, com altura de até 35% da tela e rolagem. A fila visual é limitada a oito e remove informações antes de alertas quando excedida.
- Não há nova chave de armazenamento. Os avisos continuam temporários; decisões pendentes mantêm seu estado e acesso já existentes no jogo. Abrir avisos não pausa automaticamente o tempo.

O QA da jornada real foi ampliado em cinco resoluções: usa o alerta verdadeiro de Produção, seu temporizador e ação; acrescenta um cartão somente no DOM para testar empilhamento. Em telas móveis, lê por 11 segundos, verifica ordem/foco/Escape e executa a ação original. O save fictício é comparado antes e depois; nenhum saldo ou NPC é alterado pela central. Capturas distinguem resumo e diálogo aberto. Homologação em aparelhos físicos/leitores de tela permanece pendente.

Build e testes locais de galeria, progressão e fila de ações passaram. CI/preview e commit final serão registrados na PR #69 antes da atualização do site de testes.
