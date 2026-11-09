"""Real purchases, seat occupancy, map clicks and live influences with synthetic saves."""
import os,sys,json,threading,functools,http.server
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/individual-chairs/qa';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8782),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   try:
    page.goto('http://127.0.0.1:8782/');page.evaluate('''async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.lastWallMs=Date.now();s.events.nextWeek=999;s.eventEffects.push({sid:'escritorio',factor:'carga',delta:-6,at:1});localStorage.setItem(M.KEY,JSON.stringify(s));}''');page.reload();page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for();page.wait_for_function('PilhaLiving.getFurniture()?.loaded===38')
    original=page.evaluate('PilhaLiving.getState()');index=page.evaluate("async()=>{const M=await import('/simulation/company-continuous.js');return M.metrics(PilhaLiving.getState(),'escritorio').index;}")
    page.locator('.pm-tab[data-i="0"]').click();page.locator('.chair-shop').wait_for();assert page.locator('[data-chair-item]').count()==3
    for i,item in enumerate(['cadeira-producao','cadeira-pensamento','cadeira-descompressao']):
     page.locator('[data-chair-target="'+item+'"]').select_option('NPC-0'+str(i+1));page.locator('[data-chair-buy="'+item+'"]').click();page.wait_for_function('(id)=>PilhaLiving.getState().receipts.some(r=>r.id===id)',arg=item)
    purchased=page.evaluate('PilhaLiving.getState()');assert purchased['budget']==6800;assert original['staff']==purchased['staff'];assert page.evaluate("async()=>{const M=await import('/simulation/company-continuous.js');return M.metrics(PilhaLiving.getState(),'escritorio').index;}")==index
    page.screenshot(path=str(OUT/('shop-'+str(width)+'.png')));layout=page.evaluate('PilhaLiving.getFurnitureLayout().find(r=>r.id==="escritorio")');assert not layout['unplaced'];assert len([i for i in layout['items'] if (i.get('id') or '').startswith('cadeira-')])==3
    page.locator('.pm-x').click()
    found=page.evaluate('''async()=>{const M=await import('/simulation/company-continuous.js');for(let step=0;step<280;step++){const s=PilhaLiving.getState();s.activeMs=step*s.clockWeekMs/300;s.paused=true;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();const actor=PilhaLiving.getEmployees().find(p=>p.chairInUse==='cadeira-producao');if(actor)return {actor,time:s.activeMs};}throw Error('Assigned chair was never used');}''');assert found['actor']['id']=='NPC-01' and found['actor']['sitting']
    # Locate, then click the actual actor on the canvas to open this profile.
    page.locator('.living-more summary').click();page.locator('[data-company="employees"]').click();page.locator('[data-employee="NPC-01"]').click();page.locator('[data-employee-locate]').click();page.wait_for_timeout(400)
    for close in page.locator('.pm-toast__x').all():
     if close.is_visible():close.click()
    page.screenshot(path=str(OUT/('using-chair-'+str(width)+'.png')))
    actor=page.evaluate('PilhaLiving.getEmployees().find(p=>p.id==="NPC-01")');canvas=page.locator('.pm-canvas').bounding_box();page.mouse.click(canvas['x']+actor['screen']['x'],canvas['y']+actor['screen']['y']);page.locator('.employees-dialog[open]').wait_for()
    assert 'João' in page.locator('.employee-profile-head').inner_text();assert page.locator('.employee-influences').count()==1;assert page.locator('.influence-health.is-positive').count()>0;assert page.locator('.influence-chip.is-negative').count()>0
    assert 'Cadeira da Produção' in page.locator('.employee-influences').inner_text();assert page.locator('.influence-conditions>div').count()==6;assert page.locator('.employee-influences').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1')
    live=page.evaluate('''async()=>{const L=await import('/simulation/company-living.js');return L.staffView(PilhaLiving.getState(),PilhaLiving.getEmployees()).find(p=>p.id==='NPC-01');}''');assert live['chairBonus']['healthBonus']==2
    page.locator('.employee-influences').scroll_into_view_if_needed();page.screenshot(path=str(OUT/('influences-'+str(width)+'.png')))
    # A later real agenda position removes only the temporary seat benefit.
    page.evaluate('''async()=>{const M=await import('/simulation/company-continuous.js');const s=PilhaLiving.getState();s.activeMs+=60000;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();}''');page.wait_for_function('!PilhaLiving.getEmployees().find(p=>p.id==="NPC-01").chairInUse')
    assert not page.locator('.influence-card b').filter(has_text='Cadeira da Produção').count();assert page.evaluate('PilhaLiving.getState().staff')==original['staff'];page.locator('[data-employee-close]').click()
    page.locator('.pm-tab[data-i="0"]').click();page.locator('[data-chair-target="cadeira-producao"]').select_option('NPC-04');page.locator('[data-chair-assign="cadeira-producao"]').click();page.wait_for_function('PilhaLiving.getState().receipts.find(r=>r.id==="cadeira-producao").targetId==="NPC-04"');assert page.evaluate('PilhaLiving.getState().budget')==6800
    assert not errors,errors;report.append({'viewport':[width,height],'purchaseBalance':6800,'seatUser':found['actor'],'healthBonus':2,'negativeInfluences':True,'reassignmentFree':True,'errors':errors});ctx.close()
   except Exception:
    page.screenshot(path=str(OUT/('FAILED-'+str(width)+'.png')));raise
  browser.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'viewports':len(report),'chairs':3,'individualUseAndInfluences':True}))
