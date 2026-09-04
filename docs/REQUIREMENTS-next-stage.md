# Requirements Matrix — Next Stage (10 ideas)

> Maps video ideas → current state → effort/impact → priority. No commit; iterative plan follows.

## Legend
- **Effort:** S <1d, M 2-3d, L 4-6d (single dev, Next.js + Canvas)
- **Impact:** H = judge-visible + user pain, M = polish, L = nice
- **Priority (MoSCoW) + RICE hint**

| # | Idea | Current | Required | Effort | Impact | Priority | Depends |
|---|------|---------|----------|--------|--------|----------|---------|
| A1 | Before vs After preview (visual) | Text sizes only (`PreviewPanel`) | Side-by-side thumbnails + zoom 2× + metrics + Download | S | H | **Must** | — |
| A2 | Progress micro-animation | Static overlay | Step labels per `source`+`portal` + bar + shimmer | S | H | **Must** | — |
| D2 | Privacy badge/mic-copy | README claim | Badge under CTA `🔒 browser-private · Zero storage` | S | H | **Must** | B1 |
| A3 | Manual Adjust (size presets) | 90° rotate (removed) | Smallest/Balanced/Sharpest within min–max KB, JPEG-only (UPSC/Vahan/Passport/SSC/NSP), re-compress via targetKB | M | H | **Must** | A1 |
| B1 | Offline local processing | Already 100% client (Canvas/pdf-lib) | Harden: offline badge, no-net assert, doc | S | H | **Must** | — |
| B2 | Smart up-scaling fallback | Downscale only | Enhance if <70% target px; sharpen/Canvas, lazy WASM | M | M | **Should** | A3 |
| D1 | Watermark/metadata proof | None | EXIF/PDF metadata + sha256 + optional footer | S-M | M | **Should** | B1 |
| B3 | Multi-doc batch | Single file | N assets → N previews → batch submit | L | M | **Should** | A1,A3 |
| C1 | Voice-guided (hi/en) | None | 🔊 toggle + `speechSynthesis` per state + aria-live | M | M | **Could** | A2 |
| C2 | Low-bandwidth mode | Full bundle | Headless text fallback, lazy pdfjs, skip hero on 2g | M | M | **Could** | — |

## Iterative Plan (proposed, 3 slices)
**Slice 1 — Trust & Transparency (fastest win, no arch risk):** A1 + A2 + D2 + B1 hardening. Demo immediately feels "real-time magic transparent". 1-2 days.
**Slice 2 — Control & Authenticity:** A3 + D1 + B2 (basic Canvas sharpen). Gives manual override + proof + clarity rescue. 2-3 days.
**Slice 3 — Scale & Inclusion:** B3 + C1 + C2. Batch + voice + low-band. Largest effort, most inclusive story. 3-5 days.

## Traceability
- Each row → `docs/PRD-next-stage.md` §3.
- Implementation refs: `src/lib/processor.ts:5`, `src/components/DocBridgeWidget/{index,PreviewPanel,ProcessingOverlay}`, `src/lib/supabase.ts`, `src/app/api/legacy-*/route.ts`.

## Deferred / Explicit Non-Goals
- Real DigiLocker OAuth (mock stays swappable)
- `chrome-extension/` untouched
- Server AI (keep client fallback)

## Next Action
Confirm slice order + language scope (C1 hi/en ok?) + watermark visibility (invisible vs footer) before coding slice 1.
