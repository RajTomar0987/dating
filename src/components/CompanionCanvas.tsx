import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, Sphere, MeshDistortMaterial, Sparkles, Ring, Line, Text, Stars, Html 
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

// Memory Item Interface for 3D Galaxy Click Flight
export interface MemoryNodeData {
  id: string;
  title: string;
  category: string;
  date: string;
  detail: string;
  pos: [number, number, number];
  color: string;
}

const GALAXY_MEMORIES: MemoryNodeData[] = [
  { id: 'm1', title: 'Paris Cultural Trip', category: 'Wanderlust', date: 'Oct 2025', detail: 'Explored atmospheric architecture & cafes.', pos: [-3.2, 1.2, -1.5], color: '#A855F7' },
  { id: 'm2', title: 'Oat Cortado Ritual', category: 'Daily Vibe', date: 'Active', detail: 'Favorite morning coffee order stored in vault.', pos: [3.2, 1.6, -1.0], color: '#EC4899' },
  { id: 'm3', title: 'Sci-Fi Film Night', category: 'Cinephile', date: 'Nov 2025', detail: '4-hour marathon discussing atmospheric scores.', pos: [-2.8, -1.6, -2.5], color: '#3B82F6' },
  { id: 'm4', title: 'Kyoto Ryokan Retreat', category: 'Dream Destination', date: 'Planned', detail: '10-day tranquility & tea ceremony itinerary.', pos: [2.9, -1.4, -2.0], color: '#10B981' },
  { id: 'm5', title: 'Birthday Celebration', category: 'Milestone', date: 'Nov 14', detail: 'Surprise dinner & bespoke architecture book.', pos: [0, 2.2, -2.8], color: '#F59E0B' },
  { id: 'm6', title: 'Sonoma Wine Date', category: 'Weekend Getaway', date: 'Jun 2026', detail: 'Private pottery wheel & wine tasting session.', pos: [0, -2.2, -2.2], color: '#F43F5E' }
];

// SECTION 1: SECTION 1 - GIANT FLOATING SHADER AI CORE
function AICore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.25;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6;
      ring1Ref.current.rotation.x += delta * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.5;
      ring2Ref.current.rotation.y += delta * 0.7;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.8;
      ring3Ref.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* 3 Concentric Rotating Torus Energy Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.025, 16, 120]} />
        <meshBasicMaterial color="#EC4899" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.0, 0.02, 16, 120]} />
        <meshBasicMaterial color="#A855F7" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.5, 0.015, 16, 120]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Main Distorted Shader AI Core */}
      <Float speed={2.5} rotationIntensity={1.8} floatIntensity={2}>
        <Sphere ref={coreRef} args={[1.6, 64, 64]}>
          <MeshDistortMaterial
            color="#A855F7"
            emissive="#EC4899"
            emissiveIntensity={0.6}
            roughness={0.05}
            metalness={0.9}
            distort={0.45}
            speed={3.5}
          />
        </Sphere>
      </Float>

      {/* Orbiting Volumetric Light Particles */}
      <Sparkles count={120} scale={7} size={4.5} speed={0.5} color="#EC4899" />
    </group>
  );
}

// SECTION 2: RELATIONSHIP UNIVERSE (Connected Avatar Spheres & Orbiting Nodes)
function RelationshipUniverse() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const curvePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = -3 + t * 6;
      const y = Math.sin(t * Math.PI) * 1.2;
      const z = Math.cos(t * Math.PI * 2) * 0.5;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const orbitingNodes: { label: string; pos: [number, number, number]; color: string }[] = useMemo(() => [
    { label: 'Emotion', pos: [-1.8, 1.8, 1], color: '#EC4899' },
    { label: 'Trust', pos: [1.8, 1.8, -1], color: '#10B981' },
    { label: 'Conversation', pos: [-2.2, -1.2, -1.2], color: '#3B82F6' },
    { label: 'Memories', pos: [2.2, -1.2, 1], color: '#F59E0B' }
  ], []);

  return (
    <group ref={groupRef} position={[0, -5, 0]}>
      {/* Center User Orb (Alex) */}
      <group position={[-3, 0, 0]}>
        <Float speed={3} floatIntensity={1.2}>
          <Sphere args={[0.95, 32, 32]}>
            <meshStandardMaterial color="#3B82F6" emissive="#2563EB" emissiveIntensity={0.8} wireframe />
          </Sphere>
        </Float>
        <Text position={[0, -1.4, 0]} fontSize={0.28} color="#93C5FD">
          ALEX (USER)
        </Text>
      </group>

      {/* Center Partner Orb (Elena) */}
      <group position={[3, 0, 0]}>
        <Float speed={3} floatIntensity={1.4}>
          <Sphere args={[0.95, 32, 32]}>
            <meshStandardMaterial color="#EC4899" emissive="#DB2777" emissiveIntensity={0.8} wireframe />
          </Sphere>
        </Float>
        <Text position={[0, -1.4, 0]} fontSize={0.28} color="#FBCFE8">
          ELENA (98% MATCH)
        </Text>
      </group>

      {/* Orbiting Telemetry Nodes */}
      {orbitingNodes.map((node, i) => (
        <group key={i} position={node.pos}>
          <Float speed={2 + i} floatIntensity={1.5}>
            <Sphere args={[0.35, 16, 16]}>
              <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.7} />
            </Sphere>
            <Text position={[0, 0.6, 0]} fontSize={0.2} color="#FFFFFF">
              {node.label}
            </Text>
          </Float>
        </group>
      ))}

      {/* Glowing Neural Beam */}
      <Line points={curvePoints} color="#10B981" lineWidth={4} transparent opacity={0.85} />
      <Sparkles count={70} scale={6} size={3.5} color="#10B981" />
    </group>
  );
}

// SECTION 3: MEMORY GALAXY (Clickable 3D Floating Memory Spheres)
function MemoryGalaxy({ onSelectMemory }: { onSelectMemory: (m: MemoryNodeData) => void }) {
  const galaxyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={galaxyRef} position={[0, -11, 0]}>
      {GALAXY_MEMORIES.map((mem) => (
        <Float key={mem.id} speed={2} rotationIntensity={1} floatIntensity={1.5} position={mem.pos}>
          <group 
            onClick={(e) => {
              e.stopPropagation();
              onSelectMemory(mem);
            }}
          >
            <Sphere args={[0.55, 32, 32]}>
              <meshStandardMaterial 
                color={mem.color} 
                emissive={mem.color} 
                emissiveIntensity={0.7} 
                roughness={0.1}
                metalness={0.8} 
              />
            </Sphere>
            <Text position={[0, 0.8, 0]} fontSize={0.24} color="#FFFFFF">
              {mem.title}
            </Text>
          </group>
        </Float>
      ))}
      <Sparkles count={100} scale={8} size={4} color="#A855F7" />
    </group>
  );
}

// SECTION 4: 3D HOLOGRAPHIC COMPATIBILITY CORE RADAR
function HolographicCompatibilityCore() {
  const radarRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 0.35;
      radarRef.current.rotation.x += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  const axes = [
    { label: 'Trust (99%)', pos: [0, 2.4, 0] as [number, number, number], color: '#10B981' },
    { label: 'Communication (94%)', pos: [2.4, 0, 0] as [number, number, number], color: '#3B82F6' },
    { label: 'Humor (98%)', pos: [0, -2.4, 0] as [number, number, number], color: '#F59E0B' },
    { label: 'Lifestyle (92%)', pos: [-2.4, 0, 0] as [number, number, number], color: '#EC4899' },
    { label: 'Emotion (96%)', pos: [1.6, 1.6, 1] as [number, number, number], color: '#A855F7' },
    { label: 'Future (95%)', pos: [-1.6, -1.6, 1] as [number, number, number], color: '#06B6D4' }
  ];

  return (
    <group ref={radarRef} position={[0, -17, 0]}>
      {/* Central 3D Octahedron & Icosahedron Wireframe */}
      <mesh>
        <octahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="#EC4899" wireframe transparent opacity={0.75} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={0.6} wireframe />
      </mesh>

      {/* Equatorial Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2.8, 2.85, 64]} />
        <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
      </mesh>

      {/* Axis Trait Labels */}
      {axes.map((axis, i) => (
        <Text key={i} position={axis.pos} fontSize={0.22} color={axis.color}>
          {axis.label}
        </Text>
      ))}
    </group>
  );
}

// SECTION 5: 3D TIMELINE MILESTONES PATH
function Timeline3DPath() {
  const milestones: { title: string; date: string; pos: [number, number, number]; color: string }[] = useMemo(() => [
    { title: 'Matched', date: 'May 12', pos: [-3.5, 1, 0], color: '#3B82F6' },
    { title: 'First Chat', date: 'May 14', pos: [-1.8, -0.8, 0], color: '#A855F7' },
    { title: 'First Call', date: 'May 20', pos: [0, 1.2, 0], color: '#EC4899' },
    { title: 'First Date', date: 'June 2', pos: [1.8, -0.8, 0], color: '#F59E0B' },
    { title: 'Today (Sync)', date: 'Present', pos: [3.5, 1, 0], color: '#10B981' }
  ], []);

  const pathPoints = useMemo(() => milestones.map(m => new THREE.Vector3(...m.pos)), [milestones]);

  return (
    <group position={[0, -23, 0]}>
      <Line points={pathPoints} color="#A855F7" lineWidth={4} />

      {milestones.map((ms, i) => (
        <group key={i} position={ms.pos}>
          <Float speed={3} floatIntensity={1}>
            <Sphere args={[0.35, 16, 16]}>
              <meshStandardMaterial color={ms.color} emissive={ms.color} emissiveIntensity={0.8} />
            </Sphere>
            <Text position={[0, -0.6, 0]} fontSize={0.24} color="#FFFFFF">
              {ms.title}
            </Text>
            <Text position={[0, -0.9, 0]} fontSize={0.18} color="rgba(255,255,255,0.6)">
              {ms.date}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  );
}

// SECTION 6: INTERACTIVE HOLOGRAPHIC AI ASSISTANT ORB
function AssistantHolographicOrb({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const orbGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (orbGroupRef.current && mouse.current) {
      orbGroupRef.current.position.x = THREE.MathUtils.lerp(orbGroupRef.current.position.x, mouse.current.x * 2.5, 0.05);
      orbGroupRef.current.position.y = THREE.MathUtils.lerp(orbGroupRef.current.position.y, -29 + mouse.current.y * 1.8, 0.05);
      orbGroupRef.current.rotation.y += delta * 0.9;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.7;
    }
  });

  return (
    <group ref={orbGroupRef} position={[0, -29, 0]}>
      <Float speed={4} rotationIntensity={2} floatIntensity={2.5}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#10B981"
            emissive="#34D399"
            emissiveIntensity={0.7}
            distort={0.55}
            speed={4.5}
            roughness={0.1}
          />
        </Sphere>
      </Float>

      {/* Voice Breathing Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshBasicMaterial color="#34D399" wireframe />
      </mesh>

      <Sparkles count={60} scale={5} size={4} color="#34D399" />
    </group>
  );
}

// MAIN 3D CONTROLLER & SCENE PIPELINE
interface CompanionCanvasProps {
  scrollY: number;
  onSelectMemory: (m: MemoryNodeData) => void;
  selectedMemory: MemoryNodeData | null;
  onCloseMemoryModal: () => void;
}

export default function CompanionCanvas({ scrollY, onSelectMemory, selectedMemory, onCloseMemoryModal }: CompanionCanvasProps) {
  const { reducedMotion } = useAppStore();
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    };
  };

  // Map 0 to 3500px window scroll directly to 3D Camera Y coordinate (1.8 down to -29)
  const targetCamY = useMemo(() => {
    const progress = Math.min(1, Math.max(0, scrollY / 3200));
    return 1.8 - progress * 30.8;
  }, [scrollY]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 1.8, 7.5], fov: 58 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[12, 12, 12]} intensity={1.4} />
        <pointLight position={[-10, -10, -10]} intensity={0.9} color="#EC4899" />

        {/* Layer 1 & 2: Starfield & Nebula Atmosphere */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />

        <ScenePipeline 
          targetY={targetCamY} 
          reducedMotion={reducedMotion} 
          mouseRef={mouseRef} 
          onSelectMemory={onSelectMemory} 
        />

        {/* 3D HTML Memory Detail Inspector Modal */}
        {selectedMemory && (
          <Html position={selectedMemory.pos} center>
            <div className="p-5 rounded-3xl bg-[#0A0A14]/95 border border-accent/40 shadow-[0_20px_50px_rgba(236,72,153,0.5)] backdrop-blur-2xl text-white w-72 space-y-3 pointer-events-auto">
              <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                <span className="text-accent uppercase font-bold">{selectedMemory.category}</span>
                <span className="text-white/50">{selectedMemory.date}</span>
              </div>
              <h4 className="text-sm font-display font-extrabold text-white">{selectedMemory.title}</h4>
              <p className="text-xs text-white/70 font-sans leading-relaxed">{selectedMemory.detail}</p>
              <button 
                onClick={onCloseMemoryModal}
                className="w-full py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-md cursor-pointer hover:opacity-90"
              >
                Close Inspector
              </button>
            </div>
          </Html>
        )}

        {/* Post-Processing Bloom for Futuristic Hologram Energy */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.25} luminanceSmoothing={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function ScenePipeline({ 
  targetY, 
  reducedMotion, 
  mouseRef, 
  onSelectMemory 
}: { 
  targetY: number; 
  reducedMotion: boolean; 
  mouseRef: React.RefObject<{ x: number; y: number }>; 
  onSelectMemory: (m: MemoryNodeData) => void; 
}) {
  useFrame((state) => {
    if (!reducedMotion) {
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
      state.camera.lookAt(0, state.camera.position.y - 0.4, 0);
    }
  });

  return (
    <>
      <AICore />
      <RelationshipUniverse />
      <MemoryGalaxy onSelectMemory={onSelectMemory} />
      <HolographicCompatibilityCore />
      <Timeline3DPath />
      <AssistantHolographicOrb mouse={mouseRef} />
    </>
  );
}
