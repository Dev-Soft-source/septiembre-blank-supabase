
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface AdvertisingRequest {
  id: string;
  contact_name: string;
  contact_email: string;
  available_months: string[];
  terms_accepted: boolean;
  created_at: string;
}

export default function PruebaAdvertising() {
  const [requests, setRequests] = useState<AdvertisingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAdvertisingRequests();
  }, []);

  const fetchAdvertisingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('advertising_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching advertising requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch advertising requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading advertising requests...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Advertising Management</h2>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{requests.length}</div>
              <div className="text-white/80">Total Requests</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {requests.filter(r => r.terms_accepted).length}
              </div>
              <div className="text-white/80">Terms Accepted</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {new Date().getMonth() + 1}
              </div>
              <div className="text-white/80">Active Month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Requirements */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Advertising Program Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Eligibility Criteria</h4>
              <ul className="text-white/80 space-y-1 text-sm">
                <li>• Minimum 6-month availability</li>
                <li>• Active hotel status required</li>
                <li>• Completed property profile</li>
                <li>• Positive guest reviews</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Program Benefits</h4>
              <ul className="text-white/80 space-y-1 text-sm">
                <li>• Featured placement on homepage</li>
                <li>• Priority in search results</li>
                <li>• Social media promotion</li>
                <li>• Email newsletter inclusion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardContent className="p-4">
          <Input
            placeholder="Search advertising requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-purple-800/50 border-purple-600 text-white placeholder:text-white/60"
          />
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Advertising Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  <th className="text-left p-3 text-white">Contact Name</th>
                  <th className="text-left p-3 text-white">Email</th>
                  <th className="text-left p-3 text-white">Available Months</th>
                  <th className="text-left p-3 text-white">Terms</th>
                  <th className="text-left p-3 text-white">Submitted</th>
                  <th className="text-left p-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-purple-600/30 hover:bg-purple-800/20">
                    <td className="p-3 text-white font-medium">{request.contact_name}</td>
                    <td className="p-3 text-white/80">{request.contact_email}</td>
                    <td className="p-3 text-white/80">
                      {request.available_months?.length || 0} months
                    </td>
                    <td className="p-3">
                      <Badge className={request.terms_accepted ? "bg-green-500" : "bg-red-500"}>
                        {request.terms_accepted ? "Accepted" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-3 text-white/80">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
