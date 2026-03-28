import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    variant?: 'default' | 'help' | 'error' | 'success';
  }
>(({ className, sideOffset = 4, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: "bg-popover text-popover-foreground border",
    help: "bg-blue-600 text-white border-blue-700",
    error: "bg-red-600 text-white border-red-700", 
    success: "bg-green-600 text-white border-green-700"
  };

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  variant?: 'default' | 'help' | 'error' | 'success';
  side?: 'top' | 'right' | 'bottom' | 'left';
  disabled?: boolean;
  delayDuration?: number;
}

export function EnhancedTooltip({ 
  children, 
  content, 
  variant = 'default',
  side = 'top',
  disabled = false,
  delayDuration = 700
}: EnhancedTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent variant={variant} side={side}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };