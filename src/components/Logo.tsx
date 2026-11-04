import { asset } from '../lib/asset';
import './Logo.css';

/**
 * Logo principal manuscrita (assinatura do Instagram).
 * O desenho é o arquivo original; a versão com alfa (scripts/optimize-assets.mjs)
 * só remove o fundo taupe para a marca acompanhar a cor do texto em cada tema.
 */
export function Logo({ className = '', label = 'Paraná Implantes' }: { className?: string; label?: string }) {
  return (
    <span
      className={`logo ${className}`.trim()}
      role="img"
      aria-label={label}
      style={{ '--logo-src': `url("${asset('assets/marca/logo_principal_alpha.png')}")` } as React.CSSProperties}
    />
  );
}
