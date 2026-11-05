import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { asset } from '../lib/asset';
import { useBooking } from '../booking/BookingContext';
import { MagneticButton } from './MagneticButton';
import './Hero.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero Cinematic Editorial.
 * A foto original tem 1024 × 1019 px: em vez de esticá-la na largura da tela,
 * ela ocupa a coluna da direita (≈ tamanho real em 1440–1920 px), e o texto
 * fica sobre o fundo marrom da moldura.
 */
export function Hero() {
  const { openBooking } = useBooking();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOn, setParallaxOn] = useState(false);
  // Touch e telas estreitas: o mesmo Cinematic Reveal, com o conteúdo aparecendo antes.
  const [compact] = useState(() => window.matchMedia('(max-width: 899px)').matches);
  const delayScale = compact ? 0.5 : 1;
  const durationScale = compact ? 0.75 : 1;
  // Como o reveal é mais curto aqui, o texto espera a fonte (no máximo 1,5 s): a troca da fonte
  // de reserva pela definitiva não desloca o texto diante do usuário.
  const [textReady, setTextReady] = useState(!compact);

  useEffect(() => {
    if (textReady) return;
    const timer = window.setTimeout(() => setTextReady(true), 1500);
    document.fonts?.ready.then(() => setTextReady(true));
    return () => window.clearTimeout(timer);
  }, [textReady]);

  // Parallax Depth: só em telas largas com ponteiro fino.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const update = () => setParallaxOn(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  // Camadas em velocidades diferentes: a foto desce devagar, o texto sobe um pouco.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0px', '-56px']);
  const depth = parallaxOn && !reduced;

  // Cinematic Reveal: a foto abre da direita para a esquerda; o texto entra em sequência.
  const line = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: textReady ? 1 : 0 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: textReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
          transition: { duration: 0.7 * durationScale, delay: delay * delayScale, ease: EASE },
        };

  return (
    <section id="inicio" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__frame">
        <motion.div className="hero__copy" style={depth ? { y: copyY } : undefined}>
          <motion.p className="hero__eyebrow" {...line(0.45)}>
            Paraná Implantes · Curitiba
          </motion.p>
          <motion.h1 id="hero-title" className="hero__title" {...line(0.55)}>
            Cuidar do seu sorriso também é cuidar de você.
          </motion.h1>
          <motion.p className="hero__sub" {...line(0.7)}>
            Tecnologia, acolhimento e atenção personalizada em cada etapa do seu cuidado.
          </motion.p>
          <motion.div className="hero__actions" {...line(0.82)}>
            <MagneticButton type="button" className="btn btn--light btn--lg" onClick={() => openBooking()}>
              Agendar avaliação
              <ArrowRight className="btn__arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
            </MagneticButton>
            <a href="#experiencia" className="btn btn--outline-light btn--lg">
              Conheça a clínica
            </a>
          </motion.div>
        </motion.div>

        <motion.figure
          className="hero__media"
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 0% 100%)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: reduced ? 0.2 : 1.15 * durationScale, ease: EASE }}
        >
          <motion.img
            className="hero__img"
            src={asset('assets/clinica/recepcao_principal_hero.webp')}
            alt="Recepção da Paraná Implantes, com painel de madeira ripada, luminárias pendentes e o letreiro da clínica iluminado"
            width={1024}
            height={1019}
            fetchPriority="high"
            decoding="async"
            style={depth ? { y: imageY } : undefined}
            initial={reduced ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduced ? 0 : 1.6 * durationScale, ease: EASE }}
          />
          <figcaption className="hero__caption">Recepção da clínica, Av. Brasília, 5030</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
