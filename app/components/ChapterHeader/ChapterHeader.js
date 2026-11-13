import Link from 'next/link';
import { chapterStyle } from '@/app/lib/chapters';
import styles from './ChapterHeader.module.scss';

// The coloured top of a page: a full-width field in the chapter's colour with
// the page title large. `chips` lists the chapters as filters;
// `children` sits under the side text (the search form uses it).
export default function ChapterHeader({ chapter, title, text, aside, chips, current, children }) {
  return (
    <header className={`${styles.header} field`} style={chapter ? chapterStyle(chapter) : undefined}>
      <div className={`frame ${styles.grid}`}>
        <h1 className={styles.title} data-rise>{title}</h1>
        <div className={styles.side}>
          {text && <p className={styles.text} data-rise>{text}</p>}
          {aside && <p className={styles.aside} data-rise>{aside}</p>}
          {children}
        </div>
      </div>
      {chips?.length > 0 && (
        <nav className={`frame ${styles.chips}`} aria-label="Chapters">
          <Link href="/blog" className={styles.chip} data-rise aria-current={!current ? 'page' : undefined}>All</Link>
          {chips.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={styles.chip}
              data-rise
              style={{ '--chip': c.chapter.bg, '--chip-ink': c.chapter.ink }}
              aria-current={current === c.slug ? 'page' : undefined}
            >
              {c.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
