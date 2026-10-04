import { useEffect, useRef } from 'react';

// Calls `onFrame` on every animation frame with the real seconds since the
// previous one. After a hidden tab the first frame carries all the time that
// went by, so nothing is lost.
export const useFrameLoop = (onFrame: (seconds: number) => void) => {
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      onFrameRef.current((now - last) / 1000);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);
};
