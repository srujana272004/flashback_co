export interface PhotoTemplate {
  id: string;
  name: string;
  slots: number;
  layout: 'single' | 'double' | 'strip' | 'polaroid';
  dimensions: {
    width: number;
    height: number;
    cols: number;
    rows: number;
  };
  outputWidth: number;
  outputHeight: number;
  image?: string;
  photoSlots: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  texts?: Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color?: string;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    backgroundColor?: string;
  }>;
}

export interface CapturedPhoto {
  id: string;
  imageData: string;
  timestamp: number;
}

export interface PhotoSession {
  template: PhotoTemplate;
  photos: CapturedPhoto[];
  currentSlot: number;
  isComplete: boolean;
}

export type AppState =
  | 'landing'
  | 'template-selection'
  | 'camera-setup'
  | 'countdown'
  | 'capturing'
  | 'preview'
  | 'filter-selection'
  | 'final-preview'
  | 'camera-error'
  | 'printing'
  | 'developing';

export type FilterType = 'vintage' | 'sepia' | 'black-white' | 'warm' | 'cool' | 'original' | 'double-exposure' | 'light-leak' | 'film-burn';

export interface VintageSticker {
  id: string;
  name: string;
  type: 'text' | 'decoration' | 'frame';
  content: string;
  style: {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    rotation?: number;
    opacity?: number;
  };
}

export interface PhotoCaption {
  id: string;
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: string;
    fontFamily: string;
    color: string;
    rotation: number;
  };
}