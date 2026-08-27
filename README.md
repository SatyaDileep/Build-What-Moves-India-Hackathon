# DocBridge

DocBridge makes document uploads on Indian public-service portals simpler, faster, and more reliable.

## The problem

Many government and public-service websites impose strict rules for uploaded documents: a particular file type, a small maximum size, precise photo dimensions, or a plain background. Citizens are often forced to leave the application, search for conversion tools, resize a file, compress it repeatedly, and return to try again. This creates avoidable friction at an important point in the service journey.

## Our solution

DocBridge sits alongside an existing upload field and prepares a citizen's document for the portal automatically. It reads the portal's requirements, retrieves an authorised document from DigiLocker, applies the needed transformations, and presents a compliant file for submission.

The result is a seamless upload experience that helps people complete public-service applications with confidence instead of navigating a chain of technical workarounds.

## What it supports

- Extracts upload requirements such as file type, maximum size, dimensions, and background colour.
- Connects the user to relevant DigiLocker documents.
- Converts images to PDF when a portal requires a PDF.
- Crops, resizes, normalises backgrounds, and compresses images to meet portal constraints.
- Shows the processed file for review before submitting it to the destination portal.

## Example journeys

### EPFO KYC

For an EPFO passbook upload, DocBridge prepares a PDF within the 500 KB limit while preserving the information needed for KYC.

### UPSC application photograph

For a UPSC passport photograph, DocBridge creates a JPEG with a white background, 3.5 cm × 4.5 cm dimensions, and a file size between 20 KB and 50 KB.

## Technology

- Next.js 14 and React
- TypeScript and Tailwind CSS
- `pdf-lib` for PDF generation
- DigiLocker and requirement-parsing integration points

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit `/epfo` or `/upsc` to explore the portal journeys.

## Project direction

DocBridge is designed as a reusable integration layer for public-service portals. The same approach can support any workflow where attachment requirements make an otherwise simple citizen task unnecessarily difficult.
