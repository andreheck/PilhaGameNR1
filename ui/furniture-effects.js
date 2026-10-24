/** Visual-only reward animation, independent from purchases, health and time. */
export function emitFurniturePoof(root,{name='Melhoria adquirida',level=1,zone=null}={}){
  if(!root||typeof document==='undefined')return;
  const canvas=root.querySelector('canvas');
  const holder=canvas?.parentElement||root;
  const bounds=canvas?.getBoundingClientRect()||root.getBoundingClientRect();
  const parentBounds=holder.getBoundingClientRect();
  const centerX=bounds.left-parentBounds.left+bounds.width*.5;
  const centerY=bounds.top-parentBounds.top+bounds.height*.54;
  if(getComputedStyle(holder).position==='static')holder.style.position='relative';
  const puff=document.createElement('div');
  puff.className='furniture-poof';
  puff.setAttribute('role','presentation');
  puff.style.left=centerX+'px';puff.style.top=centerY+'px';
  puff.innerHTML='<span class="furniture-poof__cloud c1"></span><span class="furniture-poof__cloud c2"></span><span class="furniture-poof__cloud c3"></span><span class="furniture-poof__spark">✦</span>';
  holder.append(puff);
  const label=document.createElement('div');
  label.className='furniture-reward';
  label.textContent=name+' · Nível '+level;
  label.style.left=centerX+'px';label.style.top=(centerY-65)+'px';
  holder.append(label);
  puff.addEventListener('animationend',()=>puff.remove(),{once:true});
  setTimeout(()=>{puff.remove();label.remove();},1400);
}
