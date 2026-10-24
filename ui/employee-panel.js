import {NPC_PROFILES} from '../data/continuous/npc-profiles.js';
import {staffView} from '../simulation/company-living.js';
import {HEALTH_NOTE} from '../data/continuous/employees.js';
import {SECTORS} from '../data/continuous/catalog.js';
import {escapeHtml as esc} from './hero-neon.js';import {tone} from './living-audio.js';
const sector=id=>SECTORS.find(s=>s.id===id)?.name||id,color=h=>h>=70?'#4fce9b':h>=45?'#ffd166':'#fa6988';
function svgAvatar(p){return `<svg class="employee-avatar" viewBox="0 0 64 72" role="img" aria-label="${esc(p.name)}"><rect width="64" height="72" rx="14" fill="#132b4c"/><path d="M8 72V55Q8 42 32 42T56 55V72" fill="${p.shirt}"/><path d="M26 40v9q6 7 12 0v-9" fill="${p.skin}"/><ellipse cx="32" cy="27" rx="15" ry="19" fill="${p.skin}"/><path d="M17 28q-6-27 15-25 22-2 15 26v-12q-15 5-25-2z" fill="${p.hair}"/>${p.hairStyle===3?'<path d="M13 37Q2 14 18 7 30-4 45 8q18 5 7 30l-5-17-6-9-20 9-3 16" fill="'+p.hair+'"/>':''}<circle cx="26" cy="28" r="1.5" fill="#25202b"/><circle cx="38" cy="28" r="1.5" fill="#25202b"/><path d="M28 37q4 3 8 0" fill="none" stroke="#57362d" stroke-width="1.5"/></svg>`;}
export function avatar(p) {
  const portrait = p.portrait ?? p.profile?.portrait ?? null;
  if (!portrait) return svgAvatar(p);
  return `<span class="employee-avatar employee-avatar--art" data-npc-id="${esc(p.id)}">
    <img data-npc-art src="${esc(portrait)}" alt="Retrato de ${esc(p.name)}" loading="lazy" decoding="async">
    <span class="employee-avatar-fallback" aria-hidden="true">${svgAvatar(p)}</span>
  </span>`;
}

// Instalar uma vez no navegador para lidar com 404 ou imagem inválida.
if (typeof document !== 'undefined') {
  document.addEventListener('error', (e) => {
    if (!e.target?.isConnected || !e.target.matches?.('img[data-npc-art]')) return;
    e.target.closest('.employee-avatar--art')?.classList.add('is-missing');
    const img=e.target,src=img.getAttribute('src');
    if(!img.dataset.npcRetry){img.dataset.npcRetry='1';setTimeout(()=>{if(img.isConnected&&!img.naturalWidth)img.src=src;},750);}
  }, true);
  document.addEventListener('load',e=>{if(e.target?.matches?.('img[data-npc-art]'))e.target.closest('.employee-avatar--art')?.classList.remove('is-missing');if(e.target?.matches?.('img[data-npc-art]')&&e.target.naturalWidth)delete e.target.dataset.npcRetry;},true);
}

const narrativeList = (values) => Array.isArray(values) && values.length
  ? `<ul>${values.map(v => `<li>${esc(v.replaceAll('_', ' '))}</li>`).join('')}</ul>`
  : '<p>Conteúdo editorial em revisão.</p>';

function narrative(p) {
  const f = p.profile;
  if (!f) return '<p class="employee-note">Perfil narrativo em preparação.</p>';
  return `<section class="employee-traits" aria-label="Características narrativas">
    <h3>Perfil narrativo · ${esc(f.status === 'pendente_refinamento' ? 'em revisão editorial' : 'referência canônica')}</h3>
    ${f.roleLabel?`<p><b>Papel narrativo:</b> ${esc(f.roleLabel)}</p>`:''}
    ${f.summary?`<p>${esc(f.summary)}</p>`:''}
    <article><h3>Contribuições e forças</h3>${narrativeList(f.strengths)}</article>
    <article><h3>Pontos de atenção</h3>${narrativeList(f.watchouts)}</article>
    <article><h3>Condições favoráveis</h3>${narrativeList(f.favorableConditions)}</article>
    <article><h3>Contextos de risco</h3>${narrativeList(f.adverseConditions)}</article>
    <article><h3>Sinergias propostas</h3>${narrativeList(f.proposedSynergies.map(id => {
      const q = NPC_PROFILES[id]; return q ? `${q.name} (${q.type})` : id;
    }))}</article>
    <p class="employee-note">${esc(f.disclaimer)}</p>
  </section>`;
}

export function createEmployeePanel(getState,onLocate){let dialog=null,selected=null;
function paint(){if(!dialog?.open)return;const content=dialog.querySelector('.employee-content'),top=content.scrollTop,focused=document.activeElement?.dataset?.employee,focusedHeading=document.activeElement?.matches?.('.employee-profile-head h2'),focusAction=document.activeElement?.hasAttribute('data-employee-locate')?'[data-employee-locate]':document.activeElement?.hasAttribute('data-employee-list')?'[data-employee-list]':null,rows=staffView(getState()),p=rows.find(p=>p.id===selected);
content.innerHTML=p?`<button class="employee-back" data-employee-list>← Lista de funcionários</button><div class="employee-profile-head" style="--ec:${color(p.health)}">${avatar(p)}<div><small>${p.id} · ${p.type}</small><h2 tabindex="-1">${esc(p.name)}</h2><p>${esc(p.archetype)}${p.age?' · '+p.age+' anos':''}</p></div><strong class="employee-profile-score">${p.health}<small>/100</small><span>Saúde simulada</span></strong></div><dl class="employee-fields">${[['Setor de origem',sector(p.home)],['Local atual',sector(p.current)],['Atividade',p.activity+(p.space?' · '+p.space:'')],['Variação semanal',(p.delta>0?'+':'')+p.delta.toLocaleString('pt-BR')+' pontos'],['Contribuição',p.role],['Estado',p.status],...(p.strength?[['Força narrativa',p.strength]]:[])].map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${narrative(p)}<section class="employee-context"><h3>Condições a acompanhar</h3><p>${esc(p.risks.join('. ')||'Condições favoráveis: manter acompanhamento')}.</p><p>O indicador responde ao contexto do setor e à restauração. O tipo de personalidade não gera doenças ou penalidades.</p></section><button class="employee-locate" data-employee-locate="${p.id}">Localizar no mapa ↗</button><p class="employee-note">${HEALTH_NOTE}</p>`:`<p class="employee-intro">16 funcionários · do mais saudável ao menos saudável na simulação. Clique para consultar a ficha.</p><ol class="employee-list">${rows.map((p,i)=>`<li><button class="employee-row" data-employee="${p.id}" data-health="${p.health}" style="--ec:${color(p.health)}"><span class="employee-rank">${String(i+1).padStart(2,'0')}</span>${avatar(p)}<span class="employee-info"><strong>${esc(p.name)} <small>${esc(p.archetype)}</small></strong><span>${esc(sector(p.home))} · ${esc(p.activity)}</span></span><span class="employee-score"><b>${p.health}<small>/100</small></b><meter min="0" max="100" value="${p.health}" aria-label="Saúde simulada de ${esc(p.name)}"></meter><small>${esc(p.status)}</small></span><span aria-hidden="true">›</span></button></li>`).join('')}</ol><p class="employee-note">${HEALTH_NOTE}</p>`;content.scrollTop=top;if(focusedHeading)content.querySelector('.employee-profile-head h2')?.focus({preventScroll:true});if(focusAction)content.querySelector(focusAction)?.focus({preventScroll:true});if(focused)content.querySelector(`[data-employee="${focused}"]`)?.focus({preventScroll:true});}
function open(id=null){selected=id;tone('select');if(!dialog){dialog=document.createElement('dialog');dialog.className='employees-dialog';dialog.setAttribute('aria-label','Lista de funcionários');dialog.innerHTML='<header><div><small>PILHA+ · PESSOAS</small><h1>Lista de funcionários</h1></div><button data-employee-close aria-label="Fechar lista de funcionários">×</button></header><div class="employee-content"></div>';document.body.append(dialog);const source=document.activeElement;dialog.addEventListener('close',()=>{dialog.remove();dialog=null;if(source?.isConnected)source.focus({preventScroll:true});},{once:true});dialog.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-employee-close'))dialog.close();else if(b.hasAttribute('data-employee-list')){const previous=selected;selected=null;paint();dialog.querySelector(`[data-employee="${previous}"]`)?.focus({preventScroll:true});}else if(b.dataset.employee){selected=b.dataset.employee;paint();dialog.querySelector('.employee-content').scrollTop=0;dialog.querySelector('.employee-profile-head h2')?.focus({preventScroll:true});}else if(b.dataset.employeeLocate){onLocate?.(b.dataset.employeeLocate);dialog.close();}});dialog.showModal();}paint();dialog.querySelector('.employee-content').scrollTop=0;if(id)dialog.querySelector('.employee-profile-head h2')?.focus({preventScroll:true});}
return {open,refresh:paint};}
