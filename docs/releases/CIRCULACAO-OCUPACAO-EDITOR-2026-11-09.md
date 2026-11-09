# Circulação, ocupação e organização dos móveis —09/11/2026

## Pedido e base

André autorizou avaliar o andar dentro das salas, sentar/outras atividades, ocupação, dimensionamento/folgas, retirar a grade e habilitar arrastar/soltar e orientação onde possível. Base `5041317fff08ed597d41c338f7708a4c240d7fa4`, branch `codex/unified-social-agenda`, PR #69. Mesmo preview de testes; sem merge/main.

## Achados e correções

1. O packing anterior admitia16 cm entre objetos e não reservava a aproximação às cadeiras. Agora usa42 cm entre móveis, reserva66 cm atrás de cada mesa e protege as margens dos corredores. Work targets ficam38 cm atrás das mesas; navegação considera22 cm de raio corporal. São parâmetros fictícios do jogo, não dimensionamento arquitetônico nem conformidade normativa.
2. Na Produção, variantes diferentes do template repetiam a mesma arte de máquina/estante/conjunto de caixas no mesmo nicho. Baseline21→13 peças, sem remover recibos nem mobiliário comprado. Mesas de trabalho têm prioridade no packing, com busca mais precisa. Testados inventário inicial e todos os itens no nível máximo: nenhum móvel ocultado por falta de espaço, nem mesa perdida.
3. O plano reservava metade da janela para tarefas e outra metade para encontro/retorno; muitas viagens não cabiam e o ator só circulava. Agora, se o circuito social completo não cabe, executa uma ida/trabalho/volta completa ao posto quando há tempo, sem acelerar. Mantidos encontros nas janelas compatíveis, pausas, reuniões, ritmos pessoais, saúde abaixo55 e semana de15 minutos.
4. Acrescentados sentar700 ms → computador → levantar650 ms; joelhos/pés e altura de assento interpolados. Manipulação de materiais dura1,4 s por operação. Braços/mãos ao teclado são desenhados depois do móvel para não sumirem sob a mesa. Orientação é atualizada após a chegada; passada acompanha distância percorrida, inclusive nos sprites riggados, em vez de deslizar com um ciclo desconectado da velocidade. Duplas de conversa e visitantes do pátio têm maior separação. Pausas em pé não fingem assento no piso vazio; meditação conserva a pose no tapete.
5. A ficha com atores presentes descreve computador, sentar, levantar e transporte conforme a pose visual atual. Ler a ficha não altera saúde. Identidades, cargos e retratos canônicos preservados.
6. Piso contínuo em todos os ambientes e extensão restaurativa, sem xadrez, linhas de debug ou seis quadrados coloridos. Seleção/hover, objetos, alertas individuais e rótulos discretos das áreas permanecem.

## Editor funcional

**Menu → Organizar móveis** pausa a empresa. Selecione pelo menu acessível ou toque/arraste o objeto no mapa. Prévia mostra contorno verde/vermelho; queda inválida é descartada. Ajuste também pelos botões/setas de25 cm; R/botão gira os compatíveis. Pan/zoom continuam disponíveis fora do arraste. Suporta cancelar gesto e cancelar toda a organização.

Movimento permanece no mesmo ambiente: benefícios/compras continuam vinculados ao setor original. Não se permite colocar fora da sala, sobre pessoas/móveis, nas passagens principais ou bloqueando o acesso às cadeiras. Erros explicam o impedimento. Banco/carpete/instalações maiores permanecem sujeitos às mesmas passagens e limites; isso não implementa ocupação dos16 assentos Wi-Fi.

Os três GLBs de cadeiras individuais foram renderizados localmente em quatro vistas, com os clipes e cores originais. Giro real de90° também transforma footprint e SIT/forward. Originais, hashes e atlas anteriores preservados; `assets/individual-chairs/views.json` registra a derivação. Nenhuma geração paga. Demais artes de vista única podem ser movidas, com giro desabilitado e explicação; não se simula rotação3D inclinando PNG.

Salvar usa a transação do jogo com revisão de entrada; campo opcional `furnitureLayout` v1, por setor e ID estável, guarda apenas x/y/turn. Não concede bônus, compra ou XP, nem modifica recibos. Saves anteriores continuam válidos sem migração de dinheiro/calendário/saúde. Cancelar restaura posições e o estado de pausa anterior. Recarregar ou voltar à abertura no meio do rascunho o descarta, mantendo a empresa pausada para não gerar tempo inesperado; Retomar jogo continua disponível.

Atualização por outra aba encerra o rascunho e aplica a versão compartilhada, sem sobrescrevê-la. Falha de gravação preserva o save. Nova compra que conflite com o layout restaura automaticamente a organização segura daquele ambiente, informa o jogador e permite revisar/salvar novas posições. A empresa fica pausada na edição; alvos/posições visuais são recalculados ao aplicar, sem mudar a agenda financeira.

## Verificação e evidências

- npm test e testes direcionados: schema/legado/persistência atômica, colisões/corredores, acesso atrás de todas as mesas, rotas com folga corporal, inventário máximo sem ocultação, projeção inversa/limites finitos, quatro vistas reais, ciclo completo sem corrida e texto da atividade real.
- `qa-furniture-editor.py`, desktop1366×768 e celular emulado390×844: arraste real, posição após reload, giro/reload, rejeição, cancelamento, cinco atividades reais, quadro salvo/saúde/saldo/semana preservados e atualização de outra aba. Capturas inspecionadas em `artifacts/furniture-editor/`; CI arquiva `furniture-editor-qa`.
- Casos antigos e regressão completa de equipe viva continuam nos workflows. SHA final, resultados e deployment anexados na PR.

## Limitações honestas

Sentar/levantar e gestos desta etapa são **procedurais**, não novos clipes FBX/Mixamo de personagem. Os rigs fornecidos têm caminhada/conversa/reação; não foram inventadas animações aprovadas. Os dois rigs usam a pose procedural no assento. Encaixe riggado definitivo, ocupação dos16 lugares Wi-Fi, inventário físico persistente de materiais e rotação de todas as artes continuam pendentes.

QA móvel é emulação no Chrome; aparelhos físicos, leitor de tela e testes prolongados com muitas reconfigurações precisam de homologação. Continuam pendentes quatro poderes, XP contínuo, controle integral dos heróis e adaptação #74/TV BI. Sem merge; publicação somente no preview autorizado.
