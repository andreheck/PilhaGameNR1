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
const STATES={
 used:{color:0xd5c9a8,roughness:.91,mark:.10},
 precarious:{color:0xb9a77e,roughness:1,mark:.24},
 scrapped:{color:0x89816e,roughness:1,mark:.40}
};
const labels={used:'Usado',precarious:'Precário',scrapped:'Sucateado'};
function clearModel(){if(!active)return;scene.remove(active);active.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose()}});active=null}
function makeBook(){
 const g=new THREE.Group();g.name='procedural-book';
 const coverMat=new THREE.MeshStandardMaterial({color:0x426a72,roughness:.86});
 const pagesMat=new THREE.MeshStandardMaterial({color:0xe5d8b8,roughness:1});
 const cover=new THREE.Mesh(new THREE.BoxGeometry(.82,.13,.58),coverMat);cover.position.y=.065;g.add(cover);
 const pages=new THREE.Mesh(new THREE.BoxGeometry(.77,.105,.55),pagesMat);pages.position.set(.012,.066,0);g.add(pages);
 const spine=new THREE.Mesh(new THREE.BoxGeometry(.07,.14,.59),new THREE.MeshStandardMaterial({color:0x294c55,roughness:.9}));spine.position.set(-.375,.065,0);g.add(spine);
 return g;
}
function makeWear(model,state){
 const cfg=STATES[state];const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];const changed=mats.map(m=>{const n=m.clone();if(n.color)n.color.lerp(new THREE.Color(cfg.color),cfg.mark);n.roughness=Math.max(n.roughness??.6,cfg.roughness);return n});o.material=Array.isArray(o.material)?changed:changed[0]});
 const marks=new THREE.Group();marks.name='procedural-wear-details';
 const dark=new THREE.MeshStandardMaterial({color:state==='used'?0x827b68:0x5d5548,roughness:1,transparent:true,opacity:state==='used'?.18:state==='precarious'?.32:.48});
 const pale=new THREE.MeshStandardMaterial({color:0xe5d9b9,roughness:1,transparent:true,opacity:state==='used'?.15:.28});
 const frontZ=box.min.z-.012;const count=state==='used'?2:state==='precarious'?5:7;
 for(let i=0;i<count;i++){const w=Math.max(.025,size.x*(.035+(i%3)*.012)),h=Math.max(.008,size.y*.012);const mark=new THREE.Mesh(new THREE.BoxGeometry(w,h,.008),i%2?pale:dark);mark.position.set(center.x-size.x*.32+(i*.137%1)*size.x*.64,box.min.y+size.y*(.18+(i*.173%1)*.68),frontZ);marks.add(mark)}
 if(state!=='used'){
  const patch=new THREE.Mesh(new THREE.BoxGeometry(size.x*.13,.018,.018),dark);patch.position.set(center.x+size.x*.17,center.y+size.y*.12,frontZ-.02);patch.rotation.z=state==='scrapped'?.42:.18;marks.add(patch);
 }
 if(state==='scrapped'){
  const missing=new THREE.Mesh(new THREE.BoxGeometry(Math.max(.06,size.x*.12),Math.max(.04,size.y*.1),.025),new THREE.MeshStandardMaterial({color:0x252b2b,roughness:1}));missing.position.set(box.max.x-size.x*.12,box.max.y-size.y*.12,frontZ-.025);marks.add(missing);
 }
 model.add(marks);
}
async function show(){
 const token=++loadToken;status.textContent='Carregando modelo…';clearModel();
 try{
  const item=itemSelect.value;let model;
  if(item==='book')model=makeBook();
  else {const gltf=await loader.loadAsync(SOURCES[item]);if(token!==loadToken)return;model=gltf.scene;}
  if(token!==loadToken)return;
  active=model;active.position.set(0,0,0);
  const bounds=new THREE.Box3().setFromObject(active);const size=bounds.getSize(new THREE.Vector3());const scale=2.25/Math.max(size.x,size.y,size.z);active.scale.setScalar(scale);
  const scaled=new THREE.Box3().setFromObject(active);active.position.y=-scaled.min.y;
  makeWear(active,conditionSelect.value);scene.add(active);
  const finalBox=new THREE.Box3().setFromObject(active);const center=finalBox.getCenter(new THREE.Vector3());controls.target.copy(center);camera.position.set(center.x+3.6,center.y+2.5,center.z+5.2);camera.lookAt(center);
  status.textContent='Modelo carregado · '+labels[conditionSelect.value];
 }catch(err){status.textContent='Não foi possível carregar o modelo. Verifique a disponibilidade do GLB.';console.error(err)}
}
itemSelect.addEventListener('change',show);conditionSelect.addEventListener('change',show);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(stage);resize();show();
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
