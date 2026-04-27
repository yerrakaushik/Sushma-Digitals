import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Center } from '@react-three/drei';

// A high-quality 3D Camera component built with Three.js primitives
const ThreeDCamera = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const segs = isMobile ? 12 : 32; // Lower detail for mobile performance

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group rotation={[0.1, 0, 0]}>
        {/* Camera Body */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.4, 0.8]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
        </mesh>
        
        {/* Top Viewfinder */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.7]} />
          <meshStandardMaterial color="#080808" metalness={1} />
        </mesh>

        {/* Grip */}
        <mesh position={[1.1, -0.1, 0.1]}>
          <boxGeometry args={[0.4, 1.2, 0.9]} />
          <meshStandardMaterial color="#050505" roughness={1} />
        </mesh>

        {/* Lens Mount */}
        <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.1, segs]} />
          <meshStandardMaterial color="#444" metalness={1} roughness={0.1} />
        </mesh>

        {/* Lens Barrel */}
        <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.8, segs]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Focus Ring */}
        <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.2, segs]} />
          <meshStandardMaterial color="#111" roughness={1} />
        </mesh>

        {/* Lens Glass Container */}
        <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, segs]} />
          <meshStandardMaterial color="#000" metalness={1} />
        </mesh>

        {/* The "Eye" */}
        <mesh position={[0, 0, 1.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.02, segs]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            emissive="#2233ff" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.6} 
            roughness={0}
          />
        </mesh>

        {/* Flash Glass */}
        <mesh position={[0, 0.85, 0.36]}>
          <boxGeometry args={[0.5, 0.2, 0.05]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={5} />
        </mesh>

        {/* Mode Dial */}
        <mesh position={[-0.6, 0.75, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, isMobile ? 8 : 16]} />
          <meshStandardMaterial color="#111" metalness={1} />
        </mesh>

        {/* Shutter Button */}
        <mesh position={[0.8, 0.7, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, isMobile ? 8 : 16]} />
          <meshStandardMaterial color="#C9A84C" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

const AnniversaryIntro = ({ onFinish }) => {
  const [phase, setPhase] = useState('capturing'); // capturing, quote, finished
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle Capture Sequence
  useEffect(() => {
    if (phase === 'capturing') {
      const timer = setTimeout(() => {
        setPhase('quote');
        setShowConfetti(true);
      }, 3500); // Give time for 3D model to be admired
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle Auto-Finish after Quote
  useEffect(() => {
    if (phase === 'quote') {
      const timer = setTimeout(() => {
        onFinish();
      }, 4000); // 4 seconds for quote
      return () => clearTimeout(timer);
    }
  }, [phase, onFinish]);

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
        {/* PHASE: CAPTURING - 3D Camera Scene */}
        {phase === 'capturing' && (
          <motion.div
            key="capturing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <Canvas 
              shadows={false} 
              dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : [1, 2]}
              gl={{ 
                antialias: typeof window !== 'undefined' && window.innerWidth >= 768,
                powerPreference: "high-performance",
                alpha: true
              }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
              <ambientLight intensity={0.8} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1} 
                intensity={1.5} 
              />
              <pointLight position={[-10, -10, -10]} intensity={1} />
              {/* Front Light to see the lens */}
              <directionalLight position={[0, 0, 5]} intensity={1.2} />
              
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
              transition={{ times: [0, 0.1, 0.2, 1], duration: 0.6, delay: 3.2 }}
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

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="text-white font-inter uppercase text-[10px] tracking-[0.3em]"
              >
                Entering Legacy...
              </motion.p>
            </motion.div>
            <div className="absolute inset-0 bg-radial-gradient from-[#C9A84C]/5 to-transparent -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnniversaryIntro;
