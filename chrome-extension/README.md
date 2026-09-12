# DocBridge — Chrome Extension

> **On-device photo & signature preparation for Indian government portals**

A lightweight Chrome extension that detects when you're on an Indian government portal with strict file upload rules, shows a helpful nudge, and processes your photos & signatures entirely in your browser — no uploads to any server.

## What it does

1. **Detects** — When you visit a known gov portal (Passport Seva, UPSC, Sarathi, etc.), DocBridge detects the upload requirements
2. **Nudges** — A small floating banner appears: "DocBridge can prepare this photo for Passport Seva"
3. **Processes** — Drop your photo → crop, compress, format to meet the portal's exact specs
4. **Downloads** — Download the optimized photo and upload it to the portal

## Supported Portals (17)

| Portal | Domain | Photo Requirements |
|--------|--------|-------------------|
| Passport Seva | passportindia.gov.in | JPEG, 630×810px, 10–250KB, white background |
| UPSC | upsconline.nic.in | JPEG, 20–300KB, 3.5×4.5cm, white background |
| Sarathi/Vahan | sarathi.parivahan.gov.in | JPEG, 10–20KB, 35×45mm, white background |
| Indian Visa | indianvisaonline.gov.in | JPEG, 10KB–300KB, square, white background |
| e-Visa | indianvisaonline.gov.in/evisa/ | JPEG, 10KB–1MB, square, white background |
| JK BOPEE | jkbopee.gov.in | JPEG, 10–50KB, 3.5×4.5cm |
| Aadhaar (UIDAI) | uidai.gov.in | JPEG, 2–200KB |
| NSP | scholarships.gov.in | JPEG, <100KB |
| e-Shram | eshram.gov.in | JPEG, <100KB |
| Income Tax | incometax.gov.in | JPEG, <50KB |
| GST | gst.gov.in | JPEG, <100KB |
| CSC Digital Seva | digitalseva.csc.gov.in | JPEG, <100KB |
| SSC (CGL/CHSL) | ssc.gov.in | Photo: 20–50KB, 200×230px | Signature: 10–20KB, 140×60px |
| IBPS (PO/Clerk) | ibpsonline.ibps.in | Photo: 20–50KB, 200×230px | Signature: 10–20KB, 140×60px |
| SBI PO/Clerk | sbi.co.in | Photo: 20–50KB, 200×230px | Signature: 10–20KB, 140×60px |
| RRB | rrbcdg.gov.in | Photo: 20–50KB, 35×45mm | Signature: 10–20KB, 140×60px |
| EPFO (UAN) | epfindia.gov.in | Photo: 20–50KB, 3.5×4.5cm | Signature: 10–20KB, 140×60px |

*Plus: Custom/Manual Sarkari Spec mode for any unrecognized `.gov.in` or `.nic.in` portal*

## Install (Developer Mode)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder
5. Visit any `.gov.in` or `.nic.in` site to see DocBridge in action

## Key Features

### 🎯 AI Background Cleanup (v2 parity with web app)
When a passport photo has a non-white background, DocBridge offers **"✨ Replace background with AI"** — a parametric keying engine that:
- Samples the edge ring color to identify the background
- Cuts out the subject with parametric tolerance
- Re-composes on a **verified pure-white background at the portal's exact pixel box** (e.g., 630×810 for Passport Seva)
- Re-compresses into the portal's KB band (10–250KB)
- The result is a spec-compliant JPEG: white bg, exact W×H, inside KB limits

### 👴 Elderly Assistive Mode
A dedicated persona for pensioners and first-time users — toggle in the extension popup:
- **Auto-opens** the DocBridge panel on detected government portals after a short settle delay
- **Narrates every step** via `speechSynthesis` in English or हिंदी ("DocBridge Assist for Passport Seva. Opening photo preparation for you. Choose DigiLocker or upload from your device...")
- **High-contrast, larger nudge banner** that's impossible to miss
- Mirrors the web app's elder persona — the guide *comes to the citizen*

### 📸 Multi-Type Support (Photo, Signature, Thumb, Handwriting)
Each portal declares its upload slots with precise constraints:
- **Photo**: aspect-ratio crop, dimension scale, white background normalization
- **Signature**: tight KB bands (10–20KB), exact pixel boxes (140×60px)
- **Thumb/Handwriting**: square crops for IBPS/RRB

### 🔧 Manual Adjust & Clarity Guardrails
- **Smallest / Balanced / Sharpest** presets within the portal's min–max KB band
- **High-Compression Clarity Nudge**: When target <20KB and pixel drop >60%, amber warning: *"Compressing to <20 KB may reduce sharpness. Please inspect signature strokes at 2× zoom to confirm legibility."*
- **Zoom-on-hover** preview cards (2×) for Before/After inspection
- **DOP (Name & Date) stamp toggle** for UPSC/PSC/SSC presets

### 📊 Before/After Preview with Metrics
- Side-by-side thumbnails with live metrics: Original (e.g., 4.2 MB · 3024×4032) → Optimized (e.g., 38.4 KB · 350×450 ✓)
- Reduction badge: *"62% smaller · 89% pixels reduced"*
- Status pill: **Ready to upload** (green) or **Still over limit** (amber)

### 🔄 Iterative Binary-Search Compression
- Tests JPEG quality values (Q ∈ [0.05, 0.98]) to land exported blob in safe band
- For 20–50 KB limit, targets 42–46 KB to prevent 1-byte portal rejections
- Falls back to iterative downscaling if quality alone can't meet the limit

### 🛡️ Privacy — 100% On-Device
- **Zero network calls** during processing — check DevTools Network tab
- **Canvas API only** — no server, no analytics, no tracking
- **EXIF/GPS stripped** automatically through canvas re-encoding
- **Dismissible** — "Don't show on this site" option on every nudge

### 📤 Download & Handoff
- One-click `chrome.downloads.download({ saveAs: false })`
- Deterministic filenames: `SSC_CGL_Photo_Compliant.jpg`, `UPSC_Signature_Optimized.jpg`
- 2-step visual guide: ✓ Saved to Downloads → Click "Choose File" on portal

### 📱 Share & Feedback Bar (Post-Download)
```
[ Share on WhatsApp ]  [ Share on LinkedIn ]  [ Share on X ]
💬 Found an issue? [ Send Direct Feedback to Developer ]
```
- Pre-filled social intents with store URL
- In-app feedback modal with diagnostic metadata (domain, preset, resolution)
- Falls back to `mailto:` if no webhook configured

## How it works

- **Manifest V3** — Modern Chrome extension architecture
- **Content scripts** — Injected on `*.gov.in` and `*.nic.in` pages
- **On-device processing** — Pure Canvas API, no server calls
- **Binary search compression** — Finds optimal JPEG quality to hit target KB
- **Iterative scaling** — Scales down if quality alone can't meet the limit
- **Parametric background keying** — Edge-ring sampling for AI cleanup

## Architecture

```
chrome-extension/
├── manifest.json           # Manifest V3 config
├── content/
│   ├── detector.js         # URL + DOM matching → portal registry
│   ├── nudge.js            # Floating banner UI + assistive auto-open + voice
│   ├── panel.js            # Processing overlay (dropzone → preview → download)
│   ├── processor.js        # Canvas-based image processing (crop, scale, compress, AI cleanup)
│   ├── feedback.js         # In-app feedback modal + mailto fallback
│   └── share.js            # WhatsApp/LinkedIn/X share intents
├── shared/
│   ├── portals.js          # 17 portal configs with constraints
│   └── utils.js            # Formatting helpers
├── popup/
│   ├── popup.html          # Extension popup (380×560)
│   ├── popup.css           # Popup styles
│   └── popup.js            # Detection, preset search, custom spec, settings
├── background/
│   └── service-worker.js   # Badge + storage
├── styles/
│   └── content.css         # Nudge + panel styles (trust-themed design system)
└── assets/
    └── icon-*.svg          # Extension icons
```

## Privacy

- **100% on-device** — Your photos never leave your browser
- **No analytics** — We don't track anything
- **No server calls** — All processing happens in Canvas API
- **Dismissible** — "Don't show on this site" option on every nudge

## v2 Roadmap

- [ ] PDF processing (limited compression)
- [x] **AI background cleanup** — "Replace background with AI" re-composes the photo on a verified white background at the portal's exact pixel box (parity with the web app)
- [x] **Elderly assistive mode** — toggle in the popup; when on, DocBridge auto-opens its panel on detected gov portals with voice guidance, mirroring the web app's elder persona
- [ ] AI constraint analysis for unknown portals
- [ ] Auto-fill into portal upload inputs
- [ ] DigiLocker integration
- [ ] Signature processing (draw pad + camera capture parity with web app)
- [ ] Firefox extension

## License

MIT