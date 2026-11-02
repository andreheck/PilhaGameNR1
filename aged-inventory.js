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
const SOURCES={computerScreen:'/assets/kenney-furniture/computerScreen.glb',laptop:'/assets/kenney-furniture/laptop.glb'};
const STATES={
 used:{color:0xd5c9a8,roughness:.91,metalness:.0,mark:0.10,damage:0},
 precarious:{color:0xb9a77e,roughness:1,metalness:0,mark:.24,damage:1},
 scrapped:{color:0x89816e,roughness:1,metalness:0,mark:.40,damage:2}
};
function clearModel(){if(!active)return;scene.remove(active);active.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose()}});active=null}
function makeWear(model,state){
 const cfg=STATES[state];const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const mats=Array.isArray(o.material)?o.material:[o.material];const changed=mats.map(m=>{const n=m.clone();if(n.color)n.color.lerp(new THREE.Color(cfg.color),cfg.mark);n.roughness=Math.max(n.roughness??.6,cfg.roughness);n.metalness=Math.min(n.metalness??0,cfg.metalness);if(n.map)n.map=n.map;return n});o.material=Array.isArray(o.material)?changed:changed[0]});
 // Marks are restrained, non-structural surface cues. They are separate from source geometry.
 const marks=new THREE.Group();marks.name='procedural-wear-details';
 const dark=new THREE.MeshStandardMaterial({color:state==='used'?0x827b68:0x5d5548,roughness:1,transparent:true,opacity:state==='used'?.18:state==='precarious'?.32:.48});
 const pale=new THREE.MeshStandardMaterial({color:0xe5d9b9,roughness:1,transparent:true,opacity:state==='used'?.15:.28});
 const frontZ=box.min.z-.006;
 const count=state==='used'?2:state==='precarious'?5:7;
 for(let i=0;i<count;i++){const w=Math.max(.025,size.x*(.035+(i%3)*.012)),h=Math.max(.008,size.y*.012);const g=new THREE.BoxGeometry(w,h,.008);const m=new THREE.Mesh(g,i%2?pale:dark);m.position.set(center.x-size.x*.32+(i*.137%1)*size.x*.64,box.min.y+size.y*(.18+(i*.173%1)*.68),frontZ);marks.add(m)}
 if(cfg.damage>0){
  const crack=new THREE.Mesh(new THREE.BoxGeometry(size.x*(state==='scrapped'?.23:.12),.012,.012),dark);
  crack.position.set(center.x+size.x*.16,center.y+size.y*.13,frontZ-.012);crack.rotation.z=state==='scrapped'?-.42:-.2;marks.add(crack);
 }
 if(state==='scrapped'){
  const missing=new THREE.Mesh(new THREE.BoxGeometry(size.x*.14,size.y*.12,.025),new THREE.MeshStandardMaterial({color:0x252b2b,roughness:1}));
  missing.position.set(box.max.x-size.x*.12,box.max.y-size.y*.12,frontZ-.018);marks.add(missing);
 }
 model.add(marks);
}
async function show(){
 const token=++loadToken;status.textContent='Carregando modelo…';clearModel();
 try{const gltf=await loader.loadAsync(SOURCES[itemSelect.value]);if(token!==loadToken)return;
 active=gltf.scene;active.position.set(0,0,0);const bounds=new THREE.Box3().setFromObject(active);const size=bounds.getSize(new THREE.Vector3());const scale=2.25/Math.max(size.x,size.y,size.z);active.scale.setScalar(scale);const scaled=new THREE.Box3().setFromObject(active);active.position.y=-scaled.min.y;
 makeWear(active,conditionSelect.value);scene.add(active);
 const finalBox=new THREE.Box3().setFromObject(active);const center=finalBox.getCenter(new THREE.Vector3());controls.target.copy(center);camera.position.set(center.x+3.6,center.y+2.5,center.z+5.2);camera.lookAt(center);
 status.textContent='Modelo carregado · '+({used:'Usado',precarious:'Precário',scrapped:'Sucateado'}[conditionSelect.value]);
 }catch(err){status.textContent='Não foi possível carregar o modelo. Verifique a disponibilidade do GLB.';console.error(err)}
}
itemSelect.addEventListener('change',show);conditionSelect.addEventListener('change',show);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
new ResizeObserver(resize).observe(stage);resize();show();
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
