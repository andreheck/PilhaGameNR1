import {getPreferences,decorativeMotionAllowed} from './game-preferences.js';
/** User-supplied film before the interactive sectors; no game/storage mutation. */
export function playCinematic({hasTeam=false,paused=false}={}){return new Promise(resolve=>{
 const root=document.createElement('section');root.className='cinematic-intro';root.setAttribute('aria-label','Ao Trabalho · apresentação');
 root.innerHTML=`<header><span>PILHA+ GAME</span><span>Uma empresa. Muitas histórias.</span></header><div class="cinematic-layout"><div class="cinematic-film"><video controls autoplay muted loop playsinline preload="metadata" poster="/assets/cinematic/ao-trabalho-poster.jpg" aria-label="Apresentação do universo Ao Trabalho"><source src="/assets/cinematic/ao-trabalho-intro.mp4" type="video/mp4"></video><p class="cinematic-fallback" hidden>O vídeo não pôde ser reproduzido. Você pode continuar para conhecer o jogo.</p></div><div class="cinematic-copy"><p class="cinematic-eyebrow">Pessoas bem, organizações fortes.</p><h1>Ao Trabalho</h1><p>Conheça a empresa, forme sua equipe e transforme o ambiente de trabalho.</p><button class="cinematic-start" type="button">Conhecer o jogo <span aria-hidden="true">→</span></button><small>Uma experiência de gestão, cuidado e escolhas.</small></div></div>`;
 const app=document.getElementById('continuous-app'),wasInert=app?.inert;if(app)app.inert=true;
 root.querySelector('header span').outerHTML='<button class="cinematic-home" data-game-home aria-label="Voltar à tela inicial"><img src="/assets/branding/pilha-logo-puro.png" alt="">PILHA+ GAME</button>';
 const settings=document.createElement('button');settings.type='button';settings.dataset.gameSettings='';settings.textContent='Configurações';root.querySelector('header').append(settings);
 if(hasTeam){root.classList.add('cinematic-has-save');const resume=document.createElement('button');resume.type='button';resume.className='cinematic-resume';resume.textContent='Continuar partida →';root.querySelector('.cinematic-start').before(resume);root.querySelector('.cinematic-copy small').textContent=paused?'Dupla e progresso salvos. A empresa está pausada.':'Dupla e progresso salvos. O relógio continua; use Pausar jogo para interrompê-lo.';}
 document.body.append(root);const video=root.querySelector('video'),button=root.querySelector('.cinematic-start'),motion=matchMedia('(prefers-reduced-motion: reduce)');video.muted=true;
 const allowed=()=>decorativeMotionAllowed(getPreferences(),motion.matches);let userPaused=false,done=false;
 const visibility=()=>{if(document.hidden||!allowed())video.pause();else if(!userPaused)video.play().catch(()=>{});};
 video.addEventListener('error',()=>{root.querySelector('.cinematic-fallback').hidden=false;});
 video.addEventListener('pause',()=>{if(!document.hidden&&allowed())userPaused=true;});video.addEventListener('play',()=>{userPaused=false;});
 if(!allowed()){video.autoplay=false;video.pause();}else video.play().catch(()=>{});
 document.addEventListener('visibilitychange',visibility);window.addEventListener('pilha:preferences',visibility);
 const finish=choice=>{if(done)return;done=true;button.disabled=true;document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pilha:preferences',visibility);video.pause();video.removeAttribute('src');video.querySelector('source')?.remove();video.load();root.remove();if(app)app.inert=wasInert;resolve(choice);};
 button.addEventListener('click',()=>finish('explore'),{once:true});const resume=root.querySelector('.cinematic-resume');resume?.addEventListener('click',()=>finish('resume'),{once:true});(resume||button).focus({preventScroll:true});
});}
