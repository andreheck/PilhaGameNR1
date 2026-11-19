# Design QA — PilhA+ Alpha v1.2

**Resultado:** testes estáticos aprovados; inspeção visual automatizada pendente.

## Escopo

- Biblioteca SVG e hotspots de Missão 01; estado local persistido e quiz.
- Integração da Missão 01 à central e aos Casos.
- Glossário com definições do projeto e fontes oficiais MTE.
- Continuidade de pontuação e estado do Caso 01.
- Importação voluntária de galpão GLB em ambiente 3D experimental.

## Testes executados

- `node --check` em scripts novos e script de integração `scene3d.module.mjs`.
- `node tests/mission01.test.mjs`: simulações 100/100 sucesso, 70/100 e 80/100 sem compreensão insuficiente, 90/100 aprovação; proteção de acesso e progresso legado.
- `node tests/static-flow.mjs`: regressão do Caso 01 (100/100 bem-sucedido; 23/100 malsucedido), restrições de privacidade, casos futuros indisponíveis, arquivos WebP válidos.
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

# Revisão25/10/2026 — contratação e evento de referência

Evidências de renderização do código `be6561e` (GitHub Actions40187986400), sem alteração de apresentação no ajuste de teste posterior. Comparação direta do anexo `codex-clipboard-475cdaf2-0911-462a-9d85-36982f4a17ab.png` com `docs/qa/npcs-fase1/evento-layout-desktop.png`, exibidos juntos para revisão. Anexo543×498, cartão interno aproximadamente450×445; implementação450×502 em viewport1366×900, deviceScaleFactor1. No celular320×844, cartão288px, uma coluna com rolagem vertical. Não comparar a largura móvel com o cartão desktop como se fosse a mesma escala.

- **Tipografia:** título16px, opções12px fortes, contexto12px e descrição10px; mesma hierarquia de título/contexto/impacto/decisão. Fonte system-ui preservada do produto. Quebra do título no celular é esperada pela largura; desktop permanece em uma linha. Sem texto truncado.
- **Espaçamento/layout:** cartão navy450px, raio18px, borda urgente rosa, ícone circular, cabeçalho lateral, opções empilhadas e custos à direita. Diferença aceitável:57px mais alto que o recorte-alvo, decorrente da linha final de saldo/tempo e espaçamento maior dos controles. Proteção é exibida somente quando ativa; ausência do chip da Psicóloga é intencional, pois a regra daquele exemplo não está implementada no motor atual.
- **Cores:** fundo azul escuro, rosa urgente, categoria/legendas laranja, chips verdes/vermelhos e preços dourados correspondem à referência. Foco amarelo mantido; controles desabilitados distinguem falta de saldo.
- **Imagens/ícones:** termômetro usa o path existente do catálogo Claude, não uma ilustração substituta. Moeda reutiliza o componente do produto. Retratos de contratação são as16artes aprovadas com object-fit contain. Cinco móveis novos RGBA ligados ao mapa; sombras/halos suaves provêm das artes geradas e não escondem NPCs. Variações animadas de máquina ainda futuras.
- **Texto/conteúdo:** custos600/1000/0 e efeitos do catálogo preservados. Impacto mostra −8de carga, diferente do −7do exemplo que inclui uma proteção não vigente. Consequência soma impacto e decisão. Explicação deixa explícito que NPC aparece após contratação; seis admissões iniciais incluídas; futuras900+140/semana, integração1semana.
- **Estados/interações:** seleção exige3gerentes de setores distintos e3funcionários sem repetir; escolha ativa amarela, confirmação desabilitada até completar; retratos/características e condições de apoio disponíveis. Evento preserva escolha gratuita, resultado persistido e conclusão idempotente. Partidas antigas não são reiniciadas.
- **Cabeçalho:** corrigida data empilhada em320px. Nova barra tem cerca de110px desktop e150px mobile, superfície transparente e botão fixo para recolher até faixa de setores. Quatro ambientes cabem no canvas; zoom não é redefinido ao recolher.

Resultado final: **857 verificações aprovadas, zero erros, cinco resoluções** no código `713ed54`, workflow [40190313868](https://github.com/andreheck/PilhaGameNR1/actions/runs/40190313868). Inclui320×844,1366×900,390×844,844×390 e1440×900, contratação, movimento, clique em NPC, retrato/fallback, estabilidade da ficha, persistência, cabeçalho e decisões de eventos. As falhas intermediárias foram corrigidas; o código está publicado no projeto Vercel de testes. [Fechamento e evidências](docs/releases/CONTRATACAO-EVENTOS-2026-10-25.md).

Validação visual **local** pela ferramenta de navegador permaneceu bloqueada pela revisão automática por falta de créditos. As evidências acima vêm do CI padrão do repositório e foram inspecionadas; não equivalem a testes em aparelho físico. Safari, aparelhos físicos e sessão humana longa continuam como homologações futuras. Sem achado visual bloqueante no cartão de evento; não alegar reprodução pixel a pixel, dadas as diferenças intencionais documentadas.
