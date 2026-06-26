'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * Link that runs route changes inside the View Transitions API so pages
 * cross-fade like Zimmerl's `view-transition-name: root`. Falls back to a
 * normal client navigation where the API is unsupported.
 */
export function TransitionLink({ href, children, className, onClick, ...rest }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (
      typeof doc.startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return; // default Link behaviour
    }
    e.preventDefault();
    doc.startViewTransition(() => router.push(href.toString()));
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
