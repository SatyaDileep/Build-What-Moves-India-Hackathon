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

## Who this moves

- **Rural & first-time citizens** — people who have never heard of file size, proportions, or crop tools.
- **Elderly pensioners** — a rejected KYC means a fresh trip and a fresh queue.
- **Students & job-seekers** — scholarships and exam applications stall on the tiniest technicalities.
- **Even developers** — the "quick resize" detour that puts a copy of your Aadhaar on the internet.

## The experience — five real journeys

You land on the portal's own home, log in, get a gentle nudge (*"your photograph upload is pending"*), and then DocBridge does its work until your file is accepted — end to end, in English and हिंदी.

- **EPFO** — a pensioner's passbook fetched from DigiLocker and made ready in one step.
- **UPSC** — the photograph and signature on an OTR form that accepts no deviation.
- **Parivahan Sewa** — a licence photo with its famously tight size window.
- **Passport Seva** — photo + signature matched to a strict template, with live camera capture, drawing a signature on screen, or DigiLocker — your choice.
- **NSP** — a scholarship application and its parent's income certificate — several documents at once where the portal genuinely allows it; a calm single upload everywhere else.

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

## Try it

**Live → [incredible-taffy-db08a6.netlify.app](https://incredible-taffy-db08a6.netlify.app)**

Every login is pre-filled — one click to sign in, all the way to Submit. Screenshots of each journey, in both languages, are in the `docs` folder.

## How it works — in 3 easy steps

1. **Choose your documents.** There are 2 supported ways: sign in to DigiLocker and select your issued documents — consent-based — or upload a file from your phone or computer.
2. **OpenAI models read the portal's rules and prepare your documents to match** — the right type, size, and dimensions, worked out on your own device.
3. **Verify, select, and submit — right here.** No third-party sites, no hopping between tools. You approve the final copy, and you can fine-tune it manually whenever you wish.

## Privacy, plainly

Your documents never leave your device during preparation. OpenAI models are used only to read the portals' stated requirements and guide the optimisation — the documents themselves are never sent anywhere. Everything happens in your browser, on your terms.

## Vision

Public digital services should feel as thoughtful as the people they serve. Trusted identity, on-device know-how, one calm interface — turning *"file rejected"* into *"application complete"* for pensions, licences, admissions, scholarships, and everything that still moves India.

## Acknowledgement

Built honestly with OpenAI models assisting — with human judgment steering the experience. Every upload rule was learned from the real portals and verified against their actual validation behaviour, so the demo holds up the moment a judge presses Submit.
