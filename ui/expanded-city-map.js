import { EXPANDED_CITY_MAP } from '../data/continuous/expanded-city-map.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function cityArtwork() {
  return `<div class="city-map-art" data-city-art>
    <img class="city-map-fallback" src="/assets/world-expansion/platform/platform-preview.png" alt="Prévia isométrica da plataforma da cidade, com morro, lotes, avenida e orla">
    <div class="city-scene" data-city-scene></div>
    <div class="city-scene-loading" data-city-progress role="status" aria-live="polite">Carregando a cidade 3D…</div>
    <div class="city-scene-controls" aria-label="Controles da visualização"><button type="button" data-city-reset title="Centralizar câmera">Centralizar</button><span>Arraste para girar · roda ou pinça para aproximar</span></div>
  </div>`;
}

function renderDetail(container, location) {
  if (!location) {
    container.innerHTML = '<div class="city-detail__empty"><span aria-hidden="true">⌖</span><small>MAPA DO BAIRRO</small><h2>Escolha um lugar</h2><p>Toque em uma área ilustrada ou use a lista para conhecer os setores da cidade.</p><div class="city-legend"><i class="legend-hill"></i> Comunidade <i class="legend-road"></i> Eixo de circulação <i class="legend-sea"></i> Orla</div></div>';
    return;
  }
  const preview = location.image ? `<figure><img src="${escapeHtml(location.image)}" alt="${escapeHtml(location.imageAlt)}" loading="lazy"></figure>` : '<div class="city-detail__symbol" aria-hidden="true">'+(location.id==='praia'?'🌊':'🌴')+'</div>';
  container.innerHTML = `<small>${escapeHtml(location.zone)}</small><h2>${escapeHtml(location.name)}</h2><p>${escapeHtml(location.description)}</p>${preview}<div class="city-detail__state"><span>ÁREA</span><b>${escapeHtml(location.state)}</b></div>`;
}

export function openExpandedCityMap({ onEnterCompany } = {}) {
  const dialog = document.createElement('dialog');
  const returnFocus = document.activeElement;
  dialog.className = 'expanded-city-dialog';
  dialog.setAttribute('aria-labelledby', 'expanded-city-title');
  dialog.innerHTML = `<header class="expanded-city-header"><div><small>MAPA DO MUNDO EXPANDIDO</small><h1 id="expanded-city-title">${escapeHtml(EXPANDED_CITY_MAP.title)}</h1><p>Explore a cidade em 3D. Clique na Pilha Corp para entrar no jogo.</p></div><button type="button" data-city-close aria-label="Fechar mapa">×</button></header><div class="expanded-city-layout"><section class="expanded-city-board" aria-label="Mapa 3D isométrico interativo do bairro">${cityArtwork()}</section><aside class="expanded-city-info"><div class="city-detail" data-city-detail aria-live="polite"></div><button class="city-enter-company" type="button" data-city-enter-company hidden>Entrar na Pilha Corp <span aria-hidden="true">↗</span></button><nav class="city-location-list" aria-label="Lugares do bairro">${EXPANDED_CITY_MAP.locations.map(p=>`<button type="button" data-city-pick="${escapeHtml(p.id)}"><span>${escapeHtml(p.zone)}</span><b>${escapeHtml(p.name)}</b></button>`).join('')}</nav><p class="city-map-note">Arraste para girar e use a roda do mouse ou o gesto de pinça para aproximar. Clique em uma área para ver detalhes; clique na sede para começar.</p></aside></div>`;
  document.body.append(dialog);
  const detail = dialog.querySelector('[data-city-detail]');
  let cityScene=null;
  const select = id => {
    const location = EXPANDED_CITY_MAP.locations.find(item => item.id === id);
    if (!location) return;
    dialog.querySelectorAll('[data-city-location]').forEach(node => {
      const active = node.dataset.cityLocation === id;
      node.classList.toggle('is-selected', active);
      node.setAttribute('aria-pressed', String(active));
    });
    dialog.querySelectorAll('[data-city-pick]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.cityPick === id)));
    dialog.querySelector('[data-city-enter-company]').hidden = id !== 'pilha-corp';
    renderDetail(detail, location);
    cityScene?.select(id);
  };
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-city-close]')) dialog.close();
    const listItem = event.target.closest('[data-city-pick]');
    if (listItem) select(listItem.dataset.cityPick);
    if (event.target.closest('[data-city-enter-company]')) { dialog.close(); onEnterCompany?.(); }
    if (event.target.closest('[data-city-reset]')) cityScene?.reset();
  });
  dialog.addEventListener('close', () => { cityScene?.dispose(); dialog.remove(); if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); }, {once:true});
  renderDetail(detail, null);
  dialog.showModal();
  dialog.querySelector('[data-city-close]').focus({preventScroll:true});
  const progress=dialog.querySelector('[data-city-progress]');
  import('./expanded-city-scene.js').then(({createExpandedCityScene})=>createExpandedCityScene(dialog.querySelector('[data-city-scene]'),{
    onSelect:(id,meta)=>{if(meta?.enter){dialog.close();onEnterCompany?.();}else select(id);},
    onProgress:value=>{progress.textContent=value>=100?'Preparando os elementos da cidade…':`Carregando a cidade 3D… ${value}%`;},
    onError:()=>{progress.textContent='Prévia da cidade carregada; não foi possível iniciar o 3D agora.';progress.classList.add('is-error');}
  })).then(scene=>{cityScene=scene;progress.remove();}).catch(error=>{progress.textContent='Não foi possível abrir o 3D. A prévia isométrica permanece disponível.';progress.classList.add('is-error');console.error('Falha ao iniciar o mapa 3D:',error);});
  return dialog;
}
