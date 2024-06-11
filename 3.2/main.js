const card = document.querySelector('.card');
const point = document.querySelector('.point');

const cardRect = card.getBoundingClientRect();
const { width: pointWidth, height: pointHeight } = point.getBoundingClientRect();

const POINT_SPEED = 5; // pixels/second

let animationFrame;
let x = point.offsetLeft,
  y = point.offsetTop;

document.addEventListener('keydown', event => {
  if (animationFrame) return;

  animationFrame = requestAnimationFrame(function animate() {
    switch (event.key) {
      case 'ArrowLeft':
        x -= POINT_SPEED;
        break;
      case 'ArrowUp':
        y -= POINT_SPEED;
        break;
      case 'ArrowRight':
        x += POINT_SPEED;
        break;
      case 'ArrowDown':
        y += POINT_SPEED;
        break;
    }

    x = Math.min(cardRect.width - pointWidth / 2, Math.max(x, pointWidth / 2));
    y = Math.min(cardRect.height - pointHeight / 2, Math.max(y, pointHeight / 2));

    point.style.left = `${x}px`;
    point.style.top = `${y}px`;

    animationFrame = requestAnimationFrame(animate);
  });
});

document.addEventListener('keyup', event => {
  cancelAnimationFrame(animationFrame);
  animationFrame = null;
});
