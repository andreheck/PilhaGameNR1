# Etapa seguinte do PilhA+ Game — móveis isométricos e efeito Poof

**Status: assets produzidos, teste isolado aprovado, integração no jogo pendente.** Esta PR registra a instrução de integração. **As imagens e sprite sheets binários não estão nesta PR**; devem ser importados do pacote `Pilha_Game_Kit_Mobiliario_Poof_v1.zip` entregue nesta conversa.

## Pacote de entrega

- 20 recortes isométricos: `sprites/png/*.png` e `sprites/webp/*.webp`, transparência preservada.
- Efeito Poof: `effects/poof_atlas_4x3.png`, 12 quadros de 256×256 px (atlas 1024×768); 65ms/frame; item revelado no frame 5; duração 780ms.
- Ícones SVG para benefícios sem prop físico: plano de saúde, capelão (escuta plural) e yoga.
- Inventário: `inventory.json` com **24 melhorias / 3 níveis**, identificadores correspondentes aos itens existentes em `data/continuous/catalog.js`, e planos visuais de aparição.
- Código de referência: `code/poof-canvas.js` e `code/inventory-assets.js`.
- Prévia: `Pilha_Game_Mobiliario_Preview_Autonomo.html` ou `index.html` dentro do pacote.

## Instrução para Codex

1. Antes de editar, localizar branches/PRs recentes dos NPCs e do modo contínuo, preservar o trabalho.
2. Importar o conteúdo da pasta `sprites/` e `effects/` em `assets/furniture/` no repositório. URL pública: `/assets/furniture/`.
3. Registrar o mapeamento visual em `data/continuous/furniture-visuals.json`, sem substituir o catálogo de compras.
4. Acionar o Poof **apenas após `purchase()` + persistência terem retornado sucesso**; quando o evento for custo insuficiente ou stale quote, não gerar efeito.
5. Mostrar o asset comprado só a partir do quadro 5 e encerrar Poof em ~780ms.
6. Reconstruir o cenário a partir de `receipts`, sem repetir Poof ao carregar save.
7. Posicionar no diorama 12×8, ordenar sprites por profundidade e validar caminhos dos NPCs: móveis não podem bloquear circulação nem a rota até Restauração.
8. A lista `placementPlan` é **proposta** e precisa de revisão contra a geometria real (móveis/caminhos).
9. Para `capelao`, `yoga` e `plano`, não gerar móveis artificiais ou novos NPCs automaticamente; mostrar o benefício na UI por meio dos ícones.
10. A compra de nível 2 ou 3 pode adicionar decoração/upgrade visual, mas sem novo débito além do calculado pelo motor do jogo.

## Fonte única da economia

As tabelas da ilustração de referência tinham preços decorativos. Os preços e efeitos efetivos devem ser lidos de `data/continuous/catalog.js`: 12 melhorias originalmente extraídas do ZIP C3 + 12 da Restauração. O kit `inventory.json` guarda uma **cópia de referência**, não a regra executada no runtime.

## Garantias de compatibilidade

Manter saúde individual, fatores psicossociais, tempo de efeitos (imediato/tardio/prolongado), 16 NPCs, calendário, câmera, pausa, sinergia dos heróis, progresso salvo. A aparência do objeto comprado independe da maturidade do bônus numérico.

## Aceite e QA

- 20 PNG e 20 WebP íntegros, com alfa e ID único.
- 12 frames do Poof, sem flash branco nem loop permanente.
- Ao comprar, objeto aparece exatamente uma vez; ao retornar, está estável no cenário.
- Rejeição por saldo insuficiente não altera cenário.
- Três níveis testados nos quatro ambientes.
- Sem sprite fora dos limites e sem 404 em desktop 1366×900 e mobile 390×844.
- NPCs seguem caminhando sem atravessar o novo mobiliário.
- PR específica com screenshots antes/durante/depois do Poof e teste de regressão.

**Observação:** o kit foi testado como demo isolada em desktop e mobile. **Não foi publicado no jogo** nem substitui uma inspeção visual da implementação final.
