import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, RotateCcw } from 'lucide-react';
import { getCameraStream, stopCameraStream } from '../utils/cameraUtils';

interface CameraFeedProps {
  onCameraReady: (video: HTMLVideoElement, stream: MediaStream) => void;
  onError: (error: string) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onCameraReady, onError, videoRef }) => {
  const internalRef = useRef<HTMLVideoElement>(null);
  const actualRef = videoRef || internalRef;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const mediaStream = await getCameraStream();

        if (!mounted) {
          stopCameraStream(mediaStream);
          return;
        }

        setStream(mediaStream);

        if (actualRef.current) {
          actualRef.current.srcObject = mediaStream;
          actualRef.current.onloadedmetadata = () => {
            if (actualRef.current && mounted) {
              actualRef.current.play();
              onCameraReady(actualRef.current, mediaStream);
              setIsLoading(false);
            }
          };
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Failed to access camera';
          setError(message);
          onError(message);
          setIsLoading(false);
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (stream) stopCameraStream(stream);
    };
  }, [onCameraReady, onError]);

  const retryCamera = () => {
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
    }
    window.location.reload();
  };

  if (error) {
    return (
      <div className="relative w-full h-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 115, 85, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(139, 115, 85, 0.08) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="max-w-md w-full bg-amber-50/80 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-amber-700/30 shadow-xl relative z-10">
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-600/40"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-600/40"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-600/40"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-600/40"></div>

          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-4 font-serif">Camera Access Required</h2>
          <p className="text-amber-800/80 mb-6">{error}</p>
          <button
            onClick={retryCamera}
            className="flex items-center gap-2 px-6 py-3 bg-amber-700 text-amber-50 border-2 border-amber-600/30 rounded-full hover:bg-amber-800 transition-all duration-300 mx-auto font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={actualRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg transform scale-x-[-1]"
        style={{ transform: 'scaleX(-1)' }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-amber-900/50 flex items-center justify-center rounded-lg min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
          <div className="flex flex-col items-center">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-100 animate-pulse mx-auto mb-2 sm:mb-4" />
            <p className="text-amber-100 text-sm sm:text-base md:text-lg font-serif">Starting camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;