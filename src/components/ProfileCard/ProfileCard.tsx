/*
 * Dental Signature Card — adaptação do React Bits "Profile Card"
 * (https://reactbits.dev/components/profile-card, código original em
 * assets-source/PROFILE_CARD_CODIGO_ORIGINAL.txt).
 *
 * Mantido do original: motor de tilt/glare/parallax (molas, intro, toque, giroscópio
 * opcional), camadas sheen/holo/glare/shade/rim e a API de props.
 * Adaptado: TypeScript; paleta Paraná (frame/tile creme e marrom); holografia em
 * champagne/dourado em vez de arco-íris; status "Online" removido; handle virou
 * link real para o Instagram; ícone Hugeicons trocado por Lucide (biblioteca única
 * do projeto); recorte da foto configurável (`photoPosition`).
 */
import { memo, useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { UserRound } from 'lucide-react';
import './ProfileCard.css';

type Palette = 'light' | 'dark';

const THEMES: Record<Palette, Record<string, string>> = {
  dark: {
    '--pc-frame': 'rgba(74, 46, 25, 0.62)',
    '--pc-frame-edge': 'rgba(255, 243, 231, 0.1)',
    '--pc-frame-highlight': 'rgba(255, 243, 231, 0.08)',
    '--pc-frame-shadow': '0 26px 50px -22px rgba(0, 0, 0, 0.75), 0 8px 18px -10px rgba(0, 0, 0, 0.5)',
    '--pc-tile': 'linear-gradient(180deg, #55361f 0%, #3a2414 100%)',
    '--pc-tile-edge': 'rgba(255, 243, 231, 0.08)',
    '--pc-tile-highlight': 'rgba(255, 243, 231, 0.12)',
    '--pc-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.6)',
    '--pc-ink': '#fff3e7',
    '--pc-muted': 'rgba(255, 243, 231, 0.72)',
    '--pc-hover': 'brightness(1.12)',
    '--pc-press': 'brightness(0.85)',
    '--pc-shade': 'rgba(20, 12, 6, 0.4)',
  },
  light: {
    '--pc-frame': 'rgba(251, 235, 217, 0.86)',
    '--pc-frame-edge': 'rgba(74, 46, 25, 0.09)',
    '--pc-frame-highlight': 'rgba(255, 250, 244, 0.95)',
    '--pc-frame-shadow': '0 26px 50px -24px rgba(74, 46, 25, 0.38), 0 8px 18px -12px rgba(74, 46, 25, 0.2)',
    '--pc-tile': 'linear-gradient(180deg, #fffaf4 0%, #f6e4cf 100%)',
    '--pc-tile-edge': 'rgba(74, 46, 25, 0.1)',
    '--pc-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--pc-tile-shadow': '0 4px 10px -5px rgba(74, 46, 25, 0.28)',
    '--pc-ink': '#4a2e19',
    '--pc-muted': 'rgba(74, 46, 25, 0.72)',
    '--pc-hover': 'brightness(0.97)',
    '--pc-press': 'brightness(0.92)',
    '--pc-shade': 'rgba(74, 46, 25, 0.14)',
  },
};

const FOILS: Record<Palette, Record<string, string>> = {
  dark: {
    '--pc-blend': 'soft-light',
    '--pc-holo-filter': 'none',
    '--pc-sheen': 'rgba(255, 243, 231, 0.16)',
  },
  light: {
    '--pc-blend': 'soft-light',
    '--pc-holo-filter': 'none',
    '--pc-sheen': 'rgba(255, 250, 244, 0.2)',
  },
};

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='g' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0.55 0 0 0 -0.24 0.55 0 0 0 -0.24 0.55 0 0 0 -0.24 0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>",
)}")`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const isDark = (color: string) => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(color).trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? match[1].replace(/./g, (digit) => digit + digit) : match[1];
  const [r, g, b] = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
};

interface Axis {
  p: number;
  v: number;
  target: number;
}

interface Engine {
  aim: (nx: number, ny: number, on?: boolean) => void;
  release: () => void;
  write: () => void;
}

export interface ProfileCardProps {
  avatarUrl?: string;
  avatarAlt?: string;
  photoPosition?: string;
  iconUrl?: string;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  handleUrl?: string;
  handleLabel?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  theme?: Palette;
  backdropColor?: string;
  radius?: number;
  holo?: number;
  glare?: number;
  enableTilt?: boolean;
  tiltStrength?: number;
  parallax?: number;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  intro?: boolean;
  className?: string;
  headingLevel?: 'h3' | 'h4';
}

const ProfileCard = ({
  avatarUrl = '',
  avatarAlt,
  photoPosition = 'center bottom',
  iconUrl,
  miniAvatarUrl,
  name = '',
  title = '',
  handle,
  handleUrl,
  handleLabel,
  contactText = 'Conhecer profissional',
  showUserInfo = true,
  onContactClick,
  theme = 'light',
  backdropColor,
  radius = 16,
  holo = 0.8,
  glare = 0.5,
  enableTilt = true,
  tiltStrength = 12,
  parallax = 8,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  intro = true,
  className = '',
  headingLevel = 'h3',
}: ProfileCardProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const settings = { enableTilt, tiltStrength, parallax, mobileTiltSensitivity, intro };
  const settingsRef = useRef(settings);
  useLayoutEffect(() => {
    settingsRef.current = settings;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = { width: root.offsetWidth, height: root.offsetHeight };
    const x: Axis = { p: 0, v: 0, target: 0 };
    const y: Axis = { p: 0, v: 0, target: 0 };
    const light = { p: 0, target: 0 };
    let raf = 0;
    let last = 0;
    let slowUntil = 0;
    let touchId: number | null = null;

    const write = () => {
      const { enableTilt: tiltOn, tiltStrength: strength, parallax: depth } = settingsRef.current;
      const angle = tiltOn && !reduced ? strength : 0;
      const tilt = Math.min(1, Math.hypot(x.p, y.p));
      const style = root.style;
      style.setProperty('--pc-light-x', `${((x.p + 1) * 0.5 * size.width).toFixed(1)}px`);
      style.setProperty('--pc-light-y', `${((y.p + 1) * 0.5 * size.height).toFixed(1)}px`);
      style.setProperty('--pc-pointer-x', `${((x.p + 1) * 50).toFixed(2)}%`);
      style.setProperty('--pc-pointer-y', `${((y.p + 1) * 50).toFixed(2)}%`);
      style.setProperty('--pc-band-x', `${(50 + x.p * 15).toFixed(2)}%`);
      style.setProperty('--pc-band-y', `${(50 + y.p * 15).toFixed(2)}%`);
      style.setProperty('--pc-rotate-x', `${(y.p * angle).toFixed(3)}deg`);
      style.setProperty('--pc-rotate-y', `${(-x.p * angle).toFixed(3)}deg`);
      style.setProperty('--pc-shift-x', `${(x.p * (reduced ? 0 : depth)).toFixed(2)}px`);
      style.setProperty('--pc-shift-y', `${(y.p * (reduced ? 0 : depth)).toFixed(2)}px`);
      style.setProperty('--pc-reach', tilt.toFixed(4));
      style.setProperty('--pc-tilt', (tilt * light.p).toFixed(4));
      style.setProperty('--pc-active', light.p.toFixed(4));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const slow = now < slowUntil;
      const stiffness = slow ? 24 : 120;
      const damping = slow ? 9 : 16;
      const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        for (const axis of [x, y]) {
          axis.v += (stiffness * (axis.target - axis.p) - damping * axis.v) * h;
          axis.p += axis.v * h;
        }
      }
      const tau = light.target > light.p ? 0.18 : slow ? 0.9 : 0.45;
      light.p += (light.target - light.p) * (1 - Math.exp(-dt / tau));
      write();
      const moving =
        Math.abs(x.target - x.p) > 0.0005 ||
        Math.abs(y.target - y.p) > 0.0005 ||
        Math.abs(x.v) > 0.0005 ||
        Math.abs(y.v) > 0.0005 ||
        Math.abs(light.target - light.p) > 0.002;
      if (moving) {
        raf = requestAnimationFrame(frame);
      } else {
        x.p = x.target;
        y.p = y.target;
        light.p = light.target;
        write();
        raf = 0;
      }
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const aim = (nx: number, ny: number, on = true) => {
      x.target = clamp(nx, -1, 1);
      y.target = clamp(ny, -1, 1);
      light.target = on ? 1 : 0;
      slowUntil = 0;
      wake();
    };

    const aimAt = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      aim(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const release = () => aim(0, 0, false);

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') aimAt(event);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerId === touchId) aimAt(event);
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') release();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      touchId = event.pointerId;
      aimAt(event);
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== touchId) return;
      touchId = null;
      release();
    };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);

    const observer = new ResizeObserver(() => {
      size.width = root.offsetWidth;
      size.height = root.offsetHeight;
      write();
    });
    observer.observe(root);

    engineRef.current = { aim, release, write };

    if (settingsRef.current.intro && !reduced) {
      x.p = 0.62;
      y.p = -0.55;
      light.p = 1;
      slowUntil = performance.now() + 1400;
      write();
      wake();
    } else {
      write();
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.write();
  }, [enableTilt, tiltStrength, parallax]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enableMobileTilt) return;

    let listening = false;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      const sensitivity = settingsRef.current.mobileTiltSensitivity;
      engineRef.current?.aim((event.gamma * sensitivity) / 150, ((event.beta - 20) * sensitivity) / 150);
    };
    const listen = () => {
      if (listening) return;
      listening = true;
      window.addEventListener('deviceorientation', onOrientation);
    };
    const onClick = () => {
      const Motion = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (Motion && typeof Motion.requestPermission === 'function') {
        Motion.requestPermission()
          .then((state) => {
            if (state === 'granted') listen();
          })
          .catch(() => {});
      } else {
        listen();
      }
    };

    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, [enableMobileTilt]);

  const palette: Palette = theme === 'dark' ? 'dark' : 'light';
  const foil: Palette = backdropColor ? ((isDark(backdropColor) ?? palette === 'dark') ? 'dark' : 'light') : palette;
  const backdrop = backdropColor
    ? `linear-gradient(180deg, color-mix(in srgb, ${backdropColor}, #ffffff 12%) 0%, color-mix(in srgb, ${backdropColor}, #000000 18%) 100%)`
    : 'var(--pc-tile)';
  const Heading = headingLevel;

  return (
    <div
      ref={rootRef}
      className={`profile-card ${className}`.trim()}
      style={
        {
          ...THEMES[palette],
          ...FOILS[foil],
          '--pc-radius': `${Math.max(0, radius)}px`,
          '--pc-backdrop': backdrop,
          '--pc-holo': clamp(holo, 0, 1),
          '--pc-glare': clamp(glare, 0, 1),
          '--pc-parallax': `${Math.max(0, parallax)}px`,
          '--pc-grain': GRAIN,
          '--pc-pattern': iconUrl ? `url("${iconUrl}")` : 'linear-gradient(#000, #000)',
          '--pc-pattern-size': iconUrl ? '180% auto' : '100% 100%',
          '--pc-holo-gain': iconUrl ? 1.25 : 0.75,
          '--pc-holo-detail': iconUrl && foil === 'dark' ? 1 : 0,
          '--pc-photo-position': photoPosition,
        } as CSSProperties
      }
    >
      <div className="profile-card__body">
        <div className="profile-card__tile">
          <span className="profile-card__sheen" />
          <span className="profile-card__holo">
            <span className="profile-card__holo-glow" />
            <span className="profile-card__holo-shift" />
          </span>
          {avatarUrl && (
            <img
              className="profile-card__photo"
              src={avatarUrl}
              alt={avatarAlt ?? name}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          )}
          {(name || title) && (
            <>
              <span className="profile-card__scrim" />
              <div className="profile-card__info">
                {name && <Heading className="profile-card__name">{name}</Heading>}
                {title && <p className="profile-card__title">{title}</p>}
              </div>
            </>
          )}
          <span className="profile-card__tile-rim" />
        </div>

        {showUserInfo && (
          <div className="profile-card__footer">
            {miniAvatarUrl && (
              <span className="profile-card__avatar">
                <img src={miniAvatarUrl} alt="" loading="lazy" draggable={false} />
              </span>
            )}
            <div className="profile-card__meta">
              {handle &&
                (handleUrl ? (
                  <a
                    className="profile-card__handle"
                    href={handleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={handleLabel}
                  >
                    @{handle}
                  </a>
                ) : (
                  <span className="profile-card__handle">@{handle}</span>
                ))}
            </div>
            {contactText && (
              <button
                type="button"
                className="profile-card__contact"
                onClick={onContactClick}
                aria-label={name ? `${contactText}: ${name}` : contactText}
                aria-haspopup="dialog"
              >
                <UserRound size={16} strokeWidth={1.8} aria-hidden="true" />
                {contactText}
              </button>
            )}
          </div>
        )}

        <span className="profile-card__glare" />
        <span className="profile-card__shade" />
        <span className="profile-card__rim" />
      </div>
    </div>
  );
};

export default memo(ProfileCard);
