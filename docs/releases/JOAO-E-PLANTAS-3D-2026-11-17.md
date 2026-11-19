# João e plantas 3D no mapa

## NPC João

- Registro canônico: `NPC-01`, Arquiteto, setor Escritório.
- O FBX animado de 16 de novembro foi convertido em atlas transparentes de caminhada, repouso e fala.
- O atlas substitui somente a camada visual do João; identidade, retrato, cargo, saúde simulada, rotas e progresso continuam ligados ao registro canônico.
- Os arquivos `.png` de origem dos atlas permanecem no repositório de ferramentas; o build entrega os sprites compactos `.sprite` já usados pelo renderer.

## Plantas do cenário

- As novas Monstera e Espada-de-São-Jorge substituem `planta-grande` e `planta-pequena` no catálogo de móveis e nos ambientes onde esses IDs já eram usados.
- Cada planta é renderizada em quatro orientações, num atlas WebP transparente de 256 × 1.280 px.
- Tamanhos entregues ao jogo: Monstera 55.132 bytes; Espada-de-São-Jorge 46.390 bytes.
- Os ZIPs mestres originais permanecem intocados na pasta de assets do usuário. O renderer lê os arquivos direto do ZIP e não os descompacta no disco.
- O asset de jogo é uma representação 2D leve para o mapa; os ZIPs continuam sendo as fontes 3D editáveis.

## Reproduzir

1. Coloque os dois ZIPs de plantas em `Assets_3D/Cenarios/Plantas`.
2. Execute `python tools/render-environment-plants.py` com Playwright e Chromium disponíveis; defina `CHROMIUM_PATH` se necessário.
3. Execute `npm run build` para regenerar o jogo distribuível.

## Validação desta versão

- `npm run build` concluído.
- Testes focados NPC, elenco, móveis e escala: 24 aprovados.
- `python tools/qa-joao-plants.py`: fluxo desktop 1440 × 900 concluiu; João caminhou; ambas as plantas e o sprite do João responderam HTTP 200; sem erros de navegador.
- `tools/qa-company-living.py` ainda espera seis opções de explorador. A interface atual mostra três; essa validação ampla precisa de atualização separada.
