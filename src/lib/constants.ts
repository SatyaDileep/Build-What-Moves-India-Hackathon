import { PortalConfig, UserProfile, DigiLockerAsset } from '@/types';

// Indian Government Portal Design Tokens
export const COLORS = {
  primary: '#000080',
  primaryHover: '#000066',
  primaryLight: '#E8E8FF',
  saffron: '#FF9933',
  saffronLight: '#FFF3E0',
  saffronDark: '#E67E22',
  green: '#138808',
  greenLight: '#E8F5E9',
  greenDark: '#0D6B07',
  success: '#138808',
  successHover: '#0D6B07',
  successLight: '#E8F5E9',
  legacyBg: '#F5F5F5',
  legacyBorder: '#D0D0D0',
  error: '#D32F2F',
  errorLight: '#FFEBEE',
  warning: '#FF6F00',
  warningLight: '#FFF8E1',
  white: '#FFFFFF',
  black: '#1A1A1A',
  ashokaBlue: '#000080',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'Rajdhani', 'Noto Sans', system-ui, sans-serif",
  baseFontSize: '16px',
} as const;

export const PORTALS: PortalConfig[] = [
  {
    id: 'epfo',
    name: 'EPFO - Employees Provident Fund Organization',
    description: 'Update KYC / Passbook',
    requirements: 'Upload Passbook copy. Must be PDF format. Maximum size 500 KB. Account number must be visible.',
    constraint: { format: 'pdf', max_kb: 500 },
    persona: { name: 'Ramesh', age: 68, role: 'Pensioner' },
  },
  {
    id: 'upsc',
    name: 'UPSC / State PSC Job Application Portal',
    description: 'Document Upload - Passport Photo',
    requirements: 'Upload latest Passport Photo. JPEG only. File size 20KB - 200KB. Resolution 350px - 1000px. Plain white background. Face must cover 3/4th (75%) of the photo. A live photograph must also be captured and matched.',
    constraint: { format: 'jpeg', min_kb: 20, max_kb: 200, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' },
    persona: { name: 'Priya', age: 22, role: 'Applicant' },
  },
  {
    id: 'vahan',
    name: 'Vahan / Sarathi - Ministry of Road Transport',
    description: 'Document Upload - Driving Licence Photo',
    requirements: 'Upload passport photograph in JPEG only. File size 10KB - 20KB. Dimensions 35mm x 45mm. Plain white or light background. Face should cover 70-80% of the photo.',
    constraint: { format: 'jpeg', min_kb: 10, max_kb: 20, width_cm: 3.5, height_cm: 4.5, bg_color: 'white' },
    persona: { name: 'Priya', age: 22, role: 'Applicant' },
  },
];

export const DIGILOCKER_ASSETS: DigiLockerAsset[] = [
  { id: 'asset-1', name: 'Ramesh_Bank_Passbook.jpg', type: 'image/jpeg', size_mb: 4.2, url: '/assets/ramesh_passbook_raw.jpg', owner: 'ramesh' },
  { id: 'asset-2', name: 'Ramesh_PAN_Card.jpg', type: 'image/jpeg', size_mb: 3.0, url: '/assets/ramesh_pan_card.jpg', owner: 'ramesh' },
  { id: 'asset-3', name: 'Priya_Passport_Photo.jpg', type: 'image/jpeg', size_mb: 5.0, url: '/assets/priya_selfie_raw.jpg', owner: 'priya' },
  { id: 'asset-4', name: 'Priya_Signature.png', type: 'image/png', size_mb: 2.0, url: '/assets/priya_signature_raw.png', owner: 'priya' },
];

export const USER_PROFILES: UserProfile[] = [
  { id: 'user-1', name: 'Ramesh Kumar', mobile: '9876543210', role: 'pensioner', assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'ramesh') },
  { id: 'user-2', name: 'Priya Sharma', mobile: '8765432109', role: 'applicant', assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'priya') },
];

export const WIDGET_STATES = {
  authenticating: { title: 'Connecting to DigiLocker...', subtitle: 'Securely verifying your identity' },
  parsing: { title: 'Analyzing Portal Requirements...', subtitle: 'AI is reading the upload rules' },
  processing: { title: 'Optimizing Document Format...', subtitle: 'Converting and compressing your file' },
} as const;

export const GOV_CONFIG = {
  emblemAlt: 'Emblem of India - Satyameva Jayate',
  mottoHindi: 'सत्यमेव जयते',
  mottoEnglish: 'Truth Alone Triumphs',
  ministry: 'Ministry of Electronics & Information Technology',
} as const;
