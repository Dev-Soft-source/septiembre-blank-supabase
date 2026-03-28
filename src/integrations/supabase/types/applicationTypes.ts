
export type JoinRequest = {
  id: string;
  full_name: string;
  email: string;
  tier: string;
  motivation?: string | null;
  created_at: string;
}

export type JoinUsSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  recipient_email?: string | null;
  created_at: string;
}

export type JoinUsFile = {
  id: string;
  submission_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export type NotificationLog = {
  id: string;
  submission_id: string;
  notification_type: string;
  recipient_email: string;
  status: string;
  details?: string | null;
  created_at: string;
}

export type AdvertisingRequest = {
  id: string;
  user_id?: string | null;
  contact_name: string;
  contact_email: string;
  available_months?: string[] | null;
  terms_accepted: boolean;
  created_at: string;
}

export type AdminUser = {
  id: string;
  created_at: string;
}
