import { FilterType } from '../types';

// Advanced photo effects utilities

export const applyDoubleExposure = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlayImageData?: ImageData
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Create a dreamy double exposure effect
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Blend with a shifted version of itself
    const shiftX = Math.sin(i / 1000) * 20;
    const shiftY = Math.cos(i / 1000) * 20;
    
    // Create ethereal blending
    data[i] = Math.min(255, r * 0.7 + g * 0.3);
    data[i + 1] = Math.min(255, g * 0.8 + b * 0.2);
    data[i + 2] = Math.min(255, b * 0.9 + r * 0.1);
    
    // Add transparency for overlay effect
    data[i + 3] = Math.min(255, data[i + 3] * 0.85);
  }

  ctx.putImageData(imageData, 0, 0);
};

export const applyLightLeak = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  // Save the current composite operation
  const originalCompositeOperation = ctx.globalCompositeOperation;
  
  // Create realistic light leak effects
  const leakCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < leakCount; i++) {
    // Position leaks at edges and corners
    const side = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;
    
    switch (side) {
      case 0: // Top
        startX = Math.random() * width;
        startY = 0;
        endX = startX + (Math.random() - 0.5) * width * 0.4;
        endY = Math.random() * height * 0.5;
        break;
      case 1: // Right
        startX = width;
        startY = Math.random() * height;
        endX = width - Math.random() * width * 0.5;
        endY = startY + (Math.random() - 0.5) * height * 0.4;
        break;
      case 2: // Bottom
        startX = Math.random() * width;
        startY = height;
        endX = startX + (Math.random() - 0.5) * width * 0.4;
        endY = height - Math.random() * height * 0.5;
        break;
      default: // Left
        startX = 0;
        startY = Math.random() * height;
        endX = Math.random() * width * 0.5;
        endY = startY + (Math.random() - 0.5) * height * 0.4;
        break;
    }
    
    const gradient = ctx.createRadialGradient(
      startX,
      startY,
      0,
      endX,
      endY,
      Math.random() * 200 + 100
    );

    // Realistic film light leak colors
    const colors = [
      'rgba(255, 180, 80, 0.2)',
      'rgba(255, 120, 60, 0.18)',
      'rgba(255, 200, 120, 0.15)',
      'rgba(255, 140, 100, 0.17)',
      'rgba(255, 160, 90, 0.16)'
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color.replace(/[\d\.]+\)$/g, '0.08)'));
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  // Restore original composite operation
  ctx.globalCompositeOperation = originalCompositeOperation;
};

export const applyFilmBurn = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Create film burn effect around edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      
      // Calculate distance from edges
      const edgeDistance = Math.min(x, y, width - x, height - y);
      const burnIntensity = Math.max(0, 1 - edgeDistance / 50);
      
      if (burnIntensity > 0) {
        // Apply burn effect
        data[i] = Math.min(255, data[i] + burnIntensity * 100); // Red
        data[i + 1] = Math.max(0, data[i + 1] - burnIntensity * 50); // Green
        data[i + 2] = Math.max(0, data[i + 2] - burnIntensity * 80); // Blue
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const addVintageStickers = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stickers: string[]
): void => {
  const stickerTexts = [
    '★ MEMORIES ★',
    '♡ VINTAGE ♡',
    '✨ RETRO ✨',
    '◆ CLASSIC ◆',
    '♪ NOSTALGIA ♪'
  ];

  stickers.forEach((sticker, index) => {
    ctx.save();
    
    // Random position and rotation
    const x = Math.random() * (width - 100) + 50;
    const y = Math.random() * (height - 50) + 25;
    const rotation = (Math.random() - 0.5) * 0.3;
    
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Vintage sticker style
    ctx.fillStyle = 'rgba(139, 115, 85, 0.8)';
    ctx.font = 'bold 12px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText(stickerTexts[index % stickerTexts.length], 0, 0);
    
    ctx.restore();
  });
};

export const addHandwrittenCaption = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  caption: string
): void => {
  ctx.save();
  
  // Position at bottom of photo
  const x = width / 2;
  const y = height - 20;
  
  // Handwritten style
  ctx.fillStyle = 'rgba(139, 115, 85, 0.9)';
  ctx.font = 'italic 14px "Crimson Text", serif';
  ctx.textAlign = 'center';
  
  // Add slight rotation for handwritten feel
  ctx.translate(x, y);
  ctx.rotate((Math.random() - 0.5) * 0.1);
  
  ctx.fillText(caption, 0, 0);
  
  ctx.restore();
};