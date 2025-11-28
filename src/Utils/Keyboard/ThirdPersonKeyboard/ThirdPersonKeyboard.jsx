// ============================================
// KeyboardThirdPersonSetup.jsx - Updated
// ============================================
import KeyboardThirdPersonMovement from "./KeyboardThirdPersonMovement";
import KeyboardThirdPersonCamera from "./KeyboardThirdPersonCamera";
import useMouseDrag from "../useDragMouse";
import { Suspense } from "react";
import { CharacterModel } from "../../AvatarLoader/MainCharacterModel";
export default function KeyboardThirdPersonSetup(props) {
  const { mouseDelta, isDragging } = useMouseDrag();

  return (
    <>
      <Suspense fallback={null}>
        {props.playerRef?.current && (
          <CharacterModel
            playerRef={props.playerRef}
            animationState={props.animationState}
          />
        )}
      </Suspense>

      {props.playerRef?.current && (
        <KeyboardThirdPersonMovement
          moveInput={props.moveInput}
          playerRef={props.playerRef}
          cameraYaw={props.yaw}
          isRunning={props.isRunning}
          onAnimationStateChange={props.setAnimationState}
        />
      )}

      {props.playerRef?.current && (
        <KeyboardThirdPersonCamera
          playerRef={props.playerRef}
          moveInput={props.moveInput}
          cameraYaw={props.yaw}
          cameraPitch={props.pitch}
          scaleR={props.scaleR}
          mouseDelta={mouseDelta}
          isDragging={isDragging}
        />
      )}
    </>
  );
}
