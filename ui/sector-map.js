import {mountAdverseEvents} from './adverse-events.js';
import {UPGRADES} from '../simulation/investment.js';
import {AXIS_LABELS} from '../simulation/mission-timeline.js';
import {CASES} from '../cases-data.js';
import {SECTOR_CASES,mapSnapshot,purchaseMapUpgrade} from './sector-model.js';
import {motionPreference} from './company-visuals.js';

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n.toLocaleString('pt-BR');
export function mountSectorMap({host,panel,campaign,caseId,onPurchase,openView,chooseCase,message,pause,resume}){
  const container=document.createElement('section');
  container.className='sector-map';
  container.setAttribute('aria-label','Escritório, Produção e Atendimento');
  host.append(container);
  let map,lastTrigger=null;
  // Native dialog gives the existing case UI focus containment and Escape support.
  const tools=document.createElement('dialog');
  tools.className='sector-tools';
  tools.setAttribute('aria-label','Missões e recursos do acionista');
  tools.innerHTML='<div class="sector-tools-head"><strong>Central do acionista</strong><button type="button" aria-label="Voltar ao mapa">Voltar ao mapa ×</button></div>';
  document.body.append(tools);tools.append(panel);
  // Keep the optional story inside the current modal's top layer.
  const story=document.getElementById('welcome-alert');
  if(story)tools.append(story);
  tools.querySelector('button').onclick=()=>tools.close();
  tools.addEventListener('close',()=>lastTrigger?.isConnected&&lastTrigger.focus());
  const openTools=()=>{if(!tools.open){lastTrigger=document.activeElement;tools.showModal();}};
  const read=()=>mapSnapshot(localStorage,campaign(),caseId());
  const model={
    read,
    head(sector,state){
      return `<div class="pm-ph__row"><span class="pm-ph__dot"></span><h2>${esc(sector.nome)}</h2><button type="button" class="pm-x" data-act="close" aria-label="Fechar setor">×</button></div>
        <p>Observe o trabalho, escolha uma missão e acompanhe as mudanças.</p>
        <div class="pm-score"><div class="pm-ring" style="--p:${state.sharedIndex};--rc:#ffd24b"><div><b>${Math.round(state.sharedIndex)}</b><small>Índice</small></div></div>
        <div class="pm-kpis">${Object.entries(state.axes).map(([key,value])=>`<div class="pm-kpi"><small>${esc(AXIS_LABELS[key])}</small><b>${value}</b></div>`).join('')}</div></div>
        <p class="sector-note">${state.storageAvailable?'Ciclo do Caso '+esc(state.caseId)+' · índice compartilhado pela empresa. A instalação é imediata; os efeitos amadurecem no tempo.':'Armazenamento indisponível ou inválido. Compras bloqueadas; seus dados foram preservados.'}</p>`;
    },
    body(sector,state){
      const cases=SECTOR_CASES[sector.id]||[];
      return `<section class="pm-sec"><h3>Missões neste setor</h3><div class="sector-cases">${cases.map(id=>`<button class="pm-btn" type="button" data-sector-case="${id}">Caso ${id} · ${esc(CASES.find(c=>c.id===id).title)}</button>`).join('')}</div></section>
        <section class="pm-sec"><h3>Inventário da empresa <span>· saldo compartilhado com a formação</span></h3>
        <p class="sector-note">As 12 melhorias atendem à empresa inteira. A instalação muda o mobiliário e as cores do cenário; os indicadores do ciclo continuam graduais. Sinais sobre os NPCs são observações fictícias para investigar, não diagnósticos. Créditos fictícios; nenhuma cobrança.</p>
        <div class="pm-list">${UPGRADES.map((u,i)=>{
          const cost=state.prices[u.id],owned=state.owned.includes(u.id),affordable=state.balance>=cost;
          return `<article class="pm-card ${owned?'is-owned':''}">
            <div class="pm-card__ico">${String(i+1).padStart(2,'0')}</div>
            <div><h4>${esc(u.name)}</h4><p class="pm-obj">${esc(u.description)}</p></div>
            <div class="pm-card__mid"><span class="pm-chip">${owned?'Instalada · acompanhar no ciclo':'Efeito gradual · 30 dias'}</span></div>
            <div class="pm-card__buy"><span class="pm-price"><span class="pm-coin pm-coin--s"></span>${fmt(cost)}</span>
            <button type="button" class="pm-btn" data-act="buy" data-id="${u.id}" aria-disabled="${owned||!affordable}" ${owned||!affordable?'disabled':''} aria-label="${owned?'Já instalada':`Instalar ${esc(u.name)} por ${fmt(cost)} créditos`}">${owned?'Instalada ✓':affordable?'Instalar':'Faltam '+fmt(cost-state.balance)}</button></div></article>`;
        }).join('')}</div><p class="sector-note">Índices sintéticos para aprendizagem. Não são previsões de saúde, probabilidades ou comprovação de conformidade.</p></section>`;
    },
    async buy(id){
      const result=await purchaseMapUpgrade(localStorage,id);
      if(result.ok){
        onPurchase(id);
        document.dispatchEvent(new CustomEvent('pilha:progression-changed'));
        return {ok:true,message:`${UPGRADES.find(u=>u.id===id).name}. Inventário compartilhado atualizado; acompanhe os efeitos em Habilidades e ciclo.`};
      }
      return {ok:false,message:result.error==='already-installed'?'Esta melhoria já está instalada.':result.error==='insufficient-budget'?'O saldo mudou. Confira o orçamento disponível.':'Não foi possível salvar. Saldo e inventário preservados.'};
    }
  };
  map=window.PilhaMapa.mount({
    container,model,
    onReplayIntro:()=>{map.iso.stop();const game=document.getElementById('game');game.inert=true;window.PilhaIntro.mount({role:'Acionista',ctaLabel:'Voltar à empresa',onStart:()=>{game.inert=false;applyMotion();map.root.querySelector('canvas').focus();}});}
  });
  const help=document.createElement('p');help.id='sector-map-help';help.className='pm-sr';
  help.textContent='Com foco no mapa: setas movem a câmera; mais e menos alteram o zoom; 0 enquadra a empresa; 1, 2 e 3 selecionam os setores; Escape volta ao mapa. Os botões de setor oferecem acesso equivalente por teclado.';
  container.append(help);map.root.querySelector('canvas').setAttribute('aria-describedby',help.id);
  map.root.addEventListener('click',e=>{
    const button=e.target.closest('[data-sector-case]');
    if(button){chooseCase(button.dataset.sectorCase);openTools();}
  });
  const actions=document.createElement('nav');
  actions.className='sector-actions';actions.setAttribute('aria-label','Ações do acionista');
  actions.innerHTML=[['casos','Missões'],['equipe','Equipe'],['investimentos','Inventário'],['biblioteca','Biblioteca'],['progresso','Progresso']].map(([key,label])=>`<button type="button" data-sector-view="${key}">${label}</button>`).join('');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton=document.createElement('button');motionButton.type='button';actions.append(motionButton);
  function applyMotion(){const reduced=motionPreference(localStorage,motion.matches);map.setMotion(reduced);document.body.dataset.pilhaMotion=reduced?'reduced':'on';motionButton.textContent=reduced?'Movimento reduzido · ativar':'Pessoas em movimento · pausar';motionButton.setAttribute('aria-pressed',String(!reduced));motionButton.title='Preferência de animação somente deste jogo. O padrão acompanha o sistema.';}
  motionButton.addEventListener('click',()=>{const next=map.root.dataset.motion==='reduced'?'on':'off';try{localStorage.setItem('pilha-motion-v1',next);}catch{message('Preferência aplicada apenas nesta sessão.');map.setMotion(next==='off');return;}applyMotion();});
  motion.addEventListener('change',applyMotion);applyMotion();
  Promise.all(['operadora','mentor','mentora'].map(key=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src='/assets/npc-sprites/'+key+'.png';}))).then(sheets=>{if(container.isConnected)map.iso.setNpcSheets(sheets.filter(Boolean));});
  actions.addEventListener('click',e=>{const b=e.target.closest('[data-sector-view]');if(b){openView(b.dataset.sectorView);}});
  container.prepend(actions);
  const eventUI=mountAdverseEvents({actions,campaign,pause,resume,refresh:()=>map.refresh(),message});
  const refresh=()=>map.refresh();
  const interval=setInterval(refresh,1000);
  window.addEventListener('storage',refresh);
  document.addEventListener('pilha:progression-changed',refresh);
  return {refresh,openTools,dispose(){eventUI.dispose();clearInterval(interval);motion.removeEventListener('change',applyMotion);window.removeEventListener('storage',refresh);document.removeEventListener('pilha:progression-changed',refresh);map.destroy();if(story)document.body.append(story);document.querySelector('#main').append(panel);tools.remove();container.remove();}};
}
