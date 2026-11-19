# Ajuste do menu e da navegação do HUD

15/11/2026 · correção local na branch `codex/unified-social-agenda`.

## Problemas encontrados

- O menu de ações estava ancorado para abrir abaixo do botão, embora o dock fique preso ao rodapé. O painel podia sair da área visível e parecer sem resposta.
- A faixa inferior ainda imprimia os índices de cada setor, duplicando informação depois da inclusão do mapa de calor clicável.
- A transformação de build ainda esperava o rótulo anterior, então a alteração de apresentação quebrava `npm run build` até a âncora do script ser atualizada.

## Ajustes

- O painel do menu agora abre acima do dock, tem altura máxima e rolagem própria, e fica acima do mapa e do widget de saúde coletiva.
- Os percentuais textuais foram retirados dos botões de setor no modo contínuo. Os botões, as cores dos indicadores e a navegação por setor continuam disponíveis; o mapa de calor continua abrindo o setor correspondente.
- O build mantém a mesma regra de exibição do modo contínuo e não altera telas antigas sem o modelo contínuo.

## Validação

`npm run build` concluiu com sucesso após atualizar o script de transformação. Não foi feita QA visual no navegador nesta rodada. Não houve commit, PR, merge ou publicação. O checkout já continha alterações paralelas no minimapa e em outros arquivos; elas foram preservadas.
