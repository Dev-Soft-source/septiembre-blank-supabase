import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

interface AddCustomOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (optionName: string) => void;
  category: 'hotel_features' | 'room_features' | 'activities' | 'affinities';
  title: string;
}

export const AddCustomOptionModal = ({
  isOpen,
  onClose,
  onAdd,
  category,
  title
}: AddCustomOptionModalProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const { toast } = useToast();
  const [optionName, setOptionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!optionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the new option",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the option to the form
      onAdd(optionName.trim());
      
      // TODO: In a real implementation, also save to database and notify admin
      // This would involve calling an API endpoint to:
      // 1. Save the custom option to the database
      // 2. Associate it with the current hotel
      // 3. Send notification to admin for review
      
      toast({
        title: "Custom Option Added",
        description: `"${optionName.trim()}" has been added and will be reviewed by administration.`,
        duration: 5000
      });
      
      // Reset and close
      setOptionName('');
      onClose();
      
    } catch (error) {
      console.error('Error adding custom option:', error);
      toast({
        title: "Error",
        description: "Failed to add custom option. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOptionName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[#640091] border-white/20" aria-describedby="custom-option-description">
        <DialogHeader>
          <DialogTitle className="text-white">
            Add Custom {title}
          </DialogTitle>
        </DialogHeader>
        <div id="custom-option-description" className="sr-only">
          Create a new custom {title.toLowerCase()} option for your property. This will be added to your property and reviewed by administration.
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="option-name" className="text-white text-sm font-medium">
              Option Name
            </Label>
            <Input
              id="option-name"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              placeholder={`Enter new ${title.toLowerCase()} name...`}
              className="mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit1}
              disabled={isSubmitting || !optionName.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Option'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};