-- Phase 3: Security Hardening - Audit logging and monitoring tables (Fixed)

-- Create security audit logs table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_code INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL,
  request_size INTEGER,
  sensitive_data_accessed BOOLEAN NOT NULL DEFAULT false,
  operation_type TEXT CHECK (operation_type IN ('read', 'write', 'delete')) NOT NULL DEFAULT 'read'
);

-- Create security alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT CHECK (alert_type IN ('repeated_failures', 'mass_requests', 'suspicious_pattern', 'admin_access')) NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate limit violations table
CREATE TABLE IF NOT EXISTS public.rate_limit_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  violation_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  last_violation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security tables
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_violations ENABLE ROW LEVEL SECURITY;

-- RLS policies for security audit logs (admin only)
CREATE POLICY "Admins can view security audit logs" ON public.security_audit_logs
  FOR SELECT USING (is_admin_simple());

CREATE POLICY "System can insert security audit logs" ON public.security_audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS policies for security alerts (admin only)
CREATE POLICY "Admins can manage security alerts" ON public.security_alerts
  FOR ALL USING (is_admin_simple());

CREATE POLICY "System can insert security alerts" ON public.security_alerts
  FOR INSERT WITH CHECK (true);

-- RLS policies for rate limit violations (admin only)
CREATE POLICY "Admins can view rate limit violations" ON public.rate_limit_violations
  FOR SELECT USING (is_admin_simple());

CREATE POLICY "System can insert rate limit violations" ON public.rate_limit_violations
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_security_audit_logs_timestamp ON public.security_audit_logs(timestamp DESC);
CREATE INDEX idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX idx_security_audit_logs_ip_address ON public.security_audit_logs(ip_address);
CREATE INDEX idx_security_audit_logs_endpoint ON public.security_audit_logs(endpoint);
CREATE INDEX idx_security_audit_logs_sensitive ON public.security_audit_logs(sensitive_data_accessed) WHERE sensitive_data_accessed = true;

CREATE INDEX idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX idx_security_alerts_type ON public.security_alerts(alert_type);
CREATE INDEX idx_security_alerts_unresolved ON public.security_alerts(resolved) WHERE resolved = false;
CREATE INDEX idx_security_alerts_created_at ON public.security_alerts(created_at DESC);

CREATE INDEX idx_rate_limit_violations_ip ON public.rate_limit_violations(ip_address);
CREATE INDEX idx_rate_limit_violations_user_id ON public.rate_limit_violations(user_id);
CREATE INDEX idx_rate_limit_violations_window ON public.rate_limit_violations(window_start DESC);

-- Function to clean old audit logs (keep last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.security_audit_logs 
  WHERE timestamp < (now() - interval '90 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log cleanup action
  INSERT INTO public.admin_logs (admin_id, action, details)
  VALUES (
    'system',
    'audit_log_cleanup',
    jsonb_build_object(
      'deleted_count', deleted_count,
      'retention_days', 90,
      'timestamp', now()
    )
  );
  
  RETURN deleted_count;
END;
$$;