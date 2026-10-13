# Sessão 16 — Biblioteca 3D de personagens

## Entregas
- Psicóloga: `char_psicologa_f_01_v01.glb`, 17,70 MB, um rig, ações Running, Walking e Sitting_Answering_Questions (mais clipe-base).
- Psiquiatra: `char_psiquiatra_m_01_v01.glb`, 17,68 MB, um rig, ações Running, Walking e Discuss_While_Moving (mais clipe-base).
- Ambos originais armazenados no Google Drive, sem cópias GLB no GitHub nem na Vercel.
- `viewer3d.html` atualizado com seletor de personagens, arquivos de origem no Drive, botões para movimentos disponíveis e cache local individual no dispositivo.

## Links
- [Visualizador 3D](https://pilha-plus-game-preview.vercel.app/viewer3d.html)
- [Psicóloga original no Drive](https://drive.google.com/file/d/1X8jMu433NYg07qub-3u60QLLsKZ4lZkS/view)
- [Psiquiatra original no Drive](https://drive.google.com/file/d/1mY4aXahMZNLv1jkVfrwD2LxaauGHjlpI/view)
- [Operadora v02 no Drive](https://drive.google.com/file/d/1VZuPdXNRuFvFjI2NerJAv9PJiod6uAnA/view)

## Observações
Os clipes existem no arquivo, mas ainda é necessário validar deformações e qualidade no navegador real. Bibliotecas Three.js podem depender da conexão ao CDN. A apresentação do visualizador não transfere arquivos automaticamente do Drive privado: o usuário importa o GLB uma vez no navegador. Nenhum modelo 3D foi publicado publicamente. A nomenclatura padronizada no Drive não altera bytes do modelo.

## Próxima evolução
Teste dos três personagens em cena e padronização de escala, origin pivot, rig e performances em dispositivos móveis. Definir pipeline de sprites 2.5D ou modelos GLB 3D nativos antes da implementação no jogo principal.
