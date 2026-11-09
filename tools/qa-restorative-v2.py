"""Check the expanded restorative floor and supplied assets with synthetic saves."""
import sys,os,json,functools,threading,http.server
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
EXPECTED_ASSETS=len(json.loads((ROOT/'data/continuous/furniture-visuals.json').read_text(encoding='utf-8'))['assets'])
OUT=ROOT/'artifacts/restorative-qa';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8779),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844)]:
   ctx=b.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:8779/');page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.reload();page.locator('.cinematic-start').click();page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
   for _ in range(3):page.locator('[data-guide="next"]').click()
   page.locator('[data-team-save]').click();page.locator('.pm-root').wait_for();page.wait_for_function('(n)=>PilhaLiving.getFurniture()?.loaded===n',arg=EXPECTED_ASSETS)
   before=page.evaluate('({budget:PilhaLiving.getState().budget,receipts:PilhaLiving.getState().receipts,week:PilhaLiving.getState().week})');world=page.evaluate('PilhaLiving.getWorldLayout()');assert next(c for c in world if c['key']=='restauracao')['depth']==18
   added=page.evaluate('PilhaLiving.getFurnitureLayout().find(c=>c.id==="restauracao").items.filter(i=>i.annex)');assert len(added)==6 and all(not a['hidden'] for a in added)
   page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=PilhaLiving.getState();let found;for(let t=0;t<120000;t+=100){s.activeMs=t;if(L.routines(s).some(r=>r.inRestArea&&r.space==='patio')){found=t;break;}}if(found===undefined)throw Error('No patio visit');s.activeMs=found;s.paused=true;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();}""")
   page.locator('.pm-tab[data-i="3"]').click();page.locator('[data-rest-annex]').click();page.wait_for_timeout(300);actors=page.evaluate('PilhaLiving.getEmployees().filter(p=>p.sector==="restauracao"&&p.y>=8)');assert actors and all(0<=a['x']<=12 and 8<=a['y']<=18 for a in actors)
   frame=page.evaluate('PilhaLiving.getWorldFrame()');assert all(0<=a['screen']['x']<=frame['width'] and 0<=a['screen']['y']<=frame['height'] for a in actors)
   page.screenshot(path=str(OUT/('annex-'+str(width)+'.png')));after=page.evaluate('({budget:PilhaLiving.getState().budget,receipts:PilhaLiving.getState().receipts,week:PilhaLiving.getState().week})');assert before==after;assert page.evaluate('PilhaLiving.getEmployees().length')==16;assert not errors,errors;report.append({'viewport':[width,height],'world':world,'items':added,'visitors':actors,'errors':errors});ctx.close()
  b.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'viewports':len(report),'addedSquareMeters':120,'placedAssemblies':6}))
