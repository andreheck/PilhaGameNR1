/* Pré-requisito pedagógico Missão 01. Não afeta jogadores com progresso legado. */
(()=>{
 'use strict';
 try{
   const value=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
   const oldGame=value('pilha-case01-v2')||value('pilha-case01-v1')||value('pilha-v08');
   const s=value('pilha-missao01-v1');
   const learned=!!(s?.version===1&&(s.certified===true||(s.completed&&s.passed&&Number(s.score)>=70&&Number(s.correct)>=2)));
   if(!learned&&!oldGame){window.location.replace('/missao01.html?return=caso01');}
 }catch(e){ /* Se armazenamento estiver indisponível, permita acesso ao caso; a sessão não persiste. */ }
})();
