import {EVENT_CATALOG as C} from '../simulation/event-catalog.js';
import {eventState,eventClock,initializeEvents,nextEvent,beginEvent,chooseEvent,finishEvent,PROTECTION} from '../simulation/adverse-events.js';
import {readEconomy,transactEconomy} from '../simulation/hero-progression.js';
import {readTimeline} from '../simulation/mission-timeline.js';
import {UPGRADES} from '../simulation/investment.js';
const names={escritorio:'Escritório',producao:'Produção',atendimento:'Atendimento'},factors={carga:'Ritmo e carga',auton:'Autonomia',relac:'Relações',lider:'Liderança',recon:'Reconhecimento',seg:'Segurança psicológica'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('pt-BR'),signed=n=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n));
const icon=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(path)}"/></svg>`;
function chips(fx,k=1){let out=[];for(const key of ['mods','all'])for(const [f,d] of Object.entries(fx[key]||{}))out.push(`<span class="pm-chip pm-chip--${d>0?'good':'bad'}">${signed(Math.round(d*k))} ${factors[f]}${key==='all'?' · empresa':''}</span>`);if(fx.bal)out.push(`<span class="pm-chip pm-chip--cost">Caixa ${signed(fx.bal*k)}</span>`);if(fx.balPct)out.push(`<span class="pm-chip pm-chip--bad">Caixa ${signed(fx.balPct*k*100)}%</span>`);if(fx.infl)out.push(`<span class="pm-chip pm-chip--${fx.infl>0?'bad':'good'}">Preços ${signed(fx.infl*k)}%</span>`);return out.join('');}
function netEffects(now,choice,k){const net={mods:{},all:{}};for(const kind of ['mods','all'])for(const f of Object.keys(factors)){const n=Math.round((now[kind]?.[f]||0)*k)+(choice[kind]?.[f]||0);if(n)net[kind][f]=n;}return net;}
export function mountAdverseEvents({actions,campaign,pause,resume,refresh,message}){
 const button=document.createElement('button');button.type='button';button.textContent='Eventos';actions.append(button);
 const status=document.createElement('span');status.className='event-countdown';actions.append(status);
 const dialog=document.createElement('dialog');dialog.className='pm-ev company-event-dialog';dialog.setAttribute('aria-labelledby','pm-ev-t');document.body.append(dialog);
 let preview=null,catalog=false,opener=null,busy=false,disposed=false;
 const read=()=>readEconomy(localStorage);
 const elapsed=()=>{const all=readTimeline(localStorage).campaigns,current=campaign();if(current)all[current.caseId]=current;return Object.values(all).reduce((n,c)=>n+c.elapsedMs,0);};
 function notify(){refresh();document.dispatchEvent(new CustomEvent('pilha:progression-changed'));}
 function show(){if(!dialog.open){opener=document.activeElement;dialog.showModal();}dialog.querySelector('.pm-ev__card')?.focus();}
 function paint(state){
  catalog=false;const e=eventState(state),cur=e.current;if(!cur)return;
  const def=C.BY[cur.id],cat=C.CATS[def.c],result=cur.stage==='result',k=cur.protectedBy ? 0.5 : 1;
  dialog.className=`pm-ev company-event-dialog pm-ev--${def.sev}${result?' is-result':''}`;dialog.style.setProperty('--cc',cat.cor);dialog.setAttribute('role',result?'dialog':'alertdialog');
  const header=`<div class="pm-ev__hd"><div class="pm-ev__ico pm-an-${def.an}"><span class="pm-ev__ring"></span>${icon(result?'M5 12.5l4.5 4.5L19 7.5':def.ic)}</div><div class="pm-ev__ttl"><div class="pm-ev__meta"><span class="pm-ev__sev">${result?'Consequência':def.sev==='crit'?'Urgente':'Atenção'}</span><span class="pm-ev__cat">${esc(cat.n)}</span></div><h2 id="pm-ev-t">${esc(def.n)}</h2><p class="pm-ev__where">${names[cur.sid]} · Semana ${1+Math.floor(e.clockMs/3600000)}</p></div></div>`;
  let body;
  if(!result){body=`<p class="pm-ev__ctx">${esc(def.ctx.replace('{s}',names[cur.sid]))}</p><section class="pm-ev__sec"><h3>Impacto</h3><div class="pm-ev__chips">${def.ind.map(t=>`<span class="pm-chip pm-chip--blue">${esc(t)}</span>`).join('')}${chips(def.now,k)}${cur.protectedBy?'<span class="pm-chip pm-chip--good">Medida instalada · impacto reduzido</span>':''}</div></section><section class="pm-ev__sec"><h3>Decisão</h3><div class="pm-ev__opts">${def.opts.map((op,i)=>`<button type="button" class="pm-opt" data-event-choice="${i}" ${state.budget<op.cost?'disabled':''}><span class="pm-opt__t">${esc(op.l)}</span><span class="pm-opt__d">${esc(op.d)}</span><span class="pm-opt__fx">${chips(op.e)}</span><span class="pm-opt__p">${op.cost?'<span class="pm-coin pm-coin--s"></span>'+fmt(op.cost):'Sem custo'}${state.budget<op.cost?' · faltam '+fmt(op.cost-state.budget):''}</span></button>`).join('')}</div></section>`;}
  else {const op=def.opts[cur.pick],delta=cur.after.budget-cur.before.budget,prot=UPGRADES.find(u=>u.id===PROTECTION[def.prot]);body=`<p class="pm-ev__ctx">${esc(op.r)}</p><section class="pm-ev__sec"><h3>O que mudou</h3><div class="pm-ev__chips">${chips(netEffects(def.now,op.e,k))}<span class="pm-chip pm-chip--cost">Caixa líquido ${signed(delta)}</span></div><p class="pm-ev__idx">Saldo após a decisão: <b>${fmt(cur.after.budget)}</b> · preços +${cur.after.inflation}%</p>${prot?`<p class="pm-ev__tip">${cur.protectedBy?'Proteção aplicada: ':'Medida que reduz o impacto: '}${esc(prot.name)}.</p>`:''}</section><button type="button" class="pm-btn pm-ev__go" data-event-done>Continuar${!preview&&cur.resumeCase?' e retomar ciclo':''}</button>`;}
  dialog.innerHTML=`<div class="pm-ev__card" tabindex="-1">${header}${body}<p class="pm-ev__note">${preview?'Simulação: nenhuma compra, escolha ou impacto deste evento é salvo.':'Créditos fictícios. O ciclo fica pausado para você decidir com calma. Efeitos no cenário; notas das missões continuam separadas.'}</p><p class="event-error" role="status"></p></div>`;show();
 }
 function openCatalog(){const r=read();if(!r.ok){message('Não foi possível validar os dados. Nenhum evento foi aplicado.');return;}if(eventState(r.state).current){paint(r.state);return;}preview=null;catalog=true;dialog.className='pm-ev company-event-dialog pm-ev--cat';dialog.setAttribute('role','dialog');dialog.innerHTML=`<div class="pm-ev__card" tabindex="-1"><div class="pm-ev__hd"><h2 id="pm-ev-t">Catálogo de eventos</h2><button type="button" class="pm-x" data-event-close aria-label="Fechar catálogo">×</button></div><p>Explore os 19 cenários sem alterar saldo ou melhorias. No jogo, o primeiro ocorre após 10 minutos de ciclo ativo; os próximos, a cada 15–20 minutos.</p>${C.CATS.map((cat,i)=>`<section class="pm-ev__sec"><h3>${esc(cat.n)}</h3><div class="pm-evlist">${C.LIST.filter(d=>d.c===i).map(d=>`<button type="button" class="pm-evitem ${d.sev==='crit'?'pm-evitem--crit':''}" data-event-preview="${d.id}">${icon(d.ic)}<span>${esc(d.n)}</span><em>Simular</em></button>`).join('')}</div></section>`).join('')}<p class="event-error" role="status"></p></div>`;show();}
 function close(){dialog.close();preview=null;catalog=false;if(opener?.isConnected)opener.focus();}
 async function done(){if(busy)return;if(preview||catalog){close();return;}const r=read(),c=r.ok&&eventState(r.state).current;if(!c)return close();busy=true;try{const result=await transactEconomy(localStorage,s=>finishEvent(s,c.serial));if(!result.ok)return error('Não foi possível salvar. A consequência continua aberta.');close();notify();if(c.resumeCase)await resume(c.resumeCase);}finally{busy=false;}}
 function error(text){const el=dialog.querySelector('.event-error');if(el)el.textContent=text;}
 dialog.addEventListener('cancel',e=>{e.preventDefault();const r=preview||read().state;if(catalog||preview||r&&eventState(r).current?.stage==='result')done();else error('Escolha uma resposta. Há sempre uma opção sem custo.');});
 dialog.addEventListener('click',async ev=>{
  const b=ev.target.closest('button');if(!b||busy)return;
  if(b.hasAttribute('data-event-close')||b.hasAttribute('data-event-done'))return done();
  if(b.dataset.eventPreview){const r=read();if(!r.ok)return;const d=C.BY[b.dataset.eventPreview];preview=beginEvent(r.state,d.id,d.sec[0],elapsed(),{preview:true}).state;paint(preview);return;}
  if(!b.hasAttribute('data-event-choice'))return;
  const r=preview||read().state,c=r&&eventState(r).current;if(!c)return;
  busy=true;try{const result=preview?chooseEvent(preview,c.serial,+b.dataset.eventChoice):await transactEconomy(localStorage,s=>chooseEvent(s,c.serial,+b.dataset.eventChoice));if(!result.ok){error('O saldo ou evento mudou. Sua escolha não foi cobrada; reabra para atualizar.');return;}if(preview)preview=result.state;else notify();paint(result.state);}finally{busy=false;}
 });
 button.addEventListener('click',openCatalog);
 async function tick(){
  if(disposed||busy||document.hidden||dialog.open)return;
  const r=read();if(!r.ok){status.textContent='Eventos indisponíveis · dados preservados';return;}
  let state=r.state,e=eventState(state),clock=elapsed(),remaining=Math.max(0,e.nextAt-clock),seconds=Math.ceil(remaining/1000);
  status.textContent=`Próximo: ${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')} de ciclo ativo`;
  if(document.querySelector('dialog[open],.pi-root,.player-entry'))return;
  busy=true;try{
   if(!state.adverseEvents){const init=await transactEconomy(localStorage,s=>initializeEvents(s,clock));if(!init.ok)return;state=init.state;e=eventState(state);}
   if(e.current){pause('Ciclo pausado para responder ao evento.');paint(state);return;}
   if(campaign()?.status!=='running')return;
   if(clock-e.clockMs>=15000){const result=await transactEconomy(localStorage,s=>eventClock(s,clock));if(!result.ok)return;state=result.state;e=eventState(state);}
   if(clock<e.nextAt)return;
   const def=nextEvent(state),resumeCase=campaign()?.caseId;
   const result=await transactEconomy(localStorage,s=>{const result=beginEvent(s,def.id,def.sec[e.count%def.sec.length],clock);if(result.ok)result.state.adverseEvents.current.resumeCase=resumeCase;return result;});
   if(!result.ok)return;pause('Ciclo pausado para responder ao evento.');notify();paint(result.state);
  }finally{busy=false;}
 }
 const interval=setInterval(tick,1000);tick();
 return {catalog:openCatalog,dispose(){disposed=true;clearInterval(interval);dialog.remove();button.remove();status.remove();}};
}
