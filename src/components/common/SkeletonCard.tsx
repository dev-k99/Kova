import React from 'react';
import './SkeletonCard.css';

const SkeletonCard: React.FC = () => (
  <article className="skeleton-card" aria-hidden="true">
    <div className="skeleton-card__media" />
    <div className="skeleton-card__body">
      <div className="skeleton-pulse skeleton-card__category" />
      <div className="skeleton-pulse skeleton-card__title-line skeleton-card__title-line--full" />
      <div className="skeleton-pulse skeleton-card__title-line skeleton-card__title-line--short" />
      <div className="skeleton-card__footer">
        <div className="skeleton-pulse skeleton-card__price" />
        <div className="skeleton-pulse skeleton-card__btn" />
      </div>
    </div>
  </article>
);

export default SkeletonCard;
