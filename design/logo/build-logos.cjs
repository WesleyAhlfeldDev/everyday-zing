// Builds the Every Day Zing logo SVGs (options A and C) with the lettering
// converted to outlines, so they never depend on a font being installed.
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const here = __dirname;
const out = path.join(here, 'out');
fs.mkdirSync(out, { recursive: true });

const script = opentype.loadSync(path.join(here, 'fonts/Yellowtail.ttf'));
const grotesk = opentype.loadSync(path.join(here, 'fonts/Schibsted-800.ttf'));

const C = { ink: '#1c1f1a', white: '#ffffff', pink: '#ec789f', lemon: '#ffd84a', lime: '#b8d84a' };
const BRUSH = 'M4 22 C30 12 70 15 110 11 C160 6 220 12 270 8 C300 6 322 9 336 12 L333 26 C338 30 330 36 318 38 C270 44 210 38 150 43 C100 47 50 42 10 46 C2 40 8 33 3 30 Z';

// Eight-point spark, radius r, centred on (cx, cy).
function burst(cx, cy, r, fill) {
  const pts = [];
  for (let k = 0; k < 16; k++) {
    const a = (Math.PI / 8) * k - Math.PI / 2;
    const rad = k % 2 === 0 ? r : r * 0.48;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">\n<title>${label}</title>\n${body}\n</svg>\n`;

// Centres a path's bounding box on (cx, cy) and returns its data.
function centred(font, text, size, cx, cy) {
  const p = font.getPath(text, 0, 0, size);
  const b = p.getBoundingBox();
  const dx = cx - (b.x1 + b.x2) / 2;
  const dy = cy - (b.y1 + b.y2) / 2;
  return font.getPath(text, dx, dy, size).toPathData(2);
}

// ── Option A: Fresh brush ──────────────────────────────────────────────
{
  const size = 42;
  const text = 'Every Day Zing';
  const width = script.getAdvanceWidth(text, size);
  const x = 170 - width / 2;
  const word = script.getPath(text, x, 45, size);
  const b = word.getBoundingBox();
  const spark = burst(Math.min(b.x2 + 6, 328), 15, 7, C.pink);
  const body = [
    `<path d="${BRUSH}" fill="${C.lime}" transform="translate(0 6)"/>`,
    `<path d="${word.toPathData(2)}" fill="${C.ink}"/>`,
    spark,
  ].join('\n');
  fs.writeFileSync(path.join(out, 'ez-a-logo.svg'), svg(340, 60, body, 'Every Day Zing'));

  const icon = [
    `<rect width="100" height="100" rx="22" fill="${C.lime}"/>`,
    `<path d="${centred(script, 'Z', 66, 47, 54)}" fill="${C.ink}"/>`,
    burst(77, 24, 10, C.pink),
  ].join('\n');
  fs.writeFileSync(path.join(out, 'ez-a-icon.svg'), svg(100, 100, icon, 'Every Day Zing'));
  console.log('A: text width', width.toFixed(1), 'bbox', b.x1.toFixed(1), '→', b.x2.toFixed(1));
}

// ── Option C: Spark dot ────────────────────────────────────────────────
{
  const size = 56;
  const tracking = -3;
  const wordGap = 6;
  const text = 'everyday zıng'; // dotless i: the spark is its dot
  const scale = size / grotesk.unitsPerEm;
  const baseline = 58;
  let pen = 6;
  let iCentre = 0;
  const parts = [];
  for (const ch of text) {
    const g = grotesk.charToGlyph(ch);
    if (ch === 'ı') {
      const gb = g.getPath(pen, baseline, size).getBoundingBox();
      iCentre = (gb.x1 + gb.x2) / 2;
    }
    parts.push(g.getPath(pen, baseline, size).toPathData(2));
    pen += g.advanceWidth * scale + tracking + (ch === ' ' ? wordGap : 0);
  }
  const xHeight = (grotesk.tables.os2.sxHeight || 0.53 * grotesk.unitsPerEm) * scale;
  const dotY = baseline - xHeight - 13;
  const w = Math.ceil(pen + 6);
  const h = 72;
  const make = (ink, sparkFill) => [
    `<path d="${parts.join(' ')}" fill="${ink}"/>`,
    burst(iCentre, dotY, 11, sparkFill),
  ].join('\n');
  fs.writeFileSync(path.join(out, 'ez-c-logo.svg'), svg(w, h, make(C.ink, C.pink), 'everyday zing'));
  fs.writeFileSync(path.join(out, 'ez-c-logo-dark.svg'), svg(w, h, make(C.white, C.lemon), 'everyday zing'));

  const icon = [
    `<rect width="100" height="100" rx="22" fill="${C.ink}"/>`,
    `<path d="${centred(grotesk, 'z', 78, 46, 58)}" fill="${C.white}"/>`,
    burst(76, 25, 13, C.pink),
  ].join('\n');
  fs.writeFileSync(path.join(out, 'ez-c-icon.svg'), svg(100, 100, icon, 'everyday zing'));
  console.log('C: width', w, 'i centre', iCentre.toFixed(1), 'dot y', dotY.toFixed(1), 'dotless i glyph', grotesk.charToGlyph('ı').index);
}
