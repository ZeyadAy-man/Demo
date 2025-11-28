import { useState, useEffect } from 'react';

export default function useKeyboardInput() {
  const [keys, setKeys] = useState({});
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Track Ctrl key
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
      
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };
    
    const handleKeyUp = (e) => {
      // Track Ctrl key release
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
      
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Convert keyboard input to joystick-like values
  const moveInput = {
    x: (keys['d'] ? 1.5 : 0) + (keys['a'] ? -1.5 : 0) + (keys['arrowright'] ? 1.5 : 0) + (keys['arrowleft'] ? -1.5 : 0),
    y: (keys['w'] ? 1.5 : 0) + (keys['s'] ? -1.5 : 0) + (keys['arrowup'] ? 1.5 : 0) + (keys['arrowdown'] ? -1.5 : 0)
  };
  
  // Look input - only horizontal arrows affect camera rotation
  const lookInput = {
    x: (keys['arrowright'] ? 1 : 0) + (keys['arrowleft'] ? -1 : 0),
    y: 0 // Vertical look is handled by mouse drag
  };
  
  // Calculate base intensity (normal keyboard input)
  const baseIntensity = Math.sqrt(
    moveInput.x * moveInput.x + moveInput.y * moveInput.y
  );
  
  // Only return that we're running if Ctrl is pressed AND there's actual movement
  const isRunning = isCtrlPressed && baseIntensity > 0.1;
  
  return { 
    moveInput, 
    lookInput, 
    isRunning
  };
}