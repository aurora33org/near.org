'use client';

import dynamic from 'next/dynamic';
import type { ThreadsProps } from '@/components/Threads';

const Threads = dynamic(() => import('@/components/Threads'), { ssr: false });

export default function ThreadsClient(props: ThreadsProps) {
  return <Threads {...props} />;
}
