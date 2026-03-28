
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinUsFaqItemProps {
  question: string;
  answer: string;
}

export function JoinUsFaqItem({ question, answer }: JoinUsFaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  return (
    <div className="border-t border-[#3300B0]/30 bg-[#560365]/90 backdrop-blur-md">
      <button
        onClick={toggleOpen}
        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-[#6a037c]/30 transition-colors duration-200"
      >
        <h4 className="text-lg font-semibold text-[#FFF9B0]">{question}</h4>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-[#FFF9B0] flex-shrink-0 transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-[#560365]/70">
          <p className="text-[#FFF9B0] whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
