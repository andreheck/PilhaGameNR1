import {GAME_MODES,GAME_MODE_BY_ID} from '../data/continuous/game-modes.js';
import {tone} from './living-audio.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREVIEWS=Object.freeze({'home-office':'modo-home-office-isometrico.png','cowork':'modo-cowork-isometrico.png','office':'modo-escritorio-isometrico.png'});
function preview(mode){
 return `<img src="/assets/game-modes/${PREVIEWS[mode.id]}" alt="" loading="eager" decoding="async">`;
}
export function chooseGameMode({currentMode=null}={}){
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='game-mode-dialog';dialog.setAttribute('aria-labelledby','game-mode-title');dialog.setAttribute('aria-describedby','game-mode-copy');
  let selected=null,done=false;
  const finish=value=>{if(done||!GAME_MODE_BY_ID[value])return;done=true;tone('select');dialog.close();resolve(value);};
  const draw=()=>{
   const focusId=selected||GAME_MODES[0].id;
   dialog.innerHTML=`<header class="game-mode-heading"><span class="game-mode-kicker">NOVA PARTIDA · ESCOLHA SEU CENÁRIO</span><h1 id="game-mode-title">Qual rotina você vai cuidar?</h1><p id="game-mode-copy">Escolha um modo. O espaço e a complexidade da empresa mudam com você.</p></header><div class="game-mode-options" role="radiogroup" aria-label="Modalidades de jogo">${GAME_MODES.map((mode,index)=>`<button class="game-mode-card${selected===mode.id?' is-selected':''}" type="button" role="radio" aria-checked="${selected===mode.id}" tabindex="${(selected?selected===mode.id:index===0)?'0':'-1'}" data-game-mode="${esc(mode.id)}" style="--mode-accent:${esc(mode.color)}"><span class="game-mode-preview">${preview(mode)}<b class="game-mode-level">${esc(mode.difficulty)}</b></span><span class="game-mode-card-copy"><small>${esc(mode.subtitle)}</small><strong>${esc(mode.name)}</strong><span>${esc(mode.description)}</span><em>${mode.functionalRooms} ${mode.functionalRooms===1?'ambiente de trabalho':'ambientes funcionais'}</em></span><span class="game-mode-check" aria-hidden="true">✓</span></button>`).join('')}</div><footer class="game-mode-footer"><p aria-live="polite">${selected?`${esc(GAME_MODE_BY_ID[selected].name)} selecionado · a escolha será salva nesta partida.`:'Escolha um modo para continuar.'}</p><button class="game-mode-continue" type="button" data-game-mode-continue${selected?'':' disabled'}>Continuar <span aria-hidden="true">→</span></button></footer>`;
   dialog.querySelectorAll('[data-game-mode]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.gameMode;tone('select');draw();dialog.querySelector(`[data-game-mode="${selected}"]`)?.focus({preventScroll:true});}));
   dialog.querySelector('[data-game-mode-continue]').addEventListener('click',()=>finish(selected));
   dialog.querySelector('.game-mode-options').addEventListener('keydown',event=>{if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();const focused=dialog.querySelector('[data-game-mode]:focus')?.dataset.gameMode;const current=Math.max(0,GAME_MODES.findIndex(mode=>mode.id===(focused||selected||focusId)));const next=event.key==='Home'?0:event.key==='End'?GAME_MODES.length-1:(current+(event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1)+GAME_MODES.length)%GAME_MODES.length;selected=GAME_MODES[next].id;draw();dialog.querySelector(`[data-game-mode="${selected}"]`)?.focus({preventScroll:true});});
  };
  dialog.addEventListener('cancel',event=>event.preventDefault());dialog.addEventListener('close',()=>{dialog.remove();if(!done)resolve(null);},{once:true});document.body.append(dialog);draw();dialog.showModal();dialog.querySelector(`[data-game-mode="${GAME_MODES[0].id}"]`)?.focus({preventScroll:true});
 });
}
