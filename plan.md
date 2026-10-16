# Vertical slice — ambiente-padrão vivo

## Objetivo

Transformar o escritório modular existente em um hub de jogo vivo para validar o loop **explorar → focar setor → conversar → decidir → observar consequência** antes de multiplicar ambientes.

## Decisões de implementação

- Reutilizar a central Alpha 1.4, o `world3d.js` e a paleta já aprovada.
- Manter o Caso 01 como jornada completa e fonte de consequências simuladas.
- Exibir cinco presenças 3D: Operadora, Psicóloga, Psiquiatra, Gestor-mentor e Colaborador.
- Usar GLBs publicados onde já existem; manter avatar procedural 3D para o Colaborador até receber modelo final.
- Indicar o setor ativo com pulso visual, mover personagens associados com crossfade de animação e exibir ocorrência contextual na cena.
- Não multiplicar cenários ainda: os casos 02–05 permanecem como conteúdo progressivo sobre o mesmo ambiente.

## Estrutura

- `index.html`: shell da central e HUD vivo da cena.
- `play.js`: estado de navegação, seleção de setor/personagem e eventos de feedback.
- `world3d.js`: ambiente procedural, regiões, cinco presenças, câmera e animações.
- `play.css`: overlay de ocorrência e animações de feedback.
- `case01.js` e `simulation/case01.js`: caso completo e consequências de 30 dias.
- `manus-routes.json`: catálogo de rotas publicadas.

## Publicação

O código continua no GitHub como fonte de verdade. A publicação Vercel deve usar o projeto existente ligado ao repositório e a branch de produção `main`; nesta sessão a API Vercel autenticada não autorizou o escopo da conta, portanto a atualização fica pronta para o deployment automático assim que o vínculo/escopo for corrigido.
