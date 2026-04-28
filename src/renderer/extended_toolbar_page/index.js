console.log('[DRAWPEN]: Extended toolbar page loading...');

const toolbar = document.getElementById('toolbar');
const closeAppButton = toolbar.querySelector('.toolbar__close');
const switchToDrawButtons = toolbar.querySelectorAll('.toolbar__main-button button, .toolbar__slider');

closeAppButton.addEventListener('click', (e) => {
  e.stopPropagation();
  window.electronAPI.invokeCloseApp();
});

// Click-vs-drag detection threshold (px). Movement above this becomes a drag.
const DRAG_THRESHOLD = 5;

let drag = null;

const onPointerDown = (e) => {
  if (e.button !== 0) return;
  drag = {
    startX: e.screenX,
    startY: e.screenY,
    lastX: e.screenX,
    lastY: e.screenY,
    moved: false,
  };
};

const onPointerMove = (e) => {
  if (!drag) return;
  const dx = e.screenX - drag.lastX;
  const dy = e.screenY - drag.lastY;
  if (!drag.moved) {
    const totalDx = e.screenX - drag.startX;
    const totalDy = e.screenY - drag.startY;
    if (Math.hypot(totalDx, totalDy) < DRAG_THRESHOLD) return;
    drag.moved = true;
  }
  drag.lastX = e.screenX;
  drag.lastY = e.screenY;
  window.electronAPI.dragBy(dx, dy);
};

const onPointerUp = () => {
  drag = null;
};

window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointercancel', onPointerUp);

// Buttons fire only on click; if a drag happened, suppress the click.
const wireButtonClick = (btn, handler) => {
  btn.addEventListener('click', (e) => {
    if (drag && drag.moved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handler(e);
  });
};

switchToDrawButtons.forEach(button => {
  wireButtonClick(button, () => {
    const bounds = toolbar.getBoundingClientRect();
    window.electronAPI.invokeDrawModeAt(
      Math.round(window.screenX + bounds.left),
      Math.round(window.screenY + bounds.top)
    );
  });
});
