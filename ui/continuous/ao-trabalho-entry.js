/* Gate the live company behind the approved start screen, then hand off to its existing opening flow. */
(function(){
  'use strict';
  var app=document.getElementById('continuous-app');
  if(!app)return;
  if(new URLSearchParams(location.search).get('debug')==='scale'){
    var screen=document.getElementById('ao-trabalho-start');
    if(screen)screen.hidden=true;
    app.inert=false;
    app.style.visibility='';
    return;
  }
  app.inert=true;
  app.style.visibility='hidden';
  document.addEventListener('ao-trabalho:start',function(){
    app.inert=false;
    app.style.visibility='';
  },{once:true});
})();
