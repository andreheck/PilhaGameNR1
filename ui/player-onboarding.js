import {chooseInitialPair} from '../hero-team-ui.js';
import {initialPair} from './player-entry-state.js';
import {getHero,HERO_ROSTER} from '../hero-roster.js';
const PAGES=[
 {title:'Uma empresa. Muitas pessoas. Suas decisões.',kicker:'01 · O CENÁRIO',text:'Você quer preparar a empresa para uma possível venda. Antes disso, o conselho exige melhorias nas condições de trabalho. Escritório, Produção e Atendimento enfrentam sobrecarga, conflitos e falta de apoio. Você é o acionista: decide prioridades e libera recursos.',points:['Sua meta é concluir os cinco casos, construir planos com pelo menos 75/100 e acompanhar os resultados no ciclo de 30 dias.','Observe os sinais sobre os trabalhadores. Eles indicam situações fictícias para investigar.','Os setores fazem parte da mesma empresa e compartilham orçamento e melhorias.']},
 {title:'Observe. Escute. Escolha. Acompanhe.',kicker:'02 · O QUE VOCÊ VAI FAZER',text:'Comece pela ocorrência na Produção, converse com a equipe e resolva as quatro decisões do Caso 01. Use evidências e escuta protegida para escolher medidas organizacionais. Depois, compare e compre melhorias para o espaço.',points:['Você começa com 10.000 créditos fictícios, compartilhados entre mobiliário, programas e formação.','A compra instala o recurso e muda o cenário. Os resultados do modelo amadurecem com o tempo.']},
 {title:'Duas competências para apoiar suas decisões.',kicker:'03 · SUA EQUIPE INICIAL',text:'Escolha um herói principal e outro de apoio. Todos os seis perfis estão disponíveis desde o início. Eles representam competências complementares; os trabalhadores que circulam pela empresa são NPCs e não integram sua dupla.',points:['A dupla fica vinculada ao caso quando você inicia o ciclo. Escolha com atenção.','O ciclo tem 30 dias simulados: 7 dias por hora real ativa, cerca de 4h17 no total. Você pode pausar; o jogo não conta tempo com a aba oculta.','Comprar formação não aprova o caso nem acelera o relógio. Os poderes ainda em implementação ficam identificados na ficha.']}
];
export async function preparePlayerEntry(){
 await (window.PilhaOpeningReady||Promise.resolve());
 const game=document.getElementById('game');game.inert=true;game.style.visibility='hidden';
 let store;try{store=window.localStorage;}catch{}
 let pair=initialPair(store),page=pair?3:0;
 const root=document.createElement('section');root.className='player-entry';root.setAttribute('aria-label','Apresentação da missão e da dupla');
 document.body.append(root);
 return new Promise(resolve=>{
  function paint(){
   const p=PAGES[Math.min(page,2)];
   root.innerHTML=`<div class="entry-card"><header><span>PilhA<b>+</b> Game</span><small>BOAS-VINDAS À EMPRESA</small></header><nav aria-label="Etapas da entrada">${['Sua missão','Como jogar','Sua dupla','Entrar'].map((label,i)=>`<span ${i===page?'aria-current="step"':''}>${i+1} · ${label}</span>`).join('')}</nav><article><small>${page===3?'PRONTO PARA COMEÇAR':p.kicker}</small><h1 tabindex="-1">${page===3?'Sua empresa espera por você.':p.title}</h1><p>${page===3?'Dupla escolhida. Na empresa, observe os setores e comece pela missão na Produção. Seu saldo, seus níveis e suas conquistas continuam salvos neste navegador.':p.text}</p>${page<3?`<ul>${p.points.map(t=>`<li>${t}</li>`).join('')}</ul>`:''}
   ${page===2?`<div class="entry-roster">${HERO_ROSTER.map(h=>`<div><strong>${h.name}</strong><span>${h.specialization}</span></div>`).join('')}</div>`:''}
   ${page===3&&pair?`<div class="entry-pair"><span>PRINCIPAL<strong>${getHero(pair.principal).name}</strong></span><b>+</b><span>APOIO<strong>${getHero(pair.support).name}</strong></span></div>`:''}</article><footer>${page>0?'<button type="button" data-entry="back">Voltar</button>':''}<button type="button" class="entry-primary" data-entry="next">${page===3?'Entrar na empresa':page===2?'Escolher meus dois heróis':'Continuar →'}</button>${page===3?'<button type="button" data-entry="review">Rever a missão</button>':''}</footer><p class="entry-disclaimer">Simulação educativa com dados fictícios. Não faz diagnóstico nem substitui avaliação profissional. Você pode pausar a jornada e continuar depois.</p></div>`;
   root.querySelector('h1').focus();
  }
  root.addEventListener('click',async e=>{
   const action=e.target.closest('[data-entry]')?.dataset.entry;if(!action)return;
   if(action==='back'){page=Math.max(0,page-1);paint();return;}
   if(action==='review'){page=0;paint();return;}
   if(page===2){const selected=await chooseInitialPair(e.target);if(selected){pair=selected;page=3;}paint();return;}
   if(page<3){page++;paint();return;}
   if(!initialPair(store)){page=2;paint();return;}
   root.remove();resolve();
  });paint();
 });
}
