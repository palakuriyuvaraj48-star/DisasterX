import { useEffect, useState } from 'react';
import { disasterStore, DisasterStoreState } from './disasterStore';

export function useDisasterStore(): DisasterStoreState & { store: typeof disasterStore } {
  const [state, setState] = useState<DisasterStoreState>(disasterStore.getState());

  useEffect(() => {
    const unsubscribe = disasterStore.subscribe(() => {
      setState({ ...disasterStore.getState() });
    });
    return unsubscribe;
  }, []);

  return { ...state, store: disasterStore };
}
