# Design QA — PilhA+ Alpha v1.2

**Resultado:** testes estáticos aprovados; inspeção visual automatizada pendente.

## Escopo

- Biblioteca SVG e hotspots de Missão 01; estado local persistido e quiz.
- Integração da Missão 01 à central e aos Casos.
- Glossário com definições do projeto e fontes oficiais MTE.
- Continuidade de pontuação e estado do Caso 017.
- Importação voluntária de galpão GLB em ambiente 3D experimental.

## Testes executados

- `node --check` em scripts novos e script de integração `scene3d.module.mjs`.
- `node tests/mission01.test.mjs`: simulações 100/100 sucesso, 70/100 e 80/100 sem compreensão insuficiente, 90/100 aprovação; proteção de acesso e progresso legado.
- `node tests/static-flow.mjs`: regressão do Caso 017 (100/100 bem-sucedido; 23/100 malsucedido), restrições de privacidade, casos futuros indisponíveis, arquivos WebP válidos.
- SVG da biblioteca renderizado em PNG com CairoSVG para verificação aproximada do ambiente isométrico.

## Restrições

- Chromium headless não concluiu a captura da versão servida localmente; QA visual real de componentes JS no navegador ainda pendente.
- A biblioteca é um diorama **vetorial estático** com elementos interativos HTML, não a malha 3D final.
- A cena 3D permite abrir GLB enviado pelo navegador, mas o FBX original do galpão não foi convertido nesta sessão. Materiais, posições de NPCs e colisões demandam validação com o GLB real.
- A pontuação é apenas pedagógica (não métrica real de saúde, nem assessment normativo).

## Próximos critérios

1. Captura da missão em 1440×900 e 390×844; confirmar legibilidade do quiz e hotspots.
2. Importação em navegador real do galpão exportado e verificação de escala/visibilidade.
3. Ajuste de colisões e posicionamentos dos personagens na cena real.
4. Prática com usuário para confirmar compreensão das questões e clareza das respostas.
