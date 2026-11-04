import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { asset } from '../lib/asset';
import { useBooking } from '../booking/BookingContext';
import { MagneticButton } from './MagneticButton';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openBooking } = useBooking();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOn, setParallaxOn] = useState(false);

  // Parallax Depth: só em telas largas com ponteiro fino (evita mobile fraco).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const update = () => setParallaxOn(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const depth = parallaxOn && !reduced;

  // Cinematic Reveal: foto primeiro, texto em sequência (~1,6 s no total).
  const line = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section id="inicio" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__frame">
        <motion.div className="hero__media" style={depth ? { y: imageY } : undefined}>
          <motion.img
            className="hero__img"
            src={asset('assets/clinica/recepcao_principal_hero.webp')}
            alt="Recepção da Paraná Implantes, com painel de madeira ripada, luminárias pendentes e o letreiro da clínica iluminado"
            width={1024}
            height={1019}
            fetchPriority="high"
            decoding="async"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1.04 }}
            transition={{ duration: reduced ? 0.2 : 1.6, ease: EASE }}
          />
        </motion.div>
        <div className="hero__shade" aria-hidden="true" />

        <motion.div className="hero__content" style={depth ? { y: copyY } : undefined}>
          <motion.p className="hero__eyebrow" {...line(0.35)}>
            Paraná Implantes · Curitiba
          </motion.p>
          <motion.h1 id="hero-title" className="hero__title" {...line(0.5)}>
            Onde tecnologia se une ao bem-estar.
          </motion.h1>
          <motion.p className="hero__sub" {...line(0.68)}>
            Uma experiência acolhedora, com tecnologia e cuidado em cada detalhe.
          </motion.p>
          <motion.div className="hero__actions" {...line(0.84)}>
            <MagneticButton type="button" className="btn hero__cta" onClick={() => openBooking()}>
              Agendar avaliação
              <span className="hero__cta-arrow" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.8} />
              </span>
            </MagneticButton>
            <a href="#experiencia" className="btn hero__ghost">
              Conheça a clínica
            </a>
          </motion.div>
        </motion.div>

        <motion.a
          href="#sobre"
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 1.4, duration: 0.6 }}
        >
          <span className="hero__scroll-line" aria-hidden="true" />
          Role para conhecer
        </motion.a>
      </div>
    </section>
  );
}
