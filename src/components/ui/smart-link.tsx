import React from 'react';
import { useSmartContentLoading } from '@/hooks/useSmartContentLoading';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
}

export function SmartLink({ href, children, prefetch = true, ...props }: SmartLinkProps) {
  const { handleLinkHover } = useSmartContentLoading();

  const handleMouseEnter = () => {
    if (prefetch) {
      handleLinkHover(href);
    }
  };

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </a>
  );
}