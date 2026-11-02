'use client';

import { useSyncExternalStore } from 'react';
import { studio } from '@/lib/content';

const format = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: studio.timezone }).format(new Date());

const subscribe = (notify) => {
  const id = setInterval(notify, 15000);
  return () => clearInterval(id);
};

// Studio time in Mumbai, with a blinking separator.
export default function LocalTime({ className = '' }) {
  const time = useSyncExternalStore(subscribe, format, () => '');
  const [h, m] = (time || '--:--').split(':');
  return (
    <span className={`local-time ${className}`}>
      MUM {h}
      <span className="local-time__sep">:</span>
      {m} IST
    </span>
  );
}
