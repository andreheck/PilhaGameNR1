import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
test('published animation atlases preserve all source pixels and original frame dimensions',()=>{
 const source=JSON.parse(fs.readFileSync(new URL('data/continuous/expanded-cast.json',root)));
 const published=JSON.parse(fs.readFileSync(new URL('dist/data/continuous/expanded-cast.json',root)));
 for(const actor of source.actors)for(const [name,clip] of Object.entries(actor.actions)){
  const delivered=published.actors.find(a=>a.id===actor.id).actions[name];
  assert.ok(delivered.url.endsWith('.sprite'));
  const bytes=fs.readFileSync(new URL('dist'+delivered.url,root));
  assert.deepEqual(bytes,fs.readFileSync(new URL(clip.url.slice(1),root)));
  assert.equal(bytes.readUInt32BE(16),clip.frames*clip.frameWidth);
  assert.equal(bytes.readUInt32BE(20),clip.directions*clip.frameHeight);
 }
});
