class VideoPlayer extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'width'];
  }

  constructor() {
    super();

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'video-player.css';

    this.appendChild(style);

    this.container = document.createElement('div');
    this.container.classList.add('container');

    this.videoContainer = document.createElement('div');
    this.videoContainer.classList.add('video-container');

    this.video = document.createElement('video');

    this.videoOverflow = document.createElement('div');
    this.videoOverflow.classList.add('video-overflow');

    this.videoOverflowBtn = document.createElement('div');
    this.videoOverflowBtn.classList.add('video-overflow_btn');

    this.videoOverflow.appendChild(this.videoOverflowBtn);

    this.videoOverflow.addEventListener('click', () =>
      this.video.paused ? this.video.play() : this.video.pause(),
    );

    this.video.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));

    this.video.addEventListener('pause', this.toggleVideo.bind(this, false));
    this.video.addEventListener('play', this.toggleVideo.bind(this, true));

    this.videoContainer.append(...[this.video, this.videoOverflow]);

    this.container.appendChild(this.videoContainer);
  }

  toggleVideo(isPlaying) {
    if (isPlaying === null) isPlaying = this.video.paused;
    isPlaying ? this.video.play() : this.video.pause();
    this.videoOverflow.classList.toggle('hidden', isPlaying);
  }

  handleTimeUpdate(e) {
    const width = (this.progressbar.dataset.width =
      (this.video.currentTime / this.video.duration) * 100);

    this.progressbar.style.width = `${width}%`;
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'src') {
      this.video.src = newValue;
    }

    if (name === 'width') {
      this.video.width = newValue;
    }
  }

  connectedCallback() {
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('controls-container');

    const backBtn = document.createElement('button');
    backBtn.textContent = 'back 5s';
    backBtn.onclick = () => (this.video.currentTime -= 5);

    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'skip 5s';
    skipBtn.onclick = () => (this.video.currentTime += 5);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'reset';
    resetBtn.onclick = () => (this.video.currentTime = 0);

    const progressbarContainer = document.createElement('div');
    progressbarContainer.classList.add('progressbar-container');
    progressbarContainer.addEventListener(
      'click',
      e => (this.video.currentTime = this.video.duration * (e.offsetX / e.target.offsetWidth)),
    );

    this.progressbar = document.createElement('div');
    this.progressbar.classList.add('progressbar-container_progress');

    progressbarContainer.appendChild(this.progressbar);

    controlsContainer.append(...[backBtn, skipBtn, resetBtn, progressbarContainer]);

    this.container.appendChild(controlsContainer);

    this.appendChild(this.container);
  }
}

customElements.define('video-player', VideoPlayer);
