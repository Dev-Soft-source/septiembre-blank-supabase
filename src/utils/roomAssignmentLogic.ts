
import { Room, StayRequest } from "@/types/booking";
import { stayFitsInRoom, calculateRoomScore } from "./roomScoring";

/**
 * Finds the best room that can accommodate a new stay request
 * Uses a scoring system to prioritize efficient gap filling
 * Returns the room ID if found, or null if no suitable room exists
 */
export const findBestAvailableRoom = (
  stayRequest: StayRequest,
  existingRooms: Room[],
  roomTypeId: string
): string | null => {
  const eligibleRooms = existingRooms.filter(
    (room) => room.roomTypeId === roomTypeId && stayFitsInRoom(stayRequest, room)
  );

  if (eligibleRooms.length === 0) return null;

  // Calculate scores for each eligible room
  const roomScores = eligibleRooms.map((room) => ({
    roomId: room.id,
    score: calculateRoomScore(stayRequest, room),
  }));

  // Sort by score in descending order
  roomScores.sort((a, b) => b.score - a.score);

  // Return the room with the highest score
  return roomScores[0].roomId;
};

/**
 * Finds a room that can accommodate a new stay request
 * Returns the room ID if found, or null if no suitable room exists
 */
export const findAvailableRoom = (
  stayRequest: StayRequest,
  existingRooms: Room[],
  roomTypeId: string
): string | null => {
  // First try to find the best room based on efficient gap filling
  return findBestAvailableRoom(stayRequest, existingRooms, roomTypeId);
};

/**
 * Assigns a room for a new stay request
 * If no existing room is available, creates a new room
 */
export const assignRoom = (
  stayRequest: StayRequest,
  existingRooms: Room[],
  roomTypeId: string
): { roomId: string; isNewRoom: boolean } => {
  // Try to find an existing room
  const availableRoomId = findAvailableRoom(stayRequest, existingRooms, roomTypeId);

  if (availableRoomId) {
    // We found an existing room that can accommodate the stay
    return { roomId: availableRoomId, isNewRoom: false };
  } else {
    // No existing room can accommodate the stay, so assign a new room
    const newRoomId = `room-${existingRooms.length + 1}`;
    return { roomId: newRoomId, isNewRoom: true };
  }
};
