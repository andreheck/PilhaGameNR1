"""Visual scale lab checks for the furniture catalog, isolated from player saves."""
import functools,http.server,json,os,threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'furniture';OUT.mkdir(parents=True,exist_ok=True)
report={'screens':[],'checks':[],'errors':[]}

def check(ok,label):
    if not ok:raise AssertionError(label)
    report['checks'].append(label)

def run(browser,width,height,port):
    tag=f'{width}x{height}';ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
    page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
    try:
        page.goto(f'http://127.0.0.1:{port}/?debug=scale',wait_until='domcontentloaded')
        page.locator('.scale-grid article').last.wait_for()
        page.wait_for_function('Array.from(document.images).every(i=>i.complete)')
        catalog=json.loads((ROOT/'data/continuous/furniture-visuals.json').read_text(encoding='utf-8'))
        expected=len(catalog['assets'])+len(catalog['amenities'])
        check(page.locator('.scale-grid article').count()==expected,tag+': all furniture assets and amenities appear')
        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),tag+': scale lab fits viewport width')
        check(page.locator('.at-start').is_hidden(),tag+': internal scale lab bypasses the player start screen')
        page.screenshot(path=str(OUT/f'scale-{tag}.png'),full_page=True)
        report['screens'].append(tag)
    except Exception:
        page.screenshot(path=str(OUT/f'FAILED-{tag}.png'),full_page=True);raise
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
        server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps(report,ensure_ascii=False))
    if report['errors'] or len(report['screens'])!=3:raise SystemExit(1)
