import { getPage } from '@/app/lib/content';
import { buildMetadata } from '@/app/lib/seo';
import { CHAPTERS } from '@/app/lib/chapters';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';
import ContactForm from './ContactForm';
import styles from './Contact.module.scss';

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await getPage('contact');
  return buildMetadata(page?.seo, {
    title: 'Contact',
    description: 'Get in touch with Carol Joy at Every Day Zing.',
    path: '/contact',
  });
}

export default async function ContactPage() {
  const page = await getPage('contact');
  const f = page?.fields || {};
  const hero = f.hero || {};

  return (
    <>
      <ChapterHeader chapter={CHAPTERS.aqua} title={hero.title || 'Say hello'} text={hero.subtext} />
      <section className={styles.section} aria-labelledby="contact-form-title">
        <div className={`frame ${styles.grid}`}>
          <div className={styles.side}>
            <h2 id="contact-form-title" className={styles.head}>Send a message</h2>
            {f.note && <p className={styles.note}>{f.note}</p>}
            {f.email && (
              <p className={styles.note}>
                Or email <a href={`mailto:${f.email}`} className="text-link">{f.email}</a>
              </p>
            )}
            <p className={styles.note}>
              Quicker on Instagram? Send a DM to{' '}
              <a href="https://www.instagram.com/everydayzing/" target="_blank" rel="noopener noreferrer" className="text-link">@everydayzing</a>.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
