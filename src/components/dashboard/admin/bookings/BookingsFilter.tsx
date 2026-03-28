
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchHotel: string;
  setSearchHotel: (hotel: string) => void;
  searchUser: string;
  setSearchUser: (user: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
}

export const BookingsFilter: React.FC<BookingsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  searchHotel,
  setSearchHotel,
  searchUser,
  setSearchUser,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="searchTerm" className="mb-2 block text-sm font-medium">General Search</Label>
          <Input
            id="searchTerm"
            type="text"
            placeholder="Search in all fields"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex-1">
          <Label htmlFor="searchHotel" className="mb-2 block text-sm font-medium">Hotel Name</Label>
          <Input
            id="searchHotel"
            type="text"
            placeholder="Search by hotel name"
            value={searchHotel}
            onChange={(e) => setSearchHotel(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex-1">
          <Label htmlFor="searchUser" className="mb-2 block text-sm font-medium">Guest Name</Label>
          <Input
            id="searchUser"
            type="text"
            placeholder="Search by guest name"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="statusFilter" className="mb-2 block text-sm font-medium">Booking Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-1/3">
          <Label htmlFor="dateFilter" className="mb-2 block text-sm font-medium">Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dateFilter"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {dateFilter && (
          <div className="w-full sm:w-1/3 flex items-end">
            <Button 
              variant="outline" 
              onClick={() => setDateFilter(undefined)}
              className="mb-0"
            >
              Clear Date Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
