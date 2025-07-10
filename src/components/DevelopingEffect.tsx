import React, { useEffect, useState } from 'react';

interface DevelopingEffectProps {
  photoUrl: string;
  onComplete: () => void;
  duration?: number;
}

const DevelopingEffect: React.FC<DevelopingEffectProps> = ({ 
  photoUrl, 
  onComplete, 
  duration = 3000 
}) => {
  const [developProgress, setDevelopProgress] = useState(0);
  const [showRedLight, setShowRedLight] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevelopProgress(prev => {
        const next = prev + (100 / (duration / 50));
        if (next >= 100) {
          clearInterval(interval);
          setShowRedLight(false);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden px-2 sm:px-4" style={{
      background: 'radial-gradient(circle at center, #1a0a0a 0%, #000000 70%)'
    }}>
      {/* Red Darkroom Light */}
      {showRedLight && (
        <div className="absolute inset-0 bg-red-900/40 animate-pulse z-10" style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(139, 0, 0, 0.4) 0%, rgba(80, 0, 0, 0.2) 50%, transparent 80%)'
        }}></div>
      )}
      
      <div className="text-center relative z-20 px-2 sm:px-4 w-full max-w-xs sm:max-w-md mx-auto">
        {/* Developing Photo */}
        <div className="relative mb-4 sm:mb-6 md:mb-8">
          <div className="w-full max-w-72 sm:max-w-80 h-60 sm:h-72 md:h-96 bg-black border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl mx-auto" style={{
            boxShadow: '0 0 30px rgba(139, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)'
          }}>
            {/* Developer Tray */}
            <div className="absolute inset-4 bg-gray-900 rounded-md border border-gray-700 shadow-inner" style={{
              background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Photo in Developer */}
              <div className="absolute inset-2 bg-white rounded-sm overflow-hidden border border-gray-600">
                <img 
                  src={photoUrl} 
                  alt="Developing photo" 
                  className="w-full h-full object-cover transition-all duration-100 rounded-sm"
                  style={{
                    filter: `
                      brightness(${0.3 + (developProgress / 100) * 0.7})
                      contrast(${0.5 + (developProgress / 100) * 0.5})
                      sepia(${100 - developProgress}%)
                    `,
                    opacity: developProgress / 100
                  }}
                />
                
                {/* Developing Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50 transition-opacity duration-100"
                  style={{ opacity: 1 - (developProgress / 100) }}
                ></div>
              </div>
              
              {/* Enhanced chemical ripples */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/15 rounded-full animate-ping"
                    style={{
                      left: `${15 + (i * 10)}%`,
                      top: `${25 + (i * 8)}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6 relative z-30">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-200 font-serif drop-shadow-lg">
            Developing in Darkroom...
          </h3>
          <div className="w-full max-w-72 sm:max-w-80 h-2 sm:h-3 md:h-4 bg-red-900/60 rounded-full overflow-hidden mx-auto border border-red-800/40 shadow-lg" style={{
            background: 'linear-gradient(90deg, #4a0000 0%, #2a0000 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(139, 0, 0, 0.3)'
          }}>
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-100 ease-out shadow-inner rounded-full"
              style={{ width: `${developProgress}%` }}
            ></div>
          </div>
          <p className="text-red-300/80 text-sm sm:text-base md:text-lg font-typewriter drop-shadow-md">
            {developProgress < 30 ? 'Immersing in developer...' :
             developProgress < 60 ? 'Image appearing...' :
             developProgress < 90 ? 'Fixing the image...' : 'Almost ready!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopingEffect;
