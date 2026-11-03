import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("logistica-simulacao.html", "utf8");
const js = fs.readFileSync("logistica-simulacao.js", "utf8");
const css = fs.readFileSync("logistica-simulacao.css", "utf8");
const index = fs.readFileSync("index.html", "utf8");

for (const id of [
  "budget", "team-score", "team-count", "alert-count", "upgrade-count", "news-feed", "game-over", "ending-reset", "management-capacity", "cycle-summary", "cycle-events",
  "map-workers", "employee-list", "intervention-list", "employee-detail",
  "history", "reset-game", "toast", "cash-warning", "finance-summary", "finance-forecast", "succession-panel", "cipa-panel"
]) assert.ok(html.includes(`id="${id}"`), `HTML deve conter #${id}`);

assert.match(html, /name="viewport"/);
assert.match(index, /href="\/logistica-simulacao.html">Simulação logística<\/a>/);
assert.match(html, /Simulação logística/);
assert.match(html, /The Mentalist Post/);
assert.match(js, /getOrganizationSnapshot/);
assert.match(js, /evaluateEnterpriseOutcomes/);

assert.match(js, /consumeManagementAction/);
assert.match(js, /closeManagementPeriod/);
assert.match(html, /Consequências e revisões/);
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
const closeIndex = js.indexOf("closeManagementPeriod(game");
const evaluateIndex = js.indexOf("evaluateEnterpriseOutcomes(cycleResult.state", closeIndex);
const advanceIndex = js.indexOf("advanceWorkforcePeriod(outcome.state)", evaluateIndex);
assert.ok(closeIndex < evaluateIndex && evaluateIndex < advanceIndex, "avaliar o período fechado antes de debitar a recorrência do próximo período");
assert.match(js, /if \(outcome\.ending\)[\s\S]*?return;[\s\S]*?advanceWorkforcePeriod\(outcome\.state\)/, "não avançar o ciclo depois de um desfecho terminal");
assert.match(html, /Compromissos futuros/);
assert.match(css, /finance-outlook/);
assert.match(css, /relationship-taresolvido/);
assert.match(css, /relationship-xacomigo/);
assert.match(css, /@media\(max-width:720px\)/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /:focus-visible/);

console.log("Logística: página, seletores, orçamento, histórico, acessibilidade básica e layout responsivo PASS");
