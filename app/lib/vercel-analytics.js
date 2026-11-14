import 'server-only';

// Visitor numbers for the dashboard, read from Vercel Web Analytics.
// https://vercel.com/docs/analytics/web-analytics-api
//
// Needs VERCEL_ANALYTICS_TOKEN (a Vercel access token with access to the team)
// and VERCEL_ANALYTICS_TEAM_ID (the team's id, team_…). The project defaults
// to "everyday-zing"; the API takes a project name or id.
// Only production visits are counted. On the Hobby plan Vercel keeps one
// month of data, so ranges stop at 30 days.

const API = 'https://api.vercel.com/v1/query/web-analytics/visits/aggregate';
const DAY = 24 * 60 * 60 * 1000;

export const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
];

export function analyticsConfigured() {
  return Boolean(process.env.VERCEL_ANALYTICS_TOKEN);
}

async function aggregate(by, { since, until, limit }) {
  const url = new URL(API);
  url.searchParams.set('projectId', process.env.VERCEL_ANALYTICS_PROJECT_ID || 'everyday-zing');
  const team = process.env.VERCEL_ANALYTICS_TEAM_ID;
  if (team) url.searchParams.set(team.startsWith('team_') ? 'teamId' : 'slug', team);
  url.searchParams.set('by', by);
  url.searchParams.set('since', since);
  url.searchParams.set('until', until);
  if (limit) url.searchParams.set('limit', String(limit));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_ANALYTICS_TOKEN}` },
    // Vercel's numbers lag a little anyway; 15 minutes keeps the API calls low.
    next: { revalidate: 900 },
  });
  if (!res.ok) {
    const err = new Error(`Vercel analytics responded ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const { data = [] } = await res.json();
  return data;
}

// Everything the Analytics page shows, for the last `days` days (today included).
export async function getAnalytics(days = 7) {
  if (!analyticsConfigured()) return { configured: false };

  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * DAY);
  const range = { since: start.toISOString(), until: now.toISOString() };

  try {
    const [totals, daily, pages, referrers, devices, countries] = await Promise.all([
      // One row: grouping by environment (production only) gives the range's totals,
      // with each visitor counted once.
      aggregate('environment', range),
      aggregate('day', range),
      aggregate('requestPath', { ...range, limit: 8 }),
      aggregate('referrerHostname', { ...range, limit: 6 }),
      aggregate('deviceType', { ...range, limit: 4 }),
      aggregate('country', { ...range, limit: 6 }),
    ]);

    return {
      configured: true,
      days,
      totals: {
        pageviews: totals.reduce((n, r) => n + (r.pageviews || 0), 0),
        visitors: totals.reduce((n, r) => n + (r.visitors || 0), 0),
      },
      daily: fillDays(daily, start, days),
      pages: rows(pages, 'requestPath'),
      referrers: rows(referrers, 'referrerHostname'),
      devices: rows(devices, 'deviceType'),
      countries: rows(countries, 'country'),
    };
  } catch (err) {
    console.error('Vercel analytics unavailable:', err.message);
    return { configured: true, days, error: describe(err.status) };
  }
}

function rows(data, key) {
  return data.map((r) => ({ key: r[key] || '', pageviews: r.pageviews || 0, visitors: r.visitors || 0 }));
}

// One entry per day, with zeros for days nobody visited.
function fillDays(data, start, days) {
  const byDay = new Map(data.map((r) => [r.timestamp?.slice(0, 10), r]));
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start.getTime() + i * DAY).toISOString().slice(0, 10);
    const r = byDay.get(date);
    return { date, pageviews: r?.pageviews || 0, visitors: r?.visitors || 0 };
  });
}

function describe(status) {
  if (status === 401 || status === 403) return 'Vercel turned down the access token. Check that VERCEL_ANALYTICS_TOKEN is current and can see the team.';
  if (status === 404) return 'Vercel couldn\'t find analytics for this project. Check that Web Analytics is enabled and the project and team ids are right.';
  return 'Vercel\'s analytics didn\'t respond. Try again in a few minutes.';
}
