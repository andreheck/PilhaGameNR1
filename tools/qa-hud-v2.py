"""Opt-in HUD browser regression with the real fin save compatibility fixture."""
import functools
import http.server
import importlib.util
import json
import os
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('a11y',ROOT/'tools/qa-accessibility.py')
audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
OUT=ROOT/'artifacts/hud-v2';OUT.mkdir(parents=True,exist_ok=True);audit.OUT=OUT
report={'checks':[],'screens':[],'errors':[],'limitations':['Poderes individuais não executados neste modo: captura de recarga não aplicável.','Folha setorial em três estados será entregue separadamente.']}
audit.REPORT=report
fixture=json.loads((ROOT/'tests/fixtures/fin-28c1de8-save.json').read_text(encoding='utf-8'))['state']
fixture['events']['current']=None;fixture['paused']=True

def check(value,label):
    if not value:raise AssertionError(label)
    report['checks'].append(label)

def run(browser,width,height,port):
    tag=f'{width}x{height}';ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce',has_touch=width<900)
    ctx.add_init_script('if(!localStorage.getItem("pilha-company-continuous-v2")){localStorage.setItem("pilha-company-continuous-v2",JSON.stringify('+json.dumps(fixture)+'));}')
    page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
    page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
    def enter():
        page.locator('.pi-skip').wait_for();page.locator('.pi-skip').click()
        page.locator('.living-guide[open]').wait_for()
        for _ in range(3):page.locator('[data-guide=next]').click()
        page.locator('.continuous-gallery-dialog[open] .ph-back').click()
        page.locator('.hud-v2-hero').first.wait_for()
        page.wait_for_function('()=>[...document.styleSheets].some(s=>s.href?.endsWith("hud-v2.css"))')
    def state():return page.evaluate('PilhaLiving.getState()')
    try:
        page.goto(f'http://127.0.0.1:{port}/?hud=v2');enter()
        before=state();check(before['budget']==fixture['budget'] and before['receipts']==fixture['receipts'],tag+': fin save preserved')
        check(page.locator('.hud-v2-hero').count()==2,tag+': two canonical advisors')
        check(page.locator('.hud-v2-power').all_text_contents()==['○ Em breve','○ Em breve'],tag+': no fictitious ability state')
        top=page.locator('.living-topbar').bounding_box();limit=height*(.30 if width==320 else .25)
        check(top['y']+top['height']<=limit,tag+': expanded HUD within height budget '+str(top['height']))
        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),tag+': no horizontal page overflow')
        for control in page.locator('.hud-v2-bar>button,.hud-v2-bar .pm-balance').all():
            check(control.evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),tag+': toolbar content not clipped')
        for selector in ['.hud-v2-bar>button','.hud-v2-hero','.hud-v2-details','.hud-v2-navigation .pm-tab']:
            for box in page.locator(selector).all():
                r=box.bounding_box()
                check(r['height']>=44 and r['width']>=44,tag+': 44px target '+selector)
        check(page.locator('[data-hud-sector-state]').count()==4,tag+': sector names, shapes and textual states')
        audit.scan(page,'normal',(width,height))
        page.locator('.hud-v2-menu-button').click();page.locator('.hud-v2-menu[open]').wait_for()
        for _ in range(20):page.keyboard.press('Tab')
        check(page.locator('.hud-v2-menu').evaluate('(m)=>m.contains(document.activeElement)'),tag+': modal traps focus')
        audit.scan(page,'menu',(width,height))
        old_week=state()['week'];page.locator('[data-hud-shortcuts]').focus();page.keyboard.press('n')
        check(state()['week']==old_week,tag+': no shortcut in input/dialog')
        page.locator('[data-hud-shortcuts]').uncheck();page.keyboard.press('Escape')
        check(page.locator('.hud-v2-menu-button').evaluate('(e)=>e===document.activeElement'),tag+': Escape returns focus')
        page.keyboard.press('n');check(state()['week']==old_week,tag+': disabled single-key shortcuts')
        page.locator('.hud-v2-menu-button').click();page.locator('[data-hud-shortcuts]').check();page.keyboard.press('Escape')
        page.wait_for_function('document.activeElement===document.querySelector(".hud-v2-menu-button")')
        page.keyboard.press('Space');page.wait_for_function('PilhaLiving.getState().paused===false')
        page.keyboard.press('Space');page.wait_for_function('PilhaLiving.getState().paused===true')
        page.keyboard.press('n');page.wait_for_function(f'PilhaLiving.getState().week==={old_week+1}')
        check(state()['weeklyIncome']['total']==1000,tag+': shortcut advances existing weekly economy once')
        page.locator('[data-company=event]').wait_for(state='visible');audit.scan(page,'alerta',(width,height))
        page.locator('[data-company=event]').click();page.locator('.event-presentation[open]').wait_for()
        audit.scan(page,'evento',(width,height));page.locator('[data-event-dismiss]').click()
        page.keyboard.press('h');page.locator('.continuous-gallery-dialog[open]').wait_for();page.keyboard.press('Escape')
        page.locator('.hud-v2-details').click();check(page.locator('.hud-v2-details').get_attribute('aria-expanded')=='false',tag+': details preference')
        saved=state();page.reload();enter();check(page.locator('.hud-v2-details').get_attribute('aria-expanded')=='false',tag+': preference restored')
        check(state()['budget']==saved['budget'] and state()['receipts']==saved['receipts'],tag+': reload preserves progress')
        page.locator('.hud-v2-details').click()
        page.locator('.pm-tab[data-i="0"]').click();page.locator('.pm-root.has-panel').wait_for()
        audit.scan(page,'setor-critico',(width,height))
    except Exception:
        report['failureContext']=page.evaluate('({focus:document.activeElement?.outerHTML.slice(0,500),openDialogs:[...document.querySelectorAll("dialog[open]")].map(d=>d.className),preferences:localStorage.getItem("pilha-hud-preferences-v1"),paused:window.PilhaLiving?.getState().paused})')
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
                for width,height in [(320,640),(390,844),(1440,900)]:run(browser,width,height,server.server_port)
            finally:browser.close()
    except Exception as error:report['errors'].append(str(error))
    finally:
        server.shutdown();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
    if report['errors'] or len(report['screens'])!=15:raise SystemExit(1)
