import {FURNITURE_VISUALS as V} from '../data/continuous/furniture-visuals.js';
import {createFurniturePresentation} from './furniture-presentation.js';
import {escapeHtml as esc} from './hero-neon.js';
/** Read-only scale laboratory; it never opens or initializes a player save. */
export function showScaleScene(root){
 const style=document.createElement('style');style.textContent='body{margin:0;background:#091c31;color:#eef6ff;font:15px/1.5 system-ui}.scale-lab{padding:20px;max-width:1500px;margin:auto}.scale-lab a{color:#ffd166}.scale-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}.scale-grid article{border:1px solid #526e8c;border-radius:12px;padding:12px;background:#102b46}.scale-grid h2{font-size:16px;margin:0}.scale-grid canvas{width:100%;height:auto}.scale-grid p{margin:0}.scale-lab header{margin-bottom:20px}';document.head.append(style);
 const entries=[...V.assets,...V.amenities];
 root.innerHTML='<section class="scale-lab"><header><h1>Régua de mobiliário</h1><p>1 célula = 1 m · adulto de referência: 1,70 m. Dimensões são hipóteses visuais ajustáveis. Esta tela não altera sua partida.</p><a href="/?hud=v2">Voltar ao jogo</a></header><div class="scale-grid">'+entries.map(a=>'<article data-scale-id="'+a.id+'"><h2>'+esc(a.name)+'</h2><canvas width="300" height="235" aria-label="Comparação de '+esc(a.name)+' com adulto de 1,70 metro"></canvas><p>'+a.scale.width+' × '+a.scale.depth+' × '+a.scale.height+' m</p></article>').join('')+'</div></section>';
 const images={},presentation=createFurniturePresentation();
 function draw(a){
  const canvas=root.querySelector('[data-scale-id="'+a.id+'"] canvas'),ctx=canvas.getContext('2d'),u=40;
  const P=(x,y,z)=>[130+(x-y)*u*32/30,145+(x+y)*u*16/30-z*u];
  function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();}
  function box(x,y,z,w,d,h,c){poly([P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)],c);poly([P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)],'#41627b');poly([P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)],'#88a4b6');}
  ctx.clearRect(0,0,300,235);poly([P(-.5,-.5,0),P(2,-.5,0),P(2,2,0),P(-.5,2,0)],'#183b53');
  const it={x:0,y:0,w:a.scale.width,d:a.scale.depth,h:a.scale.height,t:a.type||'asset',amenity:a.type?a.id:null,visualAsset:a.type?null:a.id};
  if(!presentation.draw({ctx,P,box,poly,scale:u/30,unit:30,time:0},it,{key:'restauracao'},{catalog:V,images,reveal:{}}))box(0,0,0,it.w,it.d,it.h,'#81a7bd');
  const x=38,feet=190,top=feet-1.7*u;ctx.strokeStyle='#ffd166';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(15,feet);ctx.lineTo(15,top);ctx.moveTo(10,feet);ctx.lineTo(20,feet);ctx.moveTo(10,top);ctx.lineTo(20,top);ctx.stroke();
  ctx.strokeStyle='#b4c4d4';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,feet-1.25*u);ctx.lineTo(x,feet-.65*u);ctx.lineTo(x-8,feet);ctx.moveTo(x,feet-.65*u);ctx.lineTo(x+8,feet);ctx.moveTo(x-13,feet-.85*u);ctx.lineTo(x,feet-1.2*u);ctx.lineTo(x+13,feet-.85*u);ctx.stroke();ctx.fillStyle='#ffe2bc';ctx.beginPath();ctx.arc(x,top+.17*u,.17*u,0,Math.PI*2);ctx.fill();ctx.font='12px system-ui';ctx.fillStyle='#ffd166';ctx.fillText('1,70 m',4,top-8);
 }
 entries.forEach(a=>{if(!a.type){const img=new Image();images[a.id]=img;img.onload=()=>draw(a);img.src=a.url||V.spriteRoot+a.file;}draw(a);});
}
