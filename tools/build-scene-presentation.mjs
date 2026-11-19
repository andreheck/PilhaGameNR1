/** Remove intrusive metrics and attach only an opt-in, stateless animation guest. */
import fs from 'node:fs';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8').replaceAll('\r\n','\n');
function replace(a,b){if(!s.includes(a))throw Error('Scene presentation anchor missing: '+a.slice(0,80));s=s.replace(a,b);}
replace('var showM = isSel || cam.k > 1.7;','var showM = false; // Metrics remain in the selected-sector panel.');
const a=s.indexOf('        var lp = P(c.bx + W / 2, c.by, WALLH + 0.8)'),b=s.indexOf('\n      }\n    }\n    function renderWorld()',a);if(a<0||b<0)throw Error('Sector labels anchor missing');s=s.slice(0,a)+s.slice(b);
replace('    function renderEnv(e, visitors) {',fs.readFileSync(new URL('../ui/mixamo-test-runtime.js',import.meta.url),'utf8')+'\n    function renderEnv(e, visitors) {');
replace('      list.sort(function (a, b) { return a.k - b.k; });',"      if(e.key==='restauracao'&&animationTest.enabled)list.push({k:animationTest.x+animationTest.y,f:drawAnimationTest});\n      list.sort(function (a, b) { return a.k - b.k; });");
replace('      focusAnnex:focusRestAnnex,',"      setAnimationTest:setAnimationTest,getAnimationTest:animationTestInfo,\n      focusAnnex:focusRestAnnex,");fs.writeFileSync(file,s);
