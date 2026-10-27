"""CI-only visual scale/appliance regression with isolated fictional saves."""
import functools,http.server,importlib.util,json,os,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('furniture_a11y',ROOT/'tools/qa-accessibility.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
OUT=ROOT/'artifacts/furniture';OUT.mkdir(parents=True,exist_ok=True);audit.OUT=OUT
report={'screens':[],'checks':[],'errors':[]};audit.REPORT=report
fixture=json.loads((ROOT/'tests/fixtures/fin-28c1de8-save.json').read_text(encoding='utf-8'))['state'];fixture['paused']=True;fixture['events']['current']=None
def check(ok,text):
    if not ok:raise AssertionError(text)
    report['checks'].append(text)
def run(browser,width,height,port):
    tag=f'{width}x{height}';ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
    ctx.add_init_script('if(!localStorage.getItem("pilha-company-continuous-v2"))localStorage.setItem("pilha-company-continuous-v2",JSON.stringify('+json.dumps(fixture)+'));')
    page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
    try:
        page.goto(f'http://127.0.0.1:{port}/?debug=scale');page.locator('.scale-grid article').last.wait_for()
        page.wait_for_function('Array.from(document.images).every(i=>i.complete)')
        check(page.locator('.scale-grid article').count()==28,tag+': 25 approved/generated sprites and three procedural amenities')
        check(page.evaluate('JSON.parse(localStorage.getItem("pilha-company-continuous-v2")).budget')==fixture['budget'],tag+': laboratory does not initialize or spend the save')
        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),tag+': scale grid fits screen')
        audit.scan(page,'regua',(width,height))
        page.goto(f'http://127.0.0.1:{port}/?hud=v2');page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
        for _ in range(3):page.locator('[data-guide=next]').click()
        page.locator('.continuous-gallery-dialog[open] .ph-back').click()
        page.wait_for_function('PilhaLiving.getFurniture()?.loaded===25&&PilhaLiving.getEmployees().length===16')
        layout=page.evaluate('PilhaLiving.getFurnitureLayout()')
        check(all(not z['unplaced'] for z in layout),tag+': all baseline furniture fitted')
        check(len([i for z in layout for i in z['items'] if i['id'] in ['geladeira','televisao','copa']])==3,tag+': amenities visible in restoration zone')
        before=page.evaluate('PilhaLiving.getState()');audit.scan(page,'empresa',(width,height))
        page.evaluate('''async()=>{const M=await import('/simulation/company-continuous.js'),C=await import('/data/continuous/catalog.js');let s=PilhaLiving.getState();s.budget=10000000;for(const z of C.SECTORS)for(const c of C.ITEMS.filter(i=>!!i.rest===!!z.rest))for(let n=0;n<3;n++){const q=M.quote(s,z.id,c.id);if(q.ok){const r=M.purchase(s,q);if(!r.ok)throw Error(r.error);s=r.state;}}localStorage.setItem(M.KEY,JSON.stringify(s));await PilhaLiving.syncClock();}''')
        check(all(not z['unplaced'] for z in page.evaluate('PilhaLiving.getFurnitureLayout()')),tag+': every maximum-level improvement fitted')
        page.locator('.pm-tab[data-i="3"]').click();page.locator('.pm-root.has-panel').wait_for();audit.scan(page,'copa',(width,height))
        page.locator('[data-z=home]').click();page.locator('[data-company=pause]').click();page.wait_for_function('!PilhaLiving.getState().paused')
        a=page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])');page.wait_for_timeout(500)
        check(a!=page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])'),tag+': furniture preserves NPC circulation')
        page.locator('[data-company=pause]').click();page.wait_for_function('PilhaLiving.getState().paused')
        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),tag+': game has no horizontal overflow')
    except Exception:
        page.screenshot(path=str(OUT/f'FAILED-{tag}.png'));raise
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
                for size in [(1440,900),(390,844),(320,640)]:run(browser,*size,server.server_port)
            finally:browser.close()
    except Exception as e:report['errors'].append(str(e))
    finally:
        server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
    if report['errors'] or len(report['screens'])!=9:raise SystemExit(1)
