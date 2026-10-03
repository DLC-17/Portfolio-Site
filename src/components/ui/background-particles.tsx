"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useSeasonal } from "@/components/ui/seasonal-provider";
import { generateSphere, generateTargetShape } from "@/lib/seasonal/shapes";

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { theme, systemTheme } = useTheme();
  const { enabled, activeEvent } = useSeasonal();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(2500);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lower particle count on mobile devices to save battery and ensure 60fps
    if (window.innerWidth < 768) {
      setCount(800);
    }

    // Check prefers-reduced-motion for accessibility
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Determine the active target shape (Pumpkin, Tree, Snowflake, Leaf, Flower, Sun, Star, or default Cube)
  const activeShape = useMemo(() => {
    if (enabled && activeEvent?.particles.targetShape) {
      return activeEvent.particles.targetShape;
    }
    return "cube";
  }, [enabled, activeEvent]);

  // Base spherical positions (at top of page / scroll = 0)
  const spherePositions = useMemo(() => generateSphere(count), [count]);

  // Target 3D geometry assembled as the user scrolls
  const targetPositions = useMemo(
    () => generateTargetShape(activeShape, count),
    [activeShape, count]
  );

  // Initial array buffer
  const particles = useMemo(() => new Float32Array(spherePositions), [spherePositions]);

  // Seeds for subtle organic particle flutter while holding shape
  const seeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * Math.PI * 2;
    }
    return s;
  }, [count]);

  // Track scroll position
  const scrollRef = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Per-vertex colors based on active theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const tempColor = new THREE.Color();

    if (enabled && activeEvent) {
      const palette = activeEvent.particles.colors[isDark ? "dark" : "light"];
      for (let i = 0; i < count; i++) {
        let hex = palette[i % palette.length];
        // Ensure ambient snowfall particles are pure crystalline white / soft ice blue
        if (i >= count * 0.8 && activeEvent.particles.motion === "snowfall") {
          hex = isDark ? "#FFFFFF" : "#BAE6FD";
        }
        // Ensure ambient terminal rain particles are digital terminal green / cyan
        if (i >= count * 0.8 && activeEvent.particles.motion === "terminal") {
          hex = isDark ? (i % 2 === 0 ? "#10B981" : "#38BDF8") : (i % 2 === 0 ? "#059669" : "#0284C7");
        }
        tempColor.set(hex);
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }
    } else {
      // Default signature colors
      const defaultHex = isDark ? "#69FFE7" : "#9D2933";
      tempColor.set(defaultHex);
      for (let i = 0; i < count; i++) {
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }
    }
    return colors;
  }, [count, enabled, activeEvent, isDark]);

  // Sync color array on geometry
  useEffect(() => {
    if (!pointsRef.current) return;
    const colAttr = pointsRef.current.geometry.attributes.color;
    if (colAttr) {
      for (let i = 0; i < count * 3; i++) {
        (colAttr.array as Float32Array)[i] = colorArray[i];
      }
      colAttr.needsUpdate = true;
    }
  }, [colorArray, count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion) return;

    const isStationary = activeShape === "crest" || activeShape === "africa";

    if (isStationary) {
      // Keep Africa / Crest stationary and facing forward so geography and coastlines are crisp and readable
      pointsRef.current.rotation.y = 0;
      pointsRef.current.rotation.x = 0;
      pointsRef.current.rotation.z = 0;
    } else {
      // Continuous 3D turntable rotation around Y axis
      pointsRef.current.rotation.y += delta * 0.1;
      // Bounded gentle tilt on X axis so upright shapes (tree, pumpkin, etc.) always remain right-side up
      pointsRef.current.rotation.x = 0.08 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
      pointsRef.current.rotation.z = scrollRef.current * 0.08;
    }

    const scroll = scrollRef.current; // 0 to 1
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    const motion = activeEvent?.particles.motion || "default";
    const eventId = activeEvent?.id;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const seed = seeds[i];
      const isAmbientParticle = enabled && activeEvent && i >= count * 0.8;

      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;
      let ox = 0;
      let oy = 0;
      let oz = 0;

      if (isAmbientParticle) {
        // Dedicated atmospheric weather & celebratory particles layer
        if (motion === "snowfall") {
          // Continuous swirling snowfall (Christmas, Winter, Winter Solstice)
          const fallSpeed = 1.35;
          const fallSpan = 15;
          const rawY = (((seed * 15 - time * fallSpeed) % fallSpan) + fallSpan) % fallSpan - 7.5;
          const windSway = Math.sin(time * 0.8 + seed * 4) * 1.5;
          const windGust = Math.cos(time * 0.6 + seed * 3) * 1.2;
          targetX = ((seed * 13) % 12 - 6) + windSway;
          targetY = rawY;
          targetZ = ((seed * 9) % 8 - 4) + windGust;
        } else if (motion === "autumn-drift") {
          // Falling autumn leaves swaying and tumbling down (Thanksgiving, Autumn)
          const fallSpeed = 0.95;
          const fallSpan = 15;
          const rawY = (((seed * 15 - time * fallSpeed) % fallSpan) + fallSpan) % fallSpan - 7.5;
          const leafRock = time * 1.6 + seed * 5;
          const leafSwayX = Math.sin(leafRock) * 2.2 + ((seed * 11) % 12 - 6);
          const leafSwayZ = Math.cos(leafRock * 0.8) * 1.6 + ((seed * 7) % 8 - 4);
          targetX = leafSwayX;
          targetY = rawY;
          targetZ = leafSwayZ;
        } else if (motion === "embers") {
          // Eerie sparks and candlelight embers floating up into the night (Halloween)
          const riseSpeed = 1.5;
          const riseSpan = 15;
          const rawY = (((seed * 15 + time * riseSpeed) % riseSpan) + riseSpan) % riseSpan - 7.5;
          const emberX = Math.sin(time * 2.0 + seed * 6) * 1.2 + ((seed * 11) % 10 - 5);
          const emberZ = Math.cos(time * 1.7 + seed * 5) * 1.2 + ((seed * 7) % 8 - 4);
          targetX = emberX;
          targetY = rawY;
          targetZ = emberZ;
        } else if (motion === "confetti") {
          // Vibrant festive fiesta confetti swirling in dancing vortices (Cinco de Mayo)
          const fallSpeed = 1.15;
          const fallSpan = 15;
          const rawY = (((seed * 15 - time * fallSpeed) % fallSpan) + fallSpan) % fallSpan - 7.5;
          const vortexAngle = time * 2.2 + seed * Math.PI * 2;
          const vortexR = 2.6 + Math.sin(seed * 7) * 1.5;
          targetX = vortexR * Math.cos(vortexAngle);
          targetY = rawY;
          targetZ = vortexR * Math.sin(vortexAngle);
        } else if (motion === "spring-float") {
          // Floating cherry blossom sakura petals drifting lazily across the spring breeze
          const fallSpeed = 0.7;
          const fallSpan = 14;
          const rawY = (((seed * 14 - time * fallSpeed) % fallSpan) + fallSpan) % fallSpan - 7.0;
          const petalSwayX = Math.sin(time * 1.1 + seed * 4) * 2.0 + ((seed * 11) % 12 - 6);
          const petalSwayZ = Math.cos(time * 0.8 + seed * 3) * 1.8 + ((seed * 7) % 8 - 4);
          targetX = petalSwayX;
          targetY = rawY;
          targetZ = petalSwayZ;
        } else if (motion === "terminal") {
          // Falling matrix/terminal code stream (Programmers' Day, Linux Anniversary)
          const colCount = 28;
          const colIdx = i % colCount;
          const colX = (colIdx - colCount / 2) * 0.52;
          const colZ = (((seed * 37) % 1) - 0.5) * 4.5;
          const colSpeed = 3.8 + ((seed * 19) % 1) * 2.6;
          const fallSpan = 16.0;
          const rawY = (((seed * 16 - time * colSpeed) % fallSpan) + fallSpan) % fallSpan - 8.0;
          // Quantize Y into discrete digital terminal text rows!
          const stepY = Math.floor(rawY * 2.5) / 2.5;

          targetX = colX;
          targetY = stepY;
          targetZ = colZ;
          // High-frequency digital terminal pulse
          ox = (Math.sin(time * 25 + seed * 30) > 0.82 ? 0.04 : 0);
        } else if (motion === "fireworks") {
          // Staccato Firework POPS! Staggered explosions detonating at multiple burst points
          const popCenters = [
            { cx: 0.0, cy: 1.8, cz: 0.0, delay: 0.0 },
            { cx: -3.2, cy: 0.6, cz: 0.8, delay: 0.65 },
            { cx: 3.0, cy: 2.2, cz: -0.6, delay: 1.25 },
            { cx: -1.6, cy: -0.8, cz: -0.5, delay: 1.85 },
          ];

          const burstIdx = i % popCenters.length;
          const burst = popCenters[burstIdx];
          const cycleDuration = 2.4;
          const popTime = (time + burst.delay + (seed % 0.08)) % cycleDuration;
          const progress = popTime / cycleDuration; // 0 to 1

          const theta = ((seed * 31) % 1) * Math.PI * 2;
          const phi = Math.acos(((seed * 47) % 2) - 1);

          if (progress < 0.12) {
            // 1. THE POP! Sudden explosive blast velocity radiating outward
            const blastProgress = progress / 0.12;
            const popRadius = Math.pow(blastProgress, 0.3) * 3.4;
            targetX = burst.cx + popRadius * Math.sin(phi) * Math.cos(theta);
            targetY = burst.cy + popRadius * Math.cos(phi);
            targetZ = burst.cz + popRadius * Math.sin(phi) * Math.sin(theta);
            ox = (Math.random() - 0.5) * 0.15;
            oy = (Math.random() - 0.5) * 0.15;
            oz = (Math.random() - 0.5) * 0.15;
          } else if (progress < 0.82) {
            // 2. Expansion, crackle, and willow gravity drop
            const expandProgress = (progress - 0.12) / 0.70;
            const popRadius = 3.4 + expandProgress * 1.0;
            const willowDrop = -Math.pow(expandProgress, 1.8) * 1.6;
            targetX = burst.cx + popRadius * Math.sin(phi) * Math.cos(theta);
            targetY = burst.cy + popRadius * Math.cos(phi) + willowDrop;
            targetZ = burst.cz + popRadius * Math.sin(phi) * Math.sin(theta);
            // Pyrotechnic crackle shimmer
            ox = Math.sin(time * 30 + seed * 20) * 0.08;
            oy = Math.cos(time * 25 + seed * 18) * 0.08;
            oz = Math.sin(time * 28 + seed * 15) * 0.08;
          } else {
            // 3. Smoke embers / reset rocket trail
            const trailProgress = (progress - 0.82) / 0.18;
            targetX = burst.cx + (seed % 0.4 - 0.2);
            targetY = burst.cy - 3.5 + trailProgress * 3.5;
            targetZ = burst.cz + (seed % 0.4 - 0.2);
          }
        } else {
          // Default cosmic sparkles orbit
          const orbitR = 3.8 + Math.sin(time * 0.5 + seed * 3) * 1.2;
          const orbitAngle = time * 0.45 + seed * Math.PI * 2;
          targetX = orbitR * Math.cos(orbitAngle);
          targetY = Math.sin(time * 0.7 + seed * 4) * 3.5;
          targetZ = orbitR * Math.sin(orbitAngle);
        }

        // Seamless wrap-around teleport to prevent streaking across screen when wrapping boundary
        if (Math.abs(targetY - positions[idx + 1]) > 8.0) {
          positions[idx] = targetX;
          positions[idx + 1] = targetY;
          positions[idx + 2] = targetZ;
        }
      } else {
        // Shape particles: smoothly morph from initial sphere to the holiday 3D target shape
        const baseTargetX = spherePositions[idx] * (1 - scroll) + targetPositions[idx] * scroll;
        const baseTargetY = spherePositions[idx + 1] * (1 - scroll) + targetPositions[idx + 1] * scroll;
        const baseTargetZ = spherePositions[idx + 2] * (1 - scroll) + targetPositions[idx + 2] * scroll;

        targetX = baseTargetX;
        targetY = baseTargetY;
        targetZ = baseTargetZ;

        // Holiday-specific living behaviors on the 3D shape:
        if (enabled && activeEvent) {
          if (eventId === "christmas") {
            // Christmas Tree Ornament Twinkle: baubles twinkle with varied color/phase!
            if (i % 3 === 0) {
              ox = Math.sin(time * 4.8 + seed * 11) * 0.12;
              oy = Math.cos(time * 4.2 + seed * 9) * 0.12;
              oz = Math.sin(time * 4.5 + seed * 7) * 0.12;
            } else {
              // Gentle bough sway
              ox = Math.sin(time * 1.2 + targetPositions[idx + 1]) * 0.04;
            }
          } else if (eventId === "thanksgiving") {
            // Turkey tail feather rustle and gentle breathing
            const isTail = targetPositions[idx + 2] < -0.55;
            if (isTail) {
              oz = Math.sin(time * 2.5 + seed * 4) * 0.06;
              oy = Math.cos(time * 2.0 + seed * 3) * 0.03;
            } else {
              oy = Math.sin(time * 1.5 + targetPositions[idx]) * 0.03;
            }
          } else if (eventId === "new-year") {
            // Handheld Firework Sparkler crackling sputtering burning head
            // Particles with y > 0.8 are incandescent sparks shooting from the burning tip!
            if (targetPositions[idx + 1] > 0.8) {
              const crackle = Math.sin(time * 42 + seed * 25) * 0.14;
              ox = (seed % 2 > 1 ? crackle : -crackle) + (Math.random() - 0.5) * 0.08;
              oy = Math.cos(time * 36 + seed * 20) * 0.12 + (Math.random() - 0.5) * 0.08;
              oz = (seed % 3 > 1 ? crackle : -crackle) + (Math.random() - 0.5) * 0.08;
            } else {
              // Steady metallic wire rod
              ox = Math.sin(time * 1.5) * 0.01;
            }
          } else if (eventId === "diwali") {
            // Sacred diya flame flicker and wick dance
            if (targetPositions[idx + 1] > -0.85) {
              ox = Math.sin(time * 8.5 + seed * 5) * 0.09;
              oz = Math.cos(time * 7.5 + seed * 4) * 0.09;
              oy = Math.sin(time * 5.0 + seed * 3) * 0.04;
            }
          } else if (eventId === "summer" || eventId === "summer-solstice") {
            // Solar corona heat shimmer waves radiating outwards
            const rDist = Math.hypot(targetPositions[idx], targetPositions[idx + 1]);
            const heatWave = Math.sin(time * 3.2 - rDist * 2.2) * 0.12;
            ox = (targetPositions[idx] / Math.max(0.1, rDist)) * heatWave;
            oy = (targetPositions[idx + 1] / Math.max(0.1, rDist)) * heatWave;
          } else if (eventId === "juneteenth") {
            // Radiant freedom nova pulse
            const novaPulse = Math.sin(time * 2.2) * 0.08;
            ox = targetPositions[idx] * novaPulse;
            oy = targetPositions[idx + 1] * novaPulse;
          } else if (eventId === "halloween") {
            // Jack-o'-lantern candlelight flicker
            oy = Math.sin(time * 6.5 + seed * 4) * 0.06;
            ox = Math.cos(time * 5.5 + seed * 3) * 0.05;
          } else if (eventId === "st-patricks") {
            // Clover lucky golden shimmer
            ox = Math.sin(time * 3.0 + seed * 4) * 0.06;
            oy = Math.cos(time * 2.5 + seed * 5) * 0.06;
          } else if (eventId === "cinco-de-mayo") {
            // Sombrero festive fiesta flutter
            ox = Math.sin(time * 3.5 + seed * 6) * 0.06;
            oy = Math.cos(time * 3.0 + seed * 5) * 0.06;
          } else if (eventId === "linux-anniversary") {
            // Playful penguin breathing / waddle flutter
            oy = Math.sin(time * 2.2 + seed * 3) * 0.04;
          } else {
            // Standard organic flutter
            const flutterAmp = isStationary ? 0.02 : 0.08;
            ox = Math.sin(time * 1.5 + seed) * flutterAmp;
            oy = Math.cos(time * 1.2 + seed) * flutterAmp;
            oz = Math.sin(time * 1.0 + seed * 2) * flutterAmp;
          }
        }
      }

      // Smooth LERP interpolation towards calculated position
      const lerpSpeed = isAmbientParticle ? 0.09 : 0.1;
      positions[idx] += (targetX + ox - positions[idx]) * lerpSpeed;
      positions[idx + 1] += (targetY + oy - positions[idx + 1]) * lerpSpeed;
      positions[idx + 2] += (targetZ + oz - positions[idx + 2]) * lerpSpeed;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!mounted) return null;

  const particleSize = enabled && activeEvent ? activeEvent.particles.size : 0.03;
  const particleOpacity = enabled && activeEvent ? activeEvent.particles.opacity : 0.4;

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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colorArray}
          itemSize={3}
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={particleOpacity}
        depthWrite={false}
      />
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
