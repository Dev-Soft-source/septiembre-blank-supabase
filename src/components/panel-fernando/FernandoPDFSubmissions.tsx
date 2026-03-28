import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PDFSubmission {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  hotelData?: any;
  error?: string;
}

export default function FernandoPDFSubmissions() {
  const [submissions, setSubmissions] = useState<PDFSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  // Mock data for demonstration - in real implementation, this would come from a database table
  useEffect(() => {
    const mockSubmissions: PDFSubmission[] = [
      {
        id: '1',
        fileName: 'hotel_grand_plaza.pdf',
        uploadDate: '2025-01-19T10:30:00Z',
        status: 'pending',
      },
      {
        id: '2',
        fileName: 'beachside_resort_form.pdf',
        uploadDate: '2025-01-18T15:45:00Z',
        status: 'completed',
        hotelData: {
          name: 'Beachside Resort',
          country: 'Spain',
          city: 'Barcelona'
        }
      },
      {
        id: '3',
        fileName: 'mountain_lodge_registration.pdf',
        uploadDate: '2025-01-17T09:15:00Z',
        status: 'failed',
        error: 'Could not extract hotel name from PDF'
      }
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const convertPDFToPackages = async (submissionId: string) => {
    setProcessing(prev => ({ ...prev, [submissionId]: true }));
    
    try {
      // Update submission status to processing
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: 'processing' as const }
            : sub
        )
      );

      // Call the PDF processing edge function
      const { data, error } = await supabase.functions.invoke('process-pdf-submission', {
        body: { submissionId }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        // Update submission status to completed
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId 
              ? { 
                  ...sub, 
                  status: 'completed' as const,
                  hotelData: data.hotelData 
                }
              : sub
          )
        );
        toast.success('PDF processed and hotel data created successfully');
      } else {
        throw new Error(data.error || 'Processing failed');
      }
    } catch (error) {
      console.error('PDF processing error:', error);
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { 
                ...sub, 
                status: 'failed' as const,
                error: error instanceof Error ? error.message : 'Processing failed'
              }
            : sub
        )
      );
      toast.error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const convertAllPending = async () => {
    const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
    
    if (pendingSubmissions.length === 0) {
      toast.info('No pending submissions to process');
      return;
    }

    setIsLoading(true);
    try {
      for (const submission of pendingSubmissions) {
        await convertPDFToPackages(submission.id);
      }
      toast.success(`Processed ${pendingSubmissions.length} PDF submissions`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: PDFSubmission['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: PDFSubmission['status']) => {
    const variants = {
      pending: 'bg-orange-500/20 text-orange-300',
      processing: 'bg-blue-500/20 text-blue-300',
      completed: 'bg-green-500/20 text-green-300',
      failed: 'bg-red-500/20 text-red-300'
    };

    return (
      <Badge className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-2 capitalize">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-300">
              Manage PDF hotel registration forms received by email
            </p>
            <Button 
              onClick={convertAllPending}
              disabled={isLoading || submissions.filter(s => s.status === 'pending').length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Convert All Pending
            </Button>
          </div>

          <div className="grid gap-4">
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No PDF submissions found</p>
                <p className="text-sm">PDF forms received by email will appear here</p>
              </div>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className="border-gray-700 bg-gray-800/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-purple-400" />
                        <div>
                          <h3 className="font-medium text-white">{submission.fileName}</h3>
                          <p className="text-sm text-gray-400">
                            Uploaded: {new Date(submission.uploadDate).toLocaleString()}
                          </p>
                          {submission.hotelData && (
                            <p className="text-sm text-green-400 mt-1">
                              Hotel: {submission.hotelData.name} ({submission.hotelData.city}, {submission.hotelData.country})
                            </p>
                          )}
                          {submission.error && (
                            <p className="text-sm text-red-400 mt-1">
                              Error: {submission.error}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getStatusBadge(submission.status)}
                        
                        {submission.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => convertPDFToPackages(submission.id)}
                            disabled={processing[submission.id]}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {processing[submission.id] && (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Convert to Packages
                          </Button>
                        )}
                        
                        {submission.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => convertPDFToPackages(submission.id)}
                            disabled={processing[submission.id]}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}