# Revisão visual das animações — 12/11/2026

Versão corrigida: `84f08624c4ea76e30f1b2976487785cc90b025f0`.

## Escopo observado no navegador

Desktop de 1280×720 nos endereços públicos:

- https://pilha-plus-game-preview.vercel.app/
- https://vaideplanob.com.br/ao-trabalho/

Foram selecionadas e observadas as 53 atividades dos dez modelos em cada galeria, totalizando 106 combinações de modelo/atividade após a correção de entrega. As quatro orientações foram distribuídas entre as atividades de cada modelo. Foram capturados quadros já carregados e em movimento; isso não equivale a assistir cada combinação de atividade/orientação por vários ciclos completos.

| Modelo | Atividades por site | Resultado visual final |
| --- | ---: | --- |
| Heck · Mentor | 6 | Sem duplicação ou recorte incorreto observado |
| Mariana | 4 | Sem duplicação ou recorte incorreto observado |
| Diretora de Ensino | 5 | Sem duplicação ou recorte incorreto observado |
| Gestora | 6 | Sem duplicação ou recorte incorreto observado |
| Operador logístico | 5 | Sem duplicação ou recorte incorreto observado |
| Profissional administrativo | 5 | Sem duplicação ou recorte incorreto observado |
| Jovem profissional / Pedro | 4 | Sem duplicação ou recorte incorreto observado |
| Diretor | 5 | Sem duplicação ou recorte incorreto observado |
| Malik · Professor de yoga | 8 | Sem duplicação ou recorte incorreto observado |
| Advogado | 5 | Sem duplicação ou recorte incorreto observado |

No mapa foram ativados os visitantes disponíveis pela própria galeria e inspecionados Escritório, Atendimento, Produção e Restauração com aproximação e deslocamento da câmera. Foram observados Pedro, Mariana, Beatriz, os visitantes animados, o ciclo de Yoga no tapete e o Robô Azul. A espera de Beatriz foi novamente observada após a última publicação. As rotinas do mapa escolhem suas próprias atividades; nem todas as atividades de teste da galeria são rotinas do mapa. A ocultação atrás de paredes e móveis em primeiro plano é distinta de recorte incorreto de um quadro.

## Problemas encontrados e corrigidos

1. O CDN do Vai de Plano B reduzia até imagens com 64 quadros de 8192×768 para 1600×150, causando perda de detalhe e artefatos de transparência. Os 66 atlas agora recebem uma cópia binária `.sprite`, com os mesmos bytes PNG originais, que o navegador decodifica normalmente e o otimizador de imagens não transforma. Os arquivos originais permanecem preservados.
2. A espera de Beatriz tinha oito quadros, mas a contagem ausente fazia o mapa tratar a faixa inteira como um quadro. O gerador agora lê `idleFrames` e `idleDuration` do relatório de cada modelo, além dos valores específicos de Mariana e Pedro.

## Evidências complementares

- Compilação completa concluída.
- 12 testes focados passaram, incluindo integridade dos bytes/dimensões e contagem dos quadros de espera.
- Inspeção de transparência dos 7.780 quadros das 53 atividades: nenhum contorno com alfa ≥32 tocando a borda do respectivo quadro.
- Conferência das dimensões entregues publicamente em `animation-delivery-live-2026-11-12.json`.
- Publicação Vercel final: `dpl_BCqvEKKbjYRnSaky3VKkkTuLvFMC`, READY, no domínio oficial.
- Hostinger: arquivos alterados preservados em backup antes da substituição; a página principal foi preservada.

As sessões de inspeção foram deixadas pausadas. A revisão corresponde ao viewport e aos quadros observados; não é uma garantia sobre todo navegador, tamanho de tela ou estado futuro da partida.
