'use client';

import { useState, useEffect } from 'react';

const WORDS = ['doctor', 'lawyer', 'financial advisor', 'therapist', 'best friend'];

export default function WordCycle() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: 'inline-block',
        color: '#5895d8',
        fontStyle: 'italic',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      }}
    >
      {WORDS[idx]}
    </span>
  );
}
