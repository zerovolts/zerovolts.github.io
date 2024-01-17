Personal website hosted at [zerovolts.com](https://zerovolts.com). There are no
code dependencies other than Web Platform APIs.

Privacy-friendly website analytics hosted at
[zerovolts.goatcounter.com](https://zerovolts.goatcounter.com) (not public).

# Navigation

Overview of the directory structure.
- [`assets/`](assets) - Fonts and images.
- [`components/`](components) - Reusable web components.
- [`pages/`](pages) - Directories for every page/app (other than the homepage) on the website.
    - [`pages/gl-template/`](pages/gl-template) - Copy-paste to create a new WebGL app.
    - [`pages/html-template/`](pages/html-template/) - Copy-paste to create a new HTML app.
- [`shared/`](shared) - The core library powering most of the apps on the website.
- [`CNAME`](CNAME) - Necessary for custom domains on Github.
- [`global.css`](global.css) - Site-wide styles including common variables and utility classes.
- [`index.html`](index.html) - The entry point and homepage of the website.
- [`runtime.js`](runtime.js) - Automatically scales up pixel art to a specific pixel size.

# Development

Point any simple web server application at this directory.
```
npx http-server
```