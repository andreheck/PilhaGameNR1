import {companyIcon} from './company-icons.js';
import {escapeHtml as esc} from './hero-neon.js';
export const PHONE_APPS=Object.freeze([
 ['pilha','spark','PilhA','#ffcb48','Seu bem-estar, agora'],
 ['messages','message','Mensagens','#47b7f4','Conexões da empresa'],
 ['team','people','Equipe','#65d6b0','Canal digital da equipe remota'],
 ['finance','chart','Finanças','#3cddb1','Acompanhe os resultados'],
 ['hr','heart','Pessoas','#ee8ea9','Cuidado com a equipe'],
 ['vacancies','people','Talentos','#a59af9','Encontre novos talentos'],
 ['trophies','star','Conquistas','#f1b251','Sua jornada em evolução'],
 ['archive','building','Arquivadas','#81adc8','Tudo em seu lugar']
]);
export function phoneCover(id){const a=PHONE_APPS.find(a=>a[0]===id);return a?`<div class="phone-app-cover" style="--app-color:${a[3]}"><i>${companyIcon(a[1])}</i><div><small>APLICATIVO DA EMPRESA</small><strong>${a[2]}</strong><span>${a[4]}</span></div></div>`:'';}
export function phoneHome({state,player,unread,archived,apps=PHONE_APPS}){
 return `<section class="phone-home-welcome"><small>SEU ESPAÇO NA EMPRESA</small><h2>Uma pausa para<br>se conectar.</h2><span>Semana ${state.week} <i>·</i> ${state.paused?'Partida pausada':'Empresa em movimento'}</span></section><button class="phone-wellbeing-peek" data-phone-app="pilha"><span class="phone-pilha-symbol">${companyIcon('spark')}</span><span><small>MEU PILHA</small><b>${esc(player?.name||'Seu personagem')}</b><em>Bem-estar mental simulado</em></span><strong>${Math.round(player?.health??80)}<small>/100</small></strong></button><nav class="phone-home-grid" aria-label="Aplicativos">${apps.map(([id,icon,name,color,subtitle])=>`<button data-phone-app="${id}" style="--app-color:${color}" aria-label="Abrir ${name}"><i>${companyIcon(icon)}${id==='messages'&&unread?`<b>${unread}</b>`:''}</i><span>${name}</span><small>${id==='messages'?unread+' novas':id==='archive'?archived+' guardadas':subtitle}</small></button>`).join('')}</nav><p class="phone-home-caption">Informações ao vivo, no seu ritmo.</p>`;
}
export function phonePlayer(player){
 if(!player?.id)return '<h2>Seu PilhA</h2><p>Escolha seu personagem para acompanhar o bem-estar.</p>';
 const health=Math.round(player.health),mood=health>=90?'Radiante':health>=75?'Bem e disposto':health>=55?'Precisando de uma pausa':health>=35?'Sob tensão':'Precisando de cuidado';
 const sector={escritorio:'Escritório',producao:'Produção',atendimento:'Atendimento',restauracao:'Restauração',patio:'Pátio'}[player.sector]||'Pátio';
 return `<section class="phone-player-profile">${player.portrait?`<img src="${esc(player.portrait)}" alt="${esc(player.name)}">`:''}<div><small>PERSONAGEM NO MAPA</small><h2>${esc(player.name)}</h2><p>${esc(sector)} · ${esc(player.activityLabel)}</p></div></section><section class="phone-health-card" style="--health:${health};--health-color:${health>=75?'#75e2bd':health>=55?'#ffd263':'#ff8ca5'}"><div class="phone-health-ring"><b data-player-health>${health}</b><span>DE 100</span></div><div><small>BEM-ESTAR MENTAL SIMULADO</small><h3>${mood}</h3><p>${player.paused?'Pausado com a partida':'Atualizado em tempo real'}</p></div></section><div class="phone-player-facts"><article><small>AGORA</small><b>${esc(player.activityLabel)}</b><span>${esc(sector)}</span></article><article><small>TENDÊNCIA ATUAL</small><b>${player.rate>0?'Recuperação gradual':player.rate<0?'Desgaste gradual':'Estável'}</b><span>${['sit','meditate','rest','read','play'].includes(player.activity)?'Pausa e recuperação':'Condições do ambiente'}</span></article></div><section class="phone-player-tip"><i>${companyIcon('leaf')}</i><div><h3>Encontre seu próximo respiro</h3><p>Toque em um banco, cadeira, tapete ou outro objeto no mapa. Caminhe até ele e escolha uma atividade.</p></div></section><button class="phone-primary" data-phone-command="explore">Voltar ao mapa e explorar</button><p class="phone-note">Este indicador pertence ao seu personagem e evolui com a exposição ao ambiente e as pausas. É uma simulação do jogo, não uma avaliação clínica.</p>`;
}
