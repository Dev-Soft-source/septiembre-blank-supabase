
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EditableThemeCell } from "./EditableThemeCell";
import { Theme, EditingTheme } from "./types";

interface ThemeTableProps {
  themes: Theme[];
  editingTheme: EditingTheme | null;
  handleEdit: (id: string, field: string, value: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  openDeleteDialog: (id: string, name: string) => void;
  setEditingTheme: React.Dispatch<React.SetStateAction<EditingTheme | null>>;
}

export const ThemeTable: React.FC<ThemeTableProps> = ({
  themes,
  editingTheme,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  openDeleteDialog,
  setEditingTheme
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {themes.map(theme => (
          <TableRow key={theme.id}>
            <TableCell>
              <EditableThemeCell
                id={theme.id}
                field="name"
                value={theme.name}
                isEditing={!!(editingTheme && editingTheme.id === theme.id && editingTheme.field === 'name')}
                onEdit={() => handleEdit(theme.id, 'name', theme.name)}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onChange={(newValue) => setEditingTheme({...editingTheme!, value: newValue})}
              />
            </TableCell>
            <TableCell>
              <EditableThemeCell
                id={theme.id}
                field="category"
                value={theme.category || ""}
                isEditing={!!(editingTheme && editingTheme.id === theme.id && editingTheme.field === 'category')}
                onEdit={() => handleEdit(theme.id, 'category', theme.category || '')}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onChange={(newValue) => setEditingTheme({...editingTheme!, value: newValue})}
              />
            </TableCell>
            <TableCell>
              <EditableThemeCell
                id={theme.id}
                field="description"
                value={theme.description || ""}
                isEditing={!!(editingTheme && editingTheme.id === theme.id && editingTheme.field === 'description')}
                onEdit={() => handleEdit(theme.id, 'description', theme.description || '')}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onChange={(newValue) => setEditingTheme({...editingTheme!, value: newValue})}
                isTextArea
              />
            </TableCell>
            <TableCell>{new Date(theme.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button 
                onClick={() => openDeleteDialog(theme.id, theme.name)} 
                variant="destructive" 
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {themes.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">No affinities found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
