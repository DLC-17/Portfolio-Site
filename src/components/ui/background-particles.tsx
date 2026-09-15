"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(3000);
  
  useEffect(() => {
    setMounted(true);
    // Lower particle count on mobile devices to save battery and ensure 60fps
    if (window.innerWidth < 768) {
      setCount(800);
    }
  }, []);
  
  // Base random positions (sphere)
  const spherePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 5 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  // Target cube positions
  const cubePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const size = 6;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * size;
      pos[i * 3 + 1] = (Math.random() - 0.5) * size;
      pos[i * 3 + 2] = (Math.random() - 0.5) * size;
    }
    return pos;
  }, [count]);

  // Current array we will update
  const particles = useMemo(() => new Float32Array(spherePositions), [spherePositions]);

  // Keep track of scroll manually
  const scrollRef = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Rotate the whole system slowly
    pointsRef.current.rotation.y += delta * 0.1;
    pointsRef.current.rotation.x += delta * 0.05;

    // Interpolate positions based on scroll
    const scroll = scrollRef.current; // 0 to 1
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // LERP from sphere to cube
      positions[idx] += ( (spherePositions[idx] * (1 - scroll) + cubePositions[idx] * scroll) - positions[idx] ) * 0.1;
      positions[idx+1] += ( (spherePositions[idx+1] * (1 - scroll) + cubePositions[idx+1] * scroll) - positions[idx+1] ) * 0.1;
      positions[idx+2] += ( (spherePositions[idx+2] * (1 - scroll) + cubePositions[idx+2] * scroll) - positions[idx+2] ) * 0.1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const color = currentTheme === "dark" ? "#69FFE7" : "#9D2933";

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.4} />
    </points>
  );
}

export function BackgroundParticles() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
