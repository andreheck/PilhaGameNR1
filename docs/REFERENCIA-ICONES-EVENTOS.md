# Referência de ícones dos eventos adversos

Este documento orienta Codex e outros agentes na próxima atualização do PilhA+ Game. Os eventos já parametrizados devem receber ícones visuais sem duplicar nem alterar suas regras de simulação.

## Fonte funcional

- Catálogo e IDs dos eventos: [CATALOGO-EVENTOS-ADVERSOS.md](CATALOGO-EVENTOS-ADVERSOS.md)
- Motor/backlog de eventos: [Issue #29](https://github.com/andreheck/PilhaGameNR1/issues/29)
- Economia e impactos financeiros: [ECONOMIA-PRODUTIVIDADE-FINANCAS.md](ECONOMIA-PRODUTIVIDADE-FINANCAS.md) e [Issue #30](https://github.com/andreheck/PilhaGameNR1/issues/30)

## Mapeamento estável de arquivos

Usar estes nomes, vinculados aos IDs existentes no catálogo. Não criar novos IDs nem uma segunda parametrização.

| ID | Evento | Arquivo sugerido |
|---|---|---|
| 01 | Falha de equipamento | `01_falha_equipamento.png` |
| 02 | Falha de sistema/software | `02_falha_sistema.png` |
| 03 | Gargalo operacional | `03_gargalo_operacional.png` |
| 04 | Resistência à mudança | `04_resistencia_mudanca.png` |
| 05 | Conflito interpessoal | `05_conflito_interpersonal.png` |
| 06 | Fadiga acumulada | `06_fadiga_acumulada.png` |
| 07 | Corte orçamentário | `07_corte_orcamentario.png` |
| 08 | Aumento súbito da demanda | `08_aumento_demanda.png` |
| 09 | Investimento com baixo retorno | `09_baixo_retorno.png` |
| 10 | Novo risco após mudança de layout | `10_novo_risco_layout.png` |
| 11 | Quase acidente | `11_quase_acidente.png` |
| 12 | Condição ambiental adversa | `12_condicao_ambiental.png` |
| 13 | Atraso de fornecedor | `13_atraso_fornecedor.png` |
| 14 | Saída/indisponibilidade de profissional-chave | `14_saida_profissional.png` |
| 15 | Escassez de candidatos qualificados | `15_falta_candidatos.png` |
| 16 | Inflação | `16_inflacao.png` |
| 17 | Juros elevados | `17_juros_altos.png` |
| 18 | Alto custo de vida | `18_custo_vida.png` |
| 19 | Epidemia local | `19_epidemia_local.png` |

## Instruções obrigatórias para a próxima implementação

1. Colocar os PNGs individuais em `assets/events/` (ou reaproveitar a pasta de assets já existente se o projeto tiver convenção estabelecida) e preservar os nomes acima.
2. Usar os ícones nos alertas/toasts, histórico e painel de detalhes dos eventos, de acordo com os componentes existentes; evitar duplicar a arte em cada componente.
3. Resolver o ícone a partir do ID/chave estável do evento, usando um mapa centralizado de ID → caminho de asset. Se não houver imagem, exibir fallback visual sem quebrar a interface.
4. Não alterar a probabilidade, os gatilhos, a duração, os efeitos, os parâmetros financeiros ou as regras de recorrência dos eventos apenas para adicionar os ícones.
5. A epidemia deve continuar ligada à regra já especificada de 25% na primeira ocorrência, 40% na segunda e 60% na terceira e seguintes; não confundir esse parâmetro de jogo com previsão epidemiológica real.
6. Garantir acessibilidade: `alt`/nome acessível em controles e texto, contraste adequado e ícone nunca como única forma de comunicar o evento.
7. Manter responsividade, testar em desktop/mobile e executar `npm test`. Adicionar testes para o mapeamento de todos os 19 IDs e para fallback de asset ausente.
8. Não reescrever ou substituir a parametrização existente. Antes de codificar, localizar o catálogo e o motor de eventos atuais e integrar-se a eles.

## Estado dos arquivos visuais

A arte gerada para esta etapa foi separada em 19 PNGs e disponibilizada ao usuário em um pacote ZIP nesta conversa. Para a implementação automática pelo Codex em outra sessão, os binários precisam estar efetivamente commitados no repositório; os nomes e as regras de integração estão registrados aqui. Não presumir que um arquivo local/sandbox desta conversa está acessível ao Codex.

## Critérios de aceite

- Os 19 eventos existentes apresentam o ícone correspondente.
- Os IDs e parâmetros atuais permanecem inalterados.
- Um evento sem asset não causa erro de renderização.
- Alertas e detalhes continuam legíveis e acessíveis em telas pequenas.
- Testes automatizados cobrem o mapeamento e o fallback.
