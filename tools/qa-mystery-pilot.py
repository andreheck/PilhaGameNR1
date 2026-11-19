"""Mystery entry, human reveal, collectible, history and isolated persistence."""
import sys, os, json, threading, http.server, functools
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/mystery-pilot';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8804),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start()
report=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1440,900),(1024,768)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto('http://127.0.0.1:8804/',wait_until='domcontentloaded')
   page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""")
   page.reload();page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for()
   page.locator('.living-phone-launcher').click();page.locator('[data-phone-command="mysteries"]').click()
   page.locator('.mystery-dialog[open]').wait_for();page.wait_for_function('document.querySelector(".mystery-cover img").naturalWidth>0')
   assert page.locator('.mystery-cover img').get_attribute('src').endswith('cover-v1.png')
   original=page.evaluate("JSON.parse(localStorage.getItem('pilha-company-continuous-v2'))")
   page.locator('[data-open-board]').click();assert page.locator('.mystery-specialist').count()==0
   for index,id in enumerate(['relatorio','foto','manutencao','turno']):
    page.locator('.mystery-clue[data-clue="'+id+'"]').click()
    if index==0:
     assert page.locator('.mystery-board.has-discovery').count()==1
     page.wait_for_function('document.querySelector(".mystery-specialist").naturalWidth>0')
     assert page.locator('.mystery-action-card').count()==0
   page.locator('.mystery-history summary').click()
   assert page.locator('.mystery-history a').count()==2
   assert '146' in page.locator('.mystery-history').inner_text()
   page.locator('[data-resolve]').click();page.wait_for_function('document.querySelector(".mystery-action-card img").naturalWidth>0')
   assert page.evaluate("JSON.parse(localStorage.getItem('pilha-mystery-pilot-v1')).resolved")
   current=page.evaluate("JSON.parse(localStorage.getItem('pilha-company-continuous-v2'))")
   assert all(current[k]==original[k] for k in ['budget','staff','receipts','week','activeMs'])
   page.screenshot(path=str(OUT/f'board-{width}.png'))
   page.locator('[data-back-gallery]').click();page.locator('[data-filter="done"]').click()
   assert page.locator('.is-collectible').count()==1
   page.wait_for_function('document.querySelector(".mystery-cover img").naturalWidth>0')
   assert page.locator('.mystery-cover img').get_attribute('src').endswith('action-v1.png')
   page.screenshot(path=str(OUT/f'collection-{width}.png'))
   page.locator('[data-mystery-close]').click()
   page.evaluate("async()=>{const m=await import('/ui/mystery-gallery.js');m.openMysteryGallery()}")
   assert page.locator('.is-collectible').count()==1
   page.locator('[data-mystery-close]').click()
   page.evaluate("async()=>{const m=await import('/ui/mystery-gallery.js');m.openMysteryGallery({storage:{getItem:()=>null,setItem:()=>{throw Error('blocked')}}})}")
   page.locator('[data-open-board]').click();page.locator('.mystery-clue').first.click()
   assert 'Não foi possível salvar' in page.locator('.mystery-dialog footer').inner_text()
   assert page.locator('.mystery-clue.is-read').count()==0
   assert not errors,errors
   report.append({'viewport':[width,height],'entry':True,'reveal':True,'collectible':True,'history':True,'persistence':True,'companySaveUnchanged':True,'blockedStorage':True,'errors':errors});ctx.close()
  browser.close()
finally:
 server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report))
