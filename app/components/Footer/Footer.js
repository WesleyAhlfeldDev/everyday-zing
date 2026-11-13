import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.scss';

const LEGAL = [
  ['Privacy', '/privacy-policy'],
  ['Terms', '/terms-and-conditions'],
  ['Cookies', '/cookie-policy'],
  ['Disclosure', '/disclaimer-disclosure'],
];

// A calm close: the logo and tagline, three short lists, and the legal line.
export default function Footer({ menuItems = [], categories = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`frame ${styles.top}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Every Day Zing, home">
            <Image src="/brand/everyday-zing-logo.png" alt="" width={559} height={106} />
          </Link>
          <p className={styles.tagline}>Spreading a little zing into life, every day.</p>
        </div>

        <nav aria-labelledby="foot-blog">
          <h2 id="foot-blog" className={styles.label}>The blog</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            {menuItems.map((item) => <li key={item.id}><Link href={item.url}>{item.label}</Link></li>)}
            <li><Link href="#join">Become a Zinger</Link></li>
          </ul>
        </nav>

        <nav aria-labelledby="foot-chapters">
          <h2 id="foot-chapters" className={styles.label}>Chapters</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`}>
                  <span className={styles.swatch} style={{ background: c.chapter.bg }} aria-hidden="true" />
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.label}>Follow along</h2>
          <ul>
            <li><a href="https://www.instagram.com/everydayzing/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/everydayzing" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.amazon.com/shop/everydayzing" target="_blank" rel="noopener noreferrer">Amazon storefront</a></li>
          </ul>
        </div>
      </div>

      <div className={`frame ${styles.bottom}`}>
        <p>© {year} Every Day Zing. Some links are affiliate links; I may earn a small commission at no cost to you.</p>
        <ul className={styles.legal}>
          {LEGAL.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
        </ul>
      </div>
    </footer>
  );
}
