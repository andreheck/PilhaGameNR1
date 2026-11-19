import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets', 'hero-packages');

const heroes = [
  { id: 'PILHA-H01', slug: 'diretor', name: 'DIRETOR', role: 'COORDENAÇÃO · OPERAÇÕES', rarity: 'ÉPICO', colors: ['#344b38', '#18251c', '#e7bb32'], line: 'Organizar também é cuidar do trabalho.', special: 'Reorganização estratégica', features: ['Coordenação', 'Operações', 'Gestão de recursos'] },
  { id: 'PILHA-H02', slug: 'psicologa', name: 'PSICÓLOGA', role: 'PREVENÇÃO PSICOSSOCIAL', rarity: 'ÉPICO', colors: ['#633e75', '#2f1d3e', '#ff786f'], line: 'Escuta com contexto abre caminhos.', special: 'Reequilíbrio organizacional', features: ['Escuta estratégica', 'Gestão de conflitos', 'Prevenção'] },
  { id: 'PILHA-H03', slug: 'cientista-de-dados', name: 'CIENTISTA DE DADOS', role: 'ANÁLISE · INTELIGÊNCIA APLICADA', rarity: 'ÉPICO', colors: ['#173d89', '#102448', '#25c9c2'], line: 'Padrões viram perguntas melhores.', special: 'Efeito Eureka', features: ['Análise de dados', 'Detecção de padrões', 'Previsão de riscos'] },
  { id: 'PILHA-H04', slug: 'engenheira-de-seguranca', name: 'ENGENHEIRA DE SEGURANÇA', role: 'HIGIENE OCUPACIONAL · PREVENÇÃO', rarity: 'ÉPICO', colors: ['#4a542e', '#262b1d', '#ffce2e'], line: 'Prevenir é agir antes do dano.', special: 'Zona segura', features: ['Identificação de riscos', 'Prevenção', 'Controles seguros'] },
  { id: 'PILHA-H05', slug: 'pd-tech', name: 'P&D TECH', role: 'TECNOLOGIA · TRANSFORMAÇÃO', rarity: 'LENDÁRIO', colors: ['#1757b8', '#10254e', '#23d7ce'], line: 'Tecnologia que cabe no trabalho real.', special: 'Singularidade de transformação', features: ['Inovação', 'Prototipagem', 'Tecnologia'] },
  { id: 'PILHA-H06', slug: 'rs-td', name: 'RELAÇÕES SINDICAIS\nE DIVERSIDADE', role: 'TALENTOS · DESENVOLVIMENTO', rarity: 'ÉPICO', colors: ['#b62631', '#281b27', '#f4bd2e'], line: 'Talento cresce com oportunidade.', special: 'Potencial coletivo', features: ['Seleção inclusiva', 'Aprendizagem', 'Desenvolvimento'] },
  { id: 'PILHA-H07', slug: 'hecker', name: 'HECKER', role: 'FUNDADOR · VISÃO DE PRODUTO', rarity: 'LENDÁRIO', colors: ['#edb719', '#27241d', '#fff0a0'], line: 'A ideia ganha força quando melhora o trabalho.', special: 'Legado compartilhado', features: ['Visão de produto', 'Inovação', 'Articulação entre áreas'] }
];

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const scoreLabels = ['20', '40', '60', '80', '90+'];

function card(hero) {
  const [main, dark, accent] = hero.colors;
  const titleLines = hero.name.split('\n');
  const title = titleLines.map((line, i) => `<tspan x="58" dy="${i ? 58 : 0}">${esc(line)}</tspan>`).join('');
  const roleY = 212 + (titleLines.length - 1) * 58;
  const featureMarkup = hero.features.map((feature, i) => {
    const y = 426 + i * 146;
    return `<g><circle cx="93" cy="${y + 28}" r="25" fill="${accent}"/><text x="93" y="${y + 37}" class="num" text-anchor="middle">0${i + 1}</text><text x="132" y="${y + 24}" class="feature">${esc(feature)}</text><path d="M74 ${y + 77}h244" stroke="#ffffff" opacity=".18"/></g>`;
  }).join('');
  const scores = scoreLabels.map((band, i) => {
    const x = 74 + i * 184;
    const file = `../heroes/scores/${hero.id}/${band}.png`;
    return `<g><clipPath id="clip-${hero.id}-${i}"><rect x="${x}" y="1393" width="146" height="104" rx="18"/></clipPath><rect x="${x}" y="1393" width="146" height="104" rx="18" fill="${dark}" stroke="${accent}" stroke-width="3"/><image href="${file}" x="${x}" y="1393" width="146" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${hero.id}-${i})"/><rect x="${x}" y="1498" width="146" height="34" rx="0 0 14 14" fill="${dark}"/><text x="${x + 73}" y="1523" class="score" text-anchor="middle">${band}</text></g>`;
  }).join('');
  const figure = `../heroes/refresh-a-pose-2026-11/${hero.id}-${hero.slug}.png`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1620" viewBox="0 0 1080 1620" role="img" aria-labelledby="title desc">
<title id="title">Embalagem PilhA+ ${esc(hero.name.replace('\n', ' '))}</title><desc id="desc">Card colecionável de herói com retrato integral, especialidade e cinco expressões ligadas às faixas de score de saúde.</desc>
<defs><linearGradient id="cardbg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${main}"/><stop offset=".53" stop-color="${dark}"/><stop offset="1" stop-color="${main}"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".34"/><stop offset=".35" stop-color="#fff" stop-opacity=".05"/><stop offset=".8" stop-color="${accent}" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".21"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".35"/></filter></defs>
<rect x="14" y="14" width="1052" height="1592" rx="54" fill="#101522" filter="url(#shadow)"/><rect x="25" y="25" width="1030" height="1570" rx="48" fill="url(#cardbg)" stroke="${accent}" stroke-width="10"/><path d="M49 355L365 32h210L49 602zm0 735l720-760h142L49 1245z" fill="#fff" opacity=".035"/>
<path d="M420 28h240c0 58-34 86-76 86H496c-42 0-76-28-76-86z" fill="#121723" stroke="${accent}" stroke-width="7"/><rect x="476" y="47" width="128" height="43" rx="21" fill="#202739"/>
<rect x="55" y="58" width="310" height="82" rx="26" fill="#111b2b" stroke="${accent}" stroke-width="4"/><path d="M82 119V78l39-12v57l-13-14-13 14z" fill="${accent}"/><text x="144" y="111" class="brand">PilhA<tspan fill="${accent}">+</tspan></text>
<rect x="804" y="52" width="218" height="100" rx="27" fill="#181b2b" stroke="${accent}" stroke-width="5"/><text x="913" y="92" class="rarity" text-anchor="middle">✦ ${esc(hero.rarity)}</text><text x="913" y="126" class="eyebrow" text-anchor="middle">HERO COLLECTION</text>
<text x="58" y="193" class="name">${title}</text><text x="60" y="${roleY}" class="role">${esc(hero.role)}</text>
<rect x="48" y="300" width="332" height="748" rx="34" fill="#101a2b" fill-opacity=".86" stroke="${accent}" stroke-width="4"/><text x="78" y="351" class="section">ESPECIALIDADES</text>${featureMarkup}
<rect x="48" y="1070" width="332" height="248" rx="34" fill="#101a2b" fill-opacity=".9" stroke="${accent}" stroke-width="4"/><text x="78" y="1124" class="section">HABILIDADE</text><text x="78" y="1176" class="special">${esc(hero.special)}</text><path d="M78 1204h250" stroke="${accent}" stroke-width="4"/><text x="78" y="1250" class="line">${esc(hero.line)}</text>
<rect x="402" y="286" width="626" height="1032" rx="54" fill="#101827" fill-opacity=".32" stroke="#fff" stroke-opacity=".68" stroke-width="9"/><rect x="420" y="304" width="590" height="996" rx="42" fill="url(#glass)" stroke="${accent}" stroke-opacity=".55" stroke-width="3"/><image href="${figure}" x="408" y="310" width="612" height="985" preserveAspectRatio="xMidYMid meet"/><path d="M444 345C530 302 880 303 978 355M443 370v870" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".26" fill="none"/><path d="M430 1270q268 49 579 0" fill="none" stroke="#fff" stroke-width="5" opacity=".42"/>
<rect x="48" y="1342" width="984" height="216" rx="32" fill="#101827" fill-opacity=".93" stroke="${accent}" stroke-width="4"/><text x="76" y="1380" class="section">CINCO EXPRESSÕES · ESTADO DE SAÚDE</text>${scores}<text x="540" y="1579" class="foot" text-anchor="middle">A aparência acompanha o score simulado do personagem.</text>
<style>.brand{font:700 42px Arial,sans-serif;fill:#fff;letter-spacing:-1px}.rarity{font:800 24px Arial,sans-serif;fill:#fff}.eyebrow{font:700 12px Arial,sans-serif;fill:${accent};letter-spacing:2px}.name{font:900 49px Arial,sans-serif;fill:#fff;letter-spacing:-1.2px}.role{font:700 18px Arial,sans-serif;fill:${accent};letter-spacing:1.3px}.section{font:800 18px Arial,sans-serif;fill:${accent};letter-spacing:2px}.num{font:700 18px Arial,sans-serif;fill:${dark}}.feature{font:700 22px Arial,sans-serif;fill:#f5f6f7}.special{font:800 24px Arial,sans-serif;fill:#fff}.line{font:italic 700 19px Arial,sans-serif;fill:#dce4ed}.score{font:800 18px Arial,sans-serif;fill:#fff}.foot{font:600 14px Arial,sans-serif;fill:#d7dce5;letter-spacing:.3px}</style></svg>`;
}

await mkdir(outDir, { recursive: true });
for (const hero of heroes) {
  await writeFile(path.join(outDir, `${hero.id}-${hero.slug}.svg`), card(hero), 'utf8');
}
const manifest = {
  status: 'artwork-created-not-wired-to-recruitment',
  created: '2026-11-17',
  packageFormat: 'SVG, portrait 2:3, full-body cutout with score portrait strip',
  scoreBands: { '20': '0-29', '40': '30-49', '60': '50-69', '80': '70-90', '90+': '91-100' },
  heroes: heroes.map(({ id, name, rarity, slug }) => ({
    id, name: name.replace('\n', ' '), rarity,
    package: `assets/hero-packages/${id}-${slug}.svg`,
    fullBody: `assets/heroes/refresh-a-pose-2026-11/${id}-${slug}.png`,
    scorePortraits: Object.fromEntries(scoreLabels.map(band => [band, `assets/heroes/scores/${id}/${band}.png`]))
  }))
};
await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
