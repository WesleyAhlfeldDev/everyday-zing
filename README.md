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
| Dashboard | `app/zing-hq-7k2m/` (the folder name is the URL): analytics, pages, posts, categories, inbox, Zingers (subscribers), menu, media |
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
| `VERCEL_ANALYTICS_TOKEN`, `VERCEL_ANALYTICS_TEAM_ID` | Optional: the dashboard's Analytics page reads Vercel Web Analytics with these (a Vercel access token for the team, and the team's `team_…` id). `VERCEL_ANALYTICS_PROJECT_ID` overrides the project, which defaults to `everyday-zing`. |
| `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_WEBHOOK_SECRET` | Optional: keeps Zingers and the Mailchimp audience in step (see Mailchimp below). Without them, sign-ups are only saved on the site. |
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

## Mailchimp

Zingers and the Mailchimp audience stay in step both ways (`app/lib/mailchimp.js`):

- **Site → Mailchimp:** a "Become a Zinger" sign-up is added to the audience straight after it's saved. Someone who unsubscribed before is sent Mailchimp's confirmation email instead, because Mailchimp won't re-add them directly. Removing a Zinger in the dashboard unsubscribes them in Mailchimp.
- **Mailchimp → site:** a webhook updates Zingers within seconds when someone subscribes, unsubscribes, bounces, edits their name or changes their email in Mailchimp. Unsubscribed and bounced people stay listed, marked, and drop out of the counts.
- **Sync with Mailchimp** on the Zingers page does a full catch-up both ways. Use it once after connecting, and after any time Mailchimp was unreachable.

To connect:

1. In Mailchimp, create an API key (Profile → Extras → API keys) and find the audience id (Audience → Settings → Audience name and defaults).
2. In Vercel, set `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID` and `MAILCHIMP_WEBHOOK_SECRET` (any long random string), then redeploy.
3. In Mailchimp, add a webhook (Audience → Settings → Webhooks) with the URL `https://everyday-zing.com/api/mailchimp/webhook?secret=<MAILCHIMP_WEBHOOK_SECRET>`. Tick subscribes, unsubscribes, profile updates, cleaned addresses and email changes, from all three sources.
4. Press **Sync with Mailchimp** on the Zingers page.

## Import

`npm run import:mailchimp -- "<subscribed export>.csv"` adds the people in a Mailchimp audience export as Zingers, keeping their original sign-up dates and skipping anyone already on the list. Use the subscribed file only; add `--dry-run` to preview. Point `DATABASE_URL` at the live database (for example `node --env-file=.env.production.local scripts/import-mailchimp.mjs …`) to import there.

`npm run import:wordpress` copies pages, categories and posts (with their category, featured image, excerpt and Yoast SEO). Elementor pages (home, about, blog, contact) start from `scripts/page-defaults.mjs`; fields already edited in the dashboard are kept on re-runs. With a Blob token it also copies every image into Blob.
