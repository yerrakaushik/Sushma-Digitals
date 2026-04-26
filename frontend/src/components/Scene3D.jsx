import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';

function CameraModel({ scroll }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2 + scroll * 2;
      meshRef.current.position.y = Math.sin(time) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow>
        <boxGeometry args={[1, 0.6, 0.4]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.3, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.3, 0, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial color="#444" metalness={1} roughness={0} />
      </mesh>
      <mesh position={[-0.3, 0.35, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function Scene3D({ scroll = 0 }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CameraModel scroll={scroll} />
        </Float>
      </Canvas>
    </div>
  );
}
