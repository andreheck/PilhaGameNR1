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
