/** Presentation only: existing notices, callbacks and game transactions stay intact. */
export function installNoticeCenter(root){
 const host=root.querySelector('.pm-toasts'),home=host.parentNode,anchor=document.createComment('notices');
 host.before(anchor);root.classList.add('has-notice-center');
 const link=document.createElement('link');link.rel='stylesheet';link.href='/ui/notice-center.css';document.head.append(link);
 const button=document.createElement('button');button.type='button';button.className='notice-summary';button.hidden=true;button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','company-notices');
 const status=document.createElement('p');status.className='pm-sr';status.setAttribute('role','status');
 const dialog=document.createElement('dialog');dialog.id='company-notices';dialog.className='notice-center';dialog.setAttribute('aria-labelledby','company-notices-title');
 dialog.innerHTML='<header><h2 id="company-notices-title">Avisos da empresa</h2><button type="button" aria-label="Fechar avisos">×</button></header><p class="notice-empty">Nenhum aviso no momento.</p>';
 home.append(button,status);root.append(dialog);
 const close=dialog.querySelector('button');close.onclick=()=>dialog.close();
 function update(){
  const cards=[...host.children].filter(e=>!e.classList.contains('is-out'));
  const urgent=cards.filter(e=>e.classList.contains('pm-toast--alert')).length;
  const title=(cards.findLast(e=>e.classList.contains('pm-toast--alert'))||cards.at(-1))?.querySelector('h3')?.textContent;
  button.hidden=!cards.length;
  button.textContent=(urgent?'⚠ ':'')+cards.length+' aviso'+(cards.length===1?'':'s')+(title?' · '+title:'');
  button.setAttribute('aria-label','Abrir '+cards.length+' aviso'+(cards.length===1?'':'s')+' da empresa'+(urgent?', '+urgent+' de atenção':''));
  button.classList.toggle('has-alert',urgent>0);
  const message=cards.length?button.textContent+'. Abra para ler e agir.':'';
  if(status.textContent!==message)status.textContent=message;
  dialog.querySelector('.notice-empty').hidden=cards.length>0;
 }
 button.onclick=()=>{dialog.append(host);dialog.showModal();close.focus();};
 dialog.addEventListener('close',()=>{anchor.after(host);if(!document.querySelector('dialog[open]'))(button.hidden?root.querySelector('.pm-canvas'):button).focus({preventScroll:true});});
 // Release the native modal before an existing notice action opens another dialog.
 host.addEventListener('click',e=>{if(dialog.open&&e.target.closest('.pm-toast__act'))dialog.close();},true);
 const observer=new MutationObserver(update);observer.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});update();
 return {destroy(){observer.disconnect();if(dialog.open)dialog.close();anchor.after(host);anchor.remove();button.remove();status.remove();dialog.remove();link.remove();root.classList.remove('has-notice-center');}};
}
