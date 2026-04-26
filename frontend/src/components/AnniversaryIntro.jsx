import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Center } from '@react-three/drei';

// A high-quality 3D Camera component built with Three.js primitives
const ThreeDCamera = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group rotation={[0.1, 0, 0]}> {/* Points lens directly at user */}
        {/* Camera Body - Main Block */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.4, 0.8]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
        </mesh>
        
        {/* Top Viewfinder/Flash Housing */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.7]} />
          <meshStandardMaterial color="#080808" metalness={1} />
        </mesh>

        {/* Right Side Grip (User's left when facing) */}
        <mesh position={[1.1, -0.1, 0.1]}>
          <boxGeometry args={[0.4, 1.2, 0.9]} />
          <meshStandardMaterial color="#050505" roughness={1} />
        </mesh>

        {/* Lens Mount (Silver Ring) */}
        <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.1, 32]} />
          <meshStandardMaterial color="#444" metalness={1} roughness={0.1} />
        </mesh>

        {/* Lens Barrel */}
        <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.8, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Focus Ring (Ribbed texture look) */}
        <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.2, 32]} />
          <meshStandardMaterial color="#111" roughness={1} />
        </mesh>

        {/* Lens Glass Container */}
        <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
          <meshStandardMaterial color="#000" metalness={1} />
        </mesh>

        {/* The "Eye" - Glass Element with reflection */}
        <mesh position={[0, 0, 1.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.02, 32]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            emissive="#2233ff" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.6} 
            roughness={0}
          />
        </mesh>

        {/* Flash Glass (Top) */}
        <mesh position={[0, 0.85, 0.36]}>
          <boxGeometry args={[0.5, 0.2, 0.05]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={5} />
        </mesh>

        {/* Mode Dial */}
        <mesh position={[-0.6, 0.75, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#111" metalness={1} />
        </mesh>

        {/* Shutter Button (Gold) */}
        <mesh position={[0.8, 0.7, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#C9A84C" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

const AnniversaryIntro = ({ onFinish }) => {
  const [phase, setPhase] = useState('idle'); // idle, counting, capturing, quote, finished
  const [count, setCount] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle Countdown
  useEffect(() => {
    if (phase === 'counting') {
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('capturing');
      }
    }
  }, [count, phase]);

  // Handle Capture Sequence
  useEffect(() => {
    if (phase === 'capturing') {
      const timer = setTimeout(() => {
        setPhase('quote');
        setShowConfetti(true);
      }, 2500); // Trigger flash and quote
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 'finished') return null;

  // Reliable CSS Noise
  const noiseCls = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Fixed Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-[10005]" 
           style={noiseCls} />

      {/* Confetti Particles */}
      {showConfetti && (
        <div className="absolute inset-0 z-[10008] pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                top: "50%", 
                left: "50%", 
                scale: 0,
                rotate: 0 
              }}
              animate={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                rotate: 360,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 bg-[#C9A84C] rounded-sm"
              style={{ boxShadow: '0 0 10px #C9A84C' }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* PHASE: IDLE - Launch Button */}
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-[#C9A84C] font-syne text-sm tracking-[0.4em] uppercase mb-4">
                Special Anniversary Presentation
              </h2>
              <div className="h-[1px] w-12 bg-[#C9A84C]/30 mx-auto" />
            </motion.div>

            <motion.button
              onClick={() => setPhase('counting')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-16 py-8 bg-transparent transition-all duration-500"
            >
              <div className="absolute inset-0 border border-[#C9A84C]/20 group-hover:border-[#C9A84C] transition-colors duration-700" />
              <div className="absolute inset-0 bg-[#C9A84C]/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <span className="relative z-10 text-[#C9A84C] font-display text-6xl tracking-[0.2em] group-hover:text-white transition-colors duration-500">
                LAUNCH
              </span>
              <div className="absolute -inset-4 bg-[#C9A84C]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.button>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1 }}
              className="mt-12 text-white font-inter uppercase text-[10px] tracking-[0.3em]"
            >
              Click to begin the experience
            </motion.p>
          </motion.div>
        )}

        {/* PHASE: COUNTING */}
        {phase === 'counting' && (
          <motion.div
            key="counting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            className="relative z-10"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={count}
                initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 2, opacity: 0, rotateX: -90 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-[#C9A84C] font-display text-[18rem] md:text-[25rem] leading-none select-none"
              >
                {count}
              </motion.h1>
            </AnimatePresence>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-[#C9A84C] rounded-full blur-[120px] -z-10"
            />
          </motion.div>
        )}

        {/* PHASE: CAPTURING - 3D Camera Scene */}
        {phase === 'capturing' && (
          <motion.div
            key="capturing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <Canvas 
              shadows={window.innerWidth > 768} 
              dpr={window.innerWidth > 768 ? [1, 2] : 1}
              gl={{ antialias: window.innerWidth > 768 }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
              <ambientLight intensity={0.5} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1} 
                intensity={window.innerWidth > 768 ? 2 : 1.5} 
                castShadow={window.innerWidth > 768} 
              />
              <pointLight position={[-10, -10, -10]} intensity={1} />
              {/* Front Light to see the lens */}
              <directionalLight position={[0, 0, 5]} intensity={1.5} />
              
              <Center scale={window.innerWidth > 768 ? 1 : 0.8}>
                <ThreeDCamera />
              </Center>

              <Environment preset="studio" />
            </Canvas>

            {/* Cinematic Overlay Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-1/4 w-full text-center"
            >
              <p className="text-[#C9A84C] font-syne tracking-[1em] text-xs uppercase animate-pulse">
                Smile for the camera
              </p>
            </motion.div>
            
            {/* Flash Effect - Fast and powerful */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ times: [0, 0.1, 0.2, 1], duration: 0.6, delay: 2.2 }}
              className="absolute inset-0 bg-white z-[10010]"
            />
          </motion.div>
        )}

        {/* PHASE: QUOTE */}
        {phase === 'quote' && (
          <motion.div
            key="quote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="text-center px-6 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <h1 className="text-[#FEFDF7] font-serif italic text-3xl md:text-6xl mb-12 leading-tight tracking-tight">
                "Capturing Movements, <br />
                <span className="text-[#C9A84C]">Preserving Memories"</span>
              </h1>
              
              <div className="h-[1px] w-24 bg-[#C9A84C]/50 mx-auto mb-12" />

              <motion.button
                onClick={onFinish}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                whileHover={{ letterSpacing: '0.8em', color: '#fff' }}
                className="text-[#C9A84C] font-syne font-bold tracking-[0.5em] uppercase text-sm border border-[#C9A84C]/30 px-8 py-4 hover:border-white transition-all duration-500"
              >
                Enter the Gallery
              </motion.button>
            </motion.div>
            <div className="absolute inset-0 bg-radial-gradient from-[#C9A84C]/5 to-transparent -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnniversaryIntro;
