import { useDeviceType } from "./DeviceType";
import KeyboardSetup from "./Keyboard/KeyboardSetup";
import SquareDroneCamera from "./CameraDroneView";
import JoystickSetup from "./Joystick/JoystickSetup";
import { Suspense } from "react";
import { CharacterModel } from "./AvatarLoader/MainCharacterModel";

export default function CharacterSetup({
  playerRef,
  moveInput,
  lookInput,
  yaw,
  pitch,
  animationState,
  setAnimationState,
  scaleR,
  mode,
}) {
  return (
    <>
      <group ref={playerRef} position={[0, 0, 5]} />


      {useDeviceType() === "keyboard" && (
        <KeyboardSetup
          scaleR={scaleR}
          mode={mode}
          animationState={animationState}
          setAnimationState={setAnimationState}
          playerRef={playerRef}
        />
      )}
      {useDeviceType() === "touch" && (
        <JoystickSetup
          scaleR={scaleR}
          playerRef={playerRef}
          moveInput={moveInput}
          lookInput={lookInput}
          yaw={yaw}
          pitch={pitch}
          animationState={animationState}
          setAnimationState={setAnimationState}
          mode={mode}
        />
      )}
      {mode === "Cinematic View" && <SquareDroneCamera />}
    </>
  );
}
