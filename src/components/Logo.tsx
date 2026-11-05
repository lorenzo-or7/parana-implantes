import { asset } from '../lib/asset';
import './Logo.css';

/**
 * Logo principal manuscrita (assinatura do Instagram).
 * O desenho é o arquivo original; a versão com alfa (scripts/optimize-assets.mjs)
 * só remove o fundo taupe para a marca acompanhar a cor do texto em cada tema.
 *
 * A máscara vai no estilo inline (e não numa variável CSS): url() relativa dentro de
 * custom property é resolvida a partir do arquivo CSS do build, o que quebrava a logo
 * em subdiretório (GitHub Pages).
 */
const LOGO_URL = `url("${asset('assets/marca/logo_principal_alpha.png')}")`;

export function Logo({ className = '', label = 'Paraná Implantes' }: { className?: string; label?: string }) {
  return (
    <span
      className={`logo ${className}`.trim()}
      role="img"
      aria-label={label}
      style={{ WebkitMaskImage: LOGO_URL, maskImage: LOGO_URL }}
    />
  );
}
