/** PM-authorized fictional job assignments, independent of personality/health. */
export const DEPARTMENTS=['escritorio','producao','atendimento'];
export const MANAGERS={escritorio:'NPC-03',producao:'NPC-11',atendimento:'NPC-12'};
export const JOBS={
 'NPC-01':['tatico','Especialista em planejamento'],
 'NPC-02':['operacional','Analista de tecnologia'],
 'NPC-03':['estrategico','Gerente do Escritório'],
 'NPC-04':['operacional','Analista administrativa'],
 'NPC-05':['tatico','Especialista em relações'],
 'NPC-06':['operacional','Analista de experiência'],
 'NPC-07':['tatico','Coordenadora de equipes'],
 'NPC-08':['operacional','Analista de atendimento'],
 'NPC-09':['tatico','Especialista em logística'],
 'NPC-10':['operacional','Analista de apoio'],
 'NPC-11':['estrategico','Gerente de Produção'],
 'NPC-12':['estrategico','Gerente de Atendimento'],
 'NPC-13':['tatico','Especialista em operação'],
 'NPC-14':['operacional','Analista de ambiente'],
 'NPC-15':['operacional','Analista de produção'],
 'NPC-16':['operacional','Analista de comunicação']
};
export const RANK_NAMES={operacional:'Operacional',tatico:'Tático',estrategico:'Estratégico'};
export const BOARD=Array.from({length:6},(_,i)=>({heroId:'PILHA-H0'+(i+1),position:'Conselheiro do conselho administrativo'}));
export function jobFor(id,home){const assignment=JOBS[id];if(!assignment)return null;const [rank,position]=assignment;return {rank,rankName:RANK_NAMES[rank],position,managerId:MANAGERS[home],reportsTo:id===MANAGERS[home]?'conselho':MANAGERS[home]};}

export const managerMap=s=>s.initialHiring?.status==='complete'?s.initialHiring.managers:MANAGERS;
export function jobInCompany(s,p){
 const id=managerMap(s)[p.home],base=p.organization;
 const steps=s.receipts?.filter(r=>r.id==='promocao'&&r.targetId===p.id).length||0;
 const promoted=steps?{rank:'tatico',rankName:'Tático',position:base?.rank==='operacional'&&steps===1?'Especialista de setor':'Coordenador(a) de setor'}:{};
 if(s.initialHiring?.status!=='complete')return {...base,...promoted};
 if(p.id===id)return {rank:'estrategico',rankName:'Estratégico',position:'Gerente de '+({escritorio:'Escritório',producao:'Produção',atendimento:'Atendimento'}[p.home]),managerId:id,reportsTo:'conselho'};
 return {...base,...promoted,...(base?.rank==='estrategico'?{rank:'tatico',rankName:'Tático',position:'Especialista de setor'}:{}),managerId:id,reportsTo:id};
}

export function promotionAvailable(s,p){const job=jobInCompany(s,p);return p.id!==managerMap(s)[p.home]&&s.staff?.[p.id]?.employment==='active'&&job?.rank!=='estrategico'&&!/Coorden|Coordena/.test(job?.position||'');}
