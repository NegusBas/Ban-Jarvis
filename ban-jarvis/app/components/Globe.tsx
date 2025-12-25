'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2; // Slow rotation
    }
  });

  return (
    <Sphere args={[1, 32, 32]} ref={meshRef} scale={[2.5, 2.5, 2.5]}>
      <meshBasicMaterial 
        color="#00f3ff" 
        wireframe 
        transparent 
        opacity={0.15} 
      />
    </Sphere>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingGlobe />
      </Canvas>
    </div>
  );
}

