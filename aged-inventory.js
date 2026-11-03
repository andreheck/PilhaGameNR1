import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const stage=document.querySelector('#stage'),status=document.querySelector('#status');
const itemSelect=document.querySelector('#item'),conditionSelect=document.querySelector('#condition');
const scene=new THREE.Scene();scene.background=new THREE.Color(0xdce7e3);
const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(3.8,3.0,5.6);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;stage.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x89958c,2.1));
const key=new THREE.DirectionalLight(0xffe6c8,2.4);key.position.set(-4,7,5);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0xc7dce8,.9);fill.position.set(4,3,-4);scene.add(fill);
const floor=new THREE.Mesh(new THREE.CircleGeometry(4,64),new THREE.MeshStandardMaterial({color:0xe8e8df,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-.025;floor.receiveShadow=true;scene.add(floor);
const grid=new THREE.GridHelper(7,28,0x9aada7,0xcbd5cf);grid.position.y=-.018;scene.add(grid);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.7,0);controls.enableDamping=true;controls.minDistance=2;controls.maxDistance=10;
const loader=new GLTFLoader();let active=null,loadToken=0;
const SOURCES={computerScreen:'/assets/kenney-furniture/computerScreen.glb',laptop:'/assets/kenney-furniture/laptop.glb',desk:'/assets/kenney-furniture/desk.glb',chairDesk:'/assets/kenney-furniture/chairDesk.glb',bookcaseOpen:'/assets/kenney-furniture/bookcaseOpen.glb'};
const STATES={used:{color:0xd5c9a8,roughness:.91,mark:.10},precarious:{color:0xb9a77e,roughness:1,mark:.24},scrapped:{color:0x89816e,roughness:1,mark:.40}};
const labels={used:'Usado',precarious:'Precário',scrapped:'Sucateado'};
function clearModel(){if(!active)return;scene.remove(active);active.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose()}});active=null}
function makeBook(){
 const g=new THREE.Group();g.name='procedural-book';
 const cover=new THREE.Mesh(new THREE.BoxGeometry(.82,.13,.58),new THREE.MeshStandardMaterial({color:0x426a72,roughness:.86}));cover.position.y=.065;g.add(cover);
 const pages=new THREE.Mesh(new THREE.BoxGeometry(.77,.105,.55),new THREE.MeshStandardMaterial({color:0xe5d8b8,roughness:1}));pages.position.set(.012,.066,0);g.add(pages);
 const spine=new THREE.Mesh(new THREE.BoxGeometry(.07,.14,.59),new THREE.MeshStandardMaterial({color:0x294c55,roughness:.9}));spine.position.set(-.375,.065,0);g.add(spine);
 return g;
}
function localBounds(root){
 root.updateMatrixWorld(true);
 const inverse=root.matrixWorld.clone().invert(),box=new THREE.Box3();
 root.traverse(o=>{if(!o.isMesh||!o.geometry)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld));box.union(b)});
 return box;
}
function boxPart(group,material,size,position,rotation=0){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(size.x,size.y,size.z),material);mesh.position.copy(position);mesh.rotation.z=rotation;group.add(mesh);return mesh;
}
function makeWear(model,item,state){
 const cfg=STATES[state];
 model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];const changed=mats.map(m=>{const n=m.clone();if(n.color)n.color.lerp(new THREE.Color(cfg.color),cfg.mark);n.roughness=Math.max(n.roughness??.6,cfg.roughness);return n});o.material=Array.isArray(o.material)?changed:changed[0]});
 const bounds=localBounds(model),size=bounds.getSize(new THREE.Vector3()),c=bounds.getCenter(new THREE.Vector3());
 const details=new THREE.Group();details.name='object-specific-wear';
 const dark=new THREE.MeshStandardMaterial({color:state==='scrapped'?0x282b2a:0x665b49,roughness:1});
 const rust=new THREE.MeshStandardMaterial({color:0x8b5436,roughness:1});
 const pale=new THREE.MeshStandardMaterial({color:0xd9c9a6,roughness:1});
 const front=bounds.max.z+Math.max(.008,size.z*.012);
 if(state==='used'){
  // Small, varied contact wear: limited to a few edges, not a uniform dirt overlay.
  for(let i=0;i<3;i++)boxPart(details,pale,new THREE.Vector3(size.x*.045,.008,.006),new THREE.Vector3(bounds.min.x+size.x*(.18+i*.29),bounds.min.y+size.y*.72,front));
 }
 if(state==='precarious'||state==='scrapped'){
  if(item==='computerScreen'||item==='laptop'){
   // Screen fracture: branching lines on the camera-facing plane.
   const w=size.x*(state==='scrapped'?.30:.18),h=size.y*(state==='scrapped'?.24:.13);
   boxPart(details,dark,new THREE.Vector3(w,.012,.012),new THREE.Vector3(c.x+size.x*.08,c.y+size.y*.10,front),-.42);
   boxPart(details,dark,new THREE.Vector3(.012,h,.012),new THREE.Vector3(c.x+size.x*.08-w*.34,c.y+size.y*.10+h*.36,front),.28);
   if(state==='scrapped')boxPart(details,dark,new THREE.Vector3(w*.42,.01,.012),new THREE.Vector3(c.x+size.x*.18,c.y+size.y*.23,front),.68);
  }else if(item==='desk'){
   // Exposed, worn corner and a rusted repair plate.
   boxPart(details,rust,new THREE.Vector3(size.x*.16,.018,.018),new THREE.Vector3(bounds.min.x+size.x*.16,bounds.max.y-size.y*.04,front));
   if(state==='scrapped')boxPart(details,dark,new THREE.Vector3(size.x*.18,.045,.045),new THREE.Vector3(bounds.min.x+size.x*.12,bounds.min.y+size.y*.16,bounds.min.z+size.z*.18),-.22);
  }else if(item==='chairDesk'){
   // Worn arm/seat edge plus a dark wheel/socket cue near the base.
   boxPart(details,rust,new THREE.Vector3(size.x*.24,.018,.018),new THREE.Vector3(c.x,c.y-size.y*.08,front));
   if(state==='scrapped')boxPart(details,dark,new THREE.Vector3(size.x*.10,size.y*.055,size.z*.10),new THREE.Vector3(bounds.max.x-size.x*.10,bounds.min.y+size.y*.07,c.z));
  }else if(item==='bookcaseOpen'){
   // A visibly sagging shelf cue and corroded bracket.
   boxPart(details,rust,new THREE.Vector3(size.x*.62,.018,.018),new THREE.Vector3(c.x,c.y-size.y*.10,front),state==='scrapped'?.045:.018);
   boxPart(details,dark,new THREE.Vector3(.025,size.y*.10,.025),new THREE.Vector3(bounds.min.x+size.x*.18,c.y-size.y*.10,front));
  }else if(item==='book'){
   // Torn cover corner with exposed page tone.
   boxPart(details,pale,new THREE.Vector3(size.x*.22,.012,.018),new THREE.Vector3(bounds.max.x-size.x*.13,bounds.max.y-size.y*.10,front),-.48);
   if(state==='scrapped')boxPart(details,dark,new THREE.Vector3(size.x*.12,.014,.018),new THREE.Vector3(bounds.min.x+size.x*.12,c.y,front),.32);
  }
 }
 model.add(details);
}
async function show(){
 const token=++loadToken;status.textContent='Carregando modelo…';clearModel();
 try{
  const item=itemSelect.value;let model;
  if(item==='book')model=makeBook();
  else{const gltf=await loader.loadAsync(SOURCES[item]);if(token!==loadToken)return;model=gltf.scene;}
  if(token!==loadToken)return;
  active=model;active.position.set(0,0,0);
  const bounds=new THREE.Box3().setFromObject(active),size=bounds.getSize(new THREE.Vector3());active.scale.setScalar(2.25/Math.max(size.x,size.y,size.z));
  const scaled=new THREE.Box3().setFromObject(active);active.position.y=-scaled.min.y;
  makeWear(active,item,conditionSelect.value);scene.add(active);
  const finalBox=new THREE.Box3().setFromObject(active),center=finalBox.getCenter(new THREE.Vector3());controls.target.copy(center);camera.position.set(center.x+3.6,center.y+2.5,center.z+5.2);camera.lookAt(center);
  status.textContent='Modelo carregado · '+labels[conditionSelect.value];
 }catch(err){status.textContent='Não foi possível carregar o modelo. Verifique a disponibilidade do GLB.';console.error(err)}
}
itemSelect.addEventListener('change',show);conditionSelect.addEventListener('change',show);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(stage);resize();show();
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
