import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles, Ring, Line, Text, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import type { Profile } from '../data/mockData';

// Interest Planet Data
const INTEREST_PLANETS = [
  { id: 'travel', name: 'Travel', color: '#A855F7', pos: [-5, 3, -2] as [number, number, number] },
  { id: 'music', name: 'Music', color: '#EC4899', pos: [5, 3.2, -1] as [number, number, number] },
  { id: 'fitness', name: 'Fitness', color: '#10B981', pos: [-5.5, -2.5, -1.5] as [number, number, number] },
  { id: 'gaming', name: 'Gaming', color: '#3B82F6', pos: [5.5, -2.8, -2] as [number, number, number] },
  { id: 'books', name: 'Books', color: '#F59E0B', pos: [0, 4.2, -3] as [number, number, number] },
  { id: 'photography', name: 'Photography', color: '#06B6D4', pos: [0, -4.2, -3] as [number, number, number] }
];

// Profile Spatial Positions in 3D Universe
const PROFILE_3D_POSITIONS: { [id: string]: [number, number, number] } = {
  '1': [2.8, 1.2, 1],
  '2': [-2.8, 1.8, -1],
  '3': [3.2, -1.5, -1.2],
  '4': [-2.6, -1.6, 1.2],
  '5': [0, 2.8, -2.2],
  '6': [0, -2.8, -1.8]
};

// SECTION 1: Central User Core Orb
function CentralUserOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1.2, 32, 32]}>
          <MeshDistortMaterial
            color="#3B82F6"
            emissive="#2563EB"
            emissiveIntensity={0.8}
            distort={0.4}
            speed={3}
          />
        </Sphere>
      </Float>

      <mesh ref={ringRef}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshBasicMaterial color="#60A5FA" wireframe />
      </mesh>

      <Text position={[0, -1.8, 0]} fontSize={0.28} color="#93C5FD">
        YOU (ALEX)
      </Text>
      <Sparkles count={50} scale={4} size={3} color="#60A5FA" />
    </group>
  );
}

// SECTION 2: Floating Profile Energy Spheres
function ProfileSphere({ 
  profile, 
  pos, 
  isSelected, 
  onSelect 
}: { 
  profile: Profile; 
  pos: [number, number, number]; 
  isSelected: boolean; 
  onSelect: (p: Profile) => void; 
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

  const glowColor = isSelected ? '#EC4899' : '#A855F7';

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5} position={pos}>
      <group 
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(profile);
        }}
      >
        <Sphere args={[0.85, 32, 32]}>
          <meshStandardMaterial 
            color={glowColor} 
            emissive={glowColor} 
            emissiveIntensity={isSelected ? 0.9 : 0.6} 
            wireframe={!isSelected}
            roughness={0.1}
          />
        </Sphere>

        <mesh ref={ringRef}>
          <ringGeometry args={[1.1, 1.15, 64]} />
          <meshBasicMaterial color={glowColor} side={THREE.DoubleSide} />
        </mesh>

        <Text position={[0, 1.2, 0]} fontSize={0.28} color="#FFFFFF">
          {profile.name}
        </Text>
        <Text position={[0, -1.2, 0]} fontSize={0.22} color="#EC4899">
          98% MATCH
        </Text>
      </group>
    </Float>
  );
}

// SECTION 3: Orbiting Interest Planets
function InterestPlanetNode({ 
  planet, 
  onFilter 
}: { 
  planet: typeof INTEREST_PLANETS[0]; 
  onFilter: (name: string) => void; 
}) {
  const planetRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1} position={planet.pos}>
      <group 
        ref={planetRef}
        onClick={(e) => {
          e.stopPropagation();
          onFilter(planet.name);
        }}
      >
        <Sphere args={[0.55, 32, 32]}>
          <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.6} />
        </Sphere>
        <Ring args={[0.75, 0.8, 32]}>
          <meshBasicMaterial color={planet.color} side={THREE.DoubleSide} />
        </Ring>
        <Text position={[0, 0.9, 0]} fontSize={0.22} color="#FFFFFF">
          {planet.name}
        </Text>
      </group>
    </Float>
  );
}

// SECTION 4: Neural Connection Line (User -> Selected Profile)
function NeuralBeam({ targetPos }: { targetPos: [number, number, number] }) {
  const curvePoints = useMemo(() => {
    const pts = [];
    const endVec = new THREE.Vector3(...targetPos);
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const pt = new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 0, 0), endVec, t);
      pt.y += Math.sin(t * Math.PI) * 0.8;
      pts.push(pt);
    }
    return pts;
  }, [targetPos]);

  return (
    <>
      <Line points={curvePoints} color="#EC4899" lineWidth={5} transparent opacity={0.9} />
      <Sparkles count={60} scale={6} size={4} color="#EC4899" />
    </>
  );
}

// MAIN 3D DISCOVERY UNIVERSE CONTROLLER
interface DiscoverUniverseCanvasProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelectProfile: (p: Profile) => void;
  onFilterInterest: (interest: string) => void;
}

export default function DiscoverUniverseCanvas({
  profiles,
  selectedProfile,
  onSelectProfile,
  onFilterInterest
}: DiscoverUniverseCanvasProps) {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    };
  };

  const selectedTargetPos = useMemo(() => {
    if (!selectedProfile) return null;
    return PROFILE_3D_POSITIONS[selectedProfile.id] || [2.5, 1.2, 1];
  }, [selectedProfile]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.9} color="#EC4899" />

        <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={1.5} />

        <CentralUserOrb />

        {/* Floating Profile Orbs */}
        {profiles.slice(0, 6).map((profile) => {
          const pos = PROFILE_3D_POSITIONS[profile.id] || [2.5, 1.2, 1];
          const isSelected = selectedProfile?.id === profile.id;
          return (
            <ProfileSphere 
              key={profile.id}
              profile={profile}
              pos={pos}
              isSelected={isSelected}
              onSelect={onSelectProfile}
            />
          );
        })}

        {/* Orbiting Interest Planets */}
        {INTEREST_PLANETS.map((planet) => (
          <InterestPlanetNode 
            key={planet.id}
            planet={planet}
            onFilter={onFilterInterest}
          />
        ))}

        {/* Neural Beam to Selected Target */}
        {selectedTargetPos && <NeuralBeam targetPos={selectedTargetPos} />}

        <EffectComposer>
          <Bloom intensity={1.3} luminanceThreshold={0.2} luminanceSmoothing={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
