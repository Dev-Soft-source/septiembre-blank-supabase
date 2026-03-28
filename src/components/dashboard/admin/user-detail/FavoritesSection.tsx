
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FavoritesSectionProps {
  favorites: any[];
}

export const FavoritesSection = ({ favorites }: FavoritesSectionProps) => {
  if (favorites.length === 0) {
    return <p className="text-center py-4">No favorite hotels found for this user.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hotel</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Added On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {favorites.map((favorite) => (
          <TableRow key={favorite.id}>
            <TableCell>{favorite.hotel?.name || "Unknown Hotel"}</TableCell>
            <TableCell>
              {favorite.hotel?.city}, {favorite.hotel?.country}
            </TableCell>
            <TableCell>{new Date(favorite.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
