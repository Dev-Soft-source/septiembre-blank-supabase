
import React, { ReactNode, useState, useEffect } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Create a global event name for section toggling
const SECTION_TOGGLE_EVENT = 'section-toggle-event';

interface SectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function Section({ 
  icon: Icon, 
  title, 
  children, 
  className = "",
  defaultOpen = false 
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Listen for events from other sections
  useEffect(() => {
    const handleSectionToggle = (event: CustomEvent) => {
      // Close this section if another one is opening
      if (event.detail.title !== title && isOpen) {
        setIsOpen(false);
      }
    };

    // TypeScript requires this casting for custom events
    window.addEventListener(SECTION_TOGGLE_EVENT, handleSectionToggle as EventListener);
    
    return () => {
      window.removeEventListener(SECTION_TOGGLE_EVENT, handleSectionToggle as EventListener);
    };
  }, [title, isOpen]);

  // Function to toggle the current section
  const toggleSection = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // If opening this section, dispatch an event to close others
    if (newState) {
      window.dispatchEvent(
        new CustomEvent(SECTION_TOGGLE_EVENT, { detail: { title } })
      );
    }
  };
  
  return (
    <section className={`mb-8 bg-[#8017B0]/90 p-5 rounded-xl border border-[#3300B0]/30 shadow-lg ${className}`}>
      <Collapsible open={isOpen} onOpenChange={toggleSection}>
        <CollapsibleTrigger className="flex items-start w-full text-left">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Icon className="h-5 w-5 text-[#FFF9B0] mr-2" />
              <h2 className="text-lg md:text-xl font-bold text-[#FFF9B0]">{title}</h2>
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-[#FFF9B0] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-5"> {/* Increased top margin for more separation */}
          {children}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
