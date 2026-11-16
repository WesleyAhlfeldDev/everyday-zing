import Link from 'next/link';
import { getCategories, searchPosts, searchWords } from '@/app/lib/content';
import { CHAPTERS } from '@/app/lib/chapters';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';
import PostGrid from '@/app/components/PostGrid/PostGrid';
import styles from './Search.module.scss';

// Results change with every query, so keep them out of search engines.
export const metadata = {
  title: 'Search',
  description: 'Search every post on Every Day Zing.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
};

export default async function SearchPage({ searchParams }) {
  const { q = '' } = await searchParams;
  const query = String(Array.isArray(q) ? q[0] : q).trim().slice(0, 100);
  const words = searchWords(query);
  const [results, categories] = await Promise.all([searchPosts(query), getCategories()]);
  const chapters = words.length
    ? categories.filter((c) => words.some((w) => c.title.toLowerCase().includes(w)))
    : [];

  return (
    <>
      <ChapterHeader
        chapter={CHAPTERS.lemon}
        title="Search"
        text="Look for a recipe, a product, a store or anything else from the blog."
      >
        <form action="/search" method="get" role="search" className={styles.form} data-rise>
          <label htmlFor="search-q" className="visually-hidden">Search the blog</label>
          <input
            id="search-q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Try “chicken” or “Nordstrom”"
            autoComplete="off"
            enterKeyHint="search"
            className={styles.input}
          />
          <button type="submit" className="btn-zing">Search</button>
        </form>
      </ChapterHeader>

      <section className={styles.results} aria-labelledby="results-title" aria-live="polite">
        <div className="frame">
          {!query ? (
            <>
              <h2 id="results-title" className={styles.heading}>Or browse a chapter</h2>
              <ChapterLinks chapters={categories} />
            </>
          ) : !words.length ? (
            <h2 id="results-title" className={styles.heading}>Type at least two letters to search.</h2>
          ) : (
            <>
              <h2 id="results-title" className={styles.heading}>
                {results.length === 0 && <>Nothing matched “{query}”</>}
                {results.length === 1 && <>1 post for “{query}”</>}
                {results.length > 1 && <>{results.length === 60 ? 'The top 60' : results.length} posts for “{query}”</>}
              </h2>

              {chapters.length > 0 && (
                <div className={styles.chapterHits}>
                  <p>Matching chapters</p>
                  <ChapterLinks chapters={chapters} />
                </div>
              )}

              {results.length > 0
                ? <PostGrid posts={results} categories={categories} />
                : (
                  <div className={styles.empty}>
                    <p>Try a shorter or different word, or browse a chapter instead.</p>
                    <ChapterLinks chapters={categories} />
                  </div>
                )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function ChapterLinks({ chapters }) {
  return (
    <ul className={styles.chips}>
      {chapters.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/category/${c.slug}`}
            className={styles.chip}
            style={{ '--chip': c.chapter.bg, '--chip-ink': c.chapter.ink }}
          >
            {c.title}
            <span className={styles.chipCount}>{c.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
