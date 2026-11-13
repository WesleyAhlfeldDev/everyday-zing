import Link from 'next/link';
import { CHAPTERS } from '@/app/lib/chapters';
import ChapterHeader from '@/app/components/ChapterHeader/ChapterHeader';

export default function NotFound() {
  return (
    <>
      <ChapterHeader
        chapter={CHAPTERS.orange}
        title="Lost the zing"
        text="That page has moved or never existed. The newest posts are a good place to start again."
      />
      <section className="frame" style={{ paddingBlock: 'clamp(56px, 8vw, 112px)' }} aria-label="Where to next">
        <Link href="/blog" className="btn-zing">See the newest posts</Link>
      </section>
    </>
  );
}
