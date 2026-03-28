import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

interface FilterButtonProps {
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  onSearch: () => void;
  searchBgColor: string;
  searchHoverBgColor: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  hasActiveFilters,
  onClearAllFilters,
  onSearch,
  searchBgColor,
  searchHoverBgColor
}) => {
  const { t, isReady } = useTranslation('filters');

  // New method to handle theme category
  const handleAddThemeCategory = () => {
    // Open a dialog to add new theme category
    // This would typically be implemented with a modal
    console.log("Opening add theme category dialog");
    
    // Show a simple alert with black text for now - using safe DOM manipulation
    const themeDialog = document.createElement('div');
    themeDialog.className = "fixed inset-0 flex items-center justify-center z-50";
    
    const backdrop = document.createElement('div');
    backdrop.className = "fixed inset-0 bg-[#68178D] bg-opacity-50";
    const handleBackdropClick = () => {
      backdrop.removeEventListener('click', handleBackdropClick);
      themeDialog.remove();
    };
    backdrop.addEventListener('click', handleBackdropClick);
    
    const modal = document.createElement('div');
    modal.className = "bg-white p-6 rounded-lg shadow-xl z-10 max-w-md w-full";
    
    const title = document.createElement('h3');
    title.className = "text-xl font-semibold text-[#68178D] mb-4";
    title.textContent = "Add Theme Category";
    
    const inputContainer = document.createElement('div');
    inputContainer.className = "mb-4";
    
    const label = document.createElement('label');
    label.className = "block text-sm font-medium text-gray-700 mb-1";
    label.textContent = "Category Name";
    
    const input = document.createElement('input');
    input.type = "text";
    input.className = "w-full px-3 py-2 border border-gray-300 rounded-md";
    input.placeholder = "Enter category name";
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = "flex justify-end space-x-2";
    
    const cancelButton = document.createElement('button');
    cancelButton.className = "px-4 py-2 bg-gray-200 text-gray-800 rounded-md";
    cancelButton.textContent = "Cancel";
    const handleCancelClick = () => {
      cancelButton.removeEventListener('click', handleCancelClick);
      themeDialog.remove();
    };
    cancelButton.addEventListener('click', handleCancelClick);
    
    const addButton = document.createElement('button');
    addButton.className = "px-4 py-2 bg-[#AACAFE] text-[#3300B0] rounded-md";
    addButton.textContent = "Add Category";
    
    // Assemble the modal
    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(addButton);
    modal.appendChild(title);
    modal.appendChild(inputContainer);
    modal.appendChild(buttonContainer);
    themeDialog.appendChild(backdrop);
    themeDialog.appendChild(modal);
    
    document.body.appendChild(themeDialog);
  };

  return <div className="flex gap-2 w-full justify-between">
      {hasActiveFilters && 
        <button 
          onClick={onClearAllFilters} 
          className="px-4 py-2 rounded-lg bg-[#AACAFE]/80 text-[#3300B0] hover:bg-[#AACAFE]/60 text-sm transition-colors"
        >
          {isReady ? t('resetFilters') : 'Reset Filters'}
        </button>
      }
      
      <button 
        onClick={onSearch}
        className="px-4 py-2 rounded-lg bg-[#AACAFE] text-[#3300B0] hover:bg-[#AACAFE]/90 text-sm transition-colors ml-auto"
      >
        <Search className="w-4 h-4 inline mr-1" />
        Search
      </button>
    </div>;
};
