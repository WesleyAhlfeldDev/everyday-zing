// Tidies rich-text HTML (imported from WordPress or edited in the dashboard)
// before it is rendered on a public page.

// Hosts next.config.mjs lets the image optimiser fetch from.
const OPTIMISABLE = /^https:\/\/([a-z0-9-]+\.public\.blob\.vercel-storage\.com|everyday-zing\.com)\//;
// Matches the widest text column (Article.module.scss).
const SIZES = '(max-width: 840px) 100vw, 840px';

const optimised = (src, w) => `/_next/image?url=${encodeURIComponent(src)}&amp;w=${w}&amp;q=75`;

// Uploads are full-size PNG/JPEG originals; serve them resized as WebP instead.
function img(tag) {
  const src = tag.match(/\ssrc="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
  if (!src || !OPTIMISABLE.test(src)) return tag;
  return tag
    .replace(/\s(srcset|sizes|fetchpriority|loading)="[^"]*"/gi, '')
    .replace(/\ssrc="[^"]+"/, ` src="${optimised(src, 1080)}" srcset="${optimised(src, 640)} 640w, ${optimised(src, 1080)} 1080w" sizes="${SIZES}" loading="lazy"`);
}

// A link whose only content is an image with no alt text has no name for
// screen readers; name it after where it goes.
function imageLink(match, attrs, inner) {
  if (/\saria-label=/.test(attrs)) return match;
  let host = '';
  try { host = new URL(attrs.match(/\shref="([^"]+)"/)?.[1] || '').hostname.replace(/^www\./, ''); } catch {}
  if (!host) return match;
  const label = /(^|\.)(amzn\.to|amazon\.com)$/.test(host) ? 'Shop on Amazon' : `Visit ${host}`;
  return `<a${attrs} aria-label="${label}">${inner}</a>`;
}

export function bodyHtml(html = '') {
  return html
    .replace(/<a\b([^>]*)>(\s*<img\b[^>]*\salt=""[^>]*>\s*)<\/a>/gi, imageLink)
    .replace(/<img\b[^>]*>/gi, img);
}
