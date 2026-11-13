// Field definitions for every editable content type. The dashboard renders its
// forms from these, and the WordPress import uses them to find image fields.
//
// Field types:
//   text, textarea, html, number, toggle, select (options | optionsFrom), image, link,
//   group (fields), repeater (fields, itemLabel)
// `optionsFrom: '<type>'` fills a select with the entries of that type (e.g. categories);
// the dashboard resolves it when it opens the editor.
// Values are stored in entries.fields with the same nesting as the definitions.

import { CHAPTER_OPTIONS } from './chapters.js';

const t = (name, label, extra = {}) => ({ name, label, type: 'text', ...extra });
const ta = (name, label, extra = {}) => ({ name, label, type: 'textarea', ...extra });

const hero = {
  name: 'hero', label: 'Page header', type: 'group', fields: [
    t('title', 'Title', { help: 'Keep it short: two lines at most on a phone.' }),
    ta('subtext', 'Sentence under the title'),
  ],
};

const legal = [hero, { name: 'body', label: 'Content', type: 'html' }];

export const PAGE_SCHEMAS = {
  home: [
    {
      name: 'hero', label: 'Hero', type: 'group', fields: [
        t('title', 'Title', { help: 'Defaults to "Everyday Zing".' }),
        ta('subtext', 'Sentence under the title'),
        t('cta_label', 'Button label', { help: 'Opens the newest post. Defaults to "Read the newest post".' }),
      ],
    },
    {
      name: 'welcome', label: 'Welcome', type: 'group', fields: [
        t('title', 'Heading'),
        ta('text', 'Welcome statement', { help: 'About 25 words. Shown large.' }),
        { name: 'image', label: 'Photo', type: 'image' },
        { name: 'image_2', label: 'Second photo', type: 'image' },
        { name: 'cta', label: 'Link', type: 'link' },
      ],
    },
    {
      name: 'shops', label: 'Where I shop', type: 'repeater', itemLabel: 'name',
      fields: [t('name', 'Store'), t('note', 'What I buy there'), t('url', 'Link (affiliate links welcome)')],
    },
    {
      name: 'follows', label: 'Who I follow', type: 'repeater', itemLabel: 'name',
      fields: [t('name', 'Name'), t('handle', 'Instagram handle'), t('note', 'Why I follow'), t('url', 'Link')],
    },
    {
      name: 'instagram', label: 'Instagram section', type: 'group', fields: [
        t('handle', 'Handle', { help: 'Without the @. Defaults to everydayzing.' }),
        ta('text', 'Sentence'),
        {
          name: 'prints', label: 'Photos', type: 'repeater', itemLabel: 'caption',
          help: 'Two or three photos. Leave empty to use the newest post photos.',
          fields: [{ name: 'image', label: 'Photo', type: 'image' }, t('caption', 'Caption'), t('url', 'Link')],
        },
      ],
    },
    {
      name: 'join', label: 'Become a Zinger (newsletter)', type: 'group', fields: [
        ta('text', 'Sentence', { help: 'What subscribers get.' }),
      ],
    },
  ],
  about: [
    hero,
    { name: 'image', label: 'Portrait', type: 'image' },
    { name: 'body', label: 'Story', type: 'html' },
  ],
  blog: [hero],
  shop: [
    hero,
    {
      name: 'storefront', label: 'Featured storefront', type: 'group', fields: [
        t('title', 'Title', { help: 'e.g. My Amazon Store.' }),
        ta('text', 'Sentence'),
        t('url', 'Link'),
        t('cta_label', 'Button label', { help: 'Defaults to "Shop the storefront".' }),
        { name: 'image', label: 'Photo', type: 'image' },
      ],
    },
    {
      name: 'picks', label: 'Current favourites', type: 'repeater', itemLabel: 'name',
      help: 'Products you love right now. The section hides when this is empty.',
      fields: [
        t('name', 'Product'),
        t('store', 'Store'),
        ta('note', 'Why I love it'),
        t('price', 'Price', { help: 'Optional, e.g. $24.' }),
        { name: 'image', label: 'Photo', type: 'image' },
        t('url', 'Link (affiliate links welcome)'),
        { name: 'category', label: 'Chapter', type: 'select', optionsFrom: 'category', help: 'Optional: colours the card.' },
      ],
    },
    {
      name: 'stores', label: 'Where I shop', type: 'repeater', itemLabel: 'name',
      help: 'Leave empty to use the list on the home page.',
      fields: [t('name', 'Store'), t('note', 'What I buy there'), t('url', 'Link (affiliate links welcome)')],
    },
    { name: 'finds_category', label: 'Blog chapter shown at the bottom', type: 'select', optionsFrom: 'category', help: 'Defaults to Shopping Finds.' },
    ta('disclosure', 'Affiliate note', { help: 'Shown in the header. Keep it plain and short.' }),
  ],
  contact: [
    hero,
    t('email', 'Email address', { help: 'Shown as a link beside the form.' }),
    ta('note', 'Note beside the form', { help: 'e.g. what to write about, partnership enquiries.' }),
  ],
  'privacy-policy': legal,
  'terms-and-conditions': legal,
  'cookie-policy': legal,
  'disclaimer-disclosure': legal,
};

// Public URL of each page; also the fixed set of pages the dashboard lists.
export const PAGE_PATHS = {
  home: '/',
  blog: '/blog',
  shop: '/shop',
  about: '/about',
  contact: '/contact',
  'privacy-policy': '/privacy-policy',
  'terms-and-conditions': '/terms-and-conditions',
  'cookie-policy': '/cookie-policy',
  'disclaimer-disclosure': '/disclaimer-disclosure',
};

export const LEGAL_PAGES = ['privacy-policy', 'terms-and-conditions', 'cookie-policy', 'disclaimer-disclosure'];

export const TYPE_SCHEMAS = {
  post: [
    { name: 'category', label: 'Category', type: 'select', optionsFrom: 'category' },
    ta('excerpt', 'Excerpt', { help: 'Plain text shown on post lists.' }),
    { name: 'featured_image', label: 'Featured image', type: 'image' },
    { name: 'content', label: 'Content', type: 'html' },
  ],
  category: [
    { name: 'color', label: 'Chapter colour', type: 'select', options: CHAPTER_OPTIONS },
    ta('description', 'Description', { help: 'One or two sentences at the top of the category page.' }),
    { name: 'image', label: 'Cover photo', type: 'image', help: 'Leave empty to use the newest post photo.' },
  ],
};

// `path` is the dashboard URL segment for the type.
export const TYPE_LABELS = {
  page: { singular: 'Page', plural: 'Pages', path: 'pages' },
  post: { singular: 'Post', plural: 'Posts', path: 'posts' },
  category: { singular: 'Category', plural: 'Categories', path: 'categories' },
};

// Dashboard URL segment → entry type.
export const COLLECTIONS = Object.fromEntries(
  Object.entries(TYPE_LABELS).map(([type, l]) => [l.path, type]),
);

export function schemaFor(type, slug) {
  return type === 'page' ? PAGE_SCHEMAS[slug] || [] : TYPE_SCHEMAS[type] || [];
}

// Public URL for an entry, or null if it has no page of its own.
export function entryPath(type, slug) {
  if (type === 'page') return PAGE_PATHS[slug] ?? null;
  if (type === 'post') return `/${slug}`;
  if (type === 'category') return `/category/${slug}`;
  return null;
}
