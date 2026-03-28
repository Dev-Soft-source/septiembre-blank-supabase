import React from 'react';
import { DialogTitle as RadixDialogTitle } from '@radix-ui/react-dialog';

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof RadixDialogTitle> {
  children: React.ReactNode;
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialogTitle>,
  DialogTitleProps
>(({ children, className, ...props }, ref) => (
  <RadixDialogTitle
    ref={ref}
    className={className}
    {...props}
  >
    {children}
  </RadixDialogTitle>
));

DialogTitle.displayName = 'DialogTitle';