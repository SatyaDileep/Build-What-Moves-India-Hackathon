export interface DocumentConstraint {
  format: 'pdf' | 'jpeg' | 'png';
  min_kb?: number;
  max_kb?: number;
  width_cm?: number;
  height_cm?: number;
  bg_color?: string;
  additional_requirements?: string[];
}

export interface DigiLockerAsset {
  id: string;
  name: string;
  type: string;
  size_mb: number;
  url: string;
  owner: 'ramesh' | 'priya';
}

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  role: 'pensioner' | 'applicant';
  assets: DigiLockerAsset[];
}

export interface ProcessingResult {
  success: boolean;
  original: {
    blob: Blob;
    size_mb: number;
    dimensions?: { width: number; height: number };
    assetName?: string;
    assetType?: string;
  };
  processed: {
    blob: Blob;
    size_kb: number;
    dimensions?: { width: number; height: number };
  };
  constraint: DocumentConstraint;
}

export interface PortalConfig {
  id: 'epfo' | 'upsc' | 'vahan';
  name: string;
  description: string;
  requirements: string;
  constraint: DocumentConstraint;
  persona: {
    name: string;
    age: number;
    role: string;
  };
}

export type WidgetState = 
  | 'idle'
  | 'authenticating'
  | 'selecting'
  | 'parsing'
  | 'processing'
  | 'previewing'
  | 'submitting'
  | 'success'
  | 'error';
