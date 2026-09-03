# Product & Technical Implementation Brief: DocBridge Extension (MVP)

**Target Audience:** Lead Engineer / AI Coding Agent  
**Goal:** Build a production-ready, Manifest V3 Chrome Extension providing in-situ document resizing, compression, and compliance formatting for Indian government and recruitment portals.

---

## 1. UI/UX Design System: "Indian GovTech & Trust" Theme

Interface must inspire immediate institutional credibility, simplicity, and trust for stressed job applicants and non-technical citizens.

**Visual Identity & Color Palette:**
- Primary Action / Identity: Deep Ashoka Navy (#0A2540 or #1E3A8A) for primary headers and primary buttons
- Accent / Energy: Bharat Saffron / Deep Amber (#F59E0B to #EA580C) for active badges, highlights, and primary CTAs
- Success / Compliance: India Green / Emerald (#059669) for "Spec-Compliant" checkmarks and validation badges
- Warning / Nudges: Vivid Yellow/Amber (#D97706) for compression and legibility warnings
- Backgrounds: Clean slate-white (#F8FAFC) with subtle card borders (#E2E8F0)

**Layout & Responsiveness:**
- Clean, compact popup layout (380px x 560px) or floating modal with responsive fluid cards
- Clear visual hierarchy: Detected Context → File Select & Crop → Quality Review → Ready-to-Upload Action

---

## 2. Dynamic Entry-Point & Portal Detection Engine

When the user launches the extension, it must immediately inspect the active tab's URL and DOM context:

```
[Active Tab URL Inspected]
       │
       ├─► Recognized Portal Match (e.g., ssc.gov.in, upsconline.nic.in)
       │         └─► Auto-populate Preset Cards & Format Constraints
       │
       └─► Unrecognized / Generic Site
                 └─► Show "Custom / Manual Sarkari Spec" Mode
```

**Detection Logic & UI State**

*Recognized Government Portals:*
- Match against built-in domain dictionary (e.g., `*://*.ssc.gov.in/*`, `*://*.upsconline.nic.in/*`, `*://*.ibpsonline.ibps.in/*`, `*://*.epfindia.gov.in/*`, `*://parivahan.gov.in/*`)
- Display top banner: `🇮🇳 Detected: Staff Selection Commission (SSC CGL Form)`

*Supported Conversion Types Matrix:*
- Display selectable chips for detected site (e.g., [Passport Photo (20-50 KB)], [Signature (10-20 KB)], [Thumb Impression])
- Pre-fill target dimensions, aspect ratio, and size boundaries

*Graceful Handling of Unsupported / Partial Portals:*
- If on uncataloged portal, show: `ℹ️ Portal Not Auto-Indexed: Select from 50+ Sarkari Presets or Custom KB/Pixel Mode`
- Provide quick searchable dropdown of standard Indian recruitment specs

---

## 3. On-Device Image Processing Engine (100% Client-Side Sandbox)

Strict zero-data-leak — all conversions inside local browser sandbox.

**Core Pipeline:**
- Input image loaded via `<input type="file">` into memory using FileReader or createImageBitmap
- Canvas manipulation via OffscreenCanvas or standard HTML5 Canvas
- Aspect-ratio-locked cropping container (3.5:4.5 for photos, 140:60 or 2:1 for signatures)
- Automatic EXIF & GPS metadata stripping through canvas re-encoding

**Iterative Binary-Search Quantization:**
- Compression loop must test JPEG quality values (Q ∈ [0.05, 0.98]) to land exported blob in safe band (e.g., for 20–50 KB limit, target 42–46 KB to prevent 1-byte portal rejections)

---

## 4. Double-Check Review Step & Blurriness / Clarity Nudges

Never export without explicit preview control.

```
[Target KB < 20 KB AND Resolution Drop > 60%]
       │
       ▼
[Trigger High-Compression Clarity Warning]
       │
       ▼
"⚠️ Legibility Check: Small file sizes can cause blurry text or signatures."
       │
       ▼
[User Inspects Zoom Preview & Confirms]
```

**Interactive Double-Check Review Screen:**
- Side-by-side or tabbed Before vs. After preview
- Live metric comparisons:
  - Original: e.g., 4.2 MB | 3024 x 4032 px
  - Optimized: e.g., 38.4 KB | 350 x 450 px (Compliant ✓)

**Clarity & Legibility Nudge System:**
- Small-Size Warning: If target <20 KB and scaling ratio high, display amber callout: `⚠️ High-Compression Alert: Compressing to <20 KB may reduce sharpness. Please inspect the signature strokes below to confirm they are clearly readable before saving.`
- Zoom-on-Hover: Hover/click preview to zoom 2x and inspect legibility

**Name & Date of Photo (DOP) Toggle:**
- For UPSC and State PSC presets, provide optional checkbox to dynamically stamp candidate name and date onto lower margin

---

## 5. Delivery & Effortless Manual Upload Handoff

**One-Click Form-Ready Download:**
- Trigger automatic local download using `chrome.downloads.download({ saveAs: false })`
- Deterministic File Naming: `SSC_CGL_Compliant_Photo.jpg` or `UPSC_Signature_Optimized.jpg`

**Next-Step Visual Guide (2-Step Handoff):**
- Step 1: ✓ Saved to Downloads: `SSC_CGL_Compliant_Photo.jpg`
- Step 2: Click "Choose File" on portal and select this file

---

## 6. Viral Growth & Direct Feedback Loops

```
┌─────────────────────────────────────────────────────────────┐
│                 Post-Download Action Bar                    │
│   [ Share on WhatsApp ]  [ Share on LinkedIn ]  [ Share X ]  │
│   💬 Found an issue? [ Send Direct Feedback to Developer ]  │
└─────────────────────────────────────────────────────────────┘
```

**A. One-Click Social Sharing**

- WhatsApp: `https://api.whatsapp.com/send?text=Never%20face%20SSC%2FUPSC%20upload%20rejections%20again!%20Check%20out%20DocBridge%20to%20resize%20photos%20and%20signatures%20100%25%20privately:%20[Store_URL]`
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=[Store_URL]`
- X (Twitter): `https://twitter.com/intent/tweet?text=Formatting%20documents%20for%20Indian%20Govt%20exams%20used%20to%20be%20painful.%20DocBridge%20fixes%20it%20on-device%20with%20zero%20privacy%20leaks!&url=[Store_URL]`

**B. Direct Developer Feedback System**

*In-App Feedback Modal:*
- Issue Type (Dropdown: Portal Spec Changed / Conversion Quality / New Site Request / General Feedback)
- Optional Message textarea
- Auto-appended Diagnostic Metadata (Active URL domain, Selected Preset, Detected Resolution)

*Submission Protocol:*
- Fallback `mailto:support@yourdomain.com?subject=[DocBridge Feedback] Portal Issue&body=...`
- Or lightweight JSON payload to serverless webhook (Formspree / Cloudflare Worker / Netlify Function)

---

## 7. Technical Manifest & Architecture

**manifest.json (Manifest V3)**
```json
{
  "manifest_version": 3,
  "name": "DocBridge - Sarkari Photo & Signature Resizer",
  "version": "1.0.0",
  "description": "Resize photos and signatures for SSC, UPSC, IBPS, and Indian government portals. 100% private and on-device.",
  "permissions": ["activeTab", "downloads", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

**File Structure**
```
docbridge-extension/
├── manifest.json
├── popup.html
├── popup.js
├── css/styles.css
├── js/
│   ├── detector.js
│   ├── presets.js
│   ├── canvas-engine.js
│   ├── share.js
│   └── feedback.js
└── assets/icons/
```

---

## 8. Definition of Done (Acceptance Criteria)

- [ ] Detection Accuracy: Auto-identifies ssc.gov.in, upsconline.nic.in, ibpsonline.ibps.in, displays spec cards
- [ ] Zero-Network Privacy: Zero network calls in DevTools Network tab during processing
- [ ] Strict Compliance Range: Outputs land strictly within prescribed KB limits (never over/under)
- [ ] Clarity Guardrails: Amber alert when low-KB output risks illegible signatures/thumbprints
- [ ] Download & Guidance: Clean descriptive filename + 2-step manual upload instructions
- [ ] Social & Feedback Active: Share buttons launch prepopulated intents, feedback triggers email flow
