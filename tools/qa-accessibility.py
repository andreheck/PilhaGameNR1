"""CI-only browser gate. Isolated fictional saves; no access to player data.

axe findings are not evidence of a manual screen-reader audit. Missing pages
are explicitly recorded, never silently counted as accessible screens.
"""
import functools
import http.server
import json
import os
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts' / 'accessibility'
AXE = ROOT / 'artifacts' / 'a11y-deps' / 'node_modules' / 'axe-core' / 'axe.min.js'
OUT.mkdir(parents=True, exist_ok=True)
REPORT = {'engine': 'axe-core 4.10.3', 'screens': [], 'errors': [],
          'notImplemented': ['retrospectiva de ciclo: tela ainda não implementada'],
          'manualPending': ['NVDA + Firefox', 'VoiceOver iOS', 'TalkBack',
                            'equivalência textual do canvas e alto contraste']}


def scan(page, name, viewport):
    page.add_script_tag(path=str(AXE))
    result = page.evaluate("""async () => {
      const r = await axe.run(document, {
        runOnly: {type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}
      });
      return {violations:r.violations, incomplete:r.incomplete,
              passes:r.passes.map(p=>p.id), version:r.testEngine.version};
    }""")
    stem = f'{name}-{viewport[0]}x{viewport[1]}'
    (OUT / f'{stem}.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    page.screenshot(path=str(OUT / f'{stem}.png'), full_page=True)
    serious = [v for v in result['violations'] if v['impact'] in ('serious', 'critical')]
    REPORT['screens'].append({'name': name, 'viewport': viewport,
                              'seriousCritical': len(serious),
                              'violations': [v['id'] for v in result['violations']],
                              'incomplete': [v['id'] for v in result['incomplete']]})
    # Scan every screen before failing the gate, so one failure cannot hide others.
    for violation in serious:
        REPORT['errors'].append(f'{stem}: {violation["id"]}: ' +
                                '; '.join(n['target'][0] for n in violation['nodes']))


def run(browser, viewport, port):
    context = browser.new_context(viewport={'width': viewport[0], 'height': viewport[1]},
                                  reduced_motion='reduce', has_touch=viewport[0] < 900)
    page = context.new_page()
    page.on('pageerror', lambda error: REPORT['errors'].append(str(error)))
    page.on('console', lambda message: REPORT['errors'].append(message.text)
            if message.type == 'error' else None)
    try:
        page.goto(f'http://127.0.0.1:{port}/', wait_until='domcontentloaded')
        page.locator('.pi-skip').wait_for(state='visible')
        scan(page, 'inicio', viewport)
        page.locator('.pi-skip').click()
        page.locator('.living-guide[open]').wait_for()
        scan(page, 'apresentacao', viewport)
        for _ in range(3):
            page.locator('[data-guide="next"]').click()
        page.locator('.continuous-gallery-dialog[open]').wait_for()
        scan(page, 'herois', viewport)
        page.locator('[data-direct-pick="PILHA-H01|principal"]').click()
        page.locator('[data-direct-pick="PILHA-H02|support"]').click()
        page.locator('[data-team-save]').click()
        page.locator('.hiring-dialog[open]').wait_for()
        scan(page, 'contratacao-gerentes', viewport)
        for person in ['NPC-02', 'NPC-09', 'NPC-05']:
            page.locator(f'[data-hire-manager="{person}"]').click()
        page.locator('[data-hiring-next]').click()
        for person in ['NPC-04', 'NPC-14', 'NPC-06']:
            page.locator(f'[data-hire-employee="{person}"]').click()
        scan(page, 'contratacao-equipe', viewport)
        page.locator('[data-hiring-next]').click()
        page.locator('.pm-canvas').wait_for()
        page.locator('[data-company="pause"]').click()
        page.wait_for_function('PilhaLiving.getState().paused === true')
        scan(page, 'mapa', viewport)
        if page.evaluate('document.documentElement.scrollWidth > innerWidth + 1'):
            REPORT['errors'].append(f'{viewport}: horizontal page overflow')

        def menu():
            if not page.locator('.living-more').evaluate('(e)=>e.open'):
                page.locator('.living-more summary').click()

        menu()
        page.locator('[data-company="staffing"]').click()
        scan(page, 'gestao-pessoal', viewport)
        page.locator('.continuous-modal [data-close]').click()
        menu()
        page.locator('[data-company="finance"]').click()
        scan(page, 'resultados-financeiros', viewport)
        page.locator('.continuous-modal [data-close]').click()
        # Existing event mechanism on a paused synthetic save, not new rules.
        page.evaluate("""async () => {
          const M=await import('/simulation/company-continuous.js');
          const s=JSON.parse(localStorage.getItem(M.KEY));
          s.events.current=null;s.week=Math.max(3,s.week);
          const r=M.startEvent(s,'clima','escritorio',{preview:true});
          if(!r.ok) throw Error(r.error);
          localStorage.setItem(M.KEY,JSON.stringify(r.state));
          await PilhaLiving.syncClock();
        }""")
        menu()
        page.locator('[data-company="event"]').click()
        page.locator('.event-presentation[open]').wait_for()
        scan(page, 'evento', viewport)
        page.locator('[data-event-choice="2"]').click()
        page.locator('[data-event-finish]').wait_for()
        scan(page, 'consequencia', viewport)
    finally:
        context.close()


if __name__ == '__main__':
    if not AXE.is_file():
        raise SystemExit('Install pinned CI axe-core dependency before running this gate.')
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT / 'dist'))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as p:
            options = {'headless': True, 'args': ['--no-sandbox']}
            if os.environ.get('CHROMIUM_PATH'):
                options['executable_path'] = os.environ['CHROMIUM_PATH']
            browser = p.chromium.launch(**options)
            try:
                for viewport in [(390, 844), (1440, 900)]:
                    run(browser, viewport, server.server_port)
            finally:
                browser.close()
    except Exception as error:
        REPORT['errors'].append(str(error))
    finally:
        server.shutdown()
        (OUT / 'report.json').write_text(json.dumps(REPORT, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(REPORT, ensure_ascii=False), flush=True)
    if REPORT['errors'] or len(REPORT['screens']) != 20:
        raise SystemExit(1)
