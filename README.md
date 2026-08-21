# Hello Tailor

Premium tailoring marketplace — UI/UX implementation (mock data, no backend).

## Apps

| Folder | Stack | Run |
|---|---|---|
| `customer-app/` | Expo + React Native + TypeScript (expo-router) | `cd customer-app && npm install && npm run start` |
| `tailor-app/` | Expo + React Native + TypeScript (expo-router) | `cd tailor-app && npm install && npm run start` |
| `admin-panel/` | React + Vite + TypeScript | `cd admin-panel && npm install && npm run dev` |

Press `w` in the Expo CLI to preview mobile apps in a browser, or scan the QR with Expo Go on a phone.

All three share one design system (Deep Navy `#173B57`, Ocean Blue `#0C7EBC`, Tailor Gold `#D9A441`) and use only mock/in-memory data — no real backend, auth, or payment gateway is wired up.

## Pushing to GitHub

```
gh repo create sowndharya-3/hello-tailor --private --source=. --remote=origin
git push -u origin master
```

(or create the empty private repo on github.com first, then `git remote add origin <url>` and `git push -u origin master`)
