import { animatePulse, animateFadeOut } from './animation.js';

const TIMER_CIRCLE_STYLES = document.createElement('style');
TIMER_CIRCLE_STYLES.textContent = `
  .timer_item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fc9642;
    text-align: center;
    line-height: 40px;
    color: #fff;
  }
`;

class TimerCircle extends HTMLElement {
  constructor(root, timerSeconds) {
    super();

    this.root = root;
    this.timerSeconds = timerSeconds + 1;
    this.root.appendChild(this);
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(TIMER_CIRCLE_STYLES.cloneNode(true));

    const element = document.createElement('div');
    element.classList.add('timer_item');

    this.element = shadow.appendChild(element);
    this.animationStatePulse = animatePulse(this.element);

    this.updateView();

    this.interval = setInterval(() => {
      this.updateView();
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  updateView() {
    if (this.timerSeconds <= 1 && !this.animationStateFadeOut?.requestId) {
      cancelAnimationFrame(this.animationStatePulse.requestId);
      this.animationStateFadeOut = animateFadeOut(this.element);
    }

    if (this.timerSeconds <= 0) {
      cancelAnimationFrame(this.animationStateFadeOut.requestId);
      this.root.removeChild(this);
    }

    this.timerSeconds--;
    this.element.innerText = this.timerSeconds;
  }
}

customElements.define('timer-circle', TimerCircle);

(() => {
  const timerForm = document.querySelector('.timer-form');
  const timerItemsContainer = document.querySelector('.timer_items-container');

  timerForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(timerForm);
    const values = Object.fromEntries(formData);

    if (!values['timer-seconds']) {
      return;
    }

    const timerSeconds = Number(values['timer-seconds']);

    new TimerCircle(timerItemsContainer, timerSeconds);

    timerForm.reset();
  });
})();
