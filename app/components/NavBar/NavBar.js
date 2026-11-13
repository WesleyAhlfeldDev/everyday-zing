'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.scss';

// Logo on the left; the menu, the sign-up button and search on the right.
export default function NavBar({ menuItems = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

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
        <Link href="/" className={styles.logo} aria-label="Every Day Zing, home">
          <Image src="/brand/everyday-zing-logo.svg" alt="" width={340} height={60} unoptimized priority />
        </Link>
        <div className={styles.right}>
          <nav aria-label="Main">{menuItems.map(link)}</nav>
          <Link href="#join" className={`btn-zing ${styles.join}`}>Become a Zinger</Link>
          <SearchLink active={pathname === '/search'} />
        </div>
        <div className={styles.phoneTools}>
          <SearchLink active={pathname === '/search'} onClick={() => setOpen(false)} />
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

function SearchLink({ active, onClick }) {
  return (
    <Link href="/search" className={styles.search} aria-current={active ? 'page' : undefined} onClick={onClick}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
      </svg>
      <span className="visually-hidden">Search</span>
    </Link>
  );
}
