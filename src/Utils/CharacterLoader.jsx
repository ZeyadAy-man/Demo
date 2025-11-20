import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

export default function CharacterController(props) {
  const { scene, animations } = useGLTF("/character1.glb");
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(animations, characterRef);
  const currentAction = useRef(null);
  const keys = useRef({});

  // --- camera ---
  const { camera, scene: threeScene } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // target vs current rotation for smoothing
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);

  // --- pivot for camera ---
  const cameraPivot = useRef(new THREE.Object3D());

  useEffect(() => {
    threeScene.add(cameraPivot.current);
    camera.position.set(0, 6, -10);
    camera.lookAt(new THREE.Vector3(0, -8, 0));
  }, [camera, threeScene]);

  // --- keyboard ---
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // --- mouse drag for camera rotation ---
  useEffect(() => {
    const mouseDown = (e) => {
      setIsDragging(true);
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    const mouseUp = () => setIsDragging(false);
    const mouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - mouseX.current;
      const deltaY = e.clientY - mouseY.current;

      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      targetYaw.current -= deltaX * 0.005;   // yaw target
      targetPitch.current -= deltaY * 0.005; // pitch target

      // clamp pitch
      targetPitch.current = Math.max(-Math.PI / 6, Math.min(Math.PI / 4, targetPitch.current));
    };

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [isDragging]);

  // --- play looping animation ---
  const playAction = (name) => {
    if (!actions[name]) return;
    if (
      currentAction.current === actions[name] &&
      !currentAction.current.paused
    )
      return;

    const next = actions[name];
    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.paused = false;
    next.fadeIn(0.2).play();

    if (currentAction.current && currentAction.current !== next) {
      currentAction.current.fadeOut(0.2);
    }
    currentAction.current = next;
  };

  // --- initial idle pose ---
  useEffect(() => {
    if (actions["Idle"]) {
      const idle = actions["Idle"];
      idle.reset();
      idle.setLoop(THREE.LoopRepeat, Infinity);
      idle.paused = false;
      idle.fadeIn(0.2).play();
      currentAction.current = idle;
    }
  }, [actions]);

  useFrame((_, delta) => {
    if (!characterRef.current) return;

    const forward = keys.current["w"] || keys.current["arrowup"];
    const backward = keys.current["s"] || keys.current["arrowdown"];
    const left = keys.current["a"] || keys.current["arrowleft"];
    const right = keys.current["d"] || keys.current["arrowright"];
    const ctrl = keys.current["control"];

    let speed = 3;
    let actionName = null;

    if (forward || backward) {
      if (ctrl) {
        speed = 16;
        actionName = "Run";
      } else {
        speed = 6;
        actionName = "Walk";
      }

      const action = actions[actionName];
      if (backward) {
        if (currentAction.current !== action || action.timeScale > 0) {
          action.reset();
          action.paused = false;
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.timeScale = -1;
          action.fadeIn(0.2).play();
          if (currentAction.current && currentAction.current !== action) {
            currentAction.current.fadeOut(0.2);
          }
          currentAction.current = action;
        }
      } else {
        if (action) {
          playAction(actionName);
          currentAction.current.timeScale = 1;
        }
      }
    } else {
      if (actions["Idle"] && currentAction.current !== actions["Idle"]) {
        playAction("Idle");
        currentAction.current.timeScale = 1;
      }
    }

    // --- character rotation ---
    if (left) characterRef.current.rotation.y += 2 * delta;
    if (right) characterRef.current.rotation.y -= 2 * delta;

    // --- move forward/backward relative to rotation ---
    const dir = new THREE.Vector3();
    characterRef.current.getWorldDirection(dir);

    if (forward)
      characterRef.current.position.add(
        dir.clone().multiplyScalar(speed * delta)
      );
    if (backward)
      characterRef.current.position.add(
        dir.clone().multiplyScalar(-speed * delta)
      );

    // --- smooth camera rotation ---
    currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, targetYaw.current, 0.1);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch.current, 0.1);

    // --- move pivot to character ---
    cameraPivot.current.position.copy(characterRef.current.position);

    // --- apply yaw/pitch via quaternion ---
    const q = new THREE.Quaternion();
    q.setFromEuler(new THREE.Euler(currentPitch.current, currentYaw.current, 0, "YXZ"));
    cameraPivot.current.quaternion.copy(q);

    // --- keep camera at fixed offset ---
    const offset = new THREE.Vector3(0, 16, -24); // behind & above
    camera.position.copy(offset);
    camera.position.applyQuaternion(cameraPivot.current.quaternion);
    camera.position.add(cameraPivot.current.position);
    
    camera.lookAt(cameraPivot.current.position);
  });

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

  // --- cleanup ---
  useEffect(() => () => mixer?.stopAllAction(), [mixer]);

  return (
    <RigidBody type="kinematicPosition" colliders="trimesh">
      <primitive ref={characterRef} object={scene} scale={3} position={[0, -14, 6]} />
    </RigidBody>
  );
}
