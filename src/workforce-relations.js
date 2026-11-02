/**
 * Camada de relações de trabalho para Ao Trabalho.
 * Simulação pedagógica: não substitui análise jurídica ou gestão real de contratos.
 */
export const SUPPLIERS = Object.freeze([
  { id: "taresolvido", name: "Taresolvido", color: "orange", monthlyCost: 1850, scope: "Separação e apoio operacional", capacity: 2, quality: 72, continuity: 66, training: 58, safety: 62, turnover: 34 },
  { id: "xacomigo", name: "Xacomigo", color: "green", monthlyCost: 2250, scope: "Conferência e expedição", capacity: 2, quality: 84, continuity: 82, training: 78, safety: 80, turnover: 18 }
]);

export function ensureWorkforceState(state) {
  const next = structuredClone(state);
  next.contracts ??= [];
  next.collectiveRepresentation ??= { organized: false, representatives: 0, agenda: [], agreementStatus: "not-negotiated" };
  next.period ??= 1;
  next.contractLedger ??= [];
  return next;
}

export function getRelationshipVisual(person) {
  const supplier = SUPPLIERS.find(item => item.id === person?.supplierId);
  if (!supplier) return { className: "relationship-own", label: "Equipe própria", color: "blue", symbol: "●" };
  return { className: `relationship-outsourced relationship-${supplier.color}`, label: `Terceirizado · ${supplier.name}`, color: supplier.color, symbol: "◆" };
}

export function contractSupplier(state, supplierId) {
  const supplier = SUPPLIERS.find(item => item.id === supplierId);
  if (!supplier) return { ok: false, reason: "Fornecedor não encontrado.", state };
  const next = ensureWorkforceState(state);
  if (next.contracts.some(contract => contract.supplierId === supplierId && contract.active)) {
    return { ok: false, reason: "Já existe contrato ativo com este fornecedor.", state };
  }
  if (Number(next.budget ?? 0) < supplier.monthlyCost) {
    return { ok: false, reason: "Saldo insuficiente para assumir o primeiro período do contrato.", state };
  }
  const contract = {
    id: `contract-${supplierId}-${next.period}-${next.contracts.length + 1}`,
    supplierId, supplierName: supplier.name, monthlyCost: supplier.monthlyCost,
    scope: supplier.scope, capacity: supplier.capacity, active: true, startedAtPeriod: next.period
  };
  next.contracts.push(contract);
  next.budget = Number(next.budget ?? 0) - supplier.monthlyCost;
  next.contractLedger.push({ period: next.period, contractId: contract.id, supplierId, amount: supplier.monthlyCost, type: "activation", balanceAfter: next.budget });
  return { ok: true, state: next, contract };
}

export function addOutsourcedWorker(state, supplierId, person) {
  const next = ensureWorkforceState(state);
  const contract = next.contracts.find(item => item.supplierId === supplierId && item.active);
  if (!contract) return { ok: false, reason: "Contrate o fornecedor antes de alocar profissionais.", state };
  const allocated = next.employees.filter(item => item.supplierId === supplierId).length;
  if (allocated >= contract.capacity) return { ok: false, reason: "Capacidade contratada atingida.", state };
  if (!person?.id || next.employees.some(item => item.id === person.id)) return { ok: false, reason: "Identificador de personagem inválido ou duplicado.", state };
  const worker = {
    ...structuredClone(person), supplierId, contractId: contract.id,
    relationshipType: "outsourced", payrollRegistry: "supplier",
    unionMembership: undefined
  };
  next.employees.push(worker);
  return { ok: true, state: next, worker };
}

export function advanceWorkforcePeriod(state) {
  const next = ensureWorkforceState(state);
  next.period += 1;
  for (const contract of next.contracts.filter(item => item.active)) {
    // Despesa contratual é obrigação recorrente: pode gerar saldo negativo,
    // representando pressão de caixa em vez de desaparecer do orçamento.
    next.budget = Number(next.budget ?? 0) - contract.monthlyCost;
    next.contractLedger.push({
      period: next.period, contractId: contract.id, supplierId: contract.supplierId,
      amount: contract.monthlyCost, type: "recurring", balanceAfter: next.budget
    });
  }
  return { state: next, period: next.period };
}

export function getContractPerformance(supplierId) {
  const supplier = SUPPLIERS.find(item => item.id === supplierId);
  if (!supplier) return null;
  const quality = (supplier.quality + supplier.continuity + supplier.training + supplier.safety + (100 - supplier.turnover)) / 5;
  return { ...supplier, performance: Math.round(quality) };
}

export function updateCollectiveRepresentation(state, update = {}) {
  const next = ensureWorkforceState(state);
  next.collectiveRepresentation = {
    ...next.collectiveRepresentation,
    organized: Boolean(update.organized ?? next.collectiveRepresentation.organized),
    representatives: Math.max(0, Number(update.representatives ?? next.collectiveRepresentation.representatives)),
    agenda: Array.isArray(update.agenda) ? [...update.agenda] : next.collectiveRepresentation.agenda
  };
  return next;
}

/** Filiação individual nunca é usada para decisões ou exibida na ficha pública. */
export function unionMembershipImpact() {
  return { hiring: 0, evaluation: 0, pay: 0, promotion: 0, schedule: 0, retention: 0, publicDisclosure: false };
}
