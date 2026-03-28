
import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface HotelTableProps {
  hotels: any[];
}

export const HotelTable: React.FC<HotelTableProps> = ({ hotels }) => {
  return (
    <div className="px-8 mx-auto max-w-5xl">
      <ResizablePanelGroup direction="horizontal" className="min-h-[400px]">
        {/* Hotel Name */}
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="h-full">
            <div className="border-b border-purple-600 px-1 py-2">
              <div className="text-white font-medium text-sm">Hotel Name</div>
            </div>
            {hotels.map((hotel) => (
              <div key={`name-${hotel.id}`} className="border-b border-purple-600/30 hover:bg-purple-800/20 px-1 py-2 h-[60px] flex flex-col justify-center">
                <div className="text-white font-medium text-xs leading-tight overflow-hidden" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2',
                  maxHeight: '2.4em'
                }}>
                  {hotel.name}
                </div>
                {hotel.is_featured && (
                  <span className="text-xs bg-yellow-500 text-yellow-900 px-1 py-0.5 rounded mt-1 inline-block w-fit">
                    Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Location */}
        <ResizablePanel defaultSize={20} minSize={12}>
          <div className="h-full">
            <div className="border-b border-purple-600 px-1 py-2">
              <div className="text-white font-medium text-sm">Location</div>
            </div>
            {hotels.map((hotel) => (
              <div key={`location-${hotel.id}`} className="border-b border-purple-600/30 hover:bg-purple-800/20 px-1 py-2 h-[60px] flex items-center">
                <div className="text-white/80 text-xs leading-tight overflow-hidden" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2',
                  maxHeight: '2.4em'
                }}>
                  {hotel.city}, {hotel.country}
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Status */}
        <ResizablePanel defaultSize={15} minSize={10}>
          <div className="h-full">
            <div className="border-b border-purple-600 px-1 py-2">
              <div className="text-white font-medium text-sm">Status</div>
            </div>
            {hotels.map((hotel) => (
              <div key={`status-${hotel.id}`} className="border-b border-purple-600/30 hover:bg-purple-800/20 px-1 py-2 h-[60px] flex items-center">
                <StatusBadge status={hotel.status} />
              </div>
            ))}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Price */}
        <ResizablePanel defaultSize={15} minSize={10}>
          <div className="h-full">
            <div className="border-b border-purple-600 px-1 py-2">
              <div className="text-white font-medium text-sm">Price/Month</div>
            </div>
            {hotels.map((hotel) => (
              <div key={`price-${hotel.id}`} className="border-b border-purple-600/30 hover:bg-purple-800/20 px-1 py-2 h-[60px] flex items-center">
                <div className="text-white/80 text-xs leading-tight overflow-hidden" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2',
                  maxHeight: '2.4em'
                }}>
                  €{hotel.price_per_month || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Created */}
        <ResizablePanel defaultSize={15} minSize={10}>
          <div className="h-full">
            <div className="border-b border-purple-600 px-1 py-2">
              <div className="text-white font-medium text-sm">Created</div>
            </div>
            {hotels.map((hotel) => (
              <div key={`created-${hotel.id}`} className="border-b border-purple-600/30 hover:bg-purple-800/20 px-1 py-2 h-[60px] flex items-center">
                <div className="text-white/80 text-xs leading-tight overflow-hidden" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2',
                  maxHeight: '2.4em'
                }}>
                  {new Date(hotel.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Actions */}
        <ResizablePanel defaultSize={10} minSize={8}>
          <div className="h-full">
            <div className="border-b border-purple-600 px-1 py-2">
              <div className="text-white font-medium text-sm">Actions</div>
            </div>
            {hotels.map((hotel) => (
              <div key={`actions-${hotel.id}`} className="border-b border-purple-600/30 hover:bg-purple-800/20 px-1 py-2 h-[60px] flex items-center">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
