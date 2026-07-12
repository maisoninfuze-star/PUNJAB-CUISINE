/**
 * Transactional email via Resend's REST API (no SDK dependency). This is a
 * no-op unless BOTH RESEND_API_KEY and RESEND_FROM are set — so the ordering
 * flow works out of the box, and confirmation emails switch on the moment you
 * add a Resend key + verified from-address in the environment.
 *
 *   RESEND_API_KEY=re_...           # https://resend.com → API Keys
 *   RESEND_FROM="Punjabi Cuisine <orders@yourdomain.com>"  # verified domain
 */
import type { Order } from '@/lib/orders';
import { SITE } from '@/lib/site';

type Lang = 'en' | 'fr';

const money = (n: number) => `$${n.toFixed(2)}`;

function pickupTime(iso: string, lang: Lang) {
  try {
    return new Date(iso).toLocaleTimeString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function buildEmail(order: Order, lang: Lang): { subject: string; html: string; text: string } {
  const fr = lang === 'fr';
  const t = {
    subject: fr ? `Commande confirmée — ${order.id}` : `Order confirmed — ${order.id}`,
    heading: fr ? 'Commande reçue' : 'Order received',
    hi: fr ? `Bonjour ${order.customer.name},` : `Hi ${order.customer.name},`,
    thanks: fr
      ? 'Merci pour votre commande. Voici votre récapitulatif :'
      : 'Thanks for your order. Here’s your summary:',
    number: fr ? 'Numéro de commande' : 'Order number',
    pickup: fr ? 'Cueillette à' : 'Pickup at',
    subtotal: fr ? 'Sous-total' : 'Subtotal',
    taxes: fr ? 'TPS + TVQ' : 'GST + QST',
    total: fr ? 'Total' : 'Total',
    pay: fr
      ? 'Aucun paiement en ligne — payez au restaurant à la cueillette.'
      : 'No payment online — pay in-restaurant at pickup.',
    show: fr
      ? 'Présentez ce numéro de commande au comptoir.'
      : 'Show this order number at the counter.',
    footer: fr ? 'À bientôt !' : 'See you soon!',
  };

  const rows = order.items
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;color:#4b4b4b">${l.quantity}× ${escapeHtml(l.name)}</td><td style="padding:6px 0;text-align:right;color:#4b4b4b">${money(l.price * l.quantity)}</td></tr>`
    )
    .join('');

  const html = `<div style="background:#0a0a0a;padding:32px 0;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#fbf9f4;border-radius:16px;overflow:hidden">
    <div style="background:#0a0a0a;padding:24px 32px;text-align:center">
      <div style="color:#c9a84c;font-size:20px;letter-spacing:2px">${SITE.name.toUpperCase()}</div>
    </div>
    <div style="padding:28px 32px;color:#1a1a1a">
      <h1 style="margin:0 0 4px;font-size:24px;color:#0a0a0a">${t.heading}</h1>
      <p style="margin:0 0 18px;color:#4b4b4b">${t.hi}<br>${t.thanks}</p>

      <table style="width:100%;border-collapse:collapse;margin:0 0 8px">
        <tr>
          <td style="padding:12px 16px;background:#f1ece0;border-radius:10px 0 0 10px">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8a8069">${t.number}</div>
            <div style="font-size:22px;color:#0a0a0a;font-weight:bold">${order.id}</div>
          </td>
          <td style="padding:12px 16px;background:#f1ece0;border-radius:0 10px 10px 0;text-align:right">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8a8069">${t.pickup}</div>
            <div style="font-size:22px;color:#0a0a0a;font-weight:bold">${pickupTime(order.pickupTime, lang)}</div>
          </td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin:18px 0 0;border-top:1px solid #e7e0d0">
        ${rows}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:10px;border-top:1px solid #e7e0d0">
        <tr><td style="padding:6px 0;color:#6b6b6b">${t.subtotal}</td><td style="padding:6px 0;text-align:right;color:#6b6b6b">${money(order.subtotal)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b6b6b">${t.taxes}</td><td style="padding:6px 0;text-align:right;color:#6b6b6b">${money(order.taxes)}</td></tr>
        <tr><td style="padding:6px 0;color:#0a0a0a;font-weight:bold">${t.total}</td><td style="padding:6px 0;text-align:right;color:#c9a84c;font-weight:bold;font-size:18px">${money(order.total)}</td></tr>
      </table>

      <p style="margin:20px 0 4px;color:#4b4b4b">${t.show}</p>
      <p style="margin:0 0 18px;color:#8a8069;font-size:13px">${t.pay}</p>

      <div style="border-top:1px solid #e7e0d0;padding-top:16px;color:#6b6b6b;font-size:13px">
        ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region}<br>
        <a href="tel:${SITE.phoneHref}" style="color:#c9a84c;text-decoration:none">${SITE.phoneDisplay}</a>
      </div>
      <p style="margin:18px 0 0;color:#8a8069">${t.footer}</p>
    </div>
  </div>
</div>`;

  const text = `${t.heading}\n${t.number}: ${order.id}\n${t.pickup}: ${pickupTime(order.pickupTime, lang)}\n${order.items.map((l) => `${l.quantity}x ${l.name} — ${money(l.price * l.quantity)}`).join('\n')}\n${t.total}: ${money(order.total)}\n${t.pay}\n${SITE.phoneDisplay}`;

  return { subject: t.subject, html, text };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

export async function sendOrderConfirmation(
  order: Order,
  lang: Lang = 'en'
): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = order.customer.email;
  if (!key || !from) return { sent: false, reason: 'not_configured' };
  if (!to) return { sent: false, reason: 'no_recipient' };

  const { subject, html, text } = buildEmail(order, lang);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) return { sent: false, reason: `resend_${res.status}` };
  return { sent: true };
}
