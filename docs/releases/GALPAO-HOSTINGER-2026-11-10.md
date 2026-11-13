# Galpão logístico e preparação da hospedagem própria

Pedido explícito do PM André em 10/11/2026: integrar o pacote aprovado `Assets_3D/Cenarios/Galpao_Diorama` e migrar o jogo para `aotrabalho.vaideplanob.com.br`, preservando o site principal. Branch `codex/unified-social-agenda`, PR #69, base `0f1c45b`.

## Galpão integrado

- Anexo da Produção com 13×12 metros fictícios, porta de 1,6 m ligada à circulação existente, câmera, picking e acesso **Menu → Galpão logístico**. Continua sendo parte da Produção; nenhum quinto setor, novo custo ou bônus econômico.
- Diorama fornecido pelo PM, eixo Z convertido corretamente e UVs originais preservados. Uma imagem RGBA isométrica derivada do FBX e texturas aprovados é usada no mesmo motor dos móveis atuais. Modelo mestre de 80 MB e cópias intermediárias não fazem parte da publicação. Proveniência e hashes em `assets/logistics/warehouse-provenance.json`.
- O diorama é uma malha única, com piso, paredes e racks incorporados. Fica fixo, fora do editor, e sua planta é um obstáculo. NPCs usam a área externa de carga e seus móveis independentes; não há navegação fictícia atravessando os racks da arte.
- Estante, caixas e bancada existentes formam postos de carga. Um funcionário ativo já existente da Produção é ligado a esses postos pela mesma agenda, com percursos completos e transporte de caixas. Não foi criada nem contratada outra pessoa. Demais papéis, pausas, saúde, economia e reunião semanal continuam intactos.
- Postos externos são editáveis; estrutura e diorama não. Posições salvas continuam reservadas antes de distribuir novas compras.

## Backup para mudança de domínio

**Configurações → Backup e transferência de progresso**, também **Importar progresso** na abertura. Arquivo JSON local, contendo somente as chaves conhecidas do jogo: empresa, progressão legada dos heróis, dupla legada, preferências e leitura do celular. Não inclui tokens nem outros dados do navegador.

A importação exige arquivo válido, mostra semana e saldo antes de confirmar a substituição e entra pausada com referência de relógio atual. Valida estado da empresa, saúde, registros e progressão; arquivo inválido não altera a partida. Falha de gravação tenta restaurar os valores anteriores. O jogador deve baixar o backup atual antes de substituir.

**Limitação entre origens:** o navegador não transfere localStorage entre o Vercel e o subdomínio. A versão antiga já publicada não ganhou estes botões automaticamente. Seu save continua naquela origem; para trazê-lo será necessário exportá-lo ali por um fluxo suportado antes de importar. Não é correto afirmar que somente abrir o novo endereço migra a partida. Não foi lido nem copiado um save real do usuário.

## Hostinger

- SSH existente validado. Código preparado para hospedagem estática; não necessita Node em produção, banco ou backend novo.
- `vercel.json` passa a desativar deploys automáticos por Git. Não foi solicitado outro deploy ao Vercel.
- `tools/stage-hostinger.py` envia `dist` por streaming, sem ZIP extra no disco C:, para uma release imutável fora de `public_html`: `domains/vaideplanob.com.br/aotrabalho-releases/<sha>`. Só aceita SHA completo. Não sobrescreve release existente, altera DNS, ativa symlinks ou toca a página principal. Confere hashes e tamanhos antes de gravar `release-ready.json`.
- Pacote exclui configurações Vercel, pacote Node, documentos e arquivos ocultos do repositório. `.htaccess` próprio especifica index, tipos de arquivo e revalidação de HTML/JS/CSS/JSON. Sem cache imutável para arquivos que mantêm o nome nas próximas versões.
- A criação do subdomínio, associação do diretório e SSL depende do hPanel/API de hospedagem; SSH não fornece essas funções. Na conferência local o DNS do subdomínio ainda não existia. O site principal responde normalmente em HTTPS.
- Conexão do navegador autorizado ao hPanel não pôde iniciar por erro de infraestrutura do runtime. Não foram extraídos cookies, sessões, senhas nem credenciais do navegador.
- **Pendente do PM:** criar o subdomínio/website `aotrabalho.vaideplanob.com.br` com diretório próprio e informar o caminho do documento raiz mostrado no hPanel, ou disponibilizar localmente acesso de API adequado. Nunca enviar chave pelo chat. Só então copiar/ativar a release no diretório confirmado e testar DNS, SSL, MIME, vídeo, abertura, contratação, partida e reload via HTTPS público.

## Evidências e aceite

- `npm test`: passou com catálogo, corpo/colisões, layouts e saves antigos, incluindo os novos testes de galpão e transferência.
- Testes específicos de conquistas/PT22: sete cenários; transferência e galpão: quatro cenários.
- Chrome isolado: celular em 1440×900, 1024×768 e 768×1024; galpão/backup em 1440×900 e 1024×768. Funcionário NPC-09 observado carregando caixa no anexo em ambas as resoluções, sem novo NPC. Dez troféus, PT22 real e perda de classificação ativa, leitura sem alterar finanças, calendário rodando com celular aberto.
- Capturas e relatórios: artefatos CI `company-phone-trophies-qa` e `logistics-transfer-qa`. Homologação em tablet físico, sessão longa e publicação pública no novo domínio permanecem pendentes.

## Próximas melhorias

Tutorial prático da primeira contratação/compra, comunicação antes/depois dos efeitos temporais, articular XP contínuo e poderes restantes, mais clipes nativos nos postos, Wi-Fi com 16 lugares e materiais persistentes. O interior do galpão só poderá ficar navegável com arte separada em piso/paredes/racks e colisões compatíveis, sem adulterar este asset aprovado. A nova área não substitui essas pendências.

## Ajuste de regressão do cabeçalho

O primeiro CI desta etapa encontrou uma linha extra no cabeçalho de 320 px após adicionar o celular. Corrigido com botão de ícone compacto somente até 420 px, mantendo nome acessível e todos os controles. Medição real: 147,39 px em 320/390, 115,06 px em 844 e 105,39 px em 1366/1440. O mapa permanece abaixo da barra completa; o celular continua acessível pelo teclado e nome. A release isolada inicial `3129ace` não deve ser ativada; usar a sucessora com este ajuste e CI aprovado.

A verificação Linux demonstrou que somente reduzir o ícone ainda podia gerar outra linha conforme a fonte. A disposição final até 420 px usa duas colunas explícitas (relógio e comandos), com indicadores ocupando a primeira linha completa. O teste mantém o limite original de altura e registra as medidas no log; o limite não foi relaxado.
