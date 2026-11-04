import { useRef, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '../theme/ThemeContext';
import './ThemeSwitch.css';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Tema claro', Icon: Sun },
  { value: 'dark', label: 'Tema escuro', Icon: Moon },
];

/** Champagne Switch (opção 02): cápsula segmentada sol/lua. */
export function ThemeSwitch({ id = 'theme', className = '' }: { id?: string; className?: string }) {
  const { theme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next: Theme =
      event.key === 'Home' ? 'light' : event.key === 'End' ? 'dark' : theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    refs.current[next === 'light' ? 0 : 1]?.focus();
  };

  return (
    <div className={`theme-switch ${className}`.trim()} role="radiogroup" aria-label="Tema do site" onKeyDown={onKeyDown}>
      {OPTIONS.map(({ value, label, Icon }, index) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            tabIndex={selected ? 0 : -1}
            className="theme-switch__option"
            onClick={() => setTheme(value)}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-thumb`}
                className="theme-switch__thumb"
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="theme-switch__icon" size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
