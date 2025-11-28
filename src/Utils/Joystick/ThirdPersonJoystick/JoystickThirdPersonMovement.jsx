import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function JoystickThirdPersonMovement({
  moveInput,
  playerRef,
  cameraYaw,
  onAnimationStateChange,
}) {
  useFrame((state, delta) => {
    if (!playerRef.current || !moveInput) return;

    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // Determine speed and animation based on intensity
    let moveSpeed = 0;
    let animState = "idle"; // Default to idle

    if (intensity > 0.8) {
      moveSpeed = 14;
      animState = "run";
    } else if (intensity > 0.1) {
      moveSpeed = 8;
      animState = "walk";
    }

    onAnimationStateChange(animState);

    if (intensity > 0.1) {
      // Calculate movement direction relative to camera (inverted forward/backward)
      const angle = Math.atan2(moveInput.x, -moveInput.y);  // Negated moveInput.y
      const moveAngle = cameraYaw.current + angle;

      // Move character
      const moveVector = new THREE.Vector3(
        -Math.sin(moveAngle) * moveSpeed * delta,
        0,
        -Math.cos(moveAngle) * moveSpeed * delta
      );

      playerRef.current.position.add(moveVector);

      // Rotate character to face movement direction
      playerRef.current.rotation.y = moveAngle + Math.PI;
    }
  });
  playerRef.current.position.y = -14; // Keep character grounded
  return null;
}