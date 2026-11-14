# Every Day Zing

Next.js rebuild of the everyday-zing.com WordPress blog, with a built-in content dashboard at a private path (set in `app/lib/admin-path.js`, not linked anywhere public). Content lives in Postgres (Neon), media in Vercel Blob. Same setup as `ahlfeld-solutions-theme`.

## Design

"Colour chapters": every blog category is a chapter with its own flat colour (`app/lib/chapters.js`), chosen per category in the dashboard. One typeface (Schibsted Grotesk), one square button, pink for the main action. The home page opens on the newest post, large, beside a panel in its category colour.

| Route | What it is |
| --- | --- |
| `/` | Featured newest post, welcome, fresh posts grid, chapters, where I shop / who I follow, Instagram |
| `/blog`, `/category/<slug>` | Photo grid of post cards, 12 per page |
| `/<slug>` | A post with an about-me / chapters / sign-up sidebar, or a legal page (same URLs as WordPress) |
| `/about`, `/contact` | About Carol Joy; contact form → dashboard Inbox |
| `#join` on every page | "Become a Zinger" sign-up → dashboard Zingers (CSV export) |

## How it fits together

| Piece | Where |
| --- | --- |
| Public pages | `app/(site)/`, reading content through `app/lib/content.js` |
| Dashboard | `app/zing-hq-7k2m/` (the folder name is the URL): pages, posts, categories, inbox, Zingers (subscribers), menu, media |
| Editable fields | `app/lib/content-schema.js`, one definition drives the dashboard forms and the import |
| Database schema | `app/lib/db/schema.js`, migrations in `drizzle/` |
| Auth | `app/lib/auth.js` (password + signed cookie), `proxy.js` guards the dashboard |

Every editable thing is a row in `entries` (`type` = page / post / category). Fields are JSON shaped by `content-schema.js`, so adding a field is a schema edit, not a migration.

## Environment variables

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Set by the Neon integration on Vercel. Leave unset locally to use an embedded database in `.data/`. |
| `BLOB_READ_WRITE_TOKEN` | Set when a Blob store is connected. Without it, uploads are off and imported images keep their WordPress URLs. |
| `ADMIN_USERS` | Dashboard logins, one `email=hash` pair per person, separated by commas, e.g. `a@x.com=scrypt:...,b@y.com=scrypt:...`. Each person runs `npm run admin:hash-password` to make their hash. Remove a pair to take away access. The older single `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` pair still works. |
| `SESSION_SECRET` | Signs login cookies; `npm run admin:hash-password` prints a fresh one. Changing it signs everyone out. |
| `DISCORD_WEBHOOK_URL` | Optional: notifications for messages and sign-ups. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL base, defaults to `https://everyday-zing.com`. |
| `NEXT_PUBLIC_WORDPRESS_URL`, `NEXT_PUBLIC_WORDPRESS_API_URL` | Only for the import. |

## Local development

```bash
npm install
npm run import:wordpress   # fill the local database from everyday-zing.com
npm run dev                # http://localhost:3000, dashboard at /zing-hq-7k2m
```

The embedded database (PGlite) allows one process at a time: stop `npm run dev` before running the import or a build.

## Import

`npm run import:wordpress` copies pages, categories and posts (with their category, featured image, excerpt and Yoast SEO). Elementor pages (home, about, blog, contact) start from `scripts/page-defaults.mjs`; fields already edited in the dashboard are kept on re-runs. With a Blob token it also copies every image into Blob.
