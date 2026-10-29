"""CI-only one-screen hero selection and real programme purchases on fictional state."""
import functools,http.server,importlib.util,json,os,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('a11y',ROOT/'tools/qa-accessibility.py');audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
OUT=ROOT/'artifacts/hero-benefits';OUT.mkdir(parents=True,exist_ok=True);audit.OUT=OUT
report={'checks':[],'screens':[],'errors':[]};audit.REPORT=report
fixture=json.loads((ROOT/'tests/fixtures/fin-28c1de8-save.json').read_text(encoding='utf-8'))['state'];fixture['paused']=True;fixture['events']['current']=None;fixture['budget']=100000

def check(ok,label):
 if not ok:raise AssertionError(label)
 report['checks'].append(label)

def run(browser,w,h,port):
 tag=f'{w}x{h}';ctx=browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce',has_touch=w<900)
 ctx.add_init_script('if(!localStorage.getItem("pilha-company-continuous-v2"))localStorage.setItem("pilha-company-continuous-v2",JSON.stringify('+json.dumps(fixture)+'));')
 page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  page.goto(f'http://127.0.0.1:{port}/?hud=v2');page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
  for _ in range(3):page.locator('[data-guide=next]').click()
  page.locator('.continuous-gallery-dialog[open] .ph-d[data-neon-version]').wait_for(state='attached')
  page.wait_for_function('document.querySelectorAll(".ph-card img").length===6&&[...document.querySelectorAll(".ph-card img")].every(i=>i.complete&&i.naturalWidth)')
  before=page.evaluate('JSON.stringify(JSON.parse(localStorage.getItem("pilha-company-continuous-v2")))')
  bounds=page.locator('.continuous-gallery-dialog .ph-root').evaluate('(e)=>({h:e.clientHeight,sh:e.scrollHeight,w:e.clientWidth,sw:e.scrollWidth})')
  check(bounds['sh']<=bounds['h']+2 and bounds['sw']<=bounds['w']+2,tag+': selection has no page scrolling')
  for control in page.locator('.ph-card,.direct-pick button,[data-team-save],[data-hero-role]').all():
   box=control.bounding_box();check(box and box['y']>=-1 and box['y']+box['height']<=h+1 and box['x']>=-1 and box['x']+box['width']<=w+1,tag+': all six heroes and team controls fit viewport')
  check(page.locator('.direct-pick button').evaluate_all('(a)=>a.every(e=>e.getBoundingClientRect().height>=44)'),tag+': role controls remain touch-sized')
  if w>=900:
   for n in range(1,7):
    page.locator(f'.ph-card[data-id="PILHA-H0{n}"]').click();page.locator('.hero-full-button').wait_for()
    check(page.locator('.ph-detail').evaluate('(e)=>e.scrollHeight<=e.clientHeight+2'),tag+': profile overview fits '+str(n))
   page.locator('.hero-full-button').click();page.locator('.hero-full-details[open]').wait_for();check('Ficha consolidada' in page.locator('.hero-full-details').inner_text(),tag+': full canonical record remains accessible');page.locator('.hero-full-details header button').click()
  audit.scan(page,'galeria-'+tag,(w,h))
  check(page.evaluate('JSON.stringify(JSON.parse(localStorage.getItem("pilha-company-continuous-v2")))')==before,tag+': viewing profiles preserves save')
  page.locator('[data-direct-pick="PILHA-H01|principal"]').click();page.locator('[data-direct-pick="PILHA-H02|support"]').click();page.locator('[data-team-save]').click();page.locator('.pm-canvas').wait_for()
  if w==1366 and h==768:
   page.locator('.pm-tab[data-i="0"]').click();page.locator('.pm-root.has-panel').wait_for()
   page.locator('[data-c="Carreira"]').click();page.locator('[data-promotion-target]').select_option('NPC-02')
   cost=page.locator('[data-item=promocao] .pm-item__bottom b').inner_text();old=page.evaluate('PilhaLiving.getState().budget')
   page.locator('[data-id=promocao][data-act=buy]').click();page.wait_for_function('PilhaLiving.getState().receipts.some(r=>r.id==="promocao"&&r.targetId==="NPC-02")')
   check(page.evaluate('async()=>{const L=await import("/simulation/company-living.js");return L.staffView(PilhaLiving.getState()).find(p=>p.id==="NPC-02").organization.position;}')=='Especialista de setor',tag+': targeted promotion changes real NPC title')
   check(page.evaluate('PilhaLiving.getState().budget')<old,tag+': promotion spends only shared budget')
   page.locator('[data-c="Cuidado e benefícios"]').click();page.locator('[data-item=vale-alimentacao] [data-act=buy]').click();page.wait_for_function('PilhaLiving.getState().receipts.some(r=>r.id==="vale-alimentacao")')
   check(page.locator('.benefit-icon').evaluate_all('(a)=>a.every(i=>i.complete&&i.naturalWidth)'),tag+': new programme icons load')
   audit.scan(page,'beneficios-'+tag,(w,h))
   saved=page.evaluate('PilhaLiving.getState().receipts');page.reload();page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
   for _ in range(3):page.locator('[data-guide=next]').click()
   page.locator('.continuous-gallery-dialog[open] .ph-back').click();page.locator('.pm-canvas').wait_for()
   check(page.evaluate('PilhaLiving.getState().receipts')==saved,tag+': promotion and benefit survive reload')
 except Exception:
  page.screenshot(path=str(OUT/f'FAILED-{tag}.png'));raise
 finally:ctx.close()

if __name__=='__main__':
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   opts={'headless':True,'args':['--no-sandbox']}
   if os.environ.get('CHROMIUM_PATH'):opts['executable_path']=os.environ['CHROMIUM_PATH']
   browser=p.chromium.launch(**opts)
   try:
    for w,h in [(1366,768),(1440,900),(1920,1080),(320,640),(390,844)]:run(browser,w,h,server.server_port)
   finally:browser.close()
 except Exception as e:report['errors'].append(str(e))
 finally:server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
 if report['errors'] or len(report['screens'])!=6:raise SystemExit(1)
