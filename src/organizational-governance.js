/**
 * Governança organizacional: sucessão gerencial e comissão preventiva.
 * Mecânicas pedagógicas ficcionais; não reproduzem procedimentos legais da CIPA.
 */
export const CIPA_CREATION_COST = 1200;
export const CIPA_MEMBER_EXIT_COST = 1000;
export const DEPARTMENT_ACTION_MULTIPLIER = 1.5;
export const CIPA_SUBSIDY_RATE = 0.3;

export function ensureGovernanceState(state) {
  const next = structuredClone(state);
  next.departments ??= [
    { id: "recebimento", name: "Recebimento" },
    { id: "separacao", name: "Separação" },
    { id: "conferencia", name: "Conferência" },
    { id: "expedicao", name: "Expedição" }
  ];
  next.employees = (next.employees ?? []).map(person => ({
    ...person,
    department: person.department ?? (person.id === "joana" ? "separacao" : person.id === "marcos" ? "conferencia" : person.id === "carla" ? "recebimento" : "expedicao")
  }));
  next.managementPositions ??= [{ id: "gerente-logistica", title: "Gerência de Operações", department: "separacao", name: "Gerente titular", active: true, successionPending: false, transitionCount: 0, strategy: null }];
  next.departmentEffects ??= {};
  next.cipa ??= { created: false, members: [], subsidizedDepartment: null, incidents: [], creationCost: CIPA_CREATION_COST };
  return next;
}

export function recordManagerDeparture(state, reason = "health-leave") {
  const next = ensureGovernanceState(state);
  const manager = next.managementPositions.find(item => item.active);
  if (!manager) return { ok: false, reason: "Não há gerente ativo neste cenário.", state };
  manager.active = false;
  manager.successionPending = true;
  manager.departureReason = reason;
  manager.departurePeriod = Number(next.period ?? 1);
  return { ok: true, state: next, manager };
}

export function appointSuccessor(state, successorId, strategy = "reorganize") {
  const next = ensureGovernanceState(state);
  const position = next.managementPositions.find(item => item.successionPending);
  const successor = next.employees.find(item => item.id === successorId);
  if (!position) return { ok: false, reason: "Não há sucessão gerencial pendente.", state };
  if (!successor) return { ok: false, reason: "Escolha uma pessoa disponível para assumir a gerência.", state };
  if (!["reorganize", "replace-team"].includes(strategy)) return { ok: false, reason: "Estratégia de sucessão inválida.", state };
  position.name = successor.name;
  position.successorId = successor.id;
  position.active = true;
  position.successionPending = false;
  position.strategy = strategy;
  position.transitionCount += 1;
  position.appointedPeriod = Number(next.period ?? 1);
  // A escolha define o tom do período: reorganização favorece continuidade;
  // troca integral aumenta ruptura e risco de perda de conhecimento.
  next.departmentEffects[position.department] = {
    multiplier: DEPARTMENT_ACTION_MULTIPLIER,
    direction: strategy === "reorganize" ? 1 : -1,
    remainingActions: 3,
    strategy,
    managerId: successor.id
  };
  if (strategy === "replace-team") {
    next.employees = next.employees.filter(person => person.department !== position.department || person.id === successor.id);
  }
  return { ok: true, state: next, position, successor, strategy };
}

export function applyDepartmentImpact(state, department, effects) {
  const next = ensureGovernanceState(state);
  const active = next.departmentEffects[department];
  if (!active || active.remainingActions <= 0) return { state: next, effects: { ...effects }, multiplier: 1, direction: 1 };
  const adjusted = Object.fromEntries(Object.entries(effects).map(([key, value]) => [
    key, Math.round(Number(value) * active.multiplier * active.direction)
  ]));
  active.remainingActions -= 1;
  return { state: next, effects: adjusted, multiplier: active.multiplier, direction: active.direction };
}

export function createCipa(state, representativesByDepartment = {}) {
  const next = ensureGovernanceState(state);
  if (next.cipa.created) return { ok: false, reason: "A comissão já foi criada.", state };
  if (Number(next.budget ?? 0) < CIPA_CREATION_COST) return { ok: false, reason: "Orçamento insuficiente para criar a comissão.", state };
  const members = next.departments.map((department, index) => {
    const person = next.employees.find(item => item.id === representativesByDepartment[department.id] && item.department === department.id);
    return person ? { employeeId: person.id, name: person.name, department: department.id, status: "active", participatesInCipa: true, committeeRole: index === 0 ? "presidente" : "representante titular" } : null;
  }).filter(Boolean);
  if (members.length !== next.departments.length) return { ok: false, reason: "Indique um representante disponível de cada setor.", state };
  next.budget -= CIPA_CREATION_COST;
  next.cipa = { ...next.cipa, created: true, members, subsidizedDepartment: null, createdPeriod: Number(next.period ?? 1), incidents: [], creationCost: CIPA_CREATION_COST };
  return { ok: true, state: next, members };
}

export function recordCipaMemberExit(state, employeeId, reason = "dismissal") {
  const next = ensureGovernanceState(state);
  if (!next.cipa.created) return { ok: false, reason: "A comissão ainda não foi criada.", state };
  const member = next.cipa.members.find(item => item.employeeId === employeeId && item.status === "active");
  if (!member) return { ok: false, reason: "Integrante ativo da comissão não encontrado.", state };
  member.status = reason === "health-leave" ? "on-leave" : "dismissed";
  member.exitReason = reason;
  const employee = next.employees.find(person => person.id === employeeId);
  if (employee) employee.employmentStatus = reason === "health-leave" ? "on-leave" : "dismissed";
  const incident = { employeeId, memberName: member.name, department: member.department, reason, period: Number(next.period ?? 1), penalty: CIPA_MEMBER_EXIT_COST };
  next.cipa.incidents.push(incident);
  next.budget = Number(next.budget ?? 0) - CIPA_MEMBER_EXIT_COST;
  return { ok: true, state: next, incident };
}

export function subsidizeCipaDepartment(state, departmentId) {
  const next = ensureGovernanceState(state);
  if (!next.cipa.created) return { ok: false, reason: "Crie a comissão antes de escolher o setor subsidiado.", state };
  if (!next.departments.some(item => item.id === departmentId)) return { ok: false, reason: "Setor não encontrado.", state };
  next.cipa.subsidizedDepartment = departmentId;
  next.cipa.subsidyRate = CIPA_SUBSIDY_RATE;
  next.cipa.subsidyUsed = false;
  return { ok: true, state: next, departmentId, subsidyRate: CIPA_SUBSIDY_RATE };
}

export function getGovernanceInterventionCost(state, department, baseCost) {
  const next = ensureGovernanceState(state);
  const subsidy = next.cipa.created && next.cipa.subsidizedDepartment === department && !next.cipa.subsidyUsed ? CIPA_SUBSIDY_RATE : 0;
  return { cost: Math.round(baseCost * (1 - subsidy)), discount: subsidy, state: next };
}
