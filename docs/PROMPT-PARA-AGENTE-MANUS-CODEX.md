# Retomada do Pilha+ Game — Manus / Codex

Repositório: https://github.com/andreheck/PilhaGameNR1
PR de referência: https://github.com/andreheck/PilhaGameNR1/pull/1
Branch de referência: `feat/psychosocial-environment-simulation`

## Instruções iniciais

1. Leia `AGENTS.md`, `README.md` e `docs/CONTEXTO-PARA-AGENTES.md`.
2. Inspecione o PR #1, o estado atual da branch e as mudanças recentes antes de editar arquivos.
3. Examine `index.html`, `play.js`, `play.css`, `world3d.js`, `logistica-simulacao.html`, `logistica-simulacao.js`, `src/psychosocial-simulation.js` e os testes.
4. Execute `npm test` e registre o resultado real antes de modificar código.

## Estado conhecido

- O protótipo logístico é uma página independente, com personagens e indicadores fictícios, alertas, intervenções, orçamento e histórico local.
- A navegação principal desktop e móvel foi atualizada nesta branch para incluir acesso à “Simulação logística”. A página de simulação tem um link para retornar ao jogo.
- O acesso por link não significa que o galpão logístico já esteja incorporado à cena 3D principal. Essa integração ainda exige diagnóstico da arquitetura.
- Preview de referência: https://pilha-plus-game-preview-git-feat-psy-48ab59-andrehecks-projects.vercel.app/logistica-simulacao.html . Verifique o deployment mais recente se este link estiver desatualizado.

## Objetivo imediato

Validar navegação desktop e móvel, corrigir regressões, confirmar entrada e retorno entre jogo e simulação, e executar `npm test`. Verifique que a Missão 01, os casos e o progresso local continuam funcionando. Não declare QA visual sem testar em navegador.

## Próxima etapa

Depois da validação, inspecione `world3d.js`, `play.js`, `index.html` e os assets para propor uma integração gradual da missão logística ao mapa 3D. Primeiro documente a abordagem e os impactos; só depois implemente alterações compatíveis com a arquitetura real.

## Regras

- Trabalhe em branch de funcionalidade, com commits pequenos e claros.
- Não faça merge, deploy de produção ou alterações de configuração de produção sem autorização explícita.
- Não sobrescreva trabalho recente de outros agentes nem remova funcionalidades existentes.
- Use apenas dados e personagens sintéticos. Scores e efeitos são pedagógicos; não são diagnóstico, instrumento validado ou comprovação de conformidade com NR-1/GRO/PGR.
- Priorize medidas organizacionais, escuta e participação; não atribua culpa individual aos trabalhadores.
- Atualize documentação e testes conforme o que realmente foi entregue.
- Ao terminar, informe arquivos alterados, commits/PR, testes executados e resultados, limitações restantes e preview verificado.

## Critérios de aceite

- Navegação desktop e móvel funciona e é legível.
- Entrada e retorno da simulação funcionam.
- `npm test` passa, incluindo os testes de navegação.
- Não há regressões observadas nos fluxos existentes.
- Documentação corresponde ao estado real.
- Produção permanece intocada sem autorização.
