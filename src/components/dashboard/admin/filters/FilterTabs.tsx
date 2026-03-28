
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onAddNew: () => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  onTabChange,
  onAddNew
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <TabsList>
        <TabsTrigger value="countries" onClick={() => onTabChange("countries")}>Countries</TabsTrigger>
        <TabsTrigger value="months" onClick={() => onTabChange("months")}>Months</TabsTrigger>
        <TabsTrigger value="price" onClick={() => onTabChange("price")}>Price Ranges</TabsTrigger>
        <TabsTrigger value="stars" onClick={() => onTabChange("stars")}>Star Ratings</TabsTrigger>
        <TabsTrigger value="property" onClick={() => onTabChange("property")}>Property Types</TabsTrigger>
      </TabsList>
      <Button onClick={onAddNew}>Add New</Button>
    </div>
  );
};
