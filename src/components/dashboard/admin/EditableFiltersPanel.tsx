
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function EditableFiltersPanel() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">{" "}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Filter Management - Deprecated</h2>
        </div>

        {/* Deprecation Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Panel Deprecated
            </CardTitle>
            <CardDescription className="text-orange-700">
              This admin panel has been deprecated. All filter management and JotForm synchronization functionality has been moved to the Fernando Admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-orange-700 text-sm">
              To manage filters and sync with JotForm, please use the official Fernando Admin panel instead.
            </p>
            <Button 
              onClick={() => navigate('/panel-admin/filters')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Go to Fernando Admin → Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
