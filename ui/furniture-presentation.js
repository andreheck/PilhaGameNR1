import {applyLayoutOverrides} from '../simulation/furniture-layout.js';
import {OFFICE_SPACE} from '../data/continuous/office-space.js';
/** Canvas furniture presentation. No purchases, state mutation or storage. */
export function spriteSize(asset,unit,ratio=1){
 const m=asset.scale;
 return {height:(m.height+(m.width+m.depth)*16/30)*unit,width:(m.width+m.depth)*32/30*unit};
}
export function createFurniturePresentation(){
 function arrange(env,catalog,edits={}){
  // Start from original positions every time: purchases/refresh never accumulate offsets.
  let items=env.items.filter(it=>!it.amenity&&!it.annex&&!it.structural);
  const v2Bindings={'rest2-banco_wifi_completo':'banco','rest2-tapete_indiano':'tapete','rest2-almofadas_encosto':'almofadas'},v2Levels={};
  if(env.key==='restauracao'&&catalog.annex){for(const it of items){const id=it.visualId||it.installed;if(Object.values(v2Bindings).includes(id))v2Levels[id]=Math.max(v2Levels[id]||0,it.visualLevel||1);}items=items.filter(it=>!Object.values(v2Bindings).includes(it.visualId||it.installed));}
  items.forEach(it=>{it.layoutKey??=(it.installed?'purchase:'+it.installed:'base:'+it.t)+':'+(it.originalPosition||[it.x,it.y]).map(n=>+n.toFixed(3)).join(',');});
  // Meeting-table art already contains its chairs: avoid four duplicate armchairs.
  const integratedChairs=new Set(items.filter(it=>!it.installed&&it.visualAsset==='mesa-reuniao').map(it=>it.z));
  items=items.filter(it=>!(it.t==='chair'&&!it.installed&&integratedChairs.has(it.z)));
  // Compatible improvements renovate an existing workstation, rather than
  // adding a duplicate desk for each programme to an already furnished room.
  for(const it of items.filter(it=>it.installed&&it.visualAsset)){
   const host=items.find(b=>b!==it&&!b.merged&&b.visualAsset===it.visualAsset&&(!b.installed||items.indexOf(b)<items.indexOf(it)));
   if(host){host.visualIds??=[];if(host.visualId&&!host.visualIds.includes(host.visualId))host.visualIds.push(host.visualId);if(it.visualId&&!host.visualIds.includes(it.visualId))host.visualIds.push(it.visualId);host.visualId=host.visualIds[0];host.visualLevel=Math.max(host.visualLevel||0,it.visualLevel||0);it.merged=true;}
  }
  items=items.filter(it=>!it.merged);
  if(env.key==='restauracao')for(const a of catalog.amenities.filter(a=>!catalog.annex||!['banco-patio-a','banco-patio-b','jardineira-patio'].includes(a.id)))items.push({t:a.type,x:a.position[0],y:a.position[1],w:a.scale.width,d:a.scale.depth,h:a.scale.height,z:a.zone,layoutKey:'amenity:'+a.id,amenity:a.id,c:'#b9d1dc'});
  // Small deterministic packing inside the six activity areas. Aisles stay free.
  if(env.key==='producao'){const seen=new Set();items=items.filter(it=>{if(it.installed||!['machine','crate','shelf'].includes(it.t))return true;const key=it.z+'|'+it.visualAsset;if(seen.has(key))return false;seen.add(key);return true;});}
  if(env.key==='restauracao'&&catalog.annex)for(const p of catalog.annex.placements){const a=catalog.assets.find(a=>a.id===p.asset);if(a)items.push({t:'restorative-v2',c:'#6799a9',visualId:v2Levels[v2Bindings[a.id]]?v2Bindings[a.id]:null,visualIds:v2Levels[v2Bindings[a.id]]?[v2Bindings[a.id]]:[],visualLevel:v2Levels[v2Bindings[a.id]]||0,x:p.x,y:p.y,w:a.scale.width,d:a.scale.depth,h:a.scale.height,z:5,visualAsset:a.id,layoutKey:'annex:'+a.id,annex:true,layoutHidden:false,walkable:a.id==='rest2-tapete_indiano'});}
  if(env.key==='escritorio'&&catalog.officeExtension!==false){
   for(const p of OFFICE_SPACE.furniture){const a=catalog.assets.find(a=>a.id===p.asset);items.push({t:p.type,x:p.x,y:p.y,w:a.scale.width,d:a.scale.depth,h:a.scale.height,z:0,visualAsset:p.asset,layoutKey:'office:'+p.id,managerRoom:true,managerDesk:!!p.managerDesk,annex:true,c:'#7899a8'});}
   for(const p of OFFICE_SPACE.walls)items.push({...p,t:'glass-wall',layoutKey:'structure:'+p.id,structural:true,c:'#80cad8'});
  }
  const occupied=items.filter(it=>it.structural),unplaced=[],seatClearance=[];
  const hit=(a,b,g=.42)=>a.x<b.x+b.w+g&&a.x+a.w+g>b.x&&a.y<b.y+b.d+g&&a.y+a.d+g>b.y;
  const reserved=env.key==='restauracao'?catalog.restClearance:[];
  // Reserve player-authored positions before packing anything new around them.
  // Previously a new purchase was packed first, and could invalidate an entire room.
  items.forEach(it=>{it.originalPosition??=[it.x,it.y];const a=catalog.assets.find(a=>a.id===it.visualAsset);if(a?.scale){it.w=a.scale.width;it.d=a.scale.depth;it.h=a.scale.height;}it.baseW=it.w;it.baseD=it.d;it.turn=0;it.canRotate=!!a?.rotationViews;});
  const saved=applyLayoutOverrides(items.filter(it=>edits[it.layoutKey]),edits,env.key),pinned=new Set();
  for(const p of saved.items){if(saved.warnings.includes(p.layoutKey))continue;const it=items.find(it=>it.layoutKey===p.layoutKey);Object.assign(it,p,{layoutHidden:false});pinned.add(it.layoutKey);if(!it.walkable&&!it.visualProgram){occupied.push(it);if(it.t==='desk')seatClearance.push({x:it.x+.08,y:it.y-.66,w:it.w-.16,d:.66});}}
  const sorted=items.map((it,index)=>({it,index})).sort((a,b)=>{
   const size=i=>{const m=catalog.assets.find(a=>a.id===i.visualAsset)?.scale;return m?m.width*m.depth:i.w*i.d;};
   return Number(b.it.t==='desk')-Number(a.it.t==='desk')||size(b.it)-size(a.it)||a.index-b.index;
  });
  for(const {it} of sorted){
   if(pinned.has(it.layoutKey)||it.annex||it.structural)continue;
   if(it.visualProgram)continue;
   it.originalPosition??=[it.x,it.y];
   const asset=catalog.assets.find(a=>a.id===it.visualAsset),m=asset?.scale;
   if(m){it.w=m.width;it.d=m.depth;it.h=m.height;}
   const zone=it.z??0,zx=zone%3*4,zy=Math.floor(zone/3)*4,candidates=[];
   for(let y=zy+.3;y+it.d<=zy+3.7+.001;y+=.1)for(let x=zx+.3;x+it.w<=zx+3.7+.001;x+=.1)candidates.push({x:+x.toFixed(3),y:+y.toFixed(3)});
   candidates.sort((a,b)=>Math.hypot(a.x-it.originalPosition[0],a.y-it.originalPosition[1])-Math.hypot(b.x-it.originalPosition[0],b.y-it.originalPosition[1]));
   const seatBox=p=>({x:p.x+.08,y:p.y-.66,w:it.w-.16,d:.66});
   const fits=p=>p.x>=.6&&p.y>=.55&&p.x+it.w<=11.5&&p.y+it.d<=7.45&&!occupied.some(b=>hit({...it,...p},b))&&!reserved.some(b=>hit({...it,...p},b,0))&&!seatClearance.some(b=>hit({...it,...p},b,0))&&(it.t!=='desk'||seatBox(p).y>=.25&&!occupied.some(b=>hit(seatBox(p),b,0)));
   let at=candidates.find(fits);
   // Large upgrades may use another clear activity bay, never the central corridor.
   if(!at)for(let z=0;z<6&&!at;z++)for(let y=Math.floor(z/3)*4+.3;y+it.d<=Math.floor(z/3)*4+3.7&&!at;y+=.1)for(let x=z%3*4+.3;x+it.w<=z%3*4+3.7;x+=.1)if(fits({x,y})){at={x,y};break;}
   it.layoutHidden=!at;
   if(at){it.x=at.x;it.y=at.y;occupied.push(it);if(it.t==='desk')seatClearance.push(seatBox(it));}else unplaced.push(it.visualId||it.visualAsset||it.t);
  }
  if(env.key==='escritorio')for(const p of OFFICE_SPACE.partitions){if(!items.some(b=>!b.walkable&&!b.visualProgram&&!b.layoutHidden&&hit(p,b,.12)))items.push({...p,t:'glass-wall',layoutKey:'structure:'+p.id,structural:true,c:'#80cad8'});}
  env.items=items;env.layoutWarnings=[...saved.warnings,...unplaced];env.furnitureUnplaced=unplaced;
 }
 function draw(api,it,e,resources){
  const {ctx,P,box,poly,scale:s,unit,time}=api,{catalog,images,reveal,atlas}=resources;
  if(it.visualProgram||it.layoutHidden)return true;
  if([it.visualId,...(it.visualIds||[])].some(id=>id&&reveal[e.key+'|'+id]>Date.now()))return true;
  const x=it.x,y=it.y,w=it.w,d=it.d,h=it.h;
  if(it.structural){
   const a=P(x,y,0),b=P(x+w,y+d,0),c=P(x+w,y+d,h),f=P(x,y,h);
   poly([a,b,c,f],'rgba(117,202,218,.16)','#64acbd',Math.max(.7,s));
   for(const pos of [[x,y],[x+w,y+d]])box(pos[0],pos[1],0,.035,.035,h,'#416477',1);
   const mid=P(x+w*.5,y+d*.5,h*.6);ctx.strokeStyle='rgba(221,247,255,.34)';ctx.lineWidth=Math.max(.7,s);ctx.beginPath();ctx.moveTo(mid[0]-3*s,mid[1]+5*s);ctx.lineTo(mid[0]+3*s,mid[1]-5*s);ctx.stroke();return true;
  }
  if(it.amenity){
   if(it.t==='patioBench'){for(const dx of [.1,w-.17])box(x+dx,y+.06,0,.07,d-.1,.43,'#39546a',1);box(x,y,.43,w,d,.08,'#be9865',1);box(x,y,.51,w,.07,.29,'#be9865',1);
   }else if(it.t==='patioPlanter'){box(x,y,0,w,d,.33,'#967551',1);box(x+.04,y+.04,.33,w-.08,d-.08,.04,'#5c4936',1);for(const dx of [.12,.35]){box(x+dx,y+.2,.36,.04,.04,.25,'#567949',1);const leaf=P(x+dx,y+.2,.71);ctx.fillStyle='#6aaf72';ctx.beginPath();ctx.ellipse(leaf[0],leaf[1],unit*s*.16,unit*s*.22,0,0,Math.PI*2);ctx.fill();}
   }else if(it.t==='fridge'){
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
   const p=P(x+w/2,y+d/2,.03),front=P(x+w,y+d,.03),size=asset.projection?{width:asset.projection.width*s,height:asset.projection.height*s}:spriteSize(asset,unit*s,img.naturalHeight/img.naturalWidth),anchor=asset.anchor;
   const b=asset.bounds||[0,0,img.naturalWidth,img.naturalHeight];
   const frame=asset.animation?Math.floor(time/asset.animation.duration*asset.animation.frames)%asset.animation.frames:0;
   ctx.save();ctx.globalAlpha=.98;ctx.drawImage(img,b[0]+frame*(asset.animation?.frameWidth||0),b[1]+(asset.rotationViews?(it.turn||0)*(asset.animation?.frameHeight||b[3]):0),b[2]-b[0],b[3]-b[1],p[0]-size.width*anchor[0],front[1]-size.height*anchor[1],size.width,size.height);ctx.restore();
   if(it.visualLevel>=2){const q=P(x+w/2,y+d/2,h+.35);ctx.fillStyle=it.visualLevel===3?'#ffd166':'#86d9f1';ctx.beginPath();ctx.arc(q[0],q[1],Math.max(3,4*s),0,Math.PI*2);ctx.fill();}
   return true;
  }
  return false; // Existing procedural geometry remains a network-error fallback.
 }
 return {arrange,draw};
}
