# Empresa conectada e circulação — 22/10/2026

André pediu integrar a experiência, conectar visualmente os departamentos e acertar a movimentação em campo. Base conferida no GitHub e no Vercel: `codex/galeria-herois-canonica`, PR #33, commit `0c3dba6c3e1b8b64e5ceac0179aaaafa594fc851`, deployment `dpl_13XgcSEHzAoZqVu2DXayvBUs9X2Z` READY. Nenhuma contribuição remota nova no fetch desta entrega. Nova branch: `codex/empresa-conectada-circulacao`, incremental sobre a PR #33. Continua a autorização de atualizar o projeto Vercel de testes; merge depende do PM.

## Mudanças e critérios

- Uma base comum reúne Escritório, Produção e Atendimento. As antigas linhas entre centros das salas foram substituídas por duas passagens pavimentadas, na altura dos pisos, com marcações fixas e portas recortadas nas paredes de destino. A rede conecta os três setores sem criar atalhos através do mobiliário.
- Dois NPCs fazem travessias curtas pelas entradas, preservando a própria aparência ao mudar de departamento. A renderização usa os atlas Walking dos modelos existentes, sem novos assets pagos ou troca da arte dos heróis.
- Os 11 caminhantes de cada ambiente começam espaçados e seguem um circuito contínuo que visita os corredores. Pausas curtas e velocidades individuais são preservadas; a distância para o caminhante à frente limita o avanço. O circuito mantém margem de 0,2 unidade de toda a mobília original e instalada, incluindo os volumes ampliados por ergonomia/apoio.
- Velocidade mínima mais perceptível no enquadramento geral, passos ligados à distância percorrida e direção do atlas corrigida: linha 0 = +Y (esquerda/baixo), linha 1 = +X (direita/baixo), linhas 2/3 para os sentidos opostos. Trabalhadores sentados permanecem nos postos.
- A disposição responsiva usa as dimensões do mapa completo, não a área reduzida pelo painel. Abrir um setor não reorganiza os departamentos. Redimensionamentos reenquadram a câmera suavemente; pausa explícita continua estática.
- Orçamento, dupla, formação, recompensas, eventos e relógio de 7 dias por hora real ativa não foram alterados. Circulação visual não avança a campanha.

## Validação

- Suíte completa: 19 arquivos, incluindo quatro novos testes de circulação. Verificações de sintaxe e `git diff --check`.
- Teste geométrico percorre todo o circuito dos três ambientes e verifica afastamento da mobília original, instalações e dimensões ampliadas.
- Teste de 2.400 quadros (dois minutos de animação simulados, não de campanha) verifica os 33 caminhantes: deslocamento contínuo, distância mínima e atividade de cada personagem; também verifica continuidade dos dois NPCs nas passagens e uso das quatro direções do atlas. Pausa e troca de orientação/foco verificadas.
- Navegador desktop local com `prefers-reduced-motion: reduce`: amostras sucessivas confirmaram deslocamento de trabalhadores e travessias. Pausa deixou ambas as coleções de posições idênticas; retomada confirmada.
- Navegador em viewport móvel de 390×844: as duas conexões permaneceram idênticas antes/depois de abrir Produção. No desktop também se preservaram Escritório–Atendimento e Escritório–Produção durante o foco do setor.
- Inspeção visual de mapa geral, portas, corredores, personagens de atlas e painel de Produção. Instrumentação temporária de leitura removida ao concluir.

## Limitações e decisões pendentes

O estilo continua isométrico em canvas: os NPCs dos modelos 3D usam sprites pré-renderizados. Os dois NPCs de ligação fazem travessias pelas entradas; os demais circulam dentro de seus departamentos. Isso não implementa tarefas individuais, agendas ou inteligência comportamental. O espaçamento entre caminhantes é definido ao longo do circuito; não há física completa de colisão entre todos os sprites, trabalhadores sentados e visitantes. A rede é recomposta apenas ao mudar entre paisagem e retrato. Não houve nova sessão de quatro horas nem medição formal de desempenho em todos os aparelhos. Aceite do PM/PO e merge seguem pendentes.
