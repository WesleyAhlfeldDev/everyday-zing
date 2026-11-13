import { requireAdmin } from '@/app/lib/auth';
import { listSubscribers } from '@/app/admin/data';

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// CSV of every newsletter sign-up, for importing into an email tool.
export async function GET() {
  await requireAdmin();
  const rows = await listSubscribers();
  const lines = [
    ['First name', 'Last name', 'Email', 'Signed up from', 'Joined'].map(cell).join(','),
    ...rows.map((r) => [r.firstName, r.lastName, r.email, r.details?.page || '', r.createdAt.toISOString()].map(cell).join(',')),
  ];
  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="everyday-zing-subscribers.csv"',
    },
  });
}
