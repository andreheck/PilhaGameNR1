# Entrada, configurações e orb coletivo — 09/11/2026

## Escopo autorizado e base

André pediu seleção automática de heróis apenas na primeira vez, retorno à abertura pelo logo, configurações e o orb animado do app PilhA+. Base: `4a4b5fa041f91f855d7a05ef33c8818bef2c7dad`, branch `codex/unified-social-agenda`, PR #69. Preservados calendário de15 minutos, compras/cadeiras, NPCs, câmera, eventos, contratação e gravação transacional. Sem merge em main; apenas preview de testes autorizado.

## Comportamento e critérios

- Sem dupla válida salva: vídeo → Conhecer o jogo → setores → orientação → escolha dos dois heróis → contratação inicial → mapa.
- Com dupla salva: abertura oferece **Continuar partida** e retoma o mapa sem orientação/seleção obrigatórias. O botão secundário **Conhecer o jogo** mantém a exploração dos setores e depois retoma a partida. Contratação inicial pendente é retomada antes do mapa, sem repetir a escolha dos heróis.
- Saves antigos com dupla válida são reconhecidos sem novo marcador ou migração. A consulta/troca voluntária continua em Menu → Heróis. Apagar dados do navegador elimina o marcador local; não existe conta/sincronização remota nesta versão.
- Logos são botões nativos com nome acessível: mapa, cabeçalho recolhido/mobile, setores, galeria e diálogos. Voltar aguarda a transação em curso e navega para a abertura; não dispara fechamento dos diálogos nem confirma rascunhos de contratação/dupla. Progresso confirmado permanece salvo.
- Configurações na abertura e em Menu → Configurações: efeitos sonoros, movimento seguindo dispositivo/reduzido/completo, exibição do orb e restauração dessas preferências. Chave separada `pilha-game-preferences-v1`; sem reset do jogo nem alteração da duração das semanas. Bloqueio da gravação informa aplicação apenas na sessão.
- Configurações e retorno à abertura não pausam implicitamente a simulação. O jogador usa Pausar jogo; a abertura informa se a empresa está pausada ou se o relógio continua. O tempo decorrido é conciliado pelo motor existente ao retomar.

## Orb: origem visual e dados

Referência local consultada no app `C:/Users/CRM7/Documents/pilha-plus-app`: `src/features/profile/components/EnergyOrbitalGauge.tsx`, `LiquidEnergySurface.tsx` e `src/features/measurement/domain/energyScore.ts`. Adaptados contorno de96 pontos, lóbulos/amplitudes em função do valor, oscilação, película/reflexos e duração. Nenhuma dependência React ou informação pessoal do app foi importada.

O valor é a média arredondada da **saúde simulada dos funcionários humanos ativos**, derivada de `staffView(state, liveActors)`. Inclui benefícios temporários já calculados de restauração e cadeira realmente usada. Não soma pontos por abrir a tela. Candidatos, desligados, afastados, integração e Robô Azul ficam fora. Sem equipe ativa mostra traço/“Sem equipe ativa”, e não0. Setores têm médias próprias; total pondera pessoas, não médias dos setores.

Não substituir o índice da empresa/meta45: o orb descreve pessoas e o índice descreve condições. Tooltip/nome acessível e diálogo explicam a distinção. Indicador flutuante no canto inferior do mapa, sem aumentar o cabeçalho. Valor alto suaviza o contorno; valor baixo aumenta irregularidade. Pausa, aba oculta e preferência de movimento reduzido suspendem oscilação/reflexos; o número continua legível. Atualização acompanha o relógio/atores, sem ler dados reais do app.

## Verificação e evidências

- Testes de entrada/persistência, contratação pendente, média ponderada/sem equipe/bônus individual, preferências corrompidas/bloqueadas e geometria do orb em `tests/entry-settings-orb.test.mjs`.
- `qa-entry-settings-orb.py`: desktop1366×768, celular390×844, paisagem844×390 e largura320; retomada sem galeria, retorno de modais/galeria, saldo/dupla preservados, exploração opcional, configurações persistentes, áudio desativado e orb animado/reduzido. Capturas e relatório em `artifacts/entry-settings-orb/`, arquivados pelo CI como `entry-settings-orb-qa`.
- Jornada completa continua cobrindo primeiro acesso, seis contratações, compras, pausas, cadeira, calendário e foco. Fixtures de jogadores existentes passaram a usar Continuar partida, preservando os testes posteriores. npm e workflows do commit final vinculados na PR.

## Pendências preservadas

QA em aparelhos físicos e leitores de tela; controles individuais completos de heróis, quatro poderes especiais restantes e XP contínuo; clipes riggados de sentar/levantar/carregar, ocupação de16 assentos Wi-Fi; adaptação da sala do gestor #74 e arte da TV BI. Rótulos do mapa podem sobrepor personagens. Nenhum desses itens é declarado concluído nesta entrega. Todos os valores de saúde são fictícios, sem interpretação clínica.
