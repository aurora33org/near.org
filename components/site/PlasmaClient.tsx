'use client';

import dynamic from 'next/dynamic';
import type { PlasmaProps } from '@/components/Plasma';
import { useRef, useState, useEffect } from 'react';

const Plasma = dynamic(() => import('@/components/Plasma'), { ssr: false });

export default function PlasmaClient(props: PlasmaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    ro.observe(wrapperRef.current);
    // Also read immediately after paint
    const { width, height } = wrapperRef.current.getBoundingClientRect();
    if (width > 0 && height > 0) setSize({ width, height });
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      {size && (
        <div style={{ width: size.width, height: size.height }}>
          <Plasma {...props} />
        </div>
      )}
    </div>
  );
}
