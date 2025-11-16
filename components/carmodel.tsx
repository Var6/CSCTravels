'use client'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
function CarModel() {
  const { scene } = useGLTF('/car.glb')
  // Calculate model bounding box:
  const box = new THREE.Box3().setFromObject(scene)
  const size = new THREE.Vector3()
  box.getSize(size)
  console.log('Model original size:', size) 
  // Real car size (meters)
  const real = {
    width: 2.29,
    height: 1.56,
    length: 5.18,
  }
  // Scale based on LENGTH
  const scale = real.length / size.z
  scene.scale.set(scale, scale, scale)
  return <primitive object={scene} />
}
export default function CarCanvas() {
  return (
    <div className='relative border-2 border-black'>23
    <div className="absolute right-0 top-0 w-[650px] h-[550px] z-10 pointer-events-auto">
      <Canvas 
        camera={{ position: [6, 2, 6], fov: 50 }}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <CarModel />
        <OrbitControls 
          autoRotate={true}
          autoRotateSpeed={2}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
    </div>
  )
}