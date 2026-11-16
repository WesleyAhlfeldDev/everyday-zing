import Image from 'next/image';
import Link from 'next/link';
import { getCategories, getPage } from '@/app/lib/content';
import { buildMetadata } from '@/app/lib/seo';
import { bodyHtml } from '@/app/lib/body-html';
import styles from './About.module.scss';

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await getPage('about');
  return buildMetadata(page?.seo, {
    title: 'About Carol Joy',
    description: page?.fields?.hero?.subtext || 'The woman behind Every Day Zing.',
    path: '/about',
  });
}

export default async function AboutPage() {
  const [page, categories] = await Promise.all([getPage('about'), getCategories()]);
  const f = page?.fields || {};
  const hero = f.hero || {};

  return (
    <>
      <header className={`${styles.header} field`}>
        <div className={`frame ${styles.headerGrid}`}>
          <div>
            <h1 className={styles.title} data-rise>{hero.title || 'Hi, I’m Carol Joy'}</h1>
            {hero.subtext && <p className={styles.sub} data-rise>{hero.subtext}</p>}
          </div>
          {f.image?.url && (
            <figure className={styles.portrait} data-rise>
              <Image src={f.image.url} alt={f.image.alt || ''} fill sizes="(max-width: 1024px) 80vw, 36vw" priority />
            </figure>
          )}
        </div>
      </header>

      <section className={styles.story} aria-label="My story">
        <div className={`frame ${styles.storyGrid}`}>
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: bodyHtml(f.body) }} />
          <aside className={styles.side} aria-labelledby="about-chapters">
            <h2 id="about-chapters" className={styles.sideHead}>What I write about</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} style={{ background: c.chapter.bg, color: c.chapter.ink }}>
                    <span className={styles.thumb}>
                      {c.cover?.url && <Image src={c.cover.url} alt="" fill sizes="64px" />}
                    </span>
                    <span>{c.title}</span>
                    <span>{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
