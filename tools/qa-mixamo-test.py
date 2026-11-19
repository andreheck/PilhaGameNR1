"""Actual canvas overlay output and opt-in supplied animation, with isolated saves."""
import os,sys,json,threading,functools,http.server
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
OUT=ROOT/'artifacts/mixamo-test';OUT.mkdir(parents=True,exist_ok=True);report=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8786),functools.partial(Quiet,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None))
  for width,height in [(1366,768),(390,844)]:
   ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   try:
    page.goto('http://127.0.0.1:8786/');page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js'),L=await import('/simulation/company-living.js');const s=L.ensureLiving(M.fresh());s.team={principal:'PILHA-H01',support:'PILHA-H02'};s.paused=true;s.events.nextWeek=999;s.lastWallMs=Date.now();localStorage.setItem(M.KEY,JSON.stringify(s));}""");page.reload();page.locator('.cinematic-resume').click();page.locator('.pm-root').wait_for();before=page.evaluate('PilhaLiving.getState()');assert not page.evaluate('PilhaLiving.getAnimationTest().enabled')
    page.evaluate("""()=>{window.sceneTexts=[];const original=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(text,...args){if(this.canvas.classList.contains('pm-canvas'))sceneTexts.push(String(text));return original.call(this,text,...args);};}""");page.locator('.pm-tab[data-i="0"]').click();page.wait_for_timeout(500);assert page.locator('.pm-kpis').is_visible();assert not page.evaluate('sceneTexts.some(t=>/^(Escritório|Produção|Atendimento|Restauração)\\s+\\d+%$/.test(t))');page.locator('.pm-x').click();page.screenshot(path=str(OUT/('clean-map-'+str(width)+'.png')))
    def menu():page.locator('.living-more summary').click();page.locator('[data-company="mixamo"]').click()
    menu();assert 'não é um clipe de caminhada' in page.locator('dialog[open]').inner_text();page.locator('[data-mixamo-play]').click();page.wait_for_function('PilhaLiving.getAnimationTest().loaded');page.wait_for_function('PilhaLiving.getAnimationTest().frame>3');page.screenshot(path=str(OUT/('reaction-'+str(width)+'.png')));page.wait_for_function('!PilhaLiving.getAnimationTest().playing');assert page.evaluate('PilhaLiving.getAnimationTest().frame')==31
    after=page.evaluate('PilhaLiving.getState()');assert all(after[k]==before[k] for k in ['budget','staff','receipts','week','activeMs','team']);assert len(page.evaluate('PilhaLiving.getEmployees()'))==16
    menu();page.locator('[data-mixamo-direction]').select_option('2');page.locator('[data-mixamo-play]').click();assert page.evaluate('PilhaLiving.getAnimationTest().direction')==2;menu();page.locator('[data-mixamo-remove]').click();assert not page.evaluate('PilhaLiving.getAnimationTest().enabled');assert not errors,errors;report.append({'viewport':[width,height],'clipFrames':32,'staffUnchanged':True,'floatingSectorStats':False,'errors':errors});ctx.close()
   except Exception:
    page.screenshot(path=str(OUT/('FAILED-'+str(width)+'.png')));raise
  browser.close()
finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report))
