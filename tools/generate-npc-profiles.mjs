// tools/generate-npc-profiles.mjs
import fs from 'node:fs';
import path from 'node:path';

const catalog = JSON.parse(fs.readFileSync('data/npcs/catalogo-v1.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('data/continuous/npc-art-manifest.json', 'utf8'));
const details = new Map(catalog.npcs.map(p => [p.id, p]));
const images = manifest.npcs;
if (!Array.isArray(images) || images.length !== 16) throw Error('Expected 16 NPC images');
if (details.size !== 16) throw Error('Expected 16 canonical NPC profiles');

const profile = Object.fromEntries(images.map((a) => {
  const d = details.get(a.id);
  if (!d || a.name !== d.nome || a.type !== d.tipo)
    throw Error(`Identity mismatch for ${a.id}`);
  if (!/^assets\/npcs\/npc-\d{2}-[a-z0-9-]+\.png$/.test(a.canonical))
    throw Error(`Invalid canonical image path: ${a.canonical}`);
  return [a.id, {
    id: a.id,
    name: d.nome,
    type: d.tipo,
    archetype: d.arquetipo,
    group: d.grupo,
    portrait: '/' + a.canonical,
    age: d.idade ?? null,
    roleLabel: d.papel ?? null,
    summary: d.influencia ?? null,
    strengths: d.forcas ?? [],
    watchouts: d.pontos_de_atencao ?? [],
    favorableConditions: d.condicoes_favoraveis ?? [],
    adverseConditions: d.condicoes_adversas ?? [],
    situationalSignals: d.sinais_situacionais ?? [],
    proposedSynergies: d.sinergias_propostas ?? [],
    environments: d.ambientes ?? null,
    proposedEffects: d.pontos ?? null,
    status: d.status ?? 'em-revisao',
    disclaimer: 'Perfil narrativo fictício; não determina saúde, doença ou aptidão.'
  }];
}));

fs.mkdirSync(path.dirname('data/continuous/npc-profiles.js'), {recursive:true});
const output=
  '/* Gerado a partir dos catálogos canônicos; não editar à mão. */\n' +
  'export const NPC_PROFILES = Object.freeze(' + JSON.stringify(profile, null, 2) + ');\n' +
  'export const npcProfile = id => NPC_PROFILES[id] || null;\n';
const destination='data/continuous/npc-profiles.js';
if(!fs.existsSync(destination)||fs.readFileSync(destination,'utf8').replace(/\r\n/g,'\n')!==output)fs.writeFileSync(destination,output,'utf8');
console.log('Perfis NPC gerados:', Object.keys(profile).length);
