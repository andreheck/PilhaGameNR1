import * as THREE from 'three';

// One room. Each resource owns a basic and upgraded mesh; purchases remain in investment.js.
import {HALL_RESOURCES} from './resource-catalog.js';

export function createOpenHall(scene, regions) {
 const root=new THREE.Group();root.name='pilha-single-open-hall';scene.add(root);
 const palette={floor:0xf1ede4,edge:0x18354a,wall:0xd4e3e8,wood:0xd8b78c,ink:0x29475a,soft:0xa9bdc5,gold:0xf3b855,green:0x6aa591,white:0xf7faf8};
 const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:.76,metalness:.03});
 const mats=Object.fromEntries(Object.entries(palette).map(([k,v])=>[k,material(v)]));
 const box=(g,w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof m==='number'?material(m):m);o.position.set(x,y,z);o.castShadow=h>.12;o.receiveShadow=true;g.add(o);return o};
 const cyl=(g,r,h,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),typeof m==='number'?material(m):m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o};
 box(root,18,.32,13.7,0,-.22,0,mats.edge);box(root,17.8,.08,13.5,0,-.035,0,mats.floor);
 // Cutaway perimeter only: no partition walls or miniature room boxes.
 box(root,18,2.4,.16,0,1.16,-6.76,mats.wall);box(root,.16,2.4,13.55,-8.9,1.16,0,mats.wall);
 box(root,18,.07,.22,0,2.38,-6.76,mats.edge);box(root,.22,.07,13.55,-8.9,2.38,0,mats.edge);
 box(root,18,.1,.18,0,.06,-6.65,mats.white);box(root,.18,.1,13.55,-8.79,.06,0,mats.white);
 // Large windows and a warm timber accent identify a single shared space.
 for(const x of [-6.5,-3.3,-.1,3.1,6.3]){
  box(root,2.45,1.2,.055,x,1.45,-6.65,0xa1cbd6);
  box(root,2.6,.07,.12,x,.82,-6.6,mats.white);box(root,.045,1.23,.08,x,1.45,-6.59,mats.white);
 }
 for(const z of [-4.8,-1.7,1.4,4.5]){
  box(root,.055,1.2,2.35,-8.78,1.45,z,0xa1cbd6);box(root,.12,.07,2.55,-8.73,.82,z,mats.white);
 }
 for(let x=-8;x<=8;x+=1)box(root,.012,.005,13.2,x,.013,0,0xdedfd7);
 for(let z=-6;z<=6;z+=1)box(root,17.4,.005,.012,0,.014,z,0xdedfd7);
 const regionMats={},baseRegionColors={};
 for(const r of regions){const m=material(r.color);m.color.lerp(new THREE.Color(0xffffff),.55);regionMats[r.mark]=m;baseRegionColors[r.mark]=m.color.getHex();box(root,r.w,.017,r.d,r.x,.022,r.z,m);}
 function plant(g,x,z,scale=1){cyl(g,.18*scale,.3*scale,x,.15*scale,z,mats.white);for(let i=0;i<3;i++){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(.22*scale,1),material([0x5b947c,0x76ab8b,0x90b39a][i]));o.position.set(x+(i-1)*.09*scale,(.5+i*.1)*scale,z);g.add(o);}}
 for(const [x,z] of [[-8,5.6],[7.85,5.6],[-7.9,-5.8],[7.7,-5.75]])plant(root,x,z,1.4);
 // Shared hub, not another enclosed sector.
 const center=new THREE.Group();center.name='shared-welcome-island';root.add(center);cyl(center,.72,.52,0,.26,.65,mats.wood);plant(center,0,.65,1.1);
 function chair(g,x,z,color,comfortable=false){box(g,.43,.4,.08,x,.65,z-.19,color);box(g,.47,.12,.46,x,.4,z,color);if(comfortable){box(g,.06,.2,.4,x-.27,.5,z,color);box(g,.06,.2,.4,x+.27,.5,z,color);}cyl(g,.045,.32,x,.19,z,mats.ink);box(g,.54,.05,.07,x,.045,z,mats.ink);box(g,.07,.05,.54,x,.045,z,mats.ink);}
 function desk(g,good){box(g,good?1.6:1.2,.1,.65,0,.8,0,good?mats.wood:mats.soft);for(const x of [-.5,.5])box(g,.07,.72,.07,x,.39,0,mats.ink);box(g,good?.78:.48,.43,.06,0,1.08,-.12,good?0x24495a:0x667e8b);box(g,.1,.17,.1,0,.87,-.12,mats.ink);box(g,.47,.024,.18,0,.865,.18,mats.white);chair(g,0,.65,good?0x649c8a:0x748591,good);if(good)plant(g,.66,-.18,.5);}
 function board(g,good,kind){box(g,1.25,.77,.08,0,1.04,0,good?mats.white:mats.soft);for(const x of [-.45,.45])box(g,.045,.69,.06,x,.35,0,mats.ink);const cols=good?[0x83b3a3,0xf2bf61,0x85b4c8]:[0x82949c];for(let i=0;i<(good?6:2);i++)box(g,.25,.19,.02,-.4+(i%3)*.4,1.24-Math.floor(i/3)*.32,.055,cols[i%cols.length]);}
 function createVariant(resource,good){const g=new THREE.Group();g.name=resource.id+(good?'-upgraded':'-basic');g.userData.upgradeId=resource.id;
  const kind=resource.kind;
  if(kind==='desk'||kind==='support'){desk(g,good);if(kind==='support'&&good){box(g,.08,.9,.85,-.9,.5,0,0xa8c5b7);plant(g,.8,-.2,.8);}}
  else if(kind==='board'||kind==='leader'){board(g,good);if(kind==='leader')chair(g,0,.6,good?0x7ba894:0x7c909d,good);}
  else if(kind==='library'){
   for(const x of [-.6,.6]){box(g,.94,1.65,.35,x,.84,0,mats.ink);for(let y=.25;y<1.65;y+=.38){box(g,.86,.05,.4,x,y,.02,mats.wood);for(let i=0;i<(good?5:2);i++)box(g,.12,.22,.2,x-.33+i*.15,y+.14,.07,[0x7ba393,0xc5875b,0xebb657,0x678ca6,0xe9e1c9][i%5]);}}if(good){box(g,.36,.33,.04,0,.95,.3,0x73c4c5);}
  } else if(kind==='storage'){
   if(good){for(const z of [-.58,.58]){box(g,2,1.15,.4,0,.6,z,mats.ink);for(const y of [.2,.65,1.05]){box(g,2.05,.035,.45,0,y,z,mats.wood);for(const x of [-.65,0,.65])box(g,.43,.27,.33,x,y+.16,z,0xd0a578);}}}
   else{for(const [x,z,h] of [[-.65,-.5,.6],[.05,-.2,.95],[.6,.35,.55],[-.55,.55,.4]])box(g,.7,h,.62,x,h/2,z,mats.wood);}
   if(good)for(const x of [-1.15,1.15])box(g,.08,.018,1.85,x,.014,0,mats.gold);
  }else if(kind==='lounge'){
   const col=good?0x6f9d8b:0x8a9da6;box(g,good?2.1:1.5,.38,.66,0,.22,0,col);box(g,good?2.1:1.5,.4,.17,0,.59,-.26,col);for(const x of [-.95,.95])if(good)box(g,.2,.44,.66,x,.43,0,col);if(good){cyl(g,.34,.32,0,.18,.82,mats.wood);plant(g,1.2,-.3,.7);}
  }else if(kind==='meeting'||kind==='dialogue'){
   const r=kind==='meeting'?.57:.35;cyl(g,r,.08,0,.74,0,mats.wood);cyl(g,.08,.66,0,.36,0,mats.ink);const coords=kind==='meeting'?[[-.8,0],[.8,0],[0,.65],[0,-.65]]:[[-.5,0],[.5,0]];coords.slice(0,good?coords.length:2).forEach(([x,z])=>chair(g,x,z,good?0x77ab97:0x91a0a5));if(good)box(g,.33,.025,.22,0,.8,0,mats.white);
  }else if(kind==='climate'){
   box(g,1.2,.55,.35,0,1.23,0,good?mats.white:mats.soft);for(let i=0;i<4;i++)box(g,.94,.025,.025,0,1.1+i*.09,.19,good?0x73afbe:0x7d919b);box(g,.07,.95,.07,-.45,.5,0,mats.ink);if(good){const l=cyl(g,.38,.065,.4,1.85,.25,0xffe4ad);box(g,.035,1.7,.035,.4,.9,.25,mats.ink);l.material.emissive=new THREE.Color(0xffce70);l.material.emissiveIntensity=.5;}
  }else if(kind==='kiosk'){
   box(g,.55,1.05,.38,0,.54,0,good?mats.ink:mats.soft);box(g,.47,.34,.025,0,1.07,.2,good?0x80b8a0:0x94a3a6);box(g,.18,.07,.04,0,.66,.21,mats.white);if(good){box(g,.12,.16,.03,0,1.08,.23,mats.gold);}
  }
  g.traverse(o=>{if(o.isMesh){o.userData.upgradeId=resource.id;if(o.material)o.material=o.material.clone();}});return g;
 }
 const resourceMap=new Map(),animations=[],colliders=[];
 for(const r of HALL_RESOURCES){const g=new THREE.Group();g.position.set(r.at[0],0,r.at[1]);g.name='resource-'+r.id;g.userData.upgradeId=r.id;root.add(g);const basic=createVariant(r,false),upgraded=createVariant(r,true);upgraded.visible=false;g.add(basic,upgraded);const mark=new THREE.Mesh(new THREE.RingGeometry(.3,.34,24),new THREE.MeshBasicMaterial({color:0xf4ae43,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));mark.rotation.x=-Math.PI/2;mark.position.set(0,.07,0);mark.visible=false;g.add(mark);resourceMap.set(r.id,{...r,group:g,basic,upgraded,mark,owned:false});colliders.push([r.at[0]-r.size[0]/2,r.at[1]-r.size[1]/2,r.at[0]+r.size[0]/2,r.at[1]+r.size[1]/2]);}
 colliders.push([-.8,-.2,.8,1.5]);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function upgrade(id,{animate=true}={}){const r=resourceMap.get(id);if(!r)return false;if(r.owned)return true;r.owned=true;r.basic.visible=false;r.upgraded.visible=true;r.upgraded.scale.setScalar(1);r.mark.visible=false;if(animate&&!reduce){r.upgraded.scale.setScalar(.82);animations.push({r,start:performance.now(),duration:1800});}return true;}
 function reset(){animations.length=0;for(const r of resourceMap.values()){r.owned=false;r.basic.visible=true;r.upgraded.visible=false;r.upgraded.scale.setScalar(1);r.upgraded.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.setHex(0);o.material.emissiveIntensity=0;}});}}
 function frame(t){for(let i=animations.length-1;i>=0;i--){const a=animations[i],p=Math.min(1,(t-a.start)/a.duration),glow=Math.sin(p*Math.PI*3)**2*.4;a.r.upgraded.scale.setScalar(.82+.18*Math.min(1,p*3));a.r.upgraded.traverse(o=>{if(o.isMesh&&o.material.emissive){o.material.emissive.setHex(0xffd369);o.material.emissiveIntensity=p===1?0:glow;}});if(p===1)animations.splice(i,1);}}
 return {root,regionMats,baseRegionColors,colliders,resources:resourceMap,upgrade,reset,frame,inspect:()=>[...resourceMap.values()].map(r=>({id:r.id,owned:r.owned,variant:r.owned?'upgraded':'basic',at:r.at})),highlight:id=>{for(const r of resourceMap.values())r.mark.visible=r.id===id;}};
}
