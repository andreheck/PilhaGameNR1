/* PilhA+ experimental 3D library, Phase A: procedural prototype GLBs, not Meshy output. */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

window.__pilha3DReady=true;
const SAVE_KEY='pilha-missao01-v1';
const STATIONS=[
  {id:'saude-mental',name:'Saúde mental',x:-2.43,z:1.28,number:'01'},
  {id:'fatores-psicossociais',name:'Fatores psicossociais',x:1.28,z:-1.58,number:'02'},
  {id:'seguranca-psicologica',name:'Segurança psicológica',x:2.86,z:1.78,number:'03'}
];
const mentorPosition=new THREE.Vector3(-.92,0,2.68);
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=$('status'),stage=$('viewport'),fallback=$('fallback');
let cfg=null,scene=null,camera=null,renderer=null,controls=null,clock=null,avatar=null,mentor=null;
let markerGroups=[],markerTargets=[],selectedStation=null,previousFocus=null,modalOpen=false,moveModelLoaded=false;
const directions=new Set();
const loader=new GLTFLoader();
const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();
const obstacleBoxes=[
  {x:0,z:.1,w:1.75,h:1.12},
  {x:-1.72,z:2.74,w:1.30,h:.80},
  {x:-2.43,z:1.28,w:.74,h:.60},
  {x:1.28,z:-1.58,w:.80,h:.62},
  {x:2.86,z:1.78,w:.80,h:.62},
  {x:-2.90,z:-3.47,w:1.20,h:.78},
  {x:-1.55,z:-3.47,w:1.20,h:.78}
];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const getSaved=()=>{try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return s&&s.version===1?s:null}catch{return null}};
const newState=()=>({version:1,phase:'explore',explored:[],answers:{},questionIndex:0,feedback:false,completed:false,passed:false,score:0,correct:0,attempts:0,certified:false,bestScore:0,bestCorrect:0});
function stored(){return {...newState(),...(getSaved()||{}),explored:Array.isArray(getSaved()?.explored)?getSaved().explored:[]};}
function save(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s));return true}catch{return false}}
function tell(s){status.textContent=s}
function completeReading(id){
 if(!cfg?.stations.some(st=>st.id===id))return false;
 const current=stored();
 if(!current.explored.includes(id))current.explored.push(id);
 if(current.phase==='intro')current.phase='explore';
 const ok=save(current);
 renderProgress();
 if(ok)tell('Leitura registrada. Seu progresso também estará disponível na Missão 01.');
 else tell('Não foi possível salvar. Confira as permissões de armazenamento do navegador.');
 return ok;
}
function renderProgress(){
 const done=new Set(stored().explored);const count=STATIONS.filter(s=>done.has(s.id)).length;
 $('score-line').textContent=`${count}/3 leituras · ${count*20}/60 pontos`;
 $('read-counter').textContent=`${count}/3`;
 $('track-fill').style.width=(count/3*100)+'%';
 $('station-list').innerHTML=STATIONS.map((s,i)=>`<button type="button" class="station-item" data-study="${esc(s.id)}"><span class="station-n">${s.number}</span><span class="station-desc"><strong>${esc(s.name)}</strong><span>${esc(cfg?.stations.find(x=>x.id===s.id)?.subtitle||'Explorar conceito')}</span></span><span class="station-done">${done.has(s.id)?'✓':'+'}</span></button>`).join('');
 for(const m of markerGroups){const complete=done.has(m.userData.station);m.userData.dot.material.color.set(complete?0x46a27c:0xf1a34d)}
}
function setDialog(kicker,title,definition,expanded,example,takeaway,completeId=null){
 previousFocus=document.activeElement;
 $('dialog-kicker').textContent=kicker;
 $('dialog-title').textContent=title;
 $('dialog-definition').textContent=definition;
 $('dialog-expanded').textContent=expanded;
 $('dialog-example').textContent=example;
 $('dialog-takeaway').textContent=takeaway;
 const hideExtra=completeId===null;
 for(const id of ['dialog-expanded-title','dialog-example-title','dialog-takeaway-title'])$(id).hidden=hideExtra;
 $('dialog-expanded').hidden=hideExtra;$('dialog-example').hidden=hideExtra;$('dialog-takeaway').parentElement.hidden=hideExtra;
 $('dialog-complete').hidden=completeId===null;
 selectedStation=completeId;
 $('dialog-complete').textContent=completeId&&stored().explored.includes(completeId)?'Leitura já concluída':'Concluir leitura (+20)';
 $('dialog-backdrop').hidden=false;modalOpen=true;directions.clear();$('dialog-close').focus();
}
function showStation(id){
 const s=cfg?.stations.find(x=>x.id===id);if(!s)return;
 setDialog(`ESTAÇÃO ${s.number}`,s.label,s.definition,s.expanded,s.workExample,s.keyInsight,s.id);
}
function showMentor(){
 if(!cfg)return;
 setDialog('FACILITADOR DE APRENDIZAGEM',cfg.mentor.name,cfg.mentor.intro,cfg.mentor.direction,'','');
 tell('O mentor explica os objetivos do percurso e apresenta as três estações.');
}
function closeDialog(){
 $('dialog-backdrop').hidden=true;modalOpen=false;selectedStation=null;
 if(previousFocus?.isConnected&&typeof previousFocus.focus==='function')previousFocus.focus();
 else $('interact').focus();
}
function setupUI(){
 $('station-list').addEventListener('click',e=>{const el=e.target.closest('[data-study]');if(el)showStation(el.dataset.study)});
 $('talk-mentor').addEventListener('click',showMentor);
 $('dialog-complete').addEventListener('click',()=>{if(selectedStation)completeReading(selectedStation);closeDialog()});
 $('dialog-back').addEventListener('click',closeDialog);$('dialog-close').addEventListener('click',closeDialog);
 $('dialog-backdrop').addEventListener('click',e=>{if(e.target===$('dialog-backdrop'))closeDialog()});
 $('interact').addEventListener('click',interaction);
 window.addEventListener('storage',e=>{if(e.key===SAVE_KEY)renderProgress()});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modalOpen){closeDialog();return}
  if(modalOpen){if(e.key==='Tab'){
    const all=[...$('dialog-backdrop').querySelectorAll('button:not([hidden])')];const i=all.indexOf(document.activeElement);
    if(e.shiftKey&&i===0){e.preventDefault();all[all.length-1].focus()}
    else if(!e.shiftKey&&i===all.length-1){e.preventDefault();all[0].focus()}
   }return}
  if(e.key.toLowerCase()==='e'){e.preventDefault();interaction();return}
  if(e.key==='Shift'){directions.add('run');return}
  const keyMap={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'};
  const k=keyMap[e.key.toLowerCase()];if(k){e.preventDefault();directions.add(k)}
 });
 document.addEventListener('keyup',e=>{if(e.key==='Shift')directions.delete('run');const k={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'}[e.key.toLowerCase()];if(k)directions.delete(k)});
 window.addEventListener('blur',()=>directions.clear());
 stage.querySelectorAll('[data-dir]').forEach(b=>{
  const name=b.dataset.dir;
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);directions.add(name)});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>directions.delete(name));
 });
 renderProgress();
}
function buildAvatar(){
 const group=new THREE.Group();
 const add=(g,y,color)=>{const mat=new THREE.MeshStandardMaterial({color,roughness:.9});const obj=new THREE.Mesh(g,mat);obj.position.y=y;obj.castShadow=true;group.add(obj);return obj};
 add(new THREE.CylinderGeometry(.21,.23,.55,12),.73,0xd69c4a);
 add(new THREE.SphereGeometry(.23,12,12),1.20,0x91674b);
 add(new THREE.SphereGeometry(.235,12,10),1.38,0x273c42);
 for(const x of [-.13,.13]){
  const foot=add(new THREE.BoxGeometry(.13,.45,.18),.28,0x42546a);foot.position.x=x;
  const arm=add(new THREE.CapsuleGeometry(.067,.34,4,8),.75,0xd69c4a);arm.position.x=x*2.1;
 }
 group.position.set(0,0,3.15);
 return group;
}
function makeMarker(s){
 const group=new THREE.Group();const mat=new THREE.MeshStandardMaterial({color:0xf1a34d,roughness:.38,metalness:.06,emissive:0x492400,emissiveIntensity:.08});
 const dot=new THREE.Mesh(new THREE.SphereGeometry(.185,16,12),mat);
 const torus=new THREE.Mesh(new THREE.TorusGeometry(.255,.027,7,28),new THREE.MeshBasicMaterial({color:0xffffff}));torus.rotation.x=Math.PI/2;
 group.add(dot,torus);group.position.set(s.x,1.82,s.z);group.userData={station:s.id,dot};
 dot.userData.station=s.id;markerTargets.push(dot);
 // Canvas text labels stay in UI texture, not burned into asset textures.
 const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d');
 ctx.fillStyle='#f9f2e6';ctx.beginPath();ctx.roundRect(16,16,96,96,24);ctx.fill();
 ctx.fillStyle='#19374b';ctx.font='800 57px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.number,64,69);
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));sprite.position.y=.02;sprite.scale.set(.45,.45,1);sprite.userData.station=s.id;markerTargets.push(sprite);group.add(sprite);
 group.userData.initialY=group.position.y;
 scene.add(group);markerGroups.push(group);
}
function blocked(x,z){
 if(Math.abs(x)>3.65||Math.abs(z)>3.65)return true;
 return obstacleBoxes.some(b=>Math.abs(x-b.x)<b.w/2+.22&&Math.abs(z-b.z)<b.h/2+.22);
}
function move(dt){
 if(!avatar||modalOpen)return;
 let x=Number(directions.has('right'))-Number(directions.has('left'));
 let z=Number(directions.has('down'))-Number(directions.has('up'));
 if(!x&&!z)return;
 const l=Math.hypot(x,z);x/=l;z/=l;const speed=(directions.has('run')?3.2:2.15)*dt;
 const old=avatar.position;
 const nx=old.x+x*speed,nz=old.z+z*speed;
 if(!blocked(nx,old.z))old.x=nx;
 if(!blocked(old.x,nz))old.z=nz;
 avatar.rotation.y=Math.atan2(x,z);
}
function interaction(){
 if(!cfg||modalOpen)return;
 const p=avatar?.position||new THREE.Vector3(0,0,3.15);
 const nearby=STATIONS.map(s=>({...s,dist:Math.hypot(p.x-s.x,p.z-s.z)})).sort((a,b)=>a.dist-b.dist)[0];
 if(nearby&&nearby.dist<1.7){showStation(nearby.id);return}
 if(p.distanceTo(mentorPosition)<1.7){showMentor();return}
 tell('Aproxime-se de um terminal ou clique em uma estação no cenário/lista.');
}
function clickableAt(ev){
 if(!camera||!renderer||!markerTargets.length)return;
 const r=renderer.domElement.getBoundingClientRect();pointer.x=((ev.clientX-r.left)/r.width)*2-1;pointer.y=-((ev.clientY-r.top)/r.height)*2+1;
 raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(markerTargets,false);
 if(hits.length)showStation(hits[0].object.userData.station);
}
function resize(){if(!renderer||!camera)return;
 const w=stage.clientWidth,h=stage.clientHeight;const a=w/h;
 camera.left=-5.85*a;camera.right=5.85*a;camera.top=5.85;camera.bottom=-5.85;camera.updateProjectionMatrix();
 renderer.setSize(w,h);
}
function init3D(){
 try{
  scene=new THREE.Scene();scene.background=new THREE.Color(0xcde0df);
  camera=new THREE.OrthographicCamera(-8,8,6,-6,.1,100);camera.position.set(11,13,15);camera.lookAt(0,.60,0);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;
  renderer.domElement.setAttribute('aria-label','Ambiente 3D explorável da biblioteca');
  stage.prepend(renderer.domElement);
  controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.55,0);controls.enableDamping=true;
  controls.enablePan=false;controls.minZoom=.65;controls.maxZoom=1.5;
  controls.minPolarAngle=.40;controls.maxPolarAngle=1.48;
  controls.minAzimuthAngle=.20;controls.maxAzimuthAngle=1.45;
  controls.update();
  const hemi=new THREE.HemisphereLight(0xffffff,0x8faaa1,2.9);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffe8c6,3.2);sun.position.set(1,11,7);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-10;sun.shadow.camera.right=10;sun.shadow.camera.top=10;sun.shadow.camera.bottom=-10;scene.add(sun);
  avatar=buildAvatar();scene.add(avatar);
  for(const s of STATIONS)makeMarker(s);
  clock=new THREE.Clock();resize();window.addEventListener('resize',resize);
  let pointerX=0,pointerY=0;
  renderer.domElement.addEventListener('pointerdown',e=>{pointerX=e.clientX;pointerY=e.clientY});
  renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-pointerX,e.clientY-pointerY)<7)clickableAt(e)});
  loader.load('/assets/v13/biblioteca-modular-prototipo.glb',gltf=>{
   gltf.scene.traverse(o=>{if(o.isMesh){o.receiveShadow=true;o.castShadow=o.name!=='floor'&&o.name!=='floor_border';}});
   scene.add(gltf.scene);moveModelLoaded=true;fallback.hidden=true;
   tell('Biblioteca 3D carregada. Aproxime-se das estações ou selecione um cartão.');
  },undefined,()=>tell('O modelo não pôde ser carregado. Você ainda pode estudar nos cartões.'));
  loader.load('/assets/v13/gestor-mentor-prototipo.glb',gltf=>{
   mentor=gltf.scene;mentor.position.copy(mentorPosition);
   mentor.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(mentor);
  },undefined,()=>tell('Mentor 3D indisponível. O diálogo de orientação permanece acessível.'));
  const start=Date.now();
  function loop(){requestAnimationFrame(loop);if(document.hidden)return;
   const dt=Math.min(clock.getDelta(),.06);
   move(dt);for(let i=0;i<markerGroups.length;i++){
    const m=markerGroups[i];m.position.y=m.userData.initialY+Math.sin((Date.now()-start)*.0025+i)*.075;
    m.rotation.y+=dt*.4;
   }
   if(mentor)mentor.rotation.y=Math.sin((Date.now()-start)*.0007)*.05;
   controls.update();renderer.render(scene,camera);
  }loop();
 }catch(err){tell('WebGL não está disponível. Os cartões de aprendizagem continuam funcionando: '+err.message)}
}
async function boot(){
 if(window.__pilha3DFallbackActive)return;
 try{
  const resp=await fetch('/content/mission01.json',{cache:'no-store'});
  if(!resp.ok)throw Error(`HTTP ${resp.status}`);
  cfg=await resp.json();if(!Array.isArray(cfg.stations)||cfg.stations.length!==3)throw Error('Conteúdo incompleto');
  setupUI();init3D();
 }catch(err){
  tell('Conteúdo indisponível; abra a Missão 01 para continuar.');
  $('station-list').innerHTML='<a class="outline" href="/missao01.html">Abrir missão acessível</a>';
 }
}
boot();
