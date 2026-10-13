import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";

const file=(path)=>readFileSync(new URL("../"+path,import.meta.url));
const txt=path=>file(path).toString("utf8");

test("Alpha 1.0 tem CSS e painel de galpao",()=>{
 const html=txt("index.html"),js=txt("menu.js"),css=txt("v10.css");
 assert.match(html,/href="\/v10\.css"/);
 assert.match(js,/v10-hub/);
 assert.match(js,/galpao-dashboard\.webp/);
 assert.match(js,/Mapa de riscos/);
 assert.match(css,/v10-stage-row/);
});
test("Equipe apresenta quatro personagens com fotos locais e descricoes",()=>{
 const js=txt("menu.js");
 for(const id of ["operadora","psicologa","psiquiatra","colaborador"])
   assert.match(js,new RegExp("id:'"+id+"'"));
 assert.match(js,/v10-person-card/);
 assert.match(js,/viewer3d\.html\?personagem=/);
});
test("assets publicados sao WebP validos",()=>{
 for(const f of ["operadora-portrait.webp","psicologa-portrait.webp","psiquiatra-portrait.webp","colaborador-portrait.webp","galpao-dashboard.webp","galpao-diorama.webp"]){
  const path="assets/v10/"+f;
  assert.ok(existsSync(new URL("../"+path,import.meta.url)),path);
  const buf=file(path);
  assert.equal(buf.toString("ascii",0,4),"RIFF");
  assert.equal(buf.toString("ascii",8,12),"WEBP");
  assert.ok(buf.length>5000);
 }
});
test("Caso 017 completo e a exploracao 2.5D possuem caminhos separados",()=>{
 const js=txt("menu.js");
 assert.match(js,/play:'\/caso017\.html'/);
 assert.match(js,/href="\/game\.html"/);
 assert.match(txt("caso017.html"),/pilha-case017-v1/);
 assert.match(txt("game.html"),/pilha-v08/);
});
