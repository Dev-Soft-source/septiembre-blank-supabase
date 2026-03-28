import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Eye, Calendar, User, Shield } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: Date;
  checkpoint: string;
  action: string;
  result: 'success' | 'error' | 'warning';
  details: string;
  userId?: string;
  userRole?: string;
}

interface AuditLoggerProps {
  isVisible?: boolean;
}

export const AuditLogger = ({ isVisible = false }: AuditLoggerProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(false);

  // Initialize audit logger
  useEffect(() => {
    // Only enable in development or when explicitly requested
    const urlParams = new URLSearchParams(window.location.search);
    const enableAudit = urlParams.get('audit') === 'true' || 
                       process.env.NODE_ENV === 'development' ||
                       isVisible;
    setIsLoggingEnabled(enableAudit);

    // Load existing logs from localStorage
    const savedLogs = localStorage.getItem('auditLogs');
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        setAuditLogs(parsedLogs);
      } catch (error) {
        console.warn('Failed to load audit logs:', error);
      }
    }
  }, [isVisible]);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (auditLogs.length > 0) {
      localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
    }
  }, [auditLogs]);

  const logAuditEvent = (
    checkpoint: string,
    action: string,
    result: 'success' | 'error' | 'warning',
    details: string,
    userId?: string,
    userRole?: string
  ) => {
    if (!isLoggingEnabled) return;

    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      checkpoint,
      action,
      result,
      details,
      userId,
      userRole
    };

    setAuditLogs(prev => [...prev, newLog]);
    
    // Also log to console for development
    console.log(`[AUDIT] ${checkpoint}: ${action} - ${result}`, { details, userId, userRole });
  };

  const exportLogs = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalLogs: auditLogs.length,
      logs: auditLogs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('auditLogs');
  };

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  // Make logger functions available globally for audit purposes
  useEffect(() => {
    if (isLoggingEnabled) {
      (window as any).auditLog = logAuditEvent;
    }
    return () => {
      delete (window as any).auditLog;
    };
  }, [isLoggingEnabled]);

  if (!isLoggingEnabled) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Audit Logger
          <Badge variant="outline" className="ml-2">
            {auditLogs.length} events
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportLogs}
            disabled={auditLogs.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            disabled={auditLogs.length === 0}
          >
            Clear Logs
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <Eye className="h-4 w-4 inline mr-1" />
            Audit logging is active. All user actions and system events are being recorded for external audit purposes.
          </p>
        </div>

        <ScrollArea className="h-96">
          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No audit events recorded yet. Actions will appear here as they occur.
              </div>
            ) : (
              auditLogs
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Badge variant={getResultBadgeVariant(log.result)}>
                        {log.result}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {log.checkpoint}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.action}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {log.details}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {log.timestamp.toLocaleString()}
                        </div>
                        
                        {log.userId && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.userRole || 'User'}: {log.userId.slice(0, 8)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {auditLogs.filter(log => log.result === 'success').length}
              </div>
              <div className="text-xs text-muted-foreground">Success</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {auditLogs.filter(log => log.result === 'warning').length}
              </div>
              <div className="text-xs text-muted-foreground">Warning</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {auditLogs.filter(log => log.result === 'error').length}
              </div>
              <div className="text-xs text-muted-foreground">Error</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility function for manual audit logging
export const logAuditEvent = (
  checkpoint: string,
  action: string,
  result: 'success' | 'error' | 'warning',
  details: string,
  userId?: string,
  userRole?: string
) => {
  if ((window as any).auditLog) {
    (window as any).auditLog(checkpoint, action, result, details, userId, userRole);
  }
};