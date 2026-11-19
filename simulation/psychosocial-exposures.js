const clamp=(value,min=0,max=100)=>Math.max(min,Math.min(max,value));

// Local workplace conditions are grouped under existing parent factors. These
// are simulation signals, not measurements or diagnoses of a real workplace.
const profiles={
  atendimento:{label:'Atendimento e vendas',risks:[['noise','Ruído no atendimento',['carga','relac']],['harassment','Conflitos e assédio de terceiros',['seg','relac']] ]},
  production:{label:'Operação de máquinas',risks:[['heat','Calor no posto',['carga','seg']],['cold','Frio no posto',['carga','auton']],['noise','Ruído de máquinas',['carga','relac']],['structure','Condição física do posto',['seg','carga']] ]},
  it:{label:'Tecnologia · sala de servidores',risks:[['heat','Calor na sala de servidores',['carga','seg']],['cold','Frio na sala de servidores',['carga','auton']],['noise','Ruído de equipamentos',['carga','relac']] ]},
  office:{label:'Escritório',risks:[['harassment','Relações respeitosas',['seg','relac']] ]}
};

export function occupationalProfile(person){
  if(person?.name==='Tiago'||/tecnologia|servidor|infraestrutura/i.test(person?.role||''))return profiles.it;
  if(person?.home==='producao')return profiles.production;
  if(person?.home==='atendimento')return profiles.atendimento;
  return profiles.office;
}

export function localExposureView(person,factors){
  const profile=occupationalProfile(person);
  const risks=profile.risks.map(([id,name,parentFactors])=>{
    const parent=clamp(parentFactors.reduce((sum,factor)=>sum+Number(factors?.[factor]??50),0)/parentFactors.length);
    const score=Math.round(clamp((55-parent)*.8));
    return {id,name,factors:parentFactors,score,status:score>=32?'Atenção':score>=16?'Monitorar':'Sob controle'};
  });
  const healthPenalty=Math.min(8,risks.reduce((sum,risk)=>sum+risk.score*.018,0));
  return {group:profile.label,risks,healthPenalty};
}
