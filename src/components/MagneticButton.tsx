import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: ReactNode;
  strength?: number;
}

/** Magnetic CTA: atração discreta ao cursor. Desligado em toque e com movimento reduzido. */
export function MagneticButton({ children, strength = 10, className = '', ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const active = finePointer && !reduced;

  return (
    <motion.button
      ref={ref}
      className={`magnetic ${className}`.trim()}
      style={active ? { x: sx, y: sy } : undefined}
      onPointerMove={(event) => {
        if (!active || event.pointerType !== 'mouse' || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        x.set(dx * strength);
        y.set(dy * strength * 0.6);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
