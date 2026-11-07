# Advogado Trabalhista — especificação do atlas de animação

**Status:** referência visual produzida; spritesheet de produção ainda não validado.  
**Issue:** #73  
**Branch:** `feat/advogado-trabalhista-sprite-spec`

## Identidade visual aprovada

- Homem negro, cabelo trançado preso em coque, óculos.
- Terno azul-marinho, camisa branca sem gravata.
- Aparência profissional, contemporânea, acessível e confiante.
- Linguagem visual isométrica 2D, coerente com a direção de arte de *Ao Trabalho*.

## Referência visual

Foi gerada uma prancha conceitual em 1536 × 1024 px, com retrato e estudos de poses. Ela serve para orientar a produção, não deve ser importada diretamente como spritesheet: contém títulos, painéis, fundos e células com dimensões e enquadramentos não uniformes. A presença de canal alpha no arquivo não comprova transparência limpa em todos os pixels do fundo.

## Plano de produção do spritesheet

### Fase 1 — locomoção (prioridade de integração)

| Animação | Direções | Frames por direção | Total |
|---|---:|---:|---:|
| Idle | 8 | 1–2 | 8–16 |
| Walk | 8 | 6 | 48 |
| Run | 8 | 6 | 48 |

Convenção de orientação: N, NE, E, SE, S, SW, W, NW. A orientação deve ser mapeada para o sistema de coordenadas efetivamente usado pelo jogo; não presumir que norte/sul do atlas coincide com o eixo do mapa antes do teste no runtime.

### Fase 2 — ações contextuais

- Conversar / mediar conflito.
- Apontar / apresentar orientação.
- Consultar documentos.
- Trabalhar ao computador.
- Sentar e levantar.
- Agachar / pegar objeto.
- Carregar documentos ou caixa.
- Comemorar e pensar.

As ações contextuais podem começar com 4 direções (frente, costas e laterais) se isso for suficiente para o enquadramento da cena. Oito direções ficam reservadas às animações de locomoção.

## Regras técnicas para os frames finais

1. Exportar cada frame em PNG RGBA com transparência real, sem sombra de fundo, legenda, moldura ou cenário.
2. Usar células de tamanho uniforme e canvas comum para todos os frames; sugestão inicial: 128 × 128 px por célula, a confirmar pela escala dos personagens existentes.
3. Manter proporção, rosto, tom de pele, tranças, óculos, terno e camisa consistentes em todos os frames.
4. Fixar o ponto de apoio dos pés no mesmo ponto da célula (pivot/base anchor), evitando saltos durante a animação.
5. Não cortar coque, sapatos, mãos ou objetos carregados.
6. Manter a silhueta legível em escala reduzida e compatível com a escala dos NPCs atuais.
7. Nomear arquivos e sequências de forma explícita, por exemplo: `advogado-walk-s.png`, `advogado-walk-se.png`, etc., ou seguir a convenção já adotada pelo runtime após auditoria.
8. Não espelhar automaticamente sprites com assimetrias visuais relevantes (coque, lapela, documentos ou acessórios) sem validar o resultado.

## Critérios de aceite

- [ ] Prancha conceitual aprovada como referência do personagem.
- [ ] Frames de idle, walk e run extraídos e individualizados.
- [ ] Transparência verificada sobre fundos claro e escuro.
- [ ] Dimensões, pivot e escala padronizados com os atores existentes.
- [ ] Ciclos de caminhada e corrida sem deslocamento involuntário dos pés.
- [ ] Oito direções mapeadas corretamente no sistema isométrico.
- [ ] Teste visual no runtime com movimento em todas as direções.
- [ ] Ações contextuais produzidas em etapa posterior.

## Limites desta etapa

Esta especificação não adiciona o herói ao roster, não altera seleção de personagens, atributos, habilidades, raridade, economia ou regras de missão. Não declara a arte integrada. Antes da integração, deve-se auditar a convenção de escala, pivô, carregamento e animação usada pelos atores atuais em `assets/actors` e pelo runtime.
