import fs from 'node:fs';
const root=new URL('../',import.meta.url),file=new URL('dist/ui/continuous/iso.js',root);let s=fs.readFileSync(file,'utf8');
const cast=JSON.parse(fs.readFileSync(new URL('data/continuous/expanded-cast.json',root),'utf8')).actors;
function replace(a,b){if(!s.includes(a))throw Error('Expanded cast anchor: '+a.slice(0,90));s=s.replace(a,b);}
replace('    function renderEnv(e, visitors) {',`var expandedCast=${JSON.stringify(cast.map(({id,name,sector,binding,actions})=>({id,name,sector,binding,actions})))};\n`+fs.readFileSync(new URL('ui/expanded-cast-runtime.js',root),'utf8')+'\n    function renderEnv(e, visitors) {');
replace('      list.forEach(function (o) { o.f(); });','      expandedEntries(e,list);list.sort(function(a,b){return a.k-b.k;});list.forEach(function(o){o.f();});');
replace('employeeHits=[];riggedDrawn={};','employeeHits=[];riggedDrawn={};expandedHits=[];expandedDrawn=[];');
replace('      setIntroCast:setIntroCast,',`      setSupportingActor:function(id,visible){var a=expandedCast.find(function(a){return a.id===id;});if(!a||a.binding)return false;expandedGuests[id]=!!visible;render();return true;},getSupportingActors:function(){return {visible:Object.keys(expandedGuests).filter(function(k){return expandedGuests[k];}),drawn:expandedDrawn.slice()};},pickSupportingActor:function(x,y){var h=expandedHits.slice().reverse().find(function(p){return Math.hypot(x-p.x,y-p.y)<p.r;});return h&&h.id;},
      setIntroCast:setIntroCast,`);
// Upgrade the confirmed Mariana binding without changing her ID or approved portrait.
const mariana=cast.find(a=>a.id==='mariana'),w=mariana.actions.walk,t=mariana.actions.talk;
const match=s.match(/var riggedBindings=(\{.*?\}),riggedImages=/);if(!match)throw Error('Missing canonical bindings');const bindings=JSON.parse(match[1]);
Object.assign(bindings['NPC-07'],{walk:w.url,idle:mariana.actions.idle.url,talk:t.url,walkDuration:w.duration,talkDuration:t.duration,walkFrames:w.frames,talkFrames:t.frames,anchorY:w.anchorY,renderHeight:w.renderHeight});
s=s.replace(match[0],'var riggedBindings='+JSON.stringify(bindings)+',riggedImages=');
replace('var sh=(introDef?(introDef.renderHeight||2.7):2.15)*u','var sh=(introDef?(introDef.renderHeight||2.7):rigged&&rigged.renderHeight?rigged.renderHeight:2.15)*u');
fs.writeFileSync(file,s);
const mfile=new URL('dist/ui/continuous/map.js',root);let m=fs.readFileSync(mfile,'utf8');const anchor='if(id&&o.onEmployee){o.onEmployee(id);return;}';if(!m.includes(anchor))throw Error('Map employee priority');m=m.replace(anchor,anchor+'var special=iso.pickSupportingActor(p.x,p.y);if(special&&o.onSupportingActor){o.onSupportingActor(special);return;}');fs.writeFileSync(mfile,m);
console.log('Expanded cast: 10 supplied models; canonical Mariana; yoga and lawyer visual support.');
