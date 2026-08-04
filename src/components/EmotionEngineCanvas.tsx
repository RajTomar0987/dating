import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles, Ring, Line, Text, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

export interface EmotionOrbNode {
  id: string;
  name: string;
  score: number;
  sub: string;
  color: string;
  pos: [number, number, number];
}

export const EMOTION_ORB_NODES: EmotionOrbNode[] = [
  { id: 'e1', name: 'Trust Index', score: 99, sub: 'Deep Psychological Safety', color: '#10B981', pos: [2.8, 1.6, 1.2] },
  { id: 'e2', name: 'Joy & Vibe', score: 98, sub: 'High Shared Laughter', color: '#F59E0B', pos: [-2.8, 1.8, -1.0] },
  { id: 'e3', name: 'Love & Passion', score: 97, sub: 'Peak Romance Resonance', color: '#EC4899', pos: [3.2, -1.5, -1.2] },
  { id: 'e4', name: 'Empathy Sync', score: 96, sub: 'Active Transparency', color: '#06B6D4', pos: [-2.6, -1.6, 1.2] },
  { id: 'e5', name: 'Curiosity', score: 95, sub: 'Deep Intellectual Engagement', color: '#A855F7', pos: [0, 2.8, -2.2] },
  { id: 'e6', name: 'Calm & Stability', score: 94, sub: 'Zero Conflict Vectors', color: '#3B82F6', pos: [0, -2.8, -1.8] }
];

// SECTION 1: Central 3D Emotion Core
function CentralEmotionCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.25;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.8}>
        <Sphere ref={coreRef} args={[1.4, 32, 32]}>
          <MeshDistortMaterial
            color="#EC4899"
            emissive="#A855F7"
            emissiveIntensity={0.8}
            distort={0.45}
            speed={3.5}
            roughness={0.05}
          />
        </Sphere>
      </Float>

      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#EC4899" wireframe />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#10B981" wireframe />
      </mesh>

      <Text position={[0, -1.8, 0]} fontSize={0.28} color="#FFFFFF">
        EMOTION CORE (98%)
      </Text>
      <Sparkles count={80} scale={6} size={4} color="#EC4899" />
    </group>
  );
}

// SECTION 2: Floating Emotion Spheres
function FloatingEmotionSphere({ 
  node, 
  onSelect 
}: { 
  node: EmotionOrbNode; 
  onSelect: (node: EmotionOrbNode) => void; 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5} position={node.pos}>
      <group ref={groupRef} onClick={() => onSelect(node)}>
        <Sphere args={[0.85, 32, 32]}>
          <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.7} roughness={0.1} />
        </Sphere>

        <Ring args={[1.1, 1.15, 32]}>
          <meshBasicMaterial color={node.color} side={THREE.DoubleSide} />
        </Ring>

        <Text position={[0, 1.2, 0]} fontSize={0.26} color="#FFFFFF">
          {node.name}
        </Text>
        <Text position={[0, -1.2, 0]} fontSize={0.22} color={node.color}>
          {node.score}% RESONANCE
        </Text>
      </group>
    </Float>
  );
}

// SECTION 3: Neural Connection Lines
function NeuralConnections() {
  const lines = useMemo(() => {
    return EMOTION_ORB_NODES.map(node => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(...node.pos)
    ]);
  }, []);

  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#10B981" lineWidth={3} transparent opacity={0.6} />
      ))}
      <Sparkles count={80} scale={7} size={3} color="#10B981" />
    </>
  );
}

// MAIN 3D EMOTION ENGINE CANVAS CONTROLLER
interface EmotionEngineCanvasProps {
  scrollY: number;
  selectedNode: EmotionOrbNode | null;
  onSelectNode: (node: EmotionOrbNode) => void;
}

export default function EmotionEngineCanvas({
  scrollY,
  selectedNode,
  onSelectNode
}: EmotionEngineCanvasProps) {
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

        <CentralEmotionCore />

        {EMOTION_ORB_NODES.map((node) => (
          <FloatingEmotionSphere key={node.id} node={node} onSelect={onSelectNode} />
        ))}

        <NeuralConnections />

        <SceneCameraRig targetY={targetCamY} reducedMotion={reducedMotion} />

        <EffectComposer>
          <Bloom intensity={1.3} luminanceThreshold={0.2} luminanceSmoothing={0.85} />
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
