import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
// How much one pixel of wheel travel zooms, in log scale.
const WHEEL_SENSITIVITY = 0.01;

const clampZoom = (zoom: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

const distance = (touches: TouchList) => {
  const [a, b] = [touches[0], touches[1]];
  return a === undefined || b === undefined
    ? 0
    : Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
};

// Zoom of a scrollable element: ctrl + wheel on desktop, two-finger pinch on
// mobile. 1 is the base size, the smallest one. The point under the pointer
// stays where it is while zooming.
export const useZoom = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const zoomRef = useRef(zoom);
  // The point to keep in place, as laid out before the zoom: its offset in the
  // element's box, its distance to the bottom of the content, and the zoom.
  // Several events can come before React renders: the first one is kept, as
  // it matches the layout still on screen.
  const anchor = useRef<
    { y: number; fromBottom: number; before: number } | undefined
  >(undefined);

  const zoomBy = (factor: number, clientY: number) => {
    const element = ref.current;
    const before = zoomRef.current;
    const next = clampZoom(before * factor);
    if (element === null || next === before) return;
    if (anchor.current === undefined) {
      const y = clientY - element.getBoundingClientRect().top;
      anchor.current = {
        y,
        fromBottom: element.scrollHeight - element.scrollTop - y,
        before,
      };
    }
    zoomRef.current = next;
    setZoom(next);
  };

  // Once the new size is laid out, scroll so the anchored point did not move.
  // Content that does not zoom (a sticky heading) sits at the top, so it is
  // the distance to the bottom that grows with the zoom.
  useLayoutEffect(() => {
    const element = ref.current;
    const pending = anchor.current;
    anchor.current = undefined;
    if (element === null || pending === undefined) return;
    const fromBottom = (pending.fromBottom * zoom) / pending.before;
    element.scrollTop = element.scrollHeight - fromBottom - pending.y;
  }, [zoom]);

  // native listeners: React's wheel and touch ones are passive, and a zoom has
  // to cancel the page scroll and the browser's own pinch
  useEffect(() => {
    const element = ref.current;
    if (element === null) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      zoomBy(Math.exp(-event.deltaY * WHEEL_SENSITIVITY), event.clientY);
    };

    let lastDistance = 0;
    const onTouchStart = (event: TouchEvent) => {
      lastDistance = event.touches.length === 2 ? distance(event.touches) : 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (lastDistance === 0 || event.touches.length !== 2) return;
      event.preventDefault();
      const next = distance(event.touches);
      const [a, b] = [event.touches[0], event.touches[1]];
      if (b !== undefined && a !== undefined) {
        zoomBy(next / lastDistance, (a.clientY + b.clientY) / 2);
      }
      lastDistance = next;
    };
    const onTouchEnd = () => {
      lastDistance = 0;
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchcancel', onTouchEnd);
    return () => {
      element.removeEventListener('wheel', onWheel);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
    };
    // zoomBy only reads refs
  }, []);

  return { ref, zoom };
};
