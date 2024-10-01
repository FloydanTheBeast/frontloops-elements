const body = document.querySelector('body');
const cursor = document.querySelector('#cursor');

function moveCursor(e) {
  cursor.style.left = `${e.clientX - cursor.clientWidth / 2}px`;
  cursor.style.top = `${e.clientY - cursor.clientHeight / 2}px`;
}

function spawnRipple(e) {
  const ripple = document.createElement('div');

  ripple.classList.add('ripple');
  ripple.style.display = 'none';

  body.appendChild(ripple);

  setTimeout(() => {
    ripple.style.display = 'unset';
    ripple.style.left = `${e.clientX - ripple.offsetWidth / 2}px`;
    ripple.style.top = `${e.clientY - ripple.offsetHeight / 2}px`;
    ripple.addEventListener('animationend', () => ripple.remove());
  }, 0);
}

window.addEventListener('mousemove', moveCursor);
window.addEventListener('click', spawnRipple);
document.addEventListener('mouseleave', function (event) {
  if (
    event.clientY <= 0 ||
    event.clientX <= 0 ||
    event.clientX >= window.innerWidth ||
    event.clientY >= window.innerHeight
  ) {
    cursor.style.display = 'none';
  }
});
document.addEventListener('mouseenter', function () {
  cursor.style.display = 'unset';
});
