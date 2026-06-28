"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Warm, cinematic studio lighting. The environment is built procedurally with
 * Lightformers (no HDRI download) so reflections work fully offline.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={2.4}
        color="#fff3e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.7} color="#c2933f" />

      <Environment resolution={256}>
        <Lightformer
          intensity={2.2}
          position={[0, 4, -4]}
          scale={[10, 6, 1]}
          color="#fff6ea"
        />
        <Lightformer
          intensity={1.1}
          position={[-6, 1, 2]}
          scale={[8, 8, 1]}
          color="#e7d8c0"
        />
        <Lightformer
          intensity={1.6}
          position={[6, 2, 2]}
          scale={[8, 8, 1]}
          color="#c2933f"
        />
      </Environment>
    </>
  );
}
