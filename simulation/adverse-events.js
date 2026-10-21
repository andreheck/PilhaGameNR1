import {EVENT_CATALOG} from './event-catalog.js';
export const FIRST_EVENT_MS=10*60*1000;
export const EVENT_GAP_MS=[15*60*1000,20*60*1000];
export const PROTECTION={muda:'comunicacao-mudancas',auto:'papel-autonomia',rela:'conflitos',jorn:'pausas',espa:'espaco-seguro',psic:'escuta-segura',fisi:'clima-ventilacao',apoi:'apoio-retorno'};
const sectors=['escritorio','producao','atendimento'],factors=['carga','auton','relac','lider','recon','seg'];
const copy=x=>JSON.parse(JSON.stringify(x));
export function emptyEvents(){return {version:1,clockMs:0,nextAt:FIRST_EVENT_MS,count:0,seen:[],lastCategory:-1,effects:[],infl:{value:0,atMs:0},current:null};}
export function initializeEvents(state,clockMs=0){
 if(state.adverseEvents)return {ok:true,noWrite:true,state};
 const e=emptyEvents();e.clockMs=Math.max(0,Number.isFinite(clockMs)?clockMs:0);e.nextAt=e.clockMs+FIRST_EVENT_MS;
 return {ok:true,state:{...state,adverseEvents:e}};
}
export function eventState(state){
 const e=state.adverseEvents;if(e==null)return emptyEvents();
 if(e.version!==1||!Number.isFinite(e.clockMs)||e.clockMs<0||!Number.isFinite(e.nextAt)||e.nextAt<0||!Number.isSafeInteger(e.count)||e.count<0||!Array.isArray(e.seen)||e.seen.length>10||!Array.isArray(e.effects)||e.effects.length>400||!e.infl||!Number.isFinite(e.infl.value)||!Number.isFinite(e.infl.atMs))throw Error('invalid-events');
 if(e.effects.some(v=>!sectors.includes(v.sid)||!factors.includes(v.factor)||!Number.isFinite(v.delta)||Math.abs(v.delta)>10000||!Number.isFinite(v.atMs)))throw Error('invalid-effects');
 const c=e.current;
 if(c&&(!EVENT_CATALOG.BY[c.id]||!sectors.includes(c.sid)||!['decide','result'].includes(c.stage)||!Number.isSafeInteger(c.serial)||!c.before||!Number.isFinite(c.before.budget)||(c.resumeCase&&!['01','02','03','04','05'].includes(c.resumeCase))||(c.stage==='result'&&(!EVENT_CATALOG.BY[c.id].opts[c.pick]||!Number.isFinite(c.after?.budget)||!Number.isFinite(c.after?.inflation)))))throw Error('invalid-current-event');
 return copy(e);
}
export function eventInflation(state,clockMs){
 try{const e=eventState(state),now=Math.max(e.clockMs,clockMs||0);return Math.max(0,Math.min(60,e.infl.value-Math.floor(Math.max(0,now-e.infl.atMs)/3600000)));}catch{return 0;}
}
export function eventVisuals(state,visual){
 const out=copy(visual),e=eventState(state);
 for(const v of e.effects){const weeks=Math.floor(Math.max(0,e.clockMs-v.atMs)/3600000),delta=v.delta<0?v.delta*Math.pow(.75,weeks):v.delta;out[v.sid][v.factor]=Math.max(0,Math.min(100,out[v.sid][v.factor]+delta));}
 return out;
}
function applyEffects(state,e,fx,sid,k=1){
 for(const sector of sectors){const mods=sector===sid?fx.mods:null;for(const f of factors){const delta=Math.round(((mods?.[f]||0)+(fx.all?.[f]||0))*k);if(!delta)continue;const prior=delta>0&&e.effects.find(v=>v.sid===sector&&v.factor===f&&v.delta>0);if(prior)prior.delta=Math.min(10000,prior.delta+delta);else e.effects.push({sid:sector,factor:f,delta,atMs:e.clockMs});}}
 e.effects=e.effects.filter(v=>v.delta>0||Math.abs(v.delta*Math.pow(.75,Math.floor(Math.max(0,e.clockMs-v.atMs)/3600000)))>=.1);
 if(fx.bal)state.budget=Math.max(0,state.budget+Math.round(fx.bal*k));
 if(fx.balPct)state.budget=Math.max(0,Math.round(state.budget*(1+fx.balPct*k)));
 if(fx.infl)e.infl={value:Math.max(0,Math.min(60,eventInflation({...state,adverseEvents:e})+Math.round(fx.infl*k))),atMs:e.clockMs};
}
export function eventClock(state,clockMs){
 let e;try{e=eventState(state);}catch{return {ok:false,error:'invalid-events'};}
 const clock=Math.max(e.clockMs,Number.isFinite(clockMs)?clockMs:0);
 if(clock===e.clockMs)return {ok:true,noWrite:true,state};
 e.clockMs=clock;return {ok:true,state:{...state,adverseEvents:e}};
}
export function nextEvent(state){
 const e=eventState(state);
 let pool=EVENT_CATALOG.LIST.filter(v=>!e.seen.includes(v.id)&&(v.when!=='invested'||state.upgrades.length));
 const alternate=pool.filter(v=>v.c!==e.lastCategory);if(alternate.length)pool=alternate;
 return pool[e.count%pool.length];
}
export function beginEvent(state,id,sid,clockMs,{preview=false}={}){
 let e;try{e=eventState(state);}catch{return {ok:false,error:'invalid-events'};}
 const def=EVENT_CATALOG.BY[id];if(!def||!def.sec.includes(sid))return {ok:false,error:'invalid-event'};
 if(e.current)return {ok:false,error:'pending-event'};
 e.clockMs=Math.max(e.clockMs,clockMs||0);
 if(!preview&&e.clockMs<e.nextAt)return {ok:false,error:'not-due'};
 const next=copy(state),protectedBy=!!(PROTECTION[def.prot]&&state.upgrades.includes(PROTECTION[def.prot]));
 e.current={id,sid,serial:e.count+1,stage:'decide',pick:-1,protectedBy,before:{budget:state.budget,inflation:eventInflation(state,e.clockMs)}};
 applyEffects(next,e,def.now,sid,protectedBy ? 0.5 : 1);next.adverseEvents=e;
 return {ok:true,state:next};
}
export function chooseEvent(state,serial,index){
 let e;try{e=eventState(state);}catch{return {ok:false,error:'invalid-events'};}
 const c=e.current,op=c&&EVENT_CATALOG.BY[c.id].opts[index];
 if(!c||c.serial!==serial||c.stage!=='decide'||!op)return {ok:false,error:'stale-event'};
 if(state.budget<op.cost)return {ok:false,error:'insufficient-budget'};
 const next=copy(state);next.budget-=op.cost;applyEffects(next,e,op.e,c.sid);
 c.stage='result';c.pick=index;c.after={budget:next.budget,inflation:eventInflation({...next,adverseEvents:e})};
 next.adverseEvents=e;return {ok:true,state:next};
}
export function finishEvent(state,serial){
 let e;try{e=eventState(state);}catch{return {ok:false,error:'invalid-events'};}
 const c=e.current;if(!c||c.serial!==serial||c.stage!=='result')return {ok:false,error:'unresolved-event'};
 e.seen=[...e.seen,c.id].slice(-10);e.lastCategory=EVENT_CATALOG.BY[c.id].c;e.count++;e.current=null;
 e.nextAt=e.clockMs+EVENT_GAP_MS[(e.count-1)%2];
 return {ok:true,state:{...state,adverseEvents:e}};
}
