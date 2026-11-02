import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("logistica-simulacao.html", "utf8");
const js = fs.readFileSync("logistica-simulacao.js", "utf8");
const css = fs.readFileSync("logistica-simulacao.css", "utf8");
const index = fs.readFileSync("index.html", "utf8");

for (const id of [
  "budget", "team-score", "team-count", "alert-count", "upgrade-count",
  "map-workers", "employee-list", "intervention-list", "employee-detail",
  "history", "reset-game", "toast", "cash-warning", "finance-summary", "finance-forecast"
]) assert.ok(html.includes(`id="${id}"`), `HTML deve conter #${id}`);

assert.match(html, /name="viewport"/);
assert.match(index, /href="\/logistica-simulacao.html">Simulação logística<\/a>/);
assert.match(html, /Simulação logística/);
assert.match(js, /getOrganizationSnapshot/);
assert.match(js, /getEmployeeSnapshot/);
assert.match(js, /applyIntervention/);
assert.match(js, /localStorage/);
assert.match(js, /data-worker/);
assert.match(js, /data-apply/);
assert.match(js, /criticalAlerts/);
assert.match(js, /workforce-relations\.js/);
assert.match(js, /data-supplier/);
assert.match(html, /id="supplier-list"/);
assert.match(html, /Taresolvido/);
assert.match(html, /Xacomigo/);
assert.match(html, /collective-status/);
assert.match(html, /collective-toggle/);
assert.match(js, /updateCollectiveRepresentation/);
assert.match(js, /advanceWorkforcePeriod/);
assert.match(js, /getWorkforceFinanceSnapshot/);
assert.match(html, /Compromissos futuros/);
assert.match(css, /finance-outlook/);
assert.match(css, /relationship-taresolvido/);
assert.match(css, /relationship-xacomigo/);
assert.match(css, /@media\(max-width:720px\)/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /:focus-visible/);

console.log("Logística: página, seletores, orçamento, histórico, acessibilidade básica e layout responsivo PASS");
