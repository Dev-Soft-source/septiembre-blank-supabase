
import { cn } from "@/lib/utils";
import { RoomType } from "@/types/hotel";

interface RoomTypeSelectorProps {
  selectedRoomType: string;
  setSelectedRoomType: (roomTypeId: string) => void;
  roomTypes?: RoomType[];
}

export function RoomTypeSelector({ 
  selectedRoomType, 
  setSelectedRoomType,
  roomTypes = []
}: RoomTypeSelectorProps) {
  // If no room types provided, fallback to default ones
  const availableRoomTypes = roomTypes?.length > 0 
    ? roomTypes 
    : [
        { id: "single", name: "Single" },
        { id: "double", name: "Double" }
      ];
  
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Room Type</label>
      <div className="grid grid-cols-2 gap-2">
        {availableRoomTypes.map(roomType => (
          <button
            key={roomType.id}
            type="button"
            className={cn(
              "rounded-lg border py-2 text-center transition-all",
              selectedRoomType === roomType.id
                ? "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-200"
                : "border-border hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10"
            )}
            onClick={() => setSelectedRoomType(roomType.id)}
          >
            {roomType.name}
          </button>
        ))}
      </div>
    </div>
  );
}
