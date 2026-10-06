import { useSyncExternalStore } from 'react';
import { getSnapshot, isIos, promptInstall, subscribe } from '../lib/pwaInstall';

export function usePwaInstall() {
  const { canPrompt, installed } = useSyncExternalStore(subscribe, getSnapshot);
  return { canPrompt, installed, isIos, promptInstall };
}
