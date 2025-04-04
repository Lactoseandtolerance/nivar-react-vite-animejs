import { useRef, useEffect, useCallback } from 'react';

// Custom hook for optimized animation frames
export const useAnimationFrame = (callback, active = true) => {
  // Keep track of the animation frame request
  const requestRef = useRef();
  // Store the time of the previous frame
  const previousTimeRef = useRef();
  
  // The animation callback
  const animate = useCallback(time => {
    if (previousTimeRef.current !== undefined) {
      // Calculate deltaTime in seconds
      const deltaTime = (time - previousTimeRef.current) / 1000;
      // Call the callback with deltaTime
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    
    // Request next frame only if active
    if (active) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [callback, active]);
  
  useEffect(() => {
    // Start the animation loop only if active
    if (active) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      // Clean up by canceling the animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, active]);
};