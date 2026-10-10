"""Run against localhost:3000 with Playwright installed. Never contacts WhatsApp."""
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright


with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, full in [(1440, True), (390, False), (320, False)]:
        page = browser.new_page(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
        outbound, writes, errors = [], [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('request', lambda request: writes.append(request.url)
                if request.method == 'POST' and '/api/appointments' in request.url else None)

        def intercept(route):
            outbound.append(route.request.url)
            route.fulfill(status=200, content_type='text/html',
                          body='<p>WhatsApp handoff intercepted. No message sent.</p>')

        page.route('https://wa.me/**', intercept)
        page.goto('http://127.0.0.1:3000/book', wait_until='networkidle')
        page.get_by_role('button', name='Continue', exact=True).click()
        assert page.locator('#booking-name').evaluate('(input) => !input.validity.valid')
        page.get_by_label('Full Name').fill('Test & Visitor')
        if full:
            page.get_by_label('Email Address').fill('test+booking@example.com')
            page.get_by_label('Phone Number').fill('+91 90000 00000')
            page.get_by_label('Consultation / Service').select_option(label='Homeopathic Consultation & Medicines')
            page.get_by_label('Consultation Type').select_option('Online')
            page.get_by_label('Consultation Message').fill('A question & follow-up? #1 + details\nSecond line')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.get_by_role('button', name='Continue', exact=True).click()
        page.get_by_label('Preferred Date').fill('2000-01-01')
        page.get_by_role('button', name='Continue', exact=True).click()
        assert page.get_by_label('Preferred Date').evaluate('(input) => input.validity.rangeUnderflow')
        # Use the form's clinic-time minimum, not the test runner's time zone.
        date = page.get_by_label('Preferred Date').get_attribute('min')
        page.get_by_label('Preferred Date').fill(date)
        page.get_by_role('button', name='Continue', exact=True).click()
        assert page.locator('form [role="alert"]').inner_text() == 'Please choose a preferred time.'
        page.get_by_role('button', name='10:00 AM', exact=True).click()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.get_by_role('button', name='Continue', exact=True).click()
        preview = page.get_by_label('WhatsApp message preview').inner_text()
        assert 'Preferred date:' in preview and '10:00 AM IST' in preview
        page.get_by_role('button', name='Back', exact=True).click()
        page.get_by_role('button', name='11:00 AM', exact=True).click()
        page.get_by_role('button', name='Continue', exact=True).click()
        preview = page.get_by_label('WhatsApp message preview').inner_text()
        assert '11:00 AM IST' in preview and '10:00 AM IST' not in preview
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert not outbound and not writes
        page.get_by_role('button', name='Continue to WhatsApp', exact=True).click()
        page.wait_for_url('https://wa.me/**')
        assert len(outbound) == 1
        parsed = urlparse(outbound[0])
        assert parsed.path == '/919011932151'
        message = parse_qs(parsed.query)['text'][0]
        assert message == preview
        assert ('Consultation type: Online' if full else 'Consultation type: In-clinic') in message
        assert not writes and not errors, (writes, errors)
        print(f'PASS {width}px: validation, review, edit and WhatsApp handoff; no API writes or real message sent', flush=True)
        page.close()
    browser.close()
