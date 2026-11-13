# Logo files

Vector logo files with the lettering converted to outlines (no fonts needed).

| File | What it is |
| --- | --- |
| `ez-a-logo.svg`, `ez-a-icon.svg` | Option A, Fresh brush. In use on the site as `public/brand/everyday-zing-logo.svg`, `public/brand/zing-mark.svg` and `app/icon.svg`. |
| `ez-c-logo.svg`, `ez-c-logo-dark.svg`, `ez-c-icon.svg` | Option C, Spark dot. The alternative shown to the client; swap these into the same three places to switch. |

`build-logos.cjs` regenerates them. It needs `opentype.js` and the Yellowtail and Schibsted Grotesk 800 TrueType files in a `fonts/` folder beside it.
