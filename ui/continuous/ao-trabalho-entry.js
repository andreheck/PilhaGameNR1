/* Gate the live company behind the approved start screen, then hand off to its existing opening flow. */
(function(){
  'use strict';
  var app=document.getElementById('continuous-app');
  if(!app)return;
  app.inert=true;
  app.style.visibility='hidden';
  document.addEventListener('ao-trabalho:start',function(){
    app.inert=false;
    app.style.visibility='';
  },{once:true});
})();
