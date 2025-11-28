import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function JoystickFirstPersonCamera({
  lookInput,
  playerRef,
  yaw,
  pitch,
  moveInput,
}) {
  const shakeTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!playerRef.current || !lookInput) return;

    // Update rotation based on look joystick
    const lookSensitivity = 3.0;
    yaw.current -= lookInput.x * lookSensitivity * delta;
    pitch.current += lookInput.y * lookSensitivity * delta;

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
      // Running - more shake
      shakeAmount = 0.15;
      shakeSpeed = 12;
    } else if (intensity > 0.1) {
      // Walking - subtle shake
      shakeAmount = 0.08;
      shakeSpeed = 8;
    }

    // Update shake time
    if (intensity > 0.1) {
      shakeTimeRef.current += delta * shakeSpeed;
    }

    // Calculate vertical shake offset
    const shakeOffset = Math.sin(shakeTimeRef.current) * shakeAmount;

    // Orbital camera: position camera in a circle around character
    const orbitRadius = 3; // Distance from character
    const orbitHeight = 6; // Height above character

    // Camera position stays fixed on the orbital path (only updates with movement, not look)
    const camX =
      playerRef.current.position.x +
      orbitRadius * Math.sin(yaw.current + Math.PI);
    const camY = playerRef.current.position.y + orbitHeight + shakeOffset;
    const camZ =
      playerRef.current.position.z +
      orbitRadius * Math.cos(yaw.current + Math.PI);

    // Set camera position
    state.camera.position.set(camX, camY, camZ);

    // Calculate look target based on pitch and yaw (camera rotates to look around)
    const lookDistance = 5; // How far ahead to look
    const lookX = camX + lookDistance * Math.sin(yaw.current + Math.PI);
    const lookY = camY + pitch.current * 2; // Pitch affects vertical look
    const lookZ = camZ + lookDistance * Math.cos(yaw.current + Math.PI);

    // Camera looks at calculated point (not just the character)
    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}