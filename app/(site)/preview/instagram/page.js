import { getPage, getPosts } from '@/app/lib/content';
import { sampleInstagramPosts } from '@/app/lib/instagram';
import InstagramFeed from '@/app/components/InstagramFeed/InstagramFeed';
import styles from './Preview.module.scss';

export const revalidate = 3600;

// A private mockup of the Instagram feed for the client to review before the
// account is connected. Not linked anywhere and kept out of search engines.
export const metadata = {
  title: 'Instagram feed preview',
  robots: { index: false, follow: false },
};

export default async function InstagramPreviewPage() {
  const [home, posts] = await Promise.all([getPage('home'), getPosts()]);
  const ig = home?.fields?.instagram || {};
  const handle = ig.handle || 'everydayzing';

  return (
    <>
      <aside className={styles.note}>
        <div className="frame">
          <p>
            <strong>Mockup.</strong> This is how the home page’s Instagram section will look once the account is
            connected. Blog photos stand in for Instagram posts here; the real section shows the five newest posts
            and updates on its own every hour.
          </p>
        </div>
      </aside>
      <InstagramFeed posts={sampleInstagramPosts(posts, handle)} handle={handle} text={ig.text} />
    </>
  );
}
