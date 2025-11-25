import { Joystick } from "react-joystick-component";
import { useState } from "react";
import { CharacterJoystick } from "./Joystick";

export default function JoystickCharacter({handleMove, handleStop, joystickVector}) {


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Joystick GUI */}
      {/* <Joystick
        size={100}
        baseColor="gray"
        stickColor="orange"
        move={handleMove}
        stop={handleStop}
      /> */}

      {/* Character controllers consume joystickVector */}
      <CharacterJoystick joystickVector={joystickVector} />
    </div>
  );
}
