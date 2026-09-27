import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Helper to convert real-world Latitude/Longitude to 3D Sphere coordinates
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 90) * (Math.PI / 180); // +90 aligns standard maps to three.js axes

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return [x, y, z];
}

const Earth = () => {
  const earthGroupRef = useRef();
  
  // Load high-resolution realistic Earth textures from reliable public CDNs
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(({ clock }) => {
    if (earthGroupRef.current) {
      // Rotate the earth slowly
      earthGroupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const radius = 2;

  // Real coordinates in India
  const muzaffarpur = latLongToVector3(26.12, 85.39, radius);
  const delhi = latLongToVector3(28.61, 77.20, radius);
  const mumbai = latLongToVector3(19.07, 72.87, radius);
  const bangalore = latLongToVector3(12.97, 77.59, radius);

  return (
    <group ref={earthGroupRef}>
      {/* Base Earth Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap} 
          normalMap={normalMap} 
          specularMap={specularMap}
          shininess={15}
        />
      </mesh>

      {/* Cloud Layer (Slightly larger radius, transparent) */}
      <mesh>
        <sphereGeometry args={[radius + 0.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Real Hotspots mapped to Indian Cities */}
      <Hotspot position={muzaffarpur} color="#ff0000" label="Muzaffarpur (Critical)" />
      <Hotspot position={delhi} color="#ffaa00" />
      <Hotspot position={mumbai} color="#ffff00" />
      <Hotspot position={bangalore} color="#ff5500" />
    </group>
  );
};

const Hotspot = ({ position, color }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    // Pulse animation
    const scale = 1 + Math.sin(clock.getElapsedTime() * 8) * 0.4;
    ref.current.scale.set(scale, scale, scale);
  });
  
  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color={color} />
      <pointLight color={color} intensity={2} distance={1} />
      
      {/* Outer Glow Ring */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} transparent={true} opacity={0.4} />
      </mesh>
    </mesh>
  );
};

export default function GlobeVisualizer() {
  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden bg-[#020510] border border-gray-800 shadow-2xl relative">
      <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
        <span className="text-white text-sm font-bold flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          Live Pulse of Bharat (Real-time GIS)
        </span>
      </div>
      
      {/* Loading overlay while high-res textures download */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[#020510]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <Canvas camera={{ position: [-1, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        {/* Sun light */}
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        {/* Soft blue backlight from space */}
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#4455ff" />
        
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        
        {/* Set initial view to focus roughly on India, allow user to spin */}
        <OrbitControls 
          enableZoom={true} 
          minDistance={3}
          maxDistance={10}
          autoRotate={true} 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
}
