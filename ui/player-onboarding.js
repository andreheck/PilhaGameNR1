import './hero-neon.js';
import {chooseInitialPair} from '../hero-team-ui.js';
import {initialPair} from './player-entry-state.js';
import {getHero,HERO_ROSTER} from '../hero-roster.js';
const PAGES=[
 {title:'Uma empresa. Muitas pessoas. Suas decisões.',kicker:'01 · O CENÁRIO',text:'Você quer preparar a empresa para uma possível venda. Antes disso, o conselho exige melhorias nas condições de trabalho. Escritório, Produção e Atendimento enfrentam sobrecarga, conflitos e falta de apoio. Você é o acionista: decide prioridades e libera recursos.',points:['Conclua os cinco casos, construa planos com pelo menos 75/100 e acompanhe os resultados no ciclo de 30 dias.','Observe os sinais sobre os trabalhadores. Eles indicam situações fictícias para investigar.','Os setores compartilham orçamento e melhorias.']},
 {title:'Observe. Escute. Escolha. Acompanhe.',kicker:'02 · O QUE VOCÊ VAI FAZER',text:'Comece pela ocorrência na Produção, converse com a equipe e resolva as quatro decisões do Caso 01. Use evidências e escuta protegida para escolher medidas organizacionais. Depois, compare e compre melhorias para o espaço.',points:['Você começa com 10.000 créditos fictícios para mobiliário, programas e formação.','As melhorias alteram o cenário e seus efeitos amadurecem ao longo do ciclo.']},
 {title:'Monte sua dupla de competências.',kicker:'03 · EQUIPE INICIAL',text:'Escolha dois perfis diferentes: um herói principal e um de apoio. Abra a galeria para comparar as seis especialidades e consultar as fichas antes de confirmar.',points:['A escolha fica salva neste navegador e não será solicitada novamente nas próximas entradas.','A dupla acompanha o Caso 01; os trabalhadores que circulam pela empresa são personagens NPC.']}
];
export async function preparePlayerEntry(){
 await (window.PilhaOpeningReady||Promise.resolve());
 const game=document.getElementById('game');if(!game)return;game.inert=true;game.style.visibility='hidden';
 let store;try{store=window.localStorage;}catch{}
 let pair=initialPair(store),page=pair?3:0;
 const root=document.createElement('section');root.className='player-entry';root.setAttribute('aria-label','Apresentação da missão e da dupla');document.body.append(root);
 return new Promise(resolve=>{
  function paint(){
   const p=PAGES[Math.min(page,2)];
   root.innerHTML=`<div class="entry-card"><header><span>AO <b>TRABALHO</b></span><small>BOAS-VINDAS À EMPRESA</small></header><nav aria-label="Etapas da entrada">${['Sua missão','Como jogar','Sua dupla','Entrar'].map((label,i)=>`<span ${i===page?'aria-current="step"':''}>${i+1} · ${label}</span>`).join('')}</nav><article><small>${page===3?'PRONTO PARA COMEÇAR':p.kicker}</small><h1 tabindex="-1">${page===3?'Sua empresa espera por você.':p.title}</h1><p>${page===3?'Sua dupla já está definida. Observe os setores e comece pela missão na Produção. Seu saldo, seus níveis e suas conquistas continuam salvos neste navegador.':p.text}</p>${page<3?`<ul>${p.points.map(t=>`<li>${t}</li>`).join('')}</ul>`:''}
   ${page===2?`<div class="entry-picker-hint"><span aria-hidden="true">♟</span><div><strong>Galeria dos 6 heróis</strong><small>Fichas, especialidades e escolha por função. Selecione um principal e um apoio.</small></div><button type="button" data-entry="pick">Abrir galeria</button></div>`:''}
   ${page===3&&pair?`<div class="entry-pair"><span>PRINCIPAL<strong>${getHero(pair.principal).name}</strong></span><b>+</b><span>APOIO<strong>${getHero(pair.support).name}</strong></span></div>`:''}</article><footer>${page>0?'<button type="button" data-entry="back">Voltar</button>':''}<button type="button" class="entry-primary" data-entry="next">${page===3?'Entrar na empresa':page===2?'Confirmar dupla e continuar':'Continuar →'}</button>${page===3?'<button type="button" data-entry="review">Rever a missão</button>':''}</footer><p class="entry-disclaimer">Simulação educativa com dados fictícios. Não faz diagnóstico nem substitui avaliação profissional. Você pode pausar a jornada e continuar depois.</p></div>`;
   root.scrollTop=0;root.querySelector('h1').focus({preventScroll:true});
  }
  root.addEventListener('click',async e=>{
   const action=e.target.closest('[data-entry]')?.dataset.entry;if(!action)return;
   if(action==='back'){page=Math.max(0,page-1);paint();return;}
   if(action==='review'){page=0;paint();return;}
   if(action==='pick'){const selected=await chooseInitialPair(e.target);if(selected){pair=selected;paint();}return;}
   if(page===2){if(!pair){const saved=initialPair(store);if(saved)pair=saved;}if(!pair){root.querySelector('[data-entry="pick"]')?.focus();return;}page=3;paint();return;}
   if(page<3){page++;paint();return;}
   root.remove();resolve();
  });paint();
 });
}
