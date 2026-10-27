"""One-world geometry, camera, gestures, textual alternative and save regression."""
import functools,http.server,importlib.util,json,os,threading,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('world_a11y',ROOT/'tools/qa-accessibility.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
OUT=ROOT/'artifacts/world';OUT.mkdir(exist_ok=True,parents=True);audit.OUT=OUT
report={'screens':[],'checks':[],'errors':[]};audit.REPORT=report
fixture=json.loads((ROOT/'tests/fixtures/fin-28c1de8-save.json').read_text(encoding='utf-8'))['state']
fixture['events']['current']=None;fixture['paused']=True
def check(ok,text):
    if not ok:raise AssertionError(text)
    report['checks'].append(text)
def run(browser,width,height,port):
    tag=f'{width}x{height}';context=browser.new_context(viewport={'width':width,'height':height},has_touch=width<900,reduced_motion='reduce')
    context.add_init_script('if(!localStorage.getItem("pilha-company-continuous-v2"))localStorage.setItem("pilha-company-continuous-v2",JSON.stringify('+json.dumps(fixture)+'));')
    page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
    page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
    state=lambda:page.evaluate('PilhaLiving.getState()')
    world=lambda:page.evaluate('PilhaLiving.getWorld()')
    def menu():
        if page.locator('.hud-v2-menu-button').count():page.locator('.hud-v2-menu-button').click()
        elif not page.locator('.living-more').evaluate('(e)=>e.open'):page.locator('.living-more summary').click()
    try:
        page.goto(f'http://127.0.0.1:{port}/'+('?hud=v2' if width==320 else ''))
        page.locator('.pi-skip').wait_for();page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
        for _ in range(3):page.locator('[data-guide=next]').click()
        page.locator('.continuous-gallery-dialog[open] .ph-back').click()
        page.wait_for_function('PilhaLiving.getEmployees().length===16&&PilhaLiving.getFurniture()?.loaded===25&&PilhaLiving.getRiggedNPCs()?.loaded===5')
        for b in page.locator('.pm-toast__x').all():
            if b.is_visible():b.click()
        initial=world();before=state()
        check([(z['id'],z['x'],z['y']) for z in initial['zones']]==[('escritorio',0,0),('producao',14,0),('atendimento',0,10),('restauracao',14,10)],tag+': four fixed zones')
        check(len(initial['connections'])==4 and len(initial['portals'])==8,tag+': continuous corridors and eight open portals')
        check(before['budget']==fixture['budget'] and before['receipts']==fixture['receipts'],tag+': old budget and levels preserved')
        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),tag+': no horizontal page overflow')
        audit.scan(page,'planta',(width,height))
        page.locator('[data-z=in]').click();check(world()['zoom']>initial['zoom'],tag+': zoom button')
        page.locator('[data-z=home]').click()
        box=page.locator('.pm-canvas').bounding_box();cx=box['x']+box['width']/2;cy=box['y']+box['height']/2
        if width<900:
            client=context.new_cdp_session(page)
            def touches(delta):return [{'x':cx-delta,'y':cy,'id':1},{'x':cx+delta,'y':cy,'id':2}]
            client.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':touches(25)})
            client.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':touches(65)})
            client.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
            check(world()['zoom']>initial['zoom'],tag+': real two-finger pinch zoom')
            page.locator('[data-z=home]').click()
        frame=page.evaluate('PilhaLiving.getWorldFrame()')
        page.mouse.move(cx,cy);page.mouse.down();page.mouse.move(cx+38,cy+24,steps=6);page.mouse.up()
        check(page.evaluate('PilhaLiving.getWorldFrame()')!=frame,tag+': camera pans')
        check(world()['zones']==initial['zones'] and world()['connections']==initial['connections'],tag+': camera does not change geometry')
        page.locator('[data-z=home]').click()
        menu();page.locator('[data-company=zones]').click();page.locator('.world-access-dialog[open]').wait_for()
        check(page.locator('.world-access-zone').count()==4,tag+': four textual zones')
        check(page.locator('.world-access-dialog h2').evaluate('(e)=>document.activeElement===e'),tag+': dialog title receives focus')
        check(page.locator('[data-world-refresh]').bounding_box()['height']>=44,tag+': textual action has 44px target')
        page.keyboard.press('Escape');page.locator('.world-access-dialog').wait_for(state='detached')
        check(page.evaluate("document.activeElement.matches('.hud-v2-menu-button,.living-more summary')"),tag+': Escape restores focus to menu')
        menu();page.locator('[data-company=zones]').click();page.locator('.world-access-dialog[open]').wait_for()
        page.locator('.world-access-zone details').first.locator('summary').click()
        check(page.locator('.world-access-zone table').first.locator('tbody tr').count()>0,tag+': levels and costs in a semantic table')
        audit.scan(page,'zonas-acessiveis',(width,height))
        page.locator('[data-world-zone="1"]').click();page.locator('.pm-root.has-panel').wait_for()
        check(world()['zones']==initial['zones'],tag+': selecting a sector focuses the same world')
        page.locator('[data-z=home]').click()
        other={'width':844,'height':390} if width<900 else {'width':390,'height':844}
        page.set_viewport_size(other);page.wait_for_timeout(300)
        check(world()['zones']==initial['zones'] and world()['connections']==initial['connections'],tag+': orientation preserves geometry')
        page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(250)
        check(state()['budget']==before['budget'] and state()['receipts']==before['receipts'],tag+': navigation is read-only')
        # Screen-time circulation follows existing routines; no new health/economic effects.
        page.locator('[data-company=pause]').click()
        page.wait_for_function('PilhaLiving.getState().paused===false')
        a=page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])');page.wait_for_timeout(700)
        b=page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])');check(a!=b,tag+': employees still move')
        page.locator('[data-company=pause]').click();page.wait_for_function('PilhaLiving.getState().paused===true')
        audit.scan(page,'circulacao',(width,height))
        saved=state();page.reload();page.locator('.pi-skip').wait_for();page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for()
        for _ in range(3):page.locator('[data-guide=next]').click()
        page.locator('.continuous-gallery-dialog[open] .ph-back').click();page.locator('.pm-canvas').wait_for()
        check(state()['budget']==saved['budget'] and state()['receipts']==saved['receipts'],tag+': save reload on the same floor')
    except Exception:
        page.screenshot(path=str(OUT/f'FAILED-{tag}.png'));raise
    finally:context.close()
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
