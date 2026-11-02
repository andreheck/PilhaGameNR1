# PilhA+ Game — Especificação de arte: desgaste e deterioração do inventário

Status: proposta técnica inicial para implementação e validação visual  
Branch: `art/aged-office-inventory`  
Escopo: mobiliário e equipamentos do escritório 3D em `world3d.js`

## 1. Diagnóstico do repositório

A cena principal do escritório é construída proceduralmente em Three.js. Os móveis externos são carregados por `loadProp()` a partir de `/assets/kenney-furniture/`. O conjunto Kenney presente no repositório contém:

- `desk.glb`
- `chairDesk.glb`
- `bookcaseOpen.glb`
- `computerScreen.glb`
- `laptop.glb`
- `lampSquareFloor.glb`
- `loungeSofa.glb`
- `tableRound.glb`
- `pottedPlant.glb`
- `trashcan.glb`

A cena também possui mobiliário e elementos construídos com primitivas Three.js. A biblioteca 3D experimental usa um GLB próprio em `assets/v13/biblioteca-modular-prototipo.glb`. Não foi identificado, no inventário de arquivos da branch principal, um GLB independente de livro; livros/volumes devem ser tratados como modelos procedurais ou adicionados como novos assets após validação.

**Limite importante:** esta etapa não altera os GLBs originais, não cria ainda novos arquivos 3D e não muda a lógica de jogo. O objetivo é estabelecer um padrão seguro para a próxima implementação.

## 2. Objetivo visual

Criar versões visualmente distintas de objetos novos, usados, precários e sucateados, para que o estado de conservação seja percebido à primeira vista e conte uma história do ambiente de trabalho.

A deterioração não deve ser apenas uma camada de sujeira. Deve combinar, conforme o objeto, alteração de cor, perda de acabamento, deformação, peças ausentes, cabos expostos, rachaduras e reparos improvisados.

## 3. Estados de conservação

| Estado | Aparência | Leitura narrativa |
|---|---|---|
| Novo / conservado | superfície íntegra, cor uniforme, peças completas | recurso adequado e cuidado |
| Usado | riscos finos, bordas polidas, leve desbotamento, pequenas marcas | uso cotidiano, ainda funcional |
| Precário | amarelamento, manchas, ferrugem localizada, fita/reparo, peça frouxa ou trincada | manutenção insuficiente; desconforto e possível perda de eficiência |
| Sucateado | partes ausentes, quebra evidente, tela danificada, estrutura empenada, cabos desconectados | item indisponível ou que exige substituição |

Não associar automaticamente objeto velho a risco psicossocial ou a adoecimento. O estado do item deve representar uma condição material do ambiente; impactos no jogo só devem existir quando houver mecânica e justificativa explícitas.

## 4. Matriz de direção de arte por família

### Computadores e telas
- Usado: monitor com leve amarelamento, riscos discretos na carcaça, teclado com teclas polidas.
- Precário: monitor antigo, moldura amarelada, base instável, cabos remendados e pequenas marcas na tela.
- Sucateado: tela trincada ou sem imagem, carcaça aberta, cabo desconectado ou peça faltando.
- Preservar silhueta, dimensões e ponto de apoio do modelo original.

### Notebook
- Usado: desgaste nas bordas e touchpad polido.
- Precário: carcaça marcada, dobradiça com folga, adesivo de manutenção.
- Sucateado: tela quebrada, tampa deformada ou teclado parcialmente ausente.

### Mesas e cadeiras
- Usado: riscos no tampo, quinas gastas e tecido discretamente marcado.
- Precário: laminado descascando, fita de reparo, ferrugem nos pés, rodízio ausente ou encosto frouxo.
- Sucateado: tampo rachado, perna quebrada ou cadeira sem componente estrutural.
- Evitar deformações que alterem colisores ou causem interseção com o piso.

### Estantes e livros
- Estante usada: pintura gasta e pequenas marcas nas prateleiras.
- Estante precária: prateleira empenada, ferrugem nos suportes e reparo improvisado.
- Livros usados: lombadas desbotadas, cantos amassados e páginas amareladas.
- Livros precários/sucateados: capa rasgada, lombada rompida, folhas soltas ou volume incompleto.
- Os livros ainda precisam de um modelo-base consistente; não presumir que existe um GLB de livro no conjunto atual.

### Luminárias e objetos de apoio
- Usado: marcas de toque e pintura gasta.
- Precário: peça torta, acabamento oxidado ou difusor amarelado.
- Sucateado: peça quebrada ou ausente. Não simular faísca, fumaça ou risco elétrico sem uma decisão explícita de design e segurança.

## 5. Estratégia técnica recomendada

1. **Manter os GLBs originais intactos.** Não sobrescrever os arquivos Kenney nem os protótipos da biblioteca.
2. Criar um catálogo de estados por objeto, por exemplo `desk: used|precarious|scrapped`, sem acoplar a condição à identidade do item.
3. Começar com variações de materiais no Three.js: cor, roughness, metalness e mapas/decals quando disponíveis.
4. Usar geometrias adicionais pequenas e controladas para danos específicos (fita, rachadura, cabo solto, peça ausente), mantendo o modelo-base e seus pivôs.
5. Se a variação exigir alteração estrutural grande, gerar um GLB derivado com sufixo explícito, mantendo o original como fallback.
6. Fazer a seleção do estado por dados de configuração, e não por caminhos de arquivo espalhados no código.
7. Adicionar testes para garantir que o carregamento sem estado informado continue exibindo o objeto original.

### Contrato sugerido para configuração

```js
const PROP_CONDITION = {
  desk: { state: 'used' },
  chairDesk: { state: 'precarious' },
  computerScreen: { state: 'scrapped' },
  laptop: { state: 'used' },
  book: { state: 'precarious' }
};
```

O exemplo é ilustrativo; não deve ser conectado à cena até que os estados visuais estejam implementados e aprovados.

## 6. Ordem de produção

**Lote 1 — validar linguagem visual**
1. computador de mesa / monitor;
2. notebook;
3. livro;
4. mesa;
5. cadeira;
6. estante.

Produzir primeiro uma versão usada, precária e sucateada para cada item do lote. Validar leitura em câmera isométrica e em tamanho mobile antes de expandir para os demais objetos.

**Lote 2 — completar o ambiente**
Luminária, sofá, mesa redonda, lixeira, plantas e demais objetos de apoio. Plantas devem ter estados próprios (saudável, negligenciada, seca), sem misturar deterioração biológica com dano estrutural.

## 7. Critérios de aceite

- O objeto continua reconhecível em câmera isométrica e em escala mobile.
- A condição pode ser identificada sem depender de texto ou cor isolada.
- Silhueta, escala, origem/pivô e orientação permanecem compatíveis com a cena.
- Não há clipping, flutuação, z-fighting ou sombras anormais.
- O estado original continua disponível como fallback.
- Os estados não alteram pontuação, produtividade ou saúde automaticamente; qualquer efeito de jogo exige especificação de mecânica separada.
- A licença e a atribuição de cada asset derivado permanecem documentadas.

## 8. Próxima implementação

Implementar um pequeno protótipo de variação de materiais para `computerScreen` e `laptop`, com três condições (usado, precário e sucateado), em uma cena de teste isolada. Após revisão visual, expandir para mesa, cadeira, estante e livros. Não substituir o escritório principal antes da aprovação.
