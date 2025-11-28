// CustomControls.jsx - A keyboard-safe alternative to Leva
import { useState } from 'react';

export function CustomControls({ scaleR: initialScaleR, mode: initialMode, onScaleChange, onModeChange }) {
  const [scaleR, setScaleR] = useState(initialScaleR || 25);
  const [mode, setMode] = useState(initialMode || "Cinematic View");

  const handleScaleChange = (e) => {
    const value = parseFloat(e.target.value);
    setScaleR(value);
    if (onScaleChange) onScaleChange(value);
  };

  const handleModeChange = (e) => {
    const value = e.target.value;
    setMode(value);
    if (onModeChange) onModeChange(value);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        zIndex: 1000,
        fontFamily: 'monospace',
        minWidth: '250px',
        backdropFilter: 'blur(10px)',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#00ff00' }}>
        Controls
      </h3>

      {/* Scale Range Control */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
          Scale Range: {scaleR.toFixed(2)}
        </label>
        <input
          type="range"
          min="18"
          max="48.87"
          step="0.01"
          value={scaleR}
          onChange={handleScaleChange}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Camera Mode Control */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
          Camera Mode
        </label>
        <select
          value={mode}
          onChange={handleModeChange}
          onKeyDown={(e) => {
            // Block arrow keys from doing anything
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              e.preventDefault();
              e.stopPropagation();
              e.target.blur();
            }
          }}
          onFocus={(e) => {
            // Auto-blur after a moment to prevent keyboard interaction
            setTimeout(() => e.target.blur(), 100);
          }}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          <option value="First-Prespective" style={{ background: '#000' }}>
            First-Perspective
          </option>
          <option value="Third-Prespective" style={{ background: '#000' }}>
            Third-Perspective
          </option>
          <option value="Cinematic View" style={{ background: '#000' }}>
            Cinematic View
          </option>
        </select>
      </div>
    </div>
  );
}

// Hook version to mimic Leva's useControls API
export function useCustomControls(config) {
  const [scaleR, setScaleR] = useState(config.scaleR.value);
  const [mode, setMode] = useState(config.mode.value);

  return { scaleR, mode, setScaleR, setMode };
}