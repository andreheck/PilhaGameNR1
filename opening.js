if(window.PilhaIntro&&!new URLSearchParams(location.search).has('jogar')){
 const game=document.getElementById('game');
 game.inert=true;
 window.PilhaIntro.mount({role:'Acionista',ctaLabel:'Explorar a empresa',onStart:()=>{
  game.inert=false;
  document.querySelector('#main')?.focus();
 }});
}
