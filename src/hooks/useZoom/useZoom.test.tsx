import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { useZoom } from './useZoom';

const Surface = () => {
  const { ref, zoom } = useZoom<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="surface">
      {zoom.toFixed(2)}
    </div>
  );
};

// two fingers, this many pixels apart
const touches = (gap: number) => [
  { clientX: 0, clientY: 0 },
  { clientX: 0, clientY: gap },
];

test('starts at the base size', () => {
  render(<Surface />);
  expect(screen.getByTestId('surface')).toHaveTextContent('1.00');
});

test('ctrl + wheel up zooms in, and it stops at the base size when zooming out', () => {
  render(<Surface />);
  const surface = screen.getByTestId('surface');
  fireEvent.wheel(surface, { ctrlKey: true, deltaY: -100 });
  expect(Number(surface.textContent)).toBeGreaterThan(2);
  fireEvent.wheel(surface, { ctrlKey: true, deltaY: 1000 });
  expect(surface).toHaveTextContent('1.00');
});

test('a wheel without ctrl is left to the scroll', () => {
  render(<Surface />);
  const surface = screen.getByTestId('surface');
  fireEvent.wheel(surface, { deltaY: -100 });
  expect(surface).toHaveTextContent('1.00');
});

test('pinching two fingers apart zooms in', () => {
  render(<Surface />);
  const surface = screen.getByTestId('surface');
  fireEvent.touchStart(surface, { touches: touches(50) });
  fireEvent.touchMove(surface, { touches: touches(100) });
  expect(surface).toHaveTextContent('2.00');
});

test('a single finger does not zoom', () => {
  render(<Surface />);
  const surface = screen.getByTestId('surface');
  fireEvent.touchStart(surface, { touches: [{ clientX: 0, clientY: 0 }] });
  fireEvent.touchMove(surface, { touches: [{ clientX: 0, clientY: 90 }] });
  expect(surface).toHaveTextContent('1.00');
});
