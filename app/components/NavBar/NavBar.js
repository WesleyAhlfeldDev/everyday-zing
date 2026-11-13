'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.scss';

// Wordmark in the middle, the menu split either side of it, and one action.
export default function NavBar({ menuItems = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  const half = Math.ceil(menuItems.length / 2);
  const isActive = (url) => (url === '/' ? pathname === '/' : pathname.startsWith(url));
  const link = (item) => (
    <Link
      key={item.id}
      href={item.url}
      className={styles.link}
      aria-current={isActive(item.url) ? 'page' : undefined}
    >
      {item.label}
    </Link>
  );

  return (
    <header className={styles.bar}>
      <a href="#main" className="visually-hidden-focusable">Skip to content</a>
      <div className={`frame ${styles.inner}`}>
        <nav className={styles.left} aria-label="Main">{menuItems.slice(0, half).map(link)}</nav>
        <Link href="/" className={styles.logo} aria-label="Every Day Zing, home">
          <Image src="/brand/everyday-zing-logo.png" alt="" width={559} height={106} priority />
        </Link>
        <div className={styles.right}>
          <nav aria-label="More">{menuItems.slice(half).map(link)}</nav>
          <Link href="#join" className={`btn-zing ${styles.join}`}>Become a Zinger</Link>
        </div>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="phone-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="phone-menu" className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`} hidden={!open}>
        <nav aria-label="Phone menu" className="frame">
          <Link href="/" className={styles.sheetLink} onClick={() => setOpen(false)}>Home</Link>
          {menuItems.map((item) => (
            <Link key={item.id} href={item.url} className={styles.sheetLink} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link href="#join" className="btn-zing" onClick={() => setOpen(false)}>Become a Zinger</Link>
        </nav>
      </div>
    </header>
  );
}
