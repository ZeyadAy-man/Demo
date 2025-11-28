// ============================================
// KeyboardSetup.jsx - Updated to pass isRunning only
// ============================================
import useKeyboardInput from "./useKeyboardInput.jsx";
import { Suspense, useRef } from "react";
import KeyboardFirstPersonSetup from "./FirstPersonKeyboard/FirstPersonKeyboard.jsx";
import KeyboardThirdPersonSetup from "./ThirdPersonKeyboard/ThirdPersonKeyboard.jsx";
import { CharacterModel } from "../AvatarLoader/MainCharacterModel.jsx";

export default function KeyboardSetup({ scaleR, mode, playerRef: externalPlayerRef, animationState, setAnimationState }) {
  const localPlayerRef = useRef();
  const playerRef = externalPlayerRef || localPlayerRef;
  const yaw = useRef(0);
  const pitch = useRef(0);
  
  const { moveInput, lookInput, isRunning } = useKeyboardInput();

  return (
    <>

      {mode === "First-Prespective" && (
        <KeyboardFirstPersonSetup
          playerRef={playerRef}
          moveInput={moveInput}
          lookInput={lookInput}
          yaw={yaw}
          pitch={pitch}
          isRunning={isRunning}
          animationState={animationState}
          setAnimationState={setAnimationState}
        />
      )}

      {mode === "Third-Prespective" && (
        <KeyboardThirdPersonSetup
          playerRef={playerRef}
          moveInput={moveInput}
          lookInput={lookInput}
          yaw={yaw}
          pitch={pitch}
          isRunning={isRunning}
          animationState={animationState}
          setAnimationState={setAnimationState}
          scaleR={scaleR}
        />
      )}
    </>
  );
}