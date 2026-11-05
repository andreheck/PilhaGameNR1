import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createOpenHall} from './open-hall.js';
import {HALL_RESOURCES} from './resource-catalog.js';
import {CASES} from './cases-data.js';
import {moveSafely} from './simulation/navigation.js';
const regions=[
 {name:'Operações',x:-4.7,z:2.7,color:0x607f92,mark:'01',w:4.3,d:4.1},
 {name:'Liderança',x:-4.8,z:-3.0,color:0x879e9b,mark:'02',w:4.1,d:3.3},
 {name:'Recursos Humanos',x:-.1,z:-3.2,color:0x92a98e,mark:'03',w:3.5,d:3.1},
 {name:'Bem-estar',x:3.2,z:2.7,color:0x89a698,mark:'04',w:3.7,d:4.1},
 {name:'Tecnologia',x:3.8,z:-3.0,color:0x7394a7,mark:'05',w:3.0,d:3.3}
];
export async function setupWorld(container,onCase,onActor,onStatus){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xeaf2f5);
 const camera=new THREE.OrthographicCamera(-13,13,9,-9,.1,100);
 let target=new THREE.Vector3(0,0,0),desired=new THREE.Vector3(0,0,0),dist=18.0;let zoomFactor=1;container.dataset.loadedActors='0';
 camera.position.set(16,18,16);camera.lookAt(target);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 container.prepend(renderer.domElement);
 const light=new THREE.HemisphereLight(0xffffff,0xa9b9b0,2.3);scene.add(light);const sun=new THREE.DirectionalLight(0xffe4c5,2.4);sun.position.set(-5,14,8);sun.castShadow=true;sun.shadow.mapSize.set(512,512);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;scene.add(sun);
 const solid=(color)=>new THREE.MeshStandardMaterial({color,roughness:.8,metalness:.01});
 const mat={wall:solid(0xe5ebec),wood:solid(0xbe915f),dark:solid(0x3b5461),desk:solid(0xd5b08a),plant:solid(0x589171),floor:solid(0xd8dfe1),line:solid(0xeeb65c),screen:solid(0x27536a)};
 const box=(w,h,d,x,y,z,m,parent=scene)=>{const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);a.position.set(x,y,z);a.castShadow=h>.2;a.receiveShadow=true;parent.add(a);return a};
 const hall=createOpenHall(scene,regions);const {regionMats,baseRegionColors}=hall;const regionFx=[];let activeRegion='01',currentSceneState=null;
 const makeEmoji=(emoji)=>{const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');x.beginPath();x.fillStyle='#102d43';x.arc(64,64,57,0,Math.PI*2);x.fill();x.font='68px Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(emoji,64,68);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));sprite.scale.set(.42,.42,1);return sprite;};
 const actorDefs=[{name:'Operadora',key:'operadora',path:'actors/operadora.glb',x:-4.5,z:1.1,caseId:'01',color:0xf2a24b,emoji:'😮‍💨'},{name:'Psicóloga',key:'psicologa',path:'actors/psicologa.glb',x:2.1,z:2.15,caseId:'04',color:0x6ea27a,emoji:'🤝'},{name:'Psiquiatra',key:'psiquiatra',path:'actors/psiquiatra.glb',x:4.85,z:1.25,caseId:'04',color:0xb98b61,emoji:'🩺'},{name:'Mentor PilhA+',key:'gestor',path:'actors/mentor-pilha.glb',x:0,z:2.25,caseId:'02',color:0x547c95,emoji:'😶'},{name:'Mentora da biblioteca',key:'mentora',path:'actors/mentora-biblioteca.glb',x:.55,z:-4.9,caseId:'03',color:0xc99734,emoji:'📚'}];
 const actors=[];const loader=new GLTFLoader();
 const STATE_DEFS={idle:{duration:2200,pattern:/idle|baselayer|clip0/i,color:0x6d8a95},working:{duration:4800,pattern:/work|typing|baselayer|clip0/i,color:0x5d9c7d},exploring:{duration:6200,pattern:/walk/i,color:0xf0b45c},talking:{duration:3200,pattern:/discuss|answer|sit|baselayer|clip0/i,color:0x7394a7},pausing:{duration:3600,pattern:/idle|sit|baselayer|clip0/i,color:0x8ac6a3},concerned:{duration:9000,pattern:/idle|baselayer|clip0/i,color:0xd66d63}};
 const managementGroup=new THREE.Group();managementGroup.name='management-decision-feedback';managementGroup.visible=false;scene.add(managementGroup);const managementBuild=[];let managementStarted=0;let managementDecision=null;const actorHighlights=[];let focusedActor=null;
 const effects=new THREE.Group();effects.name='case01-persistent-effects';scene.add(effects);
 const notifications=new THREE.Group();notifications.name='scene-improvement-notifications';scene.add(notifications);
 const case02Objects=new THREE.Group();case02Objects.name='case02-built-objects';case02Objects.visible=false;scene.add(case02Objects);
 const libraryFurniture=new THREE.Group();libraryFurniture.name='integrated-nr1-library';scene.add(libraryFurniture);
 const officeProps=new THREE.Group();officeProps.name='kenney-cc0-office-furniture';scene.add(officeProps);
 const meetingTable=box(1.35,.12,.72,-2.9,.54,-1.68,mat.wood,case02Objects);for(const x of [-3.35,-2.45])box(.08,.48,.08,x,.27,-1.68,mat.dark,case02Objects);for(const x of [-3.42,-2.38])box(.36,.18,.28,x,.21,-1.68,mat.desk,case02Objects);
 const feedbackBoard=box(1.05,.78,.08,-2.9,1.0,-3.48,mat.wall,case02Objects);for(const x of [-3.25,-2.95,-2.65])box(.16,.2,.04,x,1.0,-3.54,solid(0x6ea27a),case02Objects);
 const speakingBeacon=new THREE.Mesh(new THREE.TorusGeometry(.55,.045,8,32),new THREE.MeshBasicMaterial({color:0xf3a24a,transparent:true,opacity:.9}));speakingBeacon.rotation.x=-Math.PI/2;speakingBeacon.position.set(-2.9,.08,-1.68);case02Objects.add(speakingBeacon);
 const effectMat=(color,opacity=1,emissive=0x000000)=>new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.05,transparent:opacity<1,opacity,emissive,emissiveIntensity:emissive?1.2:0});
 const pauseZone=new THREE.Group();pauseZone.name='pause-zone-protected';pauseZone.visible=false;effects.add(pauseZone);
 const pauseFloor=new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,.035,32),effectMat(0x55b58b,.72,0x1d523d));pauseFloor.position.set(-2.15,.04,2.58);pauseZone.add(pauseFloor);
 const pauseTable=box(.82,.11,.48,-2.15,.72,2.58,effectMat(0xd1a36f),pauseZone);for(const x of [-2.48,-1.82])box(.08,.55,.08,x,.38,2.58,effectMat(0x405c62),pauseZone);
 for(const x of [-2.55,-1.75])box(.42,.16,.26,x,.26,2.58,effectMat(0x76a9a0),pauseZone);
 const pauseBeacon=new THREE.Mesh(new THREE.TorusGeometry(.56,.035,8,32),effectMat(0x8fe1b9,.85,0x2d906a));pauseBeacon.rotation.x=-Math.PI/2;pauseBeacon.position.set(-2.15,.09,2.58);pauseZone.add(pauseBeacon);
 const capacityZone=new THREE.Group();capacityZone.name='capacity-rebalanced';capacityZone.visible=false;effects.add(capacityZone);
 const capacityPlate=new THREE.Mesh(new THREE.BoxGeometry(1.05,.045,.62),effectMat(0x4d9c82,.86,0x245c4c));capacityPlate.position.set(-3.62,.06,1.18);capacityZone.add(capacityPlate);
 for(const x of [-3.95,-3.62,-3.29]){const crate=box(.22,.28,.32,x,.2,1.18,effectMat(0xe0ad62),capacityZone);crate.userData.persistent=true;}
 const warningZone=new THREE.Group();warningZone.name='confidentiality-warning';warningZone.visible=false;effects.add(warningZone);
 const warningBase=new THREE.Mesh(new THREE.CylinderGeometry(.3,.36,.08,24),effectMat(0xd66d63,.9,0x702e2e));warningBase.position.set(2.6,.05,1.6);warningZone.add(warningBase);
 const warningBeacon=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,.62,16),effectMat(0xed7666,.82,0x9d3f35));warningBeacon.position.set(2.6,.38,1.6);warningZone.add(warningBeacon);
 function setEffectsVisible(state){const flags=new Set(state?.visualFlags||[]);pauseZone.visible=flags.has('breaks-protected');capacityZone.visible=flags.has('capacity-rebalanced');warningZone.visible=flags.has('confidentiality-warning');case02Objects.visible=state?.caseId==='02'&&(flags.has('meeting-safe')||flags.has('leadership-board')||flags.has('feedback-loop'));speakingBeacon.visible=flags.has('meeting-safe');feedbackBoard.visible=flags.has('leadership-board')||flags.has('feedback-loop');meetingTable.visible=flags.has('meeting-safe');}
 function fallbackActor(def){const g=new THREE.Group();g.position.set(def.x,0,def.z);g.name=def.key+'-loading';scene.add(g);return g;}
 for(const a of actorDefs){const fallback=fallbackActor(a);const emotionSprite=makeEmoji(a.emoji);emotionSprite.position.set(a.x,2.2,a.z);scene.add(emotionSprite);const actor={...a,root:fallback,placeholder:fallback,mixer:null,clips:null,state:'idle',stateSince:performance.now(),stateUntil:performance.now()+2200,time:0,goalX:a.x,goalZ:a.z,homeX:a.x,homeZ:a.z,route:[],routeIndex:0,routineIndex:0,nextRoutineAt:performance.now()+1800,emotionSprite,emotionBase:a.emoji};actors.push(actor);const shadow=new THREE.Mesh(new THREE.CircleGeometry(.34,24),new THREE.MeshBasicMaterial({color:0x173746,transparent:true,opacity:.16,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(a.x,.012,a.z);scene.add(shadow);const highlight=new THREE.Mesh(new THREE.RingGeometry(.25,.29,24),new THREE.MeshBasicMaterial({color:a.color,transparent:true,opacity:.72,side:THREE.DoubleSide,depthWrite:false}));highlight.rotation.x=-Math.PI/2;highlight.position.set(a.x,.025,a.z);highlight.visible=false;scene.add(highlight);actor.shadow=shadow;actor.highlight=highlight;actorHighlights.push(highlight);
  if(!a.path){continue;}
  loader.load(`/assets/${a.path}`,gl=>{
   const model=gl.scene;const bounds=new THREE.Box3().setFromObject(model);const size=bounds.getSize(new THREE.Vector3());let scale=1.72/Math.max(.01,size.y);model.scale.setScalar(Math.min(100,scale));model.updateMatrixWorld(true);
   const after=new THREE.Box3().setFromObject(model);model.position.set(0,-after.min.y,0);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false}});
   const wrapper=new THREE.Group();wrapper.position.copy(actor.root.position);wrapper.add(model);scene.add(wrapper);scene.remove(actor.placeholder);actor.root=wrapper;actor.mixer=new THREE.AnimationMixer(model);actor.clips=gl.animations;actor.loaded=true;
   const idle=gl.animations.find(c=>/idle/i.test(c.name))||gl.animations.find(c=>/talk|discuss|wave|baselayer/i.test(c.name));if(idle){actor.state='idle';actor.mixer.clipAction(idle).play()}
   container.dataset.loadedActors=String(actors.filter(a=>a.loaded).length);onStatus(`${actors.filter(a=>a.loaded).length}/${actorDefs.length} personagens carregados`);
  },undefined,()=>{actor.failed=true;onStatus(`Modelo de ${a.name} indisponível; use a ficha da equipe.`)});
 }

 const onResource=id=>{hall.highlight(id);container.dispatchEvent(new CustomEvent('pilha:resource-select',{bubbles:true,detail:{id}}));};
 const layer=document.createElement('div');layer.className='resource-tags';container.append(layer);
 layer.innerHTML=HALL_RESOURCES.map(r=>`<button type="button" class="resource-pin" data-resource="${r.id}" aria-label="Melhorar ${r.name}" title="${r.name}"><span>+</span></button>`).join('');
 const project=(x,z,y=1.4)=>{const v=new THREE.Vector3(x,y,z).project(camera);return {x:(v.x+1)*.5*container.clientWidth,y:(1-v.y)*.5*container.clientHeight,visible:v.z>=-1&&v.z<=1}};
 function updateTags(){for(const r of regions){const el=container.querySelector(`.point[data-case="${r.mark}"]`);if(!el)continue;const p=project(r.x,r.z,1.85);el.style.left=Math.max(46,Math.min(container.clientWidth-46,p.x))+'px';el.style.top=Math.max(20,Math.min(container.clientHeight-30,p.y))+'px';el.classList.toggle('active',activeRegion===r.mark)}for(const r of HALL_RESOURCES){const el=layer.querySelector(`[data-resource="${r.id}"]`),p=project(...r.at,1.15);el.style.left=p.x+'px';el.style.top=p.y+'px';el.hidden=!p.visible;el.classList.toggle('owned',hall.resources.get(r.id).owned);el.firstElementChild.textContent=hall.resources.get(r.id).owned?'✓':'+';}}
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();const clicks=[];scene.traverse(o=>{if(o.userData.caseId)clicks.push(o)});
 renderer.domElement.addEventListener('click',e=>{const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(mouse,camera);
 const hits=ray.intersectObjects(actors.map(a=>a.root),true);if(hits.length){const h=hits[0].object;const actor=actors.find(a=>{let p=h;while(p){if(p===a.root)return true;p=p.parent}return false});if(actor){onActor(actor.key);return}}
 const resourceHits=ray.intersectObjects([...hall.resources.values()].map(r=>r.owned?r.upgraded:r.basic),true);if(resourceHits.length){const id=resourceHits[0].object.userData.upgradeId;if(id){onResource(id);return}}
 const regionHits=ray.intersectObjects(clicks);if(regionHits.length){onCase(regionHits[0].object.userData.caseId)}
 });
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(w<4||h<4)return;renderer.setSize(w,h,false);const aspect=w/h;const base=Math.max(7.8,12.4/aspect)*zoomFactor;camera.left=-base*aspect;camera.right=base*aspect;camera.top=base;camera.bottom=-base;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(container);resize();
  // Keyboard moves the camera within the office hub; ignored while typing.
  const held=new Set();
  const panKeys={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'};
  const isEditable=el=>document.querySelector('.pi-root')||document.querySelector('#welcome-alert:not([hidden])')||(el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable));
  const handleDown=e=>{if(isEditable(e.target)||e.altKey||e.ctrlKey||e.metaKey)return;const key=panKeys[e.key.toLowerCase()];if(key){held.add(key);e.preventDefault()}};
  const handleUp=e=>{const key=panKeys[e.key.toLowerCase()];if(key)held.delete(key)};
  const resetHeld=()=>held.clear();
  window.addEventListener('keydown',handleDown);window.addEventListener('keyup',handleUp);window.addEventListener('blur',resetHeld);
 const routines={operadora:[[-4.5,1.1],[-4.4,.3],[-1.4,.3]],psicologa:[[2.1,2.15],[1.35,2.3],[1.35,.3]],psiquiatra:[[4.85,1.25],[4.8,.2],[6.8,.2]],gestor:[[0,2.25],[.9,2.4],[.9,4.9]],mentora:[[.55,-4.9],[2.5,-4.9],[2.5,-1.5]]};
 const safeRoutes={
  operadora:{'01':[[ -3.3,2.3],[-3.3,2.0],[-3.3,2.3]]},
  psicologa:{'01':[[2,2.1],[1.35,1.1],[0,0],[-1.35,1.1],[-3.9,2.3]],'02':[[2,2.1],[1.8,-.8],[0,0],[-2.9,-2.35]]},
  psiquiatra:{'01':[[3.4,2.4],[3.8,1.0],[0,0],[-3.9,2.3]],'02':[[3.4,2.4],[2.4,-1.0],[0,0],[-2.9,-2.35]]},
  gestor:{'02':[[.7,-2.55],[-1.0,-2.55],[-2.9,-2.35]]}
 };
 const clampWalk=(x,z)=>[THREE.MathUtils.clamp(x,-7.55,7.55),THREE.MathUtils.clamp(z,-5.75,5.75)];
 const collisionRects=hall.colliders;
 const safeStep=(x,z,actor)=>{const current={x:actor.root.position.x,z:actor.root.position.z};const next=moveSafely(current,{x,z},collisionRects,{minX:-8.5,maxX:8.5,minZ:-6.3,maxZ:6.3},.18);if(next.blocked&&Math.hypot(next.x-current.x,next.z-current.z)<.001){actor.goalX=current.x;actor.goalZ=current.z;actor.route=[];actor.routeIndex=0;actor.state='pausing';actor.stateUntil=performance.now()+1500;}return [next.x,next.z]};
 function setActorState(actor,state,now=performance.now()){const def=STATE_DEFS[state]||STATE_DEFS.idle;actor.state=state;actor.stateSince=now;actor.stateUntil=now+def.duration;actor.highlight?.material.color.setHex(def.color);const mode=state==='exploring'?'walk':state==='talking'?'talk':state==='working'?'work':state==='pausing'?'pause':state==='concerned'?'concerned':'idle';animate(actor.key,mode);}
 function buildManagement(decision){managementGroup.clear();managementBuild.length=0;const positive=decision.key==='protect',negative=decision.key==='dismiss';const color=positive?0x65b894:negative?0xd66d63:0xf0b45c;const x=positive?-2.15:negative?-3.65:-.2,z=positive?2.58:negative?1.18:-.2;const base=new THREE.Mesh(new THREE.BoxGeometry(1.15,.08,.72),effectMat(color,.92,positive?0x1e6546:negative?0x702e2e:0x8c5e1c));base.position.set(x,.06,z);managementGroup.add(base);managementBuild.push({mesh:base,targetY:.06});const marker=new THREE.Mesh(new THREE.TorusGeometry(.48,.055,8,28),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95}));marker.rotation.x=-Math.PI/2;marker.position.set(x,.13,z);managementGroup.add(marker);managementBuild.push({mesh:marker,targetY:.13});if(positive){for(const px of [x-.34,x,x+.34]){const cube=box(.22,.55,.22,px,.28,z,solid(0xd7a769),managementGroup);cube.scale.y=.01;managementBuild.push({mesh:cube,targetY:.28});}}else{const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.13,.18,.7,16),effectMat(color,.9,negative?0x9d3f35:0x8c5e1c));beacon.position.set(x,.38,z);managementGroup.add(beacon);managementBuild.push({mesh:beacon,targetY:.38});}}
 function applyManagementDecision(decision){managementDecision=decision;managementGroup.visible=true;managementStarted=performance.now();buildManagement(decision);const actor=actors.find(a=>a.key==='operadora');if(actor){setEmotion(actor,decision.emoji);setActorState(actor,decision.state);if(decision.key==='dismiss')actor.nextRoutineAt=Infinity;else actor.nextRoutineAt=performance.now()+1800;}regionMats['01']?.color.setHex(decision.key==='protect'?0x4f9678:decision.key==='dismiss'?0xb86b59:0xd39b62);onStatus(`${decision.emoji} ${decision.key==='dismiss'?'estado não atendido · risco persistente':decision.key==='protect'?'medida de proteção construída · 30 dias':'monitoramento sem intervenção · 30 dias'}`);}

 function applyInvestmentUpgrade(upgrade,options={}){if(!upgrade?.id)return false;const changed=hall.upgrade(upgrade.id,options);if(changed&&options.animate!==false){hall.highlight(upgrade.id);onStatus(`Melhoria instalada: ${upgrade.name}. Recurso transformado; efeitos educativos acompanhados em 30 dias.`);}return changed;}
 function resetInvestmentUpgrades(){hall.reset();onStatus('Melhorias reiniciadas; recursos na condição inicial.');}
 function beginRoutine(actor,now){const points=routines[actor.key];if(!points?.length||!actor.mixer)return;actor.route=points;actor.routeIndex=0;const point=points[actor.routineIndex%points.length];actor.routineIndex=(actor.routineIndex+1)%points.length;actor.goalX=point[0];actor.goalZ=point[1];setActorState(actor,'exploring',now);actor.nextRoutineAt=now+7000+Math.random()*5000;onStatus(`${actor.name} · rotina de exploração ativa`);}
 let last=performance.now(),on=true,choice='',lastRender=0;const preferReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function frame(t){if(!on)return;requestAnimationFrame(frame);if(t-lastRender<(innerWidth<760?40:28))return;lastRender=t;const dt=Math.min(.05,(t-last)/1000);last=t;
  for(const fx of regionFx){const on=fx.id===activeRegion;fx.mesh.visible=on; if(on){const pulse=.98+Math.sin(t*.004)*.09;fx.mesh.scale.setScalar(pulse);fx.mesh.material.opacity=.18+Math.sin(t*.004)*.06}}
  if(pauseZone.visible){const pulse=.98+Math.sin(t*.003)*.06;pauseBeacon.scale.setScalar(pulse)}
  if(warningZone.visible){warningBeacon.scale.y=.92+Math.sin(t*.006)*.16;warningBeacon.material.emissiveIntensity=1.0+Math.sin(t*.006)*.45}if(speakingBeacon.visible){speakingBeacon.scale.setScalar(1+Math.sin(t*.005)*.08)}
  if(held.size){
    const px=Number(held.has('right'))-Number(held.has('left'));
    const pz=Number(held.has('down'))-Number(held.has('up'));
    const magnitude=Math.hypot(px,pz)||1;
    desired.x=THREE.MathUtils.clamp(desired.x+px/magnitude*dt*3.4,-7.2,7.2);
    desired.z=THREE.MathUtils.clamp(desired.z+pz/magnitude*dt*3.4,-5.5,5.5);
  }
  target.lerp(desired,preferReduced?1:1-Math.exp(-dt*3.6));camera.position.set(target.x+13,target.y+16,target.z+16);camera.lookAt(target);
 for(const actor of actors){actor.mixer?.update(dt);if(actor.root){if(managementBuild.length&&managementStarted){const progress=Math.min(1,(t-managementStarted)/900);for(const item of managementBuild)item.mesh.scale.y=Math.max(.01,progress);if(progress>=1)managementStarted=0;}if(actor.state==='idle'&&t>actor.nextRoutineAt&&!focusedActor)beginRoutine(actor,t);if(actor.state==='pausing'&&t>actor.stateUntil){setActorState(actor,'working',t);actor.nextRoutineAt=t+4800;}else if(actor.state==='working'&&t>actor.stateUntil){setActorState(actor,'idle',t);actor.nextRoutineAt=t+900;}actor.time+=dt;const dx=actor.goalX-actor.root.position.x,dz=actor.goalZ-actor.root.position.z;const distance=Math.hypot(dx,dz);const [nextX,nextZ]=safeStep(THREE.MathUtils.damp(actor.root.position.x,actor.goalX,2.8,dt),THREE.MathUtils.damp(actor.root.position.z,actor.goalZ,2.8,dt),actor);actor.root.position.x=nextX;actor.root.position.z=nextZ;if(actor.state==='exploring'&&distance>.08)actor.root.rotation.y=THREE.MathUtils.damp(actor.root.rotation.y,Math.atan2(dx,dz),8,dt);if(!actor.mixer){actor.root.position.y=Math.sin(actor.time*2)*.025;}if(actor.shadow){actor.shadow.position.x=actor.root.position.x;actor.shadow.position.z=actor.root.position.z;actor.shadow.scale.setScalar(actor.state==='exploring'?.92:1)}if(actor.emotionSprite){actor.emotionSprite.position.x=actor.root.position.x;actor.emotionSprite.position.z=actor.root.position.z;actor.emotionSprite.visible=focusedActor===actor.key;actor.emotionSprite.position.y=actor.root.position.y+2.12}if(actor.highlight){actor.highlight.position.x=actor.root.position.x;actor.highlight.position.z=actor.root.position.z;const active=focusedActor===actor.key||actor.state==='exploring';actor.highlight.visible=active;actor.highlight.scale.setScalar(active?1+Math.sin(actor.time*5)*.08:1)}if(actor.state==='exploring'&&distance<.09){if(actor.route.length&&actor.routeIndex<actor.route.length-1){actor.routeIndex++;actor.goalX=actor.route[actor.routeIndex][0];actor.goalZ=actor.route[actor.routeIndex][1];}else{setActorState(actor,'pausing',t);actor.nextRoutineAt=t+3600;}}}}
 hall.frame(t);updateTags();renderer.render(scene,camera)}requestAnimationFrame(frame);
 function focus(id){focusedActor=null;const c=CASES.find(x=>x.id===id);activeRegion=c?.id||'01';desired.set(0,0,0);if(!id){zoomFactor=1;resize()}return true;}
 function clearSceneState(){currentSceneState=null;setEffectsVisible(null);for(const [id,material] of Object.entries(regionMats))material.color.setHex(baseRegionColors[id]);onStatus('Ambiente padrão restaurado');}
 function applySceneState(state){if(!state||!['01','02'].includes(state.caseId)){clearSceneState();return false;}currentSceneState=state;const flags=new Set(state.visualFlags||[]);setEffectsVisible(state);const operations=state.metrics?.workload??78;const operationsColor=flags.has('workload-improved')?0x4f9678:operations>=70?0xb86b59:0x607f92;regionMats['01']?.color.setHex(operationsColor);if(flags.has('confidentiality-warning')){regionMats['04']?.color.setHex(0xb87967);}else if(regionMats['04']){regionMats['04'].color.setHex(baseRegionColors['04']);}if(state.caseId==='02'&&flags.has('meeting-safe'))regionMats['02']?.color.setHex(0x5d9c7d);const labels=[];if(flags.has('capacity-rebalanced'))labels.push('capacidade revisada');if(flags.has('breaks-protected'))labels.push('pausas protegidas');if(flags.has('leadership-prepared'))labels.push('liderança preparada');if(flags.has('confidentiality-warning'))labels.push('alerta de confidencialidade');if(flags.has('meeting-safe'))labels.push('círculo de escuta criado');if(flags.has('leadership-board'))labels.push('quadro de acordos criado');if(flags.has('feedback-loop'))labels.push('retorno coletivo ativado');onStatus(labels.length?`Melhoria aplicada: ${labels.join(' · ')}`:'Ambiente carregado');return true;}
 function setEmotion(actor,emoji){if(!actor?.emotionSprite||actor.emotion===emoji)return;const sprite=makeEmoji(emoji);sprite.position.copy(actor.emotionSprite.position);scene.remove(actor.emotionSprite);scene.add(sprite);actor.emotionSprite=sprite;actor.emotion=emoji;}
 function animate(actorId,mode='talk'){
 focusedActor=mode==='talk'||mode==='run'||mode==='discuss'?actorId:focusedActor;
 if(mode!=='talk'&&mode!=='discuss')focusedActor=null;const a=actors.find(x=>x.key===actorId);if(!a?.mixer||!a.clips)return false;setEmotion(a,mode==='talk'||mode==='discuss'?'💬':mode==='walk'?'🚶':a.emotionBase);
 const pattern=mode==='walk'?/walk/i:mode==='run'?/run/i:mode==='idle'?/idle|baselayer|clip0/i:/talk|discuss|answer|idle|baselayer|clip0/i;
 const next=a.clips.find(c=>pattern.test(c.name))||a.clips.find(c=>/idle|talk|discuss/i.test(c.name))||a.clips.find(c=>!/fall|angry|jump/i.test(c.name));const current=a.mixer._actions?.find(x=>x.isRunning());const n=a.mixer.clipAction(next);if(current!==n){n.reset().play();if(current)n.crossFadeFrom(current,.34,true)}a.state=({walk:'exploring',talk:'talking',discuss:'talking',work:'working',pause:'pausing',concerned:'concerned',idle:'idle'})[mode]||mode;return true;
 }
 return {project,inspectUpgrades:hall.inspect,inspectActors:()=>actors.map(a=>({key:a.key,loaded:!!a.loaded,failed:!!a.failed,animations:a.clips?.map(c=>c.name)||[],x:a.root.position.x,z:a.root.position.z})),focusUpgrade:id=>{hall.highlight(id)},zoom:delta=>{zoomFactor=THREE.MathUtils.clamp(zoomFactor+delta,.55,1.45);resize()},focus,reset:()=>focus(null),animate,focusActor:(id)=>animate(id,'talk'),applySceneState,clearSceneState,applyManagementDecision,applyInvestmentUpgrade,resetInvestmentUpgrades,setActorState,dispose:()=>{on=false;window.removeEventListener('keydown',handleDown);window.removeEventListener('keyup',handleUp);window.removeEventListener('blur',resetHeld);observer.disconnect();layer.remove();renderer.dispose();renderer.domElement.remove()},actorCount:()=>actors.length};
}
