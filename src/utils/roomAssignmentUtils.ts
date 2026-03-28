
// This file exports all room assignment utilities from their proper locations
// to avoid duplication while maintaining backward compatibility

// Re-export from roomAssignmentLogic
export { 
  findBestAvailableRoom,
  findAvailableRoom,
  assignRoom
} from './roomAssignmentLogic';

// Re-export from bookingManagement
export { 
  getMonthBookings,
  generateSampleBookings
} from './bookingManagement';
