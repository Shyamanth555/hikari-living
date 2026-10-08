import { useEffect, useState } from 'react';

/**
 * The current time in ms, re-rendering every `intervalMs` while `enabled` —
 * drives sale countdowns and flips prices the moment a sale starts or ends.
 *
 * @param {boolean} enabled
 * @param {number} intervalMs
 */
export function useNow(enabled = true, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs]);

  return now;
}
