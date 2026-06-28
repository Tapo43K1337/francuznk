"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Beans } from "./scene/Beans";
import { Lighting } from "./scene/Lighting";
import { Effects } from "./scene/Effects";

/** Static poster shown when 3D is disabled (reduced motion / no WebGL). */
function Poster() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#fbf8f1_0%,#efe4d2_45%,#d8c4a8_100%)]" />
  );
}

export function HeroCanvas({
  reduced,
  isMobile,
}: {
  reduced: boolean;
  isMobile: boolean;
}) {
  if (reduced) return <Poster />;

  const count = isMobile ? 40 : 84;

  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 8], fov: 38 }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <group position={[0, 0.7, 0]}>
          <Beans count={count} />
        </group>
        {!isMobile && <Effects />}
      </Suspense>
    </Canvas>
  );
}
