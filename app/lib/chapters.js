// The chapter colours. Every category is a "chapter" of the blog with its own
// flat field colour; `ink` is the text colour that reads on it.
export const CHAPTERS = {
  pink: { label: 'Zing pink', bg: '#ec789f', ink: '#1c1f1a' },
  lemon: { label: 'Lemon', bg: '#ffd84a', ink: '#1c1f1a' },
  orange: { label: 'Tangerine', bg: '#f7913d', ink: '#1c1f1a' },
  aqua: { label: 'Aqua', bg: '#8fd3c8', ink: '#1c1f1a' },
  lime: { label: 'Lime', bg: '#b8d84a', ink: '#1c1f1a' },
  leaf: { label: 'Leaf green', bg: '#2e6e46', ink: '#ffffff' },
  night: { label: 'Night', bg: '#1c1f1a', ink: '#ffffff' },
};

export const CHAPTER_OPTIONS = [
  { value: '', label: '— Pick a colour —' },
  ...Object.entries(CHAPTERS).map(([value, c]) => ({ value, label: c.label })),
];

const ORDER = Object.keys(CHAPTERS);

// The colour for a category: its chosen colour, or one picked from its position.
export function chapterFor(category, index = 0) {
  const key = category?.fields?.color;
  return CHAPTERS[key] || CHAPTERS[ORDER[index % ORDER.length]];
}

// Inline CSS variables that paint a chapter field.
export function chapterStyle(chapter) {
  return { '--field': chapter.bg, '--field-ink': chapter.ink };
}
