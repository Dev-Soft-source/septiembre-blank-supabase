
import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { collapsibleMenuItemStyles } from "./styles";

export interface CollapsibleMenuItemProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  defaultOpen?: boolean;
  preventScroll?: boolean;
}

export function CollapsibleMenuItem({ 
  title, 
  children, 
  className = "mb-1",
  titleClassName = "",
  defaultOpen = false,
  preventScroll = true
}: CollapsibleMenuItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const styles = collapsibleMenuItemStyles();

  return (
    <Collapsible 
      className={`w-full ${className} overflow-visible bg-[#5D0478]/10 hover:bg-[#5D0478]/20 rounded-md transition-all duration-200 p-2`}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CollapsibleTrigger className={`${styles.trigger} group`}>
        <span className={`group-hover:text-[#FEF7CD] transition-colors duration-200 ${titleClassName}`}>{title}</span>
        <ChevronDown className={`${styles.icon} ${isOpen ? 'rotate-180' : 'rotate-0'} text-fuchsia-400 group-hover:text-[#FEF7CD]`} />
      </CollapsibleTrigger>
      <CollapsibleContent className={styles.content}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
