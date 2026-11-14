import { requireAdmin } from '@/app/lib/auth';
import { STATUS_LABELS, mailchimpConfigured } from '@/app/lib/mailchimp';
import { listSubscribers } from '../../data';
import SubscribersList from '../../components/SubscribersList';
import MailchimpSync from '../../components/MailchimpSync';
import AutoRefresh from '../../components/AutoRefresh';
import styles from '../../admin.module.scss';

export default async function SubscribersPage() {
  await requireAdmin();
  const rows = await listSubscribers();
  const connected = mailchimpConfigured();
  const active = rows.filter((r) => (r.details?.mailchimp?.status || 'subscribed') === 'subscribed').length;
  const others = rows.length - active;

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Zingers</h1>
          <p>
            {active === 1 ? '1 subscriber' : `${active} subscribers`}
            {others > 0 && ` · ${others} no longer receiving the newsletter`}
            {connected ? ', kept in step with Mailchimp.' : ' from the “Become a Zinger” sign-up.'}
          </p>
        </div>
        <div className={styles.chips}>
          {connected && <MailchimpSync />}
          {rows.length > 0 && (
            // A file download, not a page: a plain link is right here.
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/api/admin/subscribers" className="btn btn-primary btn-sm">Download CSV</a>
          )}
        </div>
      </div>
      {/* Picks up Mailchimp changes and new sign-ups without reloading. */}
      <AutoRefresh seconds={30} />
      <SubscribersList
        rows={rows.map((r) => {
          const status = r.details?.mailchimp?.status || 'subscribed';
          return { ...r, createdAt: r.createdAt.toISOString(), status, statusLabel: STATUS_LABELS[status] || status };
        })}
        connected={connected}
      />
    </>
  );
}
