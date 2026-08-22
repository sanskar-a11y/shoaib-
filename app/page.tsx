"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, Music, Maximize, Minimize, Heart } from "lucide-react";

// --- ANIMATION PRESETS ---
const fadeUp = {
  initial: { opacity: 0, y: 30, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 1.2 },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 1.5 },
};

const scaleImage = {
  initial: { opacity: 0, scale: 1.04 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 1.5 },
};

// --- PARTICLES COMPONENT ---
const Particles = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    setParticles(
      [...Array(15)].map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 12 + Math.random() * 20,
        delay: Math.random() * 5,
      }))
    );
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[var(--accent)]/50 rounded-full opacity-0"
          initial={{ left: `${p.x}vw`, top: `${p.y}vh` }}
          animate={{
            top: [`${p.y}vh`, `${p.y - 15}vh`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// --- THEME SWITCHER ---
const ThemeSwitcher = ({ currentTheme, setTheme }: { currentTheme: string, setTheme: (t: string) => void }) => {
  const themes = [
    { id: "default", name: "Blush", color: "#E5B7BA" },
    { id: "midnight", name: "Midnight", color: "#94A3B8" },
    { id: "sage", name: "Sage", color: "#A1A98A" },
    { id: "lavender", name: "Lavender", color: "#C4B5DA" },
  ];
  return (
    <div className="fixed bottom-6 left-6 z-50 flex gap-1 bg-[var(--bg-primary)]/80 backdrop-blur-md p-1.5 rounded-full border border-[var(--accent)]/30 shadow-sm">
      {themes.map(t => (
        <button 
          key={t.id} 
          onClick={() => setTheme(t.id)}
          className="relative flex items-center justify-center w-12 h-12 md:w-8 md:h-8 rounded-full group after:content-[''] after:absolute after:-inset-2 md:after:inset-0"
          title={t.name}
          aria-label={`Switch to ${t.name} theme`}
        >
          <span 
            className={`w-5 h-5 md:w-4 md:h-4 rounded-full transition-all duration-300 group-hover:scale-110 ${currentTheme === t.id ? 'ring-2 ring-[var(--text-main)] ring-offset-2 ring-offset-[var(--bg-primary)] scale-110' : ''}`}
            style={{ backgroundColor: t.color }} 
          />
        </button>
      ))}
    </div>
  );
};

// --- WELCOME SCREEN ---
const WelcomeScreen = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-[300] bg-[var(--bg-primary)] flex flex-col items-center justify-center cursor-pointer border-b border-[var(--accent)]/20 shadow-2xl origin-top"
      initial={{ y: 0 }}
      exit={{ y: "-100vh" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      onClick={onEnter}
    >
      <motion.div
        exit={{ opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeOut" } }}
        className="flex flex-col items-center"
      >
        <motion.p 
          className="font-serif italic text-2xl text-[var(--text-main)]/70 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          For Layka...
        </motion.p>
        <motion.button
          className="px-8 py-3 tracking-[0.3em] uppercase text-[10px] font-bold text-[var(--bg-primary)] bg-[var(--text-main)] rounded-full hover:scale-105 transition-transform"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          Enter Experience
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// --- FLOATING QUOTE ---
const floatingQuotes = [
  "You are my today and all of my tomorrows.",
  "I look at you and see the rest of my life in front of my eyes.",
  "If I know what love is, it is because of you.",
  "Every love story is beautiful, but ours is my favorite.",
  "I love you more than I have ever found a way to say to you."
];

const FloatingQuote = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
      
      interval = setInterval(() => {
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 5000);
      }, 15000);
    }, 3000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % floatingQuotes.length);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    <div className="fixed bottom-24 right-6 z-40 pointer-events-none max-w-[240px]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="bg-[var(--bg-primary)]/90 backdrop-blur-md p-5 border border-[var(--accent)]/50 shadow-xl rounded-sm"
          >
            <p className="font-serif text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-3">
              Note
            </p>
            <p className="font-serif text-sm italic text-[var(--text-main)]/90 leading-relaxed text-right">
              &quot;{floatingQuotes[quoteIndex]}&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- FLOATING AUDIO PLAYER ---
const FloatingAudioPlayer = ({ autoPlayTrigger, theme }: { autoPlayTrigger: boolean, theme: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const initAudioContext = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 64; // 32 frequency bins
        sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const getThemeColor = () => {
    if (theme === 'midnight') return '#ffffff';
    if (theme === 'sage') return '#2C3026';
    if (theme === 'lavender') return '#2D2438';
    return '#1A1A1A'; // default (blush)
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getThemeColor();
    ctx.globalAlpha = 0.6;

    const barWidth = 2;
    const gap = 3;
    const totalBars = Math.floor(width / (barWidth + gap));
    
    for (let i = 0; i < totalBars; i++) {
      // Focus on lower-mid frequencies
      const dataIndex = Math.floor((i / totalBars) * (dataArray.length * 0.6)); 
      const rawHeight = (dataArray[dataIndex] / 255) * height;
      const barHeight = Math.max(2, rawHeight * 0.8);
      const x = i * (barWidth + gap);
      const y = height - barHeight;
      
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
    if (isPlaying) {
      initAudioContext();
      drawVisualizer();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (canvasRef.current) {
         const ctx = canvasRef.current.getContext('2d');
         if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.fillStyle = getThemeColor();
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.roundRect(0, canvasRef.current.height / 2 - 1, canvasRef.current.width, 2, 2);
            ctx.fill();
         }
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, theme]);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      initAudioContext();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => {
        console.warn("Audio playback issue (often due to missing file or browser autoplay rules):", e.message);
        setIsPlaying(false);
      });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        initAudioContext();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => {
          console.warn("Audio playback issue:", e.message);
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/birthday-song.mp3" crossOrigin="anonymous" />
      
      {/* Frequency Visualizer */}
      <div className="fixed bottom-16 left-6 z-40 pointer-events-none transition-opacity duration-1000 hidden md:block">
        <canvas ref={canvasRef} width={80} height={24} className="opacity-80" />
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[var(--text-main)] text-[var(--bg-primary)] flex items-center justify-center shadow-2xl hover:bg-[var(--accent)] hover:text-[var(--text-main)] transition-all duration-500 group relative border border-transparent hover:border-[var(--text-main)]/10"
        >
          {isPlaying ? <Pause size={20} /> : <Music size={20} />}
          
          {/* Tooltip */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--bg-primary)] px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-[var(--text-main)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[var(--accent)]/50 shadow-sm">
            {isPlaying ? 'Pause' : 'Play Song'}
          </span>
        </button>
      </div>
    </>
  );
};

// --- LIVE TIMER ---
const LiveTimer = () => {
  const [time, setTime] = useState({ years: 21, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Assuming birth date is August 22, 2005 (21 years ago from roughly today)
    const birthDate = new Date('2005-08-22T00:00:00');
    
    const updateTimer = () => {
      const now = new Date();
      
      let years = now.getFullYear() - birthDate.getFullYear();
      let months = now.getMonth() - birthDate.getMonth();
      let days = now.getDate() - birthDate.getDate();
      let hours = now.getHours() - birthDate.getHours();
      let minutes = now.getMinutes() - birthDate.getMinutes();
      let seconds = now.getSeconds() - birthDate.getSeconds();

      if (seconds < 0) {
        minutes--;
        seconds += 60;
      }
      if (minutes < 0) {
        hours--;
        minutes += 60;
      }
      if (hours < 0) {
        days--;
        hours += 24;
      }
      if (days < 0) {
        months--;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      
      setTime({ years, months, days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return <div className="h-24"></div>; // Placeholder to avoid layout shift

  return (
    <div className="flex flex-col items-center gap-4 mb-16 mt-8">
      <div className="flex flex-wrap justify-center items-end gap-2 md:gap-4 text-[var(--accent)] font-serif italic text-2xl md:text-4xl">
        <span>{time.years} <span className="text-sm md:text-lg not-italic font-sans tracking-widest uppercase text-[var(--text-main)]/40">YRS</span></span>
        <span className="text-[var(--text-main)]/20">·</span>
        <span>{time.months} <span className="text-sm md:text-lg not-italic font-sans tracking-widest uppercase text-[var(--text-main)]/40">MOS</span></span>
        <span className="text-[var(--text-main)]/20">·</span>
        <span>{time.days} <span className="text-sm md:text-lg not-italic font-sans tracking-widest uppercase text-[var(--text-main)]/40">DYS</span></span>
      </div>
      
      <div className="flex gap-4 text-xs md:text-sm font-sans tracking-[0.3em] font-bold text-[var(--text-main)]/30 uppercase">
        <span className="w-16 text-center">{time.hours.toString().padStart(2, '0')}h</span>
        <span className="w-16 text-center">{time.minutes.toString().padStart(2, '0')}m</span>
        <span className="w-16 text-center">{time.seconds.toString().padStart(2, '0')}s</span>
      </div>
    </div>
  );
};

// --- DATA PRESETS ---
const galleryImages = [
  { id: "g1", src: "/photos/layka-01.jpg", caption: "A quiet moment I wanted to remember forever.", date: "Spring 2024" },
  { id: "g2", src: "/photos/layka-02.jpg", caption: "When you couldn't stop laughing.", date: "Summer 2024" },
  { id: "g3", src: "/photos/layka-03.jpg", caption: "The light was perfect, but you were better.", date: "Autumn 2024" },
  { id: "g4", src: "/photos/layka-04.jpg", caption: "One of those perfect ordinary days.", date: "Winter 2024" }
];

const SubtleConfetti = () => {
  const [pieces, setPieces] = useState<Array<{ id: number, x: number, delay: number, duration: number, color: string, w: number, h: number, targetX: string, targetRotZ: number }>>([]);

  useEffect(() => {
    const getSubtleColor = () => {
      const r = Math.random();
      if (r > 0.95) return 'var(--text-main)';
      if (r > 0.6) return '#ffffff';
      if (r > 0.3) return 'var(--bg-secondary)';
      return 'var(--accent)';
    };

    const newPieces = Array.from({ length: 60 }).map((_, i) => {
      const startX = Math.random() * 100;
      return {
        id: i,
        x: startX,
        delay: Math.random() * 2.5,
        duration: 5 + Math.random() * 4,
        color: getSubtleColor(),
        w: Math.random() * 3 + 3,
        h: Math.random() * 8 + 6,
        targetX: `calc(${startX}vw + ${Math.random() * 10 - 5}vw)`,
        targetRotZ: 360 * (Math.random() > 0.5 ? 1 : -1)
      };
    });
    const timer = setTimeout(() => setPieces(newPieces), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-10%]"
          style={{
            left: `${p.x}vw`,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: '1px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          initial={{ y: 0, opacity: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }}
          animate={{ 
            y: '120vh', 
            opacity: [0, 1, 1, 0],
            rotateX: 720,
            rotateY: 720,
            rotateZ: p.targetRotZ,
            x: p.targetX
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const DriftingHearts = () => {
  const [hearts, setHearts] = useState<Array<{ id: number, x: number, delay: number, duration: number, scale: number, opacity: number }>>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 10 + Math.random() * 10,
      scale: 0.3 + Math.random() * 0.6,
      opacity: 0.1 + Math.random() * 0.3
    }));
    const timer = setTimeout(() => setHearts(newHearts), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute bottom-[-10%]"
          style={{
            left: `${h.x}vw`,
            color: 'var(--accent)',
          }}
          initial={{ y: 0, x: 0, rotate: -20, scale: h.scale, opacity: 0 }}
          animate={{ 
            y: '-120vh', 
            x: [0, 30, -30, 30, 0],
            rotate: [ -20, 20, -20, 20, -20 ],
            opacity: [0, h.opacity, h.opacity, 0]
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: "linear",
            x: { duration: h.duration, ease: "easeInOut", repeat: Infinity },
            rotate: { duration: h.duration, ease: "easeInOut", repeat: Infinity },
            opacity: { duration: h.duration, ease: "easeInOut" }
          }}
        >
          <Heart fill="currentColor" strokeWidth={0.5} />
        </motion.div>
      ))}
    </div>
  );
};

const reasons21 = [
  "The way your eyes light up when you smile.",
  "Your laugh, which is my favorite sound in the world.",
  "The warmth of your presence that instantly calms me.",
  "How you make ordinary days feel extraordinary.",
  "Your kindness that touches everyone around you.",
  "The gentle way you look at me.",
  "Your passion for the things you love.",
  "The way you understand me without words.",
  "Your strength and resilience.",
  "The safe space you create just by being you.",
  "Your incredible sense of style and elegance.",
  "The sound of your voice when you say my name.",
  "How you inspire me to be a better person.",
  "Your beautiful, radiant soul.",
  "The way my heart races when you enter the room.",
  "Your endless patience and grace.",
  "The countless memories we've built together.",
  "Your unwavering support in everything I do.",
  "The way you see the beauty in small things.",
  "Your unique, irreplaceable spark.",
  "Because you are Layka, and there is no one else like you."
];

const lines21 = [
  "I remember the first time I saw you.",
  "Time seemed to slow down completely.",
  "Every moment since then has been a gift.",
  "You brought a light I never knew I was missing.",
  "In your eyes, I found a home.",
  "Through every laugh and quiet silence.",
  "You became my favorite part of the day.",
  "And as you turn twenty-one today,",
  "I want to pause and take it all in.",
  "The woman you are becoming.",
  "The dreams you are building.",
  "The beauty you carry so effortlessly.",
  "I promise to stand by your side.",
  "To celebrate every victory, big or small.",
  "To hold you when the world feels heavy.",
  "To protect your heart above all else.",
  "To cherish the chapters we've written.",
  "And eagerly await the ones to come.",
  "You are my greatest adventure.",
  "My most beautiful serendipity.",
  "My forever."
];

// --- MAIN PAGE ---
export default function BirthdayPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-25, 25]);
  const largeTextX = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
  const largeTextY = useTransform(smoothY, [-0.5, 0.5], [-50, 50]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [selectedImage, setSelectedImage] = useState<{id: string, src: string} | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [theme, setTheme] = useState("default");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <main className="w-full flex flex-col items-center">
      <AnimatePresence>
        {!hasEntered && <WelcomeScreen onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>
      
      {/* HEADER UTILITIES */}
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-end">
        <motion.div
          className="h-1 bg-[var(--text-main)] origin-left w-full"
          style={{ scaleX }}
        />
        <motion.div 
          className="mt-4 mr-4 md:mr-8 flex items-center gap-2 pointer-events-auto"
          initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 bg-[var(--bg-primary)]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--accent)]/20 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--text-main)]/50">
              3 Min Read
            </p>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="relative flex items-center justify-center w-12 h-12 md:w-8 md:h-8 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--accent)]/20 shadow-sm text-[var(--text-main)]/50 hover:text-[var(--text-main)] hover:border-[var(--accent)] transition-all after:content-[''] after:absolute after:-inset-4 md:after:inset-0"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </motion.div>
      </div>

      {/* SECTION 1 — HERO */}
      <section
        id="hero"
        className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      >
        <motion.div 
          className="absolute -inset-[50px] bg-gradient-to-b from-[var(--bg-secondary)]/30 to-transparent pointer-events-none z-0" 
          style={{ x: bgX, y: bgY }}
        />
        <motion.div 
          className="absolute -top-10 -left-6 md:-left-20 text-[240px] md:text-[400px] font-serif leading-none text-[var(--bg-secondary)]/60 select-none pointer-events-none z-0"
          style={{ x: largeTextX, y: largeTextY }}
        >
          21
        </motion.div>

        <Particles />
        
        <div className="z-10 flex flex-col items-center px-4 text-center">
          <motion.p
            className="tracking-[0.3em] text-sm md:text-base font-sans text-[var(--text-main)]/40 font-bold mb-10 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          >
            23 · 08 · 2026
          </motion.p>

          <motion.p
            className="font-serif text-xl md:text-2xl italic text-[var(--text-main)]/60 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          >
            I made something for you...
          </motion.p>

          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl italic leading-[0.9] text-[var(--text-main)] mb-6 drop-shadow-sm ml-4"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          >
            Layka
          </motion.h1>

          <motion.p
            className="font-serif text-2xl text-[var(--accent)] mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.2 }}
          >
            21
          </motion.p>

          <motion.button
            onClick={() => scrollTo("section2")}
            className="px-10 py-4 bg-[var(--text-main)] text-[var(--bg-primary)] text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-[var(--accent)] transition-colors duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 3 }}
          >
            Begin &rarr;
          </motion.button>
        </div>
      </section>

      {/* SECTION 2 — PHOTO 1 */}
      <section
        id="section2"
        className="w-full min-h-screen flex flex-col items-center justify-center py-32 bg-[var(--bg-primary)] px-4 md:px-8"
      >
        <motion.div
          className="relative w-full max-w-lg aspect-[4/5] bg-[var(--bg-secondary)] overflow-hidden border border-[var(--accent)]/30 shadow-sm mb-16"
          {...scaleImage}
        >
          <img
            src="/photos/layka-01.jpg"
            alt="Layka"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="text-center flex flex-col items-center">
          <motion.h2
            className="font-serif text-3xl md:text-5xl tracking-[0.2em] mb-4 text-[var(--text-main)] ml-2"
            {...fadeUp}
          >
            LAYKA
          </motion.h2>
          <motion.p
            className="font-serif text-lg md:text-2xl italic text-[var(--text-main)]/80"
            {...fadeUp}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
          >
            Happy Birthday, beautiful.
          </motion.p>
        </div>
      </section>

      {/* NEW SECTION — 21 LINES */}
      <section className="w-full py-40 bg-[var(--bg-secondary)]/10 px-4 flex flex-col items-center">
        <motion.p
          className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--text-main)]/40 font-bold mb-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          Chapter II
        </motion.p>
        
        <div className="w-full max-w-2xl flex flex-col gap-20 md:gap-32">
          {lines21.map((line, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <span className="block text-[10px] text-[var(--accent)] mb-4 font-bold tracking-widest">{idx + 1}</span>
              <p className="font-serif text-2xl md:text-4xl italic text-[var(--text-main)] leading-relaxed">
                {line}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — PHOTO 2 */}
      <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden px-6 md:px-24 py-32 bg-[var(--bg-primary)] gap-16 md:gap-24">
        <motion.div 
          className="w-full md:w-1/2 flex justify-start md:justify-end"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-md aspect-[3/4] bg-[var(--bg-secondary)] border border-[var(--accent)]/30 overflow-hidden">
            <img
              src="/photos/layka-02.jpg"
              alt="A moment"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 text-left md:text-left flex flex-col justify-center"
          initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        >
          <h2 className="font-serif text-3xl md:text-5xl italic mb-6 text-[var(--text-main)]">
            A Moment
          </h2>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-main)]/50 font-bold">
            I would keep forever.
          </p>
        </motion.div>
      </section>

      {/* NEW SECTION — 21 REASONS */}
      <section className="w-full py-40 bg-[var(--bg-primary)] px-4 md:px-8 flex flex-col items-center relative overflow-hidden">
        {/* Subtle huge 21 in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] md:text-[600px] font-serif italic text-[var(--bg-secondary)]/30 pointer-events-none select-none z-0">
          21
        </div>
        
        <div className="text-center mb-24 relative z-10 flex flex-col items-center">
          <motion.p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--text-main)]/40 font-bold mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            Chapter III
          </motion.p>
          <motion.h2
            className="font-serif text-4xl md:text-6xl italic text-[var(--text-main)]"
            {...fadeUp}
          >
            21 Reasons Why
          </motion.h2>
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {reasons21.map((reason, idx) => (
            <motion.div
              key={idx}
              className="bg-[var(--bg-secondary)]/50 p-8 border border-[var(--accent)]/30 flex flex-col gap-4 hover:bg-[var(--bg-secondary)] transition-colors duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: "easeOut" }}
            >
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-bold">No. {idx + 1}</span>
              <p className="font-serif text-lg md:text-xl italic text-[var(--text-main)]/80 leading-relaxed">
                {reason}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — PHOTO 3 */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center py-32 bg-[var(--bg-secondary)]/20 px-4 md:px-8">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.h2
            className="font-serif text-4xl md:text-6xl italic mb-6 text-[var(--text-main)] ml-2"
            {...fadeUp}
          >
            You
          </motion.h2>
          <motion.p
            className="font-serif text-xl md:text-3xl italic text-[var(--text-main)]/80"
            {...fadeUp}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
          >
            Make ordinary days feel special.
          </motion.p>
        </div>

        <motion.div
          className="relative w-full max-w-3xl aspect-[4/3] bg-[var(--bg-secondary)] border border-[var(--accent)]/30 overflow-hidden"
          {...fadeIn}
        >
          <img
            src="/photos/layka-03.jpg"
            alt="You"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* NEW SECTION — THE MOMENTS (GALLERY) */}
      <section className="w-full py-40 bg-[var(--bg-secondary)]/10 px-4 md:px-8 flex flex-col items-center">
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--text-main)]/40 font-bold mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            Chapter IV
          </motion.p>
          <motion.h2
            className="font-serif text-4xl md:text-6xl italic text-[var(--text-main)]"
            {...fadeUp}
          >
            The Moments
          </motion.h2>
        </div>

        <div className="w-full max-w-6xl mx-auto overflow-hidden relative group">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 px-4 md:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {galleryImages.map((item, idx) => (
              <motion.div
                key={item.id}
                layoutId={`gallery-${item.id}`}
                className="min-w-[85vw] md:min-w-[400px] snap-center shrink-0 relative aspect-[4/5] md:aspect-[3/4] cursor-pointer border border-[var(--accent)]/30 bg-[var(--bg-secondary)] group after:content-[''] after:absolute after:-inset-4 md:after:inset-0 after:z-20"
                onClick={() => setSelectedImage(item)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img src={item.src} alt="Gallery moment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[var(--text-main)]/0 group-hover:bg-[var(--text-main)]/40 transition-colors duration-500" />
                  
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-6 pt-16 text-center opacity-100 transition-opacity duration-700 pointer-events-none md:inset-0 md:justify-center md:bg-none md:pt-6 md:opacity-0 md:group-hover:opacity-100">
                    <p className="font-serif italic text-white text-lg md:text-xl drop-shadow-md transform translate-y-0 transition-transform duration-500 ease-out md:translate-y-4 md:group-hover:translate-y-0">
                      {item.caption}
                    </p>
                    <div className="h-px w-8 bg-white/80 my-4 transform scale-x-100 transition-transform duration-700 delay-100 md:scale-x-0 md:group-hover:scale-x-100" />
                    <p className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold text-white/80 transform translate-y-0 transition-transform duration-500 ease-out delay-75 md:translate-y-4 md:group-hover:translate-y-0">
                      {item.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-main)]/30 md:hidden">
              &larr; Swipe to view &rarr;
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-main)]/30 hidden md:block">
              &larr; Slide to view &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PHOTO 4 & LETTER */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center py-32 bg-[var(--bg-primary)] px-4 md:px-8">
        <motion.div
          className="relative w-full max-w-xl aspect-square md:aspect-[4/5] bg-[var(--bg-secondary)] border border-[var(--accent)]/30 overflow-hidden mb-20 md:mb-24"
          {...scaleImage}
        >
          <img
            src="/photos/layka-04.jpg"
            alt="For You"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          className="max-w-2xl w-full bg-[var(--bg-secondary)] p-10 md:p-16 border border-[var(--accent)]/30"
          {...fadeUp}
        >
          <div className="border-b border-[var(--text-main)]/10 pb-6 mb-8 text-center">
            <h3 className="font-serif text-3xl italic text-[var(--text-main)] ml-2">
              For You, Layka
            </h3>
          </div>
          
          <div className="font-serif text-lg md:text-xl leading-relaxed italic text-[var(--text-main)]/80 space-y-6">
            <p>Happy 21st Birthday, meri Layka ❤️🌙</p>
            
            <p>
              Aaj ka din hai khaas, kyunki aaj tum aayi thi is jahaan mein,<br />
              Aur Allah ne likh diya tha mera sukoon tumhare naam mein. ❤️
            </p>
            
            <p>
              Tumhari hasi meri khushi,<br />
              Tumhari baatein meri roshni,<br />
              Tum saath raho toh har gham lage halka,<br />
              Tum ho meri duaon ki sabse khoobsurat wajah, Layka. 🥹❤️
            </p>

            <p>
              Allah tumhari har dua ko qubool kare,<br />
              Har kadam par tumhari hifazat kare,<br />
              Tumhari zindagi khushiyon se bhar de,<br />
              Aur humare rishte ko halal mohabbat se amar kar de. 🤲🏻✨
            </p>

            <p>
              21 saal ki hui ho tum aaj,<br />
              Par mere liye tum ho kal bhi, aaj bhi, har andaaz. ❤️<br />
              Na sirf birthday par, har din tumhein chahunga,<br />
              InshaAllah, izzat aur duaon ke saath tumhara haath thaamunga. 🫶🏻
            </p>

            <p>
              Happy 21st, meri Layka, meri dua, meri khushi, meri jaan. ❤️🌙<br />
              Allah tumhein hamesha apni rehmat mein rakhe —<br />
              Aur agar naseeb mein hua, toh meri zindagi bhi tumhare naam kare. 🤍
            </p>

            <div className="mt-12 pt-8 text-right">
              <span className="text-xs not-italic uppercase tracking-widest font-bold text-[var(--text-main)]">
                — Shobaib
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NEW SECTION — POEM & NEXT CHAPTER */}
      <section className="w-full py-40 bg-[var(--bg-secondary)]/20 px-4 flex flex-col items-center text-center border-t border-[var(--accent)]/20">
        <motion.div
          className="max-w-3xl flex flex-col items-center mb-32"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[var(--text-main)]/40 font-bold mb-12">
            The Poem
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic text-[var(--text-main)] mb-12 leading-tight">
            Twenty-one years of light,<br/>
            grace woven into every step,<br/>
            a beautiful soul finding its way,<br/>
            and carrying mine along with it.
          </h2>
          <div className="w-px h-24 bg-[var(--accent)]/50 my-8"></div>
        </motion.div>

        <motion.div
          className="max-w-2xl flex flex-col items-center"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        >
          <span className="block text-[10px] uppercase tracking-[0.4em] text-[var(--text-main)]/40 font-bold mb-10">
            For The Next Chapter
          </span>
          <p className="font-serif text-xl md:text-2xl italic text-[var(--text-main)]/80 leading-relaxed mb-8">
            &quot;As you turn this page, I want you to know that my greatest promise is simply this: to be there. In the quiet moments and the loud victories, in the uncertainties and the triumphs.&quot;
          </p>
          <p className="font-serif text-lg md:text-xl text-[var(--text-main)]/60 leading-relaxed">
            Here&apos;s to the memories we&apos;ve made, the promises we hold, and the breathtaking future waiting for you.
          </p>
        </motion.div>
      </section>

      {/* SECTION 6 — FINAL REVEAL */}
      <section 
        className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]"
        onMouseEnter={() => setShowConfetti(true)}
      >
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0" 
          onViewportEnter={() => setShowConfetti(true)} 
        />
        
        {/* Cinematic Rings & Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.div
            className="absolute w-[300px] h-[300px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-tr from-[var(--bg-secondary)]/60 to-transparent blur-[80px] md:blur-[120px]"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 3, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute w-[320px] h-[320px] md:w-[750px] md:h-[750px] rounded-full border border-[var(--accent)]/20"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-[450px] h-[450px] md:w-[950px] md:h-[950px] rounded-full border border-[var(--accent)]/10"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <Particles />

        <div className="z-10 text-center flex flex-col items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-10"
          >
            <h2 className="font-serif text-4xl md:text-6xl italic text-[var(--text-main)] mb-3 ml-2">
              Happy
            </h2>
            <h2 className="font-serif text-4xl md:text-6xl italic text-[var(--text-main)] ml-2">
              Birthday
            </h2>
          </motion.div>

          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl italic leading-[0.9] text-[var(--text-main)] mb-8 ml-3"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
          >
            Layka
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1.6 }}
          >
            <LiveTimer />
          </motion.div>

          <motion.p
            className="tracking-[0.4em] text-[10px] md:text-xs font-sans font-bold text-[var(--text-main)]/40 uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 2.2 }}
          >
            Beautiful · Elegant · Forever
          </motion.p>
        </div>
      </section>
      
      {/* SECTION 7 — RSVP / ACKNOWLEDGEMENT */}
      <section className="w-full py-24 bg-[var(--bg-primary)] flex flex-col items-center justify-center border-t border-[var(--accent)]/10 relative z-20">
        <AnimatePresence mode="wait">
          {!acknowledged ? (
            <motion.button
              key="button"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAcknowledged(true)}
              className="min-h-[48px] px-8 py-3 border border-[var(--accent)]/50 rounded-full font-serif text-[11px] uppercase tracking-[0.3em] text-[var(--text-main)]/60 hover:bg-[var(--bg-secondary)]/30 hover:border-[var(--accent)] hover:text-[var(--text-main)]/90 transition-all duration-300"
            >
              Accept This Tribute
            </motion.button>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)]/50 border border-[var(--accent)]/30 flex items-center justify-center overflow-hidden">
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                  className="w-4 h-4 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              </div>
              <p className="font-serif italic text-lg text-[var(--text-main)]/70">
                Received with love.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {showConfetti && (
        <>
          <SubtleConfetti />
          <DriftingHearts />
        </>
      )}

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-primary)]/95 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
          >
            <motion.img
              layoutId={`gallery-${selectedImage.id}`}
              src={selectedImage.src}
              alt="Enlarged gallery moment"
              className="w-auto h-auto max-w-full max-h-full object-contain shadow-2xl border border-[var(--accent)]/20"
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center justify-center w-12 h-12 md:w-auto md:h-auto text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-main)]/60 hover:text-[var(--text-main)] transition-colors after:content-[''] after:absolute after:-inset-4 md:after:inset-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              aria-label="Close lightbox"
            >
              Close ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
      <FloatingQuote />
      <FloatingAudioPlayer autoPlayTrigger={hasEntered} theme={theme} />
    </main>
  );
}
