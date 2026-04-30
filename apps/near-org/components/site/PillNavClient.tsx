'use client';

import dynamic from 'next/dynamic';
import type { PillNavProps } from './PillNav';


const PillNav = dynamic(() => import('./PillNav'), { ssr: false });

export default function PillNavClient(props: PillNavProps) {
  return <PillNav {...props} />;
}
