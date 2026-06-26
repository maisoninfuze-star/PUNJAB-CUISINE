import { bus, listOrders, type OrderEvent } from '@/lib/server/order-store';
import { isOwner } from '@/lib/server/owner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Owner-only Server-Sent Events stream. Emits an initial snapshot, then a live
 * `created` / `updated` event whenever an order changes. A heartbeat keeps the
 * connection from idling out behind proxies.
 */
export async function GET(req: Request) {
  if (!isOwner(req)) {
    return new Response('unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  let heartbeat: ReturnType<typeof setInterval>;
  let onOrder: (e: OrderEvent) => void;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      send({ type: 'snapshot', orders: listOrders() });

      onOrder = (e) => send(e);
      bus.on('order', onOrder);

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': ping\n\n'));
      }, 25000);
    },
    cancel() {
      clearInterval(heartbeat);
      bus.off('order', onOrder);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
