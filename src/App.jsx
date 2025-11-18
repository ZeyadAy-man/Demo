import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <>
      {/* Add 3D objects here later */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <OrbitControls />
        <Scene />
      </Canvas>
    </div>
  );
}
