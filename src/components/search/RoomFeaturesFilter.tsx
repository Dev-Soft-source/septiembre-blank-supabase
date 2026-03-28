
import React, {useEffect, useState} from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SquareFilter } from "./SquareFilter";
import { supabase } from "@/integrations/supabase/client";

interface RoomFeaturesFilterProps {
  activeRoomFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomFeaturesFilter({ activeRoomFeatures, onChange }: RoomFeaturesFilterProps) {
  const { t, isReady } = useTranslation('filters');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRooms() {
      const { data: roomsData, error } = await supabase
        .from("rooms")
        .select("name_en")
        .order("name_en");

      if (error) {
        console.error("Error fetching rooms:", error);
        setOptions([]);
      } else {
        const formatted = roomsData.map((item) => ({
          value: item.name_en,
          label: item.name_en, // could add translation later
        }));
        setOptions(formatted);
      }
      setLoading(false);
    }

    getRooms();
  }, []);

  // Wait for translations to be ready
  if (!isReady) {
    return (
      <SquareFilter
        title="CARACTERÍSTICAS DE LA HABITACIÓN"
        options={[]}
        selectedOptions={activeRoomFeatures}
        onChange={onChange}
        loading={true}
      />
    );
  }

  return (
    <SquareFilter
      title={t("filters.roomFeatures")}
      options={options}
      selectedOptions={activeRoomFeatures}
      onChange={onChange}
      loading={loading}
    />
  );
}
