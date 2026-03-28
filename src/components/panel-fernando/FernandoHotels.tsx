import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye, Check, X, ChevronUp, ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHotelsData } from "@/components/dashboard/admin/hooks/useHotelsData";
import { useHotelActions } from "@/components/dashboard/admin/hooks/useHotelActions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
type SortField = 'name' | 'city' | 'status' | 'price_per_month' | 'created_at';
type SortDirection = 'asc' | 'desc';
export default function FernandoHotels() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    hotels,
    loading,
    setHotels,
    fetchAllHotels
  } = useHotelsData();
  const refreshHotels = async () => {
    const result = await fetchAllHotels();
    if (result.data) {
      setHotels(result.data);
    }
  };
  const {
    handleApprove,
    handleReject,
    handleDelete
  } = useHotelActions(refreshHotels);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'delete' | null>(null);
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Column width management with localStorage persistence
  const getDefaultWidth = (column: string) => {
    switch(column) {
      case 'checkbox': return 30;
      case 'name': return 120;
      case 'location': return 100;
      case 'status': return 70;
      case 'price': return 80;
      case 'created': return 90;
      case 'actions': return 100;
      default: return 100;
    }
  };

  const getStoredWidth = (column: string) => {
    // Check version to reset localStorage if needed
    const currentVersion = "v2";
    const storedVersion = localStorage.getItem('hotels-table-version');
    
    if (storedVersion !== currentVersion) {
      // Clear all old column widths and set new version
      ['checkbox', 'name', 'location', 'status', 'price', 'created', 'actions'].forEach(col => {
        localStorage.removeItem(`admin-table-${col}-width`);
      });
      localStorage.setItem('hotels-table-version', currentVersion);
      return getDefaultWidth(column);
    }
    
    const stored = localStorage.getItem(`admin-table-${column}-width`);
    return stored ? parseInt(stored) : getDefaultWidth(column);
  };
  
  const [columnWidths, setColumnWidths] = useState({
    checkbox: getStoredWidth('checkbox'),
    name: getStoredWidth('name'),
    location: getStoredWidth('location'),
    status: getStoredWidth('status'),
    price: getStoredWidth('price'),
    created: getStoredWidth('created'),
    actions: getStoredWidth('actions'),
  });
  
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  const handleMouseDown = (column: string, e: React.MouseEvent) => {
    setIsResizing(column);
    setStartX(e.clientX);
    setStartWidth(columnWidths[column as keyof typeof columnWidths]);
    e.preventDefault();
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    
    setColumnWidths(prev => ({
      ...prev,
      [isResizing]: newWidth
    }));
    
    localStorage.setItem(`admin-table-${isResizing}-width`, newWidth.toString());
  };
  
  const handleMouseUp = () => {
    setIsResizing(null);
  };
  
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, startX, startWidth]);
  useEffect(() => {
    refreshHotels();
  }, []);
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };
  const handleSelectHotel = (hotelId: string) => {
    setSelectedHotels(prev => prev.includes(hotelId) ? prev.filter(id => id !== hotelId) : [...prev, hotelId]);
  };
  const handleSelectAll = () => {
    if (selectedHotels.length === filteredAndSortedHotels.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(filteredAndSortedHotels.map(hotel => hotel.id));
    }
  };
  const handleBulkAction = (action: 'approve' | 'delete') => {
    if (selectedHotels.length === 0) {
      toast({
        title: "No hotels selected",
        description: "Please select hotels to perform bulk actions",
        variant: "destructive"
      });
      return;
    }
    setBulkAction(action);
    setShowBulkConfirm(true);
  };
  const confirmBulkAction = async () => {
    if (!bulkAction || selectedHotels.length === 0) return;
    try {
      const promises = selectedHotels.map(hotelId => {
        if (bulkAction === 'approve') {
          return handleApprove(hotelId);
        } else {
          return handleDelete(hotelId);
        }
      });
      await Promise.all(promises);
      toast({
        title: "Bulk action completed",
        description: `${selectedHotels.length} hotels ${bulkAction === 'approve' ? 'approved' : 'deleted'} successfully`
      });
      setSelectedHotels([]);
      await refreshHotels();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${bulkAction} selected hotels`,
        variant: "destructive"
      });
    } finally {
      setShowBulkConfirm(false);
      setBulkAction(null);
    }
  };
  const filteredAndSortedHotels = hotels.filter(hotel => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = hotel.name.toLowerCase().includes(searchLower) || hotel.city.toLowerCase().includes(searchLower) || hotel.status.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || hotel.status === statusFilter;
    const createdAt = new Date(hotel.created_at);
    const matchesStart = !startDate || createdAt >= new Date(startDate);
    const matchesEnd = !endDate || createdAt <= new Date(endDate);
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  }).sort((a, b) => {
    let aValue: any;
    let bValue: any;
    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'city':
        aValue = a.city;
        bValue = b.city;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'price_per_month':
        aValue = a.price_per_month;
        bValue = b.price_per_month;
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        return 0;
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  if (loading) {
    return <div className="p-6">
        <div className="text-center">Loading hotels...</div>
      </div>;
  }
  return <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="bg-[#3c0970]">
          <CardTitle className="text-2xl font-bold text-slate-50">Hotels Management</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#5a0575]">
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search hotels..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 items-center">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/10 text-white rounded px-2 py-1">
                <option value="all">All</option>
                <option value="approved">approved</option>
                <option value="pending">pending</option>
                <option value="rejected">rejected</option>
              </select>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-[9.5rem]" />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-[9.5rem]" />
              {selectedHotels.length > 0 && <>
                <Button onClick={() => handleBulkAction('approve')} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" />
                  Approve Selected ({selectedHotels.length})
                </Button>
                <Button onClick={() => handleBulkAction('delete')} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected ({selectedHotels.length})
                </Button>
              </>}
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="max-w-3xl mx-auto bg-purple-800/30 backdrop-blur rounded-lg border border-purple-600/20">
              <table className="table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-purple-600/30">
                    <th 
                      style={{ width: `${columnWidths.checkbox}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40"
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedHotels.length === filteredAndSortedHotels.length && filteredAndSortedHotels.length > 0} 
                        onChange={handleSelectAll} 
                        className="rounded" 
                      />
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('checkbox', e)}
                      />
                    </th>
                    <th 
                      style={{ width: `${columnWidths.name}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40 cursor-pointer hover:bg-purple-700/50 select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1 truncate">
                        Name
                        {getSortIcon('name')}
                      </div>
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('name', e)}
                      />
                    </th>
                    <th 
                      style={{ width: `${columnWidths.location}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40 cursor-pointer hover:bg-purple-700/50 select-none"
                      onClick={() => handleSort('city')}
                    >
                      <div className="flex items-center gap-1 truncate">
                        Location
                        {getSortIcon('city')}
                      </div>
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('location', e)}
                      />
                    </th>
                    <th 
                      style={{ width: `${columnWidths.status}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40 cursor-pointer hover:bg-purple-700/50 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1 truncate">
                        Status
                        {getSortIcon('status')}
                      </div>
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('status', e)}
                      />
                    </th>
                    <th 
                      style={{ width: `${columnWidths.price}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40 cursor-pointer hover:bg-purple-700/50 select-none"
                      onClick={() => handleSort('price_per_month')}
                    >
                      <div className="flex items-center gap-1 truncate">
                        Price/Month
                        {getSortIcon('price_per_month')}
                      </div>
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('price', e)}
                      />
                    </th>
                    <th 
                      style={{ width: `${columnWidths.created}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40 cursor-pointer hover:bg-purple-700/50 select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-1 truncate">
                        Created
                        {getSortIcon('created_at')}
                      </div>
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('created', e)}
                      />
                    </th>
                    <th 
                      style={{ width: `${columnWidths.actions}px` }}
                      className="relative px-2 py-2 text-left text-white font-medium bg-purple-800/40"
                    >
                      <div className="truncate">Actions</div>
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-purple-400/50"
                        onMouseDown={(e) => handleMouseDown('actions', e)}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedHotels.map(hotel => (
                    <tr key={hotel.id} className="border-b border-purple-600/20 hover:bg-purple-800/20">
                      <td style={{ width: `${columnWidths.checkbox}px` }} className="px-2 py-2">
                        <input 
                          type="checkbox" 
                          checked={selectedHotels.includes(hotel.id)} 
                          onChange={() => handleSelectHotel(hotel.id)} 
                          className="rounded" 
                        />
                      </td>
                      <td style={{ width: `${columnWidths.name}px` }} className="px-2 py-2">
                        <div className="font-medium text-white overflow-wrap-break-word leading-tight max-h-10 overflow-hidden" style={{ lineHeight: '1.2' }} title={hotel.name}>
                          {hotel.name}
                        </div>
                      </td>
                      <td style={{ width: `${columnWidths.location}px` }} className="px-2 py-2">
                        <div className="text-white/80 overflow-wrap-break-word leading-tight max-h-10 overflow-hidden" style={{ lineHeight: '1.2' }} title={`${hotel.city}, ${hotel.country}`}>
                          {hotel.city}, {hotel.country}
                        </div>
                      </td>
                      <td style={{ width: `${columnWidths.status}px` }} className="px-2 py-2">
                        <Badge variant={hotel.status === 'approved' ? 'default' : hotel.status === 'pending' ? 'secondary' : 'destructive'}>
                          {hotel.status}
                        </Badge>
                      </td>
                      <td style={{ width: `${columnWidths.price}px` }} className="px-2 py-2">
                        <div className="text-white/80 truncate">{`$${Math.round((hotel.price_per_month || 0) / 5) * 5}`}</div>
                      </td>
                      <td style={{ width: `${columnWidths.created}px` }} className="px-2 py-2">
                        <div className="text-white/80 truncate">{new Date(hotel.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</div>
                      </td>
                      <td style={{ width: `${columnWidths.actions}px` }} className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/hotel/${hotel.id}`)} className="h-6 w-6 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/add-property?edit=${hotel.id}`)} className="h-6 w-6 p-0 text-purple-400 hover:text-purple-300">
                            <Edit className="w-3 h-3" />
                          </Button>
                          {hotel.status === 'pending' && (
                            <Button size="sm" variant="ghost" onClick={() => handleApprove(hotel.id)} className="h-6 w-6 p-0 text-green-400 hover:text-green-300">
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(hotel.id)} className="h-6 w-6 p-0 text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredAndSortedHotels.length === 0 && <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No hotels found matching your search.' : 'No hotels found.'}
            </div>}
        </CardContent>
      </Card>

      <AlertDialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Bulk {bulkAction === 'approve' ? 'Approval' : 'Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction} {selectedHotels.length} selected hotel{selectedHotels.length > 1 ? 's' : ''}?
              {bulkAction === 'delete' && ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkAction} className={bulkAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
              {bulkAction === 'approve' ? 'Approve' : 'Delete'} Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}