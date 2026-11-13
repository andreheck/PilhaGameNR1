/** Native logo buttons remain reachable inside modal dialogs, including onboarding. */
export function installHomeLinks({onHome,onSettings}){
 const logo='/assets/branding/pilha-logo-puro.png';
 function button(){const b=document.createElement('button');b.type='button';b.className='game-home-mark';b.dataset.gameHome='';b.setAttribute('aria-label','Voltar à tela inicial');b.title='Voltar à tela inicial';b.innerHTML='<img src="'+logo+'" alt="">';return b;}
 function convert(el){if(el.matches('button[data-game-home]'))return;const b=document.createElement('button');b.type='button';b.className=el.className+' game-home-brand';b.dataset.gameHome='';b.setAttribute('aria-label','Voltar à tela inicial');b.title='Voltar à tela inicial';while(el.firstChild)b.append(el.firstChild);el.replaceWith(b);}
 function enhance(){document.querySelectorAll('.pm-brand:not([data-game-home]),.ph-logo:not([data-game-home]),.pi-brand-group:not([data-game-home])').forEach(convert);
  document.querySelectorAll('.living-topbar .pm-tabs').forEach(tabs=>{if(!tabs.querySelector('.game-home-tab')){const b=button();b.classList.add('game-home-tab');tabs.prepend(b);}});
  document.querySelectorAll('dialog header').forEach(header=>{if(header.closest('dialog').querySelector('[data-game-home]'))return;const image=header.querySelector('img[src="'+logo+'"]');if(image){const b=button();image.replaceWith(b);}else header.prepend(button());});
 }
 const observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});enhance();
 document.addEventListener('click',e=>{if(e.target.closest('[data-game-home]')){e.preventDefault();e.stopImmediatePropagation();onHome();}else if(e.target.closest('[data-game-settings]')){e.preventDefault();e.stopImmediatePropagation();onSettings();}},true);
 return {destroy(){observer.disconnect();}};
}
