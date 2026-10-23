import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NEON_VERSION,escapeHtml,portraitMarkup} from '../ui/hero-neon.js';
import {buildHeroGalleryData} from '../ui/hero-gallery-data.js';
const store={getItem:()=>null};
test('neon uses the canonical six images and does not create another roster',()=>{
 assert.equal(NEON_VERSION,'2026-10-23.1');
 const heroes=buildHeroGalleryData(store).LIST;assert.equal(heroes.length,6);
 for(const hero of heroes){const html=portraitMarkup(hero);assert.ok(html.includes(hero.img));assert.ok(fs.existsSync(new URL('..'+hero.img,import.meta.url)));}
});
test('visual layer does not mutate the engine, progress or storage',()=>{
 const source=fs.readFileSync(new URL('../ui/hero-neon.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/localStorage\.(setItem|removeItem|clear)|saveHeroTeam\(|applyXpRewards\(/);
 assert.match(source,/observer\.disconnect\(\)/);
 assert.match(source,/data-entry="next"/);
 assert.match(source,/buildHeroGalleryData/);
});
test('text and portrait attributes remain escaped',()=>{
 assert.equal(escapeHtml('<"&>'), '&lt;&quot;&amp;&gt;');
 assert.ok(portraitMarkup({img:'" onerror="bad',nome:'x'}).includes('&quot;'));
});
