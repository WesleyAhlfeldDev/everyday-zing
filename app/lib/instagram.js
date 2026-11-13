import 'server-only';

// The newest Instagram posts for the home page feed.
//
// Uses the Instagram API with Instagram Login (a Business or Creator account
// connected to a Meta app). Set INSTAGRAM_ACCESS_TOKEN to a long-lived token;
// those last 60 days and are renewed with
//   GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<token>
// Without a token this returns null and the home page fills the feed with
// blog photos instead (blogStandInPosts).

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const TYPES = { IMAGE: 'image', VIDEO: 'video', CAROUSEL_ALBUM: 'carousel' };

export async function getInstagramPosts({ limit = 5 } = {}) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  const url = new URL('https://graph.instagram.com/me/media');
  url.searchParams.set('fields', FIELDS);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('access_token', token);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Instagram responded ${res.status}`);
    const { data = [] } = await res.json();
    return data.map(toPost).filter((p) => p.image).slice(0, limit);
  } catch (err) {
    console.error('Instagram feed unavailable:', err.message);
    return null;
  }
}

function toPost(m) {
  return {
    id: m.id,
    url: m.permalink,
    image: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
    caption: m.caption || '',
    date: m.timestamp,
    type: TYPES[m.media_type] || 'image',
  };
}

// Recent blog posts as feed tiles, each linking to its post. The home page
// uses these until Instagram is connected.
export function blogStandInPosts(blogPosts, limit = 5) {
  return blogPosts
    .filter((p) => p.fields.featured_image?.url)
    .slice(0, limit)
    .map((p) => ({
      id: `post-${p.slug}`,
      url: `/${p.slug}`,
      image: p.fields.featured_image.url,
      caption: p.title,
      date: p.date,
      type: 'image',
    }));
}

// Sample posts for the mockup: the newest blog photos, shaped like Instagram
// posts, so the section can be shown before the account is connected.
export function sampleInstagramPosts(blogPosts, handle, limit = 5) {
  const types = ['carousel', 'image', 'video', 'image', 'carousel'];
  return blogPosts
    .filter((p) => p.fields.featured_image?.url)
    .slice(0, limit)
    .map((p, i) => ({
      id: `sample-${p.slug}`,
      url: `https://www.instagram.com/${handle}/`,
      image: p.fields.featured_image.url,
      caption: p.fields.excerpt || p.title,
      date: p.date,
      type: types[i % types.length],
    }));
}
