// ============================================
// useMouseDrag.jsx - Mouse Drag Hook (FIXED)
// ============================================
import { useEffect, useRef } from 'react';

export default function useMouseDrag() {
  const mouseDeltaRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      // Only drag with right mouse button or left button
      if (e.button === 0 || e.button === 2) {
        e.preventDefault();
        isDraggingRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      
      e.preventDefault();

      const deltaX = (e.clientX - lastMouseRef.current.x) * 2;
      const deltaY = (e.clientY - lastMouseRef.current.y) * 2;

      mouseDeltaRef.current = { x: deltaX, y: deltaY };
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
      if (isDraggingRef.current) {
        e.preventDefault();
      }
      isDraggingRef.current = false;
      mouseDeltaRef.current = { x: 0, y: 0 };
      document.body.style.cursor = 'default';
    };

    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent right-click menu
    };

    // Add listeners to document to catch events everywhere
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.body.style.cursor = 'default';
    };
  }, []);

  return { mouseDelta: mouseDeltaRef, isDragging: isDraggingRef };
}