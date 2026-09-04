# DocBridge — PRD Next Stage (v2)
> **Scope:** Improve existing Next.js app (UPSC / Vahan / EPFO journeys). **Not** the `chrome-extension/` fork.  
> **Status:** Draft — unstaged, no commit. Source video ref: 1:04 onwards. Date: 2026-09-03

## 1. Vision (unchanged)
One consent-based upload layer that makes any portal upload just work — DigiLocker-first, browser-private, legacy-compatible. No citizen should leak Aadhaar/passbook to a random converter.

## 2. Current Reality Audit (what ships today)
- **Home + Portals:** `src/app/page.tsx`, `src/components/portals/*.tsx` — Login (prefilled) → Real Home → `PortalNudge.tsx` → Upload → DocBridge widget → `legacy-*` API validation.
- **DigiLocker mock:** `src/lib/supabase.ts` + `constants.ts:72` (synthetic canvas assets, `DigiLockerModal.tsx` with autofill + ⓘ tooltip).
- **Processor:** `src/lib/processor.ts` — 100% client-side Canvas + `pdf-lib` + `pdfjs-dist`. `fileToCanvas` → `cropToAspectRatio (300 DPI 3.5×4.5 → 413×531)` → `normalizeBackground` → `compressToTargetSize` (binary-search quality + iterative `scaleCanvas` down to 90px, 8 passes aggressive) → `compressPDFBlob` (pdfjs render @ 1.5→0.65 scale, 0.82→0.25 quality). Verified pass-through if already under limit.
- **UX:** `PreviewPanel.tsx` — Before/After line-through→Optimized✓, reduction %, Download (objectURL), warning/recompress (`aggressive:true`), sign-in-to-save. `ProcessingOverlay.tsx` covers authenticating/parsing/processing/submitting.
- **Validation:** `/api/legacy-epfo|upsc|vahan` — strict KB + dimension + format checks (no overhaul needed).
- **Gaps vs video ideas:** No manual crop/rotate, no super-resolution, no batch, no voice, no low-bandwidth mode, no watermark, no privacy badge. Preview + progress exist but are weaker than spec.

## 3. Next-Stage Requirements (10 ideas → PRD)

### A. Enhance UX/UI
**A1 — Real-Time Transformation Preview (Transparency)**
- *Current:* Panel exists but text-only sizes, no visual side-by-side image preview.
- *Required:* Visual Before vs After canvases (zoom-on-hover 2×), live metrics (MB→KB, px, format), compliance chip (green/amber/red). Show *before* auto-attach; user confirms. Must reuse `ProcessingResult.original/processed` blobs to render `<img>` + dimensions.
- *Accept:* User sees both thumbnails + metrics before Submit; Download works; warning still gates over-limit.

**A2 — Dynamic Progress Feedback (Micro-animation)**
- *Current:* `ProcessingOverlay` has static steps.
- *Required:* Step micro-animation: `Fetching from DigiLocker… → AI parsing portal rules… → Optimizing for EPFO/Vahan/UPSC… → Validating…` with progress bar + shimmer. Source-aware (DigiLocker vs device). Add `WIDGET_STATES` mapping + elapsed timing.
- *Accept:* Each `parsing/processing` state shows portal-specific label + animated check; no spinner-only dead time.

**A3 — Manual Override / Fine-Tuning (Adjust size)**
- *Current:* Was 90° rotate — wrong fallback (failures are size/quality, not orientation).
- *Required:* "Adjust size" button on preview (JPEG image outputs only: UPSC/Vahan/Passport/SSC/NSP; hidden for EPFO PDF + PDF blobs) opens size-preset picker: Smallest / Balanced / Sharpest derived from `constraint.min_kb/max_kb`. Re-runs `processDocument(blob, constraint, meta, { targetKB, aggressive })` → `compressToTargetSize` in-place. Dimensions stay locked to portal rules. Falls back to auto if dismissed.
- *Filetypes:* Input `image/*` (jpeg/png/webp) → JPEG output supported. PDF input→JPEG synthetic + PDF→PDF (EPFO) excluded in v1 — Adjust hidden, user sees re-upload tip instead.
- *Accept:* User picks preset and re-previews without re-upload; output ≤ `max_kb` and ≥ `min_kb`; still validates against `legacy-*`.

### B. Strengthen Technical Architecture
**B1 — Offline Local Processing (Edge AI) — ALREADY DONE, harden it**
- *Current:* All processing is already client-side (no server AI). `openai.ts` mock → real hook optional.
- *Required:* Make guarantee explicit: zero network during `processDocument`. Gate `parsePortalConstraints` to client fallback if `OPENAI_API_KEY` missing; add `navigator.onLine` badge + WASM note. Document in Privacy badge (D2).
- *Accept:* DevTools Network tab shows 0 calls during crop/compress; works offline after initial load.

**B2 — Fallback & Smart Up-scaling (Clarity Rescue)**
- *Current:* Downscale-only; no up-scale.
- *Required:* If source < 70% of target px or OCR-risk (<150 DPI), offer "Enhance clarity" — Canvas super-resolution (2× via `createImageBitmap` + sharpen kernel, or future `onnxruntime-web` ESRGAN). Warn `⚠️ Text may be unreadable at <20KB` before applying.
- *Accept:* Low-res source (e.g., 180px) can be upscaled to ~350px and still hit KB band; warning shown; user confirms.

**B3 — Multi-Document Batch Processing**
- *Current:* Single `processDocument` + single `FormData` submit.
- *Required:* Allow selecting N DigiLocker assets → queue `processDocument` per `DocumentConstraint` (photo vs passbook). Single screen with per-file preview + per-portal routing; single "Submit all" hits multiple `legacy-*` or one batch endpoint. Extend `WidgetState` → `previewing_batch`, `supabase.fetchAsset` batch.
- *Accept:* User selects ID + Address + Photo → 3 previews → 1 submit → each validated.

### C. Accessibility & Inclusivity
**C1 — Voice-Guided Assistance (Local Languages)**
- *Current:* Text only.
- *Required:* Optional audio walkthrough (Web Speech API `speechSynthesis`, `lang` hi/en) triggered by 🔊 icon on each step: "Fetching your passbook... now optimizing...". Provide `aria-live` + transcript. Start with hi-IN + en-IN.
- *Accept:* Toggle works offline; narration follows state changes; no autoplay without consent.

**C2 — Ultra-Low Bandwidth Optimization**
- *Current:* Next.js 14 full bundle (~ static), no low-band variant.
- *Required:* Headless text-only fallback if `navigator.connection.effectiveType` ∈ {`slow-2g`,`2g`} or assets timeout: skip hero image (`img_ind.png`), serve `TricolorBar` + minimal CSS, defer `pdfjs-dist` lazy import. Add `<noscript>` + `loading=lazy` already present → add `priority` cut.
- *Accept:* Loads usable chooser in <3s on throttled 3G; processor still works after load.

### D. Security, Governance & Trust
**D1 — Tamper-Proof Metadata & Watermarking**
- *Current:* No authenticity proof after re-encode.
- *Required:* Embed invisible metadata: PDF `Subject`/`Keywords` + JPEG EXIF `UserComment` with `docbridge:v1, sha256(source), portal, timestamp, digilocker:mock|live`. Optional visible small footer "Verified via DigiLocker — DocBridge" for PDFs. Compute hash client-side (`SubtleCrypto.digest`).
- *Accept:* Re-encoded file carries verifiable tag; `legacy-*` can log it; no PII leaked.

**D2 — Privacy Assurance Dashboard (Trust Badge)**
- *Current:* Claims in README only.
- *Required:* Micro-disclaimer + badge under Upload button: `🔒 100% browser-private` + link to `/privacy` modal.
- *Accept:* Badge visible on every `idle`/`previewing` state; copy vetted; no dark pattern.

## 4. Non-Functional
- Privacy: No upload leaves browser except final `legacy-*` submit (user-initiated). D1 hash stays local.
- Performance: Preview render <200ms; PDF recompress <4s for 1.6MB on mid-phone.
- A11y: WCAG 2.1 AA, voice toggle keyboard-accessible, `aria-live` for progress.
- i18n (SHIPPED v1): `src/lib/i18n.tsx` — `LanguageProvider` + EN/HI dictionary (~90 keys), `EN|हिं` toggle in `GovernmentHeader` (all 6 portals) + home header, `document.lang` flips en/hi, `Noto Sans Devanagari` font, voice follows UI lang (`hi-IN`/`en-IN` via `voiceLang()`), `localStorage:docbridge-lang` persists. Chrome translated: nav, login, upload CTAs, widget chooser/preview/adjust/overlay/DigiLocker, privacy badge, home hero. Portal rule quotations + long body copy stay EN verbatim (official text). Structure ready for bn/ta/te (add dict column).

## 5. Dependencies & Risks
- B2 super-resolution: WASM model size vs low-bandwidth (C2) — lazy-load, offer toggle, not default.
- Crop UI (A3) must not break `width_cm` guarantee — lock aspect, validate on exit.
- Batch (B3) multiplies `legacy-*` calls — add sequential submit + retry.
- Voice (C1): `speechSynthesis` voice availability varies — fallback to text.

## 6. Out of Scope (this stage)
- Real DigiLocker OAuth (keep mock with swap-ready `supabase.ts` interface)
- Chrome extension (`chrome-extension/` untouched)

## 7. Acceptance Slice (Demo)
Happy path: `/epfo` 1.6MB PDF → sees Fetching→Optimizing→Validating animation → side-by-side preview + Download → Adjust crop (optional) → Enhance if low-res → Privacy badge visible → Submit → Success with watermark present. Batch: select 2 DigiLocker docs → 2 previews → Submit all.

## 8. Open Questions
- Super-resolution model choice (Canvas sharpen vs ONNX ESRGAN) — pick after perf test?
- Languages beyond hi/en for C1?
- Watermark visibility: invisible only vs + small footer?
