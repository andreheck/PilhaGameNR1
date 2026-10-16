# Orçamento, melhorias e previsões — PilhA+ Game

## Comportamento de entrada
- Cada navegador/usuário local recebe saldo inicial fictício de 10.000 créditos na primeira visita.
- Um aviso flutuante informa o saldo, explica as melhorias e oferece acesso direto à tela Investimentos.
- O aviso pode ser dispensado e não reaparece depois de marcado como visto no `localStorage`.
- Como o armazenamento é local, o saldo não sincroniza entre dispositivos nem representa dinheiro real.

## Melhorias disponíveis

| Melhoria | Custo | Previsão educativa para 30 dias |
|---|---:|---|
| Ergonomia e estação de trabalho | 1.800 | Menor desconforto e melhor fluidez operacional |
| Pausas e cobertura de jornada | 1.200 | Rotina mais sustentável e pausas realizadas |
| Canal de escuta e acompanhamento | 900 | Mais confiança para relatar obstáculos e pedir apoio |
| Redimensionar capacidade da equipe | 3.200 | Menor sobrecarga se capacidade acompanhar demanda |
| Formação de liderança | 1.500 | Conversas mais claras e melhor encaminhamento |
| Reorganizar layout e circulação | 2.100 | Fluxos mais claros e menos interrupções |

Cada cartão mostra custo, descrição, previsões, indicadores sintéticos que podem ser alterados e horizonte de 30 dias. A compra atualiza o saldo, impede saldo negativo e compra duplicada, registra histórico e reflete visualmente uma cor de melhoria no setor; algumas categorias também alteram a rotina/emoji da operadora. As melhorias compradas são reaplicadas ao recarregar a página.

## Persistência e testes
- Chave `pilha-investment-v1`: versão, saldo, gasto acumulado, melhorias compradas, histórico, dia simulado e previsões.
- Chave `pilha-welcome-alert-v1`: controle do aviso inicial.
- Testes em `tests/investment-system.test.mjs` cobrem saldo inicial, persistência, compra, limite de saldo, compra duplicada, previsão e presença da UI.
- Executar `npm test` antes de aceitar.

## Limitações e próximos passos
- Previsões são determinísticas, sintéticas e pedagógicas; não são estimativas empíricas de retorno financeiro nem previsões clínicas.
- O dinheiro e o estado ficam no navegador; ainda não há autenticação ou sincronização de contas.
- O efeito visual de melhoria é uma alteração estilizada do setor e um anel de instalação; não substitui a implementação de objetos 3D específicos para cada upgrade.
- Ainda é necessário verificar no navegador o layout, as animações, o som, o armazenamento e os erros de console.
