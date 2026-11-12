// Deliver animation atlases as opaque binary assets so image CDNs preserve every pixel.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),out=new URL('dist/',root),urls=new Set();
const read=name=>JSON.parse(fs.readFileSync(new URL(name,root),'utf8'));
for(const actor of read('data/continuous/expanded-cast.json').actors)
 for(const action of Object.values(actor.actions))urls.add(action.url);
for(const actor of read('data/continuous/intro-cast.json').models)urls.add(actor.file);
for(const actor of read('data/continuous/npc-rigged.json').bindings)
 for(const key of ['walk','idle','talk'])if(actor[key])urls.add(actor[key]);
for(const action of ['walk','idle'])urls.add('/assets/robots/blue-robot-'+action+'.png');
const replacements=[];
for(const url of urls){
 if(!url?.endsWith('.png'))continue;
 const name=url.replace(/\.png$/,'.sprite');
 fs.copyFileSync(new URL(url.slice(1),out),new URL(name.slice(1),out));
 replacements.push([url,name]);
}
function visit(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,item.name);
 if(item.isDirectory())visit(file);
 else if(/\.(js|json|html)$/.test(item.name)){
  const original=fs.readFileSync(file,'utf8');let text=original;
  for(const [from,to] of replacements)text=text.replaceAll(from,to);
  if(text!==original)fs.writeFileSync(file,text);
 }
}}
visit(fileURLToPath(out));
console.log('Animation delivery: '+replacements.length+' pixel-preserving sprite atlases.');
