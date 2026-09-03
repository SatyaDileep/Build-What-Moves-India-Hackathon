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
        hint: 'JPEG · 630×810px · <250KB · White background',
        constraint: {
          format: 'jpeg',
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
        hint: 'JPEG · 20–300KB · 3.5×4.5cm · White background',
        constraint: {
          format: 'jpeg',
          min_kb: 20,
          max_kb: 300,
          width_cm: 3.5,
          height_cm: 4.5,
          bg_color: 'white',
          width_px: 413,
          height_px: 531,
          aspect_ratio: 413 / 531
        }
      },
      {
        type: 'signature',
        hint: 'JPEG · 10–20KB · 140×60px · White background',
        constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 }
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
        hint: 'JPEG · 10–20KB · 240×240px',
        constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 240, height_px: 240, bg_color: 'white', aspect_ratio: 1 }
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
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
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
      { type: 'signature', hint: 'JPEG · 10–20KB · 140×60px', constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_px: 140, height_px: 60, bg_color: 'white', aspect_ratio: 140/60 } }
    ]
  }
];

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
  DOCBRIDGE_PORTALS = DOCBRIDGE_PORTALS.concat(DOCBRIDGE_MOCK_PORTALS);
}

// Portals where PDF processing is needed (v2) — shown as "limited support" in v1
const DOCBRIDGE_PDF_PORTALS = [
  {
    id: 'epfo',
    name: 'EPFO',
    domains: ['epfindia.gov.in', 'unifiedportal-mem.epfindia.gov.in'],
    urlPatterns: [],
    note: 'PDF processing coming in v2. For now, please convert to JPEG.'
  },
  {
    id: 'nps',
    name: 'National Pension System',
    domains: ['nps.nsdl.com', 'cra.nsdl.com'],
    urlPatterns: [],
    note: 'PDF processing coming in v2. For now, please convert to JPEG.'
  }
];
