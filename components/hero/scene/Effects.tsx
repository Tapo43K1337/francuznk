"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/** Gentle bloom + warm vignette. DOF removed so the cup stays crisp. */
export function Effects() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
