
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  transaction_id?: string;
  user_id?: string;
  hotel_id?: string;
  booking_id?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
  hotel_name?: string;
}

export default function PruebaPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data: paymentsData, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Manually join with profiles and hotels to get additional info
      const paymentsWithInfo = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          let userInfo = {};
          let hotelInfo = {};

          if (payment.role_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', payment.role_id)
              .single();
            
            if (profile) {
              userInfo = {
                user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
              };
            }
          }

          // Hotels relation is not available in commission payments
          hotelInfo = { hotel_name: `${payment.role_type} Commission` };

          return {
            id: payment.id,
            amount: payment.total_paid,
            method: payment.payment_method,
            status: 'completed', // Commission payments are completed
            created_at: payment.created_at,
            ...userInfo,
            ...hotelInfo
          } as Payment;
        })
      );

      setPayments(paymentsWithInfo);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
      toast({
        description: "Payment deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive"
      });
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading payments...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Payments Management</h2>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Payment
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search Controls */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-purple-800/50 border-purple-600 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  <th className="text-left p-3 text-white">Transaction ID</th>
                  <th className="text-left p-3 text-white">Amount</th>
                  <th className="text-left p-3 text-white">Method</th>
                  <th className="text-left p-3 text-white">User</th>
                  <th className="text-left p-3 text-white">Hotel</th>
                  <th className="text-left p-3 text-white">Status</th>
                  <th className="text-left p-3 text-white">Date</th>
                  <th className="text-left p-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-purple-600/30 hover:bg-purple-800/20">
                    <td className="p-3 text-white font-medium">
                      {payment.transaction_id || payment.id.slice(0, 8)}
                    </td>
                    <td className="p-3 text-white/80">${payment.amount}</td>
                    <td className="p-3 text-white/80">{payment.method}</td>
                    <td className="p-3 text-white/80">
                      <div>
                        <div>{payment.user_name || 'Unknown'}</div>
                        <div className="text-xs text-white/60">{payment.user_email || ''}</div>
                      </div>
                    </td>
                    <td className="p-3 text-white/80">{payment.hotel_name || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-600 text-white' :
                        payment.status === 'pending' ? 'bg-yellow-600 text-white' :
                        payment.status === 'failed' ? 'bg-red-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-white/80">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                          onClick={() => deletePayment(payment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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
