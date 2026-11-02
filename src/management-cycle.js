/**
 * Ciclo de gestão pluriperíodo.
 * Capacidade gerencial limitada e eventos condicionais tornam visíveis
 * consequências acumuladas sem usar punições aleatórias.
 */
export const ACTION_CAPACITY_PER_PERIOD = 2;

export function ensureManagementCycle(state) {
  const next = structuredClone(state);
  next.managementCycle ??= {
    period: Number(next.period ?? 1),
    capacityPerPeriod: ACTION_CAPACITY_PER_PERIOD,
    actionsUsed: 0,
    eventHistory: [],
    pendingReviews: []
  };
  next.managementCycle.period = Math.max(Number(next.managementCycle.period ?? 1), Number(next.period ?? 1));
  next.managementCycle.capacityPerPeriod ??= ACTION_CAPACITY_PER_PERIOD;
  next.managementCycle.actionsUsed ??= 0;
  next.managementCycle.eventHistory ??= [];
  next.managementCycle.pendingReviews ??= [];
  return next;
}

export function getManagementCapacity(state) {
  const cycle = ensureManagementCycle(state).managementCycle;
  return {
    period: cycle.period,
    capacity: cycle.capacityPerPeriod,
    used: cycle.actionsUsed,
    remaining: Math.max(0, cycle.capacityPerPeriod - cycle.actionsUsed)
  };
}

export function consumeManagementAction(state, action = {}) {
  const next = ensureManagementCycle(state);
  const capacity = getManagementCapacity(next);
  if (capacity.remaining < 1) {
    return { ok: false, state, reason: "Capacidade gerencial esgotada neste período. Priorize, acompanhe e reavalie no próximo ciclo." };
  }
  next.managementCycle.actionsUsed += 1;
  next.managementCycle.pendingReviews.push({
    id: action.id ?? `review-${capacity.period}-${next.managementCycle.actionsUsed}`,
    label: action.label ?? "Ação de gestão",
    duePeriod: capacity.period + Math.max(1, Number(action.reviewAfterPeriods ?? 1)),
    status: "pending"
  });
  return { ok: true, state: next, capacity: getManagementCapacity(next) };
}

export function closeManagementPeriod(state, organization = {}) {
  const next = ensureManagementCycle(state);
  const cycle = next.managementCycle;
  const events = [];
  const average = Number(organization.score ?? 0);
  const alerts = Number(organization.criticalAlerts ?? 0);
  const minimumSafety = Number(organization.minimumSafety ?? 100);
  const lowRecovery = Number(organization.lowRecoveryCount ?? 0);

  if (alerts > 0) events.push({
    id: "unresolved-risk-signals",
    title: "Sinais críticos permanecem abertos",
    severity: "high",
    message: `${alerts} alerta(s) seguem exigindo investigação. A média da equipe não elimina riscos individuais ou coletivos.`
  });
  if (minimumSafety < 50) events.push({
    id: "safety-pressure",
    title: "Pressão sobre segurança",
    severity: "high",
    message: "Condições de segurança muito baixas exigem prioridade e revisão dos controles, mesmo sob restrição orçamentária."
  });
  if (lowRecovery >= 2) events.push({
    id: "recovery-pressure",
    title: "Acúmulo de desgaste",
    severity: "medium",
    message: "Mais de uma pessoa apresenta recuperação baixa. Reavalie jornada, dimensionamento e pausas; ações individuais isoladas tendem a ser insuficientes."
  });
  if (average < 50) events.push({
    id: "organizational-instability",
    title: "Instabilidade organizacional",
    severity: "medium",
    message: "O indicador médio permanece baixo. Investigue causas e efeitos cruzados antes de escolher novas medidas."
  });

  const dueReviews = cycle.pendingReviews.filter(item => item.status === "pending" && item.duePeriod <= cycle.period);
  for (const review of dueReviews) review.status = "due";
  cycle.eventHistory.push(...events.map(event => ({ ...event, period: cycle.period })));
  cycle.lastClose = {
    period: cycle.period,
    actionsUsed: cycle.actionsUsed,
    events,
    dueReviews: dueReviews.map(item => item.label)
  };
  cycle.period += 1;
  cycle.actionsUsed = 0;
  return { state: next, closedPeriod: cycle.lastClose.period, events, dueReviews };
}

export function resolveManagementReview(state, reviewId, outcome = "reviewed") {
  const next = ensureManagementCycle(state);
  const review = next.managementCycle.pendingReviews.find(item => item.id === reviewId);
  if (!review) return { ok: false, state, reason: "Revisão não encontrada." };
  review.status = outcome === "completed" ? "completed" : "reviewed";
  review.resolvedPeriod = next.managementCycle.period;
  return { ok: true, state: next };
}
