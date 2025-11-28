import JoystickThirdPersonCamera from "./JoystickThirdPersonCamera.jsx";
import JoystickThirdPersonMovement from "./JoystickThirdPersonMovement.jsx";

// export function CameraCollision({ playerRef, obstacles = [] }) {
//   useFrame((state) => {
//     if (!playerRef.current) return;

//     const raycaster = new THREE.Raycaster();
//     const direction = new THREE.Vector3();

//     direction
//       .subVectors(state.camera.position, playerRef.current.position)
//       .normalize();

//     raycaster.set(playerRef.current.position, direction);

//     const intersects = raycaster.intersectObjects(obstacles, true);

//     if (intersects.length > 0) {
//       const distance = intersects[0].distance;
//       if (distance < 6) {
//         // Pull camera closer to avoid clipping
//         const pullBack = playerRef.current.position.clone();
//         pullBack.add(direction.multiplyScalar(distance - 0.5));
//         state.camera.position.lerp(pullBack, 0.1);
//       }
//     }
//   });

//   return null;
// }

export default function JoystickThirdPersonSetup(props) {

  return (
    <>
      {props.playerRef?.current && (
        <JoystickThirdPersonMovement
          moveInput={props.moveInput}
          playerRef={props.playerRef}
          cameraYaw={props.yaw}
          onAnimationStateChange={props.setAnimationState}
        />
      )}

      {props.playerRef?.current && (
        <JoystickThirdPersonCamera
          playerRef={props.playerRef}
          lookInput={props.lookInput}
          moveInput={props.moveInput}
          cameraYaw={props.yaw}
          cameraPitch={props.pitch}
          scaleR={props.scaleR}
        />
      )}
    </>
  );
}
