// CharacterControllersJoystick.jsx
import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { CameraController, CameraController1 } from "./CameraController";
import { useControls } from "leva";
import SquareDroneCamera from "./CameraDroneView";

// -------------------- THIRD-PERSON JOYSTICK CONTROLLER --------------------
export function CharacterControllerJoystick({ scaleR, joystickVector }) {
  const [cameraHigh, setCameraHigh] = useState(25);

  const { scene, animations } = useGLTF("/character1.glb");
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(animations, characterRef);
  const currentAction = useRef(null);

  const playAction = (name, fadeDuration = 0.2) => {
    const next = actions[name];
    if (!next) return;
    if (currentAction.current === next) return;
    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.fadeIn(fadeDuration).play();
    if (currentAction.current) currentAction.current.fadeOut(fadeDuration);
    currentAction.current = next;
  };

  useEffect(() => {
    if (actions["Idle"]) playAction("Idle", 0.2);
  }, [actions]);

  useFrame((_, delta) => {
    if (!characterRef.current) return;
    const { x, y } = joystickVector || { x: 0, y: 0 };
    let speed = 3;

    if (x !== 0 || y !== 0) {
      const magnitude = Math.sqrt(x * x + y * y);
      if (magnitude > 0.7) {
        speed = 16;
        playAction("Run");
      } else {
        speed = 6;
        playAction("Walk");
      }

      const move = new THREE.Vector3(x, 0, -y).normalize();
      characterRef.current.position.add(move.multiplyScalar(speed * delta));

      const targetRotation = Math.atan2(move.x, move.z);
      characterRef.current.rotation.y = targetRotation;

      if (currentAction.current) {
        currentAction.current.timeScale = y >= 0 ? 1 : -1;
      }
    } else {
      playAction("Idle");
      if (currentAction.current) currentAction.current.timeScale = 1;
    }
  });

  useEffect(() => setCameraHigh(scaleR), [scaleR]);
  useEffect(() => () => mixer?.stopAllAction(), [mixer]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <>
      <RigidBody type="kinematicPosition" colliders="trimesh">
        <primitive ref={characterRef} object={scene} scale={3} position={[0, -14, 10]} />
      </RigidBody>
      <CameraController targetRef={characterRef} cameraHigh={cameraHigh} />
    </>
  );
}

// -------------------- FIRST-PERSON JOYSTICK CONTROLLER --------------------
export function CharacterController1Joystick({ scaleR, joystickVector }) {
  const [cameraHigh, setCameraHigh] = useState(25);
  const [currentActionName, setCurrentActionName] = useState("Idle");

  const { scene, animations } = useGLTF("/character1.glb");
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(animations, characterRef);
  const currentAction = useRef(null);

  const { camera } = useThree();

  const playAction = (name) => {
    if (!actions[name]) return;
    const next = actions[name];
    if (currentAction.current === next && !currentAction.current.paused) return;
    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.paused = false;
    next.fadeIn(0.2).play();
    if (currentAction.current && currentAction.current !== next) {
      currentAction.current.fadeOut(0.2);
    }
    currentAction.current = next;
    setCurrentActionName(name);
  };

  useEffect(() => {
    if (actions["Idle"]) playAction("Idle");
  }, [actions]);

  useFrame((_, delta) => {
    if (!characterRef.current) return;
    const { x, y } = joystickVector || { x: 0, y: 0 };
    let speed = 3;

    if (x !== 0 || y !== 0) {
      const magnitude = Math.sqrt(x * x + y * y);
      if (magnitude > 0.7) {
        speed = 16;
        playAction("Run");
      } else {
        speed = 6;
        playAction("Walk");
      }
      if (currentAction.current) currentAction.current.timeScale = 1;
    } else {
      playAction("Idle");
      if (currentAction.current) currentAction.current.timeScale = 1;
    }

    // Camera-relative movement
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, characterRef.current.up).normalize();

    const move = new THREE.Vector3();
    move.add(camDir.clone().multiplyScalar(y));
    move.add(camRight.clone().multiplyScalar(x));

    if (move.lengthSq() > 0) {
      move.normalize();
      characterRef.current.position.add(move.multiplyScalar(speed * delta));
      const targetRotation = Math.atan2(move.x, move.z);
      characterRef.current.rotation.y = targetRotation;
    }
  });

  useEffect(() => setCameraHigh(scaleR), [scaleR]);
  useEffect(() => () => mixer?.stopAllAction(), [mixer]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <>
      <RigidBody type="kinematicPosition" colliders="trimesh">
        <primitive
          ref={characterRef}
          object={scene}
          scale={3}
          position={[0, -14, 10]}
          castShadow
          receiveShadow
        />
      </RigidBody>
      <CameraController1
        targetRef={characterRef}
        isWalking={currentActionName === "Walk" || currentActionName === "Run"}
        actionName={currentActionName}
      />
    </>
  );
}

// -------------------- MODE SWITCHER --------------------
export function CharacterJoystick({ joystickVector }) {
  const { scaleR, mode } = useControls({
    scaleR: {
      value: 25,
      min: 18,
      max: 48.87,
      step: 0.01,
      label: "Scale Range",
    },
    mode: {
      value: "Cinematic View",
      options: ["First-Prespective", "Third-Prespective", "Cinematic View"],
      label: "Camera Mode",
    },
  });

  return (
    <>
      {mode === "First-Prespective" && (
        <CharacterController1Joystick scaleR={scaleR} joystickVector={joystickVector} />
      )}
      {mode === "Third-Prespective" && (
        <CharacterControllerJoystick scaleR={scaleR} joystickVector={joystickVector} />
      )}
      {mode === "Cinematic View" && <SquareDroneCamera />}
    </>
  );
}
