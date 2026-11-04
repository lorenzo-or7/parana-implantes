import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import './Dialog.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  /** Pedido de fechamento (Escape, fundo ou botão). Quem chama decide se fecha. */
  onRequestClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  /** Elemento que recebe foco ao abrir; padrão: primeiro focável. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Elemento que recebe o foco de volta ao fechar. */
  returnFocus?: RefObject<HTMLElement | null>;
  size?: 'md' | 'lg';
  className?: string;
  closeLabel?: string;
}

/**
 * Modal acessível: no desktop centralizado; no mobile vira painel inferior (drawer).
 * Foco preso, Escape, bloqueio de rolagem e restauração de foco.
 */
export function Dialog({
  open,
  onRequestClose,
  labelledBy,
  describedBy,
  children,
  initialFocus,
  returnFocus,
  size = 'md',
  className = '',
  closeLabel = 'Fechar',
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const requestCloseRef = useRef(onRequestClose);
  useLayoutEffect(() => {
    requestCloseRef.current = onRequestClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const restoreTarget = returnFocus;
    lockScroll();

    const focusFirst = () => {
      const panel = panelRef.current;
      if (!panel) return;
      // Prioriza o conteúdo (campo marcado ou primeiro controle); o botão Fechar vem por último.
      const content = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.classList.contains('dialog-close'));
      const checked = content.find((el) => el instanceof HTMLInputElement && el.checked);
      const target = initialFocus?.current ?? checked ?? content[0] ?? panel;
      target.focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        requestCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey, true);
      unlockScroll();
      const target = restoreTarget?.current ?? previous;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
  }, [open, initialFocus, returnFocus]);

  const duration = reduced ? 0 : 0.32;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="dialog-root">
          <motion.div
            className="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.24 }}
            onClick={() => requestCloseRef.current()}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            className={`dialog-panel dialog-panel--${size} ${className}`.trim()}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.99 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="dialog-close" onClick={() => requestCloseRef.current()} aria-label={closeLabel}>
              <X size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
