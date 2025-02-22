import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Code2, Sparkles } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [launchReached, setLaunchReached] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; tx: number; ty: number }>
  >([]);
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);
  const [confettiParticles, setConfettiParticles] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; speed: number; color: string }>
  >([]);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  // Create particles for the explosion effect
  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: (Math.random() - 0.5) * window.innerWidth,
      ty: (Math.random() - 0.5) * window.innerHeight,
    }));
    setParticles(newParticles);
  }, []);

  // Create floating stars for the background
  const createStars = useCallback(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1, // Random size between 1px and 4px
      delay: Math.random() * 5, // Random animation delay
    }));
    setStars(newStars);
  }, []);

  // Create confetti particles
  const createConfetti = useCallback(() => {
    const particles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth, // Random horizontal position
      y: -10, // Start above the screen
      rotation: Math.random() * 360, // Random rotation
      speed: Math.random() * 5 + 3, // Random fall speed
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
    }));
    setConfettiParticles(particles);

    // Remove confetti after 5 seconds
    setTimeout(() => {
      setConfettiParticles([]);
    }, 5000);
  }, []);

  // Handle ripple effect on button click
  const handleButtonClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });

    // Remove ripple after animation
    setTimeout(() => setRipple(null), 600);
  };

  useEffect(() => {
    createStars(); // Initialize stars
  }, [createStars]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-05-01T20:00:00').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!launchReached) {
          setLaunchReached(true);
          createParticles();
          createConfetti(); // Trigger custom confetti
        }
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [launchReached, createParticles, createConfetti]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Original Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=2342&q=80')] opacity-20 bg-cover bg-center" />

      {/* Semi-transparent Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Floating Stars */}
      {!launchReached &&
        stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

      {/* Custom Confetti */}
      {confettiParticles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `rotate(${particle.rotation}deg)`,
            backgroundColor: particle.color,
            animation: `fall ${particle.speed}s linear forwards`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div
          className={`transition-all duration-1000 ${
            launchReached ? 'animate-float' : 'animate-fade-in-up'
          }`}
        >
          {/* Space for Logo */}
          <div className="mb-8 animate-pulse-glow">
            <img
              src="https://i.imgur.com/kXd5V5O.png"
              alt="Logo"
              className="w-48 h-32 mx-auto"
            />
          </div>

          <div className="flex items-center justify-center mb-8">
            {launchReached ? (
              <Sparkles className="w-16 h-16 mr-4 text-yellow-400 animate-spin-slow" />
            ) : (
              <Code2 className="w-16 h-16 mr-4 animate-pulse" />
            )}
            <h1 className="text-6xl md:text-8xl font-bold moving-gradient-text">
              Decode X
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-center mb-12 opacity-90">
            {launchReached
              ? 'IEEE SPS Website Launch!'
              : "We're cooking 🧑‍🍳 up something special. Stay tuned!"}
          </p>

          <div className="flex flex-col items-center">
            {launchReached ? (
              <div className="animate-scale-in">
                <button
                  onClick={handleButtonClick}
                  className="relative inline-flex items-center px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-gradient overflow-hidden"
                >
                  {ripple && (
                    <span
                      className="ripple-effect"
                      style={{
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                      }}
                    />
                  )}
                  <Sparkles className="w-6 h-6 mr-2" />
                  Enter Website
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-4 mb-8">
                  <Timer className="w-8 h-8 animate-spin-slow" />
                  <span className="text-2xl">Website Launch Countdown</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div
                      key={unit}
                      className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-glow"
                    >
                      <div className="text-3xl md:text-5xl font-bold mb-2">
                        {value}
                      </div>
                      <div className="text-sm md:text-base uppercase tracking-wider opacity-75">
                        {unit}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Particles */}
      {launchReached &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              animation: 'particle-animation 2s ease-out forwards',
            }}
          />
        ))}
    </div>
  );
}

export default App;