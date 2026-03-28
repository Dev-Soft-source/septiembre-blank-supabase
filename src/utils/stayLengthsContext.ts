
// Simple utility to store and retrieve selected stay lengths
// This helps with communication between components without adding complex state management

export const saveSelectedStayLengths = (lengths: number[]): void => {
  try {
    localStorage.setItem('selectedStayLengths', JSON.stringify(lengths));
    // Dispatch an event that other components can listen for
    window.dispatchEvent(new CustomEvent('stayLengthsUpdated', { detail: lengths }));
  } catch (e) {
    console.error("Error saving stay lengths:", e);
  }
};

export const getSelectedStayLengths = (): number[] => {
  try {
    const stored = localStorage.getItem('selectedStayLengths');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error retrieving stay lengths:", e);
  }
  
  // Return default values if nothing is saved or there's an error
  return [8, 15, 22, 29];
};
