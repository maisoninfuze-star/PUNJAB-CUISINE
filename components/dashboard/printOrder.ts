'use client';

import type { Order } from '@/lib/orders';
import { SITE } from '@/lib/site';

/** Open a clean printable kitchen ticket for an order in a new window. */
export function printOrder(order: Order) {
  const pickup = new Date(order.pickupTime).toLocaleString('en-CA', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
  const money = (n: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);

  const rows = order.items
    .map(
      (l) => `<tr>
        <td class="q">${l.quantity}×</td>
        <td>${l.name}${l.notes ? `<div class="note">${l.notes}</div>` : ''}</td>
        <td class="r">${money(l.price * l.quantity)}</td>
      </tr>`
    )
    .join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${order.id}</title>
  <style>
    * { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
    body { width: 280px; margin: 0 auto; padding: 12px; color: #000; }
    h1 { text-align:center; font-size: 18px; margin: 0 0 2px; }
    .sub { text-align:center; font-size: 11px; margin: 0 0 10px; }
    .id { text-align:center; font-size: 22px; font-weight:700; margin: 8px 0; }
    .meta { font-size: 12px; margin: 4px 0; }
    hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    td { vertical-align: top; padding: 3px 0; }
    .q { width: 28px; font-weight: 700; }
    .r { text-align: right; white-space: nowrap; }
    .note { font-style: italic; font-size: 11px; }
    .tot { display:flex; justify-content:space-between; font-size: 13px; }
    .tot.big { font-weight:700; font-size: 15px; }
  </style></head><body>
    <h1>${SITE.name}</h1>
    <p class="sub">PICKUP TICKET</p>
    <div class="id">${order.id}</div>
    <p class="meta"><strong>Pickup:</strong> ${pickup}</p>
    <p class="meta"><strong>${order.customer.name}</strong> · ${order.customer.phone}</p>
    ${order.note ? `<p class="meta">Note: ${order.note}</p>` : ''}
    <hr/>
    <table>${rows}</table>
    <hr/>
    <div class="tot"><span>Subtotal</span><span>${money(order.subtotal)}</span></div>
    <div class="tot"><span>GST + QST</span><span>${money(order.taxes)}</span></div>
    <div class="tot big"><span>TOTAL</span><span>${money(order.total)}</span></div>
    <hr/>
    <p class="sub">Pay in-restaurant at pickup. Thank you!</p>
    <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=360,height=640');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
