import { PortalConfig, UserProfile, DigiLockerAsset } from '@/types';

// Indian Government Portal Design Tokens — matched to live Passport Seva (passportindia.gov.in)
export const COLORS = {
  primary: '#000C80',
  primaryHover: '#071064',
  primaryLight: '#E3EBFC',
  navyDeep: '#0C1364',
  linkBlue: '#007DC5',
  linkHover: '#125699',
  saffron: '#FF9933',
  saffronLight: '#FFF3CD',
  saffronDark: '#E67E22',
  saffronAccent: '#FFB04F',
  green: '#138808',
  greenLight: '#E8F5E9',
  greenDark: '#0D6B07',
  success: '#198754',
  successHover: '#0D6B07',
  successLight: '#E8F5E9',
  legacyBg: '#F8F9FA',
  legacyBorder: '#DEE2E6',
  nspTopBar: '#EDEDED',
  nspStudent: '#F7768D',
  nspInstitute: '#D870C7',
  nspOfficer: '#7E75D0',
  nspPublic: '#36AAC9',
  nspCTA: '#575757',
  nspCTAHover: '#1C5C89',
  nspDeepBlue: '#3F51B5',
  nspDeepBlueDark: '#3949AB',
  nspDeepBlueLight: '#7986CB',
  nspGreen: '#198754',
  nspPinkAccent: '#FF4081',
  nspInputBg: 'rgba(216,216,216,0.31)',
  nspLink: '#106BD8',
  nspFooter: '#D9D9D9',
  nspGradient: 'linear-gradient(90deg, #F7768D 0%, #D870C7 34%, #7E75D0 57.5%, #36AAC9 100%)',
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
  fontFamily: "'Open Sans', Arial, 'Source Sans Pro', sans-serif",
  baseFontSize: '14px',
  headingFamily: "Arial, 'Open Sans', sans-serif",
  nspFont: "'Roboto', Arial, sans-serif",
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
    requirements: 'Upload latest Passport Photo. JPEG only. File size 20KB - 200KB. Pixel dimensions minimum 350 x 350 px, maximum 1000 x 1000 px. Plain white background. Face must cover 3/4th (75%) of the photo. A live photograph must also be captured and matched.',
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
  {
    id: 'passport',
    name: 'Passport Seva - Ministry of External Affairs',
    description: 'Photo & Signature Upload - Fresh Application',
    requirements: 'Passport Seva GPSP upload. Photo exactly 630x810 pixels, JPEG only, 10KB - 250KB, white background, 80-85% face coverage.',
    constraint: { format: 'jpeg', min_kb: 10, max_kb: 250, width_px: 630, height_px: 810, bg_color: 'white' },
    persona: { name: 'Kabir', age: 34, role: 'Traveller' },
  },
  {
    id: 'ssc',
    name: 'SSC - Staff Selection Commission (OTR)',
    description: 'Photo & Signature Upload - CGL Application',
    requirements: 'SSC OTR photo upload. JPEG only, 20KB - 50KB, exactly 200x230 pixels, white background.',
    constraint: { format: 'jpeg', min_kb: 20, max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white' },
    persona: { name: 'Priya', age: 22, role: 'Applicant' },
  },
  {
    id: 'nsp',
    name: 'NSP - National Scholarship Portal (OTR)',
    description: 'Photo & Income Certificate Upload',
    requirements: 'NSP OTR scholarship photo. JPEG only, under 50KB, 200x230 pixels, white background.',
    constraint: { format: 'jpeg', max_kb: 50, width_px: 200, height_px: 230, bg_color: 'white' },
    persona: { name: 'Meera', age: 19, role: 'Student' },
  },
];

export const DIGILOCKER_ASSETS: DigiLockerAsset[] = [
  { id: 'asset-1', name: 'Ramesh_Bank_Passbook.jpg', type: 'image/jpeg', size_mb: 4.2, url: '/assets/ramesh_passbook_raw.jpg', owner: 'ramesh' },
  { id: 'asset-2', name: 'Ramesh_PAN_Card.jpg', type: 'image/jpeg', size_mb: 3.0, url: '/assets/ramesh_pan_card.jpg', owner: 'ramesh' },
  { id: 'asset-3', name: 'Priya_Passport_Photo.jpg', type: 'image/jpeg', size_mb: 5.0, url: '/assets/priya_selfie_raw.jpg', owner: 'priya' },
  { id: 'asset-4', name: 'Priya_Signature.png', type: 'image/png', size_mb: 2.0, url: '/assets/priya_signature_raw.png', owner: 'priya' },
  { id: 'asset-5', name: 'Kabir_PassportPhoto.jpg', type: 'image/jpeg', size_mb: 4.0, url: '/kabir-photo-mb.jpg', owner: 'kabir' },
  { id: 'asset-6', name: 'Kabir_Signature.jpg', type: 'image/jpeg', size_mb: 2.4, url: '/assets/kabir_signature_raw.jpg', owner: 'kabir' },
  { id: 'asset-7', name: 'Meera_Student_Photo.jpg', type: 'image/jpeg', size_mb: 3.8, url: '/assets/meera_photo_raw.jpg', owner: 'meera' },
  { id: 'asset-8', name: 'Meera_IncomeCert_Scan.jpg', type: 'image/jpeg', size_mb: 4.6, url: '/assets/meera_incomecert_raw.jpg', owner: 'meera' },
  { id: 'asset-9', name: 'Ramesh_PassportPhoto.jpg', type: 'image/jpeg', size_mb: 4.4, url: '/elder-photo-mb.jpg', owner: 'ramesh' },
  { id: 'asset-10', name: 'Ramesh_Signature.jpg', type: 'image/jpeg', size_mb: 2.1, url: '/assets/ramesh_signature_raw.jpg', owner: 'ramesh' },
];

export const USER_PROFILES: UserProfile[] = [
  { id: 'user-1', name: 'Ramesh Kumar', mobile: '9876543210', role: 'pensioner', assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'ramesh') },
  { id: 'user-2', name: 'Priya Sharma', mobile: '8765432109', role: 'applicant', assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'priya') },
  { id: 'user-3', name: 'Kabir Mehta', mobile: '9811045678', role: 'applicant', assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'kabir') },
  { id: 'user-4', name: 'Meera Nair', mobile: '9745012365', role: 'applicant', assets: DIGILOCKER_ASSETS.filter(a => a.owner === 'meera') },
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
