# Revisão da equipe viva — 23/10/2026

## Base conferida
- GitHub: PR #38, branch feat/equipe-viva-calendario, HEAD 1a2079727bdd65e3e7a86da3a6f1d4f133ad418a.
- Vercel de testes: deployment dpl_F3mw8zWnoi12mcyWjMZ4ZAN3khQM, READY, SHA 4fb563d6145821084029d81da7b263e2bd5af114.
- Foram lidas a governança, AGENTS, as entregas de empresa contínua/equipe viva e o backlog de artes. A base contém galeria nova, quatro ambientes, calendário contínuo e 16 identidades. O trabalho C3 anterior permanece no checkout original, sem sobrescrita.

## Pequenos ajustes
1. Pausar depois de uma suspensão superior a 240 semanas perdia o tempo restante: setPaused agora consome os lotes pendentes antes de congelar o timestamp. Regressão reproduzida: 500 semanas resultavam em semana 241; agora chegam à semana 501 com o restante de 220 ms intacto. Saldo e decisão pendente permanecem preservados.
2. O teste das fichas canônicas importava um gerador que regravava ui/hero-sheets.js, causando falha CRLF no Windows e possível leitura concorrente de arquivo incompleto. O gerador agora oferece função pura; escrita ocorre somente pela execução CLI. O teste compara conteúdo normalizando apenas quebras de linha e verifica que não houve escrita.

## Validação local
Windows, Node 24.18.1:
- npm test: aprovado, 21 scripts.
- build contínuo + living + layout: aprovado.
- node tests/company-continuous.test.mjs: 17 aprovados.
- node tests/company-living.test.mjs: 15 aprovados, incluindo regressão de pausa após 500 semanas.
- node tests/hero-gallery.test.mjs: 5 aprovados após ajuste final do gerador.
- git diff --check e sintaxe do motor: aprovados.
O runner node --test encontrou spawn EPERM no sandbox; os mesmos arquivos foram executados diretamente com node, usando node:test. Houve tentativa concorrente de build com ENOTEMPTY; o build posterior concluiu. Não são falhas de gameplay.

## Limites e continuidade
Não houve nova sessão de navegador ou homologação em dispositivo físico nesta revisão de lógica/testes. Não houve merge ou publicação desta correção. A versão pública conferida permanece a indicada acima. Artes canônicas dos 16 NPCs e trajetos completos de restauração continuam pendentes conforme backlog; não foram substituídos por imagens de outras pessoas. A versão contínua mais recente foi preservada, sem reintroduzir o fluxo de compras avançando semanas do rascunho anterior. Seis ações SAMPLE permanecem sujeitas à comparação com fichas canônicas. O calendário de 2 minutos/semana continua experimental.
