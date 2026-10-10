import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type MyWhy = {
  id: string;
  question: string;
  /** Your own answer or notes; empty until you figure it out. */
  answer: string;
  createdAt: number;
  updatedAt: number;
};

type State = {
  saved: string[];
  mine: MyWhy[];
};

type Store = State & {
  loaded: boolean;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  addMine: (question: string) => MyWhy;
  updateMine: (id: string, changes: Partial<Pick<MyWhy, 'question' | 'answer'>>) => void;
  removeMine: (id: string) => void;
};

const STORAGE_KEY = 'why.state.v1';
const EMPTY: State = { saved: [], mine: [] };

const StoreContext = createContext<Store | null>(null);

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function WhyStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch((error) => console.warn('Could not load saved data', error))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    // Don't overwrite stored data with the empty initial state before it has loaded.
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) =>
      console.warn('Could not save data', error),
    );
  }, [state, loaded]);

  const toggleSaved = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
    }));
  }, []);

  const addMine = useCallback((question: string) => {
    const now = Date.now();
    const item: MyWhy = { id: newId(), question: question.trim(), answer: '', createdAt: now, updatedAt: now };
    setState((s) => ({ ...s, mine: [item, ...s.mine] }));
    return item;
  }, []);

  const updateMine = useCallback((id: string, changes: Partial<Pick<MyWhy, 'question' | 'answer'>>) => {
    setState((s) => ({
      ...s,
      mine: s.mine.map((m) => (m.id === id ? { ...m, ...changes, updatedAt: Date.now() } : m)),
    }));
  }, []);

  const removeMine = useCallback((id: string) => {
    setState((s) => ({ ...s, mine: s.mine.filter((m) => m.id !== id) }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      loaded,
      isSaved: (id) => state.saved.includes(id),
      toggleSaved,
      addMine,
      updateMine,
      removeMine,
    }),
    [state, loaded, toggleSaved, addMine, updateMine, removeMine],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useWhyStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useWhyStore must be used inside WhyStoreProvider');
  return store;
}
