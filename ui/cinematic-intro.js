/** User-supplied film before the interactive sectors; no game/storage mutation. */
export function playCinematic(){return new Promise(resolve=>{
 const root=document.createElement('section');root.className='cinematic-intro';root.setAttribute('aria-label','Ao Trabalho · apresentação');
 root.innerHTML=`<header><span>PILHA+ GAME</span><span>Uma empresa. Muitas histórias.</span></header><div class="cinematic-layout"><div class="cinematic-film"><video controls autoplay muted loop playsinline preload="metadata" poster="/assets/cinematic/ao-trabalho-poster.jpg" aria-label="Apresentação do universo Ao Trabalho"><source src="/assets/cinematic/ao-trabalho-intro.mp4" type="video/mp4"></video><p class="cinematic-fallback" hidden>O vídeo não pôde ser reproduzido. Você pode continuar para conhecer o jogo.</p></div><div class="cinematic-copy"><p class="cinematic-eyebrow">Pessoas bem, organizações fortes.</p><h1>Ao Trabalho</h1><p>Conheça a empresa, forme sua equipe e transforme o ambiente de trabalho.</p><button class="cinematic-start" type="button">Conhecer o jogo <span aria-hidden="true">→</span></button><small>Uma experiência de gestão, cuidado e escolhas.</small></div></div>`;
 const app=document.getElementById('continuous-app'),wasInert=app?.inert;if(app)app.inert=true;
 document.body.append(root);const video=root.querySelector('video'),button=root.querySelector('button'),motion=matchMedia('(prefers-reduced-motion: reduce)');video.muted=true;
 const visibility=()=>{if(document.hidden)video.pause();else if(!motion.matches&&!userPaused)video.play().catch(()=>{});};let userPaused=false,done=false;
 const motionChanged=()=>{if(motion.matches)video.pause();};video.addEventListener('error',()=>{root.querySelector('.cinematic-fallback').hidden=false;});
 video.addEventListener('pause',()=>{if(!document.hidden&&!motion.matches)userPaused=true;});video.addEventListener('play',()=>{userPaused=false;});
 if(motion.matches){video.autoplay=false;video.pause();}else video.play().catch(()=>{});
 document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',motionChanged);
 button.addEventListener('click',()=>{if(done)return;done=true;button.disabled=true;document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',motionChanged);video.pause();video.removeAttribute('src');video.querySelector('source')?.remove();video.load();root.remove();if(app)app.inert=wasInert;resolve();},{once:true});button.focus({preventScroll:true});
});}
