import {RULES,SECTORS} from '../data/continuous/catalog.js';
import {company,metrics} from '../simulation/company-continuous.js';
import {weeklyIncomeQuote} from '../simulation/weekly-income.js';
import {readHudPreferences,writeHudPreferences} from '../simulation/hud-preferences.js';
import {EVENT_CATALOG} from '../simulation/event-catalog.js';
import {escapeHtml as esc} from './hero-neon.js';

export const hudEnabled=search=>new URLSearchParams(search).get('hud')==='v2';
export const sectorStatus=index=>index<40?{symbol:'■',text:'Crítico'}:index<65?{symbol:'▲',text:'Atenção'}:{symbol:'●',text:'Estável'};
const shortName=id=>({'PILHA-H01':'Diretor','PILHA-H02':'Psicóloga','PILHA-H03':'Dados & IA','PILHA-H04':'Eng. Segurança','PILHA-H05':'P&D Tech','PILHA-H06':'RS & TD'}[id]);
const money=n=>n.toLocaleString('pt-BR',{maximumFractionDigits:0});

/** Reparent existing controls. Their handlers and data-company hooks stay intact.
 * Continuous mode does not execute the legacy ability timeline: no fake cooldown.
 */
export function installHudV2({root,getState,getHeroes,storage,openCalendar,openHero,search=location.search}){
 if(!hudEnabled(search))return {update(){},destroy(){}};
 const link=document.createElement('link');link.rel='stylesheet';link.href='/ui/hud-v2.css';document.head.append(link);
 root.classList.add('hud-v2');
 const top=root.querySelector('.living-topbar'),tools=root.querySelector('.continuous-tools');
 const actions=tools.querySelector('.living-menu-actions'),pause=tools.querySelector('[data-company=pause]'),advance=tools.querySelector('[data-company=advance]'),alert=tools.querySelector('[data-company=event]');
 const balance=root.querySelector('.pm-balance'),goal=root.querySelector('.pm-goal'),clock=root.querySelector('.living-clock-holder'),tabs=root.querySelector('.pm-tabs'),replay=root.querySelector('.pm-replay');
 let preferences=readHudPreferences(storage),teamSignature='',week=getState().week,previousBudget=getState().budget,eventSerial=getState().events.current?.serial;
 const create=(tag,cls,html='')=>{const el=document.createElement(tag);el.className=cls;el.innerHTML=html;return el;};
 const bar=create('div','hud-v2-bar');bar.setAttribute('role','group');bar.setAttribute('aria-label','Controles principais');
 const mark=create('span','hud-v2-mark','<b>PilhA+ Game</b><small></small>');
 const menuButton=create('button','hud-v2-menu-button','☰ <span>Menu</span>');menuButton.type='button';menuButton.setAttribute('aria-haspopup','dialog');menuButton.setAttribute('aria-label','Abrir menu da empresa');
 const band=create('div','hud-v2-band'),duo=create('div','hud-v2-duo');duo.setAttribute('role','group');duo.setAttribute('aria-label','Dupla de conselheiros');band.append(duo,alert);
 const nav=create('div','hud-v2-navigation'),toggle=create('button','hud-v2-details','⌃');toggle.type='button';toggle.setAttribute('aria-label','Recolher detalhes da dupla');nav.append(tabs,toggle);
 const menu=create('dialog','hud-v2-menu');menu.setAttribute('aria-labelledby','hud-v2-menu-title');menu.id='hud-v2-menu';menuButton.setAttribute('aria-controls',menu.id);
 menu.innerHTML='<header><h2 id="hud-v2-menu-title">Sua empresa</h2><button type="button" data-hud-close aria-label="Fechar menu">×</button></header><div class="hud-v2-menu-items"></div><section class="hud-v2-help"><h3>Ajuda e atalhos</h3><p>Espaço: pausar ou retomar · N: avançar semana · M: menu · H: heróis · ?: ajuda · Esc: fechar.</p><label><input type="checkbox" data-hud-shortcuts> Ativar atalhos de uma tecla</label><p>Os atalhos ficam desativados em campos de texto e durante diálogos.</p><p>Os poderes individuais ainda não são executados neste modo. A sinergia experimental da dupla aplica-se às novas compras compatíveis.</p><p data-hud-preference-status role="status"></p></section>';
 const menuItems=menu.querySelector('.hud-v2-menu-items');menuItems.append(actions);
 const calendar=create('button','','▦ Calendário');calendar.type='button';calendar.onclick=()=>{menu.close();openCalendar();};
 const help=create('button','','? Ajuda e atalhos');help.type='button';help.onclick=()=>menu.querySelector('[data-hud-shortcuts]').focus();
 menuItems.append(calendar);if(replay)menuItems.append(replay);menuItems.append(help);
 const live=create('p','hud-v2-sr');live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 const critical=create('p','hud-v2-sr');critical.setAttribute('role','alert');
 const delta=create('small','hud-v2-income');delta.setAttribute('role','group');balance.append(delta);balance.setAttribute('role','group');balance.setAttribute('aria-label','Saldo fictício');balance.removeAttribute('aria-live');
 bar.append(menuButton,mark,clock,balance,goal,pause,advance);
 tools.replaceChildren(bar,band,nav,menu,live,critical);top.append(tools);
 pause.classList.add('hud-v2-pause');advance.classList.add('hud-v2-advance');
 const openMenu=()=>{if(!menu.open){menu.showModal();menu.querySelector('[data-hud-close]').focus();}};
 menuButton.onclick=openMenu;menu.querySelector('[data-hud-close]').onclick=()=>menu.close();
 menu.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))menuButton.focus({preventScroll:true});});
 menu.addEventListener('keydown',event=>{if(event.key==='Escape')event.stopPropagation();});
 menu.addEventListener('click',event=>{if(event.target.closest('[data-company],.pm-replay'))menu.close();});
 function savePreferences(){
  menu.querySelector('[data-hud-preference-status]').textContent=writeHudPreferences(storage,preferences)?'Preferência salva.':'Preferência aplicada nesta sessão; não foi possível salvar neste navegador.';
 }
 const shortcuts=menu.querySelector('[data-hud-shortcuts]');shortcuts.checked=preferences.shortcuts;
 shortcuts.onchange=()=>{preferences={...preferences,shortcuts:shortcuts.checked};savePreferences();};
 toggle.onclick=()=>{preferences={...preferences,expanded:!preferences.expanded};savePreferences();update();};
 function keydown(event){
  if(!preferences.shortcuts||event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.defaultPrevented||document.querySelector('dialog[open],.pi-root'))return;
  if(event.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable=false])'))return;
  const actions={' ':()=>pause.click(),n:()=>advance.click(),m:openMenu,h:()=>tools.querySelector('[data-company=heroes]').click(),'?':()=>{openMenu();shortcuts.focus();}};
  const action=actions[event.key.toLowerCase()];if(action){event.preventDefault();event.stopImmediatePropagation();action();}
 }
 document.addEventListener('keydown',keydown,true);
 function update(){
  const state=getState(),q=weeklyIncomeQuote(state),index=Math.round(company(state));
  const set=(el,text)=>{if(el.textContent!==text)el.textContent=text;};
  set(mark.querySelector('small'),'Semana '+state.week);
  pause.setAttribute('aria-label',state.paused?'Retomar jogo':'Pausar jogo');set(pause,state.paused?'▶ Retomar':'Ⅱ Pausar');
  advance.setAttribute('aria-label','Avançar uma semana simulada');set(advance,'▶ Semana');
  const contribution='+'+(q.total>=1000?money(q.total/1000)+'mil':money(q.total));
  if(delta.dataset.value!==contribution){delta.replaceChildren(create('span','',contribution),document.createElement('wbr'),create('span','','/sem'));delta.dataset.value=contribution;}
  delta.setAttribute('aria-label','Próximo aporte semanal: '+money(q.total)+' créditos fictícios. Não representa lucro ou variação líquida.');
  goal.querySelector('.pm-goal__v').dataset.goal=String(RULES.companyGoal);set(goal.querySelector('.pm-goal__top span'),'Índice · meta '+RULES.companyGoal);
  goal.setAttribute('role','group');goal.setAttribute('aria-label','Índice da empresa '+index+' de 100; meta '+RULES.companyGoal);
  root.classList.toggle('hud-v2-collapsed',!preferences.expanded);toggle.setAttribute('aria-expanded',String(preferences.expanded));toggle.setAttribute('aria-label',preferences.expanded?'Recolher detalhes da dupla':'Expandir detalhes da dupla');set(toggle,preferences.expanded?'⌃':'⌄');
  const signature=JSON.stringify(state.team);if(signature!==teamSignature){teamSignature=signature;const heroes=getHeroes();duo.replaceChildren();
   for(const [role,label] of [['principal','Principal'],['support','Apoio']]){const h=heroes.find(h=>h.id===state.team?.[role]);if(!h)continue;
    const b=create('button','hud-v2-hero',`<span class="hud-v2-avatar"><img src="${esc(h.img)}" alt=""></span><span><b>${esc(shortName(h.id)||h.nome)}</b><small>${label}</small><small class="hud-v2-power">○ Em breve</small></span>`);
    b.type='button';b.setAttribute('aria-label',`${h.nome}, ${label.toLowerCase()}. Poder individual ainda não disponível neste modo. Abrir ficha.`);b.onclick=()=>openHero(h.id);duo.append(b);
   }
  }
  tabs.querySelectorAll('[data-i]').forEach(button=>{const id=Number(button.dataset.i),sector=SECTORS[id];if(!sector)return;
   const score=metrics(state,sector.id).index,value=Math.round(score),status=sectorStatus(score);let label=button.querySelector('[data-hud-sector-state]');
   if(!label){label=document.createElement('span');label.dataset.hudSectorState='';button.append(label);}set(label,' · '+status.text);
   const icon=button.querySelector('i');if(icon)set(icon,status.symbol);
   button.setAttribute('aria-label',`${sector.name}, ${value} de 100, ${status.text}`);
  });
  const current=state.events.current;alert.setAttribute('aria-label',current?'Uma ocorrência pendente. Abrir detalhes.':'Nenhuma ocorrência pendente');set(alert,current?.stage==='result'?'✓ Resultado':'⚠ 1 alerta');
  if(state.week!==week){set(live,`Semana ${state.week}. Saldo ${money(state.budget)} créditos; variação desde a última semana observada ${money(state.budget-previousBudget)}. Índice ${index}, meta ${RULES.companyGoal}.`);week=state.week;previousBudget=state.budget;}
  if(current?.serial!==eventSerial){eventSerial=current?.serial;if(current){const text='Nova ocorrência: '+EVENT_CATALOG.BY[current.id].n;set(EVENT_CATALOG.BY[current.id].sev==='crit'?critical:live,text);}}
 }
 update();
 return {update,destroy(){document.removeEventListener('keydown',keydown,true);menu.remove();link.remove();}};
}
