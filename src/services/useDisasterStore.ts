import { useSyncExternalStore } from 'react';
import { disasterStore, DisasterStoreState } from './disasterStore';

function subscribe(callback: () => void) {
  return disasterStore.subscribe(callback);
}

function getSnapshot(): DisasterStoreState {
  return disasterStore.getState();
}

export function useDisasterStore(): DisasterStoreState & { store: typeof disasterStore } {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { ...state, store: disasterStore };
}
