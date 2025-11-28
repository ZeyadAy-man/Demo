import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function JoystickFirstPersonMovement({
  moveInput,
  yaw,
  playerRef,
  onAnimationStateChange,
}) {
  useFrame((state, delta) => {
    if (!playerRef.current || !moveInput) return;

    const moveVector = new THREE.Vector3();

    // قوة الدفع من الـ joystick
    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // تحديد الحالة والسرعة
    let moveSpeed = 0; // Idle
    if (intensity > 0.8) {
      moveSpeed = 14; // Run
      onAnimationStateChange("run");
    } else if (intensity > 0.1) {
      moveSpeed = 8; // Walk
      onAnimationStateChange("walk");
    } else {
      moveSpeed = 0; // Idle
      onAnimationStateChange("idle");
    }

    // Forward/backward (joystick Y axis)
    moveVector.z = -moveInput.y * moveSpeed * delta;

    // Strafe left/right (joystick X axis)
    moveVector.x = moveInput.x * moveSpeed * delta;

    // Apply movement relative to camera's yaw rotation
    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    playerRef.current.position.add(moveVector);

    // Character always faces the camera direction
    playerRef.current.rotation.y = yaw.current;
  });

  return null;
}