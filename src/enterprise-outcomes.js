/**
 * Desfechos empresariais e repercussão pública.
 * Gatilhos são transparentes, cumulativos e pedagógicos; não simulam decisões jurídicas reais.
 */
export const ENDINGS = Object.freeze({
  bankruptcy: { id: "bankruptcy", title: "Falência", description: "A empresa perdeu capacidade de honrar compromissos financeiros e encerrou suas atividades.", trigger: "Caixa negativo por dois fechamentos consecutivos." },
  regulatoryClosure: { id: "regulatoryClosure", title: "Interdição e encerramento", description: "A operação foi interrompida após a persistência de condições críticas de segurança e riscos não tratados.", trigger: "Segurança abaixo de 25 e alertas críticos persistentes por dois períodos." },
  laborCollapse: { id: "laborCollapse", title: "Colapso por passivos trabalhistas", description: "A acumulação de conflitos e processos trabalhistas inviabilizou a continuidade da empresa.", trigger: "Três ou mais alertas críticos por três períodos consecutivos." },
  customerLoss: { id: "customerLoss", title: "Perda de clientes estratégicos", description: "Clientes encerraram contratos após sucessivas falhas operacionais e deterioração das condições de trabalho.", trigger: "Indicador organizacional abaixo de 35 e alertas críticos por três períodos." },
  supplierExit: { id: "supplierExit", title: "Ruptura da cadeia de fornecedores", description: "Fornecedores recusaram a continuidade diante de inadimplência e instabilidade recorrentes.", trigger: "Déficit de caixa por três períodos com contratos ativos." }
});

export function ensureEnterpriseOutcomes(state) {
  const next = structuredClone(state);
  next.enterpriseOutcomes ??= { streaks: { deficit: 0, criticalSafety: 0, laborExposure: 0, customerRisk: 0, supplierRisk: 0 }, news: [], ending: null };
  next.enterpriseOutcomes.streaks ??= { deficit: 0, criticalSafety: 0, laborExposure: 0, customerRisk: 0, supplierRisk: 0 };
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
  const s = data.streaks;
  s.deficit = deficit ? s.deficit + 1 : 0;
  s.criticalSafety = safety < 25 && alerts > 0 ? s.criticalSafety + 1 : 0;
  s.laborExposure = alerts >= 3 ? s.laborExposure + 1 : 0;
  s.customerRisk = score < 35 && alerts > 0 ? s.customerRisk + 1 : 0;
  s.supplierRisk = deficit && activeContracts > 0 ? s.supplierRisk + 1 : 0;

  const headlines = [];
  const addNews = (id, title, body, severity = "warning") => {
    if (data.news.some(item => item.id === id && item.period === Number(metrics.period ?? next.period ?? 1))) return;
    const item = { id, title, body, severity, period: Number(metrics.period ?? next.period ?? 1), publication: "The Mentalist Post" };
    data.news.unshift(item);
    headlines.push(item);
  };
  if (score < 50 || alerts >= 2) addNews("workplace-crisis", "Crise interna acende alerta no setor", "Relatos de desgaste, alertas não resolvidos e instabilidade na operação colocam a gestão sob pressão.");
  if (deficit) addNews("cash-crisis", "Fornecedores cobram pagamentos e continuidade", "A situação financeira ameaça contratos e a capacidade de manter a operação.");
  if (s.criticalSafety >= 1) addNews("safety-investigation", "Condições críticas levam operação ao radar das autoridades", "A persistência de riscos de segurança exige resposta imediata e medidas de proteção.");
  if (s.customerRisk >= 2) addNews("customer-confidence", "Clientes reavaliam contratos com a empresa", "A deterioração das condições internas começa a afetar a confiança comercial.");

  let ending = null;
  if (s.deficit >= 2) ending = ENDINGS.bankruptcy;
  else if (s.criticalSafety >= 2) ending = ENDINGS.regulatoryClosure;
  else if (s.laborExposure >= 3) ending = ENDINGS.laborCollapse;
  else if (s.customerRisk >= 3) ending = ENDINGS.customerLoss;
  else if (s.supplierRisk >= 3) ending = ENDINGS.supplierExit;
  if (ending) {
    data.ending = { ...ending, period: Number(metrics.period ?? next.period ?? 1) };
    addNews("company-ending-" + ending.id, "The Mentalist Post: " + ending.title, ending.description, "critical");
  }
  return { state: next, ending: data.ending, news: headlines, gameOver: Boolean(data.ending) };
}
