class ToastManager {
  constructor(root, closeDelay = 1500) {
    this.root = root;
    this.closeDelay = closeDelay;

    this.toastContainer = document.createElement('div');
    this.timer = null;

    this.toastContainer.classList.add('toast');

    this.toastContainer.addEventListener('mouseenter', this.#stopTimer.bind(this));
    this.toastContainer.addEventListener('mouseleave', this.#startTimer.bind(this));
  }

  spawnToast(text, type = 'message') {
    if (this.timer) return;

    let modifierClass;

    switch (type) {
      case 'message':
        modifierClass = 'toast_message';
        break;
      case 'alert':
        modifierClass = 'toast_alert';
        break;
    }

    this.toastContainer.classList.add(modifierClass);

    this.toastContainer.textContent = text;
    this.root.appendChild(this.toastContainer);

    this.#startTimer();
  }

  #startTimer() {
    this.timer = setTimeout(() => {
      this.toastContainer.classList.add('hiding');

      setTimeout(() => {
        this.timer = null;

        this.toastContainer.classList.remove('hiding');
        this.toastContainer.classList.remove('toast_message');
        this.toastContainer.classList.remove('toast_alert');

        this.root.removeChild(this.toastContainer);
      }, 350);
    }, this.closeDelay);
  }

  #stopTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }
}

(() => {
  const toastManager = new ToastManager(document.querySelector('body'), 1_500);

  const messageBtn = document.querySelector('.toast__button_message');
  const alertBtn = document.querySelector('.toast__button_alert');

  messageBtn.addEventListener('click', () => {
    toastManager.spawnToast('Just a usual message');
  });

  alertBtn.addEventListener('click', () => {
    toastManager.spawnToast('Here is your error', 'alert');
  });
})();
