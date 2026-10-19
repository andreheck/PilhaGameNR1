# PilhA+ Game — Roadmap de produto

**Repositório:** `andreheck/PilhaGameNR1`  
**Princípio de organização:** o PilhA+ Game é um projeto independente. O aplicativo principal PilhA+ permanece em seu próprio repositório; funcionalidades do Game não devem ser tratadas como implementadas no App.

## Visão do produto

O PilhA+ Game transforma temas de saúde e segurança no trabalho, fatores psicossociais, liderança e condições de trabalho em experiências educativas e simulações interativas. A identidade do robô PilhA+ e elementos de gamificação podem conectar os módulos, mantendo clara a diferença entre conteúdo educativo, simulação e evidência real.

## Módulos e iniciativas

### 1. Missões e casos educativos — existente em alpha

A versão documentada Alpha 1.4 reúne um hub com escritório 3D modular, painel contextual e navegação adaptada a desktop/mobile. Os casos jogáveis descritos atualmente são:

1. Galpão logístico — sobrecarga, jornada, turnos e conflitos.
2. Liderança e reuniões — segurança psicológica e silêncio.
3. Gestão de pessoas — autonomia, papéis e demandas contraditórias.
4. Saúde e bem-estar — sigilo, escuta e prevenção.
5. Tecnologia e TI — hiperconexão, plantões e descanso.

Os casos usam escolhas situacionais e pontuação pedagógica. A documentação alerta que o conteúdo dos Casos 02–05 ainda requer revisão externa especializada. A pontuação é fictícia/educativa: não demonstra conformidade legal, não mede saúde clínica e não avalia pessoas reais.

Referência: [ALPHA-14.md](ALPHA-14.md).

### 2. Missão 01 — fundamentos da NR-1

A missão mantém biblioteca e quiz com fonte de conteúdo própria, progresso local e regras de pontuação documentadas. A biblioteca 3D experimental oferece três estações de leitura e mantém alternativa 2D. Recursos 3D precisam de validação em navegador e dispositivos reais antes de qualquer alegação de suporte oficial amplo.

Referência: [SESSAO-22-BIBLIOTECA-3D.md](SESSAO-22-BIBLIOTECA-3D.md).

### 3. Simulador de Propostas de Trabalho — especificação

O simulador pertence ao PilhA+ Game e está organizado como módulo dentro deste repositório:

[`simuladores/propostas-de-trabalho/README.md`](../simuladores/propostas-de-trabalho/README.md)

A proposta é configurar ofertas, ajustar componentes dentro de limites e comparar cenários. A experiência considera faixas de referência baixa, média e alta, desde que exista benchmark válido, com fonte, região, ocupação e data.

O briefing inicial também prevê explorar indicadores de atratividade/aceitação, permanência, risco de adoecimento, acidentes, afastamentos, bem-estar/felicidade e motivação. Esses indicadores são hipóteses de simulação; não devem ser apresentados como causalidade comprovada nem como previsões individuais sem método e validação adequados.

**Estado:** especificação de produto; implementação ainda não confirmada. Próximos passos: descoberta da jornada, modelo de proposta, benchmarks, protótipo, motor de simulação justificável, revisão ética e testes.

### 4. Vídeo de apresentação em motion graphics — backlog

Criar um vídeo de apresentação em motion graphics com energia visual pulsante para explicar o PilhA+ Game e demonstrar sua experiência. A produção está prevista para usar o repositório público Hyperframes e o fluxo de trabalho com Claude já disponível para o projeto.

Antes de produzir:
- confirmar o repositório Hyperframes e as instruções atualizadas;
- definir objetivo, público, duração, mensagem principal e roteiro;
- escolher as cenas e os recursos reais do Game a demonstrar;
- distinguir funcionalidades existentes de conceitos ainda planejados;
- validar o vídeo final antes de utilizá-lo em apresentações externas.

**Estado:** item de backlog; roteiro, cenas e duração permanecem por definir. Não declarar o vídeo concluído.

## Princípios transversais

- Distinguir recurso implementado, protótipo e plano futuro na documentação e na interface.
- Identificar conteúdo demonstrativo e pontuações fictícias.
- Não representar simulações como diagnóstico, conformidade legal ou previsões determinísticas.
- Priorizar acessibilidade, navegação por teclado, responsividade e alternativas quando 3D/WebGL não estiver disponível.
- Evitar avaliações ou rankings automatizados de pessoas candidatas.
- Para o simulador de propostas, documentar fontes, metodologia, incerteza e limites de qualquer benchmark ou estimativa.
- Manter privacidade e minimização de dados como requisitos desde a concepção.

## Próxima sequência recomendada

1. Validar Alpha 1.4 visualmente em desktop e mobile e revisar conteúdo pedagógico.
2. Detalhar e prototipar o Simulador de Propostas de Trabalho como módulo isolado.
3. Definir fontes e metodologia antes de apresentar benchmarks numéricos ou previsões.
4. Definir o roteiro e produzir o vídeo motion graphics.
5. Atualizar este roadmap conforme entregas reais e testes concluídos.
