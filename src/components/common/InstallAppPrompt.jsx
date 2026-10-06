import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Share, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePwaInstall } from '../../hooks/usePwaInstall';

const DISMISSED_AT_KEY = 'hikari:install-prompt-dismissed-at';
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000; // "Not now" hides it for a week
const SHOW_AFTER_MS = 3000;

const recentlyDismissed = () => {
  try {
    return Date.now() - Number(localStorage.getItem(DISMISSED_AT_KEY) || 0) < SNOOZE_MS;
  } catch {
    return false;
  }
};

/**
 * Invites shoppers to install the site as an app, so they don't have to find
 * "Install app" in the browser menu. Chrome/Edge/Android get a one-tap Install
 * button; iOS (which has no install API) gets the Add to Home Screen steps.
 */
export function InstallAppPrompt() {
  const { canPrompt, installed, isIos, promptInstall } = usePwaInstall();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(recentlyDismissed);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    } catch {
      // Storage blocked (e.g. private mode) — it just shows again next visit.
    }
  };

  const handleInstall = async () => {
    if ((await promptInstall()) === 'dismissed') dismiss();
  };

  // Never interrupt someone in the middle of paying.
  const visible = ready && !dismissed && !installed && (canPrompt || isIos) && !pathname.startsWith('/checkout');
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-app-title"
      className="fixed bottom-4 left-4 right-4 z-40 rounded-lg border border-border bg-cream-50 p-4 shadow-xl sm:right-auto sm:w-full sm:max-w-sm"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <img src="/pwa-192x192.png" alt="" className="h-12 w-12 shrink-0 rounded-lg" />
        <div>
          <p id="install-app-title" className="font-display text-base text-foreground">
            Install the Hikari Living app
          </p>
          {canPrompt ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Shop faster and track your orders right from your home screen.
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Tap <Share className="inline h-4 w-4 align-text-bottom" aria-hidden="true" />{' '}
              <span className="font-medium text-foreground">Share</span> in your browser, then choose{' '}
              <span className="font-medium text-foreground">Add to Home Screen</span>.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        {canPrompt ? (
          <>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              Not now
            </Button>
            <Button size="sm" onClick={handleInstall}>
              Install
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={dismiss}>
            Got it
          </Button>
        )}
      </div>
    </div>
  );
}
