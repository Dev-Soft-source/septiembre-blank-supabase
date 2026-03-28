import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend Three.js classes for use in JSX
extend({ Points: THREE.Points, BufferGeometry: THREE.BufferGeometry, BufferAttribute: THREE.BufferAttribute, PointsMaterial: THREE.PointsMaterial });

function StarParticles() {
  const meshRef = useRef<THREE.Points>(null);
  
  const particleCount = 2000;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a tight cloud around the text
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
      
      // Very gentle, slow velocities for floating effect
      velocities[i3] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    
    return { positions, velocities };
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#FFEB3B',
      size: 0.4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Update positions with velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
      
      // Wrap around when particles drift too far to maintain cloud density
      if (positions[i3] > 7.5) positions[i3] = -7.5;
      if (positions[i3] < -7.5) positions[i3] = 7.5;
      if (positions[i3 + 1] > 4) positions[i3 + 1] = -4;
      if (positions[i3 + 1] < -4) positions[i3 + 1] = 4;
      if (positions[i3 + 2] > 1.5) positions[i3 + 2] = -1.5;
      if (positions[i3 + 2] < -1.5) positions[i3 + 2] = 1.5;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Very gentle rotation for subtle movement
    meshRef.current.rotation.z += 0.0005;
  });

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  );
}

interface StarfieldProps {
  className?: string;
}

export function Starfield({ className = "" }: StarfieldProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <StarParticles />
      </Canvas>
    </div>
  );
}