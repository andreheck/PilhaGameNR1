/**
 * Motor de simulação psicossocial do PilhA+ Game.
 * Dados e efeitos são sintéticos, exclusivamente pedagógicos.
 * Não é instrumento clínico, epidemiológico nem de conformidade NR-1.
 */

export const DOMAINS = Object.freeze([
  { id: "physicalHealth", label: "Saúde física percebida" },
  { id: "emotionalWellbeing", label: "Bem-estar emocional" },
  { id: "socialSupport", label: "Conexão e apoio social" },
  { id: "jobSatisfaction", label: "Satisfação no trabalho" },
  { id: "safetyConditions", label: "Condições de segurança e ambiente" },
  { id: "recovery", label: "Recuperação e descanso" }
]);

export const INTERVENTIONS = Object.freeze([
  {
    id: "ergonomic-workstation", name: "Adequar posto de trabalho", category: "Ergonomia",
    cost: 1200, scope: "all", effects: { physicalHealth: 8, safetyConditions: 5 },
    organizationalMeasure: true, explanation: "Adequa o posto aos requisitos da tarefa."
  },
  {
    id: "environmental-quality", name: "Melhorar iluminação e conforto ambiental", category: "Ambiente",
    cost: 1600, scope: "all", effects: { physicalHealth: 4, safetyConditions: 10 },
    organizationalMeasure: true, explanation: "Corrige condições físicas inadequadas identificadas."
  },
  {
    id: "workflow-software", name: "Simplificar software e retrabalho", category: "Processos",
    cost: 1800, scope: "all", effects: { emotionalWellbeing: 5, jobSatisfaction: 8, recovery: 3 },
    organizationalMeasure: true, explanation: "Reduz fricções operacionais quando o processo digital é um fator contribuinte."
  },
  {
    id: "appropriate-ppe", name: "Disponibilizar EPI adequado e capacitação", category: "Segurança",
    cost: 1400, scope: "all", effects: { physicalHealth: 4, safetyConditions: 12 },
    organizationalMeasure: true, explanation: "Reforça a proteção adequada; não substitui controles coletivos ou eliminação do perigo."
  },
  {
    id: "review-workload", name: "Revisar metas, jornada e carga de trabalho", category: "Organização do trabalho",
    cost: 900, scope: "all", effects: { emotionalWellbeing: 8, jobSatisfaction: 10, recovery: 12 },
    organizationalMeasure: true, explanation: "Atua sobre fatores organizacionais associados à sobrecarga."
  },
  {
    id: "staffing-redistribution", name: "Redimensionar equipe e redistribuir tarefas", category: "Organização do trabalho",
    cost: 2200, scope: "all", effects: { socialSupport: 6, jobSatisfaction: 8, recovery: 10 },
    organizationalMeasure: true, explanation: "Ajusta capacidade e distribuição de trabalho; exige acompanhamento."
  },
  {
    id: "leadership-clarity", name: "Desenvolver liderança e clareza de papéis", category: "Gestão",
    cost: 1100, scope: "all", effects: { emotionalWellbeing: 5, socialSupport: 10, jobSatisfaction: 7 },
    organizationalMeasure: true, explanation: "Fortalece apoio, comunicação, previsibilidade e clareza."
  },
  {
    id: "participatory-listening", name: "Realizar escuta participativa com devolutiva", category: "Participação",
    cost: 500, scope: "all", effects: { socialSupport: 8, jobSatisfaction: 4 },
    organizationalMeasure: true, explanation: "Inclui trabalhadores na investigação e na revisão das medidas."
  },
  {
    id: "wellbeing-workshop", name: "Oficina complementar de bem-estar", category: "Ação complementar",
    cost: 450, scope: "all", effects: { emotionalWellbeing: 2 },
    organizationalMeasure: false, explanation: "Pode complementar outras ações; não corrige por si só riscos organizacionais."
  }
]);

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, Number(value) || 0));
const clone = value => JSON.parse(JSON.stringify(value));

export function getEmployeeScore(employee, weights = {}) {
  const entries = DOMAINS
    .filter(domain => Number.isFinite(employee?.scores?.[domain.id]))
    .map(domain => ({
      value: clamp(employee.scores[domain.id]),
      weight: Math.max(0, Number(weights[domain.id] ?? 1) || 0)
    }))
    .filter(entry => entry.weight > 0);
  if (!entries.length) return 0;
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  return Math.round(entries.reduce((sum, entry) => sum + entry.value * entry.weight, 0) / totalWeight);
}

export function getMood(score) {
  const value = clamp(score);
  if (value < 40) return { id: "critical", label: "Atenção prioritária", emoji: "😡" };
  if (value < 60) return { id: "attention", label: "Atenção", emoji: "😟" };
  if (value < 75) return { id: "unstable", label: "Instável", emoji: "😐" };
  if (value < 90) return { id: "favorable", label: "Favorável", emoji: "🙂" };
  return { id: "very-favorable", label: "Muito favorável", emoji: "😄" };
}

export function getEmployeeSnapshot(employee, weights = {}) {
  const score = getEmployeeScore(employee, weights);
  return {
    id: employee.id,
    role: employee.role ?? "Função não informada",
    score,
    mood: getMood(score),
    scores: Object.fromEntries(DOMAINS.map(domain => [
      domain.id, clamp(employee?.scores?.[domain.id] ?? 0)
    ])),
    criticalAlerts: [...(employee.criticalAlerts ?? [])]
  };
}

export function getOrganizationSnapshot(state, weights = {}) {
  const employees = (state.employees ?? []).map(employee => getEmployeeSnapshot(employee, weights));
  const score = employees.length
    ? Math.round(employees.reduce((sum, employee) => sum + employee.score, 0) / employees.length)
    : 0;
  return {
    score,
    mood: getMood(score),
    employeeCount: employees.length,
    criticalAlerts: employees.reduce((sum, employee) => sum + employee.criticalAlerts.length, 0),
    employees
  };
}

export function applyIntervention(state, interventionId, options = {}) {
  const intervention = INTERVENTIONS.find(item => item.id === interventionId);
  if (!intervention) return { ok: false, reason: "Intervenção não encontrada.", state };
  if ((state.budget ?? 0) < intervention.cost) {
    return { ok: false, reason: "Orçamento insuficiente.", state };
  }
  const targetId = options.employeeId;
  if (targetId && !state.employees.some(employee => employee.id === targetId)) {
    return { ok: false, reason: "Funcionário não encontrado.", state };
  }

  const next = clone(state);
  next.budget -= intervention.cost;
  next.environment ??= {};
  next.environment.upgrades ??= [];
  if (!next.environment.upgrades.includes(intervention.id)) {
    next.environment.upgrades.push(intervention.id);
  }

  let changedEmployees = 0;
  next.employees = next.employees.map(employee => {
    if (targetId && employee.id !== targetId) return employee;
    changedEmployees += 1;
    const scores = { ...(employee.scores ?? {}) };
    for (const [domain, effect] of Object.entries(intervention.effects)) {
      scores[domain] = clamp((scores[domain] ?? 0) + effect);
    }
    return { ...employee, scores };
  });

  next.history ??= [];
  const event = {
    interventionId: intervention.id,
    name: intervention.name,
    cost: intervention.cost,
    organizationalMeasure: intervention.organizationalMeasure,
    employeeId: targetId ?? null,
    changedEmployees,
    explanation: intervention.explanation
  };
  next.history.push(event);

  const remainingOrganizationalAlerts = next.employees.some(employee =>
    (employee.criticalAlerts ?? []).length > 0
  );
  const note = !intervention.organizationalMeasure
    ? "Ação complementar: não substitui a investigação e o tratamento dos fatores organizacionais pertinentes."
    : "Acompanhe os resultados com trabalhadores e revise as medidas quando necessário.";

  return {
    ok: true,
    state: next,
    event,
    note,
    remainingCriticalAlerts: remainingOrganizationalAlerts
  };
}
