import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Sparkles } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [launchReached, setLaunchReached] = useState(false);
  const [particles, setParticles] = useState([]);
  const [stars, setStars] = useState([]);
  const [confettiParticles, setConfettiParticles] = useState([]);
  const [ripple, setRipple] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  const createStars = useCallback(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);

  const createConfetti = useCallback(() => {
    const particles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      rotation: Math.random() * 360,
      speed: Math.random() * 5 + 3,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }));
    setConfettiParticles(particles);
    
    const confettiInterval = setInterval(() => {
      setConfettiParticles(prev => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
          id: `new-${Date.now()}-${i}`,
          x: Math.random() * window.innerWidth,
          y: -10,
          rotation: Math.random() * 360,
          speed: Math.random() * 5 + 3,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        }));
        return [...prev.filter(p => p.y < window.innerHeight), ...newParticles];
      });
    }, 2000);
    
    return () => clearInterval(confettiInterval);
  }, []);

  const handleButtonClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);
  };

  useEffect(() => {
    return () => {
    };
  }, []);

  useEffect(() => {
    createStars();
  }, [createStars]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-05-26T16:30:00').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else if (!launchReached) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setLaunchReached(true);
        createParticles();
        createConfetti();
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [launchReached, createParticles, createConfetti]);

  return (
      <div className="fixed inset-0 text-white overflow-hidden" style={{
      background: 'linear-gradient(135deg, #05081a 0%, #070c21 15%, #0a1128 20%, #0f1a40 90%,#071d59 100%)'
    }}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(circle at center,rgba(26, 58, 143, 0.25) 0%, transparent 70%)'
      }} />

      {/* Stars */}
      {!launchReached && stars.map((star) => (
        <div key={star.id} className="star" style={{
          left: `${star.x}px`,
          top: `${star.y}px`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          animationDelay: `${star.delay}s`,
        }} />
      ))}

      {/* Confetti */}
      {confettiParticles.map((particle) => (
        <div key={particle.id} className="confetti-particle" style={{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          transform: `rotate(${particle.rotation}deg)`,
          backgroundColor: particle.color,
          animation: `fall ${particle.speed}s linear forwards`,
        }} />
      ))}

      {/* Main Content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center px-4">
        <div className={`transition-all duration-1000 ${launchReached ? 'animate-float' : 'animate-fade-in-up'}`}>
          {/* Logo */}
          <div className="mb-8 animate-pulse-glow">
            <img src="https://i.imgur.com/kXd5V5O.png" alt="Logo" className="w-48 h-32 mx-auto" />
          </div>

          {/* Title */}
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold moving-gradient-text">Decode X</h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-center mb-12 opacity-90">
            {launchReached ? 'IEEE SPS Website Launch!' : "We're cooking 🧑‍🍳 up something special. Stay tuned!"}
          </p>

          {/* Countdown or Button */}
          <div className="flex flex-col items-center">
            {launchReached ? (
              <div className="animate-scale-in">
                <button
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="relative inline-flex items-center justify-center px-12 py-5 text-2xl font-bold tracking-wide text-white rounded-full overflow-hidden group transition-all duration-300"
                  style={{
                    background: 'linear-gradient(to right, #00629B, #3a7ba8, #78BE20, #00629B)',
                    backgroundSize: '200% 100%',
                    animation: 'moveGradientSmoothly 8s linear infinite',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: isHovering 
                      ? '0 0 20px rgba(0, 98, 155, 0.7), 0 0 30px rgba(120, 190, 32, 0.5)'
                      : '0 0 0 rgba(0, 0, 0, 0)'
                  }}
                  onClick={(e) => {
                    handleButtonClick(e);
                    window.location.href = "https://www.decodex.one/";
                  }}
                >
                  {ripple && (
                    <span className="ripple-effect" style={{
                      left: `${ripple.x}px`,
                      top: `${ripple.y}px`,
                    }} />
                  )}
                  <span className={`absolute inset-0 shine-effect ${isHovering ? 'animate-shine' : ''}`} />
                  <Sparkles className={`w-6 h-6 mr-3 ${isHovering ? 'animate-sparkle' : ''}`} />
                  <span className="relative z-10">Enter Website</span>
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
                    <div key={unit} className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-center transform hover:scale-105 transition-transform duration-300">
                      <div className="text-3xl md:text-5xl font-bold mb-2">{value}</div>
                      <div className="text-sm md:text-base uppercase tracking-wider opacity-75">{unit}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Particles */}
      {launchReached && particles.map((particle) => (
        <div key={particle.id} className="particle" style={{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          '--tx': `${particle.tx}px`,
          '--ty': `${particle.ty}px`,
          animation: 'particle-animation 2s ease-out forwards',
        }} />
      ))}
    </div>
  );
}

export default App;
