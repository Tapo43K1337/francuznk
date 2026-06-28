"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type BeanDatum = {
  base: THREE.Vector3;
  rot: THREE.Euler;
  spin: number;
  scale: number;
  phase: number;
  floatAmp: number;
  drift: number;
  shade: number;
};

/** Procedural coffee-bean geometry: ellipsoid with the characteristic crease. */
function makeBeanGeometry() {
  const g = new THREE.SphereGeometry(1, 48, 36);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    v.x *= 0.58; // length
    v.y *= 0.4; // thickness
    v.z *= 0.36; // width
    // crease along the length on the top face (y > 0)
    if (v.y > 0) {
      const groove = Math.exp(-(v.z * v.z) / (2 * 0.1 * 0.1));
      v.y -= groove * 0.22 * (v.y / 0.4);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

/**
 * Floating field of coffee beans for the splash hero. Each bean drifts and
 * spins continuously around its base position — no scroll, no convergence.
 */
export function Beans({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const geometry = useMemo(makeBeanGeometry, []);

  const data = useMemo<BeanDatum[]>(() => {
    return Array.from({ length: count }, () => {
      const r = 2.6 + Math.random() * 3.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const base = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.35) * 7,
        r * Math.cos(phi) * 0.85
      );

      return {
        base,
        rot: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        spin: 0.2 + Math.random() * 0.6,
        scale: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        floatAmp: 0.18 + Math.random() * 0.34,
        drift: 0.3 + Math.random() * 0.5,
        shade: Math.random(),
      };
    });
  }, [count]);

  // per-instance roast colour variation
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    const dark = new THREE.Color("#2c180d");
    const light = new THREE.Color("#6b4326");
    for (let i = 0; i < count; i++) {
      c.copy(dark).lerp(light, data[i].shade * 0.7);
      m.setColorAt(i, c);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count, data]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const d = data[i];
      tmp.copy(d.base);
      // gentle continuous drift on all three axes
      tmp.x += Math.sin(t * d.drift + d.phase) * d.floatAmp;
      tmp.y += Math.cos(t * d.drift * 0.8 + d.phase) * d.floatAmp;
      tmp.z += Math.sin(t * d.drift * 0.6 + d.phase * 1.3) * d.floatAmp * 0.6;
      dummy.position.copy(tmp);

      const sp = t * d.spin;
      dummy.rotation.set(d.rot.x + sp, d.rot.y + sp * 0.7, d.rot.z + sp * 0.3);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, count]}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color="#3a2316"
        roughness={0.42}
        clearcoat={0.35}
        clearcoatRoughness={0.5}
        metalness={0.05}
      />
    </instancedMesh>
  );
}
