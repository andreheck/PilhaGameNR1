# Celular empresarial, dez troféus e PT22

Solicitação do PM em 10/11/2026, na continuidade da branch `codex/unified-social-agenda` / PR #69. Base da entrega anterior: `0f1c45b`, aprovada nos quatro workflows e publicada no preview. Prioridade visual e de QA desta etapa: desktop e tablet. Preservar fallback responsivo existente não significa manter mobile como foco de evolução.

## Celular da empresa

O botão **Celular** fica visível no cabeçalho, com contador de mensagens não lidas. A interface lateral tem cinco aplicativos:

- **Mensagens:** ocorrências pendentes, aporte semanal recebido, vagas, afastamentos simulados, histórico da empresa, avisos e conquistas. Abrir uma ocorrência reaproveita a decisão existente; não escolhe uma resposta pelo jogador. Mensagens podem ser marcadas como lidas.
- **Finanças:** saldo, próximo aporte, previsão operacional e custo semanal de pessoal; último fechamento e histórico recente. Previsão e resultado contabilizado são separados. Acesso ao relatório financeiro completo existente.
- **RH:** ativos, afastamentos, integração e trabalhadores com saúde de base abaixo de 55/100; abertura da ficha correta e de suas influências. Adoecimento é representado pelos dados simulados existentes, sem inventar diagnóstico ou dado clínico.
- **Vagas:** cobertura, postos abertos, integração e apoio temporário por setor; acesso à contratação/gestão de pessoal existente, com os mesmos custos e confirmação.
- **Troféus:** resumo das conquistas e entrada na galeria de dez objetivos, com critérios detalhados do PT22.

Os relatórios são derivados do mesmo estado da partida. Não há uma segunda contabilidade, RH paralelo, envio de SMS/email ou serviço externo de mensagens. Atalhos anteriores de ações no Menu foram preservados; o celular centraliza as consultas sem duplicar transações. Ler não pausa o jogo nem debita dinheiro. A leitura e os avisos locais usam `pilha-company-phone-v1`, separado de `pilha-company-continuous-v2`; preferências de leitura não alteram o save da empresa. Ambos continuam locais ao navegador.

## Dez conquistas iniciais

| Conquista | Critério implementado |
|---|---|
| Saúde do setor · 75 | Média de saúde simulada **de base** dos trabalhadores ativos de um setor ≥75/100 e cobertura completa de postos. Não confundir com o índice ambiental nem contar o robô como pessoa |
| Melhor Lugar Para se Trabalhar · PT22 | Critérios combinados do setor atendidos em duas avaliações de semanas consecutivas |
| Empresa em equilíbrio | Média do índice ambiental dos três setores de trabalho ≥65/100 |
| Equipe com cobertura | Nenhum posto descoberto nos três setores, com equipe ativa ou apoio temporário vigente |
| Pausa com estrutura | Três recursos restaurativos distintos em funcionamento e capacidade para seis pausas |
| Liderança que apoia | Formação de liderança em funcionamento e indicador Liderança ≥60 nos três setores |
| Escuta com proteção | Prevenção ao assédio e psicoeducação em funcionamento; Relações e Segurança Psicológica ≥60 em um setor |
| Gestão sustentável | Três fechamentos operacionais positivos em semanas consecutivas e saldo de reserva ≥1.000 |
| Cuidado contínuo | Saúde média de base da equipe ativa ≥75 e cobertura completa por quatro avaliações semanais |
| Primeira transformação | Uma melhoria adquirida começou efetivamente a produzir efeito |

As dez regras são metas observáveis do estado real do jogo. Não recompensam esconder afastamentos nem excluir uma pessoa adoecida. Troféus registram a primeira semana/primeiro setor elegível e permanecem no histórico. **Não concedem créditos, saúde ou XP automaticamente.** A progressão de XP contínuo continua como escopo próprio do PM/PO.

## PT22: classificação conquistada

O setor precisa atender simultaneamente a:

1. Índice ambiental ≥75.
2. Segurança Psicológica ≥75, Relações ≥70 e Liderança ≥70.
3. Autonomia, Ritmo e carga e Reconhecimento ≥65.
4. Todos os postos com cobertura e ao menos uma pessoa ativa.
5. Média de saúde de base da equipe ativa ≥70.
6. Prevenção ao Assédio, Psicoeducação, Carga e Jornada e Relações e Conflitos em funcionamento, com efeito já iniciado.
7. Todos os critérios presentes em **duas avaliações de semanas consecutivas**.

São avaliações do jogo, não certificação externa. Cada setor tem sua contagem; consultar repetidamente ou reabrir a galeria na mesma semana não avança o progresso. Perder uma condição interrompe a contagem. A implementação não fabrica observações de semanas ausentes; o relógio normal avalia cada semana reconciliada no motor. “Duas avaliações” não deve ser apresentado como prova de manutenção durante cada minuto das semanas.

O troféu histórico não desaparece, mas a **classificação ativa** exige condições atuais e contagem válida. A aba do setor recebe um pequeno marcador PT22 quando ativo; não foram recolocadas estatísticas sobre o mapa 3D. A galeria mostra condições cumpridas/faltantes e distingue histórico de situação atual.

## Retirada da venda e compatibilidade

O ID `seg` permanece no catálogo histórico e na validação/maturação de recibos antigos, marcado como retirado de venda. A loja não o oferece e o motor rejeita novas compras e cotações antigas com `achievement-only`. Não há devolução ou novo débito automático. Recibos, níveis, efeitos, fontes de influência e arte previamente instalada continuam válidos. Um recibo antigo sozinho **não** concede PT22.

Outras práticas que contribuem para segurança psicológica permanecem disponíveis. O indicador `seg` continua sendo calculado no setor; somente o item comercial com o mesmo nome foi retirado. Casos antigos são preservados como arquivo, sem reintroduzir sua interface na empresa contínua. Não foram inventados bônus de proteção contra eventos para o selo: eventos, efeitos dos programas e demais regras econômicas seguem existentes.

O save ganha o campo opcional `achievements` v1, com no máximo dez registros, contagens semanais e setores classificados. Campos são validados antes de salvar; dados inválidos não apagam o progresso. O reconhecimento ocorre em transações reais e no fechamento semanal, não no renderizador. Não há multiplicação de recompensa por quadro, reload, troca de dupla ou abertura de tela.

## Verificação

- Testes do modelo: dez regras, leitura sem mutação, saúde de pessoas separada do índice ambiental, critérios combinados, duas semanas distintas, interrupção de contagem, conservação do histórico, bloqueio de venda, recibos anteriores, corrupção de save e ausência de bônus não aprovados.
- Regressões anteriores atualizadas para distinguir compra corrente de recibo histórico de Segurança Psicológica. Fatores/maturação dos recibos anteriores mantidos; fixtures históricas não habilitam uma API de compra retirada.
- QA Chrome isolado em 1440×900, 1024×768 e 768×1024: consultas, navegação aos relatórios/fichas/contratação, leitura persistente, dez troféus, conquista PT22 em fixture qualificada, retirada do selo ativo ao perder critério, reload e ausência do botão de compra.
- Evidências: `company-phone-trophies-qa` no CI do commit final; QA desktop/tablet é emulação de navegador, não homologação em aparelhos físicos.

## Pendências preservadas

Tutorial prático de primeira compra; revisão humana do equilíbrio e dos limiares do PT22; renovação dos programas temporários após os níveis existentes; recompensas de XP contínuo/quatro poderes; ocupação integral Wi-Fi e materiais persistentes; clipes nativos sincronizados aos próprios rigs; TV BI/aquário e atividades adicionais da sala do gerente. Mensageria compartilhada entre dispositivos/contas não foi solicitada nem implementada. Próximas mudanças devem manter o foco em desktop/tablet e o progresso já existente.
