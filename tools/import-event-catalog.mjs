// Reproduce the ES module used by the pure event engine from the preserved Claude source.
import fs from 'node:fs';import vm from 'node:vm';
const scope={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../ui/claude/pilha-eventos.js',import.meta.url),'utf8'),scope);
const {CATS,LIST}=scope.window.PilhaEventos;
fs.writeFileSync(new URL('../simulation/event-catalog.js',import.meta.url),'// Claude C2 catalogue; economic and timing rules live in adverse-events.js.\nconst CATS='+JSON.stringify(CATS,null,1)+';\nconst LIST='+JSON.stringify(LIST,null,1)+';\nexport const EVENT_CATALOG={CATS,LIST,BY:Object.fromEntries(LIST.map(e=>[e.id,e]))};\n');
