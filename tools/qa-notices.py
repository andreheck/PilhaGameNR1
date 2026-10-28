"""CI browser checks: compact notices preserve existing actions and fictional saves."""
import functools, http.server, importlib.util, json, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('a11y',ROOT/'tools/qa-accessibility.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
OUT=ROOT/'artifacts/notices';OUT.mkdir(parents=True,exist_ok=True);audit.OUT=OUT
report={'checks':[],'screens':[],'errors':[],'manualPending':['aparelhos físicos e leitores de tela']};audit.REPORT=report
fixture=json.loads((ROOT/'tests/fixtures/fin-28c1de8-save.json').read_text(encoding='utf-8'))['state']
fixture['events']['current']=None;fixture['paused']=True

def check(value,label):
 if not value:raise AssertionError(label)
 report['checks'].append(label)

def run(browser,width,height,hud,port):
 tag=f'{"hud" if hud else "classico"}-{width}x{height}'
 ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce',has_touch=width<900)
 ctx.add_init_script('if(!localStorage.getItem("pilha-company-continuous-v2")){localStorage.setItem("pilha-company-continuous-v2",JSON.stringify('+json.dumps(fixture)+'));}')
 page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  page.goto(f'http://127.0.0.1:{port}/'+('?hud=v2' if hud else ''))
  page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
  for _ in range(3):page.locator('[data-guide=next]').click()
  page.locator('.continuous-gallery-dialog[open] .ph-back').click()
  page.wait_for_function('document.querySelectorAll(".pm-toasts>.pm-toast").length>=2')
  before=page.evaluate('PilhaLiving.getState()')
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),tag+': no page overflow')
  if width<900:
   summary=page.locator('.notice-summary');summary.wait_for(state='visible')
   box=summary.bounding_box();view=page.locator('.pm-view').bounding_box()
   check(box['height']<=48 and box['height']>=44,tag+': notices use one compact touch target')
   check(box['y']>=view['y'] and box['y']+box['height']<=view['y']+view['height'],tag+': summary stays within map')
   check(page.locator('.pm-view>.pm-toasts').is_hidden(),tag+': full notices do not cover mobile map')
   check('de atenção' in summary.get_attribute('aria-label'),tag+': attention is named in summary')
   audit.scan(page,tag+'-compacto',(width,height))
   summary.click();page.locator('.notice-center[open]').wait_for()
   check(page.locator('.notice-center .pm-toast--alert').bounding_box()['y']<page.locator('.notice-center .pm-toast--success').bounding_box()['y'],tag+': alert displayed before information')
   for _ in range(12):page.keyboard.press('Tab')
   check(page.locator('.notice-center').evaluate('(e)=>e.contains(document.activeElement)'),tag+': native modal traps focus')
   page.keyboard.press('n')
   check(page.evaluate('PilhaLiving.getState().week')==before['week'],tag+': dialog does not advance week')
   # The current real game notice lasts ten seconds. Reading the modal must
   # suspend its automatic dismissal without suspending the game clock.
   page.wait_for_timeout(11000)
   check(page.locator('.notice-center .pm-toast:not(.is-out)').count()>=2,tag+': notices remain available while being read')
   audit.scan(page,tag+'-aberto',(width,height))
   page.evaluate('()=>{window.noticesClosed=false;document.querySelector(".notice-center").addEventListener("close",()=>window.noticesClosed=true,{once:true});}')
   page.keyboard.press('Escape');page.wait_for_function('window.noticesClosed')
   check(summary.evaluate('(e)=>e===document.activeElement'),tag+': Escape restores summary focus')
   summary.click();page.locator('.notice-center[open]').wait_for()
   page.locator('.notice-center .pm-toast--alert .pm-toast__act').click()
   page.locator('.pm-root.has-panel').wait_for()
   check(not page.locator('.notice-center').evaluate('(e)=>e.open'),tag+': notice action releases modal')
   check('Produção' in page.locator('.pm-ph').inner_text(),tag+': existing action opens production')
  else:
   check(page.locator('.notice-summary').is_hidden(),tag+': desktop retains full notices')
   check(page.locator('.pm-toast--alert').is_visible(),tag+': desktop attention remains visible')
   audit.scan(page,tag+'-desktop',(width,height))
  after=page.evaluate('PilhaLiving.getState()')
  check(all(after[k]==before[k] for k in ['budget','receipts','week','paused','team','staff']),tag+': actions preserve saved economy, staff and clock state')
 finally:ctx.close()

if __name__=='__main__':
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   options={'headless':True,'args':['--no-sandbox']}
   if os.environ.get('CHROMIUM_PATH'):options['executable_path']=os.environ['CHROMIUM_PATH']
   browser=p.chromium.launch(**options)
   try:
    for hud in [False,True]:
     for width,height in [(320,640),(390,844),(1440,900)]:run(browser,width,height,hud,server.server_port)
   finally:browser.close()
 except Exception as error:report['errors'].append(str(error))
 finally:
  server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
 if report['errors'] or len(report['screens'])!=10:raise SystemExit(1)
