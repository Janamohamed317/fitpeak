import React, { useState, useEffect } from 'react';
import styles from './FitnessTips.module.css';

const tips = [
  {
    icon: '🏃‍♂️',
    title: 'Move More!',
    description: 'Walk daily to maintain heart health and improve fitness.'
  },
  {
    icon: '💧',
    title: 'Stay Hydrated!',
    description: 'Drink water throughout the day to keep your body hydrated and improve performance.'
  },
  {
    icon: '💤',
    title: 'Get Enough Sleep!',
    description: 'Adequate sleep boosts energy, aids muscle recovery, and improves overall health.'
  },
  {
    icon: '🥗',
    title: 'Eat Healthy!',
    description: 'Include vegetables, fruits, and proteins in your diet to maintain good health.'
  },
  {
    icon: '🏋️‍♀️',
    title: 'Exercise Regularly!',
    description: 'Make time for daily workouts to stay fit and strengthen your muscles.'
  }
];

const FitnessTips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [touchingLeft, setTouchingLeft] = useState(false);
  const [touchingRight, setTouchingRight] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  // دعم السحب للموبايل
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) prevTip();
    else if (deltaX < -50) nextTip();
    setTouchStartX(null);
  };

  // دعم الأسهم من الكيبورد
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevTip();
      if (e.key === 'ArrowRight') nextTip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo} title="Sport Logo">🏅</div>
      <h2 className={styles.title}>💡 Fitness Tips</h2>
      <div
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className={`${styles.arrowButton} ${touchingLeft ? styles.touching : ''}`}
          onClick={prevTip}
          aria-label="Previous tip"
          onTouchStart={() => setTouchingLeft(true)}
          onTouchEnd={() => { setTouchingLeft(false); prevTip(); }}
          onTouchCancel={() => setTouchingLeft(false)}
        >
          &#8249;
        </button>
        <div className={styles.tipCard}>
          <h4 className={styles.tipTitle}>{tips[currentTip].icon} {tips[currentTip].title}</h4>
          <p className={styles.tipDesc}>{tips[currentTip].description}</p>
        </div>
        <button
          className={`${styles.arrowButton} ${touchingRight ? styles.touching : ''}`}
          onClick={nextTip}
          aria-label="Next tip"
          onTouchStart={() => setTouchingRight(true)}
          onTouchEnd={() => { setTouchingRight(false); nextTip(); }}
          onTouchCancel={() => setTouchingRight(false)}
        >
          &#8250;
        </button>
      </div>
      {/* مؤشر النقاط أسفل الكارد */}
      <div className={styles.dots}>
        {tips.map((_, idx) => (
          <span
            key={idx}
            className={idx === currentTip ? styles.activeDot : styles.dot}
            onClick={() => setCurrentTip(idx)}
            aria-label={`Go to tip ${idx + 1}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setCurrentTip(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FitnessTips;

