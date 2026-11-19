import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const renderer=fs.readFileSync(new URL('../ui/claude/herois/pilha-herois.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../ui/hero-gallery.css',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../hero-team-ui.js',import.meta.url),'utf8');
test('seis miniaturas na ficha reutilizam o catalogo canonico',()=>{
 assert.match(renderer,/list\.map\(function \(other\)/);
 assert.match(renderer,/data-hero-preview/);
 assert.match(renderer,/aria-pressed/);
 assert.match(renderer,/view\(nextId, null\)/);
});
test('ficha mobile troca retrato sem fechar ou reabrir o dialogo',()=>{
 assert.match(renderer,/if \(!sheetOpen \|\| fromCard\) openSheet\(fromCard\)/);
 assert.match(renderer,/if \(mq\.matches\) detail\.scrollTop = 0/);
});
test('zoom responsivo preserva controles e selecao principal apoio',()=>{
 assert.match(css,/\.ph-d__fig\{min-height:390px\}/);
 assert.match(css,/\.ph-switch-thumb\.is-current/);
 assert.match(css,/@media\(max-width:899px\)/);
 assert.match(adapter,/saveHeroTeam\(storage\(\),editingCase,draft\)/);
 assert.match(adapter,/readTimeline\(storage\(\)\).campaigns\[editingCase\]/);
});
