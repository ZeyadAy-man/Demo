// ============================================
// KeyboardFirstPersonCamera.jsx (Updated)
// ============================================
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function KeyboardFirstPersonCamera({
  playerRef,
  yaw,
  pitch,
  moveInput,
  mouseDelta,
  isDragging,
  animationState,
}) {
  const shakeTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Mouse drag rotation - access .current from the refs
    if (isDragging.current && mouseDelta.current) {
      const mouseSensitivity = 0.005;
      yaw.current -= mouseDelta.current.x * mouseSensitivity;
      pitch.current -= mouseDelta.current.y * mouseSensitivity;
    }

    // Clamp pitch for better view
    pitch.current = Math.max(
      -Math.PI / 1,
      Math.min(Math.PI / 0.5, pitch.current)
    );

    // Calculate movement intensity for camera shake
    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // Camera shake based on movement
    let shakeAmount = 0;
    let shakeSpeed = 0;
    
    if (intensity > 0.8) {
      shakeAmount = 0.1;
      shakeSpeed = 10;
    } else if (intensity > 0.1) {
      shakeAmount = 0.08;
      shakeSpeed = 14;
    }

    if (intensity > 0.1) {
      shakeTimeRef.current += delta * shakeSpeed;
    }

    const shakeOffset = Math.sin(shakeTimeRef.current) * shakeAmount;

    // Orbital camera
    const orbitRadius = 3;
    const orbitHeight = 6;

    const camX =
      playerRef.current.position.x +
      orbitRadius * Math.sin(yaw.current + Math.PI);
    const camY = playerRef.current.position.y + orbitHeight + shakeOffset;
    const camZ =
      playerRef.current.position.z +
      orbitRadius * Math.cos(yaw.current + Math.PI);

    state.camera.position.set(camX, camY, camZ);

    const lookDistance = 5;
    const lookX = camX + lookDistance * Math.sin(yaw.current + Math.PI);
    const lookY = camY + pitch.current * 2;
    const lookZ = camZ + lookDistance * Math.cos(yaw.current + Math.PI);

    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}