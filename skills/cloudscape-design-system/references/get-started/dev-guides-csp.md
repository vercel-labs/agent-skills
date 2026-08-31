---
scraped_at: '2026-04-20T08:50:53+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/dev-guides/csp/index.html.md
title: Content security policy (CSP)
---

# Content security policy (CSP)

Learn how to configure the CSP of your page with Cloudscape.

## What is CSP?

Content-Security-Policy (CSP) is a security mechanism that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. With CSP, you're able to declare which sources of content your web app trusts.

We recommend you enable CSP in your application.

## CSP configuration

Our components can be run with the following CSP configuration:

`Content-Security-Policy: default-src 'self'; style-src 'self'; font-src data:;` `img-src blob:;`

Where `self` refers to the location where the assets are loaded from. Replace `self` with your CDN URL when you serve assets from a different domain than your website content.

Note that the [code editor component](/components/code-editor/index.html.md) requires a special CSP configuration. See our [code editor development guidelines](/components/code-editor/index.html.md) for more details.

## Why is the font-src needed?

 [The global styles package](https://www.npmjs.com/package/@cloudscape-design/global-styles) includes the Open Sans font in your application. The font-src is needed to ensure that fonts are loaded along with the rest of the CSS files, to avoid [font display issues](https://css-tricks.com/font-display-masses/) . Note that Open Sans font files are available in our [global styles](/get-started/for-developers/global-styles/index.html.md).

Including `font-src data:;` does not harm security. Custom fonts can only be declared in CSS, which is already covered by the more strict `style-src 'self';` directive.
