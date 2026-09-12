# DocBridge — One calm upload for India's many official portals

> A DigiLocker-first document layer that makes any government upload *just work* — no retry loops, and no leaking Aadhaar to random converter sites.

**🔗 Live demo → [incredible-taffy-db08a6.netlify.app](https://incredible-taffy-db08a6.netlify.app)** · Built for **Build What Moves India** Hackathon

---

## The problem

Every day the same story repeats across India. A pensioner at a cyber café, a student applying for a scholarship, a first-time passport applicant — all of them stopped by the same thing: **one file the portal silently rejects.**

UPSC, Parivahan Sewa, EPFO, Passport Seva, NSP — each asks for the same kind of document (a photograph, a signature, a passbook), yet each demands it in its **own hidden way**: file type, quality, exact dimensions, even the background colour. Miss any detail and the upload fails — without telling you why.

So citizens do what anyone would: download their Aadhaar or passbook, hunt for a *"resize my PDF online"* site, upload it to an unknown service, compress, retry, fail, retry. **Their document is now sitting on a stranger's server.**

For the rural, the elderly, the first-time user, a rejected upload isn't "try again" — it's another trip, another helper, another day lost.

## What DocBridge does

DocBridge removes the retry loop. One calm upload experience that —

- **Fetches from somewhere you already trust** — DigiLocker, with your consent — or accepts a file directly from your device. Both paths are first-class.
- **Reads the portal's own rules** — OpenAI models are used to read each portal's stated requirements and turn them into precise preparation instructions. No rules are hardcoded or guessed per document.
- **Prepares the document on your own device** — resized, converted, compressed, and quality-checked in the browser, before a single byte leaves your hands.
- **Shows you the result first** — the original next to the ready-to-submit copy. Adjust it manually if you like; the choice stays with you.
- **Submits a file the portal already accepts** — the submit step is checked against strict rules that mirror the live portals' own validation. No changes to any government backend needed.

When a document is ready, you can **save it back to your DigiLocker with automatic tags**. So the photograph you perfected for Passport Seva can be **reused on Parivahan minutes later** — already prepared, verified instantly, never reworked.

> **Upload once. Portal-ready everywhere.**

## Built for every citizen

- **Guided by voice** — every key step can be spoken aloud, in English or हिंदी, for elderly and first-time users. The "How it works" walkthrough narrates each step *including* its bullet points.
- **"How DocBridge works in 3 easy steps"** — an illustrated, narrated walkthrough available on every portal, so no one wonders what just happened to their document.
- **Two languages everywhere** — full English and हिंदी across every portal, toggleable at any moment, including the guided walkthrough, its voice narration, and the DocBridge Guide overlay.
- **Already-prepared documents stay untouched** — when you pick a document you saved earlier, DocBridge verifies it instead of reworking it, preserving the exact quality you approved.
- **Elderly assistive mode** — a dedicated persona that auto-opens the guide, narrates every step, and never asks the user to find buttons. The guide *comes to them*.

## Who this moves

- **Rural & first-time citizens** — people who have never heard of file size, proportions, or crop tools.
- **Elderly pensioners** — a rejected KYC means a fresh trip and a fresh queue.
- **Students & job-seekers** — scholarships and exam applications stall on the tiniest technicalities.
- **Even developers** — the "quick resize" detour that puts a copy of your Aadhaar on the internet.

## The experience — six real journeys

You land on the portal's own home, log in, get a gentle nudge (*"your photograph upload is pending"*), and then DocBridge does its work until your file is accepted — end to end, in English and हिंदी.

| Portal | Journey | Key Features |
|--------|---------|--------------|
| **EPFO** | A pensioner's passbook fetched from DigiLocker and made ready in one step | PDF passbook → verified → ready |
| **UPSC** | The photograph and signature on an OTR form that accepts no deviation | 20–300KB JPEG, 3.5×4.5cm, DOP stamp toggle |
| **Parivahan Sewa** | A licence photo with its famously tight size window | 10–20KB JPEG, 35×45mm, strict compliance |
| **Passport Seva** | Photo + signature matched to a strict template, with live camera capture, drawing a signature on screen, or DigiLocker — your choice | 630×810px JPEG, 10–250KB, **AI background cleanup** to verified white |
| **NSP** | A scholarship application and its parent's income certificate — several documents at once where the portal genuinely allows it; a calm single upload everywhere else | Multi-document batch, PDF income cert ≤500KB |
| **SSC** | OTR photo & signature for CGL/CHSL exams | 20–50KB photo (200×230px), 10–20KB signature (140×60px) |

### The interference layer — DocBridge Guide

On **Passport Seva, UPSC, and EPFO**, DocBridge demonstrates its most important idea: **the portal stays exactly as the government built it.** Instead of replacing the upload screen, DocBridge *interferes* the moment it detects one:

- A **floating companion panel** appears in the corner, with a live checklist — *✓ Photo · ● Signature* — so multi-document forms never lose the user.
- A **spotlight** dims the page and cuts a glowing frame around the exact "Choose File" row the user needs right now. One thing to look at, always.
- The companion **walks step 1 of 2, step 2 of 2**, preparing each file against the portal's own rules, then auto-advances and confirms when every upload has passed.
- Users can collapse it to a small pill, or toggle the spotlight off — the guide assists, it never traps.

This is the same contract the DocBridge Chrome extension fulfils on live `gov.in` pages (detect `input[type=file]`, anchor, guide) — the web journeys and the extension share one architecture and one story: **government sites stay untouched; citizens get a calm, expert guide sitting beside them.**

### A moment worth trying

1. Open **Passport Seva** and upload a photo and signature with *"save to DigiLocker"* on.
2. Sign in to **Parivahan Sewa**.
3. Open DigiLocker — your saved copies sit at the top, tagged *optimised for Passport Seva*.
4. Pick one. It is verified instantly and appears ready before you blink.

No third-party site ever sees your documents.

## New in this release

### 🎯 AI Background Cleanup (Passport Seva parity)
When a passport photo has a non-white background, DocBridge now offers **"Replace background with AI"** — a parametric keying engine that samples the edge ring, cuts out the subject, and re-composes it on a **verified pure-white background at exactly 630×810px**, then re-compresses into the 10–250KB band. The *Before* pane stays the original upload; the *After* pane becomes the portal-ready file. No server round-trip for the image itself — only a consent-gated AI verdict call.

### 👴 Elderly Assistive Mode
A dedicated persona for pensioners and first-time users:
- Auto-opens the DocBridge panel on detected government portals after a short settle delay
- Narrates every step via `speechSynthesis` in English or हिंदी ("DocBridge Assist for Passport Seva. Opening photo preparation for you...")
- High-contrast, larger nudge banner that's impossible to miss
- Mirrors the web app's elder persona — the guide *comes to the citizen*, not the other way around

### 📦 Multi-Document Batch Processing
For portals that genuinely accept multiple files in one upload (NSP scholarship + income cert, Sarathi DMS):
- Select N documents from DigiLocker or device
- Each item is parsed and optimized against its own slot constraint (photo vs. income vs. signature)
- Sequential processing with progress tracking
- "Submit all" with one retry per file — a single flaky legacy call can't fail the whole batch

### 📸 Live Camera Capture & Signature Drawing
- **Camera capture**: Live preview with on-device face detection guidance, auto-crop to portal aspect ratio
- **Signature pad**: Smooth canvas drawing, exported as JPEG at exact portal dimensions (e.g., 140×60px for UPSC/SSC)
- Both flow through the same optimization pipeline as uploaded files

### 🔐 DigiLocker Integration (Mock, Swappable)
- Consent-based OAuth-style flow: pick issued documents from your vault
- **Auto-tagging on save**: When you save an optimized copy back to DigiLocker, it's tagged with the portal name and document type (e.g., `Passport Seva-ready · photo`)
- **Cross-portal reuse**: A photo saved for Passport Seva appears at the top of DigiLocker when you open Parivahan — verified instantly, no rework

### 🎙️ Full Voice Guidance (English + हिंदी)
- Per-state narration: authenticating → parsing → optimizing → previewing → submitting → success
- "How it works" walkthrough narrates each bullet point
- DocBridge Guide overlay narrates per-step on portal pages
- Self-cancelling: new narration interrupts previous, no overlapping speech
- Low-bandwidth mode: optional text-only fallback

### ✨ Manual Adjust & Clarity Guardrails
- **Smallest / Balanced / Sharpest** presets within the portal's min–max KB band
- **High-Compression Clarity Nudge**: When target <20KB and pixel drop >60%, an amber warning: *"Compressing to <20 KB may reduce sharpness. Please inspect signature strokes at 2× zoom to confirm legibility."*
- **Zoom-on-hover** preview cards (2×) for Before/After inspection
- **DOP (Name & Date) stamp toggle** for UPSC/PSC/SSC presets

### 📊 Before/After Preview with Metrics
- Side-by-side thumbnails with live metrics: Original (e.g., 4.2 MB · 3024×4032) → Optimized (e.g., 38.4 KB · 350×450 ✓)
- Reduction badge: *"62% smaller · 89% pixels reduced"*
- Status pill: **Ready to upload** (green) or **Still over limit** (amber)

## Try it

**Live → [incredible-taffy-db08a6.netlify.app](https://incredible-taffy-db08a6.netlify.app)**

Every login is pre-filled — one click to sign in, all the way to Submit. Screenshots of each journey, in both languages, are in the `docs` folder.

## How it works — in 3 easy steps

1. **Choose your documents.** There are 2 supported ways: sign in to DigiLocker and select your issued documents — consent-based — or upload a file from your phone or computer. On Passport Seva, you can also capture a live photo or draw your signature on screen.
2. **OpenAI models read the portal's rules and prepare your documents to match** — the right type, size, and dimensions, worked out on your own device. For non-white backgrounds on passport photos, AI background cleanup re-composes on a verified white ground at the exact pixel box.
3. **Verify, select, and submit — right here.** No third-party sites, no hopping between tools. You approve the final copy, and you can fine-tune it manually whenever you wish. Save to DigiLocker with one click for instant reuse on the next portal.

## Privacy, plainly

Your documents never leave your device during preparation. OpenAI models are used only to read the portals' stated requirements and guide the optimisation — the documents themselves are never sent anywhere. Everything happens in your browser, on your terms.

**100% on-device processing** — Canvas API, pdf-lib, no server calls for image transforms. Network tab stays empty during processing.

## Vision

Public digital services should feel as thoughtful as the people they serve. Trusted identity, on-device know-how, one calm interface — turning *"file rejected"* into *"application complete"* for pensions, licences, admissions, scholarships, and everything that still moves India.

## Architecture highlights

### Web Application (Next.js 14 + React 18)
```
src/
├── components/
│   ├── DocBridgeWidget/       # Core widget: source chooser → process → preview → submit
│   │   ├── index.tsx          # State machine, batch + single flows, DigiLocker integration
│   │   ├── PreviewPanel.tsx   # Before/After, metrics, adjust, AI cleanup, batch grid
│   │   ├── ProcessingOverlay.tsx # Step-by-step narration + shimmer progress
│   │   ├── CameraCapture.tsx  # Live camera with face guidance
│   │   ├── SignaturePad.tsx   # Smooth canvas drawing → JPEG
│   │   └── DigiLockerModal.tsx # Mock vault with personas
│   ├── DocBridgeGuide/        # Interference layer for live portals
│   │   └── index.tsx          # Spotlight, companion, step walkthrough, narration
│   ├── portals/               # Portal-specific pages (Passport, UPSC, EPFO, Vahan, NSP, SSC)
│   └── ui/                    # PrivacyBadge, SpecsModal, HowItWorksModal, VoiceToggle
├── lib/
│   ├── processor.ts           # Canvas pipeline: crop → scale → normalize BG → compress (binary search) → safe-band
│   ├── openai.ts              # Constraint parsing from portal requirements text
│   ├── supabase.ts            # Mock DigiLocker vault (localStorage-backed)
│   ├── i18n.tsx               # EN/HI strings, locale context
│   ├── voice.ts               # speechSynthesis wrapper, dwell timing
│   └── guideNarration.ts      # Per-portal, per-step narration scripts
└── app/api/
    ├── legacy-*/route.ts      # Mock legacy endpoints per portal
    └── ai-verify/route.ts     # Consent-gated AI verdict for background cleanup
```

### Chrome Extension (Manifest V3)
```
chrome-extension/
├── manifest.json
├── background/service-worker.js   # Badge + storage
├── content/
│   ├── detector.js                # URL/DOM matching → portal registry
│   ├── nudge.js                   # Floating banner + assistive auto-open
│   ├── panel.js                   # Processing overlay (dropzone → preview → download)
│   ├── processor.js               # Canvas pipeline (parity with web app)
│   ├── feedback.js                # In-app feedback modal + mailto
│   └── share.js                   # WhatsApp/LinkedIn/X share intents
├── popup/
│   ├── popup.html                 # 380×560 popup with preset chips, custom spec, stats
│   ├── popup.js                   # Detection, preset search, settings toggles
│   └── popup.css
├── shared/
│   ├── portals.js                 # 17 portal configs with constraints
│   └── utils.js                   # Formatting helpers
└── styles/content.css             # Trust-themed design system
```

## Screenshots

All screenshots in `docs/screenshots/` (English) and `docs/screenshots/*-hi.png` (Hindi).

Journey frame sequences in `docs/journeys/<portal>-<lang>/` (10 frames each).

| Home | EPFO | UPSC | Vahan | Passport | NSP | SSC |
|------|------|------|-------|----------|-----|-----|
| ![Home](docs/screenshots/home-en.png) | ![EPFO](docs/screenshots/epfo-en.png) | ![UPSC](docs/screenshots/upsc-en.png) | ![Vahan](docs/screenshots/vahan-en.png) | ![Passport](docs/screenshots/passport-en.png) | ![NSP](docs/screenshots/nsp-en.png) | ![SSC](docs/screenshots/ssc-en.png) |

## Acknowledgement

Built honestly with OpenAI models assisting — with human judgment steering the experience. Every upload rule was learned from the real portals and verified against their actual validation behaviour, so the demo holds up the moment a judge presses Submit.

---

## Chrome Extension

**See `chrome-extension/README.md` for the standalone extension documentation.**

The extension brings the same on-device processing to live `*.gov.in` and `*.nic.in` pages:
- Detects portal → shows nudge → opens panel → processes photo → downloads compliant file
- **Elderly assistive mode**: auto-opens with voice narration
- **AI background cleanup**: parametric keying → white background → exact portal pixel box
- **17 portals** pre-configured (Passport, UPSC, SSC, IBPS, Sarathi, Visa, EPFO, NSP, e-Shram, Income Tax, GST, CSC, JK BOPEE, UIDAI, RRB, SBI, RRB)
- **Custom/Manual Sarkari Spec** mode for unrecognized portals
- **Share & Feedback** bar after download

Install: `chrome://extensions/` → Developer mode → Load unpacked → select `chrome-extension/`