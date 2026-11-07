"""Synthetic isolated robot smoke test; installed Chrome, no player data."""
import sys,json,threading,http.server,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/robot-qa';OUT.mkdir(parents=True,exist_ok=True)
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT/'dist'),**k)
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8774),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
report=[]
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for width,height in [(1366,768),(390,844)]:
   ctx=b.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto('http://127.0.0.1:8774/')
   page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.blueRobot=true;s.paused=false;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""")
   page.reload();page.locator('.pi-skip').wait_for(state='visible');page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
   for _ in range(3):page.locator('[data-guide="next"]').click()
   page.locator('[data-team-save]').click();page.locator('.pm-root').wait_for();page.wait_for_function('PilhaLiving.getRobot().actor?.loaded===true')
   page.locator('.pm-tab[data-i="1"]').click();page.wait_for_timeout(1500)
   first=page.evaluate('PilhaLiving.getRobot()');page.wait_for_timeout(500);second=page.evaluate('PilhaLiving.getRobot()');assert first['actor']['x']!=second['actor']['x'] or first['actor']['y']!=second['actor']['y']
   page.screenshot(path=str(OUT/(str(width)+'.png')))
   page.locator('.pm-tab[data-i="3"]').click();page.wait_for_timeout(400);page.screenshot(path=str(OUT/('patio-'+str(width)+'.png')))
   page.evaluate("async()=>{const M=await import('/simulation/company-continuous.js');const s=JSON.parse(localStorage.getItem(M.KEY));s.activeMs=120000/7*(1-1/96);s.paused=true;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();}")
   page.wait_for_function('PilhaLiving.getRobot().actor?.activity==="recharge"');paused=page.evaluate('PilhaLiving.getRobot()');page.wait_for_timeout(300);assert page.evaluate('PilhaLiving.getRobot()')==paused
   page.screenshot(path=str(OUT/('recharge-'+str(width)+'.png')));assert not errors,errors;assert page.evaluate('PilhaLiving.getEmployees().length')==16
   report.append({'width':width,'work':second,'recharge':paused,'errors':errors});ctx.close()
  b.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))
