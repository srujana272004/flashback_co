import { PhotoTemplate, CapturedPhoto, FilterType } from '../types';
import { applyFilter } from './cameraUtils'; // Assuming applyFilter is here. Consider moving to imageFilters.ts for clarity.

// Helper to load images
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
}

/**
 * Creates a composite image from captured photos and a template.
 * @param template The photo template including layout, dimensions, image path, slots, and text definitions.
 * @param photos An array of captured photo data (imageData URLs).
 * @param filter The filter to apply to the composite image.
 * @param stickers Optional array of sticker texts to add.
 * @param caption Optional handwritten caption to add.
 * @returns A Promise that resolves with the data URL of the composite image.
 */
export const createCompositeImage = async (
  template: PhotoTemplate,
  photos: CapturedPhoto[],
  filter: FilterType = 'original'
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Set canvas dimensions based on the template's output dimensions
  canvas.width = template.outputWidth;
  canvas.height = template.outputHeight;

  // Clear canvas for fresh drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw the template's base image (e.g., Polaroid frame, strip background)
  // This image should contain the background, borders, and transparent slots for photos.
  if (template.image) {
    try {
      const templateImg = await loadImage(template.image);
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error('Error loading template base image:', error);
      // Fallback: fill with a default background if template image fails
      ctx.fillStyle = '#f4f1e8'; // Fallback cream color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    // If no template image specified, fill with a default background
    ctx.fillStyle = '#f4f1e8'; // Default cream color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 2. Draw the captured photos into their designated slots
  // Photos should be drawn in the order they were captured.
  for (let i = 0; i < photos.length && i < template.photoSlots.length; i++) {
    const photo = photos[i];
    const slot = template.photoSlots[i];

    const img = await loadImage(photo.imageData);

    // Calculate aspect ratios for fitting/cropping
    const imgAspect = img.width / img.height;
    const slotAspect = slot.width / slot.height;

    let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height; // Source image coordinates
    let dx = slot.x, dy = slot.y, dWidth = slot.width, dHeight = slot.height; // Destination canvas coordinates

    // Center crop to fill the slot while maintaining aspect ratio
    if (imgAspect > slotAspect) {
      sWidth = img.height * slotAspect;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / slotAspect;
      sy = (img.height - sHeight) / 2;
    }

    // Draw the image into the slot
    // The horizontal flip (mirroring) should ideally happen during capturePhoto in cameraUtils.ts
    // If it's still flipped here, apply transform:
    // ctx.save();
    // ctx.translate(dx + dWidth, dy); // Move origin to right edge of slot
    // ctx.scale(-1, 1); // Flip horizontally
    // ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight); // Draw at new origin
    // ctx.restore();

    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }


  // 3. Add date and time at the bottom of the photo for all templates
  // Apply the selected filter to the entire composite image BEFORE adding text
  if (filter !== 'original') {
    applyFilter(ctx, canvas.width, canvas.height, filter);
  }

  // 4. Add date and time at the bottom of the photo for all templates
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateTimeStr = `${dateStr} ${timeStr}`;

  // Create a temporary text definition for the date/time
  const dateTimeTextDef = {
    id: 'datetime',
    text: dateTimeStr,
    x: canvas.width / 2, // Centered
    y: template.outputHeight - 30, // Adjusted position, assuming space at bottom
    fontSize: 16, // Smaller, more natural size
    color: '#333333', // Dark text color
    fontFamily: 'Courier New, monospace', // Typewriter font
    fontWeight: 'normal',
    fontStyle: 'normal',
    align: 'center' as CanvasTextAlign,
    baseline: 'middle' as CanvasTextBaseline,
  };

  // Combine template's predefined texts with the dynamic date/time
  const allTexts = [...(template.texts || []), dateTimeTextDef];

  // 5. Draw all text elements on top
  allTexts.forEach(textDef => {
    ctx.font = `${textDef.fontStyle || ''} ${textDef.fontWeight || ''} ${textDef.fontSize}px ${textDef.fontFamily || 'Arial'}`;
    ctx.fillStyle = textDef.color || '#000000';
    ctx.textAlign = textDef.align || 'left';
    ctx.textBaseline = textDef.baseline || 'top';

    // Draw text with a background if specified (e.g., for Polaroid white border text)
    if (textDef.backgroundColor) {
        const textMetrics = ctx.measureText(textDef.text);
        const textWidth = textMetrics.width;
        let bgX = textDef.x;
        if (textDef.align === 'center') {
            bgX = textDef.x - textWidth / 2;
        } else if (textDef.align === 'right') {
            bgX = textDef.x - textWidth;
        }

        const paddingX = 10; // Horizontal padding
        const paddingY = 5;  // Vertical padding
        const bgHeight = textDef.fontSize + paddingY * 2;
        const bgY = textDef.y - textDef.fontSize / 2 - paddingY; // Adjust Y for middle baseline

        ctx.fillStyle = textDef.backgroundColor;
        ctx.fillRect(bgX - paddingX, bgY, textWidth + paddingX * 2, bgHeight);
        ctx.fillStyle = textDef.color || '#000000'; // Reset fillStyle for text color
    }

    ctx.fillText(textDef.text, textDef.x, textDef.y);
  });

  // 6. Add final vintage effects (grain, vignette) - only if filter is applied
  if (filter !== 'original') {
    addVintageGrain(ctx, canvas.width, canvas.height);
    addVintageVignette(ctx, canvas.width, canvas.height);
  }

  return canvas.toDataURL('image/jpeg', 0.9);
};

// --- Existing utility functions (ensure these are present in your file) ---

const addVintageTexture = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  // Add subtle paper texture
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2;

    ctx.fillStyle = `rgba(139, 115, 85, ${Math.random() * 0.1})`;
    ctx.fillRect(x, y, size, size);
  }
};

const addVintageGrain = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }

  ctx.putImageData(imageData, 0, 0);
};

const addVintageVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(width, height) * 0.6;

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(139, 115, 85, 0)');
  gradient.addColorStop(0.7, 'rgba(139, 115, 85, 0.05)');
  gradient.addColorStop(1, 'rgba(139, 115, 85, 0.15)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Placeholder for addVintageStickers and addHandwrittenCaption