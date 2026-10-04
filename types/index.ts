export type FloralSymbol = '🌸' | '🌹' | '🪻' | '🌼' | '🪷' | '🦋' | '🌿' | '🎀' | '✨';

export type PastelPalette = 'sakura' | 'rose' | 'lavender' | 'daisy' | 'sage' | 'peach';

export interface Char {
  id: string;
  name: string;
  tags: string[];
  slogan: string;
  backstory: string;
  firstMessage: string;
  googleAIStudioURL: string;
  locked: boolean;
  lockQuestion?: string;
  lockHint?: string;
  lockPass?: string;
  floralSymbol?: FloralSymbol;
  accentColor?: PastelPalette;
  createdAt: string;
  updatedAt: string;
}

export interface Recipient {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'busy' | 'resting';
  symbol: FloralSymbol;
  createdAt: string;
}

export interface Letter {
  id: string;
  recipientId: string;
  recipientName: string;
  senderName: string;
  title: string;
  content: string;
  stamp: string;
  status: 'sent' | 'read';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  slogan: string;
  aboutText: string;
  youtubeUrl: string;
  musicEnabled: boolean;
  musicVolume: number;
  activeTheme: 'random' | 'sakura' | 'rose' | 'lavender' | 'daisy' | 'sage';
  fallingLeavesSpeed: 'slow' | 'normal' | 'paused';
  butterfliesEnabled: boolean;
  petalsEnabled: boolean;
  adminPass: string;
}

export interface PublicCharView {
  id: string;
  name: string;
  tags: string[];
  slogan: string;
  locked: boolean;
  lockQuestion?: string;
  lockHint?: string;
  floralSymbol?: FloralSymbol;
  accentColor?: PastelPalette;
  createdAt: string;
  updatedAt: string;
  // Included only if unlocked
  backstory?: string;
  firstMessage?: string;
  googleAIStudioURL?: string;
}
