import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import City from "./City";
import { useDeviceType } from "./Utils/DeviceType";
import { useState, useRef } from "react";

import { JoystickGUI } from "./Utils/Joystick/JoystickGUI";
import JoystickSetup from "./Utils/Joystick/JoystickSetup";
import CharacterSetup from "./Utils/Setup";

export default function App() {
  const [isDay, setIsDay] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState([0, 0, 0]);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [clickedObject, setClickedObject] = useState(null);
  const [animationState, setAnimationState] = useState("Idle");

  const [scaleR, setScaleR] = useState(25);
  const [mode, setMode] = useState("Cinematic View");

  const [moveInput, setMoveInput] = useState({ x: 0, y: 0 });
  const [lookInput, setLookInput] = useState({ x: 0, y: 0 });

  const playerRef = useRef();
  const yaw = useRef(0);
  const pitch = useRef(0);

  const toggleDayNight = () => {
    setIsDay(!isDay);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: isDay ? "#87CEEB" : "#0a0a1a",
      }}
    >
      <button
        onClick={toggleDayNight}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: isDay ? "#2c3e50" : "#f39c12",
          color: "white",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          fontFamily: "Arial, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        }}
      >
        {isDay ? "🌙 " : "☀️"}
      </button>

      {showCoordinates && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: isDay ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
            color: isDay ? "#333" : "white",
            padding: "15px",
            borderRadius: "8px",
            zIndex: 1000,
            fontFamily: "monospace",
            border: isDay ? "2px solid #2c3e50" : "2px solid #00ff00",
            minWidth: "250px",
            transition: "all 0.3s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              color: isDay ? "#2c3e50" : "#00ff00",
            }}
          >
            Coordinates{" "}
          </h3>
          <div style={{ marginBottom: "5px" }}>
            <strong>X:</strong> {selectedPosition[0].toFixed(2)}
          </div>
          <div style={{ marginBottom: "5px" }}>
            <strong>Y:</strong> {selectedPosition[1].toFixed(2)}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Z:</strong> {selectedPosition[2].toFixed(2)}
          </div>
          {clickedObject && (
            <div
              style={{
                marginTop: "10px",
                padding: "8px",
                background: isDay
                  ? "rgba(44, 62, 80, 0.1)"
                  : "rgba(0, 255, 0, 0.1)",
                borderRadius: "4px",
                fontSize: "12px",
                border: isDay ? "1px solid #2c3e50" : "1px solid #00ff00",
              }}
            >
              <strong>The specific:</strong> {clickedObject}
            </div>
          )}
          <div
            style={{
              marginTop: "10px",
              fontSize: "11px",
              color: isDay ? "#666" : "#ccc",
              fontStyle: "italic",
            }}
          >
            Click on any object to see its coordinates{" "}
          </div>
        </div>
      )}

      <Canvas
        shadows
        camera={{ near: 0.1, far: 1000, position: [20, 15, 20], fov: 45 }}
        // gl={{ logarithmicDepthBuffer: true }}
        onClick={(event) => {
          event.stopPropagation();

          const point = event.point;
          console.log("point", point);

          setSelectedPosition([point.x, point.y, point.z]);

          if (event.object && event.object.parent) {
            const objectName =
              event.object.parent.name || event.object.name || "unknown object";
            setClickedObject(objectName);
          } else {
            setClickedObject("Floor or surface");
          }
        }}
      >
        {isDay ? (
          <>
            <Environment
              preset="sunset"
              background={false}
              environmentIntensity={1.5}
            />

            <directionalLight
              castShadow
              intensity={3.5}
              position={[50, 120, 50]}
              color="#FFF8E1"
              shadow-mapSize-width={8192}
              shadow-mapSize-height={8192}
              shadow-bias={-0.0005}
              shadow-normalBias={0.05}
              shadow-camera-far={500}
              shadow-camera-left={-400}
              shadow-camera-right={400}
              shadow-camera-top={400}
              shadow-camera-bottom={-400}
            />

            <ambientLight intensity={1} color="#FFF8E1" />

            <pointLight position={[10, 10, 10]} intensity={0.2} />
            <pointLight position={[-10, 5, -10]} intensity={0.1} />

            <hemisphereLight
              skyColor="#87CEEB"
              groundColor="#F0E68C"
              intensity={1}
            />

            <directionalLight
              position={[-30, 100, -30]}
              intensity={1.2}
              color="#FFEBB8"
            />
          </>
        ) : (
          <>
            <Environment
              preset="night"
              background={true}
              environmentIntensity={0.3}
              skyType="atmosphere"
            />

            <gridHelper
              args={[1000, 100, "#00ff00", "#005500"]}
              position={[0, -1, 0]}
              rotation={[0, 0, 0]}
            />

            <axesHelper args={[200]} />

            <Cursor position={selectedPosition} />

            <directionalLight
              castShadow
              intensity={0.8}
              position={[-30, 80, -40]}
              color="#E6F3FF"
              shadow-mapSize-width={4096}
              shadow-mapSize-height={4096}
              shadow-bias={-0.0005}
              shadow-normalBias={0.05}
              shadow-camera-far={300}
              shadow-camera-left={-200}
              shadow-camera-right={200}
              shadow-camera-top={200}
              shadow-camera-bottom={-200}
            />

            <ambientLight intensity={0.15} color="#1a1a2e" />

            <pointLight
              position={[0, 8, 5]}
              intensity={1.2}
              color="#FFF8E1"
              distance={15}
              decay={2}
            />
            <pointLight
              position={[8, 8, 0]}
              intensity={1.2}
              color="#FFF8E1"
              distance={15}
              decay={2}
            />
            <pointLight
              position={[-8, 8, 0]}
              intensity={1.2}
              color="#FFF8E1"
              distance={15}
              decay={2}
            />
            <pointLight
              position={[0, 8, -5]}
              intensity={1.2}
              color="#FFF8E1"
              distance={15}
              decay={2}
            />

            <pointLight
              position={[15, 12, 10]}
              intensity={0.8}
              color="#FFA500"
              distance={20}
              decay={1.5}
            />
            <pointLight
              position={[-15, 12, -10]}
              intensity={0.8}
              color="#FF6B6B"
              distance={20}
              decay={1.5}
            />

            <pointLight
              position={[12, 6, 8]}
              intensity={0.6}
              color="#FFF8E1"
              distance={8}
              decay={2}
            />
            <pointLight
              position={[-12, 6, -8]}
              intensity={0.6}
              color="#FFF8E1"
              distance={8}
              decay={2}
            />
            <pointLight
              position={[10, 4, -12]}
              intensity={0.6}
              color="#E6F3FF"
              distance={8}
              decay={2}
            />

            <hemisphereLight
              skyColor="#0f1a2a"
              groundColor="#1a0f2a"
              intensity={0.3}
            />

            <directionalLight
              position={[20, 60, 20]}
              intensity={0.3}
              color="#4A6FA5"
            />

            <pointLight
              position={[100, 50, -120]} //  address_mall
              intensity={1.5}
              color="#FFFFFF"
              distance={30}
              decay={1.5}
            />
            <pointLight
              position={[130, 40, -60]} //  skyscraper (1)
              intensity={1.2}
              color="#FFFFFF"
              distance={25}
              decay={1.5}
            />
            <pointLight
              position={[3.54, 150.13, -254.05]} //  al_faisaliyah_center_riyadh
              intensity={10.0}
              color="#f4f4f1ff"
              distance={300}
              decay={0.3}
            />
            <pointLight
              position={[0.2, 122.57, -253.15]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={155}
              decay={0.5}
            />
            <pointLight
              position={[43.32, 6.35, -271.76]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[43.32, 6.35, -244.6]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[43.32, 6.35, -222.5]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[43.32, 6.35, -183.69]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[43.32, 6.35, -159.89]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-0.65, -12.48, -163.08]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-0.65, -12.48, -195.57]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-33.38, -12.48, -269.94]} //  al_faisaliyah_center_riyadh
              intensity={4.0}
              color="#f4f4f1ff"
              distance={100}
              decay={0.5}
            />

            <pointLight
              position={[-112.76, 11.2, -21.07]} //  albaik_restaurant
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-98.83, 11.2, -21.07]} //  albaik_restaurant
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-84.75, 11.2, -21.07]} //  albaik_restaurant
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-70.91, 11.2, -21.07]} //  albaik_restaurant
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            {/* عواميد النور */}
            <pointLight
              position={[-70.65, -1.52, -21.67]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-97.94, -1.52, -21.65]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-99.01, -1.52, 21.23]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-71.73, -1.52, 21.24]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-44.13, -1.52, 18.5]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-43.36, -1.52, -21.89]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[55.13, -1.52, -21.89]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[54.06, -1.52, 21.32]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[82.42, -1.52, -21.61]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[81.34, -1.52, 21.35]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[109.71, -1.52, -21.58]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[108.65, -1.52, 21.38]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-18.09, -1.52, 46.2]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[25.72, -1.52, 45.05]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-18.12, -1.52, 101.48]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[25.48, -1.52, 100.33]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-70.65, -1.52, 130.6]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-97.94, -1.52, 130.57]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-127.24, -1.52, 100.33]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-127.09, -1.52, 73.04]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-127.21, -1.52, 45.75]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[25.51, -1.52, -107.32]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[25.55, -1.52, -80.03]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[25.59, -1.52, -52.74]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-17.97, -1.52, -106.16]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-17.9, -1.52, -51.59]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[54.06, -1.52, -130.98]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[108.65, -1.52, 21.38]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[81.34, -1.52, -131.12]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[108.65, -1.52, -131.07]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[134.38, -1.52, -106.16]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[134.38, -1.52, -51.59]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[134.38, -1.52, 101.48]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[134.38, -1.52, 74.2]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[134.38, -1.52, 46.91]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[109.71, -1.52, 130.78]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[82.42, -1.52, 130.78]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[54.35, -1.52, 130.78]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-44.42, -1.52, -131.19]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-71.73, -1.52, -131.19]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-127.11, -1.52, -107.32]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-127.11, -1.52, -80.03]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />
            <pointLight
              position={[-127.11, -1.52, -52.5]}
              intensity={4.0}
              color="#FFFFFF"
              distance={100}
              decay={0.5}
            />

            {/* <pointLight 
          position={[-60, 10, -40]} //  bicycle_parking
          intensity={0.8} 
          color="#FFFFFF"
          distance={15}
          decay={2}
        /> */}
            {/* <pointLight 
          position={[-40, 12, -40]} //  billboard
          intensity={1.0} 
          color="#FF6B6B"
          distance={18}
          decay={1.5}
        /> */}
            <pointLight
              position={[-60, 8, -100]} //  gas-station2
              intensity={1.2}
              color="#FFA500"
              distance={20}
              decay={1.5}
            />

            <pointLight
              position={[45.19, 81.9, 111.12]} //  skyscraper_tower
              intensity={5.3}
              color="#FFFFFF"
              distance={200}
              decay={0.5}
            />

            <hemisphereLight
              skyColor="#0f1a2a"
              groundColor="#1a0f2a"
              intensity={0.3}
            />

            <directionalLight
              position={[20, 60, 20]}
              intensity={0.3}
              color="#4A6FA5"
            />

            {!isDay && (
              <>
                <pointLight
                  position={[100, 50, -120]}
                  intensity={1.5}
                  color="#FFFFFF"
                  distance={30}
                  decay={1.5}
                />
                <pointLight
                  position={[130, 40, -60]}
                  intensity={1.2}
                  color="#FFFFFF"
                  distance={25}
                  decay={1.5}
                />
                <pointLight
                  position={[3.54, 150.13, -254.05]}
                  intensity={10.0}
                  color="#f4f4f1ff"
                  distance={300}
                  decay={0.3}
                />
                <pointLight
                  position={[0.2, 122.57, -253.15]}
                  intensity={4.0}
                  color="#f4f4f1ff"
                  distance={155}
                  decay={0.5}
                />
              </>
            )}
          </>
        )}

        <Physics>
          <City
            position={[4, -12.8, 0]}
            scale={[1, 1, 1]}
            onObjectClick={(position, objectName) => {
              setSelectedPosition(position);
              setClickedObject(objectName);
            }}
          />
        </Physics>
        <mesh ref={playerRef} position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[1, 2, 1]} />
        </mesh>
        <CharacterSetup
          playerRef={playerRef}
          moveInput={moveInput}
          lookInput={lookInput}
          yaw={yaw}
          pitch={pitch}
          animationState={animationState}
          setAnimationState={setAnimationState}
          scaleR={scaleR} // NEW
          mode={mode} // NEW
        />
      </Canvas>
      {useDeviceType() === "touch" && (
        <JoystickGUI onMoveChange={setMoveInput} onLookChange={setLookInput} />
      )}
      <CustomControls
        scaleR={scaleR}
        mode={mode}
        onScaleChange={setScaleR}
        onModeChange={setMode}
      />
    </div>
  );
}

function Cursor({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="red" transparent opacity={0.8} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshBasicMaterial color="yellow" />
      </mesh>

      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
        <meshBasicMaterial color="cyan" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1, 3, 32]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  );
}

function CustomControls({ scaleR, mode, onScaleChange, onModeChange }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "rgba(0, 0, 0, 0.85)",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        zIndex: 1000,
        fontFamily: "system-ui, sans-serif",
        minWidth: "260px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "16px",
          color: "#00ff88",
          fontWeight: "600",
        }}
      >
        🎮 Controls
      </h3>

      {/* Scale Range Control */}
      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "13px",
            color: "#aaa",
          }}
        >
          Scale Range
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="range"
            min="18"
            max="48.87"
            step="0.01"
            value={scaleR}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              cursor: "pointer",
              accentColor: "#00ff88",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "50px",
              color: "#00ff88",
            }}
          >
            {scaleR.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Camera Mode Control */}
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "13px",
            color: "#aaa",
          }}
        >
          Camera Mode
        </label>
        <select
          value={mode}
          onChange={(e) => {
            onModeChange(e.target.value);
            setTimeout(() => e.target.blur(), 100);
          }}
          onKeyDown={(e) => {
            if (
              ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                e.key
              )
            ) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 0.2)",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          <option
            value="First-Prespective"
            style={{ background: "#1a1a1a", color: "white" }}
          >
            First-Perspective
          </option>
          <option
            value="Third-Prespective"
            style={{ background: "#1a1a1a", color: "white" }}
          >
            Third-Perspective
          </option>
          <option
            value="Cinematic View"
            style={{ background: "#1a1a1a", color: "white" }}
          >
            Cinematic View
          </option>
        </select>
      </div>

      <div
        style={{
          marginTop: "15px",
          fontSize: "11px",
          color: "#666",
          fontStyle: "italic",
        }}
      >
        💡 Use WASD + Arrow keys to move
      </div>
    </div>
  );
}
