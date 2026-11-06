import {BENEFITS} from './benefits.js';
/** Original C3 values extracted from PilhA+ Game.zip.
 * SHA256 cacd69bc9be7130df5c63f31f415cc20947d7ef03b1062bc4a3ba8797f3b2b77.
 * Timings, restoration prices and synergy mapping are experimental game proposals, not clinical evidence. */
export const FACTORS=[['carga','Ritmo e carga','#ffd166'],['auton','Autonomia','#48cae4'],['relac','Relações','#52b788'],['lider','Liderança','#f4a261'],['recon','Reconhecimento','#9b5de5'],['seg','Segurança psicológica','#e63946']].map(([id,name,color])=>({id,name,color}));
const sectorRows=[
 ['escritorio','Escritório','Prazos que se acumulam e decisões que demoram.',[28,42,35,40,30,26]],
 ['producao','Produção','Metas de turno altas e riscos escondidos.',[22,30,40,33,35,24]],
 ['atendimento','Atendimento','Fila que não zera e pouco tempo para respirar.',[24,28,32,36,38,30]],
 ['restauracao','Restauração','Biblioteca, bosque, meditação, mini auditório e pátio.',[0,0,0,0,0,0]]
];
export const SECTORS=sectorRows.map(([id,name,description,v])=>({id,name,description,base:Object.fromEntries(FACTORS.map((f,i)=>[f.id,v[i]])),rest:id==='restauracao',symptoms:['Rever carga, recursos e cobertura de pausas.','Dar autonomia e clareza de responsabilidades.','Garantir cooperação e mediação respeitosa.','Apoiar lideranças com recursos e participação.','Reconhecer contribuições sem rankings individuais.','Escuta protegida, sem coerção ou retaliação.']}));
const original=[
 ['seg','Segurança Psicológica','Saúde Mental',900,{seg:18,relac:4},['prolongado',0,2],['Rituais de escuta nas equipes','Canal seguro de relato','Espaço de apoio pós-ligação']],
 ['asse','Prevenção ao Assédio','Saúde Mental',1400,{seg:10,relac:10,lider:4},['tardio',1,1],['Política e canal de denúncia','Respeito no turno e na linha','Protocolo contra clientes abusivos']],
 ['psic','Psicoeducação','Saúde Mental',1100,{seg:6,relac:4,carga:4},['prolongado',0,2],['Oficinas de bem-estar','Diálogo de segurança (DDS)','Treino de manejo emocional']],
 ['ergo','Ergonomia','Ambiente',1800,{carga:12},['imediato',0,0],['Mesas e cadeiras ajustáveis','Bancadas e postos de trabalho','Estações e headsets']],
 ['fisi','Condições Físicas','Condições',2600,{carga:8,relac:4},['imediato',0,0],['Climatização e iluminação','Ventilação e luz da linha','Acústica e climatização']],
 ['espa','Espaço e Confinamento','Condições',2600,{seg:8,carga:6},['imediato',0,0],['Layout e circulação','Corredores e sinalização','Cabines e privacidade']],
 ['jorn','Carga e Jornada','Trabalho',1200,{carga:20},['imediato',0,0],['Metas e prazos realistas','Escala de turnos e pausas','Fila, TMA e pausas']],
 ['auto','Autonomia e Papéis','Trabalho',1000,{auton:20,recon:4},['tardio',1,1],['Alçadas e papéis claros','Autonomia para parar a linha','Flexibilidade no roteiro']],
 ['lide','Liderança','Liderança',1500,{lider:18,recon:8},['prolongado',0,3],['Formação de gestores','Supervisão que escuta','Feedback e coaching de líderes']],
 ['rela','Relações e Conflitos','Trabalho',950,{relac:20},['prolongado',0,2],['Rituais entre áreas','Passagem de turno estruturada','Apoio entre pares']],
 ['muda','Mudanças','Liderança',850,{recon:12,auton:6},['imediato',0,0],['Comunicação de mudanças','Participação na melhoria contínua','Escuta antes de novos processos']],
 ['apoi','Apoio e Recuperação','Saúde Mental',1300,{seg:8,carga:6,recon:4},['tardio',1,1],['Acolhimento e retorno gradual','Retorno seguro pós-afastamento','Pausa e suporte psicológico']]
];
const restore=[
 ['puff','Puff',450,{carga:3,relac:2},['imediato',0,0],'biblioteca',1,'Assentos para pausas e leitura.'],
 ['arvore','Árvore',700,{carga:4,seg:2},['tardio',2,1],'bosque',1,'Sombra e jardim; não corrige sobrecarga.'],
 ['almofadas','Almofadas',250,{carga:2,seg:1},['imediato',0,0],'meditacao',1,'Conforto acessível em atividade voluntária.'],
 ['tapete','Tapete de meditação',400,{carga:3,auton:2},['imediato',0,0],'meditacao',1,'Espaço de pausa; participação livre.'],
 ['capelao','Contratação de capelão',1000,{relac:4,seg:4},['prolongado',0,2],'auditorio',1,'Escuta opcional e plural; requer alternativa laica e respeito às crenças.'],
 ['yoga','Professor de yoga',1200,{carga:5,auton:3},['prolongado',0,2],'meditacao',1,'Atividade adaptada e voluntária, sem presumir efeito clínico.'],
 ['plano','Plano de saúde',2200,{seg:7,recon:5},['tardio',1,1],'biblioteca',0,'Acesso equitativo ao cuidado; não substitui prevenção organizacional.'],
 ['livros','Novos livros',600,{auton:4,recon:3},['prolongado',0,2],'biblioteca',1,'Acervo inclusivo para leitura e aprendizagem.'],
 ['cursos','Novos cursos e palestras',900,{lider:4,auton:4,recon:3},['tardio',1,2],'auditorio',2,'Tempo protegido para aprender; rodas de conversa sem exposição forçada.'],
 ['frutifera','Árvore frutífera',850,{carga:4,relac:3},['tardio',3,1],'patio',1,'Plantio com maturação simulada e cuidado do pátio.'],
 ['banco','Banco confortável',550,{carga:3,relac:3},['imediato',0,0],'patio',1,'Assento para descanso e conversa com acesso livre.'],
 ['intervalo','Intervalo estendido',650,{carga:6,auton:4},['imediato',0,0],'bosque',2,'Pausas com cobertura, sem transferir sobrecarga aos colegas.']
];
const time=([kind,delay,ramp])=>({kind,delay,ramp});
export const ITEMS=[...original.map(([id,name,category,cost,factors,t,where])=>({id,name,category,cost,factors,timing:time(t),where:Object.fromEntries(SECTORS.slice(0,3).map((s,i)=>[s.id,where[i]])),origin:'ZIP C3',rest:false})),...restore.map(([id,name,cost,factors,t,space,capacity,description])=>({id,name,cost,factors,timing:time(t),space,capacity,description,category:'Restauração',origin:'Proposta de balanceamento',rest:true})),...BENEFITS];
export const RULES={startBalance:10000,companyGoal:45,sectorGoal:50,effects:[1.4,1.12,.84],costs:[1,1.4,1.9],priceStep:50,weekMs:120000,restCap:6,eventGapWeeks:2};
export const SOURCE={file:'PilhA+ Game.zip',sha256:'cacd69bc9be7130df5c63f31f415cc20947d7ef03b1062bc4a3ba8797f3b2b77',eventFile:'simulation/event-catalog.js',eventCount:19,eventsIdenticalToZip:true,originalClock:'Cada compra avança uma semana',formulas:{index:'mean(carga,auton,relac,lider,recon,seg)',company:'mean(escritorio,producao,atendimento)',stress:'100-(carga*.4+auton*.3+lider*.3)',absenteeism:'2+(100-index)*.12',climate:'(relac+recon+seg)/3',productivity:'40+index*.6'},sampleHeroActions:{count:6,implemented:false,reason:'São SAMPLE no ZIP e não substituem os poderes canônicos.'}};
