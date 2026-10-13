import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const load = p => readFileSync(new URL("../"+p,import.meta.url),"utf8");
const home=load("index.html"),menu=load("menu.js"),css=load("menu.css"),game=load("game.html"),viewer=load("viewer3d.html");
test("home referencia seus proprios assets",()=>{
 assert.match(home,/href="\/menu\.css"/);
 assert.match(home,/src="\/menu\.js"/);
 assert.match(home,/id="main-content"/);
 assert.match(home,/id="scene-template"/);
});
test("rotas internas e telas existem",()=>{
 for(const name of ["inicio","casos","equipe","biblioteca","configuracoes","sobre"])
   assert.ok(menu.includes(name),"missing view "+name);
 for(const path of ["/game.html","/viewer3d.html"])
   assert.ok(menu.includes(path),"missing link "+path);
 assert.ok(home.includes("/game.html"),"quick game route missing");
});
test("capitulo preservou chave de progresso",()=>{
 assert.match(game,/pilha-v08/);
 assert.match(menu,/pilha-v08/);
 assert.match(game,/\.\/src\/world\.js/);
});
test("laboratorio permite pre-selecionar personagem por link",()=>{
 assert.match(viewer,/URLSearchParams\(window\.location\.search\)/);
 assert.match(viewer,/personagem/);
 for(const name of ["operadora","psicologa","psiquiatra"])
   assert.ok(menu.includes(name) && viewer.includes(name));
});
test("progresso e configuracoes permanecem locais",()=>{
 assert.match(menu,/localStorage/);
 assert.match(menu,/pilha-menu-preferences-v1/);
 assert.match(menu,/reset-progress/);
 assert.match(menu,/window\.confirm/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(home,/aria-label/);
});
