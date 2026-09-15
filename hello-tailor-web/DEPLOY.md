# Deploying to Hostinger (hPanel subdomain)

## 1. Build

```bash
npm install
npm run build
```

Produces `dist/` — a fully static site (HTML/CSS/JS + `.htaccess`). This is everything that needs to go on the server; nothing else runs server-side.

The current web build includes the customer and tailor message experience: text and photo attachments, design approvals, revision requests, retry states, unread counts, and notification links. This is a frontend demo with in-memory data: messages, approvals, and login state reset on refresh. Real accounts, file storage, push delivery, and a backend are not connected.

If the subdomain serves from its own document root (the normal Hostinger setup — e.g. `app.yourdomain.com` → `public_html/app/`), the default build is correct as-is.

If you instead need the site reachable under a **sub-path** on an existing domain (e.g. `yourdomain.com/tailor/`), set the base path before building:

```bash
# Windows PowerShell
$env:VITE_BASE_PATH="/tailor/"; npm run build

# macOS/Linux
VITE_BASE_PATH="/tailor/" npm run build
```

This rewrites every asset reference and the router's base so deep links and refreshes resolve correctly under that sub-path.

## 2. Upload

In hPanel → **File Manager** (or via FTP/SFTP):

1. Navigate to the subdomain's document root (e.g. `public_html/` for the subdomain, or `public_html/app/` if hosted under the main domain's file tree).
2. Upload the **entire contents of `dist/`** (not the `dist` folder itself — its contents: `index.html`, `assets/`, `.htaccess`, etc.) directly into that document root.
3. Confirm `.htaccess` made it across — File Manager sometimes hides dotfiles; toggle "Show Hidden Files" if you don't see it.

## 3. Verify

- Visit the subdomain — should load the login screen.
- Log in (any 10-digit number, OTP `123456`), pick a role, click a few screens deep (e.g. a tailor profile, an admin detail page).
- **Refresh the browser on one of those deep routes.** This is the critical check: without `.htaccess`, Apache 404s on any route it doesn't have a matching file for, since this is a client-side-routed single-page app. With `.htaccess` in place, the rewrite rule falls back to `index.html` and React Router takes over correctly. If you see a Hostinger/Apache 404 here, `mod_rewrite` isn't enabled or `.htaccess` didn't upload — contact Hostinger support to confirm `mod_rewrite` is on (it is by default on hPanel shared hosting) and re-check the file made it to the document root.

## Notes

- Auth/session/booking data is all in-memory (zustand, no backend) — refreshing the page resets the demo session back to the login screen by design; this matches the prototype's original mock-data scope, not a bug.
- The `.htaccess` also sets long cache lifetimes on fingerprinted asset files (`assets/*.js`, `*.css`, images) — Vite content-hashes these filenames, so a new deploy's new files are always fetched fresh while old cached ones simply age out.
