// Presentation of the fictional scenario, not clinical results or mission scores.
export const VISUAL_BASE={escritorio:{carga:28,auton:35,relac:38,lider:30,recon:35,seg:38},producao:{carga:22,auton:30,relac:40,lider:33,recon:35,seg:24},atendimento:{carga:25,auton:30,relac:35,lider:28,recon:32,seg:35}};
const ORGANIZATIONAL={pausas:['carga'],'papel-autonomia':['auton'],conflitos:['relac'],lideranca:['lider'],'escuta-segura':['seg'],'protocolo-antassedio':['seg']};
export function companyVisuals(owned=[]){
 const result=JSON.parse(JSON.stringify(VISUAL_BASE));
 // Color change communicates an installed measure; quantitative axes remain temporal.
 for(const sector of Object.values(result))for(const id of owned)for(const zone of ORGANIZATIONAL[id]||[])sector[zone]=Math.min(78,sector[zone]+38);
 return result;
}
export function motionPreference(storage,systemReduced){
 let value;try{value=storage.getItem('pilha-motion-v1');}catch{}
 return value==='on'?false:value==='off'?true:systemReduced;
}
// Circulation is gameplay feedback. Default is identical on desktop and mobile;
// reduced-motion still controls decorative effects through motionPreference.
export function workerMotionPreference(storage){
 let value;try{value=storage.getItem('pilha-motion-v1');}catch{}
 return value==='off';
}
