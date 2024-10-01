const startBtn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

function startOnboarding() {
  const items = document.querySelectorAll('.onboarding__item');
  let currentIdx = 0;

  overlay.classList.add('active');

  function highlightCurrentItem() {
    items[currentIdx].classList.add('active');

    items[currentIdx].addEventListener('click', function handler() {
      this.removeEventListener('click', handler);
      items[currentIdx].classList.remove('active');

      if (currentIdx < items.length - 1) {
        currentIdx++;
        highlightCurrentItem();
      } else {
        overlay.classList.remove('active');
      }
    });
  }

  highlightCurrentItem();
}

startBtn.addEventListener('click', startOnboarding);
