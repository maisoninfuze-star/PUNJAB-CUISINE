import { listCustomers } from '@/lib/server/customer-store';
import { isOwner } from '@/lib/server/owner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Owner: download the marketing list as CSV. Pass ?optedIn=1 to export only
 * customers who consented to marketing (the retargeting-safe subset).
 */
export async function GET(req: Request) {
  if (!isOwner(req)) return new Response('unauthorized', { status: 401 });

  const optedInOnly = new URL(req.url).searchParams.get('optedIn') === '1';
  const rows = (await listCustomers()).filter((c) => (optedInOnly ? c.marketingOptIn : true));

  const header = ['email', 'name', 'phone', 'account', 'marketing_opt_in', 'orders', 'created', 'last_order'];
  const lines = [header.join(',')];
  for (const c of rows) {
    lines.push(
      [
        c.email,
        c.name,
        c.phone,
        c.registered ? 'yes' : 'guest',
        c.marketingOptIn ? 'yes' : 'no',
        c.orderCount,
        new Date(c.createdAt).toISOString(),
        c.lastOrderAt ? new Date(c.lastOrderAt).toISOString() : '',
      ]
        .map(csvCell)
        .join(',')
    );
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="punjabi-customers${optedInOnly ? '-opted-in' : ''}.csv"`,
    },
  });
}
