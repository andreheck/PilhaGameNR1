# PilhA+ Game — Alpha v1.1

Protótipo educativo de simulação e gestão de fatores de risco psicossociais relacionados ao trabalho, com foco em participação, prevenção coletiva e decisões organizacionais. Público de perspectivas mistas: trabalhadores, liderança, RH/SST e profissionais de apoio.

## Acessos da versão atual

- **[Tela inicial — mapa geral da organização](https://pilha-plus-game-preview.vercel.app/)**
- **[Casos — cinco cenários, um disponível](https://pilha-plus-game-preview.vercel.app/?view=casos)**
- **[Conheça a equipe — quatro retratos](https://pilha-plus-game-preview.vercel.app/?view=equipe)**
- **[Caso 017 — simulação completa e pontuação](https://pilha-plus-game-preview.vercel.app/caso017.html)**
- **[Cena 3D experimental — caminhar e interagir](https://pilha-plus-game-preview.vercel.app/scene3d.html)**
- **[Laboratório 3D — importar modelos animados](https://pilha-plus-game-preview.vercel.app/viewer3d.html)**

## Evolução pedagógica

O Caso 017 contém investigação com orçamento de evidências, análise causal, plano de ação dentro de 12 unidades, monitoramento e pontuação final de saúde do ambiente de 0 a 100. A meta para cumprir o pré-requisito de avanço é **75 pontos**, com possibilidade de revisão. Há critérios de proteção da privacidade e enfrentamento dos fatores organizacionais. **Os Casos 018–021 continuam em desenvolvimento**, independentemente do resultado obtido.

O score é fictício e educativo, não é indicador clínico nem prova de conformidade com NR-1.

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `index.html`, `app.css`, `app.js` | Visão geral, casos, equipe, biblioteca, configurações |
| `caso017.html`, `case.css`, `case.js` | Jornada completa com escolha, pontuação e salvamento local |
| `scene3d.html` | Primeira integração 3D (personagem animado em cenário provisório) |
| `viewer3d.html` | Importação local e laboratório de animações GLB |
| `game.html`, `src/world.js` | Protótipo exploratório 2.5D legado |
| `caso017-v1.html` | Caso 017 legado com progresso anterior preservado |
| `assets/v11/` | Panorama geral, recortes de cenários e quatro personagens em WebP |
| `tests/static-flow.mjs` | Testes de cálculo, progressão, bloqueio e assets |
| `docs/SESSAO-20-ALPHA-11.md` | Decisões e descrição da versão |
| `design-qa.md` | Limites da QA visual e verificações realizadas |

## Recursos externos

- [Biblioteca no Google Drive](https://drive.google.com/drive/folders/1B-mPPAQ1aPbBmAi-e8H21aFxKETnVX19)
- [Registro dos modelos 3D](docs/PRODUCAO-DRIVE-INDEX.md)
- [Direção e arquitetura](docs/ARQUITETURA.md)
- [Histórico de sessões](docs/SESSAO-17-MENU-INICIAL-UX.md)

### Estado de validação

As verificações estáticas locais passaram, e a publicação na Vercel foi concluída. A verificação visual automatizada está pendente porque o navegador do ambiente bloqueou a captura (`ERR_BLOCKED_BY_ADMINISTRATOR`). O movimento 3D com GLB depende de os modelos já terem sido importados ao mesmo navegador pelo laboratório.

**Nota:** Jogo educativo, fictício. Não realiza diagnóstico médico ou psicológico, não revela prontuários e não substitui medidas e análises técnicas de gestão de riscos ocupacionais.
