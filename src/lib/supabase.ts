import { UserProfile, DigiLockerAsset } from '@/types';
import { USER_PROFILES, DIGILOCKER_ASSETS } from './constants';

// DigiLocker client — handles consent-based document access

const SAVED_KEY = 'docbridge-saved-vault';

// Dedupe key for optimized copies: one copy per source document per portal.
// Re-optimizing the same doc for the same portal replaces the old copy.
function savedKey(a: Pick<DigiLockerAsset, 'owner' | 'name' | 'optimizedFor'>): string {
  return `${a.owner}|${a.name}|${a.optimizedFor ?? ''}`;
}

function loadSavedAssets(): DigiLockerAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const list = raw ? (JSON.parse(raw) as DigiLockerAsset[]) : [];
    // Clean up duplicates left by earlier versions (keep the newest).
    const byKey = new Map<string, DigiLockerAsset>();
    for (const a of list) byKey.set(savedKey(a), a);
    return Array.from(byKey.values());
  } catch {
    return [];
  }
}

function persistSavedAssets(list: DigiLockerAsset[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch {
    // Quota exceeded (large PDFs) — keep only in-memory for this session.
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Optimized copies saved back to the vault, kept across page navigations.
const savedVault: DigiLockerAsset[] = loadSavedAssets();

class DigiLockerClient {
  private users: UserProfile[] = USER_PROFILES;
  private assets: DigiLockerAsset[] = DIGILOCKER_ASSETS;
  private currentUser: UserProfile | null = null;

  // Authenticate with Aadhaar-linked identifier
  async signInWithAadhaarLikeId(identifier: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!/^\d{10}$/.test(identifier)) {
      return { success: false, error: 'Please enter a valid 10-digit number.' };
    }

    const user = this.users[0];
    this.currentUser = user;
    return { success: true, user };
  }

  // Sign in as a specific profile (matches the portal journey)
  async signInAs(firstName: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = this.users.find(u => u.name.toLowerCase().startsWith(firstName.toLowerCase())) || this.users[0];
    this.currentUser = user;
    return { success: true, user };
  }

  // OTP verification
  async verifyOTP(otp: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Accept any 6-digit OTP for demo
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP. Please enter a 6-digit code.' };
  }

  // Get current user's DigiLocker assets — only this citizen's issued documents.
  getAssets(): DigiLockerAsset[] {
    if (!this.currentUser) return [];
    const owner = this.ownerKey();
    return this.assets.filter(a => a.owner === owner && a.source !== 'optimized');
  }

  // Full vault for the picker: DocBridge-optimized copies first (reusable on
  // other portals), then this citizen's original issued documents.
  getVaultWithSaved(): DigiLockerAsset[] {
    if (!this.currentUser) return [];
    const owner = this.ownerKey();
    const issued = this.assets.filter(a => a.owner === owner && a.source !== 'optimized');
    const saved = savedVault.filter(a => a.owner === owner);
    return [...saved, ...issued];
  }

  // First name of the signed-in citizen = the vault owner key.
  private ownerKey(): 'ramesh' | 'priya' | 'kabir' | 'meera' {
    const first = this.currentUser?.name.toLowerCase().split(' ')[0] as 'ramesh' | 'priya' | 'kabir' | 'meera';
    return first || 'priya';
  }

  // Get current user
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Sign out
  signOut(): void {
    this.currentUser = null;
  }

  // Fetch asset from DigiLocker — returns the real persisted bytes for saved
  // optimized copies, or a synthesized document/photo for issued ones.
  async fetchAsset(assetId: string): Promise<Blob> {
    const saved = savedVault.find(a => a.id === assetId && !!a.dataUrl);
    if (saved?.dataUrl) {
      try {
        return await (await fetch(saved.dataUrl)).blob();
      } catch {
        // fall through to issuer synthesis
      }
    }
    const asset = this.assets.find(a => a.id === assetId) || savedVault.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');

    // Generate document image from asset
    return this.generateDocumentImage(asset);
  }

  // Fetch several assets in parallel, resolving in the requested order.
  async fetchAssets(assetIds: string[]): Promise<Blob[]> {
    return Promise.all(assetIds.map((id) => this.fetchAsset(id)));
  }

  // Store an optimized copy back into the citizen's DigiLocker vault so it
  // is ready for reuse on other portals. The real bytes are persisted as a
  // data-url (mock), and the record is auto-tagged with the portal it was
  // optimized for. Returns the stored asset record.
  async storeAsset(args: { name: string; type: string; blob: Blob; portalId: string; portalName: string; tags?: string[] }): Promise<DigiLockerAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const blob = args.blob;
    const sizeKb = Math.round(blob.size / 1024);
    const asset: DigiLockerAsset = {
      id: `dl-optimized-${Date.now()}`,
      name: args.name,
      type: args.type,
      size_mb: blob.size / (1024 * 1024),
      url: '',
      owner: this.ownerKey(),
      source: 'optimized',
      optimizedFor: args.portalName,
      tags: ['optimized', ...(args.tags ?? [])],
      dataUrl: await blobToDataUrl(blob),
      processedAt: new Date().toISOString(),
    };

    // Upsert: re-saving the same document for the same portal replaces the
    // existing optimized copy instead of piling up duplicates.
    const key = savedKey(asset);
    const idx = savedVault.findIndex(a => savedKey(a) === key);
    if (idx >= 0) savedVault[idx] = asset;
    else savedVault.unshift(asset);
    persistSavedAssets(savedVault);
    return asset;
  }

  // Demo helper — wipes all DocBridge-saved optimized copies so the journey
  // can be re-run from a clean "advantage not earned yet" state.
  resetSavedVault(): void {
    savedVault.length = 0;
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(SAVED_KEY); } catch { /* ignore */ }
    }
  }

  private async generateDocumentImage(asset: DigiLockerAsset): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Set dimensions based on asset type
    if (asset.name.includes('passbook')) {
      canvas.width = 2400;
      canvas.height = 3200;
    } else if (asset.name.includes('selfie') || asset.name.includes('Photo')) {
      canvas.width = 3000;
      canvas.height = 4000;
    } else if (asset.name.includes('Signature')) {
      canvas.width = 2400;
      canvas.height = 800;
    } else if (asset.name.includes('Cert')) {
      canvas.width = 2400;
      canvas.height = 3200;
    } else {
      canvas.width = 2000;
      canvas.height = 2500;
    }

    // Draw a realistic-looking document/photo
    if (asset.name.includes('PassportPhoto') || asset.name.includes('Passport_Photo')) {
      // Passport avatar mock (flat-vector portrait on white): deliberately
      // oversized + film grain so the raw JPEG weighs 4MB+ — the "before"
      // half of the Before/After compression story.
      canvas.width = 2400;
      canvas.height = 3200;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = 1200;
      // Shoulders / navy blazer
      ctx.fillStyle = '#1f3a7a';
      ctx.beginPath();
      ctx.moveTo(cx - 800, 3200);
      ctx.bezierCurveTo(cx - 780, 2350, cx - 550, 2150, cx - 260, 2080);
      ctx.lineTo(cx - 180, 2350);
      ctx.lineTo(cx - 120, 3200);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 800, 3200);
      ctx.bezierCurveTo(cx + 780, 2350, cx + 550, 2150, cx + 260, 2080);
      ctx.lineTo(cx + 180, 2350);
      ctx.lineTo(cx + 120, 3200);
      ctx.closePath();
      ctx.fill();
      // Lapels
      ctx.fillStyle = '#172c5e';
      ctx.beginPath();
      ctx.moveTo(cx - 260, 2080);
      ctx.lineTo(cx - 40, 2500);
      ctx.lineTo(cx - 180, 2350);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 260, 2080);
      ctx.lineTo(cx + 40, 2500);
      ctx.lineTo(cx + 180, 2350);
      ctx.closePath();
      ctx.fill();
      // White shirt V
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      ctx.moveTo(cx - 180, 2350);
      ctx.lineTo(cx, 2800);
      ctx.lineTo(cx + 180, 2350);
      ctx.lineTo(cx + 40, 2500);
      ctx.lineTo(cx, 2440);
      ctx.lineTo(cx - 40, 2500);
      ctx.closePath();
      ctx.fill();
      // Neck
      ctx.fillStyle = '#f2b88a';
      ctx.fillRect(cx - 130, 1780, 260, 380);
      // Ears
      ctx.fillStyle = '#f7c194';
      ctx.beginPath();
      ctx.ellipse(cx - 430, 1150, 70, 130, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 430, 1150, 70, 130, 0, 0, Math.PI * 2);
      ctx.fill();
      // Face
      ctx.beginPath();
      ctx.ellipse(cx, 1050, 430, 560, 0, 0, Math.PI * 2);
      ctx.fill();
      // Hair cap
      ctx.fillStyle = '#5a2d16';
      ctx.beginPath();
      ctx.ellipse(cx, 680, 450, 330, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(cx - 450, 660, 90, 320);
      ctx.fillRect(cx + 360, 660, 90, 320);
      // Film grain — flat vector compresses too well; noise guarantees 4MB+.
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = img.data;
      for (let i = 0; i < px.length; i += 4) {
        const n = (Math.random() - 0.5) * 24;
        px[i] += n;
        px[i + 1] += n;
        px[i + 2] += n;
      }
      ctx.putImageData(img, 0, 0);
    } else if (asset.name.includes('passbook')) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      ctx.fillStyle = '#0056B3';
      ctx.fillRect(0, 0, canvas.width, 300);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 72px Arial';
      ctx.fillText('STATE BANK OF INDIA', 100, 200);
      
      // Account details
      ctx.fillStyle = '#374151';
      ctx.font = '48px Arial';
      ctx.fillText('Account Number: 3847 2910 5678', 100, 500);
      ctx.fillText('Name: RAMESH KUMAR', 100, 600);
      ctx.fillText('Branch: MAIN BRANCH', 100, 700);
      
      // Transaction lines
      ctx.font = '36px Arial';
      for (let i = 0; i < 15; i++) {
        const y = 900 + i * 120;
        ctx.fillText(`01/01/2024  Pension Credit  +₹15,000.00`, 100, y);
        ctx.strokeStyle = '#E5E7EB';
        ctx.beginPath();
        ctx.moveTo(100, y + 20);
        ctx.lineTo(2300, y + 20);
        ctx.stroke();
      }
    } else if (asset.name.includes('selfie') || asset.name.includes('Photo')) {
      // Studio portrait on plain white — must match the validated "Background: white" rule
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Person silhouette
      ctx.fillStyle = '#FFDAB9';
      ctx.beginPath();
      ctx.arc(1500, 1200, 400, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(1100, 1600, 800, 1200);
      
      // Hair
      ctx.fillStyle = '#2F1B14';
      ctx.beginPath();
      ctx.arc(1500, 1000, 450, Math.PI, 0);
      ctx.fill();
    } else if (asset.name.includes('Signature')) {
      // Handwritten signature on white paper (wide strip)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(300, 550);
      ctx.bezierCurveTo(600, 200, 800, 650, 1100, 400);
      ctx.bezierCurveTo(1300, 220, 1450, 600, 1700, 420);
      ctx.bezierCurveTo(1850, 320, 1950, 500, 2100, 430);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1050, 400);
      ctx.lineTo(1150, 650);
      ctx.stroke();
    } else if (asset.name.includes('Cert')) {
      // Income certificate scan
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#9e9e9e';
      ctx.lineWidth = 6;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
      ctx.fillStyle = '#0b3c92';
      ctx.font = 'bold 72px Arial';
      ctx.fillText('INCOME CERTIFICATE', 200, 280);
      ctx.fillStyle = '#374151';
      ctx.font = '48px Arial';
      ctx.fillText('State Government — Office of the Tehsildar', 200, 420);
      ctx.fillText('Annual Family Income: Rs. 96,000/-', 200, 560);
      ctx.fillText('Valid for financial year 2026-27', 200, 660);
      ctx.font = '44px Arial';
      for (let i = 0; i < 10; i++) {
        ctx.fillText('Certified that the above details are verified from revenue records.', 200, 860 + i * 90);
      }
      ctx.fillStyle = '#0d6b07';
      ctx.font = 'bold 52px Arial';
      ctx.fillText('Stamp & Signature of Issuing Authority', 200, canvas.height - 300);
      ctx.strokeStyle = '#0d6b07';
      ctx.beginPath();
      ctx.ellipse(1900, canvas.height - 350, 220, 130, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Generic document
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 64px Arial';
      ctx.fillText('IDENTITY CARD', 100, 200);
      
      ctx.font = '48px Arial';
      ctx.fillText('Name: RAMESH KUMAR', 100, 400);
      ctx.fillText('ID: ABC123456', 100, 500);
    }

    // Convert canvas to blob — passport avatar mocks keep full quality so
    // the raw file genuinely weighs megabytes (the compression demo).
    const quality = asset.name.includes('PassportPhoto') || asset.name.includes('Passport_Photo') ? 1.0 : 0.95;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, asset.type, quality);
    });
  }
}

// Singleton instance
export const supabase = new DigiLockerClient();
