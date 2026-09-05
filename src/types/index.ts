export interface DocumentConstraint {
  format: 'pdf' | 'jpeg' | 'png';
  min_kb?: number;
  max_kb?: number;
  width_cm?: number;
  height_cm?: number;
  width_px?: number;
  height_px?: number;
  bg_color?: string;
  additional_requirements?: string[];
}

export interface DigiLockerAsset {
  id: string;
  name: string;
  type: string;
  size_mb: number;
  url: string;
  owner: 'ramesh' | 'priya' | 'kabir' | 'meera';
  // DocBridge optimization metadata for copies saved back into the vault —
  // lets the same citizen reuse an already-optimized document on other portals.
  source?: 'issued' | 'optimized';
  optimizedFor?: string;
  tags?: string[];
  dataUrl?: string;
  processedAt?: string;
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
    warning?: string;
    wasScaled?: boolean;
  };
  constraint: DocumentConstraint;
}

export interface PortalConfig {
  id: 'epfo' | 'upsc' | 'vahan' | 'passport' | 'ssc' | 'nsp';
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
  | 'previewing_batch'
  | 'submitting'
  | 'success'
  | 'error';

// A single document queued inside a batch. `docType` maps to the portal slot
// (photo / signature / income / passbook) and is routed to the matching
// legacy-* endpoint on submit.
export interface BatchItem {
  id: string;
  name: string;
  type: string;
  blob: Blob;
  size_mb: number;
  docType: 'photo' | 'signature' | 'income' | 'passbook' | 'other';
  result?: ProcessingResult;
  status: 'queued' | 'processing' | 'done' | 'error';
  error?: string;
  submitted?: boolean;
  submitError?: string;
}

export interface BatchSubmitResult {
  id: string;
  name: string;
  success: boolean;
  error?: string;
}
