import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, Float } from '@react-three/drei'
import { Instances, Model } from './Model'
import { RubiksCube } from './RubiksCube'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Viewer({ showRubiksCube = false, size = 3 }: { showRubiksCube?: boolean, size?: number }) {
  const ref = useRef<any>(null)
  const modelGroupRef = useRef<THREE.Group>(null)
  const cubeGroupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (modelGroupRef.current && cubeGroupRef.current) {
      if (showRubiksCube) {
        // Hide Model, Show Cube
        gsap.to(modelGroupRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.8, ease: "power2.inOut" });
        gsap.to(cubeGroupRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)", delay: 0.2 });
      } else {
        // Show Model, Hide Cube
        gsap.to(modelGroupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "power2.inOut", delay: 0.2 });
        gsap.to(cubeGroupRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.6, ease: "power2.in" });
      }
    }
  }, [showRubiksCube]);

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <Stage preset="rembrandt" intensity={0.5} environment="city" adjustCamera={1.5}>
            <group ref={modelGroupRef} scale={showRubiksCube ? [0, 0, 0] : [1, 1, 1]}>
              <Instances>
                <Model />
              </Instances>
            </group>
            
            <group ref={cubeGroupRef} scale={showRubiksCube ? [1, 1, 1] : [0, 0, 0]}>
              <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <RubiksCube size={size} />
              </Float>
            </group>
          </Stage>
        </Suspense>
        <OrbitControls ref={ref} autoRotate autoRotateSpeed={0.5} enableZoom={false} makeDefault />
      </Canvas>
    </div>
  )
}
