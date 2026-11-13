import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/app/lib/content';
import styles from './PostGrid.module.scss';

// An even grid of post cards: photo, title, then category and date.
// `categories` (from getCategories) supplies each card's chapter colour.
export default function PostGrid({ posts, categories, columns = 3, headingLevel = 'h3' }) {
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const Title = headingLevel;

  return (
    <ul className={`${styles.grid} ${columns === 4 ? styles.four : ''}`}>
      {posts.map((post) => {
        const c = cat[post.fields.category];
        const img = post.fields.featured_image;
        return (
          <li key={post.slug} data-rise>
            <article className={styles.card}>
              <Link href={`/${post.slug}`} className={styles.photo} style={{ background: c?.chapter.bg }} tabIndex={-1} aria-hidden="true">
                {img?.url && (
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes={columns === 4 ? '(max-width: 768px) 50vw, 25vw' : '(max-width: 768px) 50vw, 33vw'}
                  />
                )}
              </Link>
              <Title className={styles.title}>
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </Title>
              <p className={styles.meta}>
                {c && (
                  <Link href={`/category/${c.slug}`} className={styles.cat}>
                    <span className={styles.dot} style={{ background: c.chapter.bg }} aria-hidden="true" />
                    {c.title}
                  </Link>
                )}
                <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
              </p>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
