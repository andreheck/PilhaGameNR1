import fs from 'node:fs';import {validatePlacement} from '../simulation/furniture-layout.js';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8').replaceAll('\r\n','\n');
function replace(a,b){if(!s.includes(a))throw Error('Layout editor anchor: '+a.slice(0,90));s=s.replace(a,b);}
replace('    function renderEnv(e, visitors) {',validatePlacement.toString()+'\n'+fs.readFileSync(new URL('../ui/furniture-editor-runtime.js',import.meta.url),'utf8')+'\n    function renderEnv(e, visitors) {');
replace('furniturePresentation.arrange(e,furnitureCatalog);',"furniturePresentation.arrange(e,furnitureCatalog,(furnitureEdits.rooms||{})[e.key]||{});");
replace('function drawItem(it,e){',"function drawItem(it,e){if(furnitureEditing&&furniturePreview&&furniturePreview.key===it.layoutKey&&furniturePreview.sid===e.key&&!it.editorGhost)return;");
replace('drawOverlay();drawRestAnnexLabels();','drawOverlay();drawRestAnnexLabels();drawFurnitureEditOverlay();');
replace('      setAnimationTest:setAnimationTest,',`      getLayoutWarnings:function(){return Object.values(envs).filter(function(e){return e.layoutWarnings&&e.layoutWarnings.length;}).map(function(e){return {sid:e.key,keys:e.layoutWarnings};});},setFurnitureLayout:setFurnitureLayout,editableFurniture:editableFurniture,pickFurniture:pickFurniture,furnitureFloorPoint:furnitureFloorPoint,previewFurniture:previewFurniture,commitFurniturePreview:commitFurniturePreview,
      clearFurniturePreview:function(){furniturePreview=null;render();},setFurnitureEditing:function(v){furnitureEditing=!!v;furniturePreview=null;render();},isFurnitureEditing:function(){return furnitureEditing;},
      setAnimationTest:setAnimationTest,`);
// Ground becomes a calm continuous surface. Paths and reservations remain in navigation, not painted grids.
const start=s.indexOf('    function drawFloor(e) {'),end=s.indexOf('    function ',start+20);if(start<0||end<0)throw Error('Floor anchor');s=s.slice(0,start)+`    function drawFloor(e){var pal=e.pal;poly([P(0,D,0),P(W,D,0),P(W,D,-SLAB),P(0,D,-SLAB)],tone(pal.floorB,.4,.55));poly([P(W,0,0),P(W,D,0),P(W,D,-SLAB),P(W,0,-SLAB)],tone(pal.floorB,.4,.4));poly([P(0,0,0),P(W,0,0),P(W,D,0),P(0,D,0)],e.key==='restauracao'?'#344e48':e.key==='producao'?'#35424c':e.key==='atendimento'?'#37394d':'#35454d');}
`+s.slice(end);
const a=s.indexOf('function drawRestAnnex(e){'),b=s.indexOf('function drawRestAnnexLabels()',a);if(a<0||b<0)throw Error('Annex floor anchor');s=s.slice(0,a)+`function drawRestAnnex(e){if(!worldCfg||e.key!=='restauracao')return;poly([P(0,8,0),P(W,8,0),P(W,18,0),P(0,18,0)],'#466e59');poly([P(8,8,.001),P(W,8,.001),P(W,18,.001),P(8,18,.001)],'#3b4e5b');poly([P(0,18,0),P(W,18,0),P(W,18,-SLAB),P(0,18,-SLAB)],'#243c35');poly([P(W,8,0),P(W,18,0),P(W,18,-SLAB),P(W,8,-SLAB)],'#1d3535');}
`+s.slice(b);
// Expose stable editing identities for QA; existing item IDs and purchases stay unchanged.
replace('type:it.t,x:it.x,y:it.y,w:it.w,d:it.d,h:it.h,annex:', 'layoutKey:it.layoutKey,turn:it.turn||0,canRotate:!!it.canRotate,type:it.t,x:it.x,y:it.y,w:it.w,d:it.d,h:it.h,annex:');
replace('    function person(p, e) {',fs.readFileSync(new URL('../ui/work-gestures-runtime.js',import.meta.url),'utf8')+'\n    function person(p, e) {');
replace('var hipY = fy - (sit ? 0.42 : 0.62) * u + bob;', 'var seatAmount=clamp(p.seatProgress==null?(sit?1:0):p.seatProgress,0,1);seatAmount=seatAmount*seatAmount*(3-2*seatAmount);var hipY=fy-(.62*u*(1-seatAmount)+(p.seatHeight||.47)*ZU*s*seatAmount)+bob;');
replace('if (!sit) {\n        ctx.lineCap', 'if(seatAmount>.02)seatedLegs(p,fy,fx,hipY,u,seatAmount);\n      if (seatAmount<=.02) {\n        ctx.lineCap');
replace('var tw = 0.34 * u, th = (sit ? 0.46 : 0.52) * u;', 'var tw=.34*u,th=(.52-.06*seatAmount)*u;');
replace("sprite=sit&&(p.activity==='computer'||p.activity==='using-chair')?null:",'sprite=sit?null:');
replace("if(p.activity==='computer'){","if(false&&p.activity==='computer'){");
replace('list.push({ k: it.x + it.w / 2 + it.y + it.d / 2,','list.push({ k: (it.walkable?-100:0)+it.x+it.w/2+it.y+it.d/2,');
replace('      list.forEach(function (o) { o.f(); });','      list.forEach(function (o) { o.f(); });e.people.filter(function(p){return p.employeeId;}).forEach(drawWorkHands);');
replace('sitting:!!p.sit,activity:p.activity', 'sitting:!!p.sit,seatProgress:p.seatProgress||0,activity:p.activity');
fs.writeFileSync(file,s);
const mapFile=new URL('../dist/ui/continuous/map.js',import.meta.url);let m=fs.readFileSync(mapFile,'utf8');m=m.replace('function onMapClick(p) {','function onMapClick(p) {if(iso.isFurnitureEditing())return;');m=m.replace('function onKey(e) {','function onKey(e) {if(iso.isFurnitureEditing()&&e.target!==canvas)return;');fs.writeFileSync(mapFile,m);
