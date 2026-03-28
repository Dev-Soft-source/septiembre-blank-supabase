import React from 'react';

export function SkipLinks() {
  const handleSkipToContent = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-[9999] bg-background border border-border rounded-md shadow-lg p-2 m-2 focus-within:block">
        <nav aria-label="Skip navigation links">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleSkipToContent('main-content')}
                className="text-sm text-foreground hover:text-primary focus:text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Skip to main content
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSkipToContent('main-navigation')}
                className="text-sm text-foreground hover:text-primary focus:text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Skip to navigation
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSkipToContent('search-form')}
                className="text-sm text-foreground hover:text-primary focus:text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                Skip to search
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}