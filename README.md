# ⛅ SkyCast — PWA Weather App

A beautiful, installable Progressive Web App for Android & iOS.

---

## 📁 File Structure

```
skycast-pwa/
├── index.html       ← Main app (HTML + CSS + JS)
├── manifest.json    ← PWA config (name, icons, theme)
├── sw.js            ← Service Worker (offline + caching)
├── icons/           ← App icons for all screen sizes
│   ├── icon-32.png  ← Favicon
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-120.png ← iOS
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png ← iOS iPad
│   ├── icon-180.png ← iOS iPhone
│   ├── icon-192.png ← Android
│   └── icon-512.png ← Android splash / Play Store
└── README.md        ← This file
```

---

## 🚀 Step 1 — Add Your API Key

Open `index.html` and find this line (~line 340):

```js
API_KEY: 'YOUR_API_KEY',
```

Replace with your free key from: https://openweathermap.org/api

---

## 🌐 Step 2 — Host the App (Required for PWA)

PWAs **must be served over HTTPS**. A simple local file won't work for installation.
Pick any free hosting option:

### Option A — Netlify (Easiest, Free)
1. Go to https://app.netlify.com/drop
2. Drag & drop the entire `skycast-pwa/` folder
3. Done! You get a live HTTPS URL instantly

### Option B — GitHub Pages (Free)
1. Create a GitHub account at https://github.com
2. Create a new repository (e.g. `skycast`)
3. Upload all files in this folder to the repo
4. Go to Settings → Pages → Source: main branch → Save
5. Your app is live at `https://yourusername.github.io/skycast`

### Option C — Vercel (Free)
1. Install: `npm i -g vercel`
2. Run: `vercel` inside the `skycast-pwa/` folder
3. Follow the prompts — live in 60 seconds

### Option D — Local HTTPS (for testing)
```bash
# Install serve
npm install -g serve

# Run with HTTPS (self-signed cert)
npx serve . --ssl-cert cert.pem --ssl-key key.pem
```

---

## 📱 Step 3 — Install on Your Phone

### Android (Chrome)
1. Open your hosted URL in Chrome
2. A banner appears: **"Add SkyCast to Home Screen"**
3. Tap **Install** → Done!
   - Or: tap the 3-dot menu (⋮) → "Add to Home screen"

### iPhone / iPad (Safari)
1. Open your hosted URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow ↑)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **Add** → Done!

> ⚠️ iOS requires Safari for PWA installation. Chrome on iOS won't show the option.

---

## ✨ PWA Features

| Feature | Status |
|---|---|
| Installable on Android | ✅ |
| Installable on iOS (Safari) | ✅ |
| Works offline (cached data) | ✅ |
| Offline toast notification | ✅ |
| Fullscreen / standalone mode | ✅ |
| iPhone notch safe area | ✅ |
| App icon (all sizes) | ✅ |
| Splash screen color | ✅ |
| Background sync | ✅ |
| Push notifications | ❌ (requires backend) |

---

## 🔧 Customization

| What | Where | How |
|---|---|---|
| Default city | `index.html` line ~340 | Change `DEFAULT_CITY: 'London'` |
| App name | `manifest.json` | Edit `"name"` and `"short_name"` |
| Theme color | `manifest.json` | Edit `"theme_color"` |
| Cache version | `sw.js` line ~20 | Increment `CACHE_NAME = 'skycast-v2'` when you update |
| Icons | `icons/` folder | Replace PNG files with your own (same filenames) |

---

## 🔄 Updating the App

When you change the code:
1. Increment the cache version in `sw.js`: `skycast-v1` → `skycast-v2`
2. Re-upload files to your host
3. Users get the update automatically on next visit

---

## 📞 Support

- OpenWeatherMap API docs: https://openweathermap.org/api
- PWA guide: https://web.dev/progressive-web-apps/
- Lighthouse PWA audit: Open DevTools → Lighthouse tab → Generate report
