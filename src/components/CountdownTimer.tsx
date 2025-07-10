import React, { useEffect, useRef, useState } from 'react';

interface CountdownTimerProps {
  duration: number;
  onComplete: () => void;
  visible?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  onComplete,
  visible = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 1000); // in milliseconds
  const [displaySeconds, setDisplaySeconds] = useState(duration);
  const [showMilliseconds, setShowMilliseconds] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(duration * 1000);
    setDisplaySeconds(duration);
    setShowMilliseconds(false);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          setDisplaySeconds(0);
          onComplete();
          return 0;
        }

        if (next <= 1000) {
          setShowMilliseconds(true);
        }

        setDisplaySeconds(Math.ceil(next / 1000));
        return next;
      });
    }, 100);

    return () => clearInterval(intervalRef.current!);
  }, [duration, onComplete]);

  if (!visible) return null;

  const totalDuration = duration * 1000;

  // Circle progress for current second
  const currentSecondProgress =
    100 - ((timeLeft % 1000) / 1000) * 100;

  const displayValue = showMilliseconds
    ? `0.${Math.floor((timeLeft % 1000) / 100)}`
    : displaySeconds.toString();

  const circleDasharray = 2 * Math.PI * 46;
  const circleOffset = circleDasharray * (1 - currentSecondProgress / 100);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4" style={{
      background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%)'
    }}>
      <div className="text-center px-2">
        {/* Timer Circle */}
        <div className="relative mb-4 sm:mb-6 md:mb-8 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 mx-auto">
          {/* Background */}
          <div className="w-full h-full rounded-full border-4 border-white/30 bg-white/15 backdrop-blur-sm shadow-2xl" style={{
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          }} />

          {/* Timer Value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white font-bold font-serif drop-shadow-2xl leading-none text-center px-1 sm:px-2" style={{
              textShadow: '0 0 20px rgba(245, 158, 11, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {showMilliseconds ? (
                <div className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem]">{displayValue}</div>
              ) : (
                <div className="text-[3.5rem] sm:text-[5rem] md:text-[8rem]">{displayValue}</div>
              )}
            </div>
          </div>

          {/* Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="rgba(245, 158, 11, 0.9)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circleDasharray}
              strokeDashoffset={circleOffset}
              className="transition-all duration-100 ease-linear"
            />
          </svg>

          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl pointer-events-none" style={{
            background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.3) 0%, transparent 70%)'
          }} />
        </div>

        {/* Text */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-serif tracking-wide drop-shadow-lg px-2 sm:px-4" style={{
            textShadow: '0 0 15px rgba(245, 158, 11, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            Get Ready!
          </p>
          <div className="text-white/80 text-sm sm:text-base md:text-lg tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase font-typewriter drop-shadow-md px-2 sm:px-4">
            {timeLeft <= 0 ? 'Smile!' : 'Pose for the camera'}
          </div>
        </div>

        {/* Flash at 0 */}
        {timeLeft <= 0 && (
          <div className="fixed inset-0 bg-white animate-pulse opacity-60 pointer-events-none z-60" />
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
