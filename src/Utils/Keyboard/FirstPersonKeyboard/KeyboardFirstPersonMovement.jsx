// ============================================
// KeyboardFirstPersonMovement.jsx - Fixed
// ============================================
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function KeyboardFirstPersonMovement({
  moveInput,
  yaw,
  playerRef,
  onAnimationStateChange,
  isRunning,
}) {
  useFrame((state, delta) => {
    if (!playerRef.current || !moveInput) return;

    const moveVector = new THREE.Vector3();

    // Calculate actual movement intensity
    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // Determine state and speed
    let moveSpeed = 0;
    
    if (intensity > 0.1) {
      if (isRunning) {
        // Ctrl is pressed - RUN
        moveSpeed = 14;
        onAnimationStateChange("run");
      } else {
        // No Ctrl - WALK
        moveSpeed = 8;
        onAnimationStateChange("walk");
      }
    } else {
      // Not moving - IDLE
      moveSpeed = 0;
      onAnimationStateChange("idle");
    }

    // Forward/backward (W/S keys)
    moveVector.z = -moveInput.y * moveSpeed * delta;

    // Strafe left/right (A/D keys)
    moveVector.x = moveInput.x * moveSpeed * delta;

    // Apply movement relative to camera's yaw rotation
    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    playerRef.current.position.add(moveVector);

    // Character always faces the camera direction
    playerRef.current.rotation.y = yaw.current;
  });

  return null;
}