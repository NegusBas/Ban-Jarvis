"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function RotatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15; // Constant rotation
    }
  });

  return (
    <Sphere args={[2.5, 32, 32]} ref={meshRef}>
      {/* Wireframe Effect */}
      <meshStandardMaterial
        color="#00f3ff"
        wireframe={true}
        transparent={true}
        opacity={0.15}
        emissive="#00f3ff"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

export default function Globe() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#00f3ff" intensity={2} />
        <RotatingGlobe />
      </Canvas>
    </div>
  );
}