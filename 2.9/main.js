class CustomSlider extends HTMLElement {
  static formAssociated = true;
  #sliderContainer;
  #slider;
  #sliderPin;
  #isPinClicked;
  #internals;

  static get observedAttributes() {
    return ['min', 'max'];
  }

  get value() {
    this.getAttribute('value') ?? 0;
  }

  set value(v) {
    this.setAttribute('value', v);
    this.#internals.setFormValue(v);
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  constructor() {
    super();

    this.#internals = this.attachInternals();

    this.#sliderContainer = document.createElement('div');
    this.#sliderContainer.classList.add('slider-container');

    this.#slider = document.createElement('div');
    this.#slider.classList.add('slider-container_slider');

    this.#sliderPin = document.createElement('div');
    this.#sliderPin.classList.add('slider-container_slider_slider-pin');

    this.#sliderPin.addEventListener('mousedown', e => {
      this.#isPinClicked = true;
    });

    window.addEventListener('mouseup', e => {
      this.#isPinClicked = false;
    });

    window.addEventListener('mousemove', e => {
      if (this.#isPinClicked) {
        const { left, right } = this.#sliderContainer.getClientRects()[0];

        const value = Math.round(Math.max(0, Math.min(100, ((e.x - left) / (right - left)) * 100)));

        this.value = value;
        this.#slider.style.width = `${value}%`;
      }
    });

    this.#slider.appendChild(this.#sliderPin);
    this.#sliderContainer.appendChild(this.#slider);
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'min') {
      this.min = +newValue;
    }

    if (name === 'max') {
      this.max = +newValue;
    }

    if (name === 'value') {
      this.value = +newValue;
    }
  }

  connectedCallback() {
    this.appendChild(this.#sliderContainer);
  }
}

customElements.define('custom-slider', CustomSlider);

const form = document.querySelector('form');
const sliderValueLabel = document.querySelector('#slider-value');

form.addEventListener('change', e => {
  const formData = Object.fromEntries(new FormData(e.currentTarget));
  sliderValueLabel.textContent = formData?.['slider'];
});
