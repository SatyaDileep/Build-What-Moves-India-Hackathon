# DocBridge — One calm upload for India's many official portals

> A DigiLocker-first document layer that makes any government upload *just work* — no retry loops, and no leaking Aadhaar to random converter sites.

**🔗 Live demo → [incredible-taffy-db08a6.netlify.app](https://incredible-taffy-db08a6.netlify.app)** · Built for **Build What Moves India** Hackathon

---

## The problem

Every day the same story repeats across India. A pensioner at a cyber café, a student applying for a scholarship, a first-time passport applicant — all of them stopped by the same thing: **one file the portal silently rejects.**

UPSC, Sarathi, EPFO, Passport Seva, SSC, NSP — each asks for the same kind of document (a photograph, a signature, a passbook), yet each demands it in its **own hidden way**: file type, quality, exact proportions, even the background colour. Miss any detail and the upload fails — without telling you why.

So citizens do what anyone would: download their Aadhaar or passbook, hunt for a *"resize my PDF online"* site, upload it to an unknown service, compress, retry, fail, retry. **Their document is now sitting on a stranger's server.**

For the rural, the elderly, the first-time user, a rejected upload isn't "try again" — it's another trip, another helper, another day lost.

## What DocBridge does

DocBridge removes the retry loop. One calm upload experience that —

- **Fetches from somewhere you already trust** — DigiLocker, with your consent, instead of a random file-converter site.
- **Fixes the document on your own device** — prepared to exactly what the portal will accept, before a single byte leaves your hands.
- **Shows you the result first** — the original next to the ready-to-submit copy. Download it if you like, adjust it if you don't.
- **Submits a file the portal already accepts** — the submit step is checked against strict rules that mirror the live portals' own validation. No changes to any government backend needed.

When a document is ready, you can **save it back to your DigiLocker with auto-tags**. So the photograph you perfected for Passport Seva can be **reused on Sarathi minutes later** — no re-uploading, no re-cropping, nothing redone.

> **Upload once. Portal-ready everywhere.**

## Who this moves

- **Rural & first-time citizens** — people who have never heard of file size, proportions, or crop tools.
- **Elderly pensioners** — a rejected KYC means a fresh trip and a fresh queue.
- **Students & job-seekers** — scholarships and exam applications stall on the tiniest technicalities.
- **Even developers** — the "quick resize" detour that puts a copy of your Aadhaar on the internet.

## The experience — six real journeys

You land on the portal's own home, log in, get a gentle nudge (*"your photograph upload is pending"*), and then DocBridge does its work until your file is accepted — end to end, in English and हिंदी.

- **EPFO** — a pensioner's passbook fetched from DigiLocker and made ready in one step.
- **UPSC** — the photograph and signature on an OTR form that accepts no deviation.
- **Sarathi (Vahan)** — a licence photo with its famously tight size window.
- **Passport Seva** — photo + signature matched to a strict template, saved back with tags.
- **SSC** — the smallest photograph and signature boxes in any portal.
- **NSP** — a scholarship application and its parent's income certificate — batch upload where the portal genuinely allows several files at once; a calm single upload everywhere else.

### A moment worth trying

1. Open **Passport Seva** and upload a photo and signature with *"save to DigiLocker"* on.
2. Sign in to **Sarathi**.
3. Open DigiLocker — your saved copies sit at the top, tagged *optimised for Passport Seva*.
4. Pick one. The Sarathi-ready version appears before you blink.

No third-party site ever sees your documents.

## Try it

**Live → [incredible-taffy-db08a6.netlify.app](https://incredible-taffy-db08a6.netlify.app)**

Locally:

```bash
npm install
npm run dev
```

- `/epfo` — bring a bulky passbook; watch it come back small and accepted.
- `/upsc` — photograph + signature OTR upload, then a calm "submitting…" beat that settles into a success banner.
- `/vahan` — a photo that was far too big comes back exactly right.
- …and the same story on `/passport`, `/ssc`, `/nsp`.

Every login is pre-filled — one click to sign in, all the way to Submit.

## Screenshots — every site, English and हिंदी

| Site | English | Hindi |
|------|---------|-------|
| Home | ![home EN](docs/screenshots/home-en.png) | ![home HI](docs/screenshots/home-hi.png) |
| EPFO | ![epfo EN](docs/screenshots/epfo-en.png) | ![epfo HI](docs/screenshots/epfo-hi.png) |
| UPSC | ![upsc EN](docs/screenshots/upsc-en.png) | ![upsc HI](docs/screenshots/upsc-hi.png) |
| Vahan / Sarathi | ![vahan EN](docs/screenshots/vahan-en.png) | ![vahan HI](docs/screenshots/vahan-hi.png) |
| Passport Seva | ![passport EN](docs/screenshots/passport-en.png) | ![passport HI](docs/screenshots/passport-hi.png) |
| SSC | ![ssc EN](docs/screenshots/ssc-en.png) | ![ssc HI](docs/screenshots/ssc-hi.png) |
| NSP | ![nsp EN](docs/screenshots/nsp-en.png) | ![nsp HI](docs/screenshots/nsp-hi.png) |

## Vision

Public digital services should feel as thoughtful as the people they serve. Trusted identity, on-device know-how, one calm interface — turning *"file rejected"* into *"application complete"* for pensions, licences, admissions, scholarships, and everything that still moves India.

## Acknowledgement

Built honestly with AI — OpenAI Codex / Muse Spark — with human judgment steering the experience. Every upload rule was learned from the real portals and verified against the real validation logic, so the demo holds up the moment a judge presses Submit.