
import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProfileSectionProps {
  profile: any;
  editing: boolean;
  editForm: any;
  setEditForm: (form: any) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  editing,
  editForm,
  setEditForm
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={editForm.first_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={editForm.last_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editForm.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={editForm.phone || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="is_hotel_owner" 
            name="is_hotel_owner" 
            checked={editForm.is_hotel_owner || false}
            onCheckedChange={(checked) => 
              setEditForm({...editForm, is_hotel_owner: checked === true})
            }
          />
          <Label htmlFor="is_hotel_owner">Hotel Owner</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="is_active" 
            name="is_active" 
            checked={editForm.is_active !== false}
            onCheckedChange={(checked) => 
              setEditForm({...editForm, is_active: checked === true})
            }
          />
          <Label htmlFor="is_active">Active Account</Label>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <div className="text-sm font-medium">Name</div>
        <div>{profile.first_name} {profile.last_name}</div>
      </div>
      <div>
        <div className="text-sm font-medium">Email</div>
        <div>{profile.email}</div>
      </div>
      <div>
        <div className="text-sm font-medium">Phone</div>
        <div>{profile.phone || 'Not provided'}</div>
      </div>
      <div>
        <div className="text-sm font-medium">Account Type</div>
        <div>{profile.is_hotel_owner ? 'Hotel Owner' : 'Regular User'}</div>
      </div>
    </div>
  );
};
