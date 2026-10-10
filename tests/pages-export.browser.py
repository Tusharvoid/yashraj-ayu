"""Exercise the public export on a plain HTTP server, without any Next backend."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ORIGIN = os.environ.get('SITE_TEST_ORIGIN', 'http://127.0.0.1:3001').rstrip('/')
ROOT = Path(__file__).resolve().parent.parent / 'dist'

for private in ['api', 'doctor', 'patient', 'room', 'sign-in', 'sign-up', 'src', '.env', 'package.json']:
    assert not (ROOT / private).exists(), private
assert (ROOT / '404.html').exists()

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(reduced_motion='reduce')
    errors, forbidden, failed = [], [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('request', lambda request: forbidden.append(request.url)
            if '/api/' in request.url or '/_next/image?' in request.url else None)
    page.on('response', lambda response: failed.append((response.status, response.url))
            if response.url.startswith(ORIGIN) and response.status >= 400 else None)
    routes = ['/', '/clinic/', '/about/', '/book/', '/contact/', '/doctors/',
              '/gallery/', '/services/', '/testimonials/', '/vision/']
    for width in [390, 1440]:
        page.set_viewport_size({'width': width, 'height': 1000})
        for route in routes:
            assert page.goto(ORIGIN + route, wait_until='networkidle').status == 200
            assert page.locator('h1').count() == 1, route
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, route)
            assert page.get_by_role('link', name='Staff portal').count() == 0
        page.goto(ORIGIN + '/gallery/', wait_until='networkidle')
        before = page.locator('main img').count()
        page.get_by_role('button', name='Load More Photos').click()
        assert page.locator('main img').count() > before
        assert page.get_by_role('button', name='Load More Photos').count() == 0
        print(f'PASS {width}px: all public routes, local gallery pagination, no overflow', flush=True)

    # Direct refreshes on every generated service detail must work as static HTML.
    services = sorted((ROOT / 'services').glob('*/index.html'))
    assert len(services) == 25
    for file in services:
        route = '/services/' + file.parent.name + '/'
        assert page.goto(ORIGIN + route, wait_until='networkidle').status == 200
        assert page.locator('h1').count() == 1
    for route in ['/doctor/', '/patient/', '/api/gallery', '/package.json']:
        assert page.request.get(ORIGIN + route).status == 404, route
    assert not errors, errors
    assert not forbidden, forbidden
    assert not failed, failed[:10]
    print(f'PASS {len(services)} service deep links; private routes unavailable; no backend/image API calls or JavaScript errors', flush=True)
    browser.close()
