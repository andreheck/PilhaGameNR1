/** Canvas furniture presentation. No purchases, state mutation or storage. */
export function spriteSize(asset,unit,ratio=1){
 const m=asset.scale;
 return {height:(m.height+(m.width+m.depth)*16/30)*unit,width:(m.width+m.depth)*32/30*unit};
}
export function createFurniturePresentation(){
 function arrange(env,catalog){
  // Start from original positions every time: purchases/refresh never accumulate offsets.
  let items=env.items.filter(it=>!it.amenity);
  // Compatible improvements renovate an existing workstation, rather than
  // adding a duplicate desk for each programme to an already furnished room.
  for(const it of items.filter(it=>it.installed&&it.visualAsset)){
   const host=items.find(b=>!b.installed&&b.visualAsset===it.visualAsset);
   if(host){host.visualIds??=[];if(it.visualId&&!host.visualIds.includes(it.visualId))host.visualIds.push(it.visualId);host.visualId=host.visualIds[0];host.visualLevel=Math.max(host.visualLevel||0,it.visualLevel||0);it.merged=true;}
  }
  items=items.filter(it=>!it.merged);
  if(env.key==='restauracao')for(const a of catalog.amenities)items.push({t:a.type,x:a.position[0],y:a.position[1],w:a.scale.width,d:a.scale.depth,h:a.scale.height,z:a.zone,amenity:a.id,c:'#b9d1dc'});
  // Small deterministic packing inside the six activity areas. Aisles stay free.
  const occupied=[],unplaced=[];
  const hit=(a,b,g=.08)=>a.x<b.x+b.w+g&&a.x+a.w+g>b.x&&a.y<b.y+b.d+g&&a.y+a.d+g>b.y;
  const reserved=env.key==='restauracao'?catalog.restClearance:[];
  const sorted=items.map((it,index)=>({it,index})).sort((a,b)=>{
   const size=i=>{const m=catalog.assets.find(a=>a.id===i.visualAsset)?.scale;return m?m.width*m.depth:i.w*i.d;};
   return size(b.it)-size(a.it)||a.index-b.index;
  });
  for(const {it} of sorted){
   if(it.visualProgram)continue;
   it.originalPosition??=[it.x,it.y];
   const asset=catalog.assets.find(a=>a.id===it.visualAsset),m=asset?.scale;
   if(m){it.w=m.width;it.d=m.depth;it.h=m.height;}
   const zone=it.z??0,zx=zone%3*4,zy=Math.floor(zone/3)*4,candidates=[];
   for(let y=zy+.65;y+it.d<=zy+3.55+.001;y+=.2)for(let x=zx+.75;x+it.w<=zx+3.5+.001;x+=.2)candidates.push({x:+x.toFixed(3),y:+y.toFixed(3)});
   candidates.sort((a,b)=>Math.hypot(a.x-it.originalPosition[0],a.y-it.originalPosition[1])-Math.hypot(b.x-it.originalPosition[0],b.y-it.originalPosition[1]));
   const fits=p=>!occupied.some(b=>hit({...it,...p},b))&&!reserved.some(b=>hit({...it,...p},b,0));
   let at=candidates.find(fits);
   // Large upgrades may use another clear activity bay, never the central corridor.
   if(!at)for(let z=0;z<6&&!at;z++)for(let y=Math.floor(z/3)*4+.65;y+it.d<=Math.floor(z/3)*4+3.55&&!at;y+=.2)for(let x=z%3*4+.75;x+it.w<=z%3*4+3.5;x+=.2)if(fits({x,y})){at={x,y};break;}
   it.layoutHidden=!at;
   if(at){it.x=at.x;it.y=at.y;occupied.push(it);}else unplaced.push(it.visualId||it.visualAsset||it.t);
  }
  env.items=items;env.furnitureUnplaced=unplaced;
 }
 function draw(api,it,e,resources){
  const {ctx,P,box,poly,scale:s,unit,time}=api,{catalog,images,reveal,atlas}=resources;
  if(it.visualProgram||it.layoutHidden)return true;
  if([it.visualId,...(it.visualIds||[])].some(id=>id&&reveal[e.key+'|'+id]>Date.now()))return true;
  const x=it.x,y=it.y,w=it.w,d=it.d,h=it.h;
  if(it.amenity){
   if(it.t==='fridge'){
    box(x,y,0,w,d,h,'#b8d1dc',.95);box(x+.04,y+d,.06,w-.08,.025,h-.12,'#e5edf1',.95);
    box(x+.04,y+d+.027,h*.68,w-.08,.014,.025,'#768fa2',1);
    box(x+w*.8,y+d+.035,h*.22,.035,.025,.36,'#37566b',1);
    box(x+w*.8,y+d+.035,h*.77,.035,.025,.18,'#37566b',1);
   }else if(it.t==='television'){
    box(x+w*.45,y+.05,0,.1,.22,.7,'#536b80',1);box(x+.15,y,0,w-.3,d,.05,'#3b5269',1);
    box(x,y,.7,w,.12,.8,'#152d43',1);
    poly([P(x+.06,y+.126,.77),P(x+w-.06,y+.126,.77),P(x+w-.06,y+.126,1.43),P(x+.06,y+.126,1.43)],'#163b5a');
    for(let i=0;i<4;i++){
     const bh=.12+.2*(.5+.5*Math.sin(time*.65+i));
     poly([P(x+.15+i*.24,y+.128,.85),P(x+.28+i*.24,y+.128,.85),P(x+.28+i*.24,y+.128,.85+bh),P(x+.15+i*.24,y+.128,.85+bh)],['#54cbb3','#ffd166','#64c3e6','#a58bea'][i]);
    }
   }else{
    box(x,y,0,w,d,.87,'#b18c69',1);box(x,y,.87,w,d,.05,'#e1d9cc',1);
    box(x+.12,y+.14,.92,.35,.3,.4,'#1a344b',1);box(x+.17,y+.44,1.05,.25,.02,.08,'#66c7d8',1);
    const steam=P(x+.3,y+.3,1.45);ctx.strokeStyle='#ddf5ff88';ctx.lineWidth=Math.max(1,s);ctx.beginPath();ctx.moveTo(steam[0],steam[1]);ctx.quadraticCurveTo(steam[0]+Math.sin(time)*3*s,steam[1]-4*s,steam[0],steam[1]-9*s);ctx.stroke();
   }
   return true;
  }
  const asset=catalog?.assets.find(a=>a.id===it.visualAsset),img=images[it.visualAsset];
  if(!asset)return false;
  // Preserve animated factory equipment: the original renderer draws its belt,
  // rollers and parcels in the same physical dimensions as the other furniture.
  if(it.t==='conveyor')return false;
  if(img?.complete&&img.naturalWidth){
   const p=P(x+w/2,y+d/2,.03),front=P(x+w,y+d,.03),size=spriteSize(asset,unit*s,img.naturalHeight/img.naturalWidth),anchor=asset.anchor;
   const b=asset.bounds||[0,0,img.naturalWidth,img.naturalHeight];
   ctx.save();ctx.globalAlpha=.98;ctx.drawImage(img,b[0],b[1],b[2]-b[0],b[3]-b[1],p[0]-size.width*anchor[0],front[1]-size.height*anchor[1],size.width,size.height);ctx.restore();
   if(it.visualLevel>=2){const q=P(x+w/2,y+d/2,h+.35);ctx.fillStyle=it.visualLevel===3?'#ffd166':'#86d9f1';ctx.beginPath();ctx.arc(q[0],q[1],Math.max(3,4*s),0,Math.PI*2);ctx.fill();}
   return true;
  }
  return false; // Existing procedural geometry remains a network-error fallback.
 }
 return {arrange,draw};
}
