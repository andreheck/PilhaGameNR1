"""Isolated desktop/tablet onboarding walkthrough; no real saves are used."""
import os,sys,json,http.server,threading,functools
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/first-objective';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8801),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--disable-gpu-shader-disk-cache','--disk-cache-size=1'])
  for width,height in [(1440,900),(1024,768)]:
   context=browser.new_context(viewport={'width':width,'height':height});page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   def snap(name):page.screenshot(path=str(OUT/(name+'-'+str(width)+'.png')))
   page.goto('http://127.0.0.1:8801/')
   page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');let s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.initialHiring={version:1,status:'pending'};s.paused=true;s.events.nextWeek=999;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""")
   page.reload();page.locator('.cinematic-resume').click();page.locator('.hiring-dialog[open]').wait_for()
   for i in range(3):page.locator('.hiring-sector').nth(i).locator('[data-hire-manager]').first.click()
   page.locator('[data-hiring-next]').click()
   for _ in range(3):page.locator('[data-hire-employee]:not([aria-pressed="true"])').first.click()
   page.locator('[data-hiring-next]').click();page.locator('.first-objective[open]').wait_for()
   assert 'Heróis são conselheiros' in page.locator('.first-objective').inner_text();snap('welcome')
   page.locator('[data-guide=next]').click();page.locator('h2#first-objective-title').wait_for();assert 'Comece pela Produção' in page.locator('.first-objective').inner_text()
   page.locator('[data-guide=next]').click();page.wait_for_timeout(250);assert 'Compare antes de investir' in page.locator('.first-objective').inner_text();snap('compare')
   page.locator('[data-guide=next]').click();page.wait_for_timeout(200);buy=page.locator('[data-act=buy]:not([disabled])').first;buy.wait_for();before=page.evaluate('PilhaLiving.getState().budget');buy.click();page.locator('.first-objective[open]').wait_for();assert 'Sua escolha ficou registrada' in page.locator('.first-objective').inner_text();assert page.evaluate('PilhaLiving.getState().budget')<before;snap('purchase')
   page.locator('[data-guide=next]').click();assert page.evaluate("JSON.parse(localStorage.getItem('pilha-first-objective-v1')).status")=='complete'
   page.locator('.living-more summary').click();page.locator('[data-company=guide]').click();assert 'Primeira decisão da empresa' in page.locator('.first-objective').inner_text();page.locator('[data-guide=skip]').click();assert page.evaluate("JSON.parse(localStorage.getItem('pilha-first-objective-v1')).status")=='skipped'
   page.locator('.living-more summary').click();page.locator('[data-company=guide]').click();assert 'Primeira decisão da empresa' in page.locator('.first-objective').inner_text();assert page.evaluate('PilhaLiving.getState().week')==1;assert not errors,errors
   report.append({'viewport':[width,height],'initialHiring':True,'optionalGuide':True,'productionSelection':True,'purchaseFlow':True,'completion':True,'skipAndResume':True,'errors':errors});context.close()
  browser.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
