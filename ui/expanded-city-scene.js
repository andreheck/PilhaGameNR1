const PLATFORM = '/assets/world-expansion/platform/brazilian-diorama-base.glb';
const ASSETS = '/assets/world-expansion/';

const placements = [
  ...[
    {file:'community-huts/barraco-01-reboco-gasto.png',x:-.52,z:-.78,w:.14,h:.15},
    {file:'community-huts/barraco-02-tijolo-aparente.png',x:-.40,z:-.82,w:.14,h:.15},
    {file:'community-huts/barraco-03-laje-caixa-azul.png',x:-.28,z:-.77,w:.14,h:.15},
    {file:'community-huts/barraco-04-bloco-aparente-laje.png',x:-.16,z:-.70,w:.14,h:.15},
    {file:'community-huts/barraco-05-pastel-caixa-azul.png',x:-.04,z:-.66,w:.14,h:.15},
    {file:'community-huts/barraco-06-azul-coral.png',x:-.34,z:-.66,w:.14,h:.15}
  ].map(p=>({id:'morro',kind:'image',...p})),
  {id:'residencial',kind:'image',file:'residential-buildings/predio-residencial-01-4-pavimentos.png',x:-.78,z:.10,w:.19,h:.29},
  {id:'residencial',kind:'image',file:'residential-buildings/predio-residencial-02-5-pavimentos.png',x:-.54,z:-.05,w:.18,h:.31},
  {id:'residencial',kind:'image',file:'residential-buildings/predio-residencial-03-3-pavimentos-familiar.png',x:-.28,z:-.22,w:.19,h:.29},
  {id:'residencial',kind:'image',file:'residential-buildings/casa-praia-01-terracota.webp',x:-.76,z:.32,w:.19,h:.16},
  {id:'residencial',kind:'image',file:'residential-buildings/casa-praia-02-ciano.webp',x:-.50,z:.32,w:.19,h:.16},
  {id:'residencial',kind:'image',file:'residential-buildings/casa-praia-03-amarela.webp',x:-.24,z:.32,w:.19,h:.16},
  {id:'pilha-corp',kind:'image',file:'pilha-corp-office/pilha-corp-escritorio-exterior-conceito.png',x:.02,z:.24,w:.42,h:.22,enter:true},
  {id:'comercio',kind:'model',file:'food/paradinho-cafe.glb',x:.62,z:-.12,size:.23,label:'PARADINHO'},
  {id:'comercio',kind:'model',file:'food/bolinho-kiosk.glb',x:.87,z:-.18,size:.17,label:'BOLINHO'},
  {id:'upa',kind:'image',file:'food/hospital-upa-terraco.png',x:.75,z:-.38,w:.25,h:.27}
];

function makeLabel(THREE,text) {
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#091a29d9';ctx.strokeStyle='#ffe05c';ctx.lineWidth=7;
  ctx.beginPath();ctx.roundRect(4,4,504,120,28);ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffffff';ctx.font='bold 54px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,66);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));
  sprite.scale.set(.21,.052,1);sprite.renderOrder=20;return sprite;
}

function addHouse(THREE,root,p,ground) {
  const house=new THREE.Group();house.position.set(p.x,ground,p.z);
  const wall=new THREE.MeshStandardMaterial({color:p.color,roughness:.88});
  const trim=new THREE.MeshStandardMaterial({color:'#f5dfb4',roughness:.8});
  const roof=new THREE.MeshStandardMaterial({color:'#9b5844',roughness:.9});
  const body=new THREE.Mesh(new THREE.BoxGeometry(.13,.09,.12),wall);body.position.y=.045;house.add(body);
  const top=new THREE.Mesh(new THREE.ConeGeometry(.105,.075,4),roof);top.position.set(0,.122,0);top.rotation.y=Math.PI/4;house.add(top);
  const door=new THREE.Mesh(new THREE.BoxGeometry(.025,.05,.004),trim);door.position.set(-.027,.025,.062);house.add(door);
  for(const wx of [.026,.062]){const window=new THREE.Mesh(new THREE.BoxGeometry(.022,.021,.004),new THREE.MeshStandardMaterial({color:'#82c7d5',emissive:'#142a31'}));window.position.set(wx,.059,.062);house.add(window);}
  const base=new THREE.Mesh(new THREE.BoxGeometry(.155,.008,.15),new THREE.MeshStandardMaterial({color:'#a79776'}));base.position.y=.004;house.add(base);
  house.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  root.add(house);house.userData.cityId=p.id;house.userData.clickable=true;
  return house;
}

function addKiosk(THREE,root,p,ground) {
  const g=new THREE.Group();g.position.set(p.x,ground,p.z);
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7});
  const box=(w,h,d,c,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
  box(.14,.10,.12,'#df552f',0,.05,0);box(.17,.035,.15,'#f2b839',0,.118,0);
  box(.18,.013,.17,'#604535',0,.139,0);
  for(let i=0;i<5;i++)box(.018,.025,.17,i%2?'#fff0d5':'#d94335',-.072+i*.036,.143,0);
  box(.07,.032,.006,'#fff1d2',0,.076,.064);
  const sign=makeLabel(THREE,'BOLINHO');sign.scale.set(.13,.032,1);sign.position.set(0,.105,.073);g.add(sign);
  root.add(g);g.userData.cityId='comercio';g.userData.clickable=true;return g;
}

export async function createExpandedCityScene(container,{onSelect,onProgress,onError}={}) {
  const [THREE, {GLTFLoader}, {OrbitControls}]=await Promise.all([
    import('three'),import('three/addons/loaders/GLTFLoader.js').then(m=>({GLTFLoader:m.GLTFLoader})),
    import('three/addons/controls/OrbitControls.js').then(m=>({OrbitControls:m.OrbitControls}))
  ]);
  let disposed=false,resizeObserver;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#102438');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.className='city-scene-canvas';renderer.domElement.setAttribute('aria-label','Mapa 3D isométrico interativo do bairro Pilha+');
  container.prepend(renderer.domElement);
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,30);
  camera.position.set(3.5,3.15,4.1);camera.lookAt(0,0,0);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.015,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=false;controls.minPolarAngle=.48;controls.maxPolarAngle=1.18;controls.minZoom=.82;controls.maxZoom=1.55;controls.zoomSpeed=.75;
  scene.add(new THREE.HemisphereLight(0xfff4d8,0x516b62,2.1));
  const key=new THREE.DirectionalLight(0xffedca,3.2);key.position.set(-3.5,6,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const fill=new THREE.DirectionalLight(0x91d7f4,1.25);fill.position.set(4,3,-4);scene.add(fill);
  const clickable=[],locations=new Map(),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  let platform=null,frame=0;
  const resize=()=>{
    if(disposed)return;const w=Math.max(container.clientWidth,1),h=Math.max(container.clientHeight,1),aspect=w/h,viewH=2.35;
    camera.left=-viewH*aspect/2;camera.right=viewH*aspect/2;camera.top=viewH/2;camera.bottom=-viewH/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  };
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
  const addClickable=(node,id,enter=false)=>{node.userData.cityId=id;node.userData.enterCompany=enter;node.userData.clickable=true;clickable.push(node);};
  const place=async p=>{
    const probe=new THREE.Raycaster(new THREE.Vector3(p.x,3,p.z),new THREE.Vector3(0,-1,0));
    const hit=probe.intersectObject(platform,true)[0];const ground=hit?hit.point.y+.003:-.22;
    if(p.kind==='house'){addClickable(addHouse(THREE,scene,p,ground),p.id);return;}
    if(p.kind==='kiosk'){addClickable(addKiosk(THREE,scene,p,ground),p.id);return;}
    if(p.kind==='model'){
      const gltf=await new GLTFLoader().loadAsync(ASSETS+p.file),model=gltf.scene;
      const bounds=new THREE.Box3().setFromObject(model),dimensions=bounds.getSize(new THREE.Vector3());
      const factor=p.size/Math.max(dimensions.x,dimensions.z,0.001);
      model.scale.setScalar(factor);model.position.set(p.x,ground-bounds.min.y*factor,p.z);model.rotation.y=p.rotationY||0;
      model.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}});
      scene.add(model);addClickable(model,p.id,p.enter);
      if(p.label){const sign=makeLabel(THREE,p.label);sign.position.set(p.x,ground+dimensions.y*factor+.045,p.z);sign.scale.set(.18,.045,1);scene.add(sign);}
      return;
    }
    const texture=await new THREE.TextureLoader().loadAsync(ASSETS+p.file);texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=true;texture.minFilter=THREE.LinearMipmapLinearFilter;
    const aspect=texture.image.width/texture.image.height;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.06,depthWrite:false,roughness:1}));
    sprite.position.set(p.x,ground,p.z);sprite.center.set(.5,0);sprite.scale.set(p.w,p.h||p.w/aspect,1);sprite.renderOrder=8;
    sprite.material.polygonOffset=true;sprite.material.polygonOffsetFactor=-1;sprite.material.polygonOffsetUnits=-1;
    scene.add(sprite);addClickable(sprite,p.id,p.enter);
    if(!locations.has(p.id))locations.set(p.id,[]);locations.get(p.id).push({sprite,x:p.x,z:p.z,y:ground});
  };
  try {
    const gltf=await new GLTFLoader().loadAsync(PLATFORM,evt=>{
      if(evt.lengthComputable)onProgress?.(Math.min(99,Math.round(evt.loaded/evt.total*100)));
    });
    if(disposed){gltf.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});return {dispose(){}};}
    platform=gltf.scene;platform.traverse(o=>{if(o.isMesh){o.receiveShadow=true;o.castShadow=true;}});scene.add(platform);
    const box=new THREE.Box3().setFromObject(platform);const size=box.getSize(new THREE.Vector3());
    if(size.x>2.05)platform.scale.setScalar(1.9/size.x);
    for(const p of placements)await place(p);
    onProgress?.(100);container.classList.add('is-city-ready');container.closest('.city-map-art')?.classList.add('is-city-ready');
    const activeRing=new THREE.Mesh(new THREE.RingGeometry(.075,.092,48),new THREE.MeshBasicMaterial({color:0xffde59,side:THREE.DoubleSide,transparent:true,opacity:.9,depthTest:true}));
    activeRing.rotation.x=-Math.PI/2;activeRing.visible=false;scene.add(activeRing);
    const select=id=>{const entries=locations.get(id)||[];if(entries.length){const e=entries[Math.floor(entries.length/2)];activeRing.position.set(e.x,e.y+.006,e.z);activeRing.visible=true;}else activeRing.visible=false;};
    const resizeObserver2=new ResizeObserver(resize);resizeObserver2.observe(container);
    const onPointerUp=e=>{
      if(e.button!==undefined&&e.button!==0)return;
      const rect=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable,true)[0]?.object;
      if(hit){let node=hit;while(node&&!node.userData.cityId)node=node.parent;if(node){if(node.userData.enterCompany){onSelect?.('pilha-corp',{enter:true});return;}select(node.userData.cityId);onSelect?.(node.userData.cityId);}}
    };
    let pointerDown=null;const down=e=>pointerDown=[e.clientX,e.clientY];const up=e=>{if(pointerDown&&Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])<7)onPointerUp(e);pointerDown=null;};
    renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);
    const animate=()=>{if(disposed)return;frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);};animate();
    return {
      select,
      reset(){controls.reset();camera.position.set(3.5,3.15,4.1);camera.zoom=1;camera.updateProjectionMatrix();controls.target.set(0,.015,0);controls.update();},
      dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);resizeObserver?.disconnect();resizeObserver2.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});renderer.dispose();renderer.domElement.remove();}
    };
  } catch(error){onError?.(error);renderer.dispose();renderer.domElement.remove();resizeObserver?.disconnect();throw error;}
}
