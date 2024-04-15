export const animatePulse = (elem, scale = 1.25, duration = 750) => {
  const state = { requestId: null };
  const start = performance.now();

  state.requestId = requestAnimationFrame(function animate(time) {
    const forward = Math.trunc(((time - start) / duration) % 2) == 0;
    let progress = 1 - Math.sqrt(((time - start) / duration) % 1);

    if (!forward) progress = 1 - progress;

    elem.style.transform = `scale(${1 + (scale - 1) * progress})`;

    state.requestId = requestAnimationFrame(animate);
  });

  return state;
};

export const animateFadeOut = (elem, scale = 1.5, duration = 300) => {
  const state = { requestId: null };
  const start = performance.now();

  state.requestId = requestAnimationFrame(function animate(time) {
    let progress = (time - start) / duration;

    elem.style.opacity = `${1 - progress}`;
    elem.style.transform = `scale(${1 + (scale - 1) * progress})`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  });

  return state;
};
