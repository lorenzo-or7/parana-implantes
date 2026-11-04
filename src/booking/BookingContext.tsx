import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { BookingTreatmentId } from '../data/treatments';

interface BookingValue {
  isOpen: boolean;
  /** Tratamento pré-selecionado quando a ação veio de um card. */
  preset: BookingTreatmentId | null;
  /** Incrementa a cada abertura para reiniciar o fluxo. */
  session: number;
  openBooking: (preset?: BookingTreatmentId | null) => void;
  closeBooking: () => void;
  returnFocusTo: React.RefObject<HTMLElement | null>;
}

const BookingContext = createContext<BookingValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [preset, setPreset] = useState<BookingTreatmentId | null>(null);
  const [session, setSession] = useState(0);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((next: BookingTreatmentId | null = null) => {
    const active = document.activeElement;
    returnFocusTo.current = active instanceof HTMLElement && active !== document.body ? active : null;
    setPreset(next);
    setSession((s) => s + 1);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, preset, session, openBooking, closeBooking, returnFocusTo }),
    [isOpen, preset, session, openBooking, closeBooking],
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking precisa do BookingProvider');
  return ctx;
}
