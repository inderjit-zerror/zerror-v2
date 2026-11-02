'use client';

import Link from 'next/link';
import { useNavigate } from '@/components/layout/Transition';

const EXTERNAL = /^(https?:|mailto:|tel:)/;

// Internal links run through the pixel page transition; external links open normally.
export default function TLink({ href, label, children, onClick, ...rest }) {
  const navigate = useNavigate();

  if (EXTERNAL.test(href)) {
    const isWeb = href.startsWith('http');
    return (
      <a href={href} target={isWeb ? '_blank' : undefined} rel={isWeb ? 'noreferrer' : undefined} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      scroll={false}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, label);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
