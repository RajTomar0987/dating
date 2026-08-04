import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles, Ring, Line, Text, Stars, Icosahedron } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

export interface MemoryPlanetNode {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  detail: string;
  color: string;
  pos: [number, number, number];
  isVoice?: boolean;
}

export const GALAXY_MEMORY_NODES: MemoryPlanetNode[] = [
  { id: 'gm1', title: 'First Oat Cortado Date', category: 'Coffee', date: 'Oct 15', location: 'Sightglass Coffee, SF', detail: 'Exchanged 2 hours of stories over artisan cortados.', color: '#F59E0B', pos: [-3.2, 1.8, 1.2] },
  { id: 'gm2', title: 'Elena Birthday Excursion', category: 'Celebration', date: 'Nov 14', location: 'Oaxaca Resort', detail: 'Surprise private dinner & architecture book gift.', color: '#EC4899', pos: [3.2, 2.0, -1.0] },
  { id: 'gm3', title: 'Sci-Fi Film Marathon', category: 'Cinema', date: 'Dec 02', location: 'Home Loft Cinema', detail: '4-hour marathon discussing atmospheric scores.', color: '#3B82F6', pos: [-3.5, -1.8, -1.5] },
  { id: 'gm4', title: 'Kyoto Ryokan Retreat', category: 'Travel', date: 'May 20', location: 'Kyoto, Japan', detail: '10-day tranquility & tea ceremony itinerary.', color: '#A855F7', pos: [3.5, -1.6, 1.5] },
  { id: 'gm5', title: '42s Voice Note Crystal', category: 'Voice Record', date: 'Yesterday', location: 'Encrypted Telemetry', detail: 'Elena recorded weekend getaway thoughts.', color: '#10B981', pos: [0, 3.2, -2.5], isVoice: true },
  { id: 'gm6', title: 'Sonoma Wine & Pottery', category: 'Dates', date: 'Jun 12', location: 'Sonoma Vineyard', detail: 'Private pottery wheel throwing & wine tasting.', color: '#F43F5E', pos: [0, -3.2, -2.2] }
];

// SECTION 1: Central AI Memory Core
function AIMemoryCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={3} floatIntensity={1.5}>
        <Sphere ref={meshRef} args={[1.3, 32, 32]}>
          <MeshDistortMaterial
            color="#A855F7"
            emissive="#EC4899"
            emissiveIntensity={0.8}
            distort={0.45}
            speed={3.5}
          />
        </Sphere>
      </Float>

      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#EC4899" wireframe />
      </mesh>

      <Text position={[0, -1.7, 0]} fontSize={0.28} color="#FBCFE8">
        AI MEMORY CORE
      </Text>
      <Sparkles count={70} scale={5} size={3.5} color="#EC4899" />
    </group>
  );
}

// SECTION 2: Memory Planet Nodes
function MemoryPlanet({ 
  node, 
  onSelect 
}: { 
  node: MemoryPlanetNode; 
  onSelect: (node: MemoryPlanetNode) => void; 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.4} position={node.pos}>
      <group ref={groupRef} onClick={() => onSelect(node)}>
        {node.isVoice ? (
          <Icosahedron args={[0.75, 1]}>
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.8} wireframe />
          </Icosahedron>
        ) : (
          <Sphere args={[0.8, 32, 32]}>
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.7} roughness={0.1} />
          </Sphere>
        )}

        <Ring args={[1.05, 1.1, 32]}>
          <meshBasicMaterial color={node.color} side={THREE.DoubleSide} />
        </Ring>

        <Text position={[0, 1.2, 0]} fontSize={0.25} color="#FFFFFF">
          {node.title}
        </Text>
        <Text position={[0, -1.2, 0]} fontSize={0.2} color={node.color}>
          {node.category} • {node.date}
        </Text>
      </group>
    </Float>
  );
}

// SECTION 3: Constellation Neural Lines
function ConstellationLines() {
  const lines = useMemo(() => {
    return GALAXY_MEMORY_NODES.map(node => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(...node.pos)
    ]);
  }, []);

  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#A855F7" lineWidth={3} transparent opacity={0.6} />
      ))}
      <Sparkles count={80} scale={7} size={3} color="#A855F7" />
    </>
  );
}

// MAIN 3D MEMORY GALAXY CANVAS CONTROLLER
interface MemoryGalaxyCanvasProps {
  scrollY: number;
  selectedNode: MemoryPlanetNode | null;
  onSelectNode: (node: MemoryPlanetNode) => void;
}

export default function MemoryGalaxyCanvas({
  scrollY,
  selectedNode,
  onSelectNode
}: MemoryGalaxyCanvasProps) {
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

        <AIMemoryCore />

        {GALAXY_MEMORY_NODES.map((node) => (
          <MemoryPlanet key={node.id} node={node} onSelect={onSelectNode} />
        ))}

        <ConstellationLines />

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
