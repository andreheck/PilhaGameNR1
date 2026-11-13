/** Extra usable floor; old room and saved business data stay intact. */
import fs from 'node:fs';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Annex anchor: '+a.slice(0,100));s=s.replace(a,b);}
replace('    function worldBounds() {',fs.readFileSync(new URL('../ui/restorative-annex-runtime.js',import.meta.url),'utf8')+'\n    function worldBounds() {');
replace('      drawWalls(e); drawFloor(e);','      drawRestAnnex(e);drawWalls(e); drawFloor(e);');
replace('name: d.name, bx: d.bx, by: d.by, env: getEnv(d.key)',"name: d.name, bx: d.bx, by: d.by, depth:d.key==='restauracao'?18:D, env: getEnv(d.key)");
const a=s.indexOf('    function worldBounds() {'),b=s.indexOf('    function applyCam()',a);s=s.slice(0,a)+s.slice(a,b).replaceAll('c.by + D','c.by + roomDepth(c)')+s.slice(b);
replace('var c = worldCfg[i], bwid = (W + D) * TW / 2, bhei = (W + D) * TH / 2','var c = worldCfg[i], rd=roomDepth(c), bwid = (W + rd) * TW / 2, bhei = (W + rd) * TH / 2');
replace('uv = tileUV(c.bx + W / 2, c.by + D / 2, 0.9);','uv = tileUV(c.bx + W / 2, c.by + rd / 2, 0.9);');
replace('lx >= 0 && lx < W && ly >= 0 && ly < D','lx >= 0 && lx < W && ly >= 0 && ly < roomDepth(c)');
replace('return { i: i, zone: zoneOf(lx, ly), x:X, y:Y, key:c.key };','return { i: i, zone: ly>=D?-1:zoneOf(lx, ly), x:X, y:Y, key:c.key };');
replace('P(c.bx + W, c.by + D, 0), P(c.bx, c.by + D, 0)','P(c.bx + W, c.by + roomDepth(c), 0), P(c.bx, c.by + roomDepth(c), 0)');
replace('type:it.t,x:it.x,y:it.y,w:it.w,d:it.d,h:it.h,hidden:!!it.layoutHidden','type:it.t,x:it.x,y:it.y,w:it.w,d:it.d,h:it.h,annex:!!it.annex,walkable:!!it.walkable,hidden:!!it.layoutHidden');
replace('      getWorldFrame:function()', '      focusAnnex:focusRestAnnex,getWorldLayout:restorativeWorldLayout,\n      getWorldFrame:function()');
replace("['Biblioteca','Bosque','Meditação','Auditório','Pomar','Pátio']","['Biblioteca','Bosque','Meditação','Auditório','Pomar','Convivência']");
replace('      drawOverlay();','      drawOverlay();drawRestAnnexLabels();');
fs.writeFileSync(file,s);
