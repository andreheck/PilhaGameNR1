# Postos da recepção — 18/11/2026

## Entrega

- O balcão comporta duas posições de atendimento, cada uma com monitor, teclado e cadeira.
- Gestão de pessoal permite alocar e liberar até dois funcionários ativos do Escritório.
- A seleção exclui a pessoa dedicada ao RH e o gerente atual do setor.
- Os funcionários escolhidos aparecem sentados nos postos da entrada e deixam o ciclo visual de circulação pelas mesas e pausas.
- A alocação preserva setor oficial, cargo, salário, saúde simulada, calendário e métricas da equipe. A recepção não é um novo setor e não altera a folha.
- Partidas antigas aceitam a lista ausente `staffing.reception`; ela passa a ser criada vazia ao salvar a partida após a atualização.

## Verificação

- `node --check` passou nos módulos de gestão de equipe, simulação contínua, interface e builder de NPCs.
- A bateria de regressão executada teve 54 testes: 42 aprovados e 12 falharam. Os testes de gestão de equipe e agenda social passaram. A maioria dos erros do renderizador vem do JavaScript truncado em `dist/ui/continuous/iso.js`; duas asserções de gestão também falharam e continuam por investigar.
- `npm run build` falhou ao remover/recriar `dist` com erro do Windows `EPERM`. A pasta está sendo servida por um processo local em `127.0.0.1:8765`; o processo não foi interrompido e os arquivos do diretório não foram removidos.
- A compilação e inspeção visual da recepção em desktop/tablet seguem pendentes.
- Sem commit, PR, merge ou publicação.

## Próximos passos

1. Executar build quando `dist` puder ser recriada sem interromper o servidor local.
2. Validar alinhamento dos personagens sentados nos postos em desktop e tablet.
3. Validar no mapa as etiquetas de ocupação da gerência, RH e sala de reuniões, além dos nomes dos participantes da reunião semanal no pátio.
4. Integrar layouts próprios dos modos Home Office e Cowork.
