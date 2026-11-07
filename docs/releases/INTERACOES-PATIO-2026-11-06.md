# Revisão das interações e do pátio

Inventário da pasta Assets_3D indicada pelo PM em docs/qa/ASSETS-LOCAIS-2026-11-06.json. Há transições de sentar em Diretor, Gestora, administrativo, operador logístico e psiquiatra; psicólogas têm Sitting_Answering_Questions. Não foram identificados clipes nomeados de carregar caixas; clipes genéricos precisam de inspeção visual. Nomes não comprovam compatibilidade.

Ajustes: digitação e manuseio usam o tempo ativo mesmo com o NPC parado; pegar/colocar têm progressão de altura distinta; profissional parado olha para o móvel. Pausa congela gestos. Caixas/pastas continuam props visuais, sem inventário físico persistente.

Pátio: dois bancos e jardineira na mesma escala métrica, sujeitos ao packing e corredores livres. Sem novos benefícios ou capacidades. Reuniões continuam em pé; ocupação dos bancos e novos clipes riggados não foram entregues.

Próximos passos: retarget/validação das transições de sentar; inspeção de poses dos clipes genéricos para transporte; estação de recarga; escala dos modelos de Props_Moveis. Especialistas não serão vinculados arbitrariamente às fichas dos funcionários.

Validação em 07/11: build, escala/packing 3/3, tarefas 4/4 e empresa viva 37/37 passaram. QA isolado do Chrome em desktop/celular passou sem exceções; captura desktop do pátio examinada. No celular, o painel reduz a área visível e o enquadramento do pátio ainda precisa de refinamento. Robô excluído dos balões ambientais de adoecimento/recuperação após conferir a captura: sua bateria não representa saúde humana.

Diagnóstico da câmera: a transição usava o dt limitado a 50 ms da simulação, alongando a animação em navegadores lentos. Agora usa tempo real de quadro, mantendo o limite da simulação. Regressão compara foco animado após um quadro lento com o foco direto no mesmo setor.

Após a correção, a nova captura móvel confirmou o pátio inteiro acima do painel, sem a cobertura observada no ensaio anterior. Empresa viva: 38/38 com o teste de câmera. Leitura da bateria no menu/API usa o mesmo relógio simulado corrente, incluindo o intervalo entre gravações.
