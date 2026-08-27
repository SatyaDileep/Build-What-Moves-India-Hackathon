# DocBridge

> A trusted document-preparation layer for Indian public-service portals.

DocBridge turns the most frustrating step in a public-service application—getting an attachment accepted—into a guided, one-click experience. It is designed for the millions of people who encounter cryptic upload rules, repeated rejection messages, and session timeouts while applying for essential services.

## Why DocBridge matters

Across Indian government and public-service websites, citizens are routinely asked to submit documents with exact requirements:

- A specific format such as PDF or JPEG
- Tight file-size limits, often measured in kilobytes
- Pixel-perfect photograph dimensions
- A white or plain background
- Critical details that must remain clearly visible

Today, the typical workaround is risky and exhausting: download a sensitive document, upload it to an unfamiliar third-party conversion website, resize or compress it manually, and retry the government form until it accepts the file. That experience is especially difficult for senior citizens, first-time applicants, and people accessing services from low-end phones or constrained networks.

**DocBridge removes that detour.**

## Our core proposition: DigiLocker-powered trust

DocBridge connects to a citizen's authorised DigiLocker documents rather than asking them to hand sensitive files to random converter sites. With clear consent, the user selects the document they need from their own vault; DocBridge then prepares only what the destination portal requires.

This creates a better privacy and trust model:

- **Fewer risky hand-offs:** citizens do not need to circulate identity documents through unfamiliar file tools.
- **Consent-first access:** the user chooses the source document and reviews the processed result before submission.
- **Privacy by design:** processing happens in the browser, limiting unnecessary movement of document data through additional services.
- **Production-ready security direction:** a real DigiLocker and storage integration can use authenticated, encrypted transport and access controls, while preserving the same seamless experience.

The current prototype uses mock DigiLocker data and authentication to demonstrate the flow safely; its architecture is built around a real consent-based DigiLocker integration.

## How it works

1. **Drop in DocBridge** beside a legacy portal's existing file input.
2. **Read the rules** using AI to extract a structured constraint set from the portal's upload instructions.
3. **Fetch with consent** from the user's DigiLocker vault.
4. **Prepare locally** in the browser: crop, resize, normalise backgrounds, convert formats, and compress the file.
5. **Preview before sending** so the citizen stays in control.
6. **Submit a compliant attachment** to the portal's existing backend.

The portal does not need to replace its legacy validation stack. DocBridge meets that stack where it is.

## Built for real public-service journeys

### EPFO KYC: a pensioner’s passbook upload

Ramesh needs to upload a passbook copy for EPFO KYC, but the portal accepts only a PDF under 500 KB with the account number visible. DocBridge retrieves the selected passbook image from DigiLocker, converts it to PDF, compresses it to the required size, and prepares it for the existing EPFO submission flow.

### UPSC application: a compliant passport photograph

Priya is applying through a UPSC-style portal that requires a JPEG passport photo between 20 KB and 50 KB, precisely 3.5 cm × 4.5 cm, with a white background. DocBridge takes her selected photo, applies the necessary crop, background normalisation, and compression, then lets her review the result before submitting.

## What makes DocBridge different

- **Portal-aware AI:** converts raw, human-written upload rules into machine-readable constraints.
- **DigiLocker-first workflow:** keeps citizens close to a familiar, authorised document source.
- **Client-side transformation:** uses the browser Canvas API and `pdf-lib` to avoid a heavy document-processing backend.
- **Legacy-compatible:** works as a drop-in middleware in front of existing upload endpoints and strict validation rules.
- **Human-centred:** replaces trial-and-error with a transparent progress flow: connect, analyse, optimise, review, submit.
- **Reusable by design:** the same integration can support pensions, admissions, scholarships, licenses, jobs, welfare schemes, and more.

## Architecture

```text
Citizen → DigiLocker consent → DocBridge widget → AI constraint parser
                                      ↓
                           Browser-based file preparation
                                      ↓
                         Existing government portal backend
```

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Document preparation:** Browser Canvas API and `pdf-lib`
- **AI requirement parsing:** OpenAI structured output integration point
- **Identity and document source:** DigiLocker integration point, demonstrated with Supabase-backed mock data
- **Compatibility proof:** strict EPFO and UPSC-style legacy API routes validate the final attachment

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then visit:

- `/epfo` for the EPFO KYC passbook journey
- `/upsc` for the UPSC passport-photo journey

## Vision

DocBridge makes public digital services feel as thoughtful as the people they serve. By combining trusted document access, privacy-conscious local processing, and portal-aware automation, it helps every citizen move from “file rejected” to “application complete.”

## Acknowledgement

This project is developed with assistance from OpenAI Codex.
