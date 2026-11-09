import {staffView} from './company-living.js';
import {SECTORS} from '../data/continuous/catalog.js';
export function collectiveHealth(state,actors=[]){
 const active=staffView(state,actors).filter(p=>p.employment==='active'),average=rows=>rows.length?Math.round(rows.reduce((n,p)=>n+p.health,0)/rows.length):null;
 const score=average(active);return {score,count:active.length,status:score===null?'Sem equipe ativa':score>=70?'Estável':score>=45?'Atenção':'Precisa de cuidado',color:score===null?'#9fb4cf':score>=70?'#4fce9b':score>=45?'#ffd166':'#ef6d91',sectors:SECTORS.filter(s=>!s.rest).map(s=>{const rows=active.filter(p=>p.home===s.id);return {id:s.id,name:s.name,count:rows.length,score:average(rows)};})};
}
