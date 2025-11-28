// ============================================
// KeyboardFirstPersonSetup.jsx - Updated
// ============================================
import KeyboardFirstPersonCamera from "./KeyboardFirstPersonCamera";
import KeyboardFirstPersonMovement from "./KeyboardFirstPersonMovement";
import useMouseDrag from "../useDragMouse";
import { Suspense } from "react";
import { CharacterModel } from "../../AvatarLoader/MainCharacterModel";
export default function KeyboardFirstPersonSetup(props) {
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
        <KeyboardFirstPersonMovement
          moveInput={props.moveInput}
          playerRef={props.playerRef}
          yaw={props.yaw}
          isRunning={props.isRunning}
          onAnimationStateChange={props.setAnimationState}
        />
      )}

      {props.playerRef?.current && (
        <KeyboardFirstPersonCamera
          playerRef={props.playerRef}
          moveInput={props.moveInput}
          yaw={props.yaw}
          pitch={props.pitch}
          mouseDelta={mouseDelta}
          isDragging={isDragging}
          animationState={props.animationState}
        />
      )}
    </>
  );
}
