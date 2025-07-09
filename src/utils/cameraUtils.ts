import { FilterType } from '../types';
import { applyDoubleExposure, applyLightLeak, applyFilmBurn } from './effectsUtils';

export const getCameraStream = async (): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw new Error('Unable to access camera. Please check permissions.');
  }
};

export const stopCameraStream = (stream: MediaStream | null): void => {
  if (stream && typeof stream.getTracks === 'function') {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const capturePhoto = (
  videoElement: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  filter: FilterType = 'original'
): string => {
  console.log('capturePhoto called with:', {
    videoWidth: videoElement.videoWidth,
    videoHeight: videoElement.videoHeight,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    readyState: videoElement.readyState
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Canvas context not available');
    throw new Error('Canvas context not available');
  }

  // Set canvas size to match video
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  console.log('Canvas dimensions set to:', {
    width: canvas.width,
    height: canvas.height
  });

  if (canvas.width === 0 || canvas.height === 0) {
    console.error('Canvas dimensions are zero after setting from video');
    throw new Error('Invalid video dimensions - cannot capture photo');
  }

  // Save the context state
  ctx.save();
  
  // Flip the canvas horizontally to correct the mirror effect
  ctx.scale(-1, 1);
  ctx.translate(-canvas.width, 0);
  
  // Draw video frame to canvas (this will now be un-mirrored)
  ctx.drawImage(videoElement, 0, 0);
  
  // Restore the context state
  ctx.restore();

  // Apply filter if specified
  if (filter !== 'original') {
    applyFilter(ctx, canvas.width, canvas.height, filter);
  }

  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  console.log('Photo capture completed, dataUrl length:', dataUrl.length);
  return dataUrl;
};

export const applyFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: FilterType
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  switch (filter) {
    case 'vintage':
      applyVintageFilter(data);
      break;
    case 'sepia':
      applySepiaFilter(data);
      break;
    case 'black-white':
      applyBlackWhiteFilter(data);
      break;
    case 'warm':
      applyWarmFilter(data);
      break;
    case 'cool':
      applyCoolFilter(data);
      break;
    case 'double-exposure':
      ctx.putImageData(imageData, 0, 0);
      applyDoubleExposure(ctx, width, height);
      return;
    case 'light-leak':
      ctx.putImageData(imageData, 0, 0);
      applyLightLeak(ctx, width, height);
      return;
    case 'film-burn':
      ctx.putImageData(imageData, 0, 0);
      applyFilmBurn(ctx, width, height);
      return;
    default:
      break;
  }

  // Add subtle noise/grain for vintage feel (except for original)
  if (filter !== 'original') {
    addGrain(data);
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyVintageFilter = (data: Uint8ClampedArray): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Vintage: Faded, slightly warm with reduced contrast
    data[i] = Math.min(255, (r * 0.9) + (g * 0.1) + 20); // Warm reds
    data[i + 1] = Math.min(255, (r * 0.2) + (g * 0.8) + 15); // Slightly faded greens
    data[i + 2] = Math.min(255, (r * 0.1) + (g * 0.1) + (b * 0.7) + 10); // Reduced blues
    
    // Reduce overall contrast for faded look
    data[i] = Math.min(255, data[i] * 0.85 + 30);
    data[i + 1] = Math.min(255, data[i + 1] * 0.85 + 25);
    data[i + 2] = Math.min(255, data[i + 2] * 0.85 + 20);
  }
};

const applySepiaFilter = (data: Uint8ClampedArray): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Traditional sepia with stronger brown tones
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }
};

const applyBlackWhiteFilter = (data: Uint8ClampedArray): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Luminance formula for B&W
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
};

const applyWarmFilter = (data: Uint8ClampedArray): void => {
  for (let i = 0; i < data.length; i += 4) {
    // Enhance reds and yellows, reduce blues
    data[i] = Math.min(255, data[i] * 1.1); // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Green
    data[i + 2] = Math.max(0, data[i + 2] * 0.9); // Blue
  }
};

const applyCoolFilter = (data: Uint8ClampedArray): void => {
  for (let i = 0; i < data.length; i += 4) {
    // Enhance blues, reduce reds
    data[i] = Math.max(0, data[i] * 0.9); // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.0); // Green
    data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
  }
};

const addGrain = (data: Uint8ClampedArray): void => {
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 25;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
};