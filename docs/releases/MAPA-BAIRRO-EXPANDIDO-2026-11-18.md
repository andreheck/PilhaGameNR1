# Mapa interativo do bairro expandido — 18/11/2026

## Entrega

- Nova entrada **Mapa do bairro** na barra do jogo contínuo.
- Mapa ilustrado e clicável com morro e seis barracos, moradia, polo gastronômico, UPA e terraço restaurativo, avenida com cruzamento, Pilha Corp, calçadão e praia.
- Painel lateral responsivo mostra detalhes da área selecionada; o atalho da Pilha Corp retorna ao mapa operacional no setor Escritório.
- O mapa é somente visual/informativo. Não altera pontuação, economia, relógio ou progresso.
- Prévia leve do café e do hospital copiada para `assets/world-expansion/food/`; os PNGs e prédios residenciais/barracos existentes são reutilizados.

## Modelos comerciais enviados

O GLB do Paradinho Café tem cerca de 103 MB. O pacote do quiosque Bolinho de Carne tem cerca de 176 MB compactado (o FBX sozinho tem cerca de 129 MB). Os arquivos originais permanecem na pasta 3D de origem e não foram incluídos no pacote estático do jogo para manter a carga inicial do mapa pequena. O café aparece pela prévia PNG; o quiosque aparece como ponto clicável ilustrado. Uma visualização 3D sob demanda requer otimização/conversão dos modelos e trabalho posterior.

## Escopo de liberação

- Alterações preparadas na branch atual, sem merge ou deploy.
- Build necessário para materializar `dist/ao-trabalho`; testes automatizados não executados nesta etapa.
