import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles, Ring, Line, Text, Stars, Torus } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

export interface TwinTelemetryRing {
  name: string;
  radius: number;
  color: string;
  score: number;
}

export const TWIN_RINGS: TwinTelemetryRing[] = [
  { name: 'Trust Index', radius: 2.2, color: '#10B981', score: 99 },
  { name: 'Communication', radius: 2.6, color: '#3B82F6', score: 94 },
  { name: 'Emotion Resonance', radius: 3.0, color: '#EC4899', score: 98 },
  { name: 'Growth Trajectory', radius: 3.4, color: '#A855F7', score: 95 },
  { name: 'Lifestyle Alignment', radius: 3.8, color: '#F59E0B', score: 92 },
  { name: 'Future Projection', radius: 4.2, color: '#06B6D4', score: 96 }
];

// SECTION 1: Central Digital Twin Shader Core
function DigitalTwinCore() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.25;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={3} rotationIntensity={1.8} floatIntensity={2}>
        <Sphere ref={coreRef} args={[1.4, 64, 64]}>
          <MeshDistortMaterial
            color="#EC4899"
            emissive="#A855F7"
            emissiveIntensity={0.85}
            distort={0.5}
            speed={4}
            roughness={0.05}
          />
        </Sphere>
      </Float>

      <Text position={[0, -1.8, 0]} fontSize={0.28} color="#FBCFE8">
        AI RELATIONSHIP TWIN (98%)
      </Text>
      <Sparkles count={90} scale={6} size={4} color="#EC4899" />
    </group>
  );
}

// SECTION 2: 6 Live Concentric Telemetry Rings
function TelemetryRingMesh({ ring, index }: { ring: TwinTelemetryRing; index: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (0.3 + index * 0.1);
      ringRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[ring.radius, 0.02, 16, 120]} />
      <meshBasicMaterial color={ring.color} wireframe />
    </mesh>
  );
}

// SECTION 3: Animated 3D DNA Double Helix
function AIDNAHelix() {
  const groupRef = useRef<THREE.Group>(null);

  const { strand1, strand2 } = useMemo(() => {
    const pts1 = [];
    const pts2 = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * Math.PI * 4;
      const y = -4 + (i / 60) * 8;
      const x1 = Math.sin(t) * 1.8;
      const z1 = Math.cos(t) * 1.8;
      const x2 = Math.sin(t + Math.PI) * 1.8;
      const z2 = Math.cos(t + Math.PI) * 1.8;
      pts1.push(new THREE.Vector3(x1, y, z1));
      pts2.push(new THREE.Vector3(x2, y, z2));
    }
    return { strand1: pts1, strand2: pts2 };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Line points={strand1} color="#A855F7" lineWidth={3} />
      <Line points={strand2} color="#EC4899" lineWidth={3} />
    </group>
  );
}

// SECTION 4: Life Path Spatial Trend Line (Past -> Present -> Future)
function LifePathLine() {
  const pathPoints = useMemo(() => [
    new THREE.Vector3(-4.5, -2, -3),
    new THREE.Vector3(-2.2, -1, -1),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2.2, 1, 1),
    new THREE.Vector3(4.5, 2, 3)
  ], []);

  return (
    <>
      <Line points={pathPoints} color="#10B981" lineWidth={4} />
      <Sparkles count={70} scale={7} size={3.5} color="#10B981" />
    </>
  );
}

// MAIN 3D DIGITAL TWIN CANVAS CONTROLLER
interface DigitalTwinCanvasProps {
  scrollY: number;
  selectedRing: TwinTelemetryRing | null;
  onSelectRing: (ring: TwinTelemetryRing) => void;
}

export default function DigitalTwinCanvas({
  scrollY,
  selectedRing,
  onSelectRing
}: DigitalTwinCanvasProps) {
  const { reducedMotion } = useAppStore();
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    };
  };

  const targetCamY = useMemo(() => {
    const progress = Math.min(1, Math.max(0, scrollY / 2000));
    return 1.0 - progress * 7;
  }, [scrollY]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 1.0, 8.5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.9} color="#EC4899" />

        <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={1.5} />

        <DigitalTwinCore />

        {TWIN_RINGS.map((ring, idx) => (
          <TelemetryRingMesh key={ring.name} ring={ring} index={idx} />
        ))}

        <AIDNAHelix />
        <LifePathLine />

        <SceneCameraRig targetY={targetCamY} reducedMotion={reducedMotion} />

        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function SceneCameraRig({ targetY, reducedMotion }: { targetY: number; reducedMotion: boolean }) {
  useFrame((state) => {
    if (!reducedMotion) {
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
      state.camera.lookAt(0, state.camera.position.y - 0.3, 0);
    }
  });

  return null;
}
