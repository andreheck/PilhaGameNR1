# Cadeiras individuais e influências do funcionário — 09/11/2026

Entrega na frente `codex/unified-social-agenda`, PR #69. Base: `3840754`, caminhada com semana de15 minutos já publicada no preview. Nenhum merge ou alteração de main.

## Itens compráveis e efeitos

Os três modelos fornecidos pelo PM foram encontrados na pasta organizada `Assets_3D/Props_Moveis/Cadeira_Giratoria`. O ZIP traz Descompressão e Pensamento; Produção veio do GLB avulso. Originais preservados em `tools/chair-sources/`, fora do build público. Ícones do pacote e o ícone de Produção fornecido em Downloads foram usados, sem arte substituta ou chamada paga de geração.

| Item | Nível1 | Fatores individuais por nível | Clipe original |
| --- | ---: | --- | --- |
| Cadeira da Produção | 900 créditos | +4 Ritmo e carga, +2 Reconhecimento | `subir`,2,4 s |
| Cadeira do Pensamento | 1.100 créditos | +4 Autonomia, +2 Liderança | `digitando`,1,8 s |
| Cadeira da Descompressão | 1.200 créditos | +3 Ritmo e carga, +3 Segurança psicológica | `pulsar`,3 s |

Três níveis, preços segundo os multiplicadores existentes. Fatores individuais multiplicados pelo nível; saúde temporária **+2/+3/+4** nos níveis1/2/3. Coeficientes fictícios de balanceamento, não eficácia clínica. Os indicadores respeitam o limite0–100.

- Compra por setor de trabalho: Escritório, Produção ou Atendimento. Seleção de pessoa ativa do próprio setor. Uma cadeira de cada tipo por setor e um assento individual designado por pessoa; melhorar renova o mesmo objeto.
- **Só recebe quem está efetivamente sentado.** O renderer informa ocupação; a consulta de saúde valida titularidade, atividade e liberação do assento antes de derivar o bônus. Fora do uso, não há ganho individual. Não muda os fatores coletivos nem o índice do setor.
- Saúde de base, salário e receita passiva não são alterados pela leitura da ficha ou pelo pulso da animação. Não há empilhamento por quadro nem débito recorrente pelo uso. A compra é debitada uma vez por nível, pela transação existente.
- Reatribuição gratuita, validada contra o elenco ativo. A disponibilidade considera o fim da janela de trabalho do usuário anterior. O novo usuário aguarda a liberação e uma nova janela de trajeto; não há dois bônus no mesmo assento nem teleporte para ativar a compra.
- `chairAssignedAt` e `chairAvailableAt` usam semanas fracionárias. Mantêm compatibilidade com o relógio e com o reload. Upgrade conserva a liberação e o usuário; trocar usuário é uma ação distinta.
- Validação detecta usuário duplicado, titulares diferentes entre níveis, IDs inválidos e datas corrompidas. Limite defensivo de recibos passa de288 para512 para comportar o catálogo expandido e promoções existentes, mantendo validação de cada registro e o limite de tamanho do save.

## Uso físico e visual

Atlas transparentes de oito quadros por modelo, com a projeção isométrica e escala métrica atuais;1,22–1,55 m de altura. Os marcadores originais `SIT_*` ficam a aproximadamente0,56 m. Modelos, projeções, clipes e SHA-256 estão em `assets/individual-chairs/catalog.json`. O navegador carrega os atlas leves; GLBs originais ficam como fonte de desenvolvimento.

Os três móveis entram no catálogo de38 assets e no total de41 melhorias. Instalação passa pelo layout sem sobrepor portas, corredores ou outros móveis, inclusive no ensaio de níveis máximos. As animações respeitam a pausa. Na falta da imagem, há o fallback procedural de cadeira existente.

O NPC vai até o assento por caminho calculado, senta durante sua pausa no posto e retorna. A rota mantém o limite de caminhada da entrega anterior. A escolha do destino permanece estável durante a janela de trabalho; compras/reatribuições não o teleportam. Enquanto usa a cadeira, score e aparência respondem ao bônus; ao sair, o bônus some. Pátio, sete pausas por14 dias e reuniões semanais permanecem na agenda existente.

## Ficha pelo clique no mapa

As influências aparecem logo após o retrato e a saúde, antes dos dados extensos/narrativa:

- **Agora:** benefício da pausa/convívio e da cadeira efetivamente usada; valor temporário, origem, nível e usuário.
- **Condições:** os seis fatores nas mesmas cores das melhorias; indicadores individuais incluem apenas os efeitos do assento em uso, sem adulterar o índice coletivo.
- **Fontes do setor:** intervenções ativas com maturidade/nível/sinergia/poder já considerados, efeitos positivos e negativos de ocorrências, vagas sem cobertura e restauração compartilhada/recente. Chips reconciliados com os fatores reais antes do limite0–100.
- **Gestão:** previsão com condições atuais e saldo já contabilizado no último fechamento são distintos. Consultar não aplica −5/+7 novamente. A regra usa saúde de base do gestor, sem os bônus temporários de cadeira ou pausa.

Ganhos em verde, reduções em rosa, borda e barras na cor do fator, com texto e sinal para não depender apenas de cor. Os cards não chamam contribuições ao fator de pontos diretos de saúde. Ocorrências/decisões são descritas por semana e fator: o save atual não guarda o ID causal de cada efeito acumulado, portanto não se inventa um título de evento.

Atualização acompanha o tick da partida (aproximadamente3 s), preservando foco e posição de leitura. Com pausa, o conteúdo estável preserva o DOM; sem pausa, os valores seguem a empresa enquanto a ficha está aberta. A explicação da caminhada usa o ritmo individual e o limiar real de saúde de base, evitando chamar todo ritmo inferior a1 de “60%”.

Na conciliação da explicação, foi encontrada uma lacuna: a aplicação da gestão percorria só os16 NPCs iniciais. Agora percorre o elenco contratado, incluindo os adicionais após sua integração/primeira semana trabalhada. Não há aplicação retroativa nem alteração dos critérios aprovados.

## Verificação

- `npm test`: aprovado antes do ajuste final de apresentação/fallback; suíte completa volta a rodar no CI do commit final.
- **24/24** testes direcionados: cadeiras, propriedade/exclusividade, reatribuição/liberação, persistência atômica, uso físico dos três assentos, influências reconciliadas, relógio, clipes e escala/layout máximo.
- `qa-individual-chairs.py`: desktop1366×768 e celular390×844, compras reais da UI (saldo10.000→6.800), três modelos instalados, índice coletivo inalterado, ocupação real, clique no personagem, efeitos positivos/negativos, expiração do bônus e reatribuição gratuita. Zero exceções; capturas em `artifacts/individual-chairs/qa/`.
- Jornada completa de regressão e checks finais vinculados à PR/CI. Artefato `individual-chairs-qa` inclui evidências e relatório; fonte completa continua no artefato da jornada.

## Limitações e pendências preservadas

Sentar usa a pose procedural já existente; Mariana/Beatriz usam esse fallback no assento, pois os rigs aprovados ainda não têm clipes próprios de sentar/levantar. Não declarar animação riggada de sentar como entregue. Encaixe dos16 assentos do banco Wi-Fi, clipes riggados de carga/descarga e inventário físico persistente de materiais continuam pendentes.

A sala do gestor da #74 continua em outro renderer e requer adaptação; TV BI ainda depende da arte final. Outras PRs com conteúdo exclusivo não foram descartadas. A semana de15 minutos, renda semanal, progresso, casos antigos e catálogo canônico de pessoas foram preservados. QA mobile é emulação no navegador; dispositivos físicos e leitores de tela permanecem em homologação. Sem merge; publicação somente no preview de testes autorizado pelo PM.
