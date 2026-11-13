import Link from 'next/link';
import PostGrid from '../PostGrid/PostGrid';
import styles from './PostListing.module.scss';

export const PER_PAGE = 12;

// One page of post cards with a pager. `basePath` is /blog or /category/<slug>.
export default function PostListing({ posts, categories, page, basePath, heading }) {
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const slice = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const href = (n) => (n === 1 ? basePath : `${basePath}?page=${n}`);

  return (
    <section className={styles.section} aria-labelledby="listing-title">
      <div className="frame">
        <h2 id="listing-title" className={styles.heading}>
          {heading}{pages > 1 ? `, page ${page} of ${pages}` : ''}
        </h2>
        {slice.length
          ? <PostGrid posts={slice} categories={categories} />
          : <p className={styles.empty}>Nothing here yet. New posts are on the way.</p>}
        {pages > 1 && (
          <nav className={styles.pager} aria-label="Pages">
            {page > 1 ? <Link href={href(page - 1)} className="btn-zing">Newer posts</Link> : <span />}
            <ol>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <Link href={href(n)} aria-current={n === page ? 'page' : undefined} className={styles.num}>{n}</Link>
                </li>
              ))}
            </ol>
            {page < pages ? <Link href={href(page + 1)} className="btn-zing">Older posts</Link> : <span />}
          </nav>
        )}
      </div>
    </section>
  );
}
