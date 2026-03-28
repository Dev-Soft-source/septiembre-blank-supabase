/**
 * Navigation tracker to manage autoplay behavior
 * Tracks if user has performed any internal navigation
 */

class NavigationTracker {
  private hasNavigatedInternally = false;
  private initialPath: string | null = null;

  constructor() {
    // Initialize with current path when tracker is created
    this.initialPath = window.location.pathname;
  }

  /**
   * Call this when user navigates to a new route
   */
  trackNavigation(newPath: string) {
    // If this is different from initial path, mark as internal navigation
    if (this.initialPath && newPath !== this.initialPath && !this.hasNavigatedInternally) {
      this.hasNavigatedInternally = true;
      console.log('First internal navigation detected:', newPath);
    }
  }

  /**
   * Check if user has performed any internal navigation
   */
  hasPerformedInternalNavigation(): boolean {
    return this.hasNavigatedInternally;
  }

  /**
   * Reset tracker (for testing purposes)
   */
  reset() {
    this.hasNavigatedInternally = false;
    this.initialPath = window.location.pathname;
  }

  /**
   * Get initial path
   */
  getInitialPath(): string | null {
    return this.initialPath;
  }
}

// Create global instance
export const navigationTracker = new NavigationTracker();