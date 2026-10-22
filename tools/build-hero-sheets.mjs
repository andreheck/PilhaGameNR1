import fs from 'node:fs';
const source='f9299430e3001cca961ce0d9a7bd2ac64c78d759';
const files=['diretor','psicologa','cientista-de-dados','engenheiro-de-seguranca','pd-tech','rs-td'];
const clean=s=>s.replace(/\*\*/g,'').replace(/^\s*-\s*/gm,'').replace(/\s+/g,' ').trim();
const sheets=files.map((name,i)=>{
 const text=fs.readFileSync(new URL('../docs/herois/'+name+'.md',import.meta.url),'utf8').replace(/\r/g,'');
 const meta=key=>clean(text.split('\n').find(line=>new RegExp('^(?:- )?\\*\\*'+key+':\\*\\*').test(line))?.split(':**').slice(1).join(':**')||'');
 const paragraphs=text.split(/\n\s*\n/).map(p=>p.trim()).filter(p=>/^[\p{L}]/u.test(p));
 const purpose=paragraphs.find(p=>!p.startsWith('Escala')&&!p.startsWith('Valores'))||'';
 const attrSection=text.match(/^## Atributos[^\n]*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1]||'';
 const attributes=[...attrSection.matchAll(/^\|\s*([^|]+)\|\s*(\d+)\s*\|/gm)].map(m=>({name:clean(m[1]),value:+m[2]}));
 const skills=[...text.matchAll(/^### (Passiv[oa]|Ativ[oa]|Sinergia|Especial) — ([^\n]+)\n([\s\S]*?)(?=^#{2,3} |$(?![\s\S]))/gm)].map(m=>({kind:m[1],name:clean(m[2]),text:clean(m[3])}));
 if(skills.length!==4||attributes.length!==6)throw Error('Incomplete canonical sheet: '+name);
 return {id:'PILHA-H0'+(i+1),file:name,source,archetype:meta('Arquétipo'),specialization:meta('Especialização inicial')||meta('Especialização'),purpose:clean(purpose),attributes,skills};
});
fs.writeFileSync(new URL('../ui/hero-sheets.js',import.meta.url),'// Generated from approved repository sheets. Run node tools/build-hero-sheets.mjs.\nexport const HERO_SHEETS='+JSON.stringify(sheets,null,1)+';\n');
