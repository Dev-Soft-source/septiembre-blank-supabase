import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, MessageSquare } from 'lucide-react';

interface GroupProposal {
  id: string;
  leader_id: string;
  group_topic: string;
  proposed_hotel: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export const LeaderProposalsTab = () => {
  const [proposals, setProposals] = useState<GroupProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      // Group proposals table was removed during database cleanup
      // This feature is no longer available
      setProposals([]);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProposalStatus = async (proposalId: string, status: string) => {
    try {
      // Group proposals table was removed during database cleanup
      // This feature is no longer available
      toast.error('Group proposals feature is no longer available');
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Group Leader Proposals</h2>
        <Badge variant="secondary">{proposals.length} Total</Badge>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No group proposals submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="border rounded-lg p-6 space-y-4 bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{proposal.group_topic}</h3>
                  <p className="text-muted-foreground">
                    <strong>Proposed Hotel:</strong> {proposal.proposed_hotel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Leader ID:</strong> {proposal.leader_id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Submitted:</strong> {new Date(proposal.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge className={getStatusColor(proposal.status)}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>

              {proposal.admin_notes && (
                <div className="bg-muted p-3 rounded">
                  <p className="text-sm">
                    <strong>Admin Notes:</strong> {proposal.admin_notes}
                  </p>
                </div>
              )}

              {proposal.status === 'pending' && (
                <div className="space-y-3">
                  {selectedProposal === proposal.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add admin notes (optional)"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="min-h-20"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateProposalStatus(proposal.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => updateProposalStatus(proposal.id, 'rejected')}
                          variant="destructive"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProposal(null);
                            setAdminNotes('');
                          }}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedProposal(proposal.id)}
                      variant="outline"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Review Proposal
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};