
import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";
import { FilterTabs } from "@/components/dashboard/admin/filters/FilterTabs";
import { FilterTabContent } from "@/components/dashboard/admin/filters/FilterTabContent";
import { AddFilterDialog } from "@/components/dashboard/admin/filters/AddFilterDialog";
import { DeleteConfirmDialog } from "@/components/dashboard/admin/filters/DeleteConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function FernandoFilters() {
  const [activeTab, setActiveTab] = useState("countries");
  const [editingItem, setEditingItem] = useState<{ id: string, value: string } | null>(null);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // JotForm sync functionality removed
  
  const { toast } = useToast();
  
  const { 
    filters, 
    loading, 
    addFilter, 
    updateFilter, 
    deleteFilter 
  } = useFilters();

  // JotForm sync logs functionality removed

  // JotForm sync functions removed

  // JotForm sync helper functions removed

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    const success = await updateFilter(activeTab, editingItem.id, editingItem.value);
    if (success) {
      setEditingItem(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleStartEdit = (id: string, value: string) => {
    setEditingItem({ id, value });
  };

  const handleAddNew = async () => {
    if (!newItemValue.trim()) return;
    
    const success = await addFilter(activeTab, newItemValue);
    if (success) {
      setNewItemValue("");
      setNewItemDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    const success = await deleteFilter(activeTab, itemToDelete);
    if (success) {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Filter Management</h2>
          <p className="text-muted-foreground mt-2">
            Manage search filters for the platform
          </p>
        </div>
      </div>

      {/* JotForm Sync Panel removed */}

      <Separator />

      <div className="rounded-xl p-6 bg-[#7a0486]">
        <Tabs defaultValue="countries" value={activeTab} onValueChange={setActiveTab}>
          <FilterTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            onAddNew={() => setNewItemDialogOpen(true)} 
          />
          
          <FilterTabContent
            category="countries"
            filters={filters}
            loading={loading}
            editingItem={editingItem}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onConfirmDelete={confirmDelete}
            setEditingItem={setEditingItem}
          />
          
          <FilterTabContent
            category="months"
            filters={filters}
            loading={loading}
            editingItem={editingItem}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onConfirmDelete={confirmDelete}
            setEditingItem={setEditingItem}
          />
          
          <FilterTabContent
            category="price"
            filters={filters}
            loading={loading}
            editingItem={editingItem}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onConfirmDelete={confirmDelete}
            setEditingItem={setEditingItem}
          />
          
          <FilterTabContent
            category="stars"
            filters={filters}
            loading={loading}
            editingItem={editingItem}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onConfirmDelete={confirmDelete}
            setEditingItem={setEditingItem}
          />
          
          <FilterTabContent
            category="property"
            filters={filters}
            loading={loading}
            editingItem={editingItem}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onConfirmDelete={confirmDelete}
            setEditingItem={setEditingItem}
          />
        </Tabs>
      </div>

      {/* Add New Item Dialog */}
      <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
        <AddFilterDialog
          newItemValue={newItemValue}
          activeTab={activeTab}
          setNewItemValue={setNewItemValue}
          handleAddNew={handleAddNew}
          closeDialog={() => setNewItemDialogOpen(false)}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DeleteConfirmDialog
          handleDelete={handleDelete}
          closeDialog={() => setDeleteConfirmOpen(false)}
        />
      </Dialog>
    </div>
  );
}
