'use client';

import dynamic from 'next/dynamic';
import type { BeamsProps } from './Beams';

const Beams = dynamic(() => import('./Beams'), { ssr: false });

export default function BeamsClient(props: BeamsProps) {
  return <Beams {...props} />;
}
