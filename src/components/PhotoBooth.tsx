import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Download, Camera } from 'lucide-react';
import { PhotoTemplate, CapturedPhoto, AppState, FilterType } from '../types';
import CameraFeed from './CameraFeed';
import CountdownTimer from './CountdownTimer';
import FilterSelector from './FilterSelector';
// import PrintingAnimation from './PrintingAnimation'; // Removed
import DevelopingEffect from './DevelopingEffect';
import { capturePhoto, stopCameraStream } from '../utils/cameraUtils';
import { createCompositeImage, downloadImage } from '../utils/canvasUtils';
import { audioManager } from '../utils/audioUtils';
import VintageStickers from './VintageStickers';

interface PhotoBoothProps {
  template: PhotoTemplate;
  onBack: () => void;
  onComplete: () => void;
}

const PhotoBooth: React.FC<PhotoBoothProps> = ({ template, onBack, onComplete }) => {
  const [state, setState] = useState<AppState>('camera-setup');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [compositeImage, setCompositeImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('vintage');
  const [isCreatingComposite, setIsCreatingComposite] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showDimming, setShowDimming] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const handleCameraReady = useCallback((video: HTMLVideoElement, mediaStream: MediaStream) => {
    console.log('Camera ready, setting up stream and transitioning to preview.');
    setStream(mediaStream);
    setState('preview');
    setIsLoadingCamera(false);
    setCameraError(null);
  }, []);

  const handleCameraError = useCallback((error: string) => {
    console.error('Camera error:', error);
    setIsLoadingCamera(false);
    setCameraError(error);
    setState('camera-setup');
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera stream.');
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
    }
  }, [stream]);

  const startCountdown = () => {
    if (!videoRef.current) {
      console.error("Cannot start countdown: Video element not ready.");
      setCameraError("Camera not ready. Please wait a moment or try refreshing.");
      return;
    }
    console.log('Starting countdown.');

    audioManager.playFlashChargingSound();

    setShowDimming(true);
    setTimeout(() => {
      setState('countdown');
    }, 500);
  };

  const captureCurrentPhoto = useCallback(async () => {
    console.log('Attempting to capture photo.', {
      videoElementAvailable: !!videoRef.current,
      canvasAvailable: !!canvasRef.current,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      readyState: videoRef.current?.readyState
    });

    if (!videoRef.current || !canvasRef.current) {
      console.error('Missing video element or canvas. Cannot capture photo.');
      setCameraError("Critical error: Camera feed or processing canvas missing.");
      setState('preview');
      return;
    }

    // Check if video has valid dimensions before capturing
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.error('Video dimensions are zero. Cannot capture photo.', {
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight,
        readyState: videoRef.current.readyState,
        currentSrc: videoRef.current.currentSrc,
        srcObject: videoRef.current.srcObject
      });
      setCameraError("Camera feed not ready. Please wait a moment and try again.");
      setState('preview');
      setShowDimming(false);
      return;
    }

    // Check if video has enough data to render a frame
    if (videoRef.current.readyState < 2) {
      console.error('Video not ready for capture.', {
        readyState: videoRef.current.readyState,
        networkState: videoRef.current.networkState,
        paused: videoRef.current.paused,
        ended: videoRef.current.ended
      });
      setCameraError("Video feed loading. Please wait a moment and try again.");
      setState('preview');
      setShowDimming(false);
      return;
    }

    try {
      setShowFlash(true);
      audioManager.playShutterSound();
      setTimeout(() => setShowFlash(false), 200);

      console.log(`Capturing photo ${photos.length + 1}.`);
      const imageData = capturePhoto(videoRef.current, canvasRef.current, 'original');
      console.log('Photo captured successfully, imageData length:', imageData.length);
      const newPhoto: CapturedPhoto = {
        id: `photo-${Date.now()}`,
        imageData,
        timestamp: Date.now(),
      };

      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      console.log('Photo captured successfully. Total photos:', updatedPhotos.length);

      setState('capturing');
      setShowDimming(false);

      setTimeout(() => {
        audioManager.playFilmAdvanceSound();
      }, 500);

      if (updatedPhotos.length >= template.slots) {
        console.log('All photos captured. Generating initial composite image and starting developing process.');
        setIsCreatingComposite(true);
        const initialComposite = await createCompositeImage(template, updatedPhotos, 'original');
        setCompositeImage(initialComposite);
        setIsCreatingComposite(false);

        setTimeout(() => {
          stopCamera();
          setState('developing');
        }, 2000);
      } else {
        console.log('More photos needed. Preparing for next shot.');
        setCurrentSlot(currentSlot + 1);

        setTimeout(() => {
          setState('preview');
          setTimeout(() => {
            if (videoRef.current) {
              startCountdown();
            }
          }, 1000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      setCameraError(`Failed to capture photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setState('preview');
      setShowDimming(false);
    }
  }, [currentSlot, photos, template.slots, stopCamera, template]);

  const handleDevelopingComplete = () => {
    console.log('Developing complete, transitioning to filter selection.');
    setState('filter-selection');
  };

  const handleFilterSelect = async (filter: FilterType) => {
    console.log('Filter selected:', filter);
    setSelectedFilter(filter);
    setIsCreatingComposite(true);

    try {
      const composite = await createCompositeImage(template, photos, filter);
      setCompositeImage(composite);
      // Directly transition to final-preview after filter selection
      // No 'printing' state needed
      setState('final-preview');
      // Removed printing sound as requested
    } catch (error) {
      console.error('Error creating composite image:', error);
      setState('filter-selection'); // Stay on filter selection if error
    } finally {
      setIsCreatingComposite(false);
    }
  };

  // const handlePrintingComplete = () => { // This function is no longer needed
  //   setState('final-preview');
  // };

  const retakePhoto = () => {
    setPhotos([]);
    setCurrentSlot(0);
    setCompositeImage(null);
    setState('camera-setup');
    setIsLoadingCamera(true);
    setCameraError(null);
  };

  const handleDownload = () => {
    if (compositeImage) {
      downloadImage(compositeImage, `flashback-co-${Date.now()}.jpg`);
    }
  };

  const startNewSession = () => {
    setPhotos([]);
    setCurrentSlot(0);
    setCompositeImage(null);
    setCameraError(null);
    setState('camera-setup');
    setIsLoadingCamera(true);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const getCurrentPhotoNumber = () => {
    // Adjusted logic as 'printing' state is removed
    if (state === 'filter-selection' || state === 'final-preview' || state === 'developing') {
      return template.slots;
    }
    return Math.min(photos.length + 1, template.slots);
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Vintage Stickers */}
      <VintageStickers />
      
      {/* Enhanced vintage texture background */}
      <div className="absolute inset-0 opacity-25 z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(139, 115, 85, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 75% 75%, rgba(160, 130, 95, 0.08) 0%, transparent 40%)
          `
        }}></div>
      </div>

      {/* Dimming Effect */}
      {showDimming && (
        <div className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-500"></div>
      )}

      {/* Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-60 animate-pulse"></div>
      )}

      {/* Developing Effect */}
      {state === 'developing' && compositeImage && (
        <DevelopingEffect
          photoUrl={compositeImage}
          onComplete={handleDevelopingComplete}
          duration={4500}
        />
      )}

      {/* Printing Animation - Removed
      {state === 'printing' && compositeImage && (
        <PrintingAnimation
          photoUrl={compositeImage}
          onComplete={handlePrintingComplete}
        />
      )}
      */}

      {/* This canvas is for capturing images, keep it hidden */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      {/* Conditionally hide header if developing or filter-selection or final-preview is active */}
      {!(state === 'developing' || state === 'filter-selection' || state === 'final-preview') && (
        <div className="p-2 sm:p-3 md:p-4 flex justify-between items-center relative z-20 max-w-4xl mx-auto w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 vintage-button rounded-full text-amber-800 transition-all duration-300 font-semibold font-serif text-xs sm:text-sm md:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </button>

          <div className="text-center">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-amber-900 font-serif drop-shadow-sm leading-tight">{template.name}</h2>
            <p className="text-amber-700/70 text-xs sm:text-sm tracking-wide font-typewriter">
              Photo {getCurrentPhotoNumber()} of {template.slots}
            </p>
          </div>

          <div className="w-12 sm:w-16 md:w-20"></div> {/* Spacer for alignment */}
        </div>
      )}

      {/* Main Content Area - Conditionally Render based on state */}
      <div className="p-2 sm:p-3 md:p-4 relative z-20 flex justify-center items-center flex-grow max-w-4xl mx-auto w-full">
        {state === 'filter-selection' && (
          <FilterSelector
            photos={photos}
            template={template}
            onFilterSelect={handleFilterSelect}
            isLoading={isCreatingComposite}
          />
        )}

        {state === 'final-preview' && compositeImage ? (
          <div className="max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto px-2">
            <div className="vintage-card rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-xl relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-amber-300/15 rounded-lg"></div>
                <img
                  src={compositeImage}
                  alt="Final composite"
                  className="w-full rounded-lg shadow-lg relative z-10 border border-amber-600/20 max-h-80 sm:max-h-96 object-contain"
                />
                {/* Enhanced corner decorations */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 border-l-2 border-t-2 border-amber-600/50"></div>
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 border-r-2 border-t-2 border-amber-600/50"></div>
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 border-l-2 border-b-2 border-amber-600/50"></div>
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 border-r-2 border-b-2 border-amber-600/50"></div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 shadow-lg font-serif text-amber-900 text-sm sm:text-base w-full" style={{
                  background: 'linear-gradient(145deg, #8b7355, #6b5940)',
                  border: '2px solid rgba(107, 89, 64, 0.4)',
                  color: '#f8f5f0',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 4px 8px rgba(139, 115, 85, 0.3)'
                }}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Download Photo
              </button>

              <button
                onClick={startNewSession}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 vintage-button rounded-full text-amber-800 transition-all duration-300 font-semibold font-serif text-sm sm:text-base w-full"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                Take Another
              </button>
            </div>
          </div>
        ) : (state === 'camera-setup' || state === 'preview' || state === 'countdown' || state === 'capturing') && (
          <div className="max-w-xs sm:max-w-sm md:max-w-md w-full mx-auto px-2">
            <div className="vintage-card rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-xl relative">
              {/* Enhanced corner decorations for camera frame */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-l-3 border-t-3 border-amber-600/50" style={{ borderWidth: '2px 0 0 2px' }}></div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-r-3 border-t-3 border-amber-600/50" style={{ borderWidth: '2px 2px 0 0' }}></div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-l-3 border-b-3 border-amber-600/50" style={{ borderWidth: '0 0 2px 2px' }}></div>
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-r-3 border-b-3 border-amber-600/50" style={{ borderWidth: '0 2px 2px 0' }}></div>

              <CameraFeed
                videoRef={videoRef}
                onCameraReady={handleCameraReady}
                onError={handleCameraError}
              />
            </div>

            {isLoadingCamera && !cameraError && (
              <div className="text-center text-amber-800 text-base sm:text-lg mb-4 font-serif drop-shadow-sm">
                Loading camera... 📷
              </div>
            )}

            {cameraError && (
              <div className="text-center text-red-700 bg-red-100/80 border border-red-300 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 font-semibold font-serif backdrop-blur-sm text-xs sm:text-sm md:text-base">
                Error: {cameraError} Please refresh or check camera permissions.
              </div>
            )}

            {state === 'preview' && !isLoadingCamera && !cameraError && photos.length === 0 && (
              <div className="flex flex-col gap-3 sm:gap-4">
                <button
                  onClick={startCountdown}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 shadow-lg font-serif text-sm sm:text-base w-full" style={{
                    background: 'linear-gradient(145deg, #b8956b, #8b7355)',
                    border: '2px solid rgba(139, 115, 85, 0.4)',
                    color: '#f8f5f0',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 4px 8px rgba(139, 115, 85, 0.3)'
                  }}
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  Start Photo Session
                </button>
              </div>
            )}

            {state === 'preview' && !isLoadingCamera && !cameraError && photos.length > 0 && (
              <div className="flex flex-col gap-3 sm:gap-4">
                <button
                  onClick={retakePhoto}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 vintage-button rounded-full text-amber-800 transition-all duration-300 font-semibold font-serif text-sm sm:text-base w-full"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  Retake Previous
                </button>
              </div>
            )}

            {state === 'capturing' && (
              <div className="text-center">
                <div className="text-amber-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-serif drop-shadow-sm">
                  📸 Photo captured!
                </div>
                <div className="text-amber-700/70 font-typewriter text-xs sm:text-sm md:text-base">
                  {photos.length < template.slots ? 'Next photo starting soon...' : 'All photos captured! Developing...'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Countdown Timer Overlay */}
      {state === 'countdown' && (
        <CountdownTimer
          duration={5}
          onComplete={captureCurrentPhoto}
          visible={true}
        />
      )}
    </div>
  );
};

export default PhotoBooth;