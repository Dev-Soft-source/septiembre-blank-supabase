
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Theme } from "@/utils/themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ThemeSubmenuOptionProps {
  option: any;
  activeTheme: Theme | null;
  updateFilter: (key: string, value: any) => void;
  useLargerMobileText?: boolean;
}

export const ThemeSubmenuOption: React.FC<ThemeSubmenuOptionProps> = ({
  option,
  activeTheme,
  updateFilter,
  useLargerMobileText = false
}) => {
  const [showSuboptions, setShowSuboptions] = useState(false);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  
  const toggleSuboptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSuboptions(!showSuboptions);
  };
  
  const handleOptionClick = () => {
    if (option.isAddOption) {
      setIsAddingOption(true);
    } else if (option.suboptions) {
      toggleSuboptions({} as React.MouseEvent);
    } else {
      updateFilter("theme", option);
    }
  };

  const handleAddOption = () => {
    if (newOptionName.trim()) {
      // Handle add option logic
      console.log("Adding custom option:", newOptionName);
      
      // Create a new theme object with the custom name
      const customOption = {
        id: `custom-${newOptionName.toLowerCase().replace(/\s+/g, '-')}`,
        name: newOptionName,
        category: 'Custom'
      };
      
      // Update filter with the new custom theme
      updateFilter("theme", customOption);
      
      // Reset state
      setNewOptionName("");
      setIsAddingOption(false);
    }
  };
  
  return (
    <div className="space-y-0.5">
      {isAddingOption ? (
        <div className="p-2 bg-fuchsia-900/40 rounded-sm space-y-2">
          <Input 
            type="text"
            placeholder="Enter custom theme"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            className="bg-fuchsia-950/40 border-fuchsia-800/30 text-xs text-white placeholder:text-white/60"
          />
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={handleAddOption}
              className="bg-fuchsia-800 hover:bg-fuchsia-700 text-white text-xs py-0.5 px-2"
            >
              Add
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsAddingOption(false)}
              className="bg-transparent text-xs py-0.5 px-2 text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleOptionClick}
          className={`w-full text-left px-2 py-1 rounded-sm ${useLargerMobileText ? 'text-sm' : 'text-xs'} transition-colors ${
            activeTheme?.id === option.id
              ? "bg-fuchsia-700/60 text-white font-medium"
              : "hover:bg-fuchsia-900/40 text-white"
          } flex items-center justify-between`}
        >
          <span>{option.name}</span>
          {option.suboptions && (
            <span
              onClick={toggleSuboptions}
              className="ml-1 p-0.5 rounded-full bg-fuchsia-900/40 text-fuchsia-300 hover:bg-fuchsia-800/50"
            >
              <Plus className="h-2.5 w-2.5" />
            </span>
          )}
        </button>
      )}
      
      {showSuboptions && option.suboptions && (
        <div className="pl-2 space-y-0.5">
          {option.suboptions.map((suboption: string) => (
            <button
              key={suboption}
              onClick={() =>
                updateFilter("theme", {
                  id: `${option.id}-${suboption.toLowerCase()}`,
                  name: suboption,
                  parentTheme: option
                })
              }
              className={`w-full text-left px-2 py-0.5 rounded-sm ${useLargerMobileText ? 'text-xs' : 'text-[10px]'} transition-colors hover:bg-fuchsia-900/40 text-white`}
            >
              {suboption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
