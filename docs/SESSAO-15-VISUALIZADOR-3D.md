# Sessão 15 — Laboratório 3D da Operadora Logística (v02)

Data: 13/10/2026

## Objetivo
Testar o asset real `char_op.log_m_02_v01.glb` dentro de um visualizador 3D responsivo antes de escolher como integrá-lo definitivamente ao PilhA+ Game.

## Links
- Visualizador: https://pilha-plus-game-preview.vercel.app/viewer3d.html
- Capítulo 01: https://pilha-plus-game-preview.vercel.app/
- GLB original privado: https://drive.google.com/file/d/1VZuPdXNRuFvFjI2NerJAv9PJiod6uAnA/view

## Funcionalidades entregues
- Iluminação suave, sombras, piso, grade e câmera ortográfica isométrica.
- Rotação e zoom por mouse ou toque; atalhos para frente, lado, costas e isométrica.
- Seleção das animações Walking, Running e Discuss_While_Moving, quando presentes no GLB.
- Estado Parado (sem animação idle real confirmada); controle de velocidade, visualização do esqueleto.
- Exibição de triângulos, juntas, clipes, tamanho do arquivo e nomes das animações.
- Importação de GLB arrastando/selecionando arquivo e cache local por IndexedDB.
- Link de acesso no topo do jogo principal.

## Privacidade e distribuição
**O arquivo GLB NÃO foi incluído no deploy da Vercel nem no repositório GitHub.** O usuário baixa o GLB do Drive privado e o seleciona uma vez no visualizador; os bytes ficam armazenados no navegador/dispositivo (IndexedDB) e o site não os envia a servidores. O código do visualizador contém bibliotecas Three.js carregadas de CDN público (jsDelivr).

A proteção de acesso da Vercel está ativada, mas não deve ser a única medida de proteção de propriedade intelectual. Publicar modelos GLB como arquivos estáticos significaria permitir o download por visitantes autorizados.

## Limites
A renderização 3D usa Three.js apenas para validação de asset. O jogo principal continua Phaser/Canvas 2.5D. O visualizador não integra o personagem ao motor do Capítulo 01 e não constitui um teste completo de desempenho no Android/iOS. Ainda é preciso validar deformações do rig, animações e navegação no navegador real.

## Próximas ações
- Testar a operadora v02 em desktop e mobile e fotografar as quatro perspectivas.
- Definir se o jogo final usará sprites 2.5D derivados dos modelos ou renderização 3D em tempo real.
- Produzir e validar psicóloga e psiquiatra na mesma escala/estilo e atualizar o catálogo de assets do Drive.
- Criar pipeline de extração de sprites, compressão das texturas e testes de desempenho.
