// Bloqueio de rolagem com contador (menu e modais podem se sobrepor).
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  const gap = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = gap > 0 ? `${gap}px` : '';
  document.documentElement.style.setProperty('--scrollbar-gap', `${gap}px`);
  document.body.classList.add('is-locked');
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.body.classList.remove('is-locked');
  document.body.style.paddingRight = '';
  document.documentElement.style.setProperty('--scrollbar-gap', '0px');
}
