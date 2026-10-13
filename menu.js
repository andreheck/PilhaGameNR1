/* PilhA+ Game — Menu e hub do prototipo v0.9. Sem dependencias externas. */
(() => {
'use strict';
const main = document.getElementById('main-content');
if (!main) return;
const STORAGE_PROGRESS = 'pilha-v08';
const STORAGE_PREFS = 'pilha-menu-preferences-v1';
const ALLOWED = ['inicio','casos','equipe','biblioteca','configuracoes','sobre'];
const prefsDefault = { nickname:'', contrast:false, largeText:false, reduceMotion:false, effects:false };
const GLB_URLS = {
  operadora:'https://drive.google.com/file/d/1VZuPdXNRuFvFjI2NerJAv9PJiod6uAnA/view',
  psicologa:'https://drive.google.com/file/d/1X8jMu433NYg07qub-3u60QLLsKZ4lZkS/view',
  psiquiatra:'https://drive.google.com/file/d/1mY4aXahMZNLv1jkVfrwD2LxaauGHjlpI/view'
};
const NAV_LABELS = {inicio:'Início',casos:'Casos',equipe:'Equipe',biblioteca:'Biblioteca',configuracoes:'Configurações',sobre:'Sobre'};
const PATHS = {
 play:'/caso017.html',
 lab:'/viewer3d.html',
 github:'https://github.com/andreheck/PilhaGameNR1',
 drive:'https://drive.google.com/drive/folders/1B-mPPAQ1aPbBmAi-e8H21aFxKETnVX19'
};
const glyphs = {
 play:'<path d="m8 5 12 7-12 7V5Z"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.2a4 4 0 0 1 0 7.6M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
 settings:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m20 12 1.5-1-1.7-3-1.8.5a7 7 0 0 0-1.7-1l-.3-1.9h-3.5l-.5 1.9a7 7 0 0 0-1.7 1L8.4 8l-1.7 3L8.2 12l-1.5 1 1.7 3 1.8-.5a7 7 0 0 0 1.7 1l.4 1.9h3.5l.5-1.9a7 7 0 0 0 1.7-1l1.8.5 1.7-3L20 12Z"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M9 7h7M9 11h6"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
 monitor:'<rect x="2" y="3" width="20" height="15" rx="2"/><path d="M8 22h8M12 18v4"/>',
 shield:'<path d="M12 22s8-4 8-11V5L12 2 4 5v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4 4-2Z"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 chart:'<path d="M4 20V4M4 20h16M8 15l4-5 4 2 4-7"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>'
};
function icon(name){
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">'+(glyphs[name]||glyphs.compass)+'</svg>';
}
function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function getStore(key){try{return localStorage.getItem(key)}catch(e){return null}}
function putStore(key,value){try{localStorage.setItem(key,value);return true}catch(e){return false}}
function removeStore(key){try{localStorage.removeItem(key)}catch(e){}}
function getPrefs(){try{return {...prefsDefault,...(JSON.parse(getStore(STORAGE_PREFS)||'{}')||{})}}catch(e){return {...prefsDefault}}}
function getProgress(){try{const v=getStore(STORAGE_PROGRESS);return v?JSON.parse(v):null}catch(e){return null}}
let prefs = getPrefs();
function applyPrefs(){
  const root=document.documentElement;
  root.dataset.contrast=prefs.contrast?'high':'normal';
  root.dataset.text=prefs.largeText?'large':'normal';
  root.dataset.motion=prefs.reduceMotion?'reduce':'normal';
}
applyPrefs();
function sound(){
  if(!prefs.effects)return;
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    const ctx=new Audio();const o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine';o.frequency.setValueAtTime(540,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(740,ctx.currentTime+.065);
    g.gain.setValueAtTime(.025,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.075);
    o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.08);o.onended=()=>ctx.close();
  }catch(e){}
}
function navLink(v,label,extra=''){return '<a href="'+(v==='inicio'?'/':'/?view='+v)+'" data-view="'+v+'"'+(extra?' class="'+extra+'"':'')+'>'+label+'</a>'}
function progressStats(){
  let p=null;try{p=JSON.parse(getStore('pilha-case017-v1')||'null')}catch(e){}
  const started=!!p;
  const found=Array.isArray(p?.evidence)?Math.min(4,p.evidence.length):0;
  const stage=Number.isFinite(Number(p?.step))?Math.max(0,Math.min(4,Number(p.step))):0;
  return {p,found,stage,decision:stage===4,percent:Math.round(found*25),started};
}
function withIcon(name,title,text,cta,href,color=''){
 return '<article class="feature-card" style="--card-accent:'+({orange:'#f49d4d',blue:'#7bacc2',green:'#84b6a3'}[color]||'#84b6a3')+'">'+
 '<div class="card-icon '+(color==='orange'?'orange':color==='blue'?'blue':'')+'">'+icon(name)+'</div>'+
 '<h3>'+title+'</h3><p>'+text+'</p><div class="foot">'+cta+
 '<a class="text-link" href="'+href+'">Acessar '+icon('arrow')+'</a></div></article>';
}
function home(){
  const p=progressStats();
  const currentStage=Number.isFinite(p.stage)?p.stage:0;
  const name=escapeHtml(prefs.nickname.trim()||'Jogador');
  const r=[
    ['Carga de trabalho',78,'#e86550'],['Jornada e descanso',75,'#ec8050'],
    ['Conflitos',67,'#e76c50'],['Apoio da liderança',55,'#f1a237'],
    ['Autonomia',48,'#eeaa39'],['Reconhecimento',39,'#eeba48']
  ];
  const people=[
    ['operadora','Operadora','Operação'],['psicologa','Psicóloga','Acolhimento'],
    ['psiquiatra','Psiquiatra','Apoio médico'],['colaborador','Colaborador','Vivências']
  ];
  const stages=[
    ['01','Investigar','Reunir evidências e ouvir a equipe'],
    ['02','Analisar','Compreender o trabalho real'],
    ['03','Plano de ação','Definir medidas preventivas'],
    ['04','Acompanhar','Verificar implantação e efeitos'],
    ['05','Evoluir','Encerrar e aprender']
  ];
  const rail=[
    ['inicio','house','Visão geral'],['casos','briefcase','Casos'],
    ['equipe','users','Equipe'],['biblioteca','book','Recursos'],
    ['configuracoes','settings','Configurações']
  ];
  const stageText=['Investigação','Análise','Plano de ação','Acompanhamento','Encerramento'];
  return '<div class="v10-hub">'+
    '<nav class="v10-rail" aria-label="Central de gestão"><div class="v10-rail-title">MENU DO JOGO</div>'+
      rail.map(([id,ic,label])=>'<a '+(id==='inicio'?'class="active" aria-current="page"':'')+' href="'+(id==='inicio'?'/':'/?view='+id)+'" data-view="'+id+'">'+icon(ic)+label+'</a>').join('')+
      '<a href="/viewer3d.html">'+icon('monitor')+'Laboratório 3D</a>'+
      '<div class="v10-rail-caption">PilhA+ Game · Alpha 1.0<br>Simulação educativa sobre riscos psicossociais no trabalho</div>'+
    '</nav>'+
    '<div class="v10-content">'+
      '<header class="v10-heading"><div><div class="v10-kicker">SIMULAÇÃO ORGANIZACIONAL · ALPHA 1.0</div><h1>Central de gestão <span>PilhA+</span></h1><p>Bem-vindo, '+name+'. Explore, investigue e faça escolhas com base em evidências.</p></div>'+
      '<a class="v10-top-action" href="/caso017.html">'+icon('play')+(p.started?'Retomar Caso 017':'Começar Caso 017')+'</a></header>'+
      '<div class="v10-stage-row">'+
        '<section class="v10-stage" aria-label="Galpão logístico do Caso 017">'+
          '<img src="/assets/v10/galpao-dashboard.webp" alt="Cenário ilustrado em perspectiva isométrica de galpão, com áreas de armazenagem, movimentação de cargas e expedição" decoding="async" fetchpriority="high">'+
          '<div class="v10-stage-top"><div><span class="eyebrow">AMBIENTE EM DESTAQUE</span><h2>Galpão Logístico</h2></div><span class="v10-scene-pill">CASO 017 · RISCO ALTO</span></div>'+
          '<div class="v10-places"><a class="v10-pin storage" href="/caso017.html" title="Investigar armazenagem"><i></i>Armazenagem</a>'+
            '<a class="v10-pin operation" href="/caso017.html" title="Investigar operação"><i></i>Operação</a>'+
            '<a class="v10-pin dock" href="/caso017.html" title="Investigar expedição"><i></i>Expedição</a></div>'+
          '<div class="v10-stage-bottom"><div><strong>Onde surgem os fatores de risco?</strong><span>Conheça o ambiente, converse com a equipe e avalie a organização da jornada.</span></div><a class="v10-stage-button" href="/caso017.html">Explorar caso →</a></div>'+
        '</section>'+
        '<aside class="v10-side">'+
          '<section class="v10-risk"><h2>Mapa de riscos · exemplo</h2><div class="v10-risk-list">'+
            r.map(([label,score,color])=>'<div class="v10-risk-row"><b>'+label+'</b><span class="v10-bar" aria-label="'+score+' de 100"><i style="width:'+score+'%;--bar:'+color+'"></i></span><span class="num">'+score+'</span></div>').join('')+
            '</div><p class="v10-risk-note">Escalas ilustrativas (0–100), não diagnósticas. Não representam medições realizadas.</p></section>'+
          '<section class="v10-team-mini"><h3>Personagens <a href="/?view=equipe" data-view="equipe">Conheça a equipe →</a></h3><div class="v10-face-row">'+
            people.map(([id,label,role])=>'<a href="/?view=equipe" data-view="equipe" title="'+label+' — '+role+'"><img src="/assets/v10/'+id+'-portrait.webp" alt="" loading="lazy"><span>'+label+'</span></a>').join('')+'</div></section>'+
        '</aside></div>'+
        '<div class="v10-loop" aria-label="Etapas da experiência">'+
          stages.map(([number,title,detail])=>'<a href="/caso017.html" title="'+title+' — '+detail+'"><i>'+number+'</i><div><b>'+title+'</b><span>'+detail+'</span></div></a>').join('')+
        '</div>'+
        '<div class="v10-bottom">'+
          '<section class="v10-case"><div class="v10-case-head"><h3>Caso 017 · Sobrecarga no galpão</h3><em>RISCO ALTO</em></div><p>O crescimento operacional foi acompanhado por horas extras, conflitos entre turnos e dificuldade para realizar pausas. Sua missão é investigar antes de decidir.</p>'+
            '<div class="v10-case-status"><span>Setor: logística</span><span>28 trabalhadores (fictício)</span><span>'+ (p.started?'Etapa: '+(stageText[currentStage]||'Investigação'):'Caso não iniciado')+'</span></div>'+
            '<div class="v10-case-actions"><a href="/caso017.html">'+(p.started?'Continuar jornada':'Iniciar investigação')+' →</a><a class="secondary" href="/game.html">Exploração 2.5D experimental</a></div>'+
          '</section>'+
          '<section class="v10-insights"><h3>Como o caso se desenvolve? <span class="v10-newflag">Jornada completa</span></h3>'+
            '<div class="v10-evidence-items"><span><b>01</b> Escute trabalhadores e liderança</span><span><b>02</b> Analise metas e jornada</span><span><b>03</b> Planeje medidas organizacionais</span><span><b>04</b> Defina acompanhamento e conclua</span></div>'+
            '<p>Você pode continuar depois: a jornada é salva neste navegador. O resultado educativo não equivale à comprovação de eficácia real.</p></section>'+
        '</div>'+
    '</div></div>';
}
function intro(kicker,title,text){return '<div class="page-intro"><span class="eyebrow dark">'+kicker+'</span><h1>'+title+'</h1><p>'+text+'</p></div>'}
function cases(){
 const p=progressStats();
 return '<div class="page"><section class="page-panel">'+intro('CAPÍTULOS E MISSÕES','Casos para investigar','Cada caso apresenta um contexto organizacional, diferentes perspectivas, evidências e decisões. Nesta etapa, apenas o primeiro capítulo está jogável.')+
 '<div class="collection-grid">'+
 '<article class="item-card"><span class="tag">Caso 017 · Jogável</span><h2>A sobrecarga invisível</h2><p>Metas, horas extras e tensões na operação logística. Ouça a equipe, reúna evidências e escolha uma intervenção.</p><div class="case-tags"><span>4 fontes</span><span>3 intervenções</span></div><div class="foot"><span class="status-label">'+(p.started?(p.decision?'Decisão registrada':p.found+'/4 evidências'):'Novo')+'</span><a class="btn btn-primary small" href="/caso017.html">'+icon('play')+' '+(p.started?'Continuar':'Jogar')+'</a></div></article>'+
 '<article class="item-card"><span class="tag">Caso 018 · Em planejamento</span><h2>O silêncio da equipe</h2><p>Um ambiente onde críticas e dúvidas deixaram de circular. Uma futura missão sobre segurança psicológica, participação e comunicação.</p><div class="foot"><span class="status-label planned">Em desenvolvimento</span><button class="btn small" disabled>Em breve</button></div></article>'+
 '<article class="item-card"><span class="tag">Caso 019 · Em planejamento</span><h2>Metas a qualquer custo</h2><p>Cobrança excessiva, ambiguidade de papéis e falta de recursos. Uma futura missão sobre organização do trabalho.</p><div class="foot"><span class="status-label planned">Em desenvolvimento</span><button class="btn small" disabled>Em breve</button></div></article></div>'+
 '<div class="notice">Os indicadores e personagens são fictícios. As missões ensinam a reconhecer fatores relacionados ao trabalho, não a diagnosticar pessoas nem certificar conformidade com a NR-1.</div></section></div>';
}
function avatar(color,skin,hair){
 return '<div class="avatar"><svg viewBox="0 0 100 130" role="img" aria-label="Avatar estilizado ilustrativo"><ellipse cx="50" cy="123" rx="29" ry="7" fill="#5b85754f"/>'+
 '<path d="M31 88h16v31H27V96Zm22 0h17l3 31H53Z" fill="#263d54"/><rect x="23" y="112" width="27" height="10" rx="6" fill="#1f2b36"/><rect x="52" y="112" width="28" height="10" rx="6" fill="#1f2b36"/>'+
 '<path d="M22 54Q49 43 76 54l6 47H19Z" fill="'+color+'"/><path d="M34 58h33l-17 14Z" fill="#f3e9da"/><path d="M22 60 14 91Q12 100 22 102l12-39M75 59 85 94Q87 103 78 105l-12-42" fill="'+skin+'"/>'+
 '<ellipse cx="50" cy="32" rx="28" ry="30" fill="'+skin+'"/><path d="'+hair+'" fill="#30252a"/>'+
 '<circle cx="41" cy="36" r="2.6" fill="#1c2939"/><circle cx="59" cy="36" r="2.6" fill="#1c2939"/><path d="M45 47q6 5 12 0" fill="none" stroke="#663c34" stroke-width="2" stroke-linecap="round"/></svg></div>';
}
function team(){
  const cast=[
    {id:'operadora',n:'Operadora logística',type:'Operação e segurança',desc:'Vivencia as condições do galpão: jornada, pausas, exigências de produtividade e segurança. Sua perspectiva é essencial para compreender o trabalho real.',model:'operadora',idx:'01'},
    {id:'psicologa',n:'Psicóloga',type:'Atenção psicossocial',desc:'Contribui com acolhimento, escuta qualificada e apoio psicológico. Atua de forma complementar às medidas organizacionais, respeitando sigilo e autonomia.',model:'psicologa',idx:'02'},
    {id:'psiquiatra',n:'Psiquiatra',type:'Cuidado médico especializado',desc:'Realiza avaliação médica e tratamentos quando indicados. Sua atuação clínica é complementar e não substitui a prevenção dos riscos no trabalho.',model:'psiquiatra',idx:'03'},
    {id:'colaborador',n:'Colaborador personalizável',type:'Vivências do trabalhador',desc:'Avatar-base do jogador. Representa diferentes experiências, funções e trajetórias diante das condições e relações de trabalho.',model:null,idx:'04'}
  ];
  return '<div class="v10-team-page">'+
    '<header class="v10-team-hero"><div><span class="eyebrow">PERSONAGENS · PILHA+ GAME</span><h1>Conheça a equipe</h1><p>Quatro personagens compõem nossa primeira família visual. Cada papel permite observar o mesmo ambiente sob uma perspectiva diferente e compreender as respostas complementares à prevenção e ao cuidado.</p></div><a href="/caso017.html">Explorar Caso 017 →</a></header>'+
    '<div class="v10-roster">'+cast.map(o=>
      '<article class="v10-person-card"><div class="v10-person-art"><span class="v10-index">'+o.idx+'</span><img src="/assets/v10/'+o.id+'-portrait.webp" alt="Ilustração 3D de '+o.n+'" loading="'+(o.idx==='01'?'eager':'lazy')+'"></div>'+
      '<div class="v10-person-content"><span class="type">'+o.type+'</span><h2>'+o.n+'</h2><p>'+o.desc+'</p><div class="footer-row">'+
      (o.model?'<a href="/viewer3d.html?personagem='+o.model+'">Testar animações 3D →</a>':'<a href="/caso017.html">Conhecer o caso →</a>')+
      '<span>'+(o.model?'Modelo animado disponível':'Modelo 3D em preparação')+'</span></div></div></article>'
    ).join('')+'</div>'+
    '<div class="v10-team-follow"><article><h3>Elenco em expansão</h3><p>Nas próximas etapas incorporaremos outras perspectivas ao ambiente simulado: supervisão da operação, RH, SST, gestores e facilitadores de escuta. Os papéis serão desenvolvidos conforme os casos e as mecânicas do jogo.</p></article>'+
    '<article><h3>Direção de arte</h3><p>Modelagem estilizada, proporções compactas, uniforme ou traje reconhecível e leitura clara em câmera isométrica.</p><ul><li>Retratos aprovados para a interface</li><li>Três modelos animados no laboratório</li><li>Personagens e narrativas fictícios</li></ul></article></div>'+
    '<div class="notice">Os retratos são artes conceituais derivadas de referências do projeto. Os modelos GLB permanecem armazenados separadamente e não são enviados automaticamente ao navegador. O jogo não expõe informações clínicas individuais a gestores.</div>'+
  '</div>';
}
function library(){
return '<div class="page"><section class="page-panel">'+intro('APRENDIZAGEM E CONTEXTO','Biblioteca de conhecimento','Conteúdos breves para apoiar as escolhas do jogador. A biblioteca é educativa e não substitui orientação técnica, profissional ou clínica.')+
'<div class="knowledge-grid">'+
'<details><summary>Riscos psicossociais relacionados ao trabalho</summary><p>Fatores ligados à organização, às condições e às relações de trabalho podem contribuir para exposições prejudiciais. É importante analisar o contexto de trabalho e envolver as pessoas afetadas.</p></details>'+
'<details><summary>Trabalho prescrito e trabalho real</summary><p>Metas, procedimentos e escalas descrevem o trabalho previsto. A execução cotidiana pode envolver interrupções, imprevistos e adaptações que precisam ser compreendidos nas medidas preventivas.</p></details>'+
'<details><summary>Prevenção e medidas organizacionais</summary><p>Revisar metas, jornada, distribuição de tarefas e recursos pode enfrentar fatores relacionados à organização do trabalho. Ações individuais de bem-estar, isoladamente, não substituem essas medidas.</p></details>'+
'<details><summary>Escuta e segurança psicológica</summary><p>Ambientes em que trabalhadores conseguem relatar dificuldades e contribuir para soluções oferecem melhores condições para identificar problemas. A escuta precisa se traduzir em decisões e acompanhamento.</p></details>'+
'<details><summary>Psicologia e psiquiatria</summary><p>As duas profissões são distintas e complementares, considerando dimensões biopsicossociais conforme suas competências. Avaliação e cuidados clínicos devem respeitar autonomia, confidencialidade e encaminhamentos adequados.</p></details>'+
'<details><summary>Monitoramento após a intervenção</summary><p>É útil acompanhar condições e processos de trabalho, participação e efetividade dos ajustes. O jogo não atribui indicadores de saúde mental individual a gestores nem calcula resultados clínicos.</p></details>'+
'</div><div class="divider"></div><div class="action-row"><a class="btn btn-quiet" href="'+PATHS.github+'" target="_blank" rel="noopener noreferrer">'+icon('folder')+' Documentação técnica</a><a class="btn" href="'+PATHS.drive+'" target="_blank" rel="noopener noreferrer">'+icon('folder')+' Biblioteca no Drive</a></div></section></div>';
}
function toggle(k,label,desc){
return '<div class="setting-row"><div><div class="setting-label">'+label+'</div><div class="setting-note">'+desc+'</div></div><label class="switch"><input type="checkbox" data-setting="'+k+'"'+(prefs[k]?' checked':'')+' aria-label="'+label+'"></label></div>';
}
function settings(){
return '<div class="page"><section class="page-panel">'+intro('PREFERÊNCIAS LOCAIS','Configurações','Personalize a interface deste protótipo. As preferências são salvas somente no navegador atual.')+
'<div class="settings-grid"><section class="settings-card"><h2>Seu perfil</h2><p>Escolha como o painel inicial deve chamar o jogador.</p>'+
'<form id="nickname-form"><label class="setting-label" for="nickname">Nome no jogo</label><input id="nickname" class="text-field" maxlength="24" placeholder="Ex.: Explorador" autocomplete="nickname" value="'+escapeHtml(prefs.nickname)+'"><button class="btn btn-primary" type="submit">Salvar nome</button></form>'+
'<div class="divider"></div><h2>Progresso do Caso 017</h2><p>'+progressStats().found+' de 4 evidências registradas. Limpar o progresso reinicia a investigação e as decisões no Capítulo 01.</p><button class="btn" type="button" data-action="reset-progress"'+(progressStats().started?'':' disabled')+'>Reiniciar progresso</button></section>'+
'<section class="settings-card"><h2>Aparência e acessibilidade</h2><p>Configurações aplicadas neste menu. O capítulo jogável mantém sua interface própria.</p>'+
toggle('contrast','Contraste ampliado','Aumenta a distinção entre textos, fundos e bordas.')+
toggle('largeText','Texto maior','Amplia o tamanho-base de texto da interface.')+
toggle('reduceMotion','Reduzir animações','Remove transições decorativas deste painel.')+
toggle('effects','Sons de interface','Ativa um toque discreto ao navegar pelo menu.')+
'<div class="setting-row"><div><div class="setting-label">Idioma</div><div class="setting-note">Português (Brasil) — único idioma disponível nesta versão.</div></div><span class="status-label planned">PT-BR</span></div>'+
'<div class="notice">As preferências locais não são sincronizadas com outras pessoas ou dispositivos. Não há cadastro, login nem coleta de dados clínicos.</div></section></div></section></div>';
}
function about(){
return '<div class="page"><section class="page-panel">'+intro('PROJETO PILHA+','Sobre o jogo','Uma experiência experimental de gestão, simulação e psicoeducação sobre fatores de riscos psicossociais relacionados ao trabalho, inspirada em mecânicas de jogos de gestão e exploração de ambientes.')+
'<div class="settings-grid"><div class="settings-card"><h2>O que queremos desenvolver</h2><div class="about-list">'+
'<p><strong>Explorar:</strong> ambientes de trabalho isométricos, modulares e acessíveis pelo navegador e celular.</p>'+
'<p><strong>Investigar:</strong> evidências a partir de trabalhadores, lideranças, RH e SST.</p>'+
'<p><strong>Decidir:</strong> medidas preventivas cujos efeitos simulados produzem aprendizagem.</p>'+
'<p><strong>Evoluir:</strong> equipes, cenários, desafios e competências ao longo de capítulos.</p></div></div>'+
'<div class="settings-card"><h2>Estado atual</h2><div class="dev-stages"><div class="dev-item"><span>Protótipo da investigação</span><span>JOGÁVEL</span></div><div class="dev-item"><span>Visualizador de personagens 3D</span><span>DISPONÍVEL</span></div><div class="dev-item"><span>Personagens e ambientes finais</span><span class="pending">EM PRODUÇÃO</span></div><div class="dev-item"><span>Campanha e progressão</span><span class="pending">PLANEJAMENTO</span></div></div>'+
'<div class="divider"></div><div class="action-row"><a href="'+PATHS.github+'" target="_blank" rel="noopener noreferrer" class="btn small">'+icon('folder')+' GitHub</a><a href="'+PATHS.drive+'" target="_blank" rel="noopener noreferrer" class="btn small">'+icon('folder')+' Drive</a></div></div></div>'+
'<div class="notice">Este jogo é um protótipo educacional fictício. Não realiza diagnóstico psicológico ou psiquiátrico, não substitui gestão de riscos ocupacionais por profissionais qualificados nem comprova conformidade legal com a NR-1.</div></section></div>';
}
const VIEW_RENDER={inicio:home,casos:cases,equipe:team,biblioteca:library,configuracoes:settings,sobre:about};
function currentView(){const val=new URLSearchParams(location.search).get('view')||'inicio';return ALLOWED.includes(val)?val:'inicio'}
function render(){
  const v=currentView();
  main.innerHTML=VIEW_RENDER[v]();
  document.title=(v==='inicio'?'PilhA+ Game — Menu principal':NAV_LABELS[v]+' | PilhA+ Game');
  for(const a of document.querySelectorAll('.primary-nav [data-view],.bottom-nav [data-view]')){
    if(a.dataset.view===v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  }
  const active=document.getElementById('notification');if(active)active.textContent='';
}
function navigate(v,push=true){
 if(!ALLOWED.includes(v))v='inicio';
 if(push)history.pushState({view:v},'',v==='inicio'?'/':'/?view='+encodeURIComponent(v));
 sound();render();window.scrollTo({top:0,behavior:'auto'});
 main.focus({preventScroll:true});
}
function message(s){
 const node=document.getElementById('notification');if(node)node.textContent=s;
}
function startNew(){
 if((getProgress()||getStore('pilha-case017-v1'))&&!window.confirm('Iniciar um novo jogo? O progresso atual do Caso 017 será substituído.'))return;
 removeStore(STORAGE_PROGRESS);removeStore('pilha-case017-v1');window.location.assign(PATHS.play);
}
document.addEventListener('click',event=>{
 const link=event.target.closest('a[data-view]');
 if(link&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&event.button===0){
   event.preventDefault();navigate(link.dataset.view);return;
 }
 const action=event.target.closest('[data-action]');
 if(!action)return;
 if(action.dataset.action==='new-game'){event.preventDefault();startNew();}
 if(action.dataset.action==='reset-progress'){
   event.preventDefault();if(!getStore('pilha-case017-v1')&&!getProgress())return;
   if(!window.confirm('Apagar as evidências e decisões do Caso 017 neste navegador?'))return;
   removeStore(STORAGE_PROGRESS);removeStore('pilha-case017-v1');sound();render();message('Progresso do Caso 017 reiniciado.');
 }
});
document.addEventListener('change',event=>{
 const input=event.target.closest('[data-setting]');if(!input)return;
 const k=input.dataset.setting;if(!(k in prefsDefault)||k==='nickname')return;
 prefs[k]=!!input.checked;putStore(STORAGE_PREFS,JSON.stringify(prefs));applyPrefs();sound();message('Preferência salva.');
});
document.addEventListener('submit',event=>{
 if(event.target.id!=='nickname-form')return;
 event.preventDefault();const form=event.target;const input=form.querySelector('#nickname');
 prefs.nickname=String(input.value||'').trim().slice(0,24);
 putStore(STORAGE_PREFS,JSON.stringify(prefs));sound();message('Nome do jogador salvo.');
});
window.addEventListener('popstate',render);
window.addEventListener('storage',event=>{
 if([STORAGE_PREFS,STORAGE_PROGRESS].includes(event.key)){prefs=getPrefs();applyPrefs();render();}
});
render();
})();
