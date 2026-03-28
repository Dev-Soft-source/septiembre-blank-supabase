import React, { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
interface FilterItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  selectedValue?: string | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const FilterItem = React.memo(function FilterItem({
  title,
  children,
  defaultOpen = false,
  selectedValue,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange
}: FilterItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="p-2 bg-[#5d0083] rounded-sm py-0 px-0">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-normal bg-[#7607b2] px-2 py-1 rounded cursor-pointer hover:bg-[#8a08cc] transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label={`Toggle ${title} filter section`}>
          <span className="text-left text-white text-sm font-normal">
            {selectedValue ? `${title}: ${selectedValue}` : title}
          </span>
          <ChevronRight className={`h-4 w-4 text-white transition-transform ${isOpen ? "transform rotate-90" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1 pl-2 space-y-1 bg-[#0723a2]/[0.99]">
          {children}
        </CollapsibleContent>
      </div>
    </Collapsible>;
});