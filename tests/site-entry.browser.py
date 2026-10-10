"""Validate both full-card links and the bundled Ayurvedic site on localhost."""
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ORIGIN = 'http://127.0.0.1:3000'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(reduced_motion='reduce')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    for width in [320, 390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 950})
        assert page.goto(ORIGIN, wait_until='networkidle').status == 200
        cards = page.locator('main a[aria-labelledby]')
        assert cards.count() == 2
        assert page.locator('main button').count() == 0
        assert 'Visit clinic website' not in page.locator('main').inner_text()
        assert 'link pending' not in page.locator('main').inner_text()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        first, second = cards.nth(0).bounding_box(), cards.nth(1).bounding_box()
        if width >= 760:
            assert abs(first['y'] - second['y']) < 1
            assert abs(first['height'] - second['height']) < 1
        else:
            assert first['y'] + first['height'] < second['y']
        cards.nth(0).focus()
        page.keyboard.press('Enter')
        page.wait_for_url(ORIGIN + '/clinic')
        assert page.locator('.clinic-hero').is_visible()
        page.goto(ORIGIN, wait_until='networkidle')
        page.locator('a[aria-labelledby="ayu-choice-title"] img').click()
        page.wait_for_url(ORIGIN + '/ayurveda')
        page.wait_for_load_state('networkidle')
        assert page.title().startswith('Yashraj Ayu')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        if width == 390:
            page.get_by_role('button', name='Open menu', exact=True).click()
            assert page.locator('#burger').get_attribute('aria-expanded') == 'true'
            page.keyboard.press('Escape')
            assert page.locator('#burger').get_attribute('aria-expanded') == 'false'
        page.get_by_role('link', name='Choose a website').click()
        page.wait_for_url(ORIGIN + '/')
        print(f'PASS {width}px: full-card mouse/keyboard navigation, same domain, return link, no overflow', flush=True)

    resources = set()
    for file in ['index', 'therapies', 'panchakarma', 'gallery', 'testimonials', 'visit', 'doctors']:
        assert page.goto(f'{ORIGIN}/ayurveda/{file}.html', wait_until='networkidle').status == 200
        assert page.locator('h1').count() == 1
        for resource in page.evaluate('''() => Array.from(document.querySelectorAll('img,script[src],link[rel="stylesheet"],video,source')).flatMap(el => [el.src, el.href, el.poster].filter(Boolean))'''):
            if resource.startswith(ORIGIN):
                resources.add(resource)
                assert urlparse(resource).path.startswith('/ayurveda/'), resource
        print(f'PASS Ayurvedic page: {file}', flush=True)
    for resource in resources:
        assert page.request.head(resource).status == 200, resource
    assert not errors, errors
    page.goto(ORIGIN + '/ayurveda#therapies', wait_until='networkidle')
    page.wait_for_url(ORIGIN + '/ayurveda/therapies.html')
    print(f'PASS {len(resources)} local resources, legacy links; no JavaScript errors', flush=True)
    browser.close()
