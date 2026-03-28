/**
 * Backend Test Panel Component
 * Manual testing interface for backend connection
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { runBackendConnectionTests } from "@/test/backend-connection-test";

export const BackendTestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await runBackendConnectionTests();
      setTestResults(results);
    } catch (error) {
      console.error("Test execution failed:", error);
      setTestResults({ error: "Test execution failed" });
    } finally {
      setIsRunning(false);
    }
  };
  
  const getStatusBadge = (success: boolean) => (
    <Badge variant={success ? "default" : "destructive"}>
      {success ? "✅ PASS" : "❌ FAIL"}
    </Badge>
  );
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Backend Connection Test Panel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the frontend-backend adapter connection safely (read-only)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleRunTests}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? "Running Tests..." : "Run Backend Connection Tests"}
        </Button>
        
        {testResults && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {/* Basic Query Result */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Basic Hotel Query</CardTitle>
                    {getStatusBadge(testResults.basicQuery?.success)}
                  </div>
                </CardHeader>
                <CardContent>
                  {testResults.basicQuery?.success ? (
                    <div className="text-sm">
                      <p>Hotels found: {testResults.basicQuery.data?.length || 0}</p>
                      {testResults.basicQuery.data?.[0] && (
                        <p className="mt-1">
                          Sample: {testResults.basicQuery.data[0].name} ({testResults.basicQuery.data[0].location})
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">
                      Error: {testResults.basicQuery?.error?.message || "Unknown error"}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Filter Query Results */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Filter Queries</CardTitle>
                    {getStatusBadge(testResults.filterQueries?.every((r: any) => r.success))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testResults.filterQueries?.map((result: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{JSON.stringify(result.filters)}</span>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <>
                              <span>{result.count} hotels</span>
                              <Badge variant="outline" className="text-green-600">✓</Badge>
                            </>
                          ) : (
                            <Badge variant="destructive">✗</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Hotel Detail Result */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Hotel Detail Query</CardTitle>
                    {getStatusBadge(testResults.hotelDetail?.success)}
                  </div>
                </CardHeader>
                <CardContent>
                  {testResults.hotelDetail?.success ? (
                    <div className="text-sm">
                      <p>Hotel: {testResults.hotelDetail.data?.name}</p>
                      <div className="flex gap-4 mt-1">
                        <span>Activities: {testResults.hotelDetail.data?.hotel_activities?.length || 0}</span>
                        <span>Images: {testResults.hotelDetail.data?.hotel_images?.length || 0}</span>
                        <span>Rooms: {testResults.hotelDetail.data?.room_types?.length || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">
                      Error: {testResults.hotelDetail?.error?.message || "Unknown error"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};