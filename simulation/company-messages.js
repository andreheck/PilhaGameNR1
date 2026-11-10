import {roster,sectorStaffing} from './staffing-management.js';
import {SECTORS} from '../data/continuous/catalog.js';
import {ACHIEVEMENTS} from '../data/continuous/achievements.js';
export const PHONE_KEY='pilha-company-phone-v1';
const hash=s=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return (n>>>0).toString(36);};
export function companyMessages(s,notices=[]){
 const rows=[],add=(id,title,text,kind='info',target='messages',week=s.week)=>rows.push({id,title,text,kind,target,week});
 if(s.events?.current){const e=s.events.current;add('event:'+e.serial+':'+e.stage,'Ocorrência em '+(SECTORS.find(x=>x.id===e.sid)?.name||e.sid),e.stage==='decision'?'Sua decisão está pendente. Abra os detalhes para comparar as opções.':'Confira a consequência e conclua esta ocorrência.','alert','event');}
 const payment=s.weeklyIncome?.lastPayment;if(payment)add('payment:'+payment.week,'Aporte semanal recebido',payment.amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+' fictícios creditados uma vez nesta semana.','positive','finance',payment.week);
 for(const sec of SECTORS.filter(x=>!x.rest)){const staff=sectorStaffing(s,sec.id);if(staff.gap)add('vacancy:'+sec.id+':'+s.week+':'+staff.gap,'Vagas em '+sec.name,staff.gap+' posto(s) sem cobertura. Revise a distribuição e a contratação.','alert','vacancies');}
 for(const p of roster(s)){const a=s.staff?.[p.id];if(a?.employment==='leave')add('leave:'+p.id+':'+a.leaveStarted,p.name+' · afastamento simulado','Retorno previsto para a semana '+a.leaveUntil+'. Consulte o relatório de RH e organize cobertura.','alert','hr');}
 for(const [id,r] of Object.entries(s.achievements?.unlocked||{}))add('trophy:'+id,'Conquista: '+(ACHIEVEMENTS.find(a=>a.id===id)?.name||id),'Registrada na semana '+r.week+'. Consulte os critérios na galeria.','positive','trophies',r.week);
 for(const h of (s.history||[]).filter(h=>h&&Number.isInteger(h.week)&&typeof h.type==='string'&&typeof h.text==='string').slice(-30))add('history:'+h.week+':'+h.type+':'+hash(h.text),({week:'Fechamento da semana',event:'Ocorrência registrada',decision:'Decisão registrada',purchase:'Melhoria adquirida'}[h.type]||'Registro da empresa'),h.text,h.type==='event'?'alert':'info',h.type==='week'?'finance':'messages',h.week);
 for(const n of notices)add(n.id,n.title,n.text,n.kind,n.target||'messages',n.week);
 return [...new Map(rows.map(r=>[r.id,r])).values()].sort((a,b)=>b.week-a.week||Number(b.kind==='alert')-Number(a.kind==='alert')).slice(0,80);
}
export function readPhone(storage){try{const raw=storage?.getItem(PHONE_KEY);if(!raw)return {read:[],notices:[]};if(raw.length>100000)throw Error('oversized');const v=JSON.parse(raw);return {read:Array.isArray(v.read)?v.read.filter(s=>typeof s==='string'&&s.length<180).slice(-500):[],notices:Array.isArray(v.notices)?v.notices.filter(n=>typeof n?.id==='string'&&typeof n.title==='string'&&typeof n.text==='string'&&Number.isInteger(n.week)&&n.week>0&&n.week<=100000&&n.id.length<180).map(n=>({...n,target:['messages','finance','hr','vacancies','trophies','event'].includes(n.target)?n.target:'messages',title:n.title.slice(0,160),text:n.text.slice(0,1200)})).slice(-30):[]};}catch{return {read:[],notices:[]};}}
