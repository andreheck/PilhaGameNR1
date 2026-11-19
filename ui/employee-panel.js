import {EMPLOYEES} from '../data/continuous/employees.js';
import {employeeInfluences} from '../simulation/employee-influences.js';
import {influencesMarkup} from './employee-influences.js';
import {NPC_PROFILES} from '../data/continuous/npc-profiles.js';
import {staffView} from '../simulation/company-living.js';
import {HEALTH_NOTE} from '../data/continuous/employees.js';
import {SECTORS} from '../data/continuous/catalog.js';
import {escapeHtml as esc} from './hero-neon.js';import {tone} from './living-audio.js';
import {employeePortrait,employeeScoreBand} from './employee-portraits.js';
import {employeeDialogue} from '../simulation/employee-dialogue.js';
const sector=id=>SECTORS.find(s=>s.id===id)?.name||id,color=h=>h>=70?'#4fce9b':h>=45?'#ffd166':'#fa6988';
function svgAvatar(p){return `<svg class="employee-avatar" viewBox="0 0 64 72" role="img" aria-label="${esc(p.name)}"><rect width="64" height="72" rx="14" fill="#132b4c"/><path d="M8 72V55Q8 42 32 42T56 55V72" fill="${p.shirt}"/><path d="M26 40v9q6 7 12 0v-9" fill="${p.skin}"/><ellipse cx="32" cy="27" rx="15" ry="19" fill="${p.skin}"/><path d="M17 28q-6-27 15-25 22-2 15 26v-12q-15 5-25-2z" fill="${p.hair}"/>${p.hairStyle===3?'<path d="M13 37Q2 14 18 7 30-4 45 8q18 5 7 30l-5-17-6-9-20 9-3 16" fill="'+p.hair+'"/>':''}<circle cx="26" cy="28" r="1.5" fill="#25202b"/><circle cx="38" cy="28" r="1.5" fill="#25202b"/><path d="M28 37q4 3 8 0" fill="none" stroke="#57362d" stroke-width="1.5"/></svg>`;}
export function avatar(p,{packaged=false}={}) {
  const portrait = employeePortrait(p,{packaged});
  if (!portrait) return svgAvatar(p);
  const isHired=['active','onboarding','leave'].includes(p.employment);
  const band=!packaged&&isHired&&Number.isFinite(Number(p.health))?employeeScoreBand(p.health):null;
  const description=packaged?`Embalagem colecionável de ${p.name}`:band?`Retrato de ${p.name}, expressão visual da faixa ${band} de saúde simulada`:`Retrato de ${p.name}`;
  return `<span class="employee-avatar employee-avatar--art${packaged?' employee-avatar--package':''}" data-npc-id="${esc(p.id)}"${band?` data-score-band="${esc(band)}"`:''}>
    <img data-npc-art src="${esc(portrait)}" alt="${esc(description)}" loading="lazy" decoding="async">
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

function lifeWheel(values){
  const cx=76,cy=72,r=53,n=values.length||6,point=(i,scale)=>{const a=(-Math.PI/2)+(i*2*Math.PI/n),v=values[i]?.value??0,rr=r*scale*(v/100);return [cx+Math.cos(a)*rr,cy+Math.sin(a)*rr];},coord=(i,scale)=>{const a=(-Math.PI/2)+(i*2*Math.PI/n);return [cx+Math.cos(a)*r*scale,cy+Math.sin(a)*r*scale];},poly=(scale)=>Array.from({length:n},(_,i)=>coord(i,scale).map(v=>v.toFixed(1)).join(',')).join(' '),data=values.map((_,i)=>point(i,1).map(v=>v.toFixed(1)).join(',')).join(' ');
  return `<div class="employee-wheel" aria-label="Roda de fatores do setor"><svg viewBox="0 0 152 144" role="img" aria-label="Gráfico radial dos seis fatores psicossociais do setor; escala de zero a cem"><polygon points="${poly(1)}" class="employee-wheel-grid"/><polygon points="${poly(.66)}" class="employee-wheel-grid"/><polygon points="${poly(.33)}" class="employee-wheel-grid"/>${values.map((v,i)=>{const q=coord(i,1);return `<line x1="${cx}" y1="${cy}" x2="${q[0]}" y2="${q[1]}" class="employee-wheel-axis"/>`;}).join('')}<polygon points="${data}" class="employee-wheel-area"/>${values.map((v,i)=>{const q=point(i,1);return `<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="${esc(v.color)}" stroke="#08192c" stroke-width="1.5"/>`;}).join('')}</svg><div class="employee-wheel-legend">${values.map(v=>`<span style="--factor:${esc(v.color)}"><i></i>${esc(v.name)} <b>${Math.round(v.value)}</b></span>`).join('')}</div><small class="employee-wheel-note">Fatores do setor · 0–100</small></div>`;
}

function profileMarkup(p,influences,tab,state){
  const tabs=[['summary','Resumo'],['influences','Influências'],['organization','Organização'],['narrative','Perfil']];
  const reportsTo=p.organization.reportsTo==='conselho'?'Conselho administrativo':EMPLOYEES.find(e=>e.id===p.organization.reportsTo)?.name||'Gestão do setor';
  const fields=[['Cargo',p.organization.position],['Nível',p.organization.rankName],['Responde a',reportsTo],['Setor de origem',sector(p.home)],['Local atual',sector(p.current)],['Atividade',p.activity+(p.space?' · '+p.space:'')],['Estresse do contexto',p.stress.toFixed(1)+'% (setor)'],['Efeito da gestão',p.leadership?'Semana '+p.leadership.week+': '+(p.leadership.delta>0?'+':'')+p.leadership.delta.toFixed(1)+' saúde (saldo aplicado)':'Regra avaliada no próximo fechamento semanal']];
  let panel='';
  if(tab==='summary')panel=`<div class="employee-quick-stats"><article><small>Saúde de base</small><b>${p.baseHealth}<i>/100</i></b></article><article><small>Variação semanal</small><b class="${p.delta<0?'is-negative':'is-positive'}">${p.delta>0?'+':''}${p.delta.toLocaleString('pt-BR')}<i> pts</i></b></article><article><small>Ritmo de caminhada</small><b>${p.healthSlowed?'40% mais lento':'×'+p.walkingFactor.toFixed(2)}<i>${p.healthSlowed?' saúde base abaixo de 55':' ritmo individual'}</i></b></article><article><small>Estado atual</small><b>${esc(p.status)}</b></article></div><section class="employee-context"><h3>Condições a acompanhar</h3><p>${esc(p.risks.join('. ')||'Condições favoráveis: manter acompanhamento')}.</p><p>Os indicadores são simulados e respondem ao contexto do setor, pausas e melhorias. Personalidade não determina saúde ou doença.</p></section><section class="employee-local-exposure"><h3>Condições locais · ${esc(p.localExposures.group)}</h3><div>${p.localExposures.risks.map(r=>`<article><span>${esc(r.name)}</span><b>${r.score}/100 · ${esc(r.status)}</b></article>`).join('')}</div><small>Sinal de jogo estimado pelos fatores do setor; não representa medição ambiental real.</small></section>`;
  if(tab==='influences')panel=`${influencesMarkup(influences)}<section class="employee-extra"><h3>Benefício individual</h3><p>${p.temporaryBonus?'Pausa e convívio: +'+p.temporaryBonus.toFixed(1)+' de saúde temporária neste ciclo.':'Nenhum bônus temporário de pausa ativo.'}</p><p>${p.chairBonus?p.chairBonus.name+' em uso: +'+p.chairBonus.healthBonus+' de saúde temporária.':p.chair?'Cadeira designada: '+esc(p.chair.name)+'. O bônus vale durante o uso.':'Nenhuma cadeira individual designada.'}</p></section>`;
  if(tab==='organization')panel=`<dl class="employee-fields">${fields.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><section class="employee-context"><h3>Hierarquia</h3><p>${esc(p.organization.position)} · ${esc(p.organization.rankName)} em ${esc(sector(p.home))}, com reporte para ${esc(reportsTo)}.</p></section>`;
  if(tab==='narrative')panel=narrative(p)+`<section class="employee-context"><h3>Condições a acompanhar</h3><p>${esc(p.risks.join('. ')||'Condições favoráveis: manter acompanhamento')}.</p><p>O perfil narrativo não altera os indicadores simulados.</p></section>`;
  const dialogue=employeeDialogue(p,state||p.state),currentLine=dialogue.lines[dialogue.selected];
  return `<button class="employee-back" data-employee-list>← Lista de funcionários</button><section class="employee-profile-hero" style="--ec:${color(p.health)}"><div class="employee-profile-head"><div class="employee-profile-identity">${avatar(p)}<div><small>${esc(p.id)} · ${esc(p.type)}</small><h2 tabindex="-1">${esc(p.name)}</h2><p>${esc(p.archetype)}${p.age?' · '+p.age+' anos':''}</p></div></div><strong class="employee-profile-score">${p.health}<small>/100</small><span>Saúde simulada</span></strong></div>${lifeWheel(influences.conditions)}</section><section class="employee-dialogue" aria-label="Conversa com ${esc(p.name)}"><div class="employee-dialogue__bubble"><small>${esc(p.name)} · ${p.health>=70?'bem-estar':p.health>=45?'em acompanhamento':'precisa de escuta'}</small><p>${esc(currentLine)}</p></div>${p.lastExplorerLine?`<div class="employee-dialogue__player"><small>Você respondeu</small><p>${esc(p.lastExplorerLine)}</p></div>`:''}<div class="employee-dialogue__choices"><small>Como você responde?</small>${dialogue.options.map(o=>`<button type="button" data-employee-dialogue="${esc(o.id)}" ${p.employment!=='active'||p.dialogueUsedThisWeek?'disabled':''}>${esc(o.text)}</button>`).join('')}</div>${p.employment!=='active'?'<small class="employee-dialogue__limit">As conversas de apoio estão disponíveis para funcionários ativos.</small>':p.dialogueUsedThisWeek?'<small class="employee-dialogue__limit">Conversa registrada nesta semana. Você poderá conversar novamente na próxima.</small>':''}</section><nav class="employee-profile-tabs" role="tablist" aria-label="Informações de ${esc(p.name)}">${tabs.map(([id,label])=>`<button type="button" role="tab" id="employee-tab-${id}" aria-controls="employee-panel-tab" aria-selected="${tab===id}" tabindex="${tab===id?'0':'-1'}" data-profile-tab="${id}">${esc(label)}</button>`).join('')}</nav><section class="employee-profile-panel" id="employee-panel-tab" role="tabpanel" aria-labelledby="employee-tab-${tab}" tabindex="0">${panel}</section><button class="employee-locate" data-employee-locate="${esc(p.id)}">Localizar no mapa ↗</button><p class="employee-note">${HEALTH_NOTE}</p>`;
}

export function createEmployeePanel(getState,onLocate,getLiveActors=()=>[],onDialogue=async()=>{}){let dialog=null,selected=null,profileTab='summary',paintedSignature=null;
function paint(){if(!dialog?.open)return;const content=dialog.querySelector('.employee-content'),top=content.scrollTop,focused=document.activeElement?.dataset?.employee,focusedHeading=document.activeElement?.matches?.('.employee-profile-head h2'),focusAction=document.activeElement?.hasAttribute('data-employee-locate')?'[data-employee-locate]':document.activeElement?.hasAttribute('data-employee-list')?'[data-employee-list]':null,state=getState(),rows=staffView(state,getLiveActors()),p=rows.find(p=>p.id===selected),influences=p?employeeInfluences(state,p):null;if(p)p.state=state;
const signature=JSON.stringify([selected,p||rows,influences,state?.events?.current]);if(signature===paintedSignature)return;paintedSignature=signature;
content.innerHTML=p?profileMarkup(p,influences,profileTab):`<p class="employee-intro">16 funcionários · do mais saudável ao menos saudável na simulação. Clique para consultar a ficha.</p><ol class="employee-list">${rows.map((p,i)=>`<li><button class="employee-row" data-employee="${p.id}" data-health="${p.health}" style="--ec:${color(p.health)}"><span class="employee-rank">${String(i+1).padStart(2,'0')}</span>${avatar(p)}<span class="employee-info"><strong>${esc(p.name)} <small>${esc(p.archetype)}</small></strong><span>${esc(sector(p.home))} · ${esc(p.organization.position)} · ${esc(p.activity)}</span></span><span class="employee-score"><b>${p.health}<small>/100</small></b><meter min="0" max="100" value="${p.health}" aria-label="Saúde simulada de ${esc(p.name)}"></meter><small>${esc(p.status)}</small></span><span aria-hidden="true">›</span></button></li>`).join('')}</ol><p class="employee-note">${HEALTH_NOTE}</p>`;content.scrollTop=top;if(focusedHeading)content.querySelector('.employee-profile-head h2')?.focus({preventScroll:true});if(focusAction)content.querySelector(focusAction)?.focus({preventScroll:true});if(focused)content.querySelector(`[data-employee="${focused}"]`)?.focus({preventScroll:true});}
function open(id=null){selected=id;profileTab='summary';tone('select');if(!dialog){paintedSignature=null;dialog=document.createElement('dialog');dialog.className='employees-dialog';dialog.setAttribute('aria-label','Lista de funcionários');dialog.innerHTML='<header><div><small>PILHA+ · PESSOAS</small><h1>Lista de funcionários</h1></div><button data-employee-close aria-label="Fechar lista de funcionários">×</button></header><div class="employee-content"></div>';document.body.append(dialog);const source=document.activeElement;dialog.addEventListener('close',()=>{dialog.remove();dialog=null;if(source?.isConnected)source.focus({preventScroll:true});},{once:true});dialog.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-employee-close'))dialog.close();else if(b.dataset.profileTab){profileTab=b.dataset.profileTab;paintedSignature=null;paint();dialog.querySelector('[data-profile-tab="'+profileTab+'"]')?.focus({preventScroll:true});}else if(b.hasAttribute('data-employee-list')){const previous=selected;selected=null;profileTab='summary';paint();dialog.querySelector(`[data-employee="${previous}"]`)?.focus({preventScroll:true});}else if(b.dataset.employee){selected=b.dataset.employee;profileTab='summary';paint();dialog.querySelector('.employee-content').scrollTop=0;dialog.querySelector('.employee-profile-head h2')?.focus({preventScroll:true});}else if(b.dataset.employeeLocate){onLocate?.(b.dataset.employeeLocate);dialog.close();}});dialog.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||!e.target.matches('[data-profile-tab]'))return;e.preventDefault();const ids=['summary','influences','organization','narrative'],i=ids.indexOf(profileTab),next=e.key==='Home'?0:e.key==='End'?ids.length-1:(i+(e.key==='ArrowRight'?1:-1)+ids.length)%ids.length;profileTab=ids[next];paintedSignature=null;paint();dialog.querySelector('[data-profile-tab="'+profileTab+'"]')?.focus({preventScroll:true});});dialog.addEventListener("click",async e=>{const b=e.target.closest("[data-employee-dialogue]");if(!b||!selected)return;b.disabled=true;await onDialogue(selected,b.dataset.employeeDialogue);paintedSignature=null;paint();});dialog.showModal();}paint();dialog.querySelector('.employee-content').scrollTop=0;if(id)dialog.querySelector('.employee-profile-head h2')?.focus({preventScroll:true});}
return {open,refresh:paint};}
