import { PortalConfig, UserProfile, DigiLockerAsset } from '@/types';

// Design Tokens
export const COLORS = {
  primary: '#0056B3',
  primaryHover: '#004A99',
  primaryLight: '#E6F0FF',
  success: '#10B981',
  successHover: '#059669',
  successLight: '#D1FAE5',
  legacyBg: '#F9FAFB',
  legacyBorder: '#E5E7EB',
  legacyText: '#374151',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#111827',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'Inter, system-ui, sans-serif',
  baseFontSize: '16px',
  headingSizes: {
    h1: '36px',
    h2: '30px',
    h3: '24px',
    h4: '20px',
  }
} as const;

// Portal Configurations
export const PORTALS: PortalConfig[] = [
  {
    id: 'epfo',
    name: 'EPFO - Employees Provident Fund Organization',
    description: 'Update KYC / Passbook',
    requirements: 'Upload Passbook copy. Must be PDF format. Maximum size 500 KB. Account number must be visible.',
    constraint: {
      format: 'pdf',
      max_kb: 500,
    },
    persona: {
      name: 'Ramesh',
      age: 68,
      role: 'Pensioner',
    },
  },
  {
    id: 'upsc',
    name: 'UPSC / State PSC Job Application Portal',
    description: 'Document Upload - Passport Photo',
    requirements: 'Upload Passport Photo. JPEG only. Size 20KB - 50KB. Dimensions strictly 3.5cm width x 4.5cm height. White background.',
    constraint: {
      format: 'jpeg',
      min_kb: 20,
      max_kb: 50,
      width_cm: 3.5,
      height_cm: 4.5,
      bg_color: 'white',
    },
    persona: {
      name: 'Priya',
      age: 22,
      role: 'Applicant',
    },
  },
];

// Mock DigiLocker Assets
export const DIGILOCKER_ASSETS: DigiLockerAsset[] = [
  {
    id: 'asset-1',
    name: 'ramesh_passbook_raw.jpg',
    type: 'image/jpeg',
    size_mb: 4.2,
    url: '/assets/ramesh_passbook_raw.jpg',
    owner: 'ramesh',
  },
  {
    id: 'asset-2',
    name: 'ramesh_pan_card.jpg',
    type: 'image/jpeg',
    size_mb: 3.0,
    url: '/assets/ramesh_pan_card.jpg',
    owner: 'ramesh',
  },
  {
    id: 'asset-3',
    name: 'priya_selfie_raw.jpg',
    type: 'image/jpeg',
    size_mb: 5.0,
    url: '/assets/priya_selfie_raw.jpg',
    owner: 'priya',
  },
  {
    id: 'asset-4',
    name: 'priya_signature_raw.png',
    type: 'image/png',
    size_mb: 2.0,
    url: '/assets/priya_signature_raw.png',
    owner: 'priya',
  },
];

// Mock User Profiles
export const USER_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    role: 'pensioner',
    assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'ramesh'),
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    mobile: '8765432109',
    role: 'applicant',
    assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'priya'),
  },
];

// Widget States Configuration
export const WIDGET_STATES = {
  authenticating: {
    title: 'Connecting to DigiLocker...',
    subtitle: 'Securely verifying your identity',
  },
  parsing: {
    title: 'Analyzing Portal Requirements...',
    subtitle: 'AI is reading the upload rules',
  },
  processing: {
    title: 'Optimizing Document Format...',
    subtitle: 'Converting and compressing your file',
  },
} as const;
