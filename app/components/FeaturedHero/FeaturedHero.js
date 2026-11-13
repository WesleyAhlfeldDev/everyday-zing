import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/app/lib/content';
import { chapterStyle } from '@/app/lib/chapters';
import styles from './FeaturedHero.module.scss';

// The blog's name and what it is, then the newest post large: its photo
// beside a panel in its category's colour. The chapters follow as quick links.
export default function FeaturedHero({ title, subtext, ctaLabel, post, category, categories }) {
  const img = post?.fields.featured_image;

  return (
    <header className={styles.hero}>
      <div className={`frame ${styles.intro}`}>
        <h1 className={styles.title} data-rise>{title}</h1>
        {subtext && <p className={styles.sub} data-rise>{subtext}</p>}
      </div>

      {post && (
        <div className={`frame ${styles.feature}`}>
          <Link href={`/${post.slug}`} className={styles.photo} tabIndex={-1} aria-hidden="true" data-rise>
            {img?.url && <Image src={img.url} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" priority />}
          </Link>
          <div className={`${styles.panel} field`} style={category ? chapterStyle(category.chapter) : undefined} data-rise>
            <p className={styles.meta}>
              {category && <Link href={`/category/${category.slug}`} className="text-link">{category.title}</Link>}
              <span> · </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            <h2 className={styles.postTitle}>
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.fields.excerpt && <p className={styles.excerpt}>{post.fields.excerpt}</p>}
            <p className={styles.action}>
              <Link href={`/${post.slug}`} className="btn-zing">{ctaLabel}</Link>
            </p>
          </div>
        </div>
      )}

      <nav className={`frame ${styles.chips}`} aria-label="Chapters">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={styles.chip}
            style={{ '--chip': c.chapter.bg, '--chip-ink': c.chapter.ink }}
            data-rise
          >
            {c.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
