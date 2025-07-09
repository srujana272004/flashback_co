import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import VintageStickers from './VintageStickers';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Vintage Stickers */}
      <VintageStickers />
      
      {/* Enhanced vintage texture overlay */}
      <div className="absolute inset-0 opacity-40 z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(139, 115, 85, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(160, 130, 95, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 45% 15%, rgba(120, 100, 75, 0.08) 0%, transparent 35%)
          `
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden z-20 hidden sm:block">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className="text-amber-700/40 w-4 h-4" />
          </div>
        ))}
      </div>

      {/* Enhanced vintage border with imperfections */}
      <div className="absolute inset-2 sm:inset-4 md:inset-6 border-2 border-amber-800/30 rounded-lg pointer-events-none z-30" style={{
        boxShadow: 'inset 0 0 0 1px rgba(139, 115, 85, 0.1)'
      }}></div>

      {/* Main Content */}
      <div className="text-center z-40 px-2 sm:px-4 md:px-6 max-w-4xl mx-auto w-full">
        {/* Main Title */}
        <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-amber-900 mb-4 sm:mb-6 md:mb-8 tracking-wide font-serif relative leading-tight">
            <span className="bg-gradient-to-r from-amber-800 via-amber-900 to-orange-800 bg-clip-text text-transparent drop-shadow-lg" style={{
              textShadow: '2px 2px 4px rgba(139, 115, 85, 0.3)'
            }}>
              Flashback Co.
            </span>
            {/* Subtle embossed effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-800 via-amber-900 to-orange-800 bg-clip-text text-transparent opacity-20 transform translate-x-1 translate-y-1 -z-10">
              Flashback Co.
            </div>
          </h1>
          <div className="w-16 sm:w-24 md:w-32 lg:w-40 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-3 sm:mb-4 md:mb-6 opacity-60"></div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-800/90 font-light tracking-wide italic mb-2 sm:mb-3 md:mb-4 font-serif px-2">
            Vintage Photobooth Experience
          </p>
          <p className="text-sm sm:text-base md:text-lg text-amber-700/80 max-w-2xl mx-auto leading-relaxed font-serif px-4">
            Capture timeless memories with authentic vintage filters
          </p>
        </div>

        {/* Enhanced Start Button */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <button
            onClick={onStart}
            className="group relative vintage-button text-amber-900 px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 rounded-full text-base sm:text-lg md:text-xl font-bold tracking-wide transition-all duration-300 transform hover:scale-105 font-serif w-full max-w-xs sm:max-w-sm mx-auto"
          >
            <span className="flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 group-hover:rotate-12 transition-transform duration-300" />
              Start Photobooth
            </span>
            
            {/* Enhanced vintage glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-700/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </button>
        </div>

        {/* Enhanced tagline */}
        <div className="text-amber-700/70 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] font-typewriter px-2">
          ✨ Capture • Filter • Download ✨
        </div>
      </div>

      {/* Enhanced vintage corner decorations */}
      <div className="absolute top-2 sm:top-4 md:top-6 lg:top-8 left-2 sm:left-4 md:left-6 lg:left-8 w-6 sm:w-8 md:w-12 lg:w-16 h-6 sm:h-8 md:h-12 lg:h-16 z-30">
        <div className="w-full h-full border-l-3 border-t-3 border-amber-700/40 rounded-tl-lg" style={{
          borderWidth: '3px 0 0 3px',
          boxShadow: 'inset 1px 1px 0 rgba(255, 255, 255, 0.2)'
        }}></div>
      </div>
      <div className="absolute top-2 sm:top-4 md:top-6 lg:top-8 right-2 sm:right-4 md:right-6 lg:right-8 w-6 sm:w-8 md:w-12 lg:w-16 h-6 sm:h-8 md:h-12 lg:h-16 z-30">
        <div className="w-full h-full border-r-3 border-t-3 border-amber-700/40 rounded-tr-lg" style={{
          borderWidth: '3px 3px 0 0',
          boxShadow: 'inset -1px 1px 0 rgba(255, 255, 255, 0.2)'
        }}></div>
      </div>
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 left-2 sm:left-4 md:left-6 lg:left-8 w-6 sm:w-8 md:w-12 lg:w-16 h-6 sm:h-8 md:h-12 lg:h-16 z-30">
        <div className="w-full h-full border-l-3 border-b-3 border-amber-700/40 rounded-bl-lg" style={{
          borderWidth: '0 0 3px 3px',
          boxShadow: 'inset 1px -1px 0 rgba(255, 255, 255, 0.2)'
        }}></div>
      </div>
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 right-2 sm:right-4 md:right-6 lg:right-8 w-6 sm:w-8 md:w-12 lg:w-16 h-6 sm:h-8 md:h-12 lg:h-16 z-30">
        <div className="w-full h-full border-r-3 border-b-3 border-amber-700/40 rounded-br-lg" style={{
          borderWidth: '0 3px 3px 0',
          boxShadow: 'inset -1px -1px 0 rgba(255, 255, 255, 0.2)'
        }}></div>
      </div>
    </div>
  );
};

export default LandingPage;