'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * Client navigation link. Navigation is driven by `router.push` so it can never
 * be swallowed. (An earlier version wrapped `router.push` inside
 * `document.startViewTransition()` for a cross-fade, but that stalls App Router
 * navigation — the transition freezes the DOM the router needs to update — so
 * every TransitionLink silently stopped navigating.) Modifier / middle clicks
 * fall through to the browser so "open in new tab" still works.
 */
export function TransitionLink({ href, children, className, onClick, ...rest }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();

    // Navigate unconditionally. (Wrapping router.push inside
    // startViewTransition stalls App Router navigation, so we don't.)
    router.push(href.toString());
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
