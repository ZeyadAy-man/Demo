import JoystickFirstPersonMovement from "./JoystickFirstPersonMovement.jsx";
import JoystickFirstPersonCamera from "./JoystickFirstPersonCamera.jsx";

export default function JoystickFirstPersonSetup(props) {
  return (
    <>
      {props.playerRef?.current && (
        <JoystickFirstPersonMovement
          moveInput={props.moveInput}
          playerRef={props.playerRef}
          yaw={props.yaw}  // Changed from cameraYaw
          onAnimationStateChange={props.setAnimationState}
        />
      )}

      {props.playerRef?.current && (
        <JoystickFirstPersonCamera
          playerRef={props.playerRef}
          lookInput={props.lookInput}
          moveInput={props.moveInput}
          yaw={props.yaw}  // Changed from cameraYaw
          pitch={props.pitch}  // Changed from cameraPitch
        />
      )}
    </>
  );
}