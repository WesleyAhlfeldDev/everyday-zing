import { requireAdmin } from '@/app/lib/auth';
import { listSubscribers } from '@/app/zing-hq-7k2m/data';
import { STATUS_LABELS } from '@/app/lib/mailchimp';

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// CSV of every newsletter sign-up, for importing into an email tool.
export async function GET() {
  await requireAdmin();
  const rows = await listSubscribers();
  const lines = [
    ['First name', 'Last name', 'Email', 'Status', 'Signed up from', 'Joined'].map(cell).join(','),
    ...rows.map((r) => [
      r.firstName, r.lastName, r.email, STATUS_LABELS[r.details?.mailchimp?.status || 'subscribed'] || r.details?.mailchimp?.status,
      r.details?.page || '', r.createdAt.toISOString(),
    ].map(cell).join(',')),
  ];
  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="everyday-zing-subscribers.csv"',
    },
  });
}
