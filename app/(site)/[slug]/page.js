import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, getCategories, getCategory, getPage, getPost, getPosts } from '@/app/lib/content';
import { LEGAL_PAGES } from '@/app/lib/content-schema';
import { chapterStyle, CHAPTERS } from '@/app/lib/chapters';
import { buildMetadata } from '@/app/lib/seo';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';
import PostSidebar from '@/app/components/PostSidebar/PostSidebar';
import styles from './Article.module.scss';

export const revalidate = 3600;

// WordPress served posts and the legal pages at the root (/<slug>/), so this
// route keeps every old URL working: legal pages first, then posts.

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (LEGAL_PAGES.includes(slug)) {
    const page = await getPage(slug);
    if (!page) return { title: 'Not found' };
    return buildMetadata(page.seo, { title: page.fields.hero?.title || page.title, path: `/${slug}` });
  }
  const post = await getPost(slug);
  if (!post) return { title: 'Not found' };
  return buildMetadata({ og_type: 'article', og_image: post.fields.featured_image, ...post.seo }, {
    title: post.title,
    description: post.fields.excerpt || '',
    path: `/${slug}`,
  });
}

export default async function RootSlugPage({ params }) {
  const { slug } = await params;
  if (LEGAL_PAGES.includes(slug)) return <LegalPage slug={slug} />;
  return <PostPage slug={slug} />;
}

async function LegalPage({ slug }) {
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <>
      <ChapterHeader chapter={CHAPTERS.lemon} title={page.fields.hero?.title || page.title} text={page.fields.hero?.subtext} />
      <section className={styles.bodySection} aria-label="Content">
        <div className={`frame ${styles.bodyGrid}`}>
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: page.fields.body || '' }} />
        </div>
      </section>
    </>
  );
}

function readingTime(html = '') {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

async function PostPage({ slug }) {
  const post = await getPost(slug);
  if (!post) notFound();
  const f = post.fields;
  const [cat, posts, categories, about] = await Promise.all([
    f.category ? getCategory(f.category) : null, getPosts(), getCategories(), getPage('about'),
  ]);
  const chapter = cat?.chapter || CHAPTERS.lemon;
  const more = posts.filter((p) => p.slug !== slug && p.fields.category === f.category).slice(0, 3);
  const image = f.featured_image;

  return (
    <article>
      <header className={`${styles.header} field`} style={chapterStyle(chapter)}>
        <div className={`frame ${styles.headerGrid}`}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title} data-rise>{post.title}</h1>
            <p className={styles.meta} data-rise>
              {cat && <><Link href={`/category/${cat.slug}`} className="text-link">{cat.title}</Link> · </>}
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {readingTime(f.content)} min read
            </p>
          </div>
          {image?.url && (
            <figure className={styles.cover} data-rise>
              <Image src={image.url} alt={image.alt || ''} fill sizes="(max-width: 1024px) 100vw, 42vw" priority />
            </figure>
          )}
        </div>
      </header>

      <section className={styles.bodySection} aria-label="Post">
        <div className={`frame ${styles.postGrid}`}>
          <div className={styles.prose} data-rise dangerouslySetInnerHTML={{ __html: f.content || '' }} />
          <PostSidebar about={about} categories={categories} current={f.category} />
        </div>
      </section>

      {more.length > 0 && (
        <section className={`${styles.more} field`} style={chapterStyle(chapter)} aria-labelledby="more-title">
          <div className="frame">
            <h2 id="more-title" className={styles.moreHead}>More from {cat.title}</h2>
            <ul className={styles.moreGrid}>
              {more.map((p) => (
                <li key={p.slug} data-rise>
                  <Link href={`/${p.slug}`} className={styles.moreCard}>
                    <span className={styles.moreImg}>
                      {p.fields.featured_image?.url && (
                        <Image src={p.fields.featured_image.url} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" />
                      )}
                    </span>
                    <span className={styles.moreTitle}>{p.title}</span>
                    <span className={styles.moreDate}>{formatDate(p.date, 'short')}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className={styles.moreAll}>
              <Link href={`/category/${cat.slug}`} className="btn-zing">Everything in {cat.title}</Link>
            </p>
          </div>
        </section>
      )}
    </article>
  );
}
