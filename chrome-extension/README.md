# DocBridge — Chrome Extension

> **On-device photo preparation for Indian government portals**

A lightweight Chrome extension that detects when you're on an Indian government portal with strict file upload rules, shows a helpful nudge, and processes your photos entirely in your browser — no uploads to any server.

## What it does

1. **Detects** — When you visit a known gov portal (Passport Seva, UPSC, Sarathi, etc.), DocBridge detects the upload requirements
2. **Nudges** — A small floating banner appears: "DocBridge can prepare this photo for Passport Seva"
3. **Processes** — Drop your photo → crop, compress, format to meet the portal's exact specs
4. **Downloads** — Download the optimized photo and upload it to the portal

## Supported Portals

| Portal | Domain | Photo Requirements |
|--------|--------|-------------------|
| Passport Seva | passportindia.gov.in | JPEG, 630×810px, <250KB |
| UPSC | upsconline.nic.in | JPEG, 20–200KB, 3.5×4.5cm |
| Sarathi/Vahan | sarathi.parivahan.gov.in | JPEG, 10–20KB, 35×45mm |
| Indian Visa | indianvisaonline.gov.in | JPEG, 10KB–300KB, square |
| e-Visa | indianvisaonline.gov.in/evisa/ | JPEG, 10KB–1MB, square |
| JK BOPEE | jkbopee.gov.in | JPEG, 10–50KB, 3.5×4.5cm |
| Aadhaar | uidai.gov.in | JPEG, 2–200KB |
| NSP | scholarships.gov.in | JPEG, <100KB |
| e-Shram | eshram.gov.in | JPEG, <100KB |
| Income Tax | incometax.gov.in | JPEG, <50KB |
| GST | gst.gov.in | JPEG, <100KB |
| CSC | digitalseva.csc.gov.in | JPEG, <100KB |

## Install (Developer Mode)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder
5. Visit any `.gov.in` or `.nic.in` site to see DocBridge in action

## How it works

- **Manifest V3** — Modern Chrome extension architecture
- **Content scripts** — Injected on `*.gov.in` and `*.nic.in` pages
- **On-device processing** — Pure Canvas API, no server calls
- **Binary search compression** — Finds optimal JPEG quality to hit target KB
- **Iterative scaling** — Scales down if quality alone can't meet the limit

## Architecture

```
chrome-extension/
├── manifest.json           # Manifest V3 config
├── content/
│   ├── detector.js         # URL + DOM matching
│   ├── nudge.js            # Floating banner UI
│   ├── panel.js            # Processing overlay
│   └── processor.js        # Canvas-based image processing
├── shared/
│   ├── portals.js          # 12 portal configs
│   └── utils.js            # Formatting helpers
├── popup/
│   ├── popup.html          # Extension popup
│   ├── popup.css           # Popup styles
│   └── popup.js            # Popup logic
├── background/
│   └── service-worker.js   # Badge + storage
├── styles/
│   └── content.css         # Nudge + panel styles
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
- [ ] AI constraint analysis for unknown portals
- [ ] Auto-fill into portal upload inputs
- [ ] DigiLocker integration
- [ ] Signature processing
- [ ] Firefox extension

## License

MIT
