import Image from 'next/image';
import Link from 'next/link';
import SignupForm from '../SignupForm/SignupForm';
import styles from './PostSidebar.module.scss';

// Beside every post: who writes this, the chapters, and the sign-up.
export default function PostSidebar({ about, categories, current }) {
  const a = about?.fields || {};
  const portrait = a.image;

  return (
    <aside className={styles.sidebar} aria-label="About Every Day Zing">
      <section className={styles.about} aria-labelledby="side-about">
        {portrait?.url && (
          <span className={styles.portrait}>
            <Image src={portrait.url} alt={portrait.alt || ''} fill sizes="120px" />
          </span>
        )}
        <h2 id="side-about" className={styles.head}>{a.hero?.title || 'Hi, I’m Carol Joy'}</h2>
        {a.hero?.subtext && <p>{a.hero.subtext}</p>}
        <p><Link href="/about" className="text-link">More about me</Link></p>
      </section>

      <nav className={styles.block} aria-labelledby="side-chapters">
        <h2 id="side-chapters" className={styles.head}>Chapters</h2>
        <ul className={styles.chapters}>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                aria-current={c.slug === current ? 'true' : undefined}
                style={{ '--chip': c.chapter.bg, '--chip-ink': c.chapter.ink }}
              >
                <span>{c.title}</span>
                <span>{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={`${styles.block} ${styles.join}`} aria-labelledby="side-join">
        <h2 id="side-join" className={styles.head}>Become a Zinger</h2>
        <p>New posts, specials and partner deals by email.</p>
        <SignupForm layout="stack" idPrefix="side" />
      </section>
    </aside>
  );
}
