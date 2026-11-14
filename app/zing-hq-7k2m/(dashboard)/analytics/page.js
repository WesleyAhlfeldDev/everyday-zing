import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowPointer, faChartLine, faEarthAmericas, faEye, faFileLines, faMobileScreen, faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { requireAdmin } from '@/app/lib/auth';
import { getAnalytics, RANGES } from '@/app/lib/vercel-analytics';
import { getCategories, getPosts } from '@/app/lib/content';
import styles from '../../admin.module.scss';
import { ADMIN_PATH } from '@/app/lib/admin-path';

const SECTION_NAMES = { '/': 'Home', '/blog': 'Blog', '/about': 'About', '/contact': 'Contact', '/search': 'Search' };
const DEVICE_NAMES = { desktop: 'Computer', mobile: 'Phone', tablet: 'Tablet' };
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
const number = new Intl.NumberFormat('en-US');

export default async function AnalyticsPage({ searchParams }) {
  await requireAdmin();
  const { days: daysParam } = await searchParams;
  const days = RANGES.some((r) => String(r.days) === daysParam) ? Number(daysParam) : RANGES[0].days;

  const [stats, posts, categories] = await Promise.all([getAnalytics(days), getPosts(), getCategories()]);

  const titles = {
    ...SECTION_NAMES,
    ...Object.fromEntries(posts.map((p) => [`/${p.slug}`, p.title])),
    ...Object.fromEntries(categories.map((c) => [`/category/${c.slug}`, `${c.title} (category)`])),
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Analytics</h1>
          <p>Who visited everyday-zing.com, from Vercel Web Analytics. Updates every 15 minutes.</p>
        </div>
        {stats.configured && (
          <div className={styles.chips}>
            {RANGES.map((r) => (
              <Link
                key={r.days}
                href={`${ADMIN_PATH}/analytics?days=${r.days}`}
                className={`${styles.chip} ${r.days === days ? styles.chipActive : ''}`}
                aria-current={r.days === days ? 'page' : undefined}
              >
                Last {r.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!stats.configured && <SetupNotice />}
      {stats.error && <div className={`card card-body ${styles.muted}`} role="alert">{stats.error}</div>}
      {stats.totals && <Report stats={stats} titles={titles} />}
    </>
  );
}

function Report({ stats, titles }) {
  const { totals, daily, pages, referrers, devices, countries } = stats;
  const perVisitor = totals.visitors ? (totals.pageviews / totals.visitors).toFixed(1) : '0';
  const topPage = pages.find((p) => p.key !== 'Others');

  const cards = [
    { label: 'Visitors', value: number.format(totals.visitors), icon: faUsers },
    { label: 'Page views', value: number.format(totals.pageviews), icon: faEye },
    { label: 'Pages per visitor', value: perVisitor, icon: faFileLines },
    { label: 'Views of the top page', value: topPage ? number.format(topPage.pageviews) : '0', note: topPage ? titles[topPage.key] || topPage.key : 'No visits yet', icon: faChartLine },
  ];

  return (
    <>
      <div className={styles.statGrid}>
        {cards.map((c, i) => (
          <div key={c.label} className={`${styles.statCard} ${styles[`tint${i}`]} ${styles.rise}`} style={{ '--i': i }}>
            <span className={styles.thumbIcon}><FontAwesomeIcon icon={c.icon} /></span>
            <div className={styles.statNum}>{c.value}</div>
            <div className={styles.statLabel}>{c.label}</div>
            {c.note && <div className={`${styles.muted} ${styles.statNote}`}>{c.note}</div>}
          </div>
        ))}
      </div>

      <section className={`${styles.panel} ${styles.rise} mb-4`} style={{ '--i': 4 }}>
        <div className={styles.panelHead}>
          <h2>Visitors per day</h2>
          <span className={styles.muted}>Last {stats.days} days</span>
        </div>
        <DailyChart daily={daily} />
      </section>

      <div className={styles.analyticsGrid}>
        <Breakdown
          title="Most viewed pages"
          icon={faFileLines}
          rows={pages}
          label={(k) => (k === 'Others' ? 'Everything else' : titles[k] || k)}
          sub={(k) => (k === 'Others' || !titles[k] ? null : k)}
          href={(k) => (k === 'Others' ? null : k)}
          i={5}
        />
        <Breakdown
          title="Where visitors came from"
          icon={faArrowPointer}
          rows={referrers}
          label={(k) => (k === 'Others' ? 'Everything else' : k || 'Direct, email or apps')}
          i={6}
        />
        <Breakdown
          title="Devices"
          icon={faMobileScreen}
          rows={devices}
          label={(k) => DEVICE_NAMES[k] || k || 'Unknown'}
          i={7}
        />
        <Breakdown
          title="Countries"
          icon={faEarthAmericas}
          rows={countries}
          label={(k) => countryLabel(k)}
          i={8}
        />
      </div>
    </>
  );
}

function DailyChart({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.visitors));
  const total = daily.reduce((n, d) => n + d.visitors, 0);
  const every = daily.length > 10 ? 5 : 1; // label every 5th day on the 30-day view

  if (!total) {
    return <p className={styles.muted}>No visits yet in this range. Numbers appear once the live site gets traffic.</p>;
  }

  return (
    <figure className={styles.dayChart}>
      <div className={styles.dayBars} role="img" aria-label={`Visitors per day, ${daily.length} days, ${number.format(total)} visitors in total. Busiest day: ${busiest(daily)}.`}>
        {daily.map((d) => (
          <div key={d.date} className={styles.dayCol} title={`${shortDate(d.date)}: ${d.visitors} visitors, ${d.pageviews} page views`}>
            {daily.length <= 14 && <span className={styles.dayValue}>{d.visitors || ''}</span>}
            <span className={styles.dayBar} style={{ height: `${(d.visitors / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className={styles.dayLabels} aria-hidden="true">
        {daily.map((d, i) => (
          <span key={d.date}>{(daily.length - 1 - i) % every === 0 ? shortDate(d.date) : ''}</span>
        ))}
      </div>
    </figure>
  );
}

function Breakdown({ title, icon, rows, label, sub, href, i }) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <section className={`${styles.panel} ${styles.rise}`} style={{ '--i': i }}>
      <div className={styles.panelHead}>
        <h2>{title}</h2>
        <span className={styles.muted}>Visitors</span>
      </div>
      {rows.length ? (
        <ul className={styles.panelList}>
          {rows.map((r) => {
            const link = href?.(r.key);
            const detail = sub?.(r.key);
            const body = (
              <>
                <span className={`${styles.panelIcon} ${styles.tint0}`}><FontAwesomeIcon icon={icon} /></span>
                <span className={styles.breakdownText}>
                  <span className={styles.panelLabel}>{label(r.key)}</span>
                  {detail && <span className={styles.muted}>{detail}</span>}
                  <span className={styles.bar}><span style={{ width: `${(r.visitors / max) * 100}%` }} /></span>
                </span>
                <span className={styles.panelCount}>{number.format(r.visitors)}</span>
              </>
            );
            return (
              <li key={r.key || 'none'}>
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" className={styles.panelItem}>{body}</a>
                ) : (
                  <div className={styles.panelItem}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.muted}>Nothing yet.</p>
      )}
    </section>
  );
}

function SetupNotice() {
  return (
    <div className={`${styles.panel} ${styles.setupNotice}`}>
      <h2>Connect Vercel Web Analytics</h2>
      <p>Visitor numbers appear here once the site can read them from Vercel. In the Vercel project&apos;s environment variables, add:</p>
      <ul>
        <li><code>VERCEL_ANALYTICS_TOKEN</code>: an access token from Vercel (Account Settings → Tokens), scoped to the team that owns the project.</li>
        <li><code>VERCEL_ANALYTICS_TEAM_ID</code>: the team&apos;s id (starts with <code>team_</code>), from the team&apos;s Settings page.</li>
      </ul>
      <p className="mb-0">Then redeploy. Web Analytics also needs to be turned on in the project&apos;s Analytics tab.</p>
    </div>
  );
}

function countryLabel(code) {
  if (!code) return 'Unknown';
  if (code === 'Others') return 'Everywhere else';
  try {
    return countryNames.of(code) || code;
  } catch {
    return code;
  }
}

function shortDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function busiest(daily) {
  const top = daily.reduce((a, b) => (b.visitors > a.visitors ? b : a));
  return `${shortDate(top.date)} with ${number.format(top.visitors)}`;
}
