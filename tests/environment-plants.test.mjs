import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {FURNITURE_VISUALS as catalog} from '../data/continuous/furniture-visuals.js';

const root=new URL('../',import.meta.url);
const provenance=JSON.parse(fs.readFileSync(new URL('../assets/nature/environment-plants-provenance.json',import.meta.url),'utf8'));

test('new 3D plant models replace both standard indoor plants with compact four-view sprites',()=>{
 assert.deepEqual(provenance.map(p=>p.id),['planta-grande','planta-pequena']);
 for(const p of provenance){
  const asset=catalog.assets.find(a=>a.id===p.id);assert.ok(asset,`${p.id} remains canonical`);
  assert.equal(asset.url,p.url);assert.equal(asset.file,p.file);assert.equal(asset.rotationViews,4);
  assert.equal(asset.scale.height,p.height);assert.equal(asset.bounds[2],p.frameWidth);assert.equal(asset.bounds[3],p.frameHeight);
  const bytes=fs.readFileSync(new URL('../assets/nature/'+p.file,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(bytes.length,p.atlasBytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.atlasSha256);
  assert.ok(bytes.length<p.sourceBytes/1000,'runtime art is much smaller than the supplied source archive');
 }
 assert.ok(Object.values(catalog.baseline).some(room=>room.plant==='planta-grande'||room.plant==='planta-pequena'));
});
