# Tarefa Codex — auditoria de compatibilidade Quaternius x Acionista Heck

## Objetivo

Executar uma auditoria técnica, reproduzível e sem impacto no jogo principal para verificar se o personagem piloto **Acionista Heck** pode utilizar animações humanoides das bibliotecas Universal Animation Library (UAL1) e Universal Animation Library 2 (UAL2), da Quaternius.

Esta tarefa é de **diagnóstico e prova de compatibilidade**. Não implementar ainda o personagem jogável, não substituir o motor de circulação e não integrar animações ao mapa Canvas 2D.

## Contexto e referências

- Repositório: https://github.com/andreheck/PilhaGameNR1
- Documento de integração já elaborado (na branch `feat/ao-trabalho-hero-control-foundation`): https://github.com/andreheck/PilhaGameNR1/blob/feat/ao-trabalho-hero-control-foundation/docs/gameplay/INTEGRACAO-ANIMACOES-QUATERNIUS.md
- Bibliotecas oficiais:
  - UAL1: https://quaternius.itch.io/universal-animation-library
  - UAL2: https://quaternius.itch.io/universal-animation-library-2
  - Página de referência: https://quaternius.com/packs/universalanimationlibrary.html
  - Visualizador: https://quaternius.com/animviewer.html
  - Devlog Root Motion UAL1: https://quaternius.itch.io/universal-animation-library/devlog/1555893/added-root-motion-and-other-fixes
  - Devlog Root Motion UAL2: https://quaternius.itch.io/universal-animation-library-2/devlog/1555892/added-root-motion-and-other-fixes
- Ativos do personagem fornecidos pelo responsável pelo projeto:
  - `Meshy_AI_Rigged_Stylized_Man_biped_Meshy_Merged_Animations.fbx`
  - `Meshy_AI_Rigged_Stylized_Man_biped_texture_0.png`
  - `Meshy_AI_Rigged_Stylized_Man_biped_texture_0_roughness.png`
  - `Meshy_AI_Rigged_Stylized_Man_biped_texture_0_metallic.png`

Os arquivos acima podem não estar disponíveis no workspace do Codex. Se não estiverem, registrar a ausência como bloqueio e solicitar que sejam disponibilizados; não fabricar arquivos substitutos nem concluir compatibilidade por inferência.

## Restrições obrigatórias

1. Trabalhar exclusivamente nesta branch de auditoria.
2. Não fazer merge, deploy, publicação ou alteração na branch `main).
3. Não alterar economia, calendário, saves, indicadores psicossociais, regras de missão, NPCs ou motor atual de circulação.
4. Não substituir o motor Canvas 2D nem criar um segundo motor de NPCs.
5. Não inserir o FBX diretamente no Canvas 2D. Avaliar uma camada 3D isolada como prova técnica, se necessária.
6. Não baixar conteúdo pago, contornar autenticação ou aceitar licenças em nome do responsável. Registrar a origem e a licença dos arquivos utilizados.
7. Não commitar ZIPs ou modelos binários grandes sem autorização explícita.
8. Não chamar uma análise estática de teste visual ou de execução real.

## Etapa 1 — inventário dos ativos

- Verificar quais arquivos UAL1/UAL2 estão realmente disponíveis no workspace.
- Registrar nome, formato, tamanho, origem, biblioteca/versão e licença declarada.
- Identificar os arquivos de animação disponíveis e os nomes reais dos clips; não presumir que existam clips chamados exatamente `Idle`, `Walk` ou `Walk Formal`.
- Identificar variantes com sufixo `_RM) (Root Motion) e sem esse sufixo.
- Priorizar clips sem Root Motion para que o deslocamento continue sob controle do motor do jogo.

## Etapa 2 — auditoria do Acionista Heck

- Inspecionar o FBX: versão, meshes, materiais, textura, armature, hierarquia de ossos, bind pose, unidades, orientação e clips já embutidos.
- Verificar se o arquivo é realmente animável e se os clips embutidos têm tracks utilizáveis.
- Registrar ossos raiz, quadril/pelvis, coluna, cabeça, braços, mãos, pernas e pés.
- Identificar diferenças de nomenclatura, hierarquia, orientação e proporção em relação ao rig Quaternius.
- Não alterar o modelo original.

## Etapa 3 — compatibilidade e retargeting

- Verificar se o rig do Acionista Heck é compatível com o rig universal Quaternius ou se exige retargeting.
- Descrever o mapeamento de ossos e qualquer conversão necessária.
- Verificar escala, eixo vertical, forward axis, origem/pivô, pose de referência e orientação.
- Verificar se o retargeting causa torções, deslocamento de membros, deformações ou foot sliding.
- Distinguir claramente compatibilidade direta, compatibilidade com retargeting e incompatibilidade.

## Etapa 4 — prova isolada

Se os ativos estiverem disponíveis, montar uma POC fora do fluxo principal do jogo, preferencialmente com Three.js/FBXLoader ou GLTFLoader, sem alterar o mapa existente.

Testar, conforme clips realmente disponíveis:
1. Idle / repouso.
2. Walk / caminhada.
3. Walk Formal ou uma caminhada equivalente, se disponível.

A POC deve:
- carregar o modelo e suas texturas;
- mostrar esqueleto e clips detectados;
- permitir selecionar e reproduzir os clips;
- alternar entre repouso e caminhada;
- manter o personagem no lugar quando usar clips sem Root Motion;
- mostrar separadamente o efeito de Root Motion, caso exista motivo técnico para avaliá-lo;
- registrar erros de carregamento, materiais, animação e retargeting.

Não declarar sucesso visual sem executar a POC em navegador ou ambiente equivalente e registrar evidência reproduzível.

## Etapa 5 — recomendação arquitetural

Apresentar uma recomendação objetiva para a arquitetura do Ao Trabalho:
- manter circulação de NPCs no motor atual;
- avaliar o personagem controlado em uma camada visual isolada;
- definir como a posição do personagem 3D seria sincronizada com o mapa, sem implementar essa sincronização nesta tarefa;
- indicar como evitar que Root Motion e o motor de navegação movimentem o personagem simultaneamente;
- explicar impactos de performance e limitações de dispositivos móveis.

## Entregáveis

Criar um relatório em `docs/gameplay/RELATORIO-AUDITORIA-QUATERNIUS-ACIONISTA-HECK.md` contendo:

- resumo executivo: compatível / compatível com ajustes / incompatível / inconclusivo;
- inventário real dos ativos e respectivas licenças;
- análise do rig do Acionista Heck;
- tabela de mapeamento de ossos;
- lista real de clips avaliados;
- resultados dos testes de Idle e Walk;
- screenshots ou evidências da POC, se executada;
- limitações e bloqueios;
- recomendação de próximos passos;
- declaração explícita do que não foi implementado.

Se os arquivos não estiverem disponíveis, produzir relatório parcial, apontando exatamente os insumos faltantes e os passos que ficaram pendentes. Não preencher lacunas com suposições.

## Critérios de aceite

- [ ] Nenhuma alteração na branch principal ou no motor de jogo.
- [ ] Inventário baseado nos arquivos efetivamente disponíveis.
- [ ] Rig e animações do Acionista Heck inspecionados.
- [ ] Compatibilidade direta/retargeting/incompatibilidade justificada.
- [ ] Idle e Walk testados quando os ativos permitirem.
- [ ] Root Motion tratado explicitamente.
- [ ] Relatório registra evidências e limitações.
- [ ] Nenhuma integração definitiva ou deploy realizado.

## Ao concluir

Fazer commit apenas do relatório, dos arquivos de POC leves e dos testes auxiliares necessários. Abrir PR em modo draft para revisão, sem mesclar. Se a análise ficar bloqueada pela ausência dos arquivos, registrar o bloqueio no relatório e abrir PR draft apenas com o diagnóstico parcial.
