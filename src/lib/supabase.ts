import { UserProfile, DigiLockerAsset } from '@/types';
import { USER_PROFILES, DIGILOCKER_ASSETS } from './constants';

// DigiLocker client — handles consent-based document access

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

  // Get current user's DigiLocker assets
  getAssets(): DigiLockerAsset[] {
    if (!this.currentUser) return [];
    return this.assets;
  }

  // Get current user
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Sign out
  signOut(): void {
    this.currentUser = null;
  }

  // Fetch asset from DigiLocker
  async fetchAsset(assetId: string): Promise<Blob> {
    const asset = this.assets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');

    // Generate document image from asset
    return this.generateDocumentImage(asset);
  }

  // Store an optimized copy back into the citizen's DigiLocker vault so it
  // is ready for reuse on other portals. Returns the stored asset record.
  async storeAsset(name: string, type: string, size_mb: number): Promise<DigiLockerAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const asset: DigiLockerAsset = {
      id: `dl-optimized-${Date.now()}`,
      name,
      type,
      size_mb,
      url: '', // optimized copy is held locally/in-browser
      owner: 'priya',
    };

    this.assets.unshift(asset);
    return asset;
  }

  private async generateDocumentImage(asset: DigiLockerAsset): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Set dimensions based on asset type
    if (asset.name.includes('passbook')) {
      canvas.width = 2400;
      canvas.height = 3200;
    } else if (asset.name.includes('selfie')) {
      canvas.width = 3000;
      canvas.height = 4000;
    } else {
      canvas.width = 2000;
      canvas.height = 2500;
    }

    // Draw a realistic-looking document/photo
    if (asset.name.includes('passbook')) {
      // Bank passbook
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
    } else if (asset.name.includes('selfie')) {
      // Photo with background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(0.5, '#90EE90');
      gradient.addColorStop(1, '#228B22');
      ctx.fillStyle = gradient;
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

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, asset.type, 0.95);
    });
  }
}

// Singleton instance
export const supabase = new DigiLockerClient();
