import React, { useRef, useMemo, useEffect } from 'react';
import { Merged, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const COLORS = {
  white: '#FFFFFF',
  yellow: '#FFFF00',
  red: '#FF0000',
  orange: '#FFA500',
  blue: '#0000FF',
  green: '#008000',
  black: '#111111'
};

const Cublet = ({ position, size, Instances }: { position: [number, number, number], size: number, Instances: any }) => {
  const [x, y, z] = position;
  const offset = (size - 1) / 2;
  
  return (
    <group position={position}>
      {/* Black Cublet Body */}
      <Instances.Body />
      
      {/* Stickers - only on outer faces */}
      {y === offset && <Instances.White position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} />}
      {y === -offset && <Instances.Yellow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />}
      {x === offset && <Instances.Blue position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />}
      {x === -offset && <Instances.Green position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />}
      {z === offset && <Instances.Red position={[0, 0, 0.5]} rotation={[0, 0, 0]} />}
      {z === -offset && <Instances.Orange position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]} />}
    </group>
  );
};

export const RubiksCube = ({ size = 3 }: { size?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const cublets = useMemo(() => {
    const items = [];
    const offset = (size - 1) / 2;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const isOuter = x === 0 || x === size - 1 || y === 0 || y === size - 1 || z === 0 || z === size - 1;
          if (!isOuter) continue;
          items.push([x - offset, y - offset, z - offset] as [number, number, number]);
        }
      }
    }
    return items;
  }, [size]);

  // Create template meshes for Merged
  const meshes = useMemo(() => {
    const bodyGeom = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    const stickerGeom = new THREE.BoxGeometry(0.8, 0.8, 0.05);
    
    const body = new THREE.Mesh(bodyGeom, new THREE.MeshStandardMaterial({ color: COLORS.black, roughness: 0.3, metalness: 0.2 }));
    const white = new THREE.Mesh(stickerGeom, new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.1, metalness: 0.1 }));
    const yellow = new THREE.Mesh(stickerGeom, new THREE.MeshStandardMaterial({ color: COLORS.yellow, roughness: 0.1, metalness: 0.1 }));
    const red = new THREE.Mesh(stickerGeom, new THREE.MeshStandardMaterial({ color: COLORS.red, roughness: 0.1, metalness: 0.1 }));
    const orange = new THREE.Mesh(stickerGeom, new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.1, metalness: 0.1 }));
    const blue = new THREE.Mesh(stickerGeom, new THREE.MeshStandardMaterial({ color: COLORS.blue, roughness: 0.1, metalness: 0.1 }));
    const green = new THREE.Mesh(stickerGeom, new THREE.MeshStandardMaterial({ color: COLORS.green, roughness: 0.1, metalness: 0.1 }));

    return { Body: body, White: white, Yellow: yellow, Red: red, Orange: orange, Blue: blue, Green: green };
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: "+=0.2",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });
    }
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      const children = groupRef.current.children;
      gsap.killTweensOf(children);
      
      children.forEach((child) => {
        const targetPos = { ...child.position };
        
        gsap.fromTo(child.position, 
          { 
            x: targetPos.x * 3 + (Math.random() - 0.5) * 2, 
            y: targetPos.y * 3 + (Math.random() - 0.5) * 2, 
            z: targetPos.z * 3 + (Math.random() - 0.5) * 2 
          },
          { 
            x: targetPos.x, 
            y: targetPos.y, 
            z: targetPos.z, 
            duration: 1.5, 
            delay: Math.random() * 0.3,
            ease: "expo.out" 
          }
        );

        gsap.fromTo(child.rotation,
          { 
            x: Math.random() * Math.PI * 2, 
            y: Math.random() * Math.PI * 2, 
            z: Math.random() * Math.PI * 2 
          },
          { x: 0, y: 0, z: 0, duration: 1.5, ease: "expo.out" }
        );

        gsap.fromTo(child.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.2)", delay: Math.random() * 0.2 }
        );
      });

      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2,
        duration: 2,
        ease: "expo.inOut"
      });
    }
  }, [size, cublets]);

  return (
    <Merged meshes={meshes}>
      {(Instances: any) => (
        <group ref={groupRef}>
          {cublets.map((pos, i) => (
            <Cublet key={`${size}-${i}`} position={pos} size={size} Instances={Instances} />
          ))}
        </group>
      )}
    </Merged>
  );
};
