"""Isolated desktop/mobile verification of actual supplied animations and visual guests."""
import sys,os,json,threading,functools,http.server
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/expanded-qa';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8792),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];failed=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
   page.goto('http://127.0.0.1:8792/');page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.events.nextWeek=999;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.reload();page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for();page.wait_for_function('PilhaLiving.getSupportingActors()?.drawn.length===2');before=page.evaluate('PilhaLiving.getState()');first=page.evaluate('PilhaLiving.getSupportingActors()');page.wait_for_timeout(400);assert page.evaluate('PilhaLiving.getSupportingActors()')==first
   page.screenshot(path=str(OUT/('world-'+str(width)+'.png')));page.locator('.living-more summary').click();page.locator('[data-company=cast]').click();page.locator('.expanded-cast[open]').wait_for();assert page.locator('[data-cast]').count()==10
   activities={}
   for key in ['mariana','yoga','advogado','gestora','logistica-2','heck','diretor','ensino','administrativo','garoto']:
    page.locator('[data-cast="'+key+'"]').click();page.wait_for_function('document.querySelector(".cast-detail canvas").dataset.frame>0');actions=page.locator('[data-cast-action] option').evaluate_all('(rows)=>rows.map(r=>r.value)');activities[key]=actions
    for action in (['breathe','floor-sit','floor-idle','rise'] if key=='yoga' else ['sit'] if key=='gestora' else ['talk'] if key=='mariana' else []):
     page.locator('[data-cast-action]').select_option(action);page.wait_for_function('(a)=>document.querySelector(".cast-detail canvas").dataset.action===a',arg=action);page.wait_for_timeout(250)
    if key in ['yoga','mariana','advogado']:page.screenshot(path=str(OUT/(key+'-'+str(width)+'.png')))
   page.locator('[data-cast="yoga"]').click();page.locator('[data-cast-world]').click();assert 'yoga' not in page.evaluate('PilhaLiving.getSupportingActors().visible');page.locator('[data-cast-world]').click();assert 'yoga' in page.evaluate('PilhaLiving.getSupportingActors().visible');page.locator('[data-cast-direction]').select_option('3');page.locator('[data-cast-play]').click();frame=page.locator('canvas[data-frame]').get_attribute('data-frame');page.wait_for_timeout(250);assert page.locator('canvas[data-frame]').get_attribute('data-frame')==frame
   assert page.evaluate('document.querySelector(".expanded-cast").scrollWidth<=document.querySelector(".expanded-cast").clientWidth+1');page.locator('[data-cast-close]').click();after=page.evaluate('PilhaLiving.getState()');assert all(after[k]==before[k] for k in ['budget','receipts','staff','week','activeMs','team']),[k for k in after if after[k]!=before.get(k)];assert len(page.evaluate('PilhaLiving.getEmployees()'))==16
   # The main world resumes, supporting cast advances, then manual pause freezes it.
   page.locator('[data-company=pause]').click();page.wait_for_function('PilhaLiving.getState().paused===false');page.wait_for_function('(old)=>JSON.stringify(PilhaLiving.getSupportingActors())!==old',arg=json.dumps(first,separators=(',',':')),timeout=8000);page.wait_for_timeout(600);moving=page.evaluate('PilhaLiving.getSupportingActors()');page.wait_for_timeout(600);assert page.evaluate('PilhaLiving.getSupportingActors()')!=moving;page.locator('[data-company=pause]').click();page.wait_for_function('PilhaLiving.getState().paused===true');frozen=page.evaluate('PilhaLiving.getSupportingActors()');page.wait_for_timeout(350);assert page.evaluate('PilhaLiving.getSupportingActors()')==frozen
   assert not errors,errors;assert not failed,failed;report.append(dict(viewport=[width,height],activities=activities,guests=first,saveUnchanged=True,pauseVerified=True,errors=errors));ctx.close()
  browser.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'viewports':len(report),'models':10,'saveUnchanged':True,'pauseVerified':True}))
