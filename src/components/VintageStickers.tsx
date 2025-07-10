import React from 'react';
import { Camera, Film, Disc, Star, Heart, Zap, Sun, Moon } from 'lucide-react';

interface VintageStickerProps {
  className?: string;
}

const VintageStickers: React.FC<VintageStickerProps> = ({ className = '' }) => {
  const stickers = [
    // Camera stickers
    { icon: Camera, rotation: 15, x: '10%', y: '15%', size: 'w-6 h-6', color: 'text-amber-700/30' },
    { icon: Camera, rotation: -20, x: '85%', y: '25%', size: 'w-5 h-5', color: 'text-orange-600/25' },
    
    // Film reels
    { icon: Film, rotation: 45, x: '20%', y: '80%', size: 'w-7 h-7', color: 'text-amber-800/20' },
    { icon: Disc, rotation: -30, x: '75%', y: '70%', size: 'w-6 h-6', color: 'text-amber-600/25' },
    
    // Stars and hearts
    { icon: Star, rotation: 0, x: '5%', y: '50%', size: 'w-4 h-4', color: 'text-yellow-600/30' },
    { icon: Heart, rotation: 25, x: '90%', y: '60%', size: 'w-5 h-5', color: 'text-red-500/25' },
    { icon: Star, rotation: -15, x: '15%', y: '35%', size: 'w-3 h-3', color: 'text-amber-500/35' },
    
    // Lightning and sun/moon
    { icon: Zap, rotation: 30, x: '80%', y: '15%', size: 'w-4 h-4', color: 'text-yellow-500/30' },
    { icon: Sun, rotation: -10, x: '25%', y: '10%', size: 'w-5 h-5', color: 'text-orange-500/25' },
    { icon: Moon, rotation: 20, x: '70%', y: '85%', size: 'w-4 h-4', color: 'text-blue-400/25' },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {stickers.map((sticker, index) => (
        <div
          key={index}
          className="absolute animate-pulse"
          style={{
            left: sticker.x,
            top: sticker.y,
            transform: `rotate(${sticker.rotation}deg)`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <sticker.icon className={`${sticker.size} ${sticker.color} drop-shadow-sm`} />
        </div>
      ))}
    </div>
  );
};

export default VintageStickers;
