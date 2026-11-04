import { ExternalLink, Star } from 'lucide-react';
import { MAPS_URL, RATING, REVIEWS } from '../data/site';
import { formatDateBR } from '../lib/booking';
import './Reviews.css';

export function Reviews() {
  return (
    <section id="avaliacoes" className="reviews section" aria-labelledby="reviews-title">
      <div className="container">
        <header className="reviews__head">
          <h2 id="reviews-title" className="section-title">
            O que nossos pacientes compartilham.
          </h2>
          <div className="reviews__summary">
            <p className="reviews__score">
              <span className="reviews__value">{RATING.value}</span>
              <span className="reviews__of">de 5 no Google</span>
            </p>
            <p className="reviews__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} strokeWidth={1.5} fill="currentColor" />
              ))}
            </p>
            <p className="reviews__note">
              {RATING.count} avaliações, conforme consulta de referência. Os números podem ter mudado desde então.
            </p>
            <a className="text-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              Ver a clínica no Google Maps
              <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />
              <span className="visually-hidden">(abre em nova aba)</span>
            </a>
          </div>
        </header>

        <ul className="reviews__list" role="list">
          {REVIEWS.map((review) => (
            <li key={review.author} className="review">
              <figure>
                <blockquote className="review__quote">
                  <p>{review.text}</p>
                </blockquote>
                <figcaption className="review__meta">
                  <span className="review__author">{review.author}</span>
                  <span className="review__source">
                    Avaliação no Google · <time dateTime={review.date}>{formatDateBR(review.date)}</time>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
