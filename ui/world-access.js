import {routines} from '../simulation/company-living.js';
import {roster} from '../simulation/staffing-management.js';
import {RULES} from '../data/continuous/catalog.js';
import {SECTORS,ITEMS,FACTORS} from '../data/continuous/catalog.js';
import {metrics,values,level,quote} from '../simulation/company-continuous.js';
import {sectorStatus} from './hud-v2.js';
import {escapeHtml as esc} from './hero-neon.js';

export function installWorldAccess({root,getState,focusZone,showDialog}){
 let current=null;
 const style=document.createElement('link');style.rel='stylesheet';style.href='/ui/world-access.css';document.head.append(style);
 const canvas=root.querySelector('.pm-canvas'),description=document.createElement('p');
 description.id='company-world-description';description.className='pm-sr';
 description.textContent='Um único piso com Escritório, Produção, Atendimento e Restauração, ligados por corredores. Use as abas para focar uma zona, setas para mover a câmera, mais e menos para zoom. A lista Zonas e melhorias oferece navegação por teclado e leitura textual.';
 canvas.setAttribute('aria-label','Mapa isométrico da empresa: Escritório, Produção, Atendimento e Restauração em um piso contínuo.');canvas.setAttribute('aria-describedby',description.id);canvas.after(description);
 const link=document.createElement('button');link.type='button';link.className='world-access-link pm-sr';link.textContent='Abrir alternativa textual: Zonas e melhorias';description.after(link);
 const menu=document.createElement('button');menu.type='button';menu.dataset.company='zones';menu.textContent='Zonas e melhorias';root.querySelector('.living-menu-actions').append(menu);
 function markup(){
  const state=getState(),agenda=routines(state),people=roster(state),format=n=>n.toLocaleString('pt-BR',{maximumFractionDigits:1});
  return `<p>Leitura da semana ${state.week}. Indicadores fictícios, não diagnósticos. As ações abrem o painel da zona com as opções de melhoria e valores atuais.</p><button type="button" data-world-refresh>Atualizar leitura</button><section class="world-team-agenda"><h3>Agenda da equipe · semana ${state.week}</h3><p>Conversas breves entre colegas do mesmo setor e uma reunião semanal no pátio com cada gerente ativo. Pausas e benefícios temporários continuam separados de salário e aportes.</p><ul>${SECTORS.filter(z=>!z.rest).map(z=>{const rows=agenda.filter(r=>r.sid===z.id),event=rows[0]?.agenda.find(e=>e.kind==='meeting');if(!event)return `<li><b>${esc(z.name)}</b>: reunião não agendada, sem gerente ativo.</li>`;const date=new Date(state.calendarEpochMs+event.start/RULES.weekMs*7*86400000).toLocaleString('pt-BR',{timeZone:'UTC',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});return `<li><b>${esc(z.name)}</b>: ${esc(people.find(p=>p.id===event.managerId)?.name||'Gerente')} e ${rows.length-1} colegas · ${date} · pátio.</li>`;}).join('')}</ul></section>${SECTORS.map((s,i)=>{
   const index=metrics(state,s.id).index,status=sectorStatus(index),factors=values(state,s.id);
   return `<section class="world-access-zone"><h3>${status.symbol} ${esc(s.name)} · ${status.text} · ${format(index)}/100</h3><p>${esc(s.description)}</p><dl>${FACTORS.map(f=>`<div><dt>${esc(f.name)}</dt><dd>${format(factors[f.id])}/100</dd></div>`).join('')}</dl><button type="button" data-world-zone="${i}">Examinar e melhorar ${esc(s.name)}</button><details><summary>Níveis e próximas melhorias de ${esc(s.name)}</summary><table><caption>Melhorias de ${esc(s.name)} · créditos fictícios</caption><thead><tr><th scope="col">Melhoria</th><th scope="col">Nível</th><th scope="col">Próximo nível</th></tr></thead><tbody>${ITEMS.filter(c=>c.rest===s.rest).map(c=>{const n=level(state,s.id,c.id),q=quote(state,s.id,c.id);return `<tr><th scope="row">${esc(c.name)}</th><td>${n}/3</td><td>${q.ok?format(q.cost)+' créditos'+(q.affordable?'':' · saldo insuficiente'):'Máximo adquirido'}</td></tr>`;}).join('')}</tbody></table></details></section>`;
  }).join('')}`;
 }
 function open(event){
  const opener=event?.currentTarget||link;let selected=false;
  menu.closest('details')?.removeAttribute('open');if(current?.open)return;
  const d=showDialog('Zonas e melhorias',markup());current=d;d.classList.add('world-access-dialog');d.setAttribute('aria-label','Zonas e melhorias');
  const title=d.querySelector('h2');title.tabIndex=-1;title.focus();
  d.addEventListener('close',()=>{current=null;if(selected)canvas.focus({preventScroll:true});else{const target=opener===link?link:root.querySelector('.hud-v2-menu-button')||root.querySelector('.living-more summary');target?.focus({preventScroll:true});}},{once:true});
  d.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;
   if(button.hasAttribute('data-world-refresh')){d.querySelector('.modal-content').innerHTML=markup();d.querySelector('[data-world-refresh]').focus();}
   else if(button.hasAttribute('data-world-zone')){const i=Number(button.dataset.worldZone);if(SECTORS[i]){selected=true;d.close();focusZone(i);}}
  });
 }
 link.onclick=open;menu.onclick=open;
 return {open};
}
