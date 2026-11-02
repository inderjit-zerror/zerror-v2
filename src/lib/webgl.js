'use client';

import { useSyncExternalStore } from 'react';
import { store } from './store';

let supported;

function detect() {
  if (supported === undefined) {
    try {
      supported = !!document.createElement('canvas').getContext('webgl2');
    } catch {
      supported = false;
    }
    store.glSupported = supported;
  }
  return supported;
}

const subscribe = () => () => {};

// WebGL2 availability, resolved once on the client. `serverValue` is used during SSR.
export function useWebGLSupport(serverValue) {
  return useSyncExternalStore(subscribe, detect, () => serverValue);
}
