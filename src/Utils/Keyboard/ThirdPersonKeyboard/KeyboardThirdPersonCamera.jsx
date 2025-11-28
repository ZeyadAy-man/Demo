// ============================================
// KeyboardThirdPersonCamera.jsx (Updated)
// ============================================
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function KeyboardThirdPersonCamera({
  playerRef,
  moveInput,
  cameraYaw,
  cameraPitch,
  scaleR,
  mouseDelta,
  isDragging,
}) {
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0.3);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Mouse drag rotation - access .current from the refs
    if (isDragging.current && mouseDelta.current) {
      const mouseSensitivity = 0.003;
      targetYawRef.current -= mouseDelta.current.x * mouseSensitivity;
      targetPitchRef.current -= mouseDelta.current.y * mouseSensitivity;
    }

    // Clamp pitch to prevent camera flipping
    targetPitchRef.current = Math.max(
      -0.2,
      Math.min(1.2, targetPitchRef.current)
    );

    // Smooth camera rotation
    cameraYaw.current += (targetYawRef.current - cameraYaw.current) * 8 * delta;
    cameraPitch.current +=
      (targetPitchRef.current - cameraPitch.current) * 8 * delta;

    // Camera position behind and above character
    const distance = scaleR * (1400 / 1629) - 7;
    const height = scaleR * (2500 / 4887) - 7;

    const camX =
      playerRef.current.position.x -
      Math.sin(cameraYaw.current) * distance * Math.cos(cameraPitch.current);
    const camY =
      playerRef.current.position.y +
      height +
      Math.sin(cameraPitch.current) * distance;
    const camZ =
      playerRef.current.position.z -
      Math.cos(cameraYaw.current) * distance * Math.cos(cameraPitch.current);

    state.camera.position.set(camX, camY, camZ);

    // Look at point slightly ahead of character
    const lookAheadDistance = 2;
    const lookX =
      playerRef.current.position.x +
      Math.sin(cameraYaw.current) * lookAheadDistance;
    const lookY = playerRef.current.position.y + 1.5;
    const lookZ =
      playerRef.current.position.z +
      Math.cos(cameraYaw.current) * lookAheadDistance;

    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}
