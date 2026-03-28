
import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { accordionMenuItemStyles } from "./styles";

export interface AccordionMenuItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  preventScroll?: boolean;
}

export function AccordionMenuItem({ 
  value, 
  title, 
  children, 
  className = "", 
  titleClassName,
  preventScroll = true 
}: AccordionMenuItemProps) {
  const styles = accordionMenuItemStyles();
  
  // Add click handler to prevent default behavior if preventScroll is true
  const handleClick = (e: React.MouseEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }
  };
  
  return (
    <AccordionItem value={value} className={`${styles.item} ${className}`}>
      <AccordionTrigger 
        className={`${styles.trigger} group`} 
        titleClassName={titleClassName}
        onClick={handleClick}
      >
        <span className={titleClassName}>
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className={`${styles.content} animate-accordion-down`}>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
