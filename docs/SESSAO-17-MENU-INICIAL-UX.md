# Sessão 17 — Hub de Entrada v0.9 do PilhA+ Game

Data de trabalho: 13/10/2026  
Estado: primeiro menu de entrada integrado a Capítulo 01 e Laboratório 3D.

## Problema de produto
O protótipo inicial abria diretamente no mapa de investigação. O usuário precisava de uma **porta de entrada do jogo**, com começo claro, retomada de progresso, acesso a equipe e laboratório, conteúdo educativo e configurações. Esta sessão transforma a experiência em um produto demonstrável enquanto o cenário 3D e as animações são finalizados.

## Público e plataforma
- Perspectivas do gameplay: liderança, RH/SST e trabalhadores.
- Mobile-first com adaptação ao navegador desktop.
- Uso: demonstração comercial e validação conceitual, sem promessa de treinamento normativo completo.

## Direção visual
- Marinho e grafite: confiança, gestão e espacialidade.
- Laranja: chamadas principais e prioridades.
- Sálvia/verde: prevenção, investigação e apoio.
- Off-white: superfície neutra para conteúdo.
- Tipografia sem serifa, cards arredondados, contraste, botões grandes, foco visível.
- Arte inicial com uma **ilustração vetorial isométrica original**, não um cenário 3D definitivo.
- Os avatares nas fichas são ilustrações temporárias; não representam os arquivos Meshy.

## Wireframe — desktop (≥ 876 px)
\`\`\`text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PilhA+          Início  Missões  Equipe  Biblioteca  Laboratório  Sobre [⚙]│
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ CAPÍTULO 01 ALPHA                                                      │ │
│ │                                                                         │ │
│ │ Um ambiente.      [diorama/ilustração isométrica do escritório]        │ │
│ │ Muitas perspectivas.                                                   │ │
│ │ Suas decisões.                                                         │ │
│ │ [Iniciar Caso 017] [Continuar / Explorar casos]                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ Bem-vindo, Jogador.                                                        │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                 │
│ │ Missões e casos │ │ Equipe          │ │ Laboratório 3D  │                 │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                 │
│ ┌───────────────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ Caso 017 — progresso/evidências    │ │ Estágio de desenvolvimento      │ │
│ └───────────────────────────────────┘ └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Protótipo educacional / ressalva ética                                      │
└─────────────────────────────────────────────────────────────────────────────┘
\`\`\`

## Wireframe — mobile (≤ 580 px)
\`\`\`text
┌───────────────────────────┐
│ PilhA+             ALPHA  │
├───────────────────────────┤
│ HERO / TÍTULO             │
│ [Iniciar] [Continuar]     │
│ [arte isométrica]         │
├───────────────────────────┤
│ Boas-vindas               │
│ ┌───────────────────────┐ │
│ │ Missões e casos        │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Equipe                 │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Laboratório 3D         │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Caso 017 / Progresso   │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Evolução do projeto    │ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ Início Jogar Casos Equipe │
│         Ajustes           │
└───────────────────────────┘
\`\`\`

## Mapa de navegação
\`\`\`mermaid
flowchart TD
    A["Menu principal /"] --> B["Novo jogo"]
    A --> C["Continuar"]
    A --> D["Casos"]
    A --> E["Equipe"]
    A --> F["Laboratório 3D"]
    A --> G["Biblioteca"]
    A --> H["Configurações"]
    A --> I["Sobre"]
    B --> J["/game.html — Caso 017"]
    C --> J
    D --> J
    D --> K["Casos 018/019 em planejamento"]
    E --> F
    F --> L["Modelos GLB privados importados localmente"]
    G --> M["Conceitos e referências do projeto"]
    H --> N["Preferências locais e reiniciar progresso"]
    J --> A
\`\`\`

## Rotas e estados
| Destino | Rota | Situação |
|---|---|---|
| Menu | \`/\` | Funcional |
| Capítulo 01 | \`/game.html\` | Jogável (protótipo Alpha) |
| Casos | \`/?view=casos\` | Caso 017, outros indisponíveis |
| Equipe | \`/?view=equipe\` | Cards e atalhos do laboratório |
| Biblioteca | \`/?view=biblioteca\` | Conceitos curtos em acordéons |
| Configurações | \`/?view=configuracoes\` | Preferências e reinício |
| Sobre | \`/?view=sobre\` | Proposta e status |
| Lab 3D | \`/viewer3d.html\` | GLB selecionado pelo usuário no navegador |

As páginas do menu usam \`history.pushState\` com \`popstate\` e links navegáveis. O progresso do Caso 017 continua em \`localStorage['pilha-v08']\`; nenhuma migração ou perda de dados é exigida. As preferências usam \`localStorage['pilha-menu-preferences-v1']\`.

## Interações implementadas
- **Iniciar Caso 017**: confirma reinício quando já houver progresso e abre \`/game.html\`.
- **Continuar**: aparece quando existe progresso no navegador; abre \`/game.html\`.
- **Missões**: lista o Caso 017 e mantém Casos 018/019 identificados como planejamento, com ações desativadas.
- **Equipe**: apresenta três modelos 3D (operadora, psicóloga, psiquiatra) com atalhos para \`/viewer3d.html?personagem=...\`.
- **Biblioteca**: conceitos educativos em acordéons, sem exigir autenticação.
- **Configurações**: nome local, contraste, fontes maiores, redução de movimento, som de feedback do menu e reinício do progresso.
- **Sobre**: propósito, limites, status de desenvolvimento, Drive e GitHub.
- **Navegação**: barra desktop e navegação inferior no mobile; controle por teclado e indicador de foco.

## Limites e ética
- O menu é uma UI de demonstração; não é um jogo finalizado.
- Avatares ilustrados e cenário SVG são provisórios e originais.
- Os GLBs originais **não** são incorporados no menu nem no deploy.
- Indicadores, efeitos e pessoas são fictícios.
- Não há diagnóstico clínico nem acesso gerencial a prontuários.
- Conteúdo sobre NR-1 demanda validação técnico-jurídica antes de uso como treinamento formal.

## Critérios de aceite
1. A rota \`/\` abre o menu em celular e desktop.
2. \`/game.html\` abre o Capítulo 01 sem afetar os dados armazenados.
3. \`/viewer3d.html?personagem=psicologa\` pré-seleciona a psicóloga; equivalente para operadora e psiquiatra.
4. Navegação de volta/avança do browser e links diretos funcionam.
5. Preferências e apelido permanecem após recarregar a página.
6. Novo jogo e reinício solicitam confirmação quando houver progresso.
7. Links externos preservam a proteção dos arquivos privados no Drive.
8. Casos futuros não exibem botões enganadores.

## Próximo ciclo
Aprimorar o visual do mapa 2.5D com assets definitivos, conectar progressão de missões ao menu, e executar avaliação de usabilidade e acessibilidade em smartphones reais.
