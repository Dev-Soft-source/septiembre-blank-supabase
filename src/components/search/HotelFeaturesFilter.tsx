import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SquareFilter } from "./SquareFilter";
import { supabase } from "@/integrations/supabase/client";

interface HotelFeaturesFilterProps {
  activeHotelFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function HotelFeaturesFilter({ activeHotelFeatures, onChange }: HotelFeaturesFilterProps) {
  const { t, isReady } = useTranslation("filters");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch features from Supabase
  useEffect(() => {
    async function getFeatures() {
      const { data: featureData, error } = await supabase
        .from("features")
        .select("name_en")
        .order("name_en");

      if (error) {
        console.error("Error fetching features:", error);
        setOptions([]);
      } else {
        const formatted = featureData.map((item) => ({
          value: item.name_en,
          label: item.name_en, // could add translation later
        }));
        setOptions(formatted);
      }
      setLoading(false);
    }

    getFeatures();
  }, []);

  // Wait for translations to be ready
  if (!isReady) {
    return (
      <SquareFilter
        title="CARACTERÍSTICAS DEL HOTEL"
        options={[]}
        selectedOptions={activeHotelFeatures}
        onChange={onChange}
        loading={true}
      />
    );
  }

  return (
    <SquareFilter
      title={t("filters.hotelFeatures")}
      options={options}
      selectedOptions={activeHotelFeatures}
      onChange={onChange}
      loading={loading}
    />
  );
}
