import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CASES} from './cases-data.js';
const regions=[
 {name:'Operações',x:-3.1,z:1.7,color:0x607f92,mark:'017',w:3.5,d:3.7},
 {name:'Liderança',x:-2.9,z:-2.0,color:0x879e9b,mark:'018',w:3.5,d:3.1},
 {name:'Recursos Humanos',x:.3,z:-2.3,color:0x92a98e,mark:'019',w:2.9,d:2.9},
 {name:'Bem-estar',x:2.6,z:1.6,color:0x89a698,mark:'020',w:3.1,d:3.6},
 {name:'Tecnologia',x:3.2,z:-2.0,color:0x7394a7,mark:'021',w:2.5,d:3.0}
];
export async function setupWorld(container,onCase,onActor,onStatus){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xe0eaf0);
 const camera=new THREE.OrthographicCamera(-9,9,6,-6,.1,80);
 let target=new THREE.Vector3(0,0,0),desired=new THREE.Vector3(0,0,0),dist=13.0;
 camera.position.set(12,14,14);camera.lookAt(target);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 container.prepend(renderer.domElement);
 const light=new THREE.HemisphereLight(0xffffff,0xa9b9b0,2.3);scene.add(light);const sun=new THREE.DirectionalLight(0xffe4c5,2.4);sun.position.set(-5,14,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;scene.add(sun);
 const solid=(color)=>new THREE.MeshStandardMaterial({color,roughness:.8,metalness:.01});
 const mat={wall:solid(0xe5ebec),wood:solid(0xbe915f),dark:solid(0x3b5461),desk:solid(0xd5b08a),plant:solid(0x589171),floor:solid(0xd8dfe1),line:solid(0xeeb65c),screen:solid(0x27536a)};
 const box=(w,h,d,x,y,z,m,parent=scene)=>{const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.castShadow=h>.2;a.receiveShadow=true;parent.add(a);return a};
 box(11,.18,9,0,-.16,0,mat.floor);
 for(const r of regions){
 const g=new THREE.Group();g.position.set(r.x,0,r.z);scene.add(g);
 box(r.w,.06,r.d,0,-.03,0,solid(r.color),g);
 box(r.w,.77,.12,0,.38,-r.d/2,mat.wall,g);
 box(.1,.72,r.d,-r.w/2,.36,0,mat.wall,g);
 const positions=r.mark==='017'?[-.6,-.1,.6]:[-.55,.0,.7];
 if(r.mark==='017'){
  for(const k of [-1,0,1]){box(.65,1.15,.36,-1.1,.58,k*1.1,mat.dark,g);for(const y of [.4,.8,1.13])box(.58,.04,.4,-1.1,y,k*1.1,mat.wood,g)}
  box(.9,.4,.7,.72,.22,.65,solid(0xe6a946),g);box(.7,.19,.42,.75,.54,.65,mat.dark,g);
 }else if(r.mark==='021'){
  for(let i=0;i<3;i++){const x=-.7+i*.65;box(.51,1.35,.48,x,.68,-.35,mat.dark,g);for(let j=0;j<5;j++)box(.42,.09,.015,x,.3+j*.22,-.1,solid(0x44b5a2),g)}
 }else{
  box(1.55,.08,.78,0,.49,0,mat.desk,g);for(const x of [-.62,.62])box(.07,.47,.07,x,.23,0,mat.dark,g);
  box(.55,.42,.06,0,.78,-.13,mat.screen,g);box(.13,.21,.12,0,.56,-.1,mat.dark,g);
  if(r.mark==='020'){box(.76,.38,.5,-.95,.21,1.08,mat.wood,g);box(.45,.25,.7,.92,.17,.8,mat.dark,g)}
 }
 box(.23,.37,.23,r.w*.37,.19,-r.d*.35,mat.plant,g);
 const hit=box(r.w,.02,r.d,r.x,.02,r.z,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));hit.userData.caseId=r.mark;hit.material.side=THREE.DoubleSide;
 }
 const actorDefs=[{name:'Operadora',key:'operadora',file:'operadora',x:-3.3,z:2.3,caseId:'017',color:0xf2a24b},{name:'Psicóloga',key:'psicologa',file:'psicologa',x:2.0,z:2.1,caseId:'020',color:0x6ea27a},{name:'Psiquiatra',key:'psiquiatra',file:'psiquiatra',x:3.4,z:2.4,caseId:'020',color:0xb98b61}];
 const actors=[];const loader=new GLTFLoader();
 function fallbackActor(def){const g=new THREE.Group();g.position.set(def.x,0,def.z);const body=new THREE.Mesh(new THREE.CapsuleGeometry(.17,.53,4,12),solid(def.color));body.position.y=.75;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),solid(0xbe886a));head.position.y=1.33;g.add(head);scene.add(g);return g}
 for(const a of actorDefs){const fallback=fallbackActor(a);const actor={...a,root:fallback,placeholder:fallback,mixer:null,clips:null,state:'idle',time:0,goalX:a.x,goalZ:a.z,homeX:a.x,homeZ:a.z};actors.push(actor);
  loader.load(`/assets/actors/${a.file}.glb`,gl=>{
   const model=gl.scene;const bounds=new THREE.Box3().setFromObject(model);const size=bounds.getSize(new THREE.Vector3());let scale=1.58/Math.max(.01,size.y);scale=Math.min(100,scale);model.scale.setScalar(scale);model.updateMatrixWorld(true);
   const after=new THREE.Box3().setFromObject(model);model.position.set(a.x,-after.min.y,a.z);
   model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false}});
   scene.add(model);scene.remove(actor.placeholder);actor.root=model;actor.mixer=new THREE.AnimationMixer(model);actor.clips=gl.animations;
   const idle=gl.animations.find(c=>/idle|baselayer|clip0/i.test(c.name))||gl.animations[0];if(idle){actor.state='idle';actor.mixer.clipAction(idle).play()}
   onStatus(`${a.name} 3D carregada com ${gl.animations.length} animações`);
  },undefined,()=>onStatus(`Usando avatar provisório para ${a.name}`));
 }
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();const clicks=[];scene.traverse(o=>{if(o.userData.caseId)clicks.push(o)});
 renderer.domElement.addEventListener('click',e=>{const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(mouse,camera);
 const hits=ray.intersectObjects(actors.map(a=>a.root),true);if(hits.length){const h=hits[0].object;const actor=actors.find(a=>{let p=h;while(p){if(p===a.root)return true;p=p.parent}return false});if(actor){onActor(actor.key);return}}
 const regionHits=ray.intersectObjects(clicks);if(regionHits.length){onCase(regionHits[0].object.userData.caseId)}
 });
 function resize(){const w=container.clientWidth,h=container.clientHeight; if(w<4||h<4)return;renderer.setSize(w,h,false);const aspect=w/h;const base=dist/1.9;camera.left=-base*aspect;camera.right=base*aspect;camera.top=base;camera.bottom=-base;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(container);resize();
  // Keyboard moves the camera within the office hub; ignored while typing.
  const held=new Set();
  const panKeys={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'};
  const isEditable=el=>el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable);
  const handleDown=e=>{if(isEditable(e.target)||e.altKey||e.ctrlKey||e.metaKey)return;const key=panKeys[e.key.toLowerCase()];if(key){held.add(key);e.preventDefault()}};
  const handleUp=e=>{const key=panKeys[e.key.toLowerCase()];if(key)held.delete(key)};
  const resetHeld=()=>held.clear();
  window.addEventListener('keydown',handleDown);window.addEventListener('keyup',handleUp);window.addEventListener('blur',resetHeld);
 let last=performance.now(),on=true,choice='';const preferReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function frame(t){if(!on)return;requestAnimationFrame(frame);const dt=Math.min(.05,(t-last)/1000);last=t;
  if(held.size){
    const px=Number(held.has('right'))-Number(held.has('left'));
    const pz=Number(held.has('down'))-Number(held.has('up'));
    const magnitude=Math.hypot(px,pz)||1;
    desired.x=THREE.MathUtils.clamp(desired.x+px/magnitude*dt*3.4,-4,4);
    desired.z=THREE.MathUtils.clamp(desired.z+pz/magnitude*dt*3.4,-3.5,3.5);
  }
  target.lerp(desired,preferReduced?1:1-Math.exp(-dt*3.6));camera.position.set(target.x+12,target.y+13,target.z+13);camera.lookAt(target);
 for(const actor of actors){actor.mixer?.update(dt);if(actor.root){actor.time+=dt;actor.root.position.x=THREE.MathUtils.damp(actor.root.position.x,actor.goalX,2.8,dt);actor.root.position.z=THREE.MathUtils.damp(actor.root.position.z,actor.goalZ,2.8,dt);if(!actor.mixer){actor.root.position.y=Math.sin(actor.time*2)*.025;}if(actor.state==='walk'&&Math.hypot(actor.root.position.x-actor.goalX,actor.root.position.z-actor.goalZ)<.09){actor.state='idle';animate(actor.key,'idle')}}
 }
 renderer.render(scene,camera)}requestAnimationFrame(frame);
 function focus(id){const c=CASES.find(x=>x.id===id);if(!c){desired.set(0,.1,0);dist=13;resize();return}desired.set(c.at[0],0,c.at[1]);dist=7.7;resize();const act=actors.find(a=>a.caseId===id);const i=CASES.findIndex(x=>x.id===id);const cActors=c.actors;for(const [n,a] of actors.entries()){if(cActors.includes(a.key)){const index=cActors.indexOf(a.key);a.goalX=c.at[0]+(index?0.48:-0.36);a.goalZ=c.at[1]+(index?.5:-.36);animate(a.key,'walk')}else{a.goalX=a.homeX;a.goalZ=a.homeZ;}}}
 function animate(actorId,mode='talk'){
 const a=actors.find(x=>x.key===actorId);if(!a?.mixer||!a.clips)return false;
 const pattern=mode==='walk'?/walk/i:mode==='run'?/run/i:mode==='idle'?/idle|baselayer|clip0/i:/discuss|answer|sit|baselayer|clip0/i;
 const next=a.clips.find(c=>pattern.test(c.name))||a.clips[0];const current=a.mixer._actions?.find(x=>x.isRunning());const n=a.mixer.clipAction(next);if(current!==n){n.reset().play();if(current)n.crossFadeFrom(current,.34,true)}a.state=mode;return true;
 }
 return {focus,reset:()=>focus(null),animate,dispose:()=>{on=false;window.removeEventListener('keydown',handleDown);window.removeEventListener('keyup',handleUp);window.removeEventListener('blur',resetHeld);renderer.dispose();renderer.domElement.remove()},actorCount:()=>actors.length};
}
