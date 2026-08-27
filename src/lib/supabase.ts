import { UserProfile, DigiLockerAsset } from '@/types';
import { USER_PROFILES, DIGILOCKER_ASSETS } from './constants';

// Mock Supabase client for demo purposes
// In production, this would connect to a real Supabase instance

class MockSupabaseClient {
  private users: UserProfile[] = USER_PROFILES;
  private assets: DigiLockerAsset[] = DIGILOCKER_ASSETS;
  private currentUser: UserProfile | null = null;

  // Prototype authentication - accept any 10-digit identifier
  async signInWithAadhaarLikeId(identifier: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!/^\d{10}$/.test(identifier)) {
      return { success: false, error: 'Please enter a valid 10-digit number.' };
    }

    const user = this.users[0];
    this.currentUser = user;
    return { success: true, user };
  }

  // Mock OTP verification
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

  // Fetch asset (mock - returns a generated image)
  async fetchAsset(assetId: string): Promise<Blob> {
    const asset = this.assets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');

    // Generate a mock image based on the asset
    return this.generateMockImage(asset);
  }

  private async generateMockImage(asset: DigiLockerAsset): Promise<Blob> {
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
export const supabase = new MockSupabaseClient();
