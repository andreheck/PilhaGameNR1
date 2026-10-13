# Design QA — PilhA+ Alpha v1.0

**Final result: blocked**

## Origem visual
- Mockup aprovado do painel de riscos e galpão: `painel_de_riscos_na_logística.png` (1672 × 941 px)
- Quatro personagens aprovados: arquivos originais PNG convertidos para WebP.
- Elementos de referência anteriores: `central-de-gestao-v01(2).png`.

## Implementação
- Vercel: https://pilha-plus-game-preview.vercel.app/
- Página da equipe: https://pilha-plus-game-preview.vercel.app/?view=equipe
- Commit de código e assets no repositório privado.
- Viewports pretendidos: desktop ~1440×900 e mobile ~390×844.

## Testes realizados
- Arquivos e diretórios verificados no deployment Vercel `dpl_8LygzeinNqRcV188sfXQst5zzZsZ`, estado READY, alias oficial ativo.
- `menu.js` analisado sintaticamente via JavaScript e funções `home()` e `team()` renderizadas com stubs de dependência: retorno de HTML e links esperados.
- Seis ativos WebP otimizados confirmados no GitHub, preservando identidade dos quatro personagens.
- Fluxo de Caso 017 mantido, com nova rota `/caso017.html` e laboratório anterior isolado em `/game.html`.
- Testes estáticos adicionais incluídos em `tests/v10.test.js`; execução por CI ainda a confirmar.

## Bloqueio de verificação visual
**Nenhuma captura de navegador real foi obtida.** O ambiente de execução não dispõe de um browser cloud conectado, e o runtime de código não conseguiu abrir o domínio Vercel para captura. Por isso não é possível comparar lado a lado uma captura da implementação com o mockup, inspecionar consola e interagir com a página em desktop/mobile.

## Verificações pendentes
- Capturar página inicial e Equipe nas dimensões alvo.
- Comparar visualmente tipografia, espaçamentos, cores, enquadramento de galpão e retratos, e fidelidade do conteúdo.
- Verificar contraste, quebras e acessos em celular.
- Testar todos os botões, links do Caso 017 e seleção de personagens no visualizador 3D.
- Registrar e resolver quaisquer defeitos visuais encontrados.

## Conclusão
O pacote foi publicado e suas rotas/arquivos foram validados estaticamente. **Não declarar design QA como passed até existir screenshot real e comparação.**
