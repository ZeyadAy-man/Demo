import { Joystick } from "react-joystick-component";

export function JoystickGUI({ onMoveChange, onLookChange }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Movement Joystick (Left) */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          pointerEvents: "auto",
        }}
      >
        <Joystick
          size={100}
          sticky={false}
          baseColor="rgba(255, 255, 255, 0.3)"
          stickColor="rgba(255, 255, 255, 0.8)"
          move={(data) => onMoveChange({ x: data.x || 0, y: data.y || 0 })}
          stop={() => onMoveChange({ x: 0, y: 0 })}
        />
        <p
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 5,
            fontSize: 12,
            fontFamily: "system-ui",
          }}
        >
          Move
        </p>
      </div>

      {/* Look Joystick (Right) */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          pointerEvents: "auto",
        }}
      >
        <Joystick
          size={100}
          sticky={false}
          baseColor="rgba(255, 255, 255, 0.3)"
          stickColor="rgba(255, 255, 255, 0.8)"
          move={(data) => onLookChange({ x: data.x || 0, y: data.y || 0 })}
          stop={() => onLookChange({ x: 0, y: 0 })}
        />
        <p
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 5,
            fontSize: 12,
            fontFamily: "system-ui",
          }}
        >
          Look
        </p>
      </div>
    </div>
  );
}