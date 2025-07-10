import React from 'react';
import { Grid, Square, Film, Image, ArrowLeft } from 'lucide-react';
import { PhotoTemplate } from '../types';
import { PHOTO_TEMPLATES } from '../utils/templates';
import VintageStickers from './VintageStickers';

interface TemplateSelectorProps {
  onSelectTemplate: (template: PhotoTemplate) => void;
  onBack: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, onBack }) => {
  const getIcon = (layout: string, isLarge = false) => {
    const size = isLarge ? "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" : "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8";
    switch (layout) {
      case 'single': return <Square className={size} />;
      case 'double': return <Grid className={size} />;
      case 'strip': return <Film className={size} />;
      case 'polaroid': return <Image className={size} />;
      default: return <Square className={size} />;
    }
  };

  const getTemplatePreview = (template: PhotoTemplate) => {
    if (template.layout === 'polaroid') {
      return (
        <div className="w-16 h-20 sm:w-18 sm:h-22 md:w-20 md:h-24 bg-white rounded-sm shadow-md border border-amber-600/20 relative mx-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-200/50 rounded-sm m-2 mb-1"></div>
          <div className="h-4 sm:h-5 bg-white flex items-center justify-center">
            <div className="w-6 sm:w-8 h-0.5 bg-amber-600/30"></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 bg-white rounded-sm shadow-md border border-amber-600/20 relative overflow-hidden mx-auto">
          {[...Array(template.slots)].map((_, i) => (
            <div
              key={i}
              className="bg-amber-200/50 border-b border-amber-600/10 last:border-b-0"
              style={{
                height: `${(16 * 4) / template.slots}px`, // 16*4 = 64px for md, scales down
                margin: '2px'
              }}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 relative">
      {/* Vintage Stickers */}
      <VintageStickers />
      
      {/* Enhanced vintage texture */}
      <div className="absolute inset-0 opacity-30 z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(139, 115, 85, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 70% 60%, rgba(160, 130, 95, 0.08) 0%, transparent 40%)
          `
        }}></div>
      </div>

      {/* Enhanced vintage border */}
      <div className="absolute inset-2 sm:inset-4 md:inset-6 border-2 border-amber-800/30 rounded-lg pointer-events-none z-30" style={{
        boxShadow: 'inset 0 0 0 1px rgba(139, 115, 85, 0.1)'
      }}></div>

      <div className="max-w-7xl w-full relative z-40">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-3">
          <div className="inline-block vintage-card rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 mb-4 sm:mb-6">
            <span className="text-amber-800 text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase font-typewriter">
              Template Selection
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900 mb-3 sm:mb-4 font-serif relative px-2 leading-tight">
            Choose Your Style
            {/* Subtle embossed effect */}
            <div className="absolute inset-0 text-amber-900/20 transform translate-x-1 translate-y-1 -z-10">
              Choose Your Style
            </div>
          </h2>
          <div className="w-16 sm:w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-3 sm:mb-4 opacity-60"></div>
          <p className="text-base sm:text-lg md:text-xl text-amber-800/80 italic font-serif px-4">
            Select a template to begin your vintage journey
          </p>
        </div>

        {/* Enhanced Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 px-2 sm:px-3 md:px-0">
          {PHOTO_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="group relative vintage-card rounded-lg p-3 sm:p-4 md:p-6 hover:bg-amber-100/90 transition-all duration-300 hover:border-amber-700/50 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              {/* Enhanced corner details */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-l-2 border-t-2 border-amber-600/40 opacity-60"></div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-r-2 border-t-2 border-amber-600/40 opacity-60"></div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-l-2 border-b-2 border-amber-600/40 opacity-60"></div>
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-r-2 border-b-2 border-amber-600/40 opacity-60"></div>

              <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
                <div className="text-amber-700/80 group-hover:text-amber-800 group-hover:scale-110 transition-all duration-300 mb-1 sm:mb-2">
                  {getIcon(template.layout)}
                </div>
                <div className="text-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-amber-900 mb-1 sm:mb-2 font-serif leading-tight">
                    {template.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-700/70 tracking-wide font-typewriter">
                    {template.slots} {template.slots === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
                
                {/* Enhanced Template Preview */}
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  {getTemplatePreview(template)}
                </div>

                {/* Enhanced vintage badge */}
                <div className="text-xs text-amber-600/60 tracking-[0.1em] sm:tracking-[0.15em] uppercase font-typewriter hidden sm:block">
                  Capture now
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 vintage-button rounded-full text-amber-800 transition-all duration-300 mx-auto font-semibold tracking-wide font-serif text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
