'use client';

import { useEffect, useState } from 'react';

import styles from './page.module.css';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null; // return this null to avoid hydration errors
  }

  return <main className={styles.main}>NextJS extension starter</main>;
}
