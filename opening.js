document.getElementById('game').inert=true;
document.getElementById('game').style.visibility='hidden';
window.PilhaOpeningReady=new Promise(resolve=>{
 if(!window.PilhaIntro||new URLSearchParams(location.search).has('jogar')){resolve();return;}
 window.PilhaIntro.mount({role:'Acionista',ctaLabel:'Conhecer minha missão',onStart:resolve});
});
