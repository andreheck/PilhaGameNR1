# Sessão 19 — Central de gestão e equipe (Alpha 1.0)

Data: 13/10/2026

## Entregas
- Tela inicial `/` redesenhada para se aproximar do mockup de central de gestão: navegação lateral, visual do galpão logístico em destaque, quadro de fatores de risco, quatro retratos e fluxo de cinco etapas.
- Página `/?view=equipe` atualizada com os quatro personagens aprovados: operadora logística, psicóloga, psiquiatra e colaborador personalizável.
- Cards com nome, papel, descrição e links funcionais para visualização 3D quando o arquivo correspondente existe.
- Redirecionamento da jornada principal para `/caso017.html`, o fluxo completo (investigar, analisar, planejar, acompanhar, encerrar).
- Laboratório exploratório anterior continua disponível em `/game.html`; personagens animados seguem em `/viewer3d.html`.
- Imagens WebP otimizadas e versionadas dentro de `assets/v10/`: 4 personagens, galpão principal e diorama modular.
- Cópias das imagens leves guardadas no Drive na biblioteca visual do projeto.

## Status real da arte
- Fotografias/ilustrações: imagens conceituais 2D pré-renderizadas de modelos estilizados. São arquivos `.webp`, não modelos 3D.
- Galpão da abertura: composição estática com arte isométrica; não é ainda o modelo FBX/GLB convertido nem um mapa 3D navegável.
- O cenário original foi gerado com textos embutidos no material de referência; a interface não deve repetir legendas no mesmo local.
- Os retratos aprovados possuem fundos escuros com iluminação e não foram convertidos em recortes transparentes definitivos. Isso mantém a fidelidade visual à versão aprovada pelo usuário.
- O modelo 3D do colaborador personalizável ainda está em preparação. Os outros três têm versões animadas no laboratório; os GLBs originais não são incluídos no pacote público.

## Mapa da experiência
```text
/  (central de gestão)
   |-- /?view=equipe (4 personagens)
   |-- /caso017.html (jornada principal end-to-end)
   |-- /game.html (exploração 2.5D experimental)
   |-- /viewer3d.html (laboratório de animação e modelos 3D privados)
   |-- /?view=biblioteca (conteúdos educativos)
```

## Conformidade técnica
- Menu existente e demais rotas preservados; `v10.css` estende `menu.css` sem substituí-lo.
- Progresso da jornada completa: `localStorage['pilha-case017-v1']`; o antigo protótipo usa chave distinta `pilha-v08`, preservada.
- Ícones gerados pelo sistema interno atual do menu, sem dependências externas novas.
- Imagens hospedadas como arquivos do próprio deploy; acesso via caminhos relativos, inclusive no celular.
- Valores dos fatores de risco: pontuações fictícias para demonstração visual; não diagnósticas, não derivados de assessment aplicado.

## Pendências para o ciclo seguinte
- Exportar e otimizar FBX/GLB de galpão, porta, rack, paletes, empilhadeira, mesa e cadeira.
- Calibrar unidades, pivôs, colisões e densidade de polígonos; testar performance em dispositivo mobile real.
- Incorporar personagens em cenário 3D/2.5D com animações sincronizadas e interação com móveis.
- Testar feedback de todos os botões, fluxos de reinício, tamanhos móveis e acessibilidade com navegador real.
- Validar conteúdo pedagógico e mensagens relativas à NR-1 antes de uso formal.

## Referências
- [Protótipo Vercel](https://pilha-plus-game-preview.vercel.app/)
- [Equipe](https://pilha-plus-game-preview.vercel.app/?view=equipe)
- [Caso completo](https://pilha-plus-game-preview.vercel.app/caso017.html)
- [Biblioteca no Drive](https://drive.google.com/drive/folders/1B-mPPAQ1aPbBmAi-e8H21aFxKETnVX19)
