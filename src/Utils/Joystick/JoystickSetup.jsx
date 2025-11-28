import JoystickFirstPersonSetup from "./FirstPersonJoystick/FirstPersonJoystick.jsx";
import JoystickThirdPersonSetup  from "./ThirdPersonJoystick/ThirdPersonJoystick.jsx";
import { CharacterModel } from "../AvatarLoader/MainCharacterModel.jsx";
import { Suspense, useRef } from "react";
import SquareDroneCamera from "../CameraDroneView";

export default function JoystickSetup(props) {
  const localPlayerRef = useRef();
  const playerRef = props.playerRef || localPlayerRef;

  return (
    <>


      {props.mode === "First-Prespective" && (
        <JoystickFirstPersonSetup
          playerRef={props.playerRef}
          moveInput={props.moveInput}
          lookInput={props.lookInput}
          yaw={props.yaw}
          pitch={props.pitch}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
        />
      )}

      {props.mode === "Third-Prespective" && (
        <JoystickThirdPersonSetup
          playerRef={props.playerRef}
          moveInput={props.moveInput}
          lookInput={props.lookInput}
          yaw={props.yaw}
          pitch={props.pitch}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          scaleR={props.scaleR}
        />
      )}

      {props.mode === "Cinematic View" && <SquareDroneCamera />}
    </>
  );
}
