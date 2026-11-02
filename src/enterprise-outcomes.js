/**
 * Desfechos empresariais e repercussão pública.
 * Gatilhos são transparentes, cumulativos e pedagógicos; não simulam decisões jurídicas reais.
 * Vozes e declarações são ficcionais e dramatizadas para o jogo.
 */
export const ENDINGS = Object.freeze({
  bankruptcy: { id: "bankruptcy", title: "Falência", description: "A empresa perdeu capacidade de honrar compromissos financeiros e encerrou suas atividades.", trigger: "Caixa negativo por dois fechamentos consecutivos." },
  regulatoryClosure: { id: "regulatoryClosure", title: "Interdição e encerramento", description: "A operação foi interrompida após a persistência de condições críticas de segurança e riscos não tratados.", trigger: "Segurança abaixo de 25 e alertas críticos persistentes por dois períodos." },
  laborCollapse: { id: "laborCollapse", title: "Colapso por passivos trabalhistas", description: "A acumulação de conflitos e passivos trabalhistas inviabilizou a continuidade da empresa.", trigger: "Três ou mais alertas críticos por três períodos consecutivos." },
  customerLoss: { id: "customerLoss", title: "Perda de clientes estratégicos", description: "Clientes encerraram contratos após sucessivas falhas operacionais e deterioração das condições de trabalho.", trigger: "Indicador organizacional abaixo de 35 e alertas críticos por três períodos." },
  supplierExit: { id: "supplierExit", title: "Ruptura da cadeia de fornecedores", description: "Fornecedores recusaram a continuidade diante de inadimplência e instabilidade recorrentes.", trigger: "Déficit de caixa por três períodos com contratos ativos." }
});

const INITIAL_STREAKS = () => ({ deficit: 0, criticalSafety: 0, laborExposure: 0, customerRisk: 0, supplierRisk: 0 });
export function ensureEnterpriseOutcomes(state) {
  const next = structuredClone(state);
  next.enterpriseOutcomes ??= { streaks: INITIAL_STREAKS(), news: [], ending: null };
  next.enterpriseOutcomes.streaks ??= INITIAL_STREAKS();
  next.enterpriseOutcomes.news ??= [];
  return next;
}

export function evaluateEnterpriseOutcomes(state, metrics = {}) {
  const next = ensureEnterpriseOutcomes(state);
  const data = next.enterpriseOutcomes;
  if (data.ending) return { state: next, ending: data.ending, news: [], gameOver: true };
  const score = Number(metrics.score ?? 100);
  const alerts = Number(metrics.criticalAlerts ?? 0);
  const safety = Number(metrics.minimumSafety ?? 100);
  const deficit = Number(metrics.budget ?? next.budget ?? 0) < 0;
  const activeContracts = Number(metrics.activeContracts ?? (next.contracts ?? []).filter(item => item.active).length);
  const period = Number(metrics.period ?? next.period ?? 1);
  const s = data.streaks;
  s.deficit = deficit ? s.deficit + 1 : 0;
  s.criticalSafety = safety < 25 && alerts > 0 ? s.criticalSafety + 1 : 0;
  s.laborExposure = alerts >= 3 ? s.laborExposure + 1 : 0;
  s.customerRisk = score < 35 && alerts > 0 ? s.customerRisk + 1 : 0;
  s.supplierRisk = deficit && activeContracts > 0 ? s.supplierRisk + 1 : 0;

  const headlines = [];
  const addNews = (id, title, body, severity = "warning", voice = null) => {
    if (data.news.some(item => item.id === id && item.period === period)) return;
    const item = { id, title, body, severity, voice, period, publication: "The Mentalist Post" };
    data.news.unshift(item);
    headlines.push(item);
  };
  if (score < 50 || alerts >= 2) addNews("workplace-crisis", "Crise interna acende alerta no setor", "Relatos de desgaste, alertas não resolvidos e instabilidade na operação colocam a gestão sob pressão.", "warning", { role: "Trabalhadora da operação", quote: "A gente não precisa de discurso bonito. Precisa conseguir trabalhar sem adoecer." });
  if (deficit) addNews("cash-crisis", "Fornecedores cobram pagamentos e continuidade", "A situação financeira ameaça contratos e a capacidade de manter a operação.", "warning", { role: "Representante de fornecedor", quote: "Sem previsibilidade e pagamento, não conseguimos garantir a continuidade da equipe." });
  if (s.criticalSafety >= 1) addNews("safety-investigation", "Condições críticas levam operação ao radar das autoridades", "A persistência de riscos de segurança exige resposta imediata e medidas de proteção.", "warning", { role: "Representante dos trabalhadores", quote: "O risco já foi comunicado. Agora precisamos ver a correção acontecer." });
  if (s.laborExposure >= 1) addNews("worker-mobilization", "Trabalhadores organizam mobilização por mudanças", "A ausência de respostas consistentes amplia a mobilização coletiva. A manifestação é tratada como exercício legítimo de participação, não como causa da crise.", "warning", { role: "Representação dos trabalhadores", quote: "Estamos cobrando condições dignas e resposta aos problemas que já foram comunicados." });
  if (s.laborExposure >= 2) addNews("union-statement", "Entidade representativa cobra plano de correção", "A representação coletiva solicita prazos, responsáveis e transparência sobre as medidas adotadas.", "warning", { role: "Entidade sindical fictícia", quote: "Não basta anunciar compromisso: queremos acompanhar a execução e os resultados." });
  if (s.customerRisk >= 1) addNews("client-corrective-plan", "Cliente estratégico exige plano de ação", "O cliente solicita diagnóstico, medidas corretivas e evidências de acompanhamento antes de manter a parceria.", "warning", { role: "Cliente estratégico", quote: "Precisamos de um plano verificável, com prazos e responsabilidade da direção." });
  if (s.customerRisk >= 2) addNews("customer-confidence", "Clientes reavaliam contratos com a empresa", "A deterioração das condições internas começa a afetar a confiança comercial.", "warning", { role: "Cliente estratégico", quote: "Nossa parceria depende de qualidade, continuidade e responsabilidade na cadeia." });
  if (s.supplierRisk >= 2) addNews("supplier-pause", "Fornecedor suspende novas alocações", "Diante da inadimplência recorrente, um fornecedor fictício suspende novas alocações até que exista previsibilidade contratual.", "warning", { role: "Representante de fornecedor", quote: "Não vamos ampliar a exposição da nossa equipe sem uma solução para os compromissos em aberto." });

  // Prioridade: risco grave à vida e à segurança; depois colapso trabalhista,
  // ruptura da cadeia, perda de clientes e, por fim, insolvência financeira.
  let ending = null;
  if (s.criticalSafety >= 2) ending = ENDINGS.regulatoryClosure;
  else if (s.laborExposure >= 3) ending = ENDINGS.laborCollapse;
  else if (s.supplierRisk >= 3) ending = ENDINGS.supplierExit;
  else if (s.customerRisk >= 3) ending = ENDINGS.customerLoss;
  else if (s.deficit >= 2) ending = ENDINGS.bankruptcy;
  if (ending) {
    data.ending = { ...ending, period };
    addNews("company-ending-" + ending.id, "The Mentalist Post: " + ending.title, ending.description, "critical", { role: "Nota da redação", quote: `O encerramento não aconteceu de um dia para o outro. Os sinais estavam presentes nos períodos anteriores: ${ending.trigger}` });
  }
  return { state: next, ending: data.ending, news: headlines, gameOver: Boolean(data.ending) };
}
