export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  iconName: string; // 'computer' | 'coins' | 'terminal' | 'shield' | 'rocket' | 'robot' | 'cpu' | 'database' | 'globe'
  codeBlock?: string;
  keyPoints?: string[];
  accentColor?: string; // 'cyan' | 'emerald' | 'purple' | 'amber' | 'crimson'
}

export type AspectRatio = '1:1' | '16:9' | '4:5';

export interface EditorSettings {
  aspectRatio: AspectRatio;
  glowIntensity: 'low' | 'medium' | 'high';
  showGridLines: boolean;
  showStarryDots: boolean;
  stickerRotation: number;
  stickerSize: number;
  showSticker: boolean;
  customLogoUrl?: string;
}
