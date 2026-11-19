"""Desktop smoke check for João's map rig and the two new plant sprites."""
import http.server,json,os,socket,subprocess,threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';errors=[];responses=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8796),lambda *args,**kwargs:Quiet(*args,directory=str(DIST),**kwargs));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  opts={'headless':True,'args':['--no-sandbox']}
  if os.environ.get('CHROMIUM_PATH'):opts['executable_path']=os.environ['CHROMIUM_PATH']
  browser=p.chromium.launch(**opts);page=browser.new_page(viewport={'width':1440,'height':900})
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:responses.append((r.status,r.url)) if any(x in r.url for x in ('monstera-interior-views','snake-plant-views','joao-walk.sprite')) else None)
  page.goto('http://127.0.0.1:8796/',wait_until='domcontentloaded');page.locator('.cinematic-start').click();page.locator('.pi-root').wait_for();page.locator('.pi-skip').wait_for(state='visible');page.locator('.pi-skip').click()
  page.locator('.living-guide[open]').wait_for()
  for _ in range(3):page.locator('[data-guide="next"]').click()
  page.locator('.player-character-dialog[open]').wait_for();page.locator('[data-player-hero="EXPLORER-ADVOGADO"]').click();page.locator('[data-player-confirm="EXPLORER-ADVOGADO"]').click()
  page.locator('.hiring-dialog[open]').wait_for()
  for pid in ['NPC-02','NPC-09','NPC-05']:page.locator(f'[data-hire-manager="{pid}"]').click()
  page.locator('[data-hiring-next]').click()
  for pid in ['NPC-01','NPC-14','NPC-06']:page.locator(f'[data-hire-employee="{pid}"]').click()
  page.locator('[data-hiring-next]').click();page.wait_for_timeout(1200)
  if page.locator('.hiring-dialog[open]').count():raise AssertionError('Hiring did not complete: '+page.locator('.hiring-dialog').inner_text()+' state='+json.dumps(page.evaluate('PilhaLiving.getState().initialHiring')))
  page.locator('.living-world-reveal [data-world-enter]').click();page.locator('.pm-canvas').wait_for();page.wait_for_timeout(2500)
  state=page.evaluate('''()=>({rigs:PilhaLiving.getRiggedNPCs(),furniture:PilhaLiving.getFurniture(),employees:PilhaLiving.getEmployees().map(p=>p.id)})''')
  assert 'NPC-01' in state['rigs']['bindings'],state['rigs']
  assert any(x['id']=='NPC-01' for x in state['rigs']['drawn']),state['rigs']['drawn']
  assert 'NPC-01' in state['employees'],state['employees']
  assert all(any(status==200 and name in url for status,url in responses) for name in ('monstera-interior-views','snake-plant-views','joao-walk.sprite')),responses
  assert not errors,errors
  print(json.dumps({'viewport':'1440x900','joaoAction':next(x['action'] for x in state['rigs']['drawn'] if x['id']=='NPC-01'),'riggedActors':state['rigs']['bindings'],'furniture':state['furniture'],'plantResponses':[x for x in responses if any(n in x[1] for n in ('monstera-interior-views','snake-plant-views'))],'errors':errors},ensure_ascii=False))
  browser.close()
finally:server.shutdown();server.server_close()
