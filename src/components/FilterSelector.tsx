import React, { useState, useRef, useEffect } from 'react';
import { Palette, Loader } from 'lucide-react';
import { PhotoTemplate, CapturedPhoto, FilterType } from '../types';
import { createCompositeImage } from '../utils/canvasUtils';
import VintageStickers from './VintageStickers';

interface FilterSelectorProps {
  photos: CapturedPhoto[];
  template: PhotoTemplate;
  onFilterSelect: (filter: FilterType) => void;
  isLoading: boolean;
}

const filters: { type: FilterType; name: string; description: string }[] = [
  { type: 'vintage', name: 'Vintage', description: 'Classic faded warmth' },
  { type: 'sepia', name: 'Sepia', description: 'Traditional brown tones' },
  { type: 'black-white', name: 'B&W', description: 'Timeless monochrome' },
  { type: 'warm', name: 'Warm', description: 'Golden hour glow' },
  { type: 'cool', name: 'Cool', description: 'Blue vintage tones' },
  { type: 'double-exposure', name: 'Double', description: 'Dreamy overlay' },
  { type: 'light-leak', name: 'Light Leak', description: 'Film light effects' },
  { type: 'film-burn', name: 'Film Burn', description: 'Edge burn effect' },
  { type: 'original', name: 'Original', description: 'Natural colors' },
];

const FilterSelector: React.FC<FilterSelectorProps> = ({ 
  photos, 
  template, 
  onFilterSelect, 
  isLoading 
}) => {
  const [previews, setPreviews] = useState<{ [key in FilterType]?: string }>({});
  const [loadingPreviews, setLoadingPreviews] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generatePreviews = async () => {
      setLoadingPreviews(true);
      const newPreviews: { [key in FilterType]?: string } = {};

      for (const filter of filters) {
        try {
          const preview = await createCompositeImage(template, photos, filter.type);
          newPreviews[filter.type] = preview;
        } catch (error) {
          console.error(`Error generating preview for ${filter.type}:`, error);
        }
      }

      setPreviews(newPreviews);
      setLoadingPreviews(false);
    };

    if (photos.length > 0) {
      generatePreviews();
    }
  }, [photos, template]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-700/30 shadow-xl">
          <Loader className="w-12 h-12 text-amber-700 animate-spin mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-amber-900 mb-2 font-serif">
            Creating Your Masterpiece
          </h3>
          <p className="text-amber-700/80">
            Applying vintage magic to your photos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
      {/* Vintage Stickers */}
      <VintageStickers />
      
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 relative z-10 px-2">
        <div className="inline-block vintage-card rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 mb-3 sm:mb-4">
          <span className="text-amber-800 text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase flex items-center gap-1 sm:gap-2 font-typewriter">
            <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
            Filter Selection
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900 mb-2 font-serif relative drop-shadow-sm px-2 leading-tight">
          Choose Your Style
          {/* Subtle embossed effect */}
          <div className="absolute inset-0 text-amber-900/20 transform translate-x-1 translate-y-1 -z-10">
            Choose Your Style
          </div>
        </h2>
        <p className="text-amber-700/80 font-serif px-2 text-sm sm:text-base">
          Select the perfect vintage filter for your photos
        </p>
      </div>

      {/* Enhanced Filter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 relative z-10">
        {filters.map((filter) => (
          <button
            key={filter.type}
            onClick={() => onFilterSelect(filter.type)}
            disabled={loadingPreviews}
            className="group relative vintage-card rounded-lg p-2 sm:p-3 md:p-4 hover:bg-amber-100/90 transition-all duration-300 hover:border-amber-700/50 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {/* Enhanced corner details */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-t-2 border-amber-600/40 opacity-60"></div>
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-t-2 border-amber-600/40 opacity-60"></div>
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-b-2 border-amber-600/40 opacity-60"></div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-b-2 border-amber-600/40 opacity-60"></div>

            {/* Preview Image */}
            <div className="mb-1 sm:mb-2 md:mb-3 rounded-lg overflow-hidden bg-amber-200/20 border border-amber-600/30 flex items-center justify-center shadow-inner" style={{
              aspectRatio: template.layout === 'strip' ? `${template.dimensions.width}/${template.dimensions.height}` : '1/1',
              minHeight: '60px'
            }}>
              {loadingPreviews ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-amber-600 animate-spin" />
                </div>
              ) : previews[filter.type] ? (
                <img
                  src={previews[filter.type]}
                  alt={`${filter.name} preview`}
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-600/60">
                  <Palette className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
                </div>
              )}
            </div>

            {/* Filter Info */}
            <div className="text-center">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-amber-900 mb-0.5 sm:mb-1 font-serif drop-shadow-sm leading-tight">
                {filter.name}
              </h3>
              <p className="text-xs text-amber-700/70 tracking-wide font-typewriter hidden md:block">
                {filter.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;
