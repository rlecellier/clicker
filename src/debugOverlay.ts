// Temporary: with ?debug in the URL, shows the widths the browser uses for the
// page, to find what makes Firefox on Android scroll sideways. To be removed
// once the cause is fixed.

const describe = (element: Element) => {
  const name = element.getAttribute('class')?.split(' ', 1)[0] ?? '';
  const text = (element.textContent ?? '').trim().slice(0, 16);
  return `${element.tagName.toLowerCase()}.${name} "${text}"`;
};

const isClipped = (element: Element) => {
  for (
    let parent = element.parentElement;
    parent;
    parent = parent.parentElement
  ) {
    if (parent.id === 'root') return false;
    const { overflowX } = getComputedStyle(parent);
    if (overflowX !== 'visible') return true;
  }
  return false;
};

const report = () => {
  const html = document.documentElement;
  const root = document.querySelector('#root');
  const viewport = visualViewport;
  const width = html.clientWidth;
  const outside = [...document.querySelectorAll('body *')]
    .map((element) => ({ element, box: element.getBoundingClientRect() }))
    .filter(
      ({ element, box }) =>
        box.width > 0 &&
        !element.closest('[data-debug]') &&
        !isClipped(element) &&
        (box.right > width + 0.5 || box.left < -0.5),
    )
    .toSorted((a, b) => b.box.right - a.box.right)
    .slice(0, 6)
    .map(
      ({ element, box }) =>
        `${Math.round(box.left)}→${Math.round(box.right)} ${getComputedStyle(element).position} ${describe(element)}`,
    );
  return [
    `screen ${screen.width} dpr ${devicePixelRatio.toFixed(3)} font ${getComputedStyle(html).fontSize}`,
    `inner ${innerWidth} outer ${outerWidth} client ${width}`,
    `scrollW html ${html.scrollWidth} body ${document.body.scrollWidth} scrollX ${Math.round(scrollX)}`,
    `#root ${root ? Math.round(root.getBoundingClientRect().width) : '-'} body ${Math.round(document.body.getBoundingClientRect().width)}`,
    viewport
      ? `visual ${Math.round(viewport.width)} scale ${viewport.scale.toFixed(3)} left ${Math.round(viewport.offsetLeft)}`
      : 'visual -',
    ...(outside.length > 0 ? outside : ['nothing outside']),
  ].join('\n');
};

export const showDebugOverlay = () => {
  const panel = document.createElement('pre');
  panel.dataset.debug = '';
  Object.assign(panel.style, {
    position: 'fixed',
    left: '0',
    bottom: '0',
    zIndex: '9999',
    boxSizing: 'border-box',
    width: '100%',
    margin: '0',
    padding: '6px',
    overflow: 'hidden',
    background: 'rgb(0 0 0 / 0.85)',
    color: '#0f0',
    font: '11px/1.3 monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    pointerEvents: 'none',
  });
  document.body.append(panel);
  const update = () => {
    panel.textContent = report();
  };
  update();
  setInterval(update, 1000);
  addEventListener('scroll', update, { passive: true });
  visualViewport?.addEventListener('resize', update);
  visualViewport?.addEventListener('scroll', update);
};
