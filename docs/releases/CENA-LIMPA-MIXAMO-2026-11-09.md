# Cena sem estatísticas flutuantes e teste Mixamo —09/11/2026

Pedido do PM: retirar estatísticas sobre os setores e testar o personagem animado fornecido. Base `1ed10de584b9266f5c3518283e1069a659ceb50f`, mesma frente `codex/unified-social-agenda`, PR #69. Sem merge; apenas preview autorizado.

## Cena

Removidos os cabeçalhos flutuantes de setores com percentuais, os seis medidores numéricos de fatores e suas legendas sobrepostas, em visão geral, seleção e zoom. Permanecem contornos de seleção, alertas individuais dos NPCs, objetos comprados e nomes discretos do pátio/sala restaurativa. Dados e índices continuam nas abas/painéis existentes. Nenhuma fórmula, risco ou pontuação foi removida da simulação. O builder final altera apenas o renderer contínuo, preservando os casos antigos.

## Arquivo e integração

Fonte local original: `C:/Users/CRM7/Downloads/Shoved Reaction With Spin.fbx`,54.954.256 bytes. SHA256 `9053ba6f8a6a4a0fb91fa5e1559b52edd39d5e2d1f8e582f66b6184b43c2eff7`.65 ossos; clipe `mixamo.com`,4,533333 s,53 tracks. `Take 001` vazio não é reproduzido. Três materiais, texturas embutidas4096/2048 px; o bake aguarda o LoadingManager antes de renderizar, evitando atlas preto por imagens ainda não decodificadas.

Renderização local com o pipeline Three.js já utilizado:32 frames ×4 direções,128×192 por frame. Atlas e metadados em `assets/animation-tests/`; fonte FBX de54 MB fica fora da publicação. Sem upload/Meshy, nova geração, compra de animação ou alteração das texturas. Controles de rotação dos ossos e giro preservados; translação XZ da raiz fixada para manter o teste no lugar, sem fingir caminhada. Metadados guardam hashes e material/clip; script reproduzível em `tools/render-mixamo-test.py`.

No mapa: **Menu → Teste Mixamo → Reproduzir no pátio**. Modelo aparece em uma marca discreta, na área livre do pátio, com escala equivalente aos sprites riggados existentes. Orientação em quatro vistas; clipe toca uma vez e mantém a última pose. Abrir novamente permite repetir ou remover. Desativado por padrão; sai ao recarregar, sem nova chave no save. Timer visual independente permite testar com a empresa pausada, sem avançar o calendário. O novo visitante não faz parte do elenco contratado, organograma, saúde, economia ou trajetos.

A fonte é uma reação com giro, **não um clipe de caminhada/sentar/carregar**. Não foi atribuída a um NPC canônico porque o PM não indicou identidade. A integração definitiva e a identificação ficam pendentes de aprovação/novos clipes; não substituir movimento de trabalho por essa reação nem encenar empurrões no setor.

## Verificação

- `npm test` aprovado; três testes direcionados do overlay compilado (zoom/seleção/contornos), reprodução única/fim/remoção e proveniência/material/textura/atlas compacto.
- `qa-mixamo-test.py`: desktop1366×768 e celular390×844; dados de setor acessíveis no painel, cena sem rótulos estatísticos, visitante carregado, frames avançam e param no31, quatro vistas, remoção,16 funcionários preservados e saldo/saúde/semana/compras inalterados. Zero exceções. Capturas inspecionadas em `artifacts/mixamo-test/`; CI arquiva como `mixamo-scene-qa`.
- CI completo do commit final e publicação do preview vinculados na PR.

Pendências anteriores (clipes riggados de sentar/levantar/carga,16 assentos Wi-Fi, quatro poderes, XP contínuo, sala do gestor #74, TV BI e aparelhos físicos) continuam documentadas; esta entrega não as considera concluídas.
