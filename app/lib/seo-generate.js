import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { entryPath, schemaFor } from './content-schema.js';

// Drafts a meta title and description for an entry from what's on the page,
// using Claude. Called from the dashboard's "Generate SEO details" button.
//
// Needs ANTHROPIC_API_KEY. Results are suggestions: the editor fills the SEO
// fields with them and nothing is saved until the admin presses Save.

const MODEL = 'claude-opus-5-5';
const SITE_NAME = 'Every Day Zing';

const SYSTEM = `You write search-engine metadata for Every Day Zing (everyday-zing.com), a lifestyle blog by Carol Joy covering outfits, recipes, skincare, money and the little finds that make an ordinary week sparkle.

Given the content of one page, write:
- title: the meta title. 50-60 characters including the suffix " | ${SITE_NAME}". Lead with what a searcher would type; keep it specific to this page. Use the brand suffix exactly once.
- description: the meta description. 140-155 characters. One or two plain sentences that say what the reader gets from this page, in Carol's warm, friendly voice, ending with a reason to click. No quotation marks, no emoji, no hashtags, no clickbait.

Use only facts present in the page content. Write in the same language as the content.`;

const FORMAT = {
  type: 'json_schema',
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['title', 'description'],
    additionalProperties: false,
  },
};

const SKIP_NAMES = new Set(['url', 'handle', 'price', 'email', 'cta_label', 'color']);

function stripHtml(html) {
  return String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|h[1-6]|li|div|br)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ').replace(/&rsquo;|&lsquo;/g, '’').replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

// Walks the field definitions and returns the readable text on the page,
// one "Label: text" line per field.
function collectText(defs, value, out, prefix = '') {
  const obj = value && typeof value === 'object' ? value : {};
  for (const def of defs) {
    const v = def.flatten ? obj : obj[def.name];
    const label = prefix ? `${prefix} › ${def.label}` : def.label;
    if (def.type === 'group') {
      collectText(def.fields, v, out, label);
    } else if (def.type === 'repeater') {
      (Array.isArray(v) ? v : []).forEach((item) => collectText(def.fields, item, out, label));
    } else if (def.type === 'link') {
      if (v?.label) out.push(`${label}: ${v.label}`);
    } else if (['text', 'textarea', 'html'].includes(def.type) && !SKIP_NAMES.has(def.name)) {
      const text = def.type === 'html' ? stripHtml(v ?? '') : String(v ?? '').trim();
      if (text) out.push(`${label}: ${text}`);
    }
  }
  return out;
}

export async function generateSeoDetails({ type, slug, title, fields, categoryName }) {
  const lines = collectText(schemaFor(type, slug), fields, []);
  const kind = type === 'page' ? `the ${title} page` : type === 'post' ? 'a blog post' : 'a blog category page';
  const content = [
    `Page type: ${kind}`,
    `URL path: ${entryPath(type, slug) ?? '(none)'}`,
    `Title: ${title}`,
    categoryName ? `Category: ${categoryName}` : null,
    ...lines,
  ].filter(Boolean).join('\n');

  if (lines.length === 0 && !title) {
    return { error: 'Add some content to the page first, then try again.' };
  }

  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low', format: FORMAT },
    system: SYSTEM,
    messages: [{ role: 'user', content: `<page_content>\n${content}\n</page_content>` }],
  });

  if (response.stop_reason === 'refusal') {
    return { error: 'The AI couldn\'t write SEO details for this page. Try writing them by hand.' };
  }
  const text = response.content.find((b) => b.type === 'text')?.text;
  if (!text) return { error: 'The AI didn\'t return anything. Try again.' };

  const parsed = JSON.parse(text);
  return {
    title: String(parsed.title || '').trim(),
    description: String(parsed.description || '').trim(),
  };
}
