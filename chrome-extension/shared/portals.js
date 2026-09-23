/**
 * Portal Registry — Indian Government Portals with Image Upload Constraints
 * 
 * Each portal entry defines:
 *   - id: unique identifier
 *   - name: display name
 *   - domains: array of domain patterns to match
 *   - urlPatterns: optional path patterns (subset of domain)
 *   - uploads: array of upload types with constraints
 *   - hint: human-readable requirement summary for the nudge
 */

const DOCBRIDGE_PORTALS = [
  {
    id: 'passport-seva',
    name: 'Passport Seva',
    domains: ['passportindia.gov.in', 'mportal.passportindia.gov.in'],
    urlPatterns: ['/psp/', '/mission/', '/AppOnlineProject/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 630×810px · 10–250KB · White background',
        constraint: {
          format: 'jpeg',
          min_kb: 10,
          max_kb: 250,
          width_px: 630,
          height_px: 810,
          bg_color: 'white',
          aspect_ratio: 630 / 810 // ~0.778 (portrait)
        }
      },
      {
        type: 'signature',
        hint: 'JPEG · <100KB',
        constraint: {
          format: 'jpeg',
          max_kb: 100,
          bg_color: 'white'
        }
      }
    ]
  },
  {
    id: 'upsc',
    name: 'UPSC',
    domains: ['upsconline.nic.in', 'upsc.gov.in'],
    urlPatterns: ['/Online/', '/examination/', '/Application/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 20–300KB · 350×350px min · White background · 75% face',
        constraint: {
          format: 'jpeg',
          min_kb: 20,
          max_kb: 300,
          bg_color: 'white'
        }
      },
      {
        type: 'signature',
        hint: 'JPEG · 20–300KB · 3 signatures on one sheet · Black ink',
        constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' }
      },
      {
        type: 'photo-id',
        hint: 'PDF · Photo ID card (Aadhaar / PAN / Passport)',
        constraint: { format: 'pdf', max_kb: 500 }
      }
    ]
  },
  {
    id: 'sarathi-vahan',
    name: 'Sarathi / Vahan',
    domains: ['sarathi.parivahan.gov.in', 'vahan.parivahan.gov.in', 'parivahan.gov.in'],
    urlPatterns: ['/sarathi/', '/vahan/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 10–20KB · 35×45mm · White background',
        constraint: {
          format: 'jpeg',
          min_kb: 10,
          max_kb: 20,
          width_cm: 3.5,
          height_cm: 4.5,
          bg_color: 'white',
          width_px: 413,
          height_px: 531,
          aspect_ratio: 413 / 531
        }
      }
    ]
  },
  {
    id: 'indian-visa',
    name: 'Indian Visa',
    domains: ['indianvisaonline.gov.in'],
    urlPatterns: ['/visa/', '/evisa/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 10KB–300KB · Square · White background',
        constraint: {
          format: 'jpeg',
          min_kb: 10,
          max_kb: 300,
          bg_color: 'white',
          // Visa photos are square
          width_px: 600,
          height_px: 600,
          aspect_ratio: 1.0
        }
      }
    ]
  },
  {
    id: 'e-visa',
    name: 'e-Visa India',
    domains: ['indianvisaonline.gov.in'],
    urlPatterns: ['/evisa/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 10KB–1MB · Square · White background',
        constraint: {
          format: 'jpeg',
          min_kb: 10,
          max_kb: 1024,
          bg_color: 'white',
          width_px: 600,
          height_px: 600,
          aspect_ratio: 1.0
        }
      }
    ]
  },
  {
    id: 'jkbopee',
    name: 'JK BOPEE',
    domains: ['jkbopee.gov.in'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 10–50KB · 3.5×4.5cm',
        constraint: {
          format: 'jpeg',
          min_kb: 10,
          max_kb: 50,
          width_cm: 3.5,
          height_cm: 4.5,
          bg_color: 'white',
          width_px: 413,
          height_px: 531,
          aspect_ratio: 413 / 531
        }
      }
    ]
  },
  {
    id: 'uidai-aadhaar',
    name: 'Aadhaar (UIDAI)',
    domains: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
    urlPatterns: ['/myaadhaar/', '/update/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 2–200KB',
        constraint: {
          format: 'jpeg',
          min_kb: 2,
          max_kb: 200,
          bg_color: 'white'
        }
      }
    ]
  },
  {
    id: 'nsp',
    name: 'National Scholarship Portal',
    domains: ['scholarships.gov.in', 'nsp.gov.in'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · <100KB',
        constraint: {
          format: 'jpeg',
          max_kb: 100,
          bg_color: 'white'
        }
      },
      {
        type: 'income-cert',
        hint: 'PDF · ≤500KB · Income certificate, stamp visible',
        constraint: { format: 'pdf', max_kb: 500 }
      },
      {
        type: 'caste-cert',
        hint: 'PDF · ≤500KB · Caste / category certificate',
        constraint: { format: 'pdf', max_kb: 500 }
      }
    ]
  },
  {
    id: 'e-shram',
    name: 'e-Shram',
    domains: ['eshram.gov.in'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · <100KB',
        constraint: {
          format: 'jpeg',
          max_kb: 100,
          bg_color: 'white'
        }
      }
    ]
  },
  {
    id: 'income-tax',
    name: 'Income Tax e-Filing',
    domains: ['incometax.gov.in', 'efiling.gov.in'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · <50KB',
        constraint: {
          format: 'jpeg',
          max_kb: 50,
          bg_color: 'white'
        }
      }
    ]
  },
  {
    id: 'gst',
    name: 'GST Portal',
    domains: ['gst.gov.in'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · <100KB',
        constraint: {
          format: 'jpeg',
          max_kb: 100,
          bg_color: 'white'
        }
      }
    ]
  },
  {
    id: 'csc-digital-seva',
    name: 'CSC Digital Seva',
    domains: ['digitalseva.csc.gov.in', 'csc.gov.in'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · <100KB',
        constraint: {
          format: 'jpeg',
          max_kb: 100,
          bg_color: 'white'
        }
      }
    ]
  },
  {
    id: 'ssc',
    name: 'Staff Selection Commission (SSC)',
    domains: ['ssc.gov.in', 'ssc.nic.in'],
    urlPatterns: ['/registration/', '/apply/', '/candidate/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 20–50KB · 200×230px · White background',
        constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 }
      },
      {
        type: 'signature',
        hint: 'JPEG · 10–20KB · 140×60px · White background',
        constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 }
      },
      {
        type: 'thumb',
        hint: 'JPEG · 10–20KB · 140×60px',
        constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 }
      }
    ]
  },
  {
    id: 'ibps',
    name: 'IBPS (PO/Clerk)',
    domains: ['ibpsonline.ibps.in', 'ibps.in'],
    urlPatterns: ['/ibps', '/apply/'],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 20–50KB · 200×230px · White background',
        constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 }
      },
      {
        type: 'signature',
        hint: 'JPEG · 10–20KB · 140×60px',
        constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 }
      },
      {
        type: 'thumb',
        hint: 'JPEG · 10–20KB · 240×240px',
        constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 }
      },
      {
        type: 'handwriting',
        hint: 'JPEG · 50–100KB · 800×400px · Declaration in own hand, English',
        constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 }
      },
      {
        type: 'document',
        hint: 'PDF · A4 · ≤500KB · Certificates / marksheet',
        constraint: { format: 'pdf', max_kb: 500 }
      }
    ]
  },
  {
    id: 'sbi-po',
    name: 'SBI PO / Clerk',
    domains: ['sbi.co.in', 'bank.sbi', 'ibpsonline.ibps.in'],
    urlPatterns: ['/sbi/', '/bank.sbi/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'thumb', hint: 'JPEG · 20–50KB · 240×240px · Left thumb', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 } },
      { type: 'handwriting', hint: 'JPEG · 50–100KB · 800×400px · Declaration in own hand, English', constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 } }
    ]
  },
  {
    id: 'rrb',
    name: 'Railway Recruitment Board (RRB)',
    domains: ['rrbcdg.gov.in', 'indianrailways.gov.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 35×45mm', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 413, height_px: 531, bg_color: 'white', aspect_ratio: 413/531 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'epfo-uan',
    name: 'EPFO (UAN)',
    domains: ['epfindia.gov.in', 'unifiedportal-mem.epfindia.gov.in'],
    urlPatterns: ['/member/', '/uan/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 3.5×4.5cm', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 413, height_px: 531, bg_color: 'white', aspect_ratio: 413/531 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'passbook', hint: 'PDF · ≤500KB · Bank passbook, account no. visible', constraint: { format: 'pdf', max_kb: 500 } }
    ]
  }
];

// Batch 2 — researched Sep 2026 from official bulletins/notifications:
// NTA (NEET/JEE/CUET/NET/CTET) bulletins, GATE 2026 IB, UPSC OTR FAQ,
// IBPS/SBI/RBI scanning guidelines PDFs, Passport Seva upload instructions,
// DSSSB OARS, GDS user manual, UP Police & Agniveer portal norms.
const DOCBRIDGE_PORTALS_RESEARCHED = [
  {
    id: 'ssc-gd',
    name: 'SSC GD Constable',
    domains: ['ssc.gov.in', 'ssc.nic.in'],
    urlPatterns: ['/gd-constable/', '/apply/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 3.5×4.5cm · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL / MTS',
    domains: ['ssc.gov.in', 'ssc.nic.in'],
    urlPatterns: ['/chsl/', '/mts/', '/apply/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 3.5×4.5cm · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'ssc-steno-je',
    name: 'SSC Steno / JE / CPO',
    domains: ['ssc.gov.in', 'ssc.nic.in'],
    urlPatterns: ['/steno/', '/je/', '/cpo/', '/si-delhi-police/', '/apply/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 3.5×4.5cm · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 10–20KB · ~6.0×2.0cm · Black ink', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, bg_color: 'white' } }
    ]
  },
  {
    id: 'ibps-rrb',
    name: 'IBPS RRB (PO/Clerk)',
    domains: ['ibpsonline.ibps.in', 'ibps.in'],
    urlPatterns: ['/rrb', '/crprrb', '/apply/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink, no capitals', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'thumb', hint: 'JPEG · 20–50KB · 240×240px · Left thumb', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 } },
      { type: 'handwriting', hint: 'JPEG · 50–100KB · 800×400px · Declaration, own hand', constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 } }
    ]
  },
  {
    id: 'ibps-so',
    name: 'IBPS SO (Specialist Officer)',
    domains: ['ibpsonline.ibps.in', 'ibps.in'],
    urlPatterns: ['/crpspl', '/so/', '/apply/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink, no capitals', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'thumb', hint: 'JPEG · 20–50KB · 240×240px · Left thumb', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 } },
      { type: 'handwriting', hint: 'JPEG · 50–100KB · 800×400px · Declaration, own hand', constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 } }
    ]
  },
  {
    id: 'ibps-clerk',
    name: 'IBPS Clerk (CSA)',
    domains: ['ibpsonline.ibps.in', 'ibps.in'],
    urlPatterns: ['/crpcl', '/clerk/', '/csa/', '/apply/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink, no capitals', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'thumb', hint: 'JPEG · 20–50KB · 240×240px · Left thumb', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 } },
      { type: 'handwriting', hint: 'JPEG · 50–100KB · 800×400px · Declaration, own hand', constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 } }
    ]
  },
  {
    id: 'sbi-clerk',
    name: 'SBI Clerk / Junior Associate',
    domains: ['sbi.co.in', 'bank.sbi'],
    urlPatterns: ['/clerk/', '/junior-associate/', '/bank.sbi/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'thumb', hint: 'JPEG · 20–50KB · 240×240px · Left thumb', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 } },
      { type: 'handwriting', hint: 'JPEG · 50–100KB · 800×400px · Declaration, own hand', constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 } }
    ]
  },
  {
    id: 'rbi-grade-b',
    name: 'RBI Grade B',
    domains: ['rbi.org.in', 'opportunities.rbi.org.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px · 4.5×3.5cm', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink, no capitals', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } },
      { type: 'thumb', hint: 'JPEG · 20–50KB · 240×240px · Left thumb', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 } },
      { type: 'handwriting', hint: 'JPEG · 50–100KB · 800×400px · Declaration, own hand', constraint: { format: 'jpeg', min_kb: 50, max_kb: 100, width_px: 800, height_px: 400, bg_color: 'white', aspect_ratio: 2 } }
    ]
  },
  {
    id: 'lic-aao',
    name: 'LIC AAO / ADO',
    domains: ['licindia.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px · 4.5×3.5cm', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink, no capitals', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'nabard',
    name: 'NABARD Grade A',
    domains: ['nabard.org'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'sebi',
    name: 'SEBI Grade A',
    domains: ['sebi.gov.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Black ink', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'esic',
    name: 'ESIC UDC / Steno',
    domains: ['esic.gov.in', 'esic.nic.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'fci',
    name: 'FCI Manager / JE',
    domains: ['fci.gov.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 200×230px', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white', aspect_ratio: 200/230 } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'neet-ug',
    name: 'NEET (UG)',
    domains: ['neet.nta.nic.in', 'neet.ntaonline.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG/PDF · 10–200KB · Passport size · 80% face, ears, white bg', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200, bg_color: 'white' } },
      { type: 'postcard', hint: 'JPG/PDF · 10–200KB · Postcard size photo (4×6)', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG/PDF · 10–50KB · Running hand, black ink', constraint: { format: 'jpeg', min_kb: 10, max_kb: 50, bg_color: 'white' } },
      { type: 'thumb', hint: 'JPG/PDF · 10–200KB · Left+right fingers & thumb', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200, bg_color: 'white' } },
      { type: 'category-cert', hint: 'PDF · 50–300KB · Category certificate', constraint: { format: 'pdf', max_kb: 300, min_kb: 50 } },
      { type: 'classx-cert', hint: 'PDF · 50–300KB · Class X marksheet / passing cert', constraint: { format: 'pdf', max_kb: 300, min_kb: 50 } }
    ]
  },
  {
    id: 'jee-main',
    name: 'JEE (Main)',
    domains: ['jeemain.nta.nic.in', 'jeemain.ntaonline.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–200KB · 80% face, ears, white bg (+ live capture)', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 10–100KB · White background', constraint: { format: 'jpeg', min_kb: 10, max_kb: 100, bg_color: 'white' } },
      { type: 'classx-cert', hint: 'PDF · 50–300KB · Class X certificate / marksheet', constraint: { format: 'pdf', max_kb: 300, min_kb: 50 } },
      { type: 'id-proof', hint: 'JPG · 10–200KB · Identity proof (non-Aadhaar)', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200 } }
    ]
  },
  {
    id: 'cuet-ug',
    name: 'CUET (UG)',
    domains: ['cuet.samarth.ac.in', 'exams.nta.ac.in'],
    urlPatterns: ['/cuet'],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–200KB · 80% face, white bg', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 4–30KB · Running hand', constraint: { format: 'jpeg', min_kb: 4, max_kb: 30, bg_color: 'white' } },
      { type: 'category-cert', hint: 'PDF · 50–300KB · Category / PwD certificate', constraint: { format: 'pdf', max_kb: 300, min_kb: 50 } }
    ]
  },
  {
    id: 'ugc-net',
    name: 'UGC NET',
    domains: ['ugcnet.nta.nic.in', 'ugcnet.ntaonline.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–200KB · 80% face, ears, white bg (+ live capture)', constraint: { format: 'jpeg', min_kb: 10, max_kb: 200, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 4–30KB · Full signature, running hand', constraint: { format: 'jpeg', min_kb: 4, max_kb: 30, bg_color: 'white' } },
      { type: 'disability-cert', hint: 'PDF · 50–300KB · UDID / disability cert, both sides', constraint: { format: 'pdf', max_kb: 300, min_kb: 50 } }
    ]
  },
  {
    id: 'ctet',
    name: 'CTET',
    domains: ['ctet.nic.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–100KB · 3.5×4.5cm', constraint: { format: 'jpeg', min_kb: 10, max_kb: 100, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 3–30KB · 3.5×1.5cm · Running hand', constraint: { format: 'jpeg', min_kb: 3, max_kb: 30, bg_color: 'white' } }
    ]
  },
  {
    id: 'gate',
    name: 'GATE',
    domains: ['gate.iitg.ac.in', 'goaps.iitg.ac.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPEG · 5–600KB · 200×260–530×690px · White bg, 60-70% face', constraint: { format: 'jpeg', min_kb: 5, max_kb: 600, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 3–300KB · 250×80–580×180px · Black/dark-blue ink', constraint: { format: 'jpeg', min_kb: 3, max_kb: 300, bg_color: 'white' } }
    ]
  },
  {
    id: 'up-police',
    name: 'UP Police',
    domains: ['uppbpb.gov.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 20–50KB · 35×45mm · White/light-grey bg, 70-80% face', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 5–20KB · 3.5×1.5cm · Black ink, running hand', constraint: { format: 'jpeg', min_kb: 5, max_kb: 20, bg_color: 'white' } }
    ]
  },
  {
    id: 'gds',
    name: 'India Post GDS',
    domains: ['indiapostgdsonline.gov.in', 'indiapost.gov.in'],
    urlPatterns: ['/gds', '/gdsonline'],
    uploads: [
      { type: 'photo', hint: 'JPG · 30–100KB · 320×400px (4:5) · 70% face', constraint: { format: 'jpeg', min_kb: 30, max_kb: 100, width_px: 320, height_px: 400, bg_color: 'white', aspect_ratio: 320/400 } },
      { type: 'signature', hint: 'JPG · 20–100KB · 300×120px (5:2) · Black/blue ink', constraint: { format: 'jpeg', min_kb: 20, max_kb: 100, width_px: 300, height_px: 120, bg_color: 'white', aspect_ratio: 300/120 } }
    ]
  },
  {
    id: 'agniveer-army',
    name: 'Agniveer Army',
    domains: ['joinindianarmy.nic.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–20KB · 3.5×4.5cm · White bg, ears visible, clean-shaven', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 5–20KB · 3.5×1.5cm · Running hand, no capitals', constraint: { format: 'jpeg', min_kb: 5, max_kb: 20, bg_color: 'white' } }
    ]
  },
  {
    id: 'agniveer-airforce',
    name: 'Agniveer Vayu (Air Force)',
    domains: ['agnipathvayu.cdac.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–50KB · 3.5×4.5cm · Holding name-date slate', constraint: { format: 'jpeg', min_kb: 10, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 10–20KB · Running hand', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, bg_color: 'white' } },
      { type: 'thumb', hint: 'JPG · 10–20KB · Left thumb impression', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, bg_color: 'white' } }
    ]
  },
  {
    id: 'agniveer-navy',
    name: 'Agniveer Navy (SSR/MR)',
    domains: ['joinindiannavy.gov.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 10–20KB · 3.5×4.5cm · 70-80% face', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · 10–20KB · Running hand', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, bg_color: 'white' } }
    ]
  },
  {
    id: 'dsssb',
    name: 'DSSSB',
    domains: ['dsssbonline.nic.in', 'dsssb.delhi.gov.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · 50–300KB · 480×672px postcard (5×7) · Upper body, white bg', constraint: { format: 'jpeg', min_kb: 50, max_kb: 300, width_px: 480, height_px: 672, bg_color: 'white', aspect_ratio: 480/672 } },
      { type: 'signature', hint: 'JPG · ≤40KB · 140×110px · Dark ink', constraint: { format: 'jpeg', min_kb: 5, max_kb: 40, width_px: 140, height_px: 110, bg_color: 'white', aspect_ratio: 140/110 } },
      { type: 'thumb', hint: 'JPG · ≤40KB · 110×140px · Left/right thumb', constraint: { format: 'jpeg', min_kb: 5, max_kb: 40, width_px: 110, height_px: 140, bg_color: 'white', aspect_ratio: 110/140 } }
    ]
  },
  {
    id: 'ignou',
    name: 'IGNOU Admission',
    domains: ['ignouadmission.samarth.edu.in', 'ignou.ac.in', 'ignouiop.samarth.edu.in'],
    urlPatterns: [],
    uploads: [
      { type: 'photo', hint: 'JPG · <100KB · Passport size, white bg', constraint: { format: 'jpeg', max_kb: 100, bg_color: 'white' } },
      { type: 'signature', hint: 'JPG · <100KB · Specimen signature', constraint: { format: 'jpeg', max_kb: 100, bg_color: 'white' } },
      { type: 'document', hint: 'JPG/PDF · <200KB each · Certificates', constraint: { format: 'pdf', max_kb: 200 } }
    ]
  },
  {
    id: 'upsc-nda',
    name: 'UPSC NDA / NA',
    domains: ['upsconline.nic.in', 'upsc.gov.in'],
    urlPatterns: ['/nda', '/otrp/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–300KB · White background · 75% face', constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 20–300KB · Black ink, one signature', constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' } },
      { type: 'photo-id', hint: 'PDF · Photo ID card', constraint: { format: 'pdf', max_kb: 500 } }
    ]
  },
  {
    id: 'upsc-cds',
    name: 'UPSC CDS / CAPF',
    domains: ['upsconline.nic.in', 'upsc.gov.in'],
    urlPatterns: ['/cds', '/capf', '/otrp/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–300KB · White background · 75% face', constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 20–300KB · Black ink, one signature', constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' } },
      { type: 'photo-id', hint: 'PDF · Photo ID card', constraint: { format: 'pdf', max_kb: 500 } }
    ]
  },
  {
    id: 'upsc-cse',
    name: 'UPSC CSE (IAS/IPS)',
    domains: ['upsconline.nic.in', 'upsc.gov.in'],
    urlPatterns: ['/cse', '/cs-p', '/otrp/'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–300KB · 350×350px+ · White bg · Name+date on print', constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 20–300KB · 3 signatures on one sheet', constraint: { format: 'jpeg', min_kb: 20, max_kb: 300, bg_color: 'white' } },
      { type: 'photo-id', hint: 'PDF · Photo ID card', constraint: { format: 'pdf', max_kb: 500 } }
    ]
  },
  {
    id: 'rrb-ntpc',
    name: 'RRB NTPC',
    domains: ['rrbcdg.gov.in', 'indianrailways.gov.in'],
    urlPatterns: ['/ntpc'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 35×45mm · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Running hand', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'rrb-alp',
    name: 'RRB ALP / Technician',
    domains: ['rrbcdg.gov.in', 'indianrailways.gov.in'],
    urlPatterns: ['/alp', '/technician'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 35×45mm · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Running hand', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  },
  {
    id: 'rrb-groupd',
    name: 'RRB Group D',
    domains: ['rrbcdg.gov.in', 'indianrailways.gov.in'],
    urlPatterns: ['/group-d', '/groupd', '/level-1'],
    uploads: [
      { type: 'photo', hint: 'JPEG · 20–50KB · 35×45mm · White background', constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' } },
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px · Running hand', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  }
];

if (typeof DOCBRIDGE_PORTALS !== 'undefined') {
  DOCBRIDGE_PORTALS.push(...DOCBRIDGE_PORTALS_RESEARCHED);
}

// Mock portal for localhost testing — simulates Passport Seva constraints
const DOCBRIDGE_MOCK_PORTALS = [
  {
    id: 'mock-passport-seva',
    name: 'Mock Passport Seva',
    domains: ['localhost', '127.0.0.1'],
    urlPatterns: [],
    uploads: [
      {
        type: 'photo',
        hint: 'JPEG · 630×810px · <250KB · White background',
        constraint: {
          format: 'jpeg',
          max_kb: 250,
          width_px: 630,
          height_px: 810,
          bg_color: 'white',
          aspect_ratio: 630 / 810
        }
      }
    ]
  }
];

// Merge mock portals into main registry for testing
if (typeof DOCBRIDGE_PORTALS !== 'undefined') {
  DOCBRIDGE_PORTALS.push(...DOCBRIDGE_MOCK_PORTALS);
}

// Portals that expect documents (often PDF) rather than plain photos. The
// note is shown when DocBridge detects one — conversions now run on-device.
const DOCBRIDGE_PDF_PORTALS = [
  {
    id: 'epfo',
    name: 'EPFO',
    domains: ['epfindia.gov.in', 'unifiedportal-mem.epfindia.gov.in'],
    urlPatterns: [],
    note: 'PDF-compress your passbook or convert document pages to JPEG — fully on-device with DocBridge.'
  },
  {
    id: 'nps',
    name: 'National Pension System',
    domains: ['nps.nsdl.com', 'cra.nsdl.com'],
    urlPatterns: [],
    note: 'Compress or convert your PDF/JPEG documents on-device with DocBridge.'
  }
];

// Open converter preset for non-portal pages: pick it from the search dropdown
// or land here directly in Full-Screen mode. No domain — never auto-matches.
const DOCBRIDGE_GENERIC_PRESET = {
  id: 'generic-doc',
  name: 'General / Document Converter',
  domains: [],
  urlPatterns: [],
  uploads: [
    {
      type: 'document',
      hint: 'Any format \u2192 JPEG / PNG / PDF \u00b7 on-device',
      constraint: {
        format: 'pdf',
        max_kb: 500,
        input_formats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
        output_formats: ['image/jpeg', 'image/png', 'application/pdf']
      }
    }
  ]
};

if (typeof DOCBRIDGE_PORTALS !== 'undefined') {
  DOCBRIDGE_PORTALS.push(DOCBRIDGE_GENERIC_PRESET);
}
