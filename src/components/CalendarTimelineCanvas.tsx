import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles, Ring, Line, Text, Stars, Icosahedron } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

export interface TimelineEventNode {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'past' | 'today' | 'upcoming' | 'milestone';
  pos: [number, number, number];
  color: string;
  partner: string;
}

export const TIMELINE_NODES: TimelineEventNode[] = [
  { id: 't1', title: 'Kyoto Ryokan Trip', date: 'May 2025', time: 'Past Memory', location: 'Kyoto, Japan', type: 'past', pos: [-4.2, 2.2, -3.5], color: '#10B981', partner: 'Elena Rostova' },
  { id: 't2', title: 'Sonoma Pottery Date', date: 'June 2025', time: 'Past Memory', location: 'Sonoma Vineyard', type: 'past', pos: [-2.2, 1.2, -1.8], color: '#10B981', partner: 'Elena Rostova' },
  { id: 't3', title: 'TODAY: Neural Sync', date: 'Present', time: 'Live Now', location: 'San Francisco, CA', type: 'today', pos: [0, 0, 0], color: '#F59E0B', partner: 'Elena Rostova' },
  { id: 't4', title: 'Jazz & Wine Night', date: 'Sat, Aug 2', time: '7:30 PM', location: 'Black Cat Jazz Club', type: 'upcoming', pos: [2.5, -1.2, 1.8], color: '#A855F7', partner: 'Elena Rostova' },
  { id: 't5', title: "Elena's Birthday", date: 'Tue, Aug 5', time: 'All Day', location: 'Oaxaca Resort', type: 'milestone', pos: [4.2, 1.5, 3.2], color: '#EC4899', partner: 'Elena Rostova' }
];

// SECTION 1: 3D Holographic Timezone Clock
function TimezoneClock() {
  const clockRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (clockRef.current) {
      clockRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group ref={clockRef} position={[0, 2.6, -1]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#EC4899" wireframe />
      </mesh>
      <Text position={[0, 0.2, 0]} fontSize={0.25} color="#FFFFFF">
        SF 09:42 AM
      </Text>
      <Text position={[0, -0.2, 0]} fontSize={0.18} color="#10B981">
        LOCAL • NEURAL SYNC
      </Text>
    </group>
  );
}

// SECTION 2: TODAY Central Orb Node
function TodayCentralNode({ onSelect }: { onSelect: (node: TimelineEventNode) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const todayNode = TIMELINE_NODES.find(n => n.type === 'today')!;

  return (
    <group position={[0, 0, 0]} onClick={() => onSelect(todayNode)}>
      <Float speed={3} floatIntensity={1.5}>
        <Sphere ref={meshRef} args={[1.1, 32, 32]}>
          <MeshDistortMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.8}
            distort={0.4}
            speed={3}
          />
        </Sphere>
      </Float>
      <Ring args={[1.4, 1.45, 64]}>
        <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} />
      </Ring>
      <Text position={[0, -1.5, 0]} fontSize={0.28} color="#FBBF24">
        TODAY (PRESENT)
      </Text>
      <Sparkles count={40} scale={4} size={3} color="#FBBF24" />
    </group>
  );
}

// SECTION 3: Past Memory Crystals & Upcoming Event Nodes
function EventNode({ 
  node, 
  onSelect 
}: { 
  node: TimelineEventNode; 
  onSelect: (node: TimelineEventNode) => void; 
}) {
  const nodeRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.y += delta * 0.3;
    }
  });

  const isPast = node.type === 'past';

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.2} position={node.pos}>
      <group ref={nodeRef} onClick={() => onSelect(node)}>
        {isPast ? (
          <Icosahedron args={[0.7, 1]}>
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.7} wireframe />
          </Icosahedron>
        ) : (
          <Sphere args={[0.75, 32, 32]}>
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.8} />
          </Sphere>
        )}
        <Ring args={[0.95, 1.0, 32]}>
          <meshBasicMaterial color={node.color} side={THREE.DoubleSide} />
        </Ring>
        <Text position={[0, 1.1, 0]} fontSize={0.24} color="#FFFFFF">
          {node.title}
        </Text>
        <Text position={[0, -1.0, 0]} fontSize={0.2} color={node.color}>
          {node.date}
        </Text>
      </group>
    </Float>
  );
}

// SECTION 4: 3D Curved Spatial Timeline Path
function CurvedPathLine() {
  const pathPoints = useMemo(() => {
    return TIMELINE_NODES.map(n => new THREE.Vector3(...n.pos));
  }, []);

  return (
    <>
      <Line points={pathPoints} color="#A855F7" lineWidth={4} />
      <Sparkles count={80} scale={8} size={4} color="#A855F7" />
    </>
  );
}

// MAIN 3D CALENDAR TIMELINE CANVAS CONTROLLER
interface CalendarTimelineCanvasProps {
  scrollY: number;
  selectedNode: TimelineEventNode | null;
  onSelectNode: (node: TimelineEventNode) => void;
}

export default function CalendarTimelineCanvas({
  scrollY,
  selectedNode,
  onSelectNode
}: CalendarTimelineCanvasProps) {
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
    return 1.2 - progress * 8;
  }, [scrollY]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 1.2, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.9} color="#EC4899" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />

        <TimezoneClock />
        <TodayCentralNode onSelect={onSelectNode} />

        {TIMELINE_NODES.filter(n => n.type !== 'today').map((node) => (
          <EventNode key={node.id} node={node} onSelect={onSelectNode} />
        ))}

        <CurvedPathLine />

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
