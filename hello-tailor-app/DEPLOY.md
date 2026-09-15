# Web distribution

This is the web export of the combined Expo application. It includes the latest
customer/tailor chat, photo attachments, design approvals, retry/typing states,
and simulated notification navigation.

From `hello-tailor-app`, run:

```bash
npm ci
npm run build:web
```

The build type-checks the app and writes the current frontend to `dist/`.
Expo also copies `public/.htaccess` into the export. See the
[Expo static export documentation](https://docs.expo.dev/router/web/static-rendering/).

Upload the contents of `dist/` (including `.htaccess`, `_expo/`, assets, and all
route files) to a domain or subdomain document root. The Apache rules serve
exported HTML routes and fall back to the client router for dynamic IDs. Other
hosts need equivalent routing rules. This build uses root-relative asset URLs.

Check login using any 10-digit number and OTP `123456`, then select a role.
Check Messages on both the customer and tailor sides. Also reload a chat URL
to check the host's routing. Sessions and demo data reset on a full page reload.

The root-level `hello-tailor-app-dist.zip` contains this distribution with
`index.html` at the archive root. It is a browser build, not an Android APK.

`hello-tailor-web/dist/` and `hello-tailor-web-dist.zip` are built from the
separate Vite website. That codebase does not yet contain the Expo chat module.
Use a separate document root for each distribution.

All data and authentication remain mocked. Notification navigation is a demo;
real push delivery and a backend are not connected.
