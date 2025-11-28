// ============================================
// KeyboardThirdPersonMovement.jsx - Fixed
// ============================================
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function KeyboardThirdPersonMovement({
  moveInput,
  playerRef,
  cameraYaw,
  onAnimationStateChange,
  isRunning,
}) {
  useFrame((state, delta) => {
    if (!playerRef.current || !moveInput) return;

    // Calculate actual movement intensity
    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // Determine speed and animation
    let moveSpeed = 0;
    let animState = "idle";

    if (intensity > 0.1) {
      if (isRunning) {
        // Ctrl is pressed - RUN
        moveSpeed = 14;
        animState = "run";
      } else {
        // No Ctrl - WALK
        moveSpeed = 8;
        animState = "walk";
      }
    }

    onAnimationStateChange(animState);

    if (intensity > 0.1) {
      // Calculate movement direction relative to camera
      const angle = Math.atan2(moveInput.x, -moveInput.y);
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
  
  playerRef.current.position.y = -14;
  return null;
}