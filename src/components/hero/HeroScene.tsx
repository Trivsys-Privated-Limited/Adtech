"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const RED = "#F04452";
const BLUE = "#315EAA";

type Pointer = { x: number; y: number };

export type HeroSceneProps = {
  /** Render continuously (false pauses the loop, e.g. when off-screen). */
  active: boolean;
  /** Static, motionless pose for users who prefer reduced motion. */
  reducedMotion: boolean;
  /** Follow the pointer (fine pointers only). */
  interactive: boolean;
  onReady: () => void;
};

/** Evenly distributed points on a sphere (deterministic, no randomness). */
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return points;
}

/** Connect every node to its nearest neighbours, without duplicate edges. */
function buildEdges(nodes: THREE.Vector3[], neighbours: number): THREE.BufferGeometry {
  const seen = new Set<string>();
  const positions: number[] = [];
  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: node.distanceToSquared(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        positions.push(node.x, node.y, node.z, nodes[j].x, nodes[j].y, nodes[j].z);
      });
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function circlePoints(radius: number, segments = 128): THREE.BufferGeometry {
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
  return new THREE.BufferGeometry().setFromPoints(points);
}

const NODE_COUNT = 46;
const SHELL_RADIUS = 2.15;
/** Indices of nodes highlighted in brand red. */
const ACCENT_NODES = [3, 11, 19, 27, 38];

function NodeShell() {
  const nodes = useMemo(() => fibonacciSphere(NODE_COUNT, SHELL_RADIUS), []);
  const edges = useMemo(() => buildEdges(nodes, 3), [nodes]);
  const accentSet = useMemo(() => new Set(ACCENT_NODES), []);
  const baseRef = useRef<THREE.InstancedMesh>(null);
  const accentRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    let base = 0;
    let accent = 0;
    nodes.forEach((node, i) => {
      matrix.setPosition(node);
      if (accentSet.has(i)) accentRef.current?.setMatrixAt(accent++, matrix);
      else baseRef.current?.setMatrixAt(base++, matrix);
    });
    if (baseRef.current) baseRef.current.instanceMatrix.needsUpdate = true;
    if (accentRef.current) accentRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes, accentSet]);

  // Geometry built outside JSX is not auto-disposed by R3F.
  useEffect(() => () => edges.dispose(), [edges]);

  return (
    <group>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#4d78c4" transparent opacity={0.26} depthWrite={false} />
      </lineSegments>
      <instancedMesh ref={baseRef} args={[undefined, undefined, NODE_COUNT - ACCENT_NODES.length]}>
        <sphereGeometry args={[0.034, 12, 12]} />
        <meshBasicMaterial color="#bcd0f2" />
      </instancedMesh>
      <instancedMesh ref={accentRef} args={[undefined, undefined, ACCENT_NODES.length]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Orbit({
  radius,
  tilt,
  speed,
  color,
  phase,
  reducedMotion,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  phase: number;
  reducedMotion: boolean;
}) {
  const ring = useMemo(() => circlePoints(radius), [radius]);
  const packet = useRef<THREE.Mesh>(null);

  useEffect(() => () => ring.dispose(), [ring]);

  useFrame(({ clock }) => {
    if (!packet.current) return;
    const angle = phase + (reducedMotion ? 0 : clock.elapsedTime * speed);
    packet.current.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  });

  return (
    <group rotation={tilt}>
      <lineLoop geometry={ring}>
        <lineBasicMaterial color={color} transparent opacity={0.32} depthWrite={false} />
      </lineLoop>
      <mesh ref={packet} position={[Math.cos(phase) * radius, 0, Math.sin(phase) * radius]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Core({ reducedMotion }: { reducedMotion: boolean }) {
  const solid = useRef<THREE.Mesh>(null);
  const lattice = useRef<THREE.LineSegments>(null);
  const latticeGeometry = useMemo(() => {
    const source = new THREE.IcosahedronGeometry(1.42, 0);
    const edges = new THREE.EdgesGeometry(source);
    source.dispose();
    return edges;
  }, []);

  useEffect(() => () => latticeGeometry.dispose(), [latticeGeometry]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (solid.current) {
      solid.current.rotation.y -= delta * 0.18;
      solid.current.rotation.x += delta * 0.06;
    }
    if (lattice.current) {
      lattice.current.rotation.y += delta * 0.1;
      lattice.current.rotation.z -= delta * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={solid} rotation={[0.35, 0.6, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#3a5fa8" emissive="#0b1830" metalness={0.4} roughness={0.32} flatShading />
      </mesh>
      <lineSegments ref={lattice} geometry={latticeGeometry} rotation={[0.2, 0, 0.3]}>
        <lineBasicMaterial color={BLUE} transparent opacity={0.55} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function Rig({
  reducedMotion,
  interactive,
  pointer,
}: {
  reducedMotion: boolean;
  interactive: boolean;
  pointer: RefObject<Pointer>;
}) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Fit the composition (radius ≈ 2.8 units) to narrow viewports.
  const scale = Math.min(1, viewport.width / 6.2, viewport.height / 6.2);

  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    if (spin.current) {
      spin.current.rotation.y += delta * 0.08;
      spin.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.07;
    }
    if (tilt.current) {
      const target = interactive ? pointer.current : { x: 0, y: 0 };
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, target.y * 0.22, 2.5, delta);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, target.x * 0.32, 2.5, delta);
    }
  });

  return (
    <group ref={tilt} scale={scale}>
      <group ref={spin} rotation={[0.18, 0, -0.08]}>
        <Core reducedMotion={reducedMotion} />
        <NodeShell />
        <Orbit radius={2.7} tilt={[0.42, 0, 0.36]} speed={0.42} color={RED} phase={0.8} reducedMotion={reducedMotion} />
        <Orbit radius={1.85} tilt={[-0.62, 0.3, -0.5]} speed={-0.6} color="#5f8be0" phase={2.6} reducedMotion={reducedMotion} />
      </group>
    </group>
  );
}

export default function HeroScene({ active, reducedMotion, interactive, onReady }: HeroSceneProps) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive || reducedMotion) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, reducedMotion]);

  return (
    <Canvas
      // Reduced motion renders a single still frame; off-screen pauses the loop.
      frameloop={active && !reducedMotion ? "always" : "demand"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.2], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
      style={{ touchAction: "pan-y" }}
    >
      <hemisphereLight args={["#5f8be0", "#07111F", 1.4]} />
      <directionalLight position={[4, 3.5, 2.5]} color={RED} intensity={3.4} />
      <directionalLight position={[-4.5, -1, 1.5]} color="#4f7fd6" intensity={4.2} />
      <directionalLight position={[0, 2, 5]} color="#ffffff" intensity={0.6} />
      <Rig reducedMotion={reducedMotion} interactive={interactive} pointer={pointer} />
    </Canvas>
  );
}
