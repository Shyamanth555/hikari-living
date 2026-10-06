// Chrome, Edge and Android browsers fire `beforeinstallprompt` once per page
// load, possibly before React has mounted — so it's caught here at import time
// (main.jsx imports this first) and handed to the install popup later.

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

let deferredPrompt = null;
let state = { canPrompt: false, installed: isStandalone() };
const listeners = new Set();

const setState = (next) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // our own popup replaces the browser's mini-infobar
  deferredPrompt = event;
  setState({ canPrompt: true });
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  setState({ canPrompt: false, installed: true });
});

// iOS has no install prompt at all — only Share → "Add to Home Screen".
// iPadOS reports itself as a Mac, so it's told apart by its touch screen.
export const isIos =
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => state;

/** Shows the browser's install dialog. Resolves to 'accepted', 'dismissed' or 'unavailable'. */
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable';
  const promptEvent = deferredPrompt;
  deferredPrompt = null; // a prompt event can only be shown once
  setState({ canPrompt: false });
  promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  return outcome;
}
